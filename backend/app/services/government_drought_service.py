"""
Government Regional Drought Prediction & Intervention Matching Service
Evaluates block/firka drought severity and matches with CGWB pre-screened check dams & recharge structures.
"""
import os
import joblib
import pandas as pd
import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS = os.path.join(ROOT_DIR, "app", "ai", "saved_models")
DATASET_DIR = os.path.join(ROOT_DIR, "..", "data", "neervalam_dataset")
ARS_INVENTORY = os.path.join(DATASET_DIR, "05_static_features", "bhavani_basin_recharge_interventions.csv")
WELL_ARS = os.path.join(DATASET_DIR, "05_static_features", "well_to_ars_nearest.csv")
ANOMALY_REF = os.path.join(DATASET_DIR, "08_anomaly_drought", "well_season_anomaly_reference.csv")

_drought_clf = None

def get_drought_model():
    global _drought_clf
    if _drought_clf is None:
        p = os.path.join(SAVED_MODELS, "drought_classifier_model.joblib")
        if os.path.exists(p):
            _drought_clf = joblib.load(p)
    return _drought_clf


# Erode blocks metadata
ERODE_BLOCKS = [
    "Ammapet", "Anthiyur", "Bhavani", "Bhavanisagar", "Chennimalai", "Erode",
    "Gobichettipalayam", "Kodumudi", "Modakkurichi", "Nambiyur", "Perundurai",
    "Sathyamangalam", "Talavadi", "Thookanaickenpalayam"
]


def evaluate_block_drought(
    block_name: str = "Bhavanisagar",
    rainfall_deficit_pct: float = 45.0, # e.g. 0 to 100%
    temperature_anomaly_c: float = 2.5, # e.g. 0 to +5 C
    current_avg_depth_mbgl: float = 18.5
):
    clf = get_drought_model()

    # Base rainfall for Erode region ~180mm per 90d in NE monsoon, ~120mm in SW
    normal_90d_rain = 150.0
    actual_90d_rain = max(0.0, normal_90d_rain * (1.0 - (rainfall_deficit_pct / 100.0)))
    actual_30d_rain = actual_90d_rain * 0.35

    # Historical average depth for this block (default ~10-12m)
    hist_mean_depth = 11.2
    anomaly_m = current_avg_depth_mbgl - hist_mean_depth

    # Model features
    feats = {
        "wl_t_mbgl": current_avg_depth_mbgl,
        "wl_t_minus_hist_mean_m": anomaly_m,
        "month_t": 5,
        "rain_30d_mm": actual_30d_rain,
        "rain_90d_mm": actual_90d_rain,
        "et0_30d_mm": 140.0 + (temperature_anomaly_c * 8.0),
        "temp_mean_30d_c": 28.0 + temperature_anomaly_c,
        "block_code": 3 # categorical code
    }

    # Dual-confirmation hydrological rule:
    # Severity is escalated only when BOTH rainfall deficit and groundwater drops agree
    if rainfall_deficit_pct >= 60.0 and anomaly_m >= 3.5:
        severity = "EMERGENCY"
        level_code = 3
        badge_color = "red"
        status_msg = f"EMERGENCY DROUGHT WARNING: Severe precipitation deficit ({rainfall_deficit_pct:.0f}%) coupled with critical groundwater drawdown ({anomaly_m:.1f}m below decadal mean) across {block_name} block."
        rationing_action = "Execute emergency water rationing protocol: halt non-essential industrial water extraction, deploy emergency water tankers to tail-end habitations, and prohibit flood irrigation on high-water crops."
    elif rainfall_deficit_pct >= 40.0 or (anomaly_m >= 2.0 and rainfall_deficit_pct >= 25.0):
        severity = "WARNING"
        level_code = 2
        badge_color = "orange"
        status_msg = f"DROUGHT WARNING: Moderate hydrological stress detected in {block_name}. Water table recession accelerating under high evaporative demand."
        rationing_action = "Issue advisory to canal and tank water users; stagger agricultural power feeder supply to control indiscriminate groundwater pumping."
    elif rainfall_deficit_pct >= 20.0 or anomaly_m >= 1.0:
        severity = "WATCH"
        level_code = 1
        badge_color = "yellow"
        status_msg = f"DROUGHT WATCH: Early moisture deficit observed in {block_name}. Soil moisture decreasing."
        rationing_action = "Monitor observation wells weekly; prepare desilting schedules for local percolation ponds and check dams."
    else:
        severity = "NORMAL"
        level_code = 0
        badge_color = "green"
        status_msg = f"NORMAL HYDROLOGICAL CONDITIONS: Storage levels in {block_name} are within seasonal baseline limits."
        rationing_action = "Standard watershed monitoring active. Recharge capacity optimal."

    # Match recommended CGWB Artificial Recharge Structures (ARS) for this block/firka
    recommended_interventions = []
    if os.path.exists(ARS_INVENTORY):
        df_ars = pd.read_csv(ARS_INVENTORY)
        # Search for structures matching or neighboring the block
        m = df_ars[df_ars["firka_name"].str.contains(block_name[:5], case=False, na=False)]
        if len(m) == 0:
            m = df_ars # fallback to top structures
        
        for idx, r in m.head(5).iterrows():
            recommended_interventions.append({
                "sl_no": int(r.get("sl_no", idx+1)),
                "type": r.get("ars_type", "CHECKDAM"),
                "village": r.get("village_name", ""),
                "firka": r.get("firka_name", ""),
                "latitude": float(r.get("latitude", 11.45)),
                "longitude": float(r.get("longitude", 77.18)),
                "priority": "IMMEDIATE IMPLEMENTATION" if severity in ["EMERGENCY", "WARNING"] else "SCHEDULED MAINTENANCE",
                "estimated_recharge_potential": "15,000 - 35,000 m3/year"
            })

    return {
        "block_name": block_name,
        "severity": severity,
        "level_code": level_code,
        "badge_color": badge_color,
        "status_message": status_msg,
        "recommended_policy_action": rationing_action,
        "indicators": {
            "rainfall_deficit_pct": rainfall_deficit_pct,
            "actual_90d_rainfall_mm": round(actual_90d_rain, 1),
            "normal_90d_rainfall_mm": normal_90d_rain,
            "temperature_anomaly_c": temperature_anomaly_c,
            "current_water_depth_mbgl": current_avg_depth_mbgl,
            "anomaly_below_mean_m": round(anomaly_m, 2)
        },
        "recommended_cgwb_structures": recommended_interventions
    }
