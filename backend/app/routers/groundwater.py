import os
import json
from pathlib import Path
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/groundwater", tags=["Government GIS & Groundwater"])

# Path to the bundled CGWB dataset in data/
DATA_PATH = Path(__file__).resolve().parent.parent.parent.parent / "data" / "groundwater_dataset.json"

_DATASET_CACHE: Dict[str, Any] = {}

def get_groundwater_data() -> Dict[str, Any]:
    global _DATASET_CACHE
    if not _DATASET_CACHE:
        if DATA_PATH.exists():
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                _DATASET_CACHE = json.load(f)
        else:
            _DATASET_CACHE = {"stateStats": {}, "districts": [], "wells": []}
    return _DATASET_CACHE

@router.get("/summary")
async def get_state_summary():
    """Returns statewide macro-level monitoring summary (CGWB 2024-25 baseline)."""
    data = get_groundwater_data()
    return data.get("stateStats", {})

@router.get("/districts")
async def get_district_analytics():
    """Returns district-level analytics and stress categories."""
    data = get_groundwater_data()
    return data.get("districts", [])

@router.get("/wells")
async def get_monitoring_wells(
    district: str = Query("ALL", description="Filter by district name"),
    limit: int = Query(100, ge=1, le=1000)
):
    """Returns filtered monitoring wells for the geospatial GIS layer."""
    data = get_groundwater_data()
    wells = data.get("wells", [])
    if district != "ALL":
        wells = [w for w in wells if w.get("district", "").upper() == district.upper()]
    return wells[:limit]
