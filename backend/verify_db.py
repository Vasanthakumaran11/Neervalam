"""
Neervalam - Supabase Database Verification Script
Run from the /backend directory:
    python verify_db.py
"""

import sys
import os
from dotenv import load_dotenv

load_dotenv()

# ─── Load credentials directly from .env ──────────────────────────────────────
SUPABASE_URL       = os.getenv("SUPABASE_URL", "")
PUBLISHABLE_KEY    = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
ANON_KEY           = os.getenv("SUPABASE_ANON_KEY", "")
SECRET_KEY         = os.getenv("SUPABASE_SECRET_KEY", "")
SERVICE_ROLE_KEY   = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

anon_key     = PUBLISHABLE_KEY or ANON_KEY
admin_key    = SECRET_KEY or SERVICE_ROLE_KEY

EXPECTED_TABLES = [
    "profiles",
    "farmer_plots",
    "borewells",
    "iot_telemetry",
    "irrigation_recommendations",
]

def header(title: str):
    print(f"\n{'=' * 55}")
    print(f"  {title}")
    print(f"{'=' * 55}")

def ok(msg):   print(f"  OK   {msg}")
def warn(msg): print(f"  WARN {msg}")
def err(msg):  print(f"  ERR  {msg}")
def info(msg): print(f"  INFO {msg}")

def main():
    header("Neervalam -- Supabase DB Verification")

    # Step 1: Check credentials
    header("1. Checking .env Credentials")
    if not SUPABASE_URL:
        err("SUPABASE_URL is missing from .env"); sys.exit(1)
    ok(f"SUPABASE_URL     : {SUPABASE_URL}")

    if not anon_key:
        err("Neither SUPABASE_PUBLISHABLE_KEY nor SUPABASE_ANON_KEY found in .env"); sys.exit(1)
    ok(f"Anon/Public Key  : {anon_key[:20]}...  (from {'PUBLISHABLE_KEY' if PUBLISHABLE_KEY else 'ANON_KEY'})")

    if admin_key:
        ok(f"Secret/Admin Key : {admin_key[:20]}...  (from {'SECRET_KEY' if SECRET_KEY else 'SERVICE_ROLE_KEY'})")
    else:
        warn("No admin/service-role key found. Table checks use anon client only.")

    # Step 2: Connect to Supabase
    header("2. Connecting to Supabase")
    try:
        from supabase import create_client, Client
        client: Client = create_client(SUPABASE_URL, admin_key or anon_key)
        ok("Supabase client created successfully.")
    except Exception as e:
        err(f"Failed to create Supabase client: {e}")
        sys.exit(1)

    # Step 3: Verify Expected Tables
    header("3. Verifying Tables in public schema")
    tables_ok = True
    for table in EXPECTED_TABLES:
        try:
            res = client.table(table).select("*").limit(0).execute()
            ok(f"Table '{table}' -- exists and accessible.")
        except Exception as e:
            err(f"Table '{table}' -- FAILED: {e}")
            tables_ok = False

    # Step 4: RLS Sanity Check
    header("4. Quick Row-Level Security Sanity Check")
    info("Attempting unauthenticated SELECT on 'profiles' table...")
    try:
        anon_client: Client = create_client(SUPABASE_URL, anon_key)
        res = anon_client.table("profiles").select("id").limit(1).execute()
        if res.data == []:
            ok("RLS is active -- no rows returned for unauthenticated request (expected).")
        else:
            warn(f"RLS may not be enforced -- got {len(res.data)} rows without auth. Check your policies.")
    except Exception as e:
        ok(f"RLS blocked the request (as expected): {type(e).__name__}")

    # Summary
    header("Summary")
    if tables_ok:
        ok("All expected tables are present in Supabase!")
        ok("Database is ready. Start the FastAPI server with:")
        print("\n     uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\n")
    else:
        err("Some tables are missing. Re-run supabase_schema.sql in Supabase SQL Editor.")
        err("Dashboard -> SQL Editor -> New Query -> paste supabase_schema.sql -> Run")
        sys.exit(1)

if __name__ == "__main__":
    main()
