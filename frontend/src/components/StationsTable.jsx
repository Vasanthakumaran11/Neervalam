import React, { useState, useMemo } from 'react';
import { 
  Table2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function StationsTable({ 
  wells, 
  districts, 
  onSelectStation, 
  searchQuery, 
  setSearchQuery 
}) {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [depthFilter, setDepthFilter] = useState('ALL');
  const [fluctuationFilter, setFluctuationFilter] = useState('ALL'); // 'ALL' | 'Rise' | 'Fall'
  
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filtered and sorted dataset
  const filteredData = useMemo(() => {
    let result = wells.filter(well => {
      // Search
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchLoc = well.location.toLowerCase().includes(q);
        const matchDist = well.district.toLowerCase().includes(q);
        if (!matchLoc && !matchDist) return false;
      }

      // District
      if (districtFilter !== 'ALL' && well.district !== districtFilter) {
        return false;
      }

      // Depth
      if (depthFilter !== 'ALL') {
        const lvl = well.latestLevel;
        if (lvl === null) return false;
        if (depthFilter === '<2m' && lvl >= 2.0) return false;
        if (depthFilter === '2-5m' && (lvl < 2.0 || lvl > 5.0)) return false;
        if (depthFilter === '5-10m' && (lvl < 5.0 || lvl > 10.0)) return false;
        if (depthFilter === '10-20m' && (lvl < 10.0 || lvl > 20.0)) return false;
        if (depthFilter === '>20m' && lvl <= 20.0) return false;
      }

      // Fluctuation
      if (fluctuationFilter !== 'ALL') {
        if (well.annualFluctuationType !== fluctuationFilter) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'id') {
        valA = a.id; valB = b.id;
      } else if (sortField === 'location') {
        valA = a.location.toLowerCase(); valB = b.location.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'district') {
        valA = a.district.toLowerCase(); valB = b.district.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'may') {
        valA = a.observations['2024-05'] ?? 999; valB = b.observations['2024-05'] ?? 999;
      } else if (sortField === 'aug') {
        valA = a.observations['2024-08'] ?? 999; valB = b.observations['2024-08'] ?? 999;
      } else if (sortField === 'nov') {
        valA = a.observations['2024-11'] ?? 999; valB = b.observations['2024-11'] ?? 999;
      } else if (sortField === 'jan') {
        valA = a.observations['2025-01'] ?? 999; valB = b.observations['2025-01'] ?? 999;
      } else if (sortField === 'delta') {
        valA = a.annualFluctuation ?? -999; valB = b.annualFluctuation ?? -999;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [wells, searchQuery, districtFilter, depthFilter, fluctuationFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle Sort Click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Station ID',
      'District',
      'Location',
      'Well Type',
      'Latitude',
      'Longitude',
      'May 2024 (m bgl)',
      'August 2024 (m bgl)',
      'November 2024 (m bgl)',
      'January 2025 (m bgl)',
      'Pre-to-Post Net Fluctuation (m)',
      'Fluctuation Type',
      'Category Status'
    ];

    const rows = filteredData.map(w => [
      w.id,
      `"${w.district}"`,
      `"${w.location}"`,
      `"${w.wellType}"`,
      w.latitude,
      w.longitude,
      w.observations['2024-05'] ?? '',
      w.observations['2024-08'] ?? '',
      w.observations['2024-11'] ?? '',
      w.observations['2025-01'] ?? '',
      w.annualFluctuation ?? '',
      w.annualFluctuationType,
      `"${w.category}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tamil_Nadu_Groundwater_Stations_CGWB_2024_25_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header & Export Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(14, 165, 233, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-primary)'
          }}>
            <Table2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Tamil Nadu Ground Water Station Registry</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Complete Annexure-I dataset with 818 individual monitoring wells & multi-season observations
            </p>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem' }}
        >
          <Download size={16} /> Export {filteredData.length} Stations (CSV)
        </button>

      </div>

      {/* Filter Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '0.75rem',
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* District Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>District:</span>
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#1e293b',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Districts (32)</option>
              {districts.map(d => (
                <option key={d.name} value={d.name}>{d.name} ({d.totalWells})</option>
              ))}
            </select>
          </div>

          {/* Depth Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Depth:</span>
            <select
              value={depthFilter}
              onChange={(e) => { setDepthFilter(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#1e293b',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Depths</option>
              <option value="<2m">&lt; 2.0m (Very Shallow)</option>
              <option value="2-5m">2.0 – 5.0m (Safe)</option>
              <option value="5-10m">5.0 – 10.0m (Moderate)</option>
              <option value="10-20m">10.0 – 20.0m (Semi-Critical)</option>
              <option value=">20m">&gt; 20.0m (Critical)</option>
            </select>
          </div>

          {/* Fluctuation Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trend:</span>
            <select
              value={fluctuationFilter}
              onChange={(e) => { setFluctuationFilter(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#1e293b',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Trends</option>
              <option value="Rise">Water Table Rose (Recharge)</option>
              <option value="Fall">Water Table Fell</option>
            </select>
          </div>

        </div>

        {/* Results Counter & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredData.length}</strong> matching stations
          </span>

          {(districtFilter !== 'ALL' || depthFilter !== 'ALL' || fluctuationFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setDistrictFilter('ALL');
                setDepthFilter('ALL');
                setFluctuationFilter('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cyan-primary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear filters
            </button>
          )}
        </div>

      </div>

      {/* Main Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              <th onClick={() => handleSort('id')} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ID <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('location')} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Station Location <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('district')} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  District <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('may')} style={{ padding: '0.75rem 0.85rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  May-24 (Pre) <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('aug')} style={{ padding: '0.75rem 0.85rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Aug-24 (SWM) <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('nov')} style={{ padding: '0.75rem 0.85rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Nov-24 (NEM) <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('jan')} style={{ padding: '0.75rem 0.85rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Jan-25 (Post) <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('delta')} style={{ padding: '0.75rem 0.85rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Recharge Delta <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((well, index) => {
              const obs = well.observations;
              const hasRise = well.annualFluctuationType === 'Rise';
              return (
                <tr 
                  key={well.id}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.25)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.25)'}
                >
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    #{well.id}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: '700', color: '#f8fafc' }}>{well.location}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{well.wellType}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--cyan-primary)', fontWeight: '600' }}>
                    {well.district}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                    {obs['2024-05'] !== null ? `${obs['2024-05']} m` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                    {obs['2024-08'] !== null ? `${obs['2024-08']} m` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                    {obs['2024-11'] !== null ? `${obs['2024-11']} m` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', fontWeight: '800', color: well.color }}>
                    {obs['2025-01'] !== null ? `${obs['2025-01']} m` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem' }}>
                    {well.annualFluctuation !== null ? (
                      <span style={{ 
                        color: hasRise ? '#34d399' : '#f87171', 
                        fontWeight: '700', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.2rem' 
                      }}>
                        {hasRise ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {hasRise ? `+${well.annualFluctuation}m` : `${well.annualFluctuation}m`}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '999px', 
                        fontWeight: '600',
                        background: `${well.color}20`,
                        color: well.color,
                        border: `1px solid ${well.color}40`
                      }}
                    >
                      {well.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => onSelectStation(well)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      title="Inspect Time-series Hydrograph"
                    >
                      <Eye size={13} /> Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              background: '#1e293b',
              color: 'var(--text-primary)',
              fontSize: '0.8rem'
            }}
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>

      </div>

    </div>
  );
}
