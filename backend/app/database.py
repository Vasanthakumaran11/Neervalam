import logging
from typing import Optional
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("neervalam.database")

supabase: Optional[Client] = None
supabase_admin: Optional[Client] = None

def init_supabase():
    global supabase, supabase_admin
    anon_key = settings.anon_key
    admin_key = settings.service_role_key

    if settings.SUPABASE_URL and anon_key:
        try:
            supabase = create_client(settings.SUPABASE_URL, anon_key)
            logger.info(f"✅ Connected to Supabase (anon): {settings.SUPABASE_URL}")

            if admin_key:
                supabase_admin = create_client(settings.SUPABASE_URL, admin_key)
                logger.info("✅ Connected to Supabase Admin (service role).")
            else:
                logger.warning("⚠️  No service-role/secret key found. Admin operations will use anon client.")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Supabase client: {e}")
            supabase = None
            supabase_admin = None
    else:
        logger.warning("⚠️  Supabase credentials not configured in .env. Running in offline/dev mode.")

def get_db() -> Optional[Client]:
    """Returns the standard anon Supabase client."""
    return supabase

def get_admin_db() -> Optional[Client]:
    """Returns the privileged admin service role client."""
    return supabase_admin or supabase

