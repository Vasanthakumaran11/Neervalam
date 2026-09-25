"""
FastAPI Router for AI Prediction & Alert Endpoints
Provides endpoints for Farmer Well Forecasting, Government Drought Simulation, and CGWB Interventions.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import json

from app.services.farmer_prediction_service import predict_farmer_well, CROP_FACTORS
from app.services.government_drought_service import evaluate_block_drought, ERODE_BLOCKS

router = APIRouter(prefix="/api/ai", tags=["AI Alerts & Predictions"])

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS = os.path.join(ROOT_DIR, "app", "ai", "saved_models")


# Request Schemas
class FarmerForecastRequest(BaseModel):
    well_id: Optional[str] = Field(default="NVW001", description="Registered well ID")
    current_depth_mbgl: float = Field(default=14.5, ge=1.0, le=120.0, description="Current depth to water in meters")
    pump_depth_mbgl: float = Field(default=24.0, ge=5.0, le=150.0, description="Depth of pump intake in meters")
    crop_name: str = Field(default="Turmeric", description="Cultivated crop name")
    irrigation_type: str = Field(default="Flood", description="Irrigation method: Flood or Drip")
    rainfall_scenario: str = Field(default="Normal", description="Normal, Dry (-40%), or No Rain (0mm)")


class DroughtScenarioRequest(BaseModel):
    block_name: str = Field(default="Bhavanisagar", description="Erode block name")
    rainfall_deficit_pct: float = Field(default=45.0, ge=0.0, le=100.0, description="Rainfall deficit percentage (0 to 100)")
    temperature_anomaly_c: float = Field(default=2.5, ge=-2.0, le=6.0, description="Temperature anomaly in degrees Celsius")
    current_avg_depth_mbgl: float = Field(default=18.5, ge=2.0, le=90.0, description="Block average groundwater depth")


@router.post("/forecast/well")
def get_farmer_well_forecast(req: FarmerForecastRequest):
    """
    Computes 30/60/90-day water level forecast, assesses pump dry-run risk, and provides irrigation optimization advice.
    """
    try:
        res = predict_farmer_well(
            well_id=req.well_id,
            current_depth_mbgl=req.current_depth_mbgl,
            pump_depth_mbgl=req.pump_depth_mbgl,
            crop_name=req.crop_name,
            irrigation_type=req.irrigation_type,
            rainfall_scenario=req.rainfall_scenario
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/drought/evaluate")
def evaluate_drought_scenario(req: DroughtScenarioRequest):
    """
    Simulates regional drought severity across Erode blocks, providing dual-rule alert status and matching CGWB check dams.
    """
    try:
        res = evaluate_block_drought(
            block_name=req.block_name,
            rainfall_deficit_pct=req.rainfall_deficit_pct,
            temperature_anomaly_c=req.temperature_anomaly_c,
            current_avg_depth_mbgl=req.current_avg_depth_mbgl
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/options")
def get_simulation_options():
    """
    Returns available blocks, crops, irrigation methods, and scenarios for interactive dashboard controls.
    """
    return {
        "blocks": ERODE_BLOCKS,
        "crops": list(CROP_FACTORS.keys()),
        "irrigation_methods": ["Flood", "Drip"],
        "rainfall_scenarios": ["Normal", "Dry (-40%)", "No Rain (0mm)"]
    }


@router.get("/model-metrics")
def get_model_metrics():
    """
    Returns the evaluation metrics from the trained models and benchmarks vs persistence.
    """
    metrics_file = os.path.join(SAVED_MODELS, "model_metadata.json")
    drought_file = os.path.join(SAVED_MODELS, "drought_model_metadata.json")

    reg_metrics = {}
    drought_metrics = {}

    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            reg_metrics = json.load(f)

    if os.path.exists(drought_file):
        with open(drought_file, "r") as f:
            drought_metrics = json.load(f)

    return {
        "water_level_regression": reg_metrics,
        "drought_classification": drought_metrics
    }
