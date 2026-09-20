import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Loader2,
  Navigation,
  Building2,
  MapPinned,
  ArrowRight
} from 'lucide-react';
import { searchTamilNaduPlaces } from '../services/geocodingService';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  searchQuery, 
  setSearchQuery,
  totalWells = 818,
  districtsCount = 32,
  wells = [],
  districts = [],
  onSelectLocation
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [stationMatches, setStationMatches] = useState([]);
  const [districtMatches, setDistrictMatches] = useState([]);
  const [placeMatches, setPlaceMatches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search effect: Instant local + debounced open-source geocoding
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setStationMatches([]);
      setDistrictMatches([]);
      setPlaceMatches([]);
      setIsOpen(false);
      setIsLoadingPlaces(false);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      return;
    }

    const q = searchQuery.trim().toLowerCase();

    // 1. Instant local district matches
    const matchedDists = (districts || [])
      .filter(d => d.name.toLowerCase().includes(q))
      .slice(0, 2);
    setDistrictMatches(matchedDists);

    // 2. Instant local station matches
    const matchedWells = (wells || [])
      .filter(w => w.location.toLowerCase().includes(q) || w.district.toLowerCase().includes(q))
      .slice(0, 4);
    setStationMatches(matchedWells);

    setIsOpen(true);
    setHighlightedIndex(-1);

    // 3. Debounced Open-Source Tamil Nadu Places Search
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsLoadingPlaces(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const places = await searchTamilNaduPlaces(searchQuery.trim(), 4);
        setPlaceMatches(places);
      } catch (e) {
        setPlaceMatches([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery, wells, districts]);

  // Combined selectable items array for keyboard navigation
  const allSelectableItems = [
    ...districtMatches.map(d => ({ type: 'district', data: d })),
    ...stationMatches.map(s => ({ type: 'station', data: s })),
    ...placeMatches.map(p => ({ type: 'place', data: p }))
  ];

  const handleSelectItem = (item) => {
    setIsOpen(false);
    if (!item) return;

    if (item.type === 'station') {
      setSearchQuery(item.data.location);
      if (onSelectLocation) {
        onSelectLocation({
          type: 'station',
          station: item.data
        });
      }
    } else if (item.type === 'district') {
      setSearchQuery(item.data.name);
      if (onSelectLocation) {
        onSelectLocation({
          type: 'district',
          name: item.data.name,
          center: item.data.center
        });
      }
    } else if (item.type === 'place') {
      setSearchQuery(item.data.title);
      if (onSelectLocation) {
        onSelectLocation({
          type: 'place',
          name: item.data.title,
          displayName: item.data.subtitle,
          lat: item.data.lat,
          lon: item.data.lon
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || allSelectableItems.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
        // Direct search on Enter: geocode the query immediately
        setIsLoadingPlaces(true);
        searchTamilNaduPlaces(searchQuery.trim(), 1).then(places => {
          setIsLoadingPlaces(false);
          if (places && places.length > 0) {
            handleSelectItem({ type: 'place', data: places[0] });
          }
        });
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < allSelectableItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : allSelectableItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < allSelectableItems.length) {
        handleSelectItem(allSelectableItems[highlightedIndex]);
      } else if (allSelectableItems.length > 0) {
        handleSelectItem(allSelectableItems[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <header className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1000 }}>
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
                Neervalam (நீர்வளம்)
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                CGWB 2024-25
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Smart Groundwater Monitoring, Prediction & Recharge Recommendation System
            </p>
          </div>
        </div>

        {/* Global Search with Live Open-Source Place Finder */}
        <div 
          ref={containerRef}
          style={{ flex: '1', maxWidth: '440px', minWidth: '260px', position: 'relative' }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search 
              size={16} 
              color="var(--text-muted)" 
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Tamil Nadu places, towns or 818+ wells..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery && searchQuery.trim().length >= 2) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                padding: '0.6rem 2.4rem 0.6rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid ' + (isOpen ? 'var(--cyan-primary)' : 'var(--border-subtle)'),
                background: 'rgba(15, 23, 42, 0.75)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                boxShadow: isOpen ? '0 0 12px rgba(14, 165, 233, 0.25)' : 'none',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
              }}
            />
            
            <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {isLoadingPlaces && (
                <Loader2 size={15} color="var(--cyan-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              )}
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsOpen(false);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown Menu */}
          {isOpen && (
            <div 
              className="search-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
                maxHeight: '360px',
                overflowY: 'auto',
                zIndex: 9999,
                padding: '0.5rem 0'
              }}
            >
              {/* Header Label */}
              <div style={{ padding: '0.35rem 0.85rem 0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Location & Groundwater Finder
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--cyan-primary)' }}>
                  <Compass size={11} /> Open-Source Maps
                </span>
              </div>

              {/* No results message */}
              {allSelectableItems.length === 0 && !isLoadingPlaces && (
                <div style={{ padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <MapPin size={22} style={{ margin: '0 auto 0.4rem', opacity: 0.5 }} />
                  <div>No direct matches found for "{searchQuery}"</div>
                  <div style={{ fontSize: '0.74rem', marginTop: '0.25rem', color: 'var(--cyan-primary)' }}>
                    Press Enter to geocode across Tamil Nadu
                  </div>
                </div>
              )}

              {/* District Matches */}
              {districtMatches.length > 0 && (
                <div style={{ padding: '0.35rem 0' }}>
                  <div style={{ padding: '0.2rem 0.85rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Districts
                  </div>
                  {districtMatches.map((dist, idx) => {
                    const itemIndex = idx;
                    const isHighlighted = highlightedIndex === itemIndex;
                    return (
                      <div
                        key={`dist-${dist.name}`}
                        onClick={() => handleSelectItem({ type: 'district', data: dist })}
                        onMouseEnter={() => setHighlightedIndex(itemIndex)}
                        style={{
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: isHighlighted ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Building2 size={16} color="var(--purple-accent)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {dist.name} District
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {dist.totalWells || 0} monitoring wells registered
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          District Center
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Station Matches */}
              {stationMatches.length > 0 && (
                <div style={{ padding: '0.35rem 0', borderTop: districtMatches.length > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                  <div style={{ padding: '0.2rem 0.85rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    CGWB Monitoring Wells
                  </div>
                  {stationMatches.map((station, idx) => {
                    const itemIndex = districtMatches.length + idx;
                    const isHighlighted = highlightedIndex === itemIndex;
                    return (
                      <div
                        key={`station-${station.id}`}
                        onClick={() => handleSelectItem({ type: 'station', data: station })}
                        onMouseEnter={() => setHighlightedIndex(itemIndex)}
                        style={{
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: isHighlighted ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Droplets size={16} color={station.color || 'var(--cyan-primary)'} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {station.location}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {station.district} · {station.wellType || 'Dug Well'}
                            </div>
                          </div>
                        </div>
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            background: `${station.color || '#0ea5e9'}20`,
                            color: station.color || '#0ea5e9',
                            border: `1px solid ${station.color || '#0ea5e9'}40`
                          }}
                        >
                          {station.latestLevel !== null ? `${station.latestLevel}m bgl` : 'No Data'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Open-Source Tamil Nadu Places Matches */}
              {placeMatches.length > 0 && (
                <div style={{ padding: '0.35rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ padding: '0.2rem 0.85rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Places & Towns (OpenStreetMap)</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--cyan-primary)' }}>Pinpoint on Map</span>
                  </div>
                  {placeMatches.map((place, idx) => {
                    const itemIndex = districtMatches.length + stationMatches.length + idx;
                    const isHighlighted = highlightedIndex === itemIndex;
                    return (
                      <div
                        key={place.id}
                        onClick={() => handleSelectItem({ type: 'place', data: place })}
                        onMouseEnter={() => setHighlightedIndex(itemIndex)}
                        style={{
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: isHighlighted ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <MapPinned size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {place.title}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {place.subtitle}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                          <Navigation size={10} /> Find
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Quick Action hint */}
              <div style={{ padding: '0.45rem 0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.07)', fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2, 6, 23, 0.4)' }}>
                <span>Use ↑↓ to navigate · Enter to select</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--cyan-primary)' }}>
                  Fly to location <ArrowRight size={11} />
                </span>
              </div>

            </div>
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
