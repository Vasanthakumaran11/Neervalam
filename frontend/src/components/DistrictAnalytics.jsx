import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Building2, 
  ArrowUpDown, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck,
  Droplets,
  Layers
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DistrictAnalytics({ 
  districts, 
  selectedDistrict, 
  setSelectedDistrict, 
  onViewDistrictOnMap 
}) {
  const [sortBy, setSortBy] = useState('avgJan25'); // 'avgJan25' | 'avgFluctuation' | 'totalWells' | 'criticalCount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [districtSearch, setDistrictSearch] = useState('');

  // Sorted and filtered districts
  const sortedDistricts = useMemo(() => {
    let list = [...districts];

    if (districtSearch.trim() !== '') {
      list = list.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()));
    }

    list.sort((a, b) => {
      let valA = a[sortBy] ?? -999;
      let valB = b[sortBy] ?? -999;
      if (sortOrder === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return list;
  }, [districts, sortBy, sortOrder, districtSearch]);

  // Selected district object
  const activeDistrictData = useMemo(() => {
    if (selectedDistrict === 'ALL') {
      return districts.find(d => d.name === 'Coimbatore') || districts[0];
    }
    return districts.find(d => d.name === selectedDistrict) || districts[0];
  }, [districts, selectedDistrict]);

  // Chart data for district comparison
  const chartData = {
    labels: sortedDistricts.slice(0, 16).map(d => d.name),
    datasets: [
      {
        label: 'Post-Monsoon Depth Jan-25 (m bgl)',
        data: sortedDistricts.slice(0, 16).map(d => d.avgJan25),
        backgroundColor: sortedDistricts.slice(0, 16).map(d => {
          const val = d.avgJan25;
          if (val < 2.5) return 'rgba(6, 182, 212, 0.85)';
          if (val < 5.0) return 'rgba(16, 185, 129, 0.85)';
          if (val < 8.0) return 'rgba(245, 158, 11, 0.85)';
          return 'rgba(239, 68, 68, 0.85)';
        }),
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      {
        label: 'Pre-Monsoon Depth May-24 (m bgl)',
        data: sortedDistricts.slice(0, 16).map(d => d.avgMay24),
        backgroundColor: 'rgba(148, 163, 184, 0.35)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(14, 165, 233, 0.4)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Average Depth (m bgl)',
          color: '#94a3b8'
        },
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#cbd5e1', font: { size: 10 } }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header & Sort Control */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
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
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>District-Wise Hydrogeological Analytics</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Comparative assessment of groundwater tables and seasonal fluctuations across 32 districts
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            
            {/* Search */}
            <div style={{ position: 'relative', width: '180px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Filter district..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.6rem 0.4rem 1.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: '#1e293b',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Sort Criteria */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#1e293b',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="avgJan25">Sort by: Water Depth (Jan 2025)</option>
              <option value="avgFluctuation">Sort by: Recharge Rise (Delta)</option>
              <option value="totalWells">Sort by: Total Stations Monitored</option>
              <option value="criticalCount">Sort by: Critical Wells Count</option>
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Grid: Chart on Left, Active District Card on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '1.25rem' }}>
        
        {/* District Comparison Bar Chart */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>
              Comparative Water Levels (Pre vs Post-Monsoon)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Top 16 Districts by Current Sort
            </span>
          </div>

          <div style={{ height: '360px', width: '100%' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Selected District Deep-Dive Card */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                District Profile
              </span>
              <button 
                onClick={() => onViewDistrictOnMap(activeDistrictData.name)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                <MapPin size={12} /> View on Map
              </button>
            </div>
            
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc' }}>
              {activeDistrictData.name} District
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {activeDistrictData.totalWells} Ground Water Monitoring Wells Monitored
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Depth (Jan 2025)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#38bdf8' }}>
                {activeDistrictData.avgJan25 ? `${activeDistrictData.avgJan25} m` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                May: {activeDistrictData.avgMay24 ?? '-'}m
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Seasonal Recharge Delta</div>
              <div style={{ 
                fontSize: '1.35rem', 
                fontWeight: '800', 
                color: (activeDistrictData.avgFluctuation ?? 0) >= 0 ? '#34d399' : '#f87171' 
              }}>
                {(activeDistrictData.avgFluctuation ?? 0) >= 0 ? `+${activeDistrictData.avgFluctuation} m` : `${activeDistrictData.avgFluctuation} m`}
              </div>
              <div style={{ fontSize: '0.68rem', color: (activeDistrictData.avgFluctuation ?? 0) >= 0 ? '#34d399' : '#f87171' }}>
                {(activeDistrictData.avgFluctuation ?? 0) >= 0 ? 'Water Table Rose' : 'Water Table Fell'}
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Depth Extremes</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginTop: '0.2rem' }}>
                Min: {activeDistrictData.minDepth}m
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>
                Max: {activeDistrictData.maxDepth}m
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Safe vs Critical Ratio</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399', marginTop: '0.2rem' }}>
                Safe (&lt;5m): {activeDistrictData.safeCount}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f97316' }}>
                Critical (&gt;10m): {activeDistrictData.criticalCount}
              </div>
            </div>

          </div>

          {/* District Selector Pill Carousel */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
              Select District to Inspect:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.35rem', 
              maxHeight: '140px', 
              overflowY: 'auto',
              padding: '0.25rem',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              {districts.map(d => (
                <button
                  key={d.name}
                  onClick={() => setSelectedDistrict(d.name)}
                  style={{
                    background: activeDistrictData.name === d.name ? '#0284c7' : 'rgba(30, 41, 59, 0.7)',
                    color: activeDistrictData.name === d.name ? '#ffffff' : '#cbd5e1',
                    border: '1px solid ' + (activeDistrictData.name === d.name ? '#0ea5e9' : 'transparent'),
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontWeight: activeDistrictData.name === d.name ? '700' : '500'
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* All Districts Summary Table Grid */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>
            All 32 Districts Benchmark Matrix
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Official CGWB 2024-25 Dataset Compilation
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                <th style={{ padding: '0.65rem 0.85rem' }}>District</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Wells Monitored</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>May-24 (Pre)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Aug-24 (SWM)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Nov-24 (NEM)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Jan-25 (Post)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Recharge Delta</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Safe Wells (&lt;5m)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Critical Wells (&gt;10m)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedDistricts.map((d, index) => {
                const isSelected = activeDistrictData.name === d.name;
                const isRise = (d.avgFluctuation ?? 0) >= 0;
                return (
                  <tr 
                    key={d.name} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      background: isSelected ? 'rgba(14, 165, 233, 0.1)' : (index % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.2)')
                    }}
                  >
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: '700', color: isSelected ? 'var(--cyan-primary)' : 'var(--text-primary)' }}>
                      {d.name}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>{d.totalWells}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>{d.avgMay24 ?? '-'} m</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>{d.avgAug24 ?? '-'} m</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>{d.avgNov24 ?? '-'} m</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: '700', color: '#38bdf8' }}>{d.avgJan25 ?? '-'} m</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: '700', color: isRise ? '#34d399' : '#f87171' }}>
                      {d.avgFluctuation !== null ? `${isRise ? '+' : ''}${d.avgFluctuation} m` : '-'}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{d.safeCount}</span>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      {d.criticalCount > 0 ? (
                        <span className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>{d.criticalCount}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>0</span>
                      )}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <button
                        onClick={() => setSelectedDistrict(d.name)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
