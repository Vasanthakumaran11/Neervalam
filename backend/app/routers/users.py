import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import FarmerFullResponse, PumpToggleRequest
from app.routers.auth import decode_token

logger = logging.getLogger("neervalam.users")
router = APIRouter(prefix="/users", tags=["Farmer IoT & Advisory"])

# Mock Farmer Datasets (corresponds to frontend/src/data/farmerUserData.js)
MOCK_FARMERS: Dict[str, Dict[str, Any]] = {
    "selvam-thanjavur": {
        "id": "selvam-thanjavur",
        "name": "Selvam Arumugam",
        "tamilName": "செல்வம் ஆறுமுகம்",
        "location": "Thiruvaiyaru, Thanjavur District",
        "landSizeAcres": 4.5,
        "cropType": "Paddy (CR 1009 Sub-1) & Black Gram",
        "soilType": "Cauvery Delta Alluvial Clay Loam",
        "iotHubId": "IOT-TNJ-DELTA-4081",
        "sensorStatus": "Active · Online (4G LoRa Telemetry)",
        "wellDetails": {
            "type": "Dug-cum-Borewell (Unconfined Aquifer)",
            "totalDepthMeters": 45.0,
            "pumpRating": "5 HP Solar-Hybrid Submersible",
            "flowMeterGpm": 45.0,
            "currentDepthBgl": 3.42,
            "yesterdayDepthBgl": 3.48,
            "delta24h": "+0.06m (Natural Recharge)",
            "status": "Safe / High Water Table",
            "statusColor": "#10b981",
            "pumpState": "OFF"
        },
        "soilTelemetry": {
            "rootZoneMoisture15cm": 68.0,
            "subZoneMoisture30cm": 74.0,
            "optimalRange": "60% – 75%",
            "soilTempCelsius": 27.4,
            "electricalConductivity": "0.64 dS/m (Optimal)",
            "landStatus": "Fertile & Moisture Saturated"
        },
        "irrigationRecommendation": {
            "cropWaterNeedLiters": 18500,
            "optimalWindow": "Tomorrow Morning 05:30 AM – 07:30 AM",
            "advisoryText": "Cauvery delta soil currently retains 68% moisture. Convective showers expected tomorrow afternoon (16.5mm). Delay heavy pumping to conserve well head.",
            "rainProbabilityPercent": 85,
            "rainAmountMm": 16.5,
            "status": "WITHHOLD_RECOMMENDED"
        },
        "weatherForecast": {
            "location": "Thiruvaiyaru Agri-Met Hub",
            "currentTemp": 31.2,
            "humidity": 84,
            "windSpeedKmh": 14,
            "rainExpectedNext24h": True,
            "rainProbabilityPercent": 85,
            "rainAmountMm": 16.5
        }
    },
    "murugan-madurai": {
        "id": "murugan-madurai",
        "name": "Murugan Pandian",
        "tamilName": "முருகன் பாண்டியன்",
        "location": "Usilampatti, Madurai District",
        "landSizeAcres": 3.2,
        "cropType": "Cotton & Groundnut",
        "soilType": "Red Sandy Loam",
        "iotHubId": "IOT-MDU-USIL-2019",
        "sensorStatus": "Active · Online",
        "wellDetails": {
            "type": "Deep Hard Rock Borewell",
            "totalDepthMeters": 110.0,
            "pumpRating": "7.5 HP Submersible",
            "flowMeterGpm": 25.0,
            "currentDepthBgl": 18.6,
            "yesterdayDepthBgl": 18.2,
            "delta24h": "-0.40m (Depletion Trend)",
            "status": "Stressed / Deep Aquifer",
            "statusColor": "#f97316",
            "pumpState": "OFF"
        },
        "soilTelemetry": {
            "rootZoneMoisture15cm": 38.0,
            "subZoneMoisture30cm": 42.0,
            "optimalRange": "50% – 65%",
            "soilTempCelsius": 33.1,
            "electricalConductivity": "1.12 dS/m",
            "landStatus": "Moisture Deficit Detected"
        },
        "irrigationRecommendation": {
            "cropWaterNeedLiters": 24000,
            "optimalWindow": "Tonight 10:00 PM – 12:30 AM (Low Evaporative Demand)",
            "advisoryText": "Soil moisture has dropped to 38% under high solar radiation. Zero rain forecast for the next 72 hours. Immediate precision drip irrigation recommended.",
            "rainProbabilityPercent": 10,
            "rainAmountMm": 0.0,
            "status": "IRRIGATE_NOW"
        },
        "weatherForecast": {
            "location": "Usilampatti Observatory",
            "currentTemp": 35.4,
            "humidity": 45,
            "windSpeedKmh": 9,
            "rainExpectedNext24h": False,
            "rainProbabilityPercent": 10,
            "rainAmountMm": 0.0
        }
    }
}

@router.get("/{user_id}", response_model=FarmerFullResponse)
async def get_farmer_dashboard_telemetry(user_id: str):
    """
    Returns live IoT well status, soil telemetry, and water recommendation for a specific farmer.
    Accessible at: /api/users/{user_id}
    """
    farmer = MOCK_FARMERS.get(user_id)
    if not farmer:
        # If user not found, default to selvam-thanjavur template with the requested id
        default_farmer = MOCK_FARMERS["selvam-thanjavur"].copy()
        default_farmer["id"] = user_id
        default_farmer["name"] = f"Farmer ({user_id})"
        return default_farmer

    return farmer

@router.post("/{user_id}/pump-toggle")
async def toggle_pump_status(user_id: str, req: PumpToggleRequest):
    """
    Remotely toggles the farmer's borewell pump state (ON/OFF).
    Simulates sending LoRa/MQTT command to IoT telemetry controller.
    """
    farmer = MOCK_FARMERS.get(user_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    farmer["wellDetails"]["pumpState"] = req.state
    logger.info(f"Pump status for {user_id} switched to: {req.state}")

    return {
        "success": True,
        "user_id": user_id,
        "new_pump_state": req.state,
        "message": f"Pump command dispatched. Pump is now {req.state}."
    }
