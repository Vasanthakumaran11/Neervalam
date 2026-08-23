import React from 'react';
import { 
  Droplets, 
  MapPin, 
  BarChart3, 
  Table2, 
  CloudRain, 
  Compass, 
  Moon, 
  Sun, 
  Search,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  searchQuery, 
  setSearchQuery,
  totalWells,
  districtsCount 
}) {
  return (
    <header className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
          }}>
            <Droplets size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #f8fafc 30%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TN Groundwater Hub
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                CGWB 2024-25
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Official Central Ground Water Board Ground Truth Monitoring & Hydrograph Analytics
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div style={{ flex: '1', maxWidth: '380px', minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search 818+ stations or 32 districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.4rem',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--cyan-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Tabs & Theme Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            background: 'rgba(30, 41, 59, 0.6)', 
            padding: '0.25rem', 
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            gap: '0.2rem'
          }}>
            <button 
              className={`btn btn-tab ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
              title="Geospatial Map View"
            >
              <Compass size={15} />
              <span>Map View</span>
            </button>
            <button 
              className={`btn btn-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              title="District Analytics"
            >
              <BarChart3 size={15} />
              <span>District Analytics</span>
            </button>
            <button 
              className={`btn btn-tab ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => setActiveTab('table')}
              title="Monitoring Stations Registry"
            >
              <Table2 size={15} />
              <span>Station Registry</span>
            </button>
            <button 
              className={`btn btn-tab ${activeTab === 'rainfall' ? 'active' : ''}`}
              onClick={() => setActiveTab('rainfall')}
              title="Monsoon & Fluctuation Trends"
            >
              <CloudRain size={15} />
              <span>Rainfall & Trends</span>
            </button>
            <button 
              className={`btn btn-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
              title="Smart Groundwater AI & IoT Vision"
            >
              <Sparkles size={15} color="#38bdf8" />
              <span>AI Roadmap</span>
            </button>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ padding: '0.55rem', borderRadius: '10px' }}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#0ea5e9" />}
          </button>
        </div>
      </div>
    </header>
  );
}
