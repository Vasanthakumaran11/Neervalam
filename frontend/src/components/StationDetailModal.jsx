import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Compass, 
  Download, 
  CheckCircle2, 
  Info,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StationDetailModal({ station, districtInfo, onClose }) {
  if (!station) return null;

  const obs = station.observations;
  const labels = ['May 2024 (Pre-Monsoon)', 'August 2024 (SWM)', 'November 2024 (NEM)', 'January 2025 (Post-Monsoon)'];
  const values = [
    obs['2024-05'],
    obs['2024-08'],
    obs['2024-11'],
    obs['2025-01']
  ];

  // District average baseline
  const districtAvgValues = districtInfo ? [
    districtInfo.avgMay24,
    districtInfo.avgAug24,
    districtInfo.avgNov24,
    districtInfo.avgJan25
  ] : [];

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: `${station.location} (m bgl)`,
        data: values,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 8,
        pointRadius: 6,
        borderWidth: 3,
        fill: true,
        tension: 0.35
      },
      ...(districtInfo ? [{
        label: `${districtInfo.name} District Avg (m bgl)`,
        data: districtAvgValues,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 4,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 2,
        tension: 0.2
      }] : [])
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
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(14, 165, 233, 0.4)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `Depth: ${context.parsed.y !== null ? context.parsed.y.toFixed(2) + ' m bgl' : 'No Data'}`;
          }
        }
      }
    },
    scales: {
      y: {
        // In hydrogeology, y-axis is often inverted so water table rise goes upward or intuitive depth
        reverse: true, // Inverted: 0m at top, deeper at bottom
        title: {
          display: true,
          text: 'Depth to Water Table (m bgl) - Inverted Scale',
          color: '#94a3b8',
          font: { size: 11, weight: '600' }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `${value} m`
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.06)'
        },
        ticks: {
          color: '#cbd5e1',
          font: { size: 11 }
        }
      }
    }
  };

  // Pre vs Post monsoon fluctuation
  const mayVal = obs['2024-05'];
  const janVal = obs['2025-01'];
  const netDelta = (mayVal !== null && janVal !== null) ? Number((mayVal - janVal).toFixed(2)) : null;
  const isRise = netDelta !== null && netDelta >= 0;

  // Export station data as JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(station, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Station_${station.district}_${station.location.replace(/[^a-zA-Z0-9]/g, '_')}_CGWB_2024-25.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                {station.district} District
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                Station ID #{station.id}
              </span>
              {station.isEstimatedCoord && (
                <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                  Approx Coordinates
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              {station.location}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--cyan-primary)" />
                {station.latitude.toFixed(4)}° N, {station.longitude.toFixed(4)}° E
              </span>
              <span>·</span>
              <span>Well Type: <strong>{station.wellType}</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Latest Depth (Jan 2025)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: station.color, display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                {station.latestLevel !== null ? `${station.latestLevel}` : 'N/A'} <span style={{ fontSize: '0.9rem' }}>m bgl</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Category: <strong>{station.category}</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Pre-to-Post Fluctuation</div>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: '800', 
                color: isRise ? 'var(--emerald-safe)' : 'var(--crimson-critical)',
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem' 
              }}>
                {isRise ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                {netDelta !== null ? `${Math.abs(netDelta)}` : 'N/A'} <span style={{ fontSize: '0.9rem' }}>m</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: isRise ? '#34d399' : '#f87171', marginTop: '0.2rem' }}>
                {isRise ? 'Water Table Rose (Recharge)' : 'Water Table Fell (Draft/Deficit)'}
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>District Baseline Comparison</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                {districtInfo?.avgJan25 ? `${districtInfo.avgJan25}` : 'N/A'} <span style={{ fontSize: '0.9rem' }}>m avg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {station.latestLevel !== null && districtInfo?.avgJan25 ? (
                  station.latestLevel < districtInfo.avgJan25 
                    ? `+${(districtInfo.avgJan25 - station.latestLevel).toFixed(1)}m shallower than avg`
                    : `${(station.latestLevel - districtInfo.avgJan25).toFixed(1)}m deeper than avg`
                ) : 'Baseline computed'}
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Hydrogeology Aquifer Type</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.3rem' }}>
                Phreatic Aquifer
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Unconfined Weathered / Fractured
              </div>
            </div>

          </div>

          {/* Hydrograph Chart */}
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.6)', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-subtle)',
            position: 'relative' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--cyan-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Hydrograph: 2024–2025 Seasonal Dynamics</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                *Inverted Y-Axis: Higher curve represents higher water table (closer to ground)
              </span>
            </div>

            <div style={{ height: '280px', width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Seasonal Data Breakdown Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Observation Records Summary
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '0.65rem 1rem' }}>Season / Month</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Water Level (m bgl)</th>
                    <th style={{ padding: '0.65rem 1rem' }}>District Average</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Status Classification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: '600' }}>May 2024 (Pre-Monsoon)</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#f8fafc', fontWeight: '700' }}>{obs['2024-05'] !== null ? `${obs['2024-05']} m` : 'No Record'}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{districtInfo?.avgMay24 ? `${districtInfo.avgMay24} m` : '-'}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>Pre-Monsoon Baseline</span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: '600' }}>August 2024 (SWM Season)</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#f8fafc', fontWeight: '700' }}>{obs['2024-08'] !== null ? `${obs['2024-08']} m` : 'No Record'}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{districtInfo?.avgAug24 ? `${districtInfo.avgAug24} m` : '-'}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>South-West Monsoon</span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: '600' }}>November 2024 (NEM Season)</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#f8fafc', fontWeight: '700' }}>{obs['2024-11'] !== null ? `${obs['2024-11']} m` : 'No Record'}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{districtInfo?.avgNov24 ? `${districtInfo.avgNov24} m` : '-'}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>North-East Monsoon</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: '600' }}>January 2025 (Post-Monsoon)</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#38bdf8', fontWeight: '700' }}>{obs['2025-01'] !== null ? `${obs['2025-01']} m` : 'No Record'}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{districtInfo?.avgJan25 ? `${districtInfo.avgJan25} m` : '-'}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Post-Monsoon Peak</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI & IoT Readiness Card (Context for Long-term project) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(14, 165, 233, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-primary)'
              }}>
                <Cpu size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Smart Telemetry & AI Model Integration Slot
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  This monitoring point is indexed for future IoT pressure sensor telemetry (Phase 2) and LSTM groundwater recharge forecasting (Phase 3).
                </div>
              </div>
            </div>

            <button 
              onClick={handleExportJSON}
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <Download size={14} /> Export Station JSON
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
