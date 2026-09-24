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
# Key: normalized_phone  →  (otp_code, expires_at, role, auth_mode, full_name, district, job_title, iot_hub_id)
_DEV_OTP_STORE: Dict[str, tuple] = {}

# In-Memory "registered users" store for dev mode (phone → profile dict)
# In production this is the Supabase `profiles` table
_DEV_USER_STORE: Dict[str, dict] = {}


# ─── Helpers ──────────────────────────────────────────────────────────────────

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

def make_user_id(phone: str) -> str:
    return f"usr-{hashlib.md5(phone.encode()).hexdigest()[:12]}"

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

def _user_exists_in_supabase(phone: str, admin_db) -> Optional[dict]:
    """Returns user dict if phone is registered in Supabase, else None."""
    try:
        res = admin_db.table("profiles").select("*").eq("phone", phone).limit(1).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        logger.warning(f"Supabase user lookup failed: {e}")
    return None


# ==============================================================================
# Endpoint 0: Check if phone is already registered
# ==============================================================================
@router.post("/check-user", response_model=CheckUserResponse)
async def check_user_exists(req: CheckUserRequest):
    """
    Checks if a phone number is already registered.
    Frontend uses this to decide whether to show Login or Signup UI.
    """
    phone = normalize_phone(req.phone)
    admin_db = get_admin_db()

    # 1. Check Supabase profiles table
    if admin_db:
        user = _user_exists_in_supabase(phone, admin_db)
        if user:
            return CheckUserResponse(
                exists=True,
                phone=phone,
                role=UserRole(user.get("role", "farmer")),
                full_name=user.get("full_name"),
            )

    # 2. Check in-memory dev store
    if phone in _DEV_USER_STORE:
        u = _DEV_USER_STORE[phone]
        return CheckUserResponse(
            exists=True,
            phone=phone,
            role=UserRole(u.get("role", "farmer")),
            full_name=u.get("full_name"),
        )

    return CheckUserResponse(exists=False, phone=phone)


# ==============================================================================
# Endpoint 1: Send OTP  (works for both Login & Signup)
# ==============================================================================
@router.post("/send-otp", response_model=SendOTPResponse)
async def send_mobile_otp(req: SendOTPRequest):
    """
    Sends OTP to the given phone.
    • signup mode: validates that name & district are provided; rejects if phone already registered.
    • login  mode: rejects if phone is NOT registered yet (must sign up first).
    """
    phone = normalize_phone(req.phone)
    if len(phone) < 12:
        raise HTTPException(
            status_code=400,
            detail="Invalid mobile number. Please provide a valid 10-digit Indian mobile number.",
        )

    admin_db = get_admin_db()
    existing_user = _user_exists_in_supabase(phone, admin_db) if admin_db else _DEV_USER_STORE.get(phone)
    is_registered = existing_user is not None or phone in _DEV_USER_STORE

    # ── Mode validation ────────────────────────────────────────────────────────
    if req.auth_mode == AuthMode.SIGNUP:
        if is_registered:
            raise HTTPException(
                status_code=409,
                detail="This mobile number is already registered. Please use Login instead.",
            )
        if not req.full_name or not req.full_name.strip():
            raise HTTPException(status_code=422, detail="Full name is required for signup.")
        if not req.district or not req.district.strip():
            raise HTTPException(status_code=422, detail="District is required for signup.")
        if req.role == UserRole.FARMER and (not req.iot_hub_id or not req.iot_hub_id.strip()):
            raise HTTPException(status_code=422, detail="Farmer signup requires the installed IoT device ID for the well.")
        if req.role == UserRole.GOVERNMENT_OFFICIAL and (not req.job_title or not req.job_title.strip()):
            raise HTTPException(status_code=422, detail="Government signup requires a job title.")

    elif req.auth_mode == AuthMode.LOGIN:
        if not is_registered:
            raise HTTPException(
                status_code=404,
                detail="Mobile number not found. Please sign up first.",
            )

    # ── Dispatch OTP ───────────────────────────────────────────────────────────
    db = get_db()
    if settings.OTP_MODE == "supabase" and db is not None:
        try:
            db.auth.sign_in_with_otp({"phone": phone})
            logger.info(f"OTP dispatched via Supabase for {phone} [{req.auth_mode}]")
            return SendOTPResponse(
                success=True,
                message=f"OTP sent to {phone[-4:].rjust(len(phone), '*')}",
                phone=phone,
                is_new_user=(req.auth_mode == AuthMode.SIGNUP),
            )
        except Exception as e:
            logger.error(f"Supabase OTP dispatch failed: {e}. Falling back to mock mode.")

    # ── Mock / Dev OTP ─────────────────────────────────────────────────────────
    otp_code = "123456"
    expiry = time.time() + 300
    _DEV_OTP_STORE[phone] = (
        otp_code, expiry, req.role, req.auth_mode,
        req.full_name, req.district, req.job_title, req.iot_hub_id,
    )
    logger.info(f"[DEV OTP] {phone} ({req.auth_mode.value}) → {otp_code}")

    return SendOTPResponse(
        success=True,
        message=f"OTP sent to {phone}. Use {otp_code} to verify (dev mode).",
        phone=phone,
        expires_in_seconds=300,
        dev_otp=otp_code,
        is_new_user=(req.auth_mode == AuthMode.SIGNUP),
    )


# ==============================================================================
# Endpoint 2: Verify OTP → Issue JWT session
# ==============================================================================
@router.post("/verify-otp", response_model=AuthTokenResponse)
async def verify_mobile_otp(req: VerifyOTPRequest):
    """
    Verifies the OTP and either:
    - LOGIN  → authenticates existing user, returns token.
    - SIGNUP → creates profile in Supabase, then returns token.
    """
    phone = normalize_phone(req.phone)
    admin_db = get_admin_db()
    user_id = None
    is_new_user = req.auth_mode == AuthMode.SIGNUP

    # ── Production Supabase verify ─────────────────────────────────────────────
    db = get_db()
    if settings.OTP_MODE == "supabase" and db is not None:
        try:
            auth_res = db.auth.verify_otp({"phone": phone, "token": req.otp.strip(), "type": "sms"})
            if auth_res and auth_res.user:
                user_id = str(auth_res.user.id)
        except Exception as e:
            logger.warning(f"Supabase OTP verify failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

    # ── Dev / Mock verify ──────────────────────────────────────────────────────
    if not user_id:
        record = _DEV_OTP_STORE.get(phone)
        otp_valid = (
            (record and record[0] == req.otp.strip() and time.time() <= record[1])
            or req.otp.strip() == "123456"
        )
        if not otp_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP. Please try again.")
        user_id = make_user_id(phone)
        _DEV_OTP_STORE.pop(phone, None)

    # ── Determine name & district ──────────────────────────────────────────────
    display_name = req.full_name
    district = req.district or "Thanjavur"
    job_title = req.job_title
    iot_hub_id = req.iot_hub_id

    # For LOGIN: fetch existing profile name if not provided
    if req.auth_mode == AuthMode.LOGIN and not display_name:
        if admin_db:
            existing = _user_exists_in_supabase(phone, admin_db)
            if existing:
                display_name = existing.get("full_name", "")
                district = existing.get("district", district)
                job_title = existing.get("job_title", job_title)
                iot_hub_id = existing.get("iot_hub_id", iot_hub_id)
                req.role = UserRole(existing.get("role", req.role.value))
        elif phone in _DEV_USER_STORE:
            u = _DEV_USER_STORE[phone]
            display_name = u.get("full_name", "")
            district = u.get("district", district)
            job_title = u.get("job_title", job_title)
            iot_hub_id = u.get("iot_hub_id", iot_hub_id)

    display_name = display_name or (
        "Farmer " + phone[-4:] if req.role == UserRole.FARMER else "Official " + phone[-4:]
    )

    # ── Upsert profile in Supabase / in-memory store ───────────────────────────
    profile_data = {
        "id": user_id,
        "phone": phone,
        "full_name": display_name,
        "role": req.role.value,
        "district": district,
        "job_title": job_title,
        "iot_hub_id": iot_hub_id,
        "is_active": True,
    }

    if admin_db:
        try:
            admin_db.table("profiles").upsert(profile_data).execute()
            logger.info(f"Profile upserted for {phone} [{req.auth_mode.value}]")
        except Exception as e:
            logger.warning(f"Supabase profile upsert failed: {e}")
    else:
        _DEV_USER_STORE[phone] = profile_data

    # ── Issue JWT ──────────────────────────────────────────────────────────────
    token_claims = {
        "sub": user_id,
        "phone": phone,
        "role": req.role.value,
        "name": display_name,
        "district": district,
        "job_title": job_title,
        "iot_hub_id": iot_hub_id,
    }
    jwt_token = create_access_token(token_claims)

    redirect_path = "/government" if req.role == UserRole.GOVERNMENT_OFFICIAL else f"/users/{user_id}"

    return AuthTokenResponse(
        access_token=jwt_token,
        token_type="bearer",
        user=UserProfile(
            id=user_id, phone=phone, full_name=display_name,
            role=req.role, district=district,
            job_title=job_title, iot_hub_id=iot_hub_id, is_active=True,
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
        phone=token_data.get("phone", ""),
        full_name=token_data.get("name", ""),
        role=UserRole(token_data.get("role", "farmer")),
        district=token_data.get("district", "Thanjavur"),
        job_title=token_data.get("job_title"),
        iot_hub_id=token_data.get("iot_hub_id"),
        is_active=True,
    )
