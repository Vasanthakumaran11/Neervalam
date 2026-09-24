from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class UserRole(str, Enum):
    FARMER = "farmer"
    GOVERNMENT_OFFICIAL = "government_official"

class AuthMode(str, Enum):
    LOGIN  = "login"   # Existing user — just phone + OTP
    SIGNUP = "signup"  # New user — name, phone, district, role + OTP

# ─── OTP Request / Response ───────────────────────────────────────────────────

class SendOTPRequest(BaseModel):
    phone: str = Field(..., description="E.164 phone number, e.g. +919876543210 or 10-digit Indian mobile")
    role: UserRole = Field(default=UserRole.FARMER, description="Role intended for login/signup")
    auth_mode: AuthMode = Field(default=AuthMode.LOGIN, description="'login' or 'signup'")
    # Signup-only fields (required when auth_mode='signup')
    full_name: Optional[str] = Field(None, description="Full name (required for signup)")
    district:  Optional[str] = Field(None, description="District (required for signup)")

class SendOTPResponse(BaseModel):
    success: bool
    message: str
    phone: str
    expires_in_seconds: int = 300
    dev_otp: Optional[str] = None   # Only in mock_dev mode
    is_new_user: Optional[bool] = None  # True = signup, False = returning user

class CheckUserRequest(BaseModel):
    phone: str

class CheckUserResponse(BaseModel):
    exists: bool
    phone: str
    role: Optional[UserRole] = None
    full_name: Optional[str] = None

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str = Field(..., min_length=4, max_length=6, description="Received 4-6 digit numeric OTP")
    role: UserRole = Field(default=UserRole.FARMER)
    auth_mode: AuthMode = Field(default=AuthMode.LOGIN)
    # Signup carry-over fields
    full_name: Optional[str] = None
    district:  Optional[str] = "Thanjavur"

class UserProfile(BaseModel):
    id: str
    phone: str
    full_name: Optional[str] = None
    role: UserRole
    district: Optional[str] = None
    is_active: bool = True

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
    redirect_path: str          # '/users/{userId}' or '/government'
    is_new_user: bool = False   # True on first signup

# ==============================================================================
# Farmer Telemetry & Advisory Models
# ==============================================================================

class PumpToggleRequest(BaseModel):
    state: str = Field(..., pattern="^(ON|OFF)$")

class SoilTelemetry(BaseModel):
    rootZoneMoisture15cm: float
    subZoneMoisture30cm: float
    optimalRange: str = "60% – 75%"
    soilTempCelsius: float
    electricalConductivity: str
    landStatus: str

class WellTelemetry(BaseModel):
    type: str
    totalDepthMeters: float
    pumpRating: str
    flowMeterGpm: float
    currentDepthBgl: float
    yesterdayDepthBgl: float
    delta24h: str
    status: str
    statusColor: str
    pumpState: str

class IrrigationAdvisory(BaseModel):
    cropWaterNeedLiters: int
    optimalWindow: str
    advisoryText: str
    rainProbabilityPercent: int
    rainAmountMm: float
    status: str

class FarmerFullResponse(BaseModel):
    id: str
    name: str
    tamilName: Optional[str]
    location: str
    landSizeAcres: float
    cropType: str
    soilType: str
    iotHubId: str
    sensorStatus: str
    wellDetails: WellTelemetry
    soilTelemetry: SoilTelemetry
    irrigationRecommendation: IrrigationAdvisory
    weatherForecast: Dict[str, Any]
