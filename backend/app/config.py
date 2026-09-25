import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Neervalam API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # --- Supabase Credentials ---
    # Supports both naming conventions:
    #   SUPABASE_ANON_KEY        (standard)
    #   SUPABASE_PUBLISHABLE_KEY (Supabase new dashboard naming)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""         # fallback: used if PUBLISHABLE_KEY not set
    SUPABASE_PUBLISHABLE_KEY: str = ""  # takes priority as the anon/public key
    SUPABASE_SERVICE_ROLE_KEY: str = "" # fallback: used if SECRET_KEY not set
    SUPABASE_SECRET_KEY: str = ""       # takes priority as the service role key
    SUPABASE_JWKS_URL: str = ""         # JWKS endpoint for JWT verification

    @property
    def anon_key(self) -> str:
        """Returns PUBLISHABLE_KEY if set, else falls back to ANON_KEY."""
        return self.SUPABASE_PUBLISHABLE_KEY or self.SUPABASE_ANON_KEY

    @property
    def service_role_key(self) -> str:
        """Returns SECRET_KEY if set, else falls back to SERVICE_ROLE_KEY."""
        return self.SUPABASE_SECRET_KEY or self.SUPABASE_SERVICE_ROLE_KEY

    # JWT Settings
    JWT_SECRET: str = "neervalam-super-secret-local-jwt-key-2025"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # OTP Authentication Mode: 'smtp', 'supabase', or 'mock_dev'
    OTP_MODE: str = "smtp"
    DEFAULT_DEV_OTP: str = ""  # If empty, real random 6-digit OTP is enforced

    # Real Email / SMTP Settings
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Neervalam Water Portal"
    SMTP_USE_TLS: bool = True

    # CORS origins - stored as a comma-separated string in .env
    CORS_ORIGINS_STR: str = "http://localhost:3000,http://localhost:5173,http://localhost:3001,http://127.0.0.1:3000"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",") if origin.strip()]

    class Config:
        _backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        env_file = (
            os.path.join(_backend_dir, ".env"),
            ".env",
        )
        extra = "allow"

settings = Settings()
