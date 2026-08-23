import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import KpiMetrics from './components/KpiMetrics';
import GroundwaterMap from './components/GroundwaterMap';
import DistrictAnalytics from './components/DistrictAnalytics';
import StationsTable from './components/StationsTable';
import SeasonalTrendsChart from './components/SeasonalTrendsChart';
import RoadmapVision from './components/RoadmapVision';
import StationDetailModal from './components/StationDetailModal';

// Import processed dataset
import dataset from './data/groundwater_dataset.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'analytics' | 'table' | 'rainfall' | 'roadmap'
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const { stateStats, districts, wells } = dataset;

  // Filtered wells count based on search or district
  const filteredWellsCount = useMemo(() => {
    return wells.filter(w => {
      if (selectedDistrict !== 'ALL' && w.district !== selectedDistrict) return false;
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return w.location.toLowerCase().includes(q) || w.district.toLowerCase().includes(q);
      }
      return true;
    }).length;
  }, [wells, selectedDistrict, searchQuery]);

  // Selected district info for modal comparison
  const selectedDistrictInfo = useMemo(() => {
    if (!selectedStation) return null;
    return districts.find(d => d.name === selectedStation.district) || null;
  }, [selectedStation, districts]);

  // Handler to view district from analytics on the map
  const handleViewDistrictOnMap = (districtName) => {
    setSelectedDistrict(districtName);
    setActiveTab('map');
  };

  return (
    <div className="app-container">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalWells={wells.length}
        districtsCount={districts.length}
      />

      {/* KPI Overview Metrics (Always visible at top) */}
      <KpiMetrics
        stateStats={stateStats}
        filteredCount={filteredWellsCount}
        totalWells={wells.length}
        onSelectCategory={(cat) => {
          setActiveTab('table');
        }}
      />

      {/* Tabbed Content Sections */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* TAB 1: Geospatial Map View */}
        {activeTab === 'map' && (
          <GroundwaterMap
            wells={wells}
            districts={districts}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            onSelectStation={setSelectedStation}
            searchQuery={searchQuery}
          />
        )}

        {/* TAB 2: District-wise Hydrogeological Analytics */}
        {activeTab === 'analytics' && (
          <DistrictAnalytics
            districts={districts}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            onViewDistrictOnMap={handleViewDistrictOnMap}
          />
        )}

        {/* TAB 3: Monitoring Station Registry & Data Table */}
        {activeTab === 'table' && (
          <StationsTable
            wells={wells}
            districts={districts}
            onSelectStation={setSelectedStation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* TAB 4: Seasonal Fluctuation & Rainfall Trends */}
        {activeTab === 'rainfall' && (
          <SeasonalTrendsChart
            stateStats={stateStats}
          />
        )}

        {/* TAB 5: Strategic Roadmap & AI/IoT Vision */}
        {activeTab === 'roadmap' && (
          <RoadmapVision />
        )}

      </main>

      {/* Station Deep-Dive Hydrograph Modal */}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          districtInfo={selectedDistrictInfo}
          onClose={() => setSelectedStation(null)}
        />
      )}

      {/* Footer */}
      <footer className="glass-card" style={{ padding: '1.25rem 1.5rem', marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Tamil Nadu Smart Groundwater Monitoring System (MVP)</strong> · Source: Central Ground Water Board (CGWB) 2024-25 Technical Report SECR/GWYB/TN/2024
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>818 Ground Truth Stations</span>
            <span>·</span>
            <span>4 Observation Epochs (May 24 – Jan 25)</span>
            <span>·</span>
            <span>Phase 1 Baseline Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
