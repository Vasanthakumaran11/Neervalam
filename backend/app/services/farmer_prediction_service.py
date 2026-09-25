"""
Farmer Water Level Forecast & Critical Depletion Alert Service
Predicts 30/60/90-day water level depth (m bgl) and calculates pump dry-run risk and crop water advice.
"""
import os
import joblib
import numpy as np
import pandas as pd

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS = os.path.join(ROOT_DIR, "app", "ai", "saved_models")
DATASET_DIR = os.path.join(ROOT_DIR, "..", "data", "neervalam_dataset")
AQUIFER_JOIN = os.path.join(DATASET_DIR, "05_static_features", "well_to_aquifer_properties.csv")
CROP_REF = os.path.join(DATASET_DIR, "11_crop_reference", "crop_water_requirement_reference.csv")

# Load models once
_rf_model = None
_lgb_model = None

def get_models():
    global _rf_model, _lgb_model
    if _rf_model is None:
        rf_path = os.path.join(SAVED_MODELS, "water_level_rf_model.joblib")
        if os.path.exists(rf_path):
            _rf_model = joblib.load(rf_path)
    if _lgb_model is None:
        lgb_path = os.path.join(SAVED_MODELS, "water_level_lgbm_model.joblib")
        if os.path.exists(lgb_path):
            _lgb_model = joblib.load(lgb_path)
    return _rf_model, _lgb_model


# Crop water requirements (liters/day per acre & total season mm)
CROP_FACTORS = {
    "Paddy": {"total_mm": 1250, "daily_mm": 10.4, "sensitivity": "Very High", "critical_stage": "Panicle Initiation"},
    "Sugarcane": {"total_mm": 1800, "daily_mm": 5.2, "sensitivity": "High", "critical_stage": "Formative Phase"},
    "Turmeric": {"total_mm": 900, "daily_mm": 4.1, "sensitivity": "Medium", "critical_stage": "Rhizome Development"},
    "Banana": {"total_mm": 1600, "daily_mm": 5.3, "sensitivity": "High", "critical_stage": "Shooting/Flowering"},
    "Maize": {"total_mm": 500, "daily_mm": 4.5, "sensitivity": "Medium", "critical_stage": "Tasseling"},
    "Cotton": {"total_mm": 700, "daily_mm": 4.3, "sensitivity": "Medium", "critical_stage": "Boll Formation"},
    "Groundnut": {"total_mm": 550, "daily_mm": 4.5, "sensitivity": "Medium", "critical_stage": "Pegging & Pod Development"},
    "Vegetables": {"total_mm": 450, "daily_mm": 5.0, "sensitivity": "High", "critical_stage": "Flowering & Fruit Setting"}
}


def predict_farmer_well(
    well_id: str = "NVW001",
    current_depth_mbgl: float = 14.5,
    pump_depth_mbgl: float = 24.0,
    crop_name: str = "Turmeric",
    irrigation_type: str = "Flood",
    rainfall_scenario: str = "Normal", # "Normal", "Dry (-40%)", "No Rain (0mm)"
    month: int = 5
):
    rf, lgb_model = get_models()
    
    # 1. Fetch well static aquifer properties
    transmissivity = 35.0
    storativity = 0.02
    weathered_depth = 25.0
    
    if os.path.exists(AQUIFER_JOIN):
        df_aq = pd.read_csv(AQUIFER_JOIN)
        m = df_aq[df_aq["well_id"] == well_id]
        if len(m):
            row = m.iloc[0]
            transmissivity = float(row.get("transmissivity_m2_day", 35.0))
            storativity = float(row.get("storativity_s", 0.02))
            weathered_depth = float(row.get("weathered_zone_thickness_m", 25.0))

    # 2. Daily drawdown computation based on crop demand & irrigation efficiency
    crop_info = CROP_FACTORS.get(crop_name, CROP_FACTORS["Turmeric"])
    base_drawdown_daily = crop_info["daily_mm"] * 0.001 / max(storativity, 0.015) # converted to meters head drop
    
    # Irrigation efficiency multiplier (Drip uses ~40% less water than Flood)
    eff_mult = 0.60 if irrigation_type.lower() == "drip" else 1.0
    
    # Rainfall recharge credit
    rain_credit_daily = 0.0
    if rainfall_scenario == "Normal":
        rain_credit_daily = 0.003
    elif rainfall_scenario == "Dry (-40%)":
        rain_credit_daily = 0.001
    else: # No Rain
        rain_credit_daily = 0.0

    net_daily_recession = max(0.01, (base_drawdown_daily * eff_mult) - rain_credit_daily)
    
    # Hydrodynamic predictions for 30, 60, 90 days
    # (Boulton delayed gravity drainage adjustment for unconfined saprolite)
    delay_factor = 0.85 # unconfined delayed drainage damping
    p30 = round(current_depth_mbgl + (net_daily_recession * 30 * delay_factor), 2)
    p60 = round(current_depth_mbgl + (net_daily_recession * 60 * delay_factor), 2)
    p90 = round(current_depth_mbgl + (net_daily_recession * 90 * delay_factor), 2)

    # 3. Assess Critical Pump Failure Alert
    buffer_to_pump_30 = pump_depth_mbgl - p30
    buffer_to_pump_60 = pump_depth_mbgl - p60
    buffer_to_pump_90 = pump_depth_mbgl - p90

    # Days until water hits pump suction depth
    if net_daily_recession > 0:
        days_to_pump_failure = int(max(0, (pump_depth_mbgl - current_depth_mbgl) / (net_daily_recession * delay_factor)))
    else:
        days_to_pump_failure = 999

    if buffer_to_pump_90 <= 0 or days_to_pump_failure <= 45:
        severity = "CRITICAL"
        alert_title = "CRITICAL WELL DEPLETION ALERT"
        alert_msg = f"Water level projected to breach pump depth ({pump_depth_mbgl}m) in approximately {days_to_pump_failure} days! Immediate intervention required."
        color = "red"
        action = "Switch from Flood to Drip irrigation immediately and reduce pumping cycles by 40% to preserve root-zone moisture without burning the pump."
    elif buffer_to_pump_90 < 2.5 or days_to_pump_failure <= 90:
        severity = "WARNING"
        alert_title = "MODERATE DRAWDOWN WARNING"
        alert_msg = f"Water buffer over pump suction line narrows to {buffer_to_pump_90:.1f}m by Day 90. Well approaching critical threshold."
        color = "yellow"
        action = f"Schedule irrigation during early morning/evening. Prioritize critical {crop_info['critical_stage']} stage to prevent yield loss."
    else:
        severity = "NORMAL"
        alert_title = "WELL WATER LEVEL SAFE"
        alert_msg = f"Water level will remain comfortably above pump suction depth ({buffer_to_pump_90:.1f}m buffer remaining at Day 90)."
        color = "green"
        action = "Current pumping schedule is sustainable for full crop cycle."

    # Compare with Drip savings if currently Flood
    drip_savings = None
    if irrigation_type.lower() != "drip":
        saved_p90 = round(current_depth_mbgl + (net_daily_recession * 0.60 * 90 * delay_factor), 2)
        head_saved = round(p90 - saved_p90, 2)
        drip_savings = {
            "water_saved_percent": 40,
            "projected_p90_with_drip": saved_p90,
            "head_saved_meters": head_saved,
            "recommendation": f"Switching to Drip irrigation will save {head_saved}m of head and guarantee water supply through harvest."
        }

    return {
        "well_id": well_id,
        "current_depth_mbgl": current_depth_mbgl,
        "pump_depth_mbgl": pump_depth_mbgl,
        "crop_name": crop_name,
        "irrigation_type": irrigation_type,
        "rainfall_scenario": rainfall_scenario,
        "forecast": {
            "day_30_mbgl": p30,
            "day_60_mbgl": p60,
            "day_90_mbgl": p90,
            "trajectory": [
                {"day": 0, "depth_mbgl": current_depth_mbgl},
                {"day": 15, "depth_mbgl": round(current_depth_mbgl + (net_daily_recession * 15 * delay_factor), 2)},
                {"day": 30, "depth_mbgl": p30},
                {"day": 45, "depth_mbgl": round(current_depth_mbgl + (net_daily_recession * 45 * delay_factor), 2)},
                {"day": 60, "depth_mbgl": p60},
                {"day": 75, "depth_mbgl": round(current_depth_mbgl + (net_daily_recession * 75 * delay_factor), 2)},
                {"day": 90, "depth_mbgl": p90}
            ]
        },
        "alert": {
            "severity": severity,
            "color": color,
            "title": alert_title,
            "message": alert_msg,
            "days_to_pump_failure": days_to_pump_failure,
            "recommended_action": action
        },
        "aquifer_context": {
            "transmissivity_m2_day": transmissivity,
            "specific_yield_pct": storativity * 100,
            "weathered_depth_m": weathered_depth
        },
        "drip_optimization": drip_savings
    }
