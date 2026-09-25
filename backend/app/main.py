import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_supabase
from app.routers import auth, users, groundwater, ai_alerts

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("neervalam")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Neervalam FastAPI server...")
    init_supabase()
    yield
    logger.info("Shutting down Neervalam FastAPI server...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Neervalam Smart Groundwater Monitoring & Irrigation Advisory Backend (Supabase + FastAPI)",
    lifespan=lifespan
)

# Enable CORS for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(groundwater.router, prefix=settings.API_V1_STR)
app.include_router(ai_alerts.router)

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "otp_mode": settings.OTP_MODE
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Neervalam API - Water Today, Harvest Tomorrow.",
        "docs_url": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
