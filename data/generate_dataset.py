import pandas as pd
import numpy as np
import json

# Read the excel file
excel_file = "Tamil_Nadu_Groundwater_Level_Dataset_2024_25.xlsx"
df = pd.read_excel(excel_file, sheet_name="Groundwater_Observations")

# Clean column names
df.columns = [c.strip() for c in df.columns]

# Check data
print("Raw rows:", len(df))
print("Sample:\n", df.head())

# Group by well: identified by District, Location, Latitude, Longitude, Well Type
# Let's inspect unique locations
wells_dict = {}

for idx, row in df.iterrows():
    district = str(row['District']).strip() if pd.notna(row['District']) else "Unknown"
    location = str(row['Location']).strip() if pd.notna(row['Location']) else f"Station {idx}"
    well_type = str(row['Well Type']).strip() if pd.notna(row['Well Type']) else "Dug Well"
    
    lat = float(row['Latitude']) if pd.notna(row['Latitude']) else None
    lon = float(row['Longitude']) if pd.notna(row['Longitude']) else None
    
    # Check invalid coordinates (e.g. lon with wrong decimal or 8.06 instead of 80.06)
    if lon is not None and lon < 50:
        if 7.0 <= lon <= 9.0: # like 8.064266 -> 80.064266
            lon = lon * 10
    
    date = str(row['Observation Date']).strip()
    val = float(row['Water Level (m bgl)']) if pd.notna(row['Water Level (m bgl)']) else None
    
    # Key for unique well
    key = f"{district}_{location}"
    
    if key not in wells_dict:
        wells_dict[key] = {
            "id": len(wells_dict) + 1,
            "district": district,
            "location": location,
            "wellType": well_type,
            "latitude": lat,
            "longitude": lon,
            "observations": {
                "2024-05": None,
                "2024-08": None,
                "2024-11": None,
                "2025-01": None
            }
        }
    
    # Update coordinates if this row has them and existing was None
    if wells_dict[key]["latitude"] is None and lat is not None:
        wells_dict[key]["latitude"] = lat
    if wells_dict[key]["longitude"] is None and lon is not None:
        wells_dict[key]["longitude"] = lon
        
    wells_dict[key]["observations"][date] = val

wells_list = list(wells_dict.values())

# Approximate missing coordinates based on District center or nearby wells if missing
district_centers = {
    "Ariyalur": [11.1401, 79.0786],
    "Chennai": [13.0827, 80.2707],
    "Coimbatore": [11.0168, 76.9558],
    "Cuddalore": [11.7480, 79.7714],
    "Dharmapuri": [12.1211, 78.1582],
    "Dindigul": [10.3673, 77.9803],
    "Erode": [11.3410, 77.7172],
    "Kancheepuram": [12.8342, 79.7036],
    "Kanyakumari": [8.0883, 77.5385],
    "Karaikal": [10.9254, 79.8380],
    "Karur": [10.9601, 78.0766],
    "Krishnagiri": [12.5186, 78.2137],
    "Madurai": [9.9252, 78.1198],
    "Nagapattinam": [10.7672, 79.8449],
    "Namakkal": [11.2189, 78.1674],
    "Nilgiris": [11.4102, 76.6950],
    "Perambalur": [11.2342, 78.8820],
    "Pondicherry": [11.9416, 79.8083],
    "Pudukkottai": [10.3797, 78.8208],
    "Ramanathapuram": [9.3639, 78.8395],
    "Salem": [11.6643, 78.1460],
    "Sivaganga": [9.8433, 78.4809],
    "Thanjavur": [10.7870, 79.1378],
    "Theni": [10.0104, 77.4768],
    "Thiruvannamalai": [12.2253, 79.0747],
    "Tirunelveli": [8.7139, 77.7567],
    "Tiruppur": [11.1085, 77.3411],
    "Tiruvallur": [13.1438, 79.9083],
    "Tiruvarur": [10.7725, 79.6365],
    "Trichy": [10.7905, 78.7047],
    "Tuticorin": [8.7642, 78.1348],
    "Vellore": [12.9165, 79.1325],
    "Villupuram": [11.9401, 79.4861],
    "Virudhunagar": [9.5680, 77.9624]
}

# Add computed properties to each well
for well in wells_list:
    obs = well["observations"]
    # Get latest available value
    latest_date = None
    latest_val = None
    for d in ["2025-01", "2024-11", "2024-08", "2024-05"]:
        if obs[d] is not None:
            latest_date = d
            latest_val = obs[d]
            break
            
    well["latestDate"] = latest_date
    well["latestLevel"] = latest_val
    
    # Fluctuation May 2024 (Pre-monsoon) to Jan 2025 (Post-monsoon)
    # Note: In depth to water level (m bgl), a DECREASE in depth means RISE in water level (positive recharge)
    # E.g. May=6.63m bgl, Jan=5.85m bgl -> Water level rose by 0.78m (depth decreased by 0.78m)
    may_val = obs["2024-05"]
    jan_val = obs["2025-01"]
    if may_val is not None and jan_val is not None:
        well["annualFluctuation"] = round(may_val - jan_val, 2) # positive = rise, negative = fall
        well["annualFluctuationType"] = "Rise" if (may_val - jan_val) >= 0 else "Fall"
    else:
        well["annualFluctuation"] = None
        well["annualFluctuationType"] = "Unknown"

    # Category classification based on CGWB depth brackets
    if latest_val is not None:
        if latest_val < 2.0:
            well["category"] = "Very Shallow (<2m)"
            well["status"] = "Safe / High Water Table"
            well["color"] = "#06b6d4" # Cyan
        elif latest_val <= 5.0:
            well["category"] = "Shallow (2-5m)"
            well["status"] = "Safe"
            well["color"] = "#10b981" # Emerald
        elif latest_val <= 10.0:
            well["category"] = "Moderate (5-10m)"
            well["status"] = "Moderate"
            well["color"] = "#f59e0b" # Amber
        elif latest_val <= 20.0:
            well["category"] = "Deep (10-20m)"
            well["status"] = "Semi-Critical"
            well["color"] = "#f97316" # Orange
        else:
            well["category"] = "Very Deep (>20m)"
            well["status"] = "Critical"
            well["color"] = "#ef4444" # Red
    else:
        well["category"] = "No Data"
        well["status"] = "Unrecorded"
        well["color"] = "#94a3b8"

    # Fill fallback coordinates if missing
    if well["latitude"] is None or well["longitude"] is None or np.isnan(well["latitude"]) or np.isnan(well["longitude"]):
        dist = well["district"]
        if dist in district_centers:
            # Add tiny jitter so overlapping stations don't stack completely
            jitter_lat = (hash(well["location"]) % 200 - 100) * 0.0005
            jitter_lon = (hash(well["location"] + "lon") % 200 - 100) * 0.0005
            well["latitude"] = round(district_centers[dist][0] + jitter_lat, 6)
            well["longitude"] = round(district_centers[dist][1] + jitter_lon, 6)
            well["isEstimatedCoord"] = True
        else:
            well["latitude"] = 11.1271
            well["longitude"] = 78.6569
            well["isEstimatedCoord"] = True
    else:
        well["isEstimatedCoord"] = False

# Compute District-Level Aggregations
districts_data = {}
for w in wells_list:
    d = w["district"]
    if d not in districts_data:
        districts_data[d] = {
            "name": d,
            "totalWells": 0,
            "mayLevels": [],
            "augLevels": [],
            "novLevels": [],
            "janLevels": [],
            "latestLevels": [],
            "riseCount": 0,
            "fallCount": 0,
            "criticalCount": 0, # > 10m
            "safeCount": 0 # < 5m
        }
    
    districts_data[d]["totalWells"] += 1
    if w["observations"]["2024-05"] is not None:
        districts_data[d]["mayLevels"].append(w["observations"]["2024-05"])
    if w["observations"]["2024-08"] is not None:
        districts_data[d]["augLevels"].append(w["observations"]["2024-08"])
    if w["observations"]["2024-11"] is not None:
        districts_data[d]["novLevels"].append(w["observations"]["2024-11"])
    if w["observations"]["2025-01"] is not None:
        districts_data[d]["janLevels"].append(w["observations"]["2025-01"])
    if w["latestLevel"] is not None:
        districts_data[d]["latestLevels"].append(w["latestLevel"])
        if w["latestLevel"] < 5.0:
            districts_data[d]["safeCount"] += 1
        elif w["latestLevel"] >= 10.0:
            districts_data[d]["criticalCount"] += 1
            
    if w["annualFluctuationType"] == "Rise":
        districts_data[d]["riseCount"] += 1
    elif w["annualFluctuationType"] == "Fall":
        districts_data[d]["fallCount"] += 1

districts_summary = []
for d, data in districts_data.items():
    center = district_centers.get(d, [11.1271, 78.6569])
    avg_may = round(np.mean(data["mayLevels"]), 2) if data["mayLevels"] else None
    avg_aug = round(np.mean(data["augLevels"]), 2) if data["augLevels"] else None
    avg_nov = round(np.mean(data["novLevels"]), 2) if data["novLevels"] else None
    avg_jan = round(np.mean(data["janLevels"]), 2) if data["janLevels"] else None
    avg_latest = round(np.mean(data["latestLevels"]), 2) if data["latestLevels"] else None
    min_depth = round(min(data["latestLevels"]), 2) if data["latestLevels"] else None
    max_depth = round(max(data["latestLevels"]), 2) if data["latestLevels"] else None
    
    # Net change pre-to-post monsoon
    avg_fluctuation = None
    if avg_may is not None and avg_jan is not None:
        avg_fluctuation = round(avg_may - avg_jan, 2) # positive = water table rose
        
    districts_summary.append({
        "name": d,
        "center": center,
        "totalWells": data["totalWells"],
        "avgMay24": avg_may,
        "avgAug24": avg_aug,
        "avgNov24": avg_nov,
        "avgJan25": avg_jan,
        "avgLatest": avg_latest,
        "minDepth": min_depth,
        "maxDepth": max_depth,
        "avgFluctuation": avg_fluctuation,
        "riseCount": data["riseCount"],
        "fallCount": data["fallCount"],
        "criticalCount": data["criticalCount"],
        "safeCount": data["safeCount"]
    })

# Overall state stats
all_latest = [w["latestLevel"] for w in wells_list if w["latestLevel"] is not None]
all_may = [w["observations"]["2024-05"] for w in wells_list if w["observations"]["2024-05"] is not None]
all_aug = [w["observations"]["2024-08"] for w in wells_list if w["observations"]["2024-08"] is not None]
all_nov = [w["observations"]["2024-11"] for w in wells_list if w["observations"]["2024-11"] is not None]
all_jan = [w["observations"]["2025-01"] for w in wells_list if w["observations"]["2025-01"] is not None]

state_stats = {
    "title": "Tamil Nadu & Puducherry Groundwater Year Book 2024-25 Analysis",
    "totalWells": len(wells_list),
    "totalDistricts": len(districts_summary),
    "periods": ["May 2024 (Pre-Monsoon)", "August 2024 (SWM)", "November 2024 (NEM)", "January 2025 (Post-Monsoon)"],
    "stateAverageLatest": round(np.mean(all_latest), 2),
    "stateMinDepth": round(min(all_latest), 2),
    "stateMaxDepth": round(max(all_latest), 2),
    "seasonalAverages": {
        "May 2024": round(np.mean(all_may), 2),
        "August 2024": round(np.mean(all_aug), 2),
        "November 2024": round(np.mean(all_nov), 2),
        "January 2025": round(np.mean(all_jan), 2)
    },
    "depthDistribution": {
        "lessThan2m": len([x for x in all_latest if x < 2.0]),
        "between2And5m": len([x for x in all_latest if 2.0 <= x <= 5.0]),
        "between5And10m": len([x for x in all_latest if 5.0 < x <= 10.0]),
        "between10And20m": len([x for x in all_latest if 10.0 < x <= 20.0]),
        "moreThan20m": len([x for x in all_latest if x > 20.0])
    },
    "fluctuationStats": {
        "overallRisePercentage": 86.89, # From Table 17 & Executive Summary
        "overallFallPercentage": 13.11,
        "avgRiseMeters": round(float(np.mean(all_may) - np.mean(all_jan)), 2)
    },
    "rainfallSummary2024": {
        "swmActual": 389.8,
        "swmNormal": 328.5,
        "swmDeparture": "+19% (Normal)",
        "nemActual": 589.9,
        "nemNormal": 442.8,
        "nemDeparture": "+33% (Excess)",
        "annualActual": 1172.74,
        "annualDeparture": "+27% (Excess)"
    }
}

# Export to JSON
dataset_output = {
    "stateStats": state_stats,
    "districts": districts_summary,
    "wells": wells_list
}

with open("groundwater_dataset.json", "w", encoding="utf-8") as f:
    json.dump(dataset_output, f, indent=2)

print("Successfully generated groundwater_dataset.json!")
print(f"Exported {len(wells_list)} wells, {len(districts_summary)} districts.")
