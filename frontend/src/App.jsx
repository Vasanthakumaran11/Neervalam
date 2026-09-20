import React, { useState, useEffect, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import FarmerDashboard from './components/FarmerDashboard';
import Navbar from './components/Navbar';
import KpiMetrics from './components/KpiMetrics';
import GroundwaterMap from './components/GroundwaterMap';
import DistrictAnalytics from './components/DistrictAnalytics';
import StationsTable from './components/StationsTable';
import SeasonalTrendsChart from './components/SeasonalTrendsChart';
import RoadmapVision from './components/RoadmapVision';
import StationDetailModal from './components/StationDetailModal';
import { Home, Sprout, Building2, Sun, Moon } from 'lucide-react';

// Import processed CGWB dataset
import dataset from './data/groundwater_dataset.json';

export default function App() {
  // Client URL Route handling: '/' | '/users/:userId' | '/government'
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  
  // Government dashboard internal tabs
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'analytics' | 'table' | 'rainfall' | 'roadmap'
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth URL navigation helper
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Ensure white background applies ONLY for the landing page
  useEffect(() => {
    const isLanding = currentPath === '/' || currentPath === '';
    if (isLanding) {
      document.body.classList.add('landing-page-white');
    } else {
      document.body.classList.remove('landing-page-white');
    }
    return () => {
      document.body.classList.remove('landing-page-white');
    };
  }, [currentPath]);

  const { stateStats, districts, wells } = dataset;

  // Handler when a user selects a location from the search bar (station, district, or open-source place)
  const handleSelectLocation = (item) => {
    if (!item) return;

    if (item.type === 'station') {
      setSelectedStation(item.station);
      setActiveTab('map');
    } else if (item.type === 'district') {
      setSelectedDistrict(item.name);
      setActiveTab('map');
    } else if (item.type === 'place') {
      setSearchedLocation(item);
      setActiveTab('map');
    }
  };

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

  // ==========================================
  // ROUTE 1: Landing Page (Exclusive White Theme)
  // ==========================================
  if (currentPath === '/' || currentPath === '') {
    return (
      <div className="landing-page-root">
        <LandingPage onNavigate={navigateTo} />
      </div>
    );
  }

  // ==========================================
  // ROUTE 2: Farmer IoT Dashboard (/users/:userId)
  // ==========================================
  if (currentPath.startsWith('/users/')) {
    const rawUserId = currentPath.replace('/users/', '').split('/')[0] || 'selvam-thanjavur';
    return (
      <div className="app-container">
        {/* Global Breadcrumb & Role Switcher */}
        <div className="glass-card" style={{ 
          padding: '0.5rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '0.78rem', 
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              onClick={() => navigateTo('/')} 
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
            >
              <Home size={14} /> Home
            </button>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sprout size={14} /> Farmer Portal (/users/{rawUserId})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              className="btn btn-water" 
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => navigateTo('/government')}
            >
              <Building2 size={13} />
              <span>Government Hub</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={toggleTheme}
              style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#0ea5e9" />}
            </button>
          </div>
        </div>

        {/* Farmer Dashboard Body */}
        <FarmerDashboard 
          userId={rawUserId} 
          onNavigate={navigateTo} 
          theme={theme} 
        />
      </div>
    );
  }

  // ==========================================
  // ROUTE 3: State Government Hub (/government)
  // ==========================================
  return (
    <div className="app-container">
      
      {/* Top Breadcrumb Ribbon */}
      <div className="glass-card" style={{ 
        padding: '0.5rem 1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        fontSize: '0.78rem', 
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            onClick={() => navigateTo('/')} 
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
          >
            <Home size={14} /> Home
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: '#38bdf8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={14} /> State Government Groundwater Command Hub
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            className="btn btn-green" 
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            onClick={() => navigateTo('/users/selvam-thanjavur')}
          >
            <Sprout size={13} />
            <span>Launch Farmer Portal (Demo)</span>
          </button>
        </div>
      </div>

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
        wells={wells}
        districts={districts}
        onSelectLocation={handleSelectLocation}
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
            searchedLocation={searchedLocation}
            setSearchedLocation={setSearchedLocation}
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
