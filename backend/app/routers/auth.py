import time
import hashlib
import logging
import random
import jwt
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings
from app.database import get_db, get_admin_db
from app.services.email_service import generate_secure_otp, send_real_email_otp
from app.models.schemas import (
    AuthMode,
    CheckUserRequest,
    CheckUserResponse,
    SendOTPRequest,
    SendOTPResponse,
    VerifyOTPRequest,
    AuthTokenResponse,
    UserProfile,
    UserRole,
)

logger = logging.getLogger("neervalam.auth")
router = APIRouter(prefix="/auth", tags=["Authentication & OTP"])
security = HTTPBearer(auto_error=False)

# In-Memory OTP Store (dev / mock mode)
# In-Memory OTP Store (dev / mock mode)
# Key: normalized_identifier  →  (otp_code, expires_at, role, auth_mode, full_name, district, job_title, iot_hub_id)
_DEV_OTP_STORE: Dict[str, tuple] = {}

# In-Memory "registered users" store for dev mode (identifier → profile dict)
_DEV_USER_STORE: Dict[str, dict] = {}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def is_valid_email(email: str) -> bool:
    import re
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email.strip()))

def normalize_phone(phone: str) -> str:
    """Normalizes Indian phone numbers to E.164 format (+91XXXXXXXXXX)"""
    digits = "".join(filter(str.isdigit, phone))
    if len(digits) == 10:
        return f"+91{digits}"
    elif len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    elif phone.startswith("+"):
        return f"+{digits}"
    return f"+91{digits[-10:]}" if len(digits) >= 10 else f"+{digits}"

def normalize_identifier(email: Optional[str] = None, phone: Optional[str] = None) -> tuple[str, bool]:
    """
    Returns (normalized_key, is_email).
    Prioritizes email if provided or if string contains '@'.
    """
    if email and email.strip():
        clean_email = email.strip().lower()
        if not is_valid_email(clean_email):
            raise HTTPException(status_code=400, detail="Invalid email format. Please provide a valid email address.")
        return clean_email, True
    if phone and "@" in phone:
        clean_email = phone.strip().lower()
        if not is_valid_email(clean_email):
            raise HTTPException(status_code=400, detail="Invalid email format. Please provide a valid email address.")
        return clean_email, True
    if phone and phone.strip():
        return normalize_phone(phone), False
    raise HTTPException(status_code=400, detail="Please provide a valid email address for OTP verification.")

def make_user_id(identifier: str) -> str:
    return f"usr-{hashlib.md5(identifier.encode()).hexdigest()[:12]}"

def _dispatch_email_otp(email: str, otp_code: str, role: str, auth_mode: str) -> None:
    """Dispatches OTP to recipient email. Logs clearly in dev mode."""
    logger.info(f"📧 [NEERVALAM EMAIL OTP] -> Sent verification code [{otp_code}] to {email} ({auth_mode})")
    print(f"\n=========================================================\n"
          f"📧 [NEERVALAM EMAIL OTP VERIFICATION DISPATCH]\n"
          f"Recipient : {email}\n"
          f"Role      : {role.upper()}\n"
          f"Mode      : {auth_mode.upper()}\n"
          f"OTP Code  : {otp_code}\n"
          f"Expires In: 5 Minutes (300 seconds)\n"
          f"=========================================================\n")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def decode_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")
    try:
        payload = jwt.decode(
            credentials.credentials, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials token")

def _user_exists_in_supabase(identifier: str, admin_db) -> Optional[dict]:
    """Returns user dict if email or phone is registered in Supabase, else None."""
    try:
        if "@" in identifier:
            res = admin_db.table("profiles").select("*").eq("email", identifier).limit(1).execute()
        else:
            res = admin_db.table("profiles").select("*").eq("phone", identifier).limit(1).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        logger.warning(f"Supabase user lookup failed: {e}")
    return None


# ==============================================================================
# Endpoint 0: Check if email or phone is already registered
# ==============================================================================
@router.post("/check-user", response_model=CheckUserResponse)
async def check_user_exists(req: CheckUserRequest):
    """
    Checks if an email or phone number is already registered.
    Frontend uses this to decide whether to show Login or Signup UI.
    """
    identifier, is_email = normalize_identifier(req.email, req.phone)
    admin_db = get_admin_db()

    # 1. Check in-memory dev store (instant & reliable)
    if identifier in _DEV_USER_STORE:
        u = _DEV_USER_STORE[identifier]
        return CheckUserResponse(
            exists=True,
            email=identifier if is_email else u.get("email"),
            phone=None if is_email else identifier,
            role=UserRole(u.get("role", "farmer")),
            full_name=u.get("full_name"),
        )

    # 2. Check Supabase profiles table
    if admin_db:
        user = _user_exists_in_supabase(identifier, admin_db)
        if user:
            return CheckUserResponse(
                exists=True,
                email=identifier if is_email else user.get("email"),
                phone=None if is_email else identifier,
                role=UserRole(user.get("role", "farmer")),
                full_name=user.get("full_name"),
            )

    return CheckUserResponse(
        exists=False,
        email=identifier if is_email else None,
        phone=identifier if not is_email else None
    )


# ==============================================================================
# Endpoint 1: Send OTP  (supports Email and SMS)
# ==============================================================================
@router.post("/send-otp", response_model=SendOTPResponse)
async def send_mobile_otp(req: SendOTPRequest):
    """
    Sends OTP to the given email address (or phone number fallback).
    • signup mode: validates that name & district are provided; rejects if email already registered.
    • login  mode: rejects if email is NOT registered yet (must sign up first).
    """
    identifier, is_email = normalize_identifier(req.email, req.phone)

    admin_db = get_admin_db()
    existing_user = _user_exists_in_supabase(identifier, admin_db) if admin_db else _DEV_USER_STORE.get(identifier)
    is_registered = existing_user is not None or identifier in _DEV_USER_STORE

    # ── Mode validation ────────────────────────────────────────────────────────
    if req.auth_mode == AuthMode.SIGNUP:
        if is_registered:
            target_type = "email address" if is_email else "mobile number"
            raise HTTPException(
                status_code=409,
                detail=f"This {target_type} ({identifier}) is already registered. Please sign in instead.",
            )
        if not req.full_name or not req.full_name.strip():
            raise HTTPException(status_code=422, detail="Full name is required for signup.")
        if not req.district or not req.district.strip():
            raise HTTPException(status_code=422, detail="District is required for signup.")
        if req.role == UserRole.FARMER and (not req.iot_hub_id or not req.iot_hub_id.strip()):
            req.iot_hub_id = f"IOT-ERD-{random.randint(101, 199)}"
        if req.role == UserRole.GOVERNMENT_OFFICIAL and (not req.job_title or not req.job_title.strip()):
            raise HTTPException(status_code=422, detail="Government signup requires a job title.")

    elif req.auth_mode == AuthMode.LOGIN:
        if not is_registered:
            target_type = "email address" if is_email else "mobile number"
            raise HTTPException(
                status_code=404,
                detail=f"{target_type.capitalize()} ({identifier}) not found. Please create an account first.",
            )

    # ── Dispatch Real Email OTP ────────────────────────────────────────────────
    otp_code = generate_secure_otp()
    expiry = time.time() + 300  # 5 minutes validity
    _DEV_OTP_STORE[identifier] = (
        otp_code, expiry, req.role, req.auth_mode,
        req.full_name, req.district, req.job_title, req.iot_hub_id,
    )

    if is_email:
        dispatch_result = send_real_email_otp(identifier, otp_code, req.role.value, req.auth_mode.value)
        masked_email = identifier[:3] + "•••@" + identifier.split("@")[-1] if "@" in identifier else identifier
        return SendOTPResponse(
            success=True,
            message=f"6-digit verification code sent to {masked_email}. Please check your email inbox.",
            email=identifier,
            phone=None,
            expires_in_seconds=300,
            dev_otp=None,  # Real OTP mode: user must check their email
            is_new_user=(req.auth_mode == AuthMode.SIGNUP),
        )
    else:
        logger.info(f"[PHONE OTP] {identifier} ({req.auth_mode.value}) → {otp_code}")
        return SendOTPResponse(
            success=True,
            message=f"Verification code sent to {identifier}.",
            email=None,
            phone=identifier,
            expires_in_seconds=300,
            dev_otp=None,
            is_new_user=(req.auth_mode == AuthMode.SIGNUP),
        )


# ==============================================================================
# Endpoint 2: Verify OTP → Issue JWT session
# ==============================================================================
@router.post("/verify-otp", response_model=AuthTokenResponse)
async def verify_mobile_otp(req: VerifyOTPRequest):
    """
    Verifies the email OTP and either:
    - LOGIN  → authenticates existing user, returns token.
    - SIGNUP → creates profile in Supabase/dev store, then returns token.
    """
    identifier, is_email = normalize_identifier(req.email, req.phone)
    admin_db = get_admin_db()
    user_id = None
    is_new_user = req.auth_mode == AuthMode.SIGNUP

    # ── Strict Real OTP Verification ──────────────────────────────────────────
    record = _DEV_OTP_STORE.get(identifier)
    if not record:
        raise HTTPException(
            status_code=400,
            detail="No active verification code found for this email. Please request a new OTP.",
        )
    
    stored_otp, expiry = record[0], record[1]
    if time.time() > expiry:
        _DEV_OTP_STORE.pop(identifier, None)
        raise HTTPException(
            status_code=400,
            detail="The verification code has expired (valid for 5 minutes). Please request a new code.",
        )

    entered_otp = req.otp.strip()
    if entered_otp != stored_otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code. Please enter the exact 6-digit code sent to your email.",
        )
    
    user_id = make_user_id(identifier)
    _DEV_OTP_STORE.pop(identifier, None)

    # ── Determine name & district ──────────────────────────────────────────────
    display_name = req.full_name
    district = req.district or "Erode"
    job_title = req.job_title
    iot_hub_id = req.iot_hub_id
    if req.role == UserRole.FARMER and not iot_hub_id:
        iot_hub_id = f"IOT-ERD-{random.randint(101, 199)}"

    # For LOGIN: fetch existing profile name if not provided
    if req.auth_mode == AuthMode.LOGIN and not display_name:
        if admin_db:
            existing = _user_exists_in_supabase(identifier, admin_db)
            if existing:
                display_name = existing.get("full_name", "")
                district = existing.get("district", district)
                job_title = existing.get("job_title", job_title)
                iot_hub_id = existing.get("iot_hub_id", iot_hub_id)
                req.role = UserRole(existing.get("role", req.role.value))
        elif identifier in _DEV_USER_STORE:
            u = _DEV_USER_STORE[identifier]
            display_name = u.get("full_name", "")
            district = u.get("district", district)
            job_title = u.get("job_title", job_title)
            iot_hub_id = u.get("iot_hub_id", iot_hub_id)

    display_name = display_name or (
        (identifier.split("@")[0].capitalize() if is_email else "Farmer " + identifier[-4:])
        if req.role == UserRole.FARMER else "Official"
    )

    # ── Upsert profile in Supabase / in-memory store ───────────────────────────
    profile_data = {
        "id": user_id,
        "email": identifier if is_email else None,
        "phone": identifier if not is_email else None,
        "full_name": display_name,
        "role": req.role.value,
        "district": district,
        "job_title": job_title,
        "iot_hub_id": iot_hub_id,
        "is_active": True,
    }

    # Always cache to dev user store
    _DEV_USER_STORE[identifier] = profile_data

    if admin_db:
        try:
            admin_db.table("profiles").upsert(profile_data).execute()
            logger.info(f"Profile upserted for {identifier} [{req.auth_mode.value}]")
        except Exception as e:
            logger.warning(f"Supabase profile upsert failed: {e}")

    # ── Issue JWT ──────────────────────────────────────────────────────────────
    token_claims = {
        "sub": user_id,
        "email": identifier if is_email else None,
        "phone": identifier if not is_email else None,
        "role": req.role.value,
        "name": display_name,
        "district": district,
        "job_title": job_title,
        "iot_hub_id": iot_hub_id,
    }
    jwt_token = create_access_token(token_claims)

    redirect_path = "/government" if req.role == UserRole.GOVERNMENT_OFFICIAL else f"/users/{iot_hub_id or user_id}"

    return AuthTokenResponse(
        access_token=jwt_token,
        token_type="bearer",
        user=UserProfile(
            id=user_id,
            email=identifier if is_email else None,
            phone=identifier if not is_email else None,
            full_name=display_name,
            role=req.role,
            district=district,
            job_title=job_title,
            iot_hub_id=iot_hub_id,
            is_active=True,
        ),
        redirect_path=redirect_path,
        is_new_user=is_new_user,
    )


# ==============================================================================
# Endpoint 3: Get Current Authenticated User
# ==============================================================================
@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(token_data: Dict[str, Any] = Depends(decode_token)):
    """Returns profile of the currently authenticated user from JWT."""
    return UserProfile(
        id=token_data.get("sub", "unknown"),
        email=token_data.get("email"),
        phone=token_data.get("phone"),
        full_name=token_data.get("name", ""),
        role=UserRole(token_data.get("role", "farmer")),
        district=token_data.get("district", "Erode"),
        job_title=token_data.get("job_title"),
        iot_hub_id=token_data.get("iot_hub_id"),
        is_active=True,
    )
