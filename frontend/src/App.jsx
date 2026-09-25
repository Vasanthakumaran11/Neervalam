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
import GovernmentDroughtSection from './components/GovernmentDroughtSection';
import StationDetailModal from './components/StationDetailModal';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home, Sprout, Building2, Sun, Moon, LogOut, User, ShieldAlert, ArrowRight } from 'lucide-react';

// Import processed CGWB dataset
import dataset from './data/groundwater_dataset.json';

// ─── Inner App (has access to AuthContext) ────────────────────────────────────
function AppInner() {
  const { user, role, isAuthenticated, logout, isLoading } = useAuth();

  // Client URL Route handling
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');

  // Government dashboard internal tabs
  const [activeTab, setActiveTab] = useState('map');
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  // Login modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Sync browser back/forward
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
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

  // Landing page white background
  useEffect(() => {
    const isLanding = currentPath === '/' || currentPath === '';
    if (isLanding) {
      document.body.classList.add('landing-page-white');
    } else {
      document.body.classList.remove('landing-page-white');
    }
    return () => document.body.classList.remove('landing-page-white');
  }, [currentPath]);

  const { stateStats, districts, wells } = dataset;

  const handleSelectLocation = (item) => {
    if (!item) return;
    if (item.type === 'station') { setSelectedStation(item.station); setActiveTab('map'); }
    else if (item.type === 'district') { setSelectedDistrict(item.name); setActiveTab('map'); }
    else if (item.type === 'place') { setSearchedLocation(item); setActiveTab('map'); }
  };

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

  const selectedDistrictInfo = useMemo(() => {
    if (!selectedStation) return null;
    return districts.find(d => d.name === selectedStation.district) || null;
  }, [selectedStation, districts]);

  const handleViewDistrictOnMap = (districtName) => {
    setSelectedDistrict(districtName);
    setActiveTab('map');
  };

  // ── After login success: route based on role ──────────────────────────────
  const handleLoginSuccess = (loggedInUser) => {
    setLoginModalOpen(false);
    if (loggedInUser?.role === 'government_official') {
      navigateTo('/government');
    } else {
      const farmerId = loggedInUser?.iot_hub_id || loggedInUser?.id || 'iot-erd-102';
      navigateTo(`/users/${farmerId}`);
    }
  };

  // ── Auth Guard: If navigating to protected route without auth ─────────────
  const isProtectedRoute = currentPath.startsWith('/users/') || currentPath === '/government';
  useEffect(() => {
    // Wait until auth is loaded before deciding
    if (isLoading) return;
    if (isProtectedRoute && !isAuthenticated) {
      setLoginModalOpen(true);
    }
  }, [isProtectedRoute, isAuthenticated, isLoading]);

  // ── User pill for breadcrumb bar ──────────────────────────────────────────
  const UserPill = () => {
    if (!isAuthenticated || !user) return null;
    const roleColor = role === 'farmer' ? '#10b981' : '#38bdf8';
    const roleLabel = role === 'farmer' ? '🌾 Farmer' : '🏛️ Gov Official';
    const profileName = user.full_name || user.phone || user.id;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '999px', padding: '0.3rem 0.75rem',
          fontSize: '0.75rem', color: roleColor, fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '0.35rem'
        }}>
          <User size={12} />
          <span>{profileName}</span>
          {user.job_title && (
            <>
              <span style={{ opacity: 0.55 }}>·</span>
              <span>{user.job_title}</span>
            </>
          )}
          <span style={{ opacity: 0.55 }}>·</span>
          <span>{roleLabel}</span>
        </div>
        <button
          onClick={() => { logout(); navigateTo('/'); }}
          title="Logout"
          style={{
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '8px', color: '#f87171', cursor: 'pointer',
            padding: '0.3rem 0.55rem', display: 'flex', alignItems: 'center',
            fontSize: '0.72rem', gap: '0.3rem', fontWeight: '600'
          }}
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    );
  };

  // ==========================================================================
  // ROUTE 1: Landing Page
  // ==========================================================================
  if (currentPath === '/' || currentPath === '') {
    return (
      <div className="landing-page-root">
        <LandingPage
          onNavigate={navigateTo}
          onLoginClick={() => setLoginModalOpen(true)}
          isAuthenticated={isAuthenticated}
          userRole={role}
          userId={user?.id || 'selvam-thanjavur'}
        />
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // ==========================================================================
  // ROUTE 2: Farmer IoT Dashboard (/users/:userId)
  // ==========================================================================
  if (currentPath.startsWith('/users/')) {
    const rawUserId = currentPath.replace('/users/', '').split('/')[0] || 'iot-erd-102';
    return (
      <div className="app-container">
        <div className="glass-card" style={{
          padding: '0.5rem 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.78rem',
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}>
              <Home size={14} /> Home
            </button>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sprout size={14} /> Farmer Portal
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <UserPill />
            <button className="btn btn-water" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => navigateTo('/government')}>
              <Building2 size={13} /> Government Hub
            </button>
            <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#0ea5e9" />}
            </button>
          </div>
        </div>

        <FarmerDashboard userId={rawUserId} userProfile={user} onNavigate={navigateTo} theme={theme} />

        <LoginModal isOpen={loginModalOpen} onClose={() => { setLoginModalOpen(false); navigateTo('/'); }} onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // ==========================================================================
  // ROUTE 3: State Government Hub (/government)
  // ==========================================================================
  return (
    <div className="app-container">
      <div className="glass-card" style={{
        padding: '0.5rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '0.78rem',
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}>
            <Home size={14} /> Home
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: '#38bdf8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={14} /> State Government Groundwater Command Hub
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <UserPill />
          <button className="btn btn-green" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => navigateTo(`/users/${user?.iot_hub_id || user?.id || 'iot-erd-102'}`)}>
            <Sprout size={13} /> Farmer Portal
          </button>
        </div>
      </div>

      <Navbar
        activeTab={activeTab} setActiveTab={setActiveTab}
        theme={theme} toggleTheme={toggleTheme}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        totalWells={wells.length} districtsCount={districts.length}
        wells={wells} districts={districts}
        onSelectLocation={handleSelectLocation}
      />

      <KpiMetrics
        stateStats={stateStats}
        filteredCount={filteredWellsCount}
        totalWells={wells.length}
        onSelectCategory={() => setActiveTab('table')}
      />

      {/* AI Drought Early Warning Quick Access Banner */}
      <div 
        className="glass-card" 
        onClick={() => setActiveTab('drought')}
        style={{
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          cursor: 'pointer',
          background: activeTab === 'drought'
            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(14, 165, 233, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <ShieldAlert size={14} /> LIVE AI DROUGHT HUB
          </div>
          <span style={{ fontSize: '0.86rem', fontWeight: '600', color: '#f8fafc' }}>
            Erode Aquifer Dual-Signal Evaluation Active · Real-Time CGWB Check Dam & ARS Recommendations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: '700' }}>
          <span>{activeTab === 'drought' ? 'Currently Viewing AI Hub' : 'Open Drought Hub & View ARS Structures'}</span>
          <ArrowRight size={14} />
        </div>
      </div>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeTab === 'map' && (
          <GroundwaterMap
            wells={wells} districts={districts}
            selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict}
            onSelectStation={setSelectedStation}
            searchQuery={searchQuery}
            searchedLocation={searchedLocation} setSearchedLocation={setSearchedLocation}
          />
        )}
        {activeTab === 'analytics' && (
          <DistrictAnalytics
            districts={districts}
            selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict}
            onViewDistrictOnMap={handleViewDistrictOnMap}
          />
        )}
        {activeTab === 'table' && (
          <StationsTable
            wells={wells} districts={districts}
            onSelectStation={setSelectedStation}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          />
        )}
        {activeTab === 'rainfall' && <SeasonalTrendsChart stateStats={stateStats} />}
        {activeTab === 'roadmap' && <RoadmapVision />}
        {activeTab === 'drought' && <GovernmentDroughtSection />}
      </main>

      {selectedStation && (
        <StationDetailModal
          station={selectedStation} districtInfo={selectedDistrictInfo}
          onClose={() => setSelectedStation(null)}
        />
      )}

      <footer className="glass-card" style={{ padding: '1.25rem 1.5rem', marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Tamil Nadu Smart Groundwater Monitoring System (MVP)</strong> · Source: CGWB 2024-25
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

      <LoginModal isOpen={loginModalOpen} onClose={() => { setLoginModalOpen(false); navigateTo('/'); }} onSuccess={handleLoginSuccess} />
    </div>
  );
}

// ==========================================================================
// ROOT App — wraps everything in AuthProvider
// ==========================================================================
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
