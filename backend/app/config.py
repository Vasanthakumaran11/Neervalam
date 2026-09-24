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

    # OTP Authentication Mode: 'supabase' or 'mock_dev'
    OTP_MODE: str = "mock_dev"
    DEFAULT_DEV_OTP: str = "123456"

    # CORS origins - stored as a comma-separated string in .env
    CORS_ORIGINS_STR: str = "http://localhost:3000,http://localhost:5173,http://localhost:3001,http://127.0.0.1:3000"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
