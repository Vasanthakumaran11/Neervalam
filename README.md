# 💧 Neervalam (நீர்வளம்)
### Smart Groundwater Monitoring, Prediction & Artificial Recharge Recommendation System

[![Project Status: Phase 1 Operational MVP](https://img.shields.io/badge/Status-Phase%201%20Live%20MVP-10b981.svg?style=for-the-badge)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61dafb.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%20%7C%20OpenStreetMap-199900.svg?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Chart.js](https://img.shields.io/badge/Visuals-Chart.js-ff6384.svg?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Data Source](https://img.shields.io/badge/Data%20Source-CGWB%202024--25-0284c7.svg?style=for-the-badge)](https://cgwb.gov.in/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](LICENSE)

---

## 📌 Overview

**Neervalam** (*meaning "Abundance of Water" in Tamil*) is a state-wide hydro-informatics platform built for **Tamil Nadu**. It bridges the gap between historical periodic well surveys and modern automated, AI-driven groundwater decision support. 

With erratic monsoon cycles, extensive agricultural drafting, and varying hard-rock vs. sedimentary hydrogeological formations across Tamil Nadu, sustainable groundwater governance requires granular, real-time intelligence. **Neervalam** provides an end-to-end analytical framework—from digitizing ground-truth monitoring wells to predictive depletion forecasting and geo-spatial artificial recharge recommendations.

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 NEERVALAM PLATFORM                      │
                  └──────────────────────────┬──────────────────────────────┘
                                             │
      ┌─────────────────────────┬────────────┴────────────┬─────────────────────────┐
      ▼                         ▼                         ▼                         ▼
 [Phase 1: LIVE]       [Phase 2: UPCOMING]       [Phase 3: PLANNED]        [Phase 4: FUTURE]
 CGWB Ground Truth     In-Situ IoT Telemetry     AI/ML Drawdown Forecast   Recharge DSS
 818 Wells · 32 Dists  DWLR · 4G/LoRa Piezometer LSTM & XGBoost Models     Check Dam & Pond GIS
```

---

## 🚀 Strategic 4-Phase Roadmap

| Phase | Designation | Status | Technical Scope |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **CGWB Ground Truth Foundation** | `COMPLETED / LIVE` | Digitization of 818 unconfined wells across 32 Tamil Nadu districts & UT Puducherry; 4-period seasonal tracking (May 24 – Jan 25); interactive GIS map; district-level hydrogeological analytics and individual well hydrographs. |
| **Phase 2** | **In-Situ IoT Telemetry** | `UPCOMING` | Integration of Digital Water Level Recorders (DWLR) & hydrostatic pressure piezometers via LoRaWAN/4G GSM; automated hourly time-series ingestion; automated outlier and drift filtering. |
| **Phase 3** | **AI/ML Groundwater Prediction** | `PLANNED` | Machine learning models (LSTM, BiLSTM, XGBoost) trained on precipitation (IMD), evapotranspiration, lithology, and historical draft rates for 30-day, 60-day, and seasonal drawdown predictions. |
| **Phase 4** | **Recharge Recommendation & DSS** | `FUTURE` | Multi-Criteria Decision Analysis (AHP + GIS) for optimal placement of Artificial Recharge Structures (Check Dams, Percolation Tanks, Recharge Shafts) at the Firka/Watershed scale. |

---

## ✨ Phase 1 Implemented Features

### 1. 🗺️ Interactive Geospatial Groundwater Map
* **Dynamic Custom Markers**: Displays real-time depth-to-water level ($m\text{ bgl}$) directly inside color-coded SVG map pins.
* **CGWB Safety Classification**: Instant color-coded categorization:
  * 🟢 **Safe / High Water Table** ($<2\text{ m bgl}$ and $2\text{--}5\text{ m bgl}$)
  * 🟡 **Moderate** ($5\text{--}10\text{ m bgl}$)
  * 🟠 **Semi-Critical** ($10\text{--}20\text{ m bgl}$)
  * 🔴 **Critical** ($>20\text{ m bgl}$)
* **District Fly-To Navigation**: Smooth animated zooming and filtering for all 32 districts with coordinate auto-centering.
* **Instant Station Popups**: Quick-view cards with coordinates, latest depth, well type, and direct link to the full station hydrograph modal.

### 2. 📊 High-Level KPI Metric Ribbons
* **State Average Depth**: Aggregated baseline ($3.55\text{ m bgl}$ across the state).
* **Groundwater Recharge Ratio**: Tracks Pre- vs. Post-monsoon fluctuation ($86.89\%$ of stations registered a water table rise, averaging $+2.29\text{ m}$).
* **Critical Alerts**: Quick count of deep/stressed monitoring wells ($>10\text{ m bgl}$) for immediate administrative focus.

### 3. 📈 Multi-Period Hydrograph Timelines
* **Deep-Dive Station Modal**: Visualizes seasonal water level movements over 4 official CGWB observation epochs:
  * **May 2024**: Pre-Monsoon baseline
  * **August 2024**: South-West Monsoon (SWM) impact
  * **November 2024**: North-East Monsoon (NEM) recharge
  * **January 2025**: Post-Monsoon consolidation
* **Interactive Water Column Gauge**: Graphical representation of water table relative to ground level.
* **District Benchmark Comparison**: Real-time delta comparing the station's depth with its parent district average.

### 4. 🏛️ District Hydrogeological Analytics
* Cross-district comparative cards ranking districts from shallowest to deepest water tables.
* Seasonal fluctuation breakdown (percentage of wells showing rise vs. fall per district).
* Direct *"View on Map"* action to instantly isolate and zoom into any district's well network.

### 5. 📋 Searchable Station Data Registry
* Comprehensive table of all **818 monitoring stations**.
* Instant multi-field filtering by Station Name, District, and Well Type.
* Net fluctuation badges ($+\text{Rise}$ / $-\text{Fall}$).
* Row-click modal trigger for detailed diagnostics.

### 6. 🌧️ Rainfall Correlation & Fluctuation Analytics
* Visualizes 2024 monsoon departures:
  * **South-West Monsoon (SWM)**: $+19\%$ (Normal/Above normal)
  * **North-East Monsoon (NEM)**: $+33\%$ (Excess rainfall)
  * **Annual Cumulative**: $+27\%$ Excess rainfall
* Correlation between rainfall surplus and positive aquifer replenishment across Tamil Nadu.

### 7. 🎨 Premium UI & Theming
* Built with a custom Glassmorphic design system using CSS variables.
* Smooth Dark / Light mode toggle.
* Responsive layouts optimized for desktops, tablets, and command-center displays.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Mapping & GIS** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + CartoDB Dark/Light Basemaps |
| **Charts & Hydrographs** | [Chart.js](https://www.chartjs.org/) + [React-Chartjs-2](https://react-chartjs-2.js.org/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Styling** | Modern Vanilla CSS (Custom Design System, Glassmorphism, CSS Variables) |
| **Data ETL Pipeline** | Python 3 (Pandas, NumPy, OpenPyXL) |
| **Dataset Source** | Central Ground Water Board (CGWB), Ministry of Jal Shakti |

---

## 📂 Project Structure

```
Neervalam/
├── backend/                                  # Reserved for Phase 2 API services
│   └── .gitkeep
├── data/                                     # Data Extraction & ETL Pipeline
│   ├── Tamil_Nadu_Groundwater_Level_Dataset_2024_25.xlsx  # Official CGWB raw data
│   ├── generate_dataset.py                   # Cleans raw data, builds JSON & metrics
│   ├── inspect_data.py                      # Data validation & inspection utility
│   └── groundwater_dataset.json              # Processed ground truth dataset
├── frontend/                                 # Phase 1 React Application
│   ├── index.html                            # Root HTML template
│   ├── package.json                          # Dependencies & build scripts
│   ├── vite.config.js                        # Vite bundler configuration
│   └── src/
│       ├── App.jsx                           # Core application layout & tab navigation
│       ├── main.jsx                          # React application entry point
│       ├── index.css                         # Design system tokens & glassmorphic styles
│       ├── components/
│       │   ├── Navbar.jsx                    # Header, navigation, search & theme toggle
│       │   ├── KpiMetrics.jsx                # High-level summary metrics ribbon
│       │   ├── GroundwaterMap.jsx            # Interactive Leaflet GIS map with SVG pins
│       │   ├── DistrictAnalytics.jsx         # District rankings & comparison charts
│       │   ├── StationsTable.jsx             # Filterable 818-station data registry
│       │   ├── SeasonalTrendsChart.jsx       # Chart.js seasonal curve & rainfall analysis
│       │   ├── StationDetailModal.jsx        # Individual well hydrograph & depth gauge
│       │   └── RoadmapVision.jsx             # Phased strategic vision & data statement
│       └── data/
│           └── groundwater_dataset.json       # Frontend bundle dataset
└── README.md                                 # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** 18.0 or higher
* **npm** 9.0 or higher
* *(Optional)* **Python 3.9+** with `pandas` and `openpyxl` (only required if re-running ETL)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Vasanthakumaran11/Neervalam.git
cd Neervalam
```

---

### 2. Run the Frontend Dashboard
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Launch the development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

---

### 3. (Optional) Re-generate the Ground Truth Dataset
If you modify the source Excel workbook or add new observation records:
```bash
# From the repository root
cd data

# Run the ETL script
python generate_dataset.py

# Copy the updated JSON to the frontend
cp groundwater_dataset.json ../frontend/src/data/groundwater_dataset.json
```

---

## 📖 Data Provenance & Methodology

### Source Citation
> **Central Ground Water Board (CGWB)**, South Eastern Coastal Region (SECR), Chennai  
> *Ministry of Jal Shakti, Department of Water Resources, River Development and Ganga Rejuvenation, Government of India*  
> **Publication**: *Ground Water Year Book of Tamil Nadu & U.T. of Puducherry (2024-2025)* (Report No: SECR/GWYB/TN/2024)

### Fluctuation Calculation
Depth to water level is measured in **meters below ground level ($m\text{ bgl}$)**.
$$\Delta \text{Water Level} = \text{Depth}_{\text{May 2024 (Pre-Monsoon)}} - \text{Depth}_{\text{Jan 2025 (Post-Monsoon)}}$$
* **Positive value ($\Delta > 0$)**: Represents a **Rise in water level** (recharge).
* **Negative value ($\Delta < 0$)**: Represents a **Fall in water level** (depletion).

---

## 🔮 Upcoming Phases (Phases 2 – 4)

```
       [IoT Piezometer (DWLR)]
                  │
                  ▼ (LoRaWAN / 4G GSM)
        [FastAPI Ingestion Gateway]
                  │
                  ▼
        [Timeseries Database (TimescaleDB / InfluxDB)]
                  │
        ┌─────────┴────────────────────────┐
        ▼                                  ▼
[BiLSTM / XGBoost Model]        [GIS AHP Recharge Engine]
- 30/60-day Drawdown Forecast   - Check Dam Site Selection
- Localized Stress Alerts       - Percolation Pond Siting
```

1. **Phase 2 (IoT Ingestion)**:
   - FastAPI microservice connected to automated digital water level recorders (DWLR).
   - Real-time ingestion via MQTT / HTTP webhooks.
2. **Phase 3 (ML Predictive Analytics)**:
   - Deep learning sequence modeling (LSTM / GRU) trained on daily rainfall anomalies and seasonal aquifer dynamics.
   - Spatial interpolation (Ordinary Kriging) to map unmonitored zones.
3. **Phase 4 (Decision Support)**:
   - Geospatial Multi-Criteria Decision Analysis (GIS-MCDA) combining slope, soil permeability, lineaments, drainage density, and aquifer stress to recommend artificial recharge structures.

---

## 🤝 Contributing

Contributions to improve data models, GIS layers, or UI components are welcome:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built for Tamil Nadu's sustainable water resilience · <b>Neervalam Platform</b></sub>
</p>
