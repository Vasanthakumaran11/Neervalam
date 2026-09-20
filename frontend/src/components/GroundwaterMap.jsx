import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Eye, 
  Filter, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Search,
  MapPinned
} from 'lucide-react';
import { findNearestWellStation } from '../services/geocodingService';

// Custom Map Controller to smoothly fly to selected coordinates/district
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Function to generate custom colorful SVG marker icons for wells
function createCustomMarkerIcon(color, level) {
  const displayVal = level !== null && level !== undefined ? Number(level).toFixed(1) : '?';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="30" height="38">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M18 0 C8 0 0 8 0 18 C0 29 18 44 18 44 C18 44 36 29 36 18 C36 8 28 0 18 0 Z" 
            fill="${color}" 
            stroke="#ffffff" 
            stroke-width="1.5" 
            filter="url(#shadow)"/>
      <circle cx="18" cy="17" r="11" fill="#0f172a" stroke="#ffffff" stroke-width="1"/>
      <text x="18" y="21" font-size="9" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" fill="#f8fafc" text-anchor="middle">${displayVal}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -38]
  });
}

// Function to generate distinctive pulsing marker for searched Tamil Nadu locations
function createSearchedLocationIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 54" width="40" height="48">
      <defs>
        <radialGradient id="searchedGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
        </radialGradient>
        <filter id="pulseShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0ea5e9" flood-opacity="0.8"/>
        </filter>
      </defs>
      <circle cx="22" cy="46" r="8" fill="url(#searchedGlow)"/>
      <path d="M22 2 C11 2 2 11 2 22 C2 35 22 52 22 52 C22 52 42 35 42 22 C42 11 33 2 22 2 Z" 
            fill="#0ea5e9" 
            stroke="#ffffff" 
            stroke-width="2.5" 
            filter="url(#pulseShadow)"/>
      <circle cx="22" cy="22" r="9" fill="#0f172a" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="22" cy="22" r="4" fill="#38bdf8"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-searched-marker',
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48]
  });
}

export default function GroundwaterMap({ 
  wells, 
  districts, 
  selectedDistrict, 
  setSelectedDistrict, 
  onSelectStation,
  searchQuery,
  searchedLocation,
  setSearchedLocation
}) {
  const [mapTile, setMapTile] = useState('streets'); // 'streets' | 'satellite'
  const [selectedDepthBracket, setSelectedDepthBracket] = useState(null); // null by default - markers hidden initially
  const [mapCenter, setMapCenter] = useState([11.1271, 78.6569]);
  const [mapZoom, setMapZoom] = useState(7);

  // Map Tile Layers
  const tileUrls = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    streets: '&copy; OpenStreetMap contributors',
    satellite: '&copy; Esri &mdash; Earthstar Geographics'
  };

  // Filter wells based on district, depth bracket, and search query
  const filteredWells = useMemo(() => {
    // If no category is selected, no district selected, and no search query, return empty array
    if (!selectedDepthBracket && selectedDistrict === 'ALL' && (!searchQuery || searchQuery.trim() === '')) {
      return [];
    }

    return wells.filter(well => {
      // District filter
      if (selectedDistrict !== 'ALL' && well.district !== selectedDistrict) {
        return false;
      }

      // Depth bracket filter
      if (selectedDepthBracket && selectedDepthBracket !== 'ALL') {
        const lvl = well.latestLevel;
        if (lvl === null) return false;
        if (selectedDepthBracket === '<2m' && lvl >= 2.0) return false;
        if (selectedDepthBracket === '2-5m' && (lvl < 2.0 || lvl > 5.0)) return false;
        if (selectedDepthBracket === '5-10m' && (lvl < 5.0 || lvl > 10.0)) return false;
        if (selectedDepthBracket === '10-20m' && (lvl < 10.0 || lvl > 20.0)) return false;
        if (selectedDepthBracket === '>20m' && lvl <= 20.0) return false;
      }

      // Search Query filter
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchLocation = well.location.toLowerCase().includes(q);
        const matchDistrict = well.district.toLowerCase().includes(q);
        if (!matchLocation && !matchDistrict) return false;
      }

      return true;
    });
  }, [wells, selectedDistrict, selectedDepthBracket, searchQuery]);

  // Nearest well station to searched location
  const nearestWellToSearch = useMemo(() => {
    if (!searchedLocation || !searchedLocation.lat || !searchedLocation.lon) return null;
    return findNearestWellStation(searchedLocation.lat, searchedLocation.lon, wells);
  }, [searchedLocation, wells]);

  // When searched location changes, fly directly to it at close zoom
  useEffect(() => {
    if (searchedLocation && searchedLocation.lat && searchedLocation.lon) {
      setMapCenter([searchedLocation.lat, searchedLocation.lon]);
      setMapZoom(13);
    }
  }, [searchedLocation]);

  // When district changes, reposition map center
  useEffect(() => {
    if (selectedDistrict === 'ALL') {
      setMapCenter([11.1271, 78.6569]);
      setMapZoom(7);
    } else {
      const distInfo = districts.find(d => d.name === selectedDistrict);
      if (distInfo && distInfo.center) {
        setMapCenter(distInfo.center);
        setMapZoom(10);
      }
    }
  }, [selectedDistrict, districts]);

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Map Header & Filter Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--cyan-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Geospatial Monitoring Grid</h2>
          </div>

          <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
            Showing {filteredWells.length} / {wells.length} Wells
          </span>

          {selectedDistrict !== 'ALL' && (
            <span className="badge badge-emerald">
              District: {selectedDistrict}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* District Dropdown Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: '#1e293b',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Districts (32)</option>
            {districts.map(d => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.totalWells} wells)
              </option>
            ))}
          </select>

          {/* Map Layer Switcher */}
          <div style={{ display: 'flex', background: '#1e293b', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button 
              className={`btn btn-tab ${mapTile === 'streets' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => setMapTile('streets')}
            >
              Streets
            </button>
            <button 
              className={`btn btn-tab ${mapTile === 'satellite' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => setMapTile('satellite')}
            >
              Satellite
            </button>
          </div>

          {/* Reset View Button */}
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => {
              setSelectedDistrict('ALL');
              setSelectedDepthBracket(null); // Reset back to default hidden markings
              if (setSearchedLocation) setSearchedLocation(null);
              setMapCenter([11.1271, 78.6569]);
              setMapZoom(7);
            }}
            title="Reset Map to Default (Hidden Markers)"
          >
            <RotateCcw size={14} />
            <span>Reset Map</span>
          </button>
        </div>
      </div>

      {/* Searched Location Notification Ribbon */}
      {searchedLocation && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.22) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '10px',
          fontSize: '0.82rem',
          flexWrap: 'wrap',
          gap: '0.6rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <MapPinned size={18} color="var(--cyan-primary)" />
            <span>
              <strong>Pinpointed Location:</strong> {searchedLocation.name} {searchedLocation.displayName ? `· ${searchedLocation.displayName}` : ''}
            </span>
            {nearestWellToSearch && (
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Nearest Well: {nearestWellToSearch.location} ({nearestWellToSearch.distanceKm} km · {nearestWellToSearch.latestLevel}m bgl)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => {
                setMapCenter([searchedLocation.lat, searchedLocation.lon]);
                setMapZoom(13);
              }}
            >
              Recenter
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: '#f87171' }}
              onClick={() => setSearchedLocation && setSearchedLocation(null)}
            >
              ✕ Clear Location Pin
            </button>
          </div>
        </div>
      )}

      {/* Depth Category Quick Filter Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={14} /> Click Category to View Wells:
        </span>
        
        <button
          onClick={() => setSelectedDepthBracket(prev => prev === 'ALL' ? null : 'ALL')}
          style={{
            background: selectedDepthBracket === 'ALL' ? '#0284c7' : 'transparent',
            color: selectedDepthBracket === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid ' + (selectedDepthBracket === 'ALL' ? '#0284c7' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === 'ALL' ? '✓ All Wells (818)' : 'Show All Wells (818)'}
        </button>

        <button
          onClick={() => setSelectedDepthBracket(prev => prev === '<2m' ? null : '<2m')}
          style={{
            background: selectedDepthBracket === '<2m' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
            color: '#06b6d4',
            border: '1px solid ' + (selectedDepthBracket === '<2m' ? '#06b6d4' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === '<2m' ? '✓ < 2m (Very Shallow)' : '< 2m (Very Shallow / Safe)'}
        </button>

        <button
          onClick={() => setSelectedDepthBracket(prev => prev === '2-5m' ? null : '2-5m')}
          style={{
            background: selectedDepthBracket === '2-5m' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: '#10b981',
            border: '1px solid ' + (selectedDepthBracket === '2-5m' ? '#10b981' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === '2-5m' ? '✓ 2 – 5m (Safe)' : '2 – 5m (Shallow / Safe)'}
        </button>

        <button
          onClick={() => setSelectedDepthBracket(prev => prev === '5-10m' ? null : '5-10m')}
          style={{
            background: selectedDepthBracket === '5-10m' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            color: '#f59e0b',
            border: '1px solid ' + (selectedDepthBracket === '5-10m' ? '#f59e0b' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === '5-10m' ? '✓ 5 – 10m (Moderate)' : '5 – 10m (Moderate)'}
        </button>

        <button
          onClick={() => setSelectedDepthBracket(prev => prev === '10-20m' ? null : '10-20m')}
          style={{
            background: selectedDepthBracket === '10-20m' ? 'rgba(249, 115, 22, 0.25)' : 'transparent',
            color: '#f97316',
            border: '1px solid ' + (selectedDepthBracket === '10-20m' ? '#f97316' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === '10-20m' ? '✓ 10 – 20m (Semi-Critical)' : '10 – 20m (Semi-Critical)'}
        </button>

        <button
          onClick={() => setSelectedDepthBracket(prev => prev === '>20m' ? null : '>20m')}
          style={{
            background: selectedDepthBracket === '>20m' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
            color: '#ef4444',
            border: '1px solid ' + (selectedDepthBracket === '>20m' ? '#ef4444' : 'var(--border-subtle)'),
            padding: '0.2rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {selectedDepthBracket === '>20m' ? '✓ > 20m (Critical)' : '> 20m (Critical / Deep)'}
        </button>

        {selectedDepthBracket && (
          <button
            onClick={() => setSelectedDepthBracket(null)}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: '600',
              marginLeft: 'auto'
            }}
          >
            ✕ Hide Markings
          </button>
        )}
      </div>

      {/* Map Container */}
      <div style={{ height: '580px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution={tileAttributions[mapTile]}
            url={tileUrls[mapTile]}
          />

          {/* Searched Tamil Nadu Place Marker */}
          {searchedLocation && searchedLocation.lat && searchedLocation.lon && (
            <Marker
              position={[searchedLocation.lat, searchedLocation.lon]}
              icon={createSearchedLocationIcon()}
              zIndexOffset={1000}
            >
              <Popup autoPan={true}>
                <div style={{ minWidth: '240px', padding: '0.35rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.3)', paddingBottom: '0.45rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-primary)', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      <MapPinned size={14} /> Open-Source Tamil Nadu Place
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: '0.2rem 0' }}>
                      {searchedLocation.name}
                    </h4>
                    {searchedLocation.displayName && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                        {searchedLocation.displayName}
                      </div>
                    )}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                      {searchedLocation.lat.toFixed(4)}°N, {searchedLocation.lon.toFixed(4)}°E
                    </div>
                  </div>

                  {nearestWellToSearch ? (
                    <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          NEAREST CGWB WELL
                        </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                          {nearestWellToSearch.distanceKm} km away
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {nearestWellToSearch.location} ({nearestWellToSearch.district})
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Water Level:</span>
                        <span style={{ fontWeight: '800', color: nearestWellToSearch.color, fontSize: '0.88rem' }}>
                          {nearestWellToSearch.latestLevel !== null ? `${nearestWellToSearch.latestLevel}m bgl` : 'No Data'}
                        </span>
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.35rem', fontSize: '0.75rem' }}
                        onClick={() => onSelectStation(nearestWellToSearch)}
                      >
                        <Eye size={13} /> View Well Hydrograph
                      </button>
                    </div>
                  ) : null}

                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.3rem', fontSize: '0.72rem', color: '#f87171' }}
                    onClick={() => setSearchedLocation && setSearchedLocation(null)}
                  >
                    ✕ Dismiss Pin
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {filteredWells.map(well => {
            const icon = createCustomMarkerIcon(well.color, well.latestLevel);
            const obs = well.observations;
            const hasRise = well.annualFluctuationType === 'Rise';

            return (
              <Marker
                key={well.id}
                position={[well.latitude, well.longitude]}
                icon={icon}
              >
                <Popup>
                  <div style={{ minWidth: '220px', padding: '0.25rem' }}>
                    
                    {/* Header */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontWeight: '700' }}>
                          {well.district}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          ID: #{well.id}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', margin: '0.15rem 0' }}>
                        {well.location}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {well.wellType}
                      </span>
                    </div>

                    {/* Latest Water Level Card */}
                    <div style={{ 
                      background: 'rgba(15, 23, 42, 0.8)', 
                      padding: '0.5rem', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Latest (Jan 2025)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: well.color }}>
                          {well.latestLevel !== null ? `${well.latestLevel} m` : 'N/A'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pre vs Post Delta</div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: '700', 
                          color: hasRise ? '#34d399' : '#f87171',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '0.2rem'
                        }}>
                          {hasRise ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {well.annualFluctuation !== null ? `${Math.abs(well.annualFluctuation)}m` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* 4-Season Mini Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: '0.25rem', 
                      fontSize: '0.68rem',
                      textAlign: 'center',
                      marginBottom: '0.6rem'
                    }}>
                      <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem 0.15rem', borderRadius: '4px' }}>
                        <div style={{ color: 'var(--text-muted)' }}>May-24</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{obs['2024-05'] ?? '-'}m</div>
                      </div>
                      <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem 0.15rem', borderRadius: '4px' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Aug-24</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{obs['2024-08'] ?? '-'}m</div>
                      </div>
                      <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem 0.15rem', borderRadius: '4px' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Nov-24</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{obs['2024-11'] ?? '-'}m</div>
                      </div>
                      <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem 0.15rem', borderRadius: '4px' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Jan-25</div>
                        <div style={{ fontWeight: '600', color: '#38bdf8' }}>{obs['2025-01'] ?? '-'}m</div>
                      </div>
                    </div>

                    {/* Inspect Button */}
                    <button 
                      onClick={() => onSelectStation(well)}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye size={13} /> Inspect Hydrograph & AI Ready Profile
                    </button>

                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Empty State Prompt Overlay when no markings are active */}
        {filteredWells.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(14, 165, 233, 0.4)',
            borderRadius: '14px',
            padding: '1rem 1.5rem',
            boxShadow: 'var(--shadow-lg), 0 0 20px rgba(14, 165, 233, 0.25)',
            textAlign: 'center',
            maxWidth: '480px',
            width: '90%',
            animation: 'fadeIn 0.3s ease-out',
            pointerEvents: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc' }}>
                Map View Ready · Markings Hidden by Default
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Click any <strong>Depth Category</strong> above or choose a <strong>District</strong> to display station location pins on the map.
            </p>
          </div>
        )}

        {/* Map Floating Legend */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          fontSize: '0.72rem',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Groundwater Depth (m bgl)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
              <span>&lt; 2.0 m (Very Shallow)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span>2.0 – 5.0 m (Safe)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span>5.0 – 10.0 m (Moderate)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }} />
              <span>10.0 – 20.0 m (Semi-Critical)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span>&gt; 20.0 m (Critical)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
