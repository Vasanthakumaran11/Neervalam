import React from 'react';
import { 
  CloudRain, 
  TrendingUp, 
  Layers, 
  PieChart as PieIcon, 
  Activity, 
  CheckCircle2,
  ArrowUpRight,
  Info,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SeasonalTrendsChart({ stateStats }) {
  if (!stateStats) return null;

  const { seasonalAverages, depthDistribution, fluctuationStats, rainfallSummary2024 } = stateStats;

  // Statewide Seasonal Progression Line Chart
  const lineData = {
    labels: ['May 2024 (Pre-Monsoon)', 'August 2024 (SWM)', 'November 2024 (NEM)', 'January 2025 (Post-Monsoon)'],
    datasets: [
      {
        label: 'Statewide Average Groundwater Depth (m bgl)',
        data: [
          seasonalAverages['May 2024'],
          seasonalAverages['August 2024'],
          seasonalAverages['November 2024'],
          seasonalAverages['January 2025']
        ],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 8,
        pointRadius: 6,
        borderWidth: 3,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(14, 165, 233, 0.4)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => `Depth: ${ctx.parsed.y} m bgl (Closer to surface)`
        }
      }
    },
    scales: {
      y: {
        reverse: true, // inverted for water table representation
        title: {
          display: true,
          text: 'Depth (m bgl) - [Inverted: Higher = Shallower Table]',
          color: '#94a3b8'
        },
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#cbd5e1' }
      }
    }
  };

  // Depth Bracket Doughnut Chart
  const doughnutData = {
    labels: ['< 2m (Very Shallow)', '2 – 5m (Safe)', '5 – 10m (Moderate)', '10 – 20m (Semi-Critical)', '> 20m (Critical)'],
    datasets: [
      {
        data: [
          depthDistribution.lessThan2m,
          depthDistribution.between2And5m,
          depthDistribution.between5And10m,
          depthDistribution.between10And20m,
          depthDistribution.moreThan20m
        ],
        backgroundColor: [
          '#06b6d4', // cyan
          '#10b981', // emerald
          '#f59e0b', // amber
          '#f97316', // orange
          '#ef4444'  // red
        ],
        borderColor: '#0f172a',
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
          boxWidth: 10
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
    }
  };

  // Seasonal Fluctuation Percentage Comparison (Year Book Official Tables)
  const fluctuationData = {
    labels: [
      'May-24 vs Aug-24 (SWM)',
      'May-24 vs Nov-24 (NEM)',
      'May-24 vs Jan-25 (Post-Monsoon)'
    ],
    datasets: [
      {
        label: '% Wells Recording Rise',
        data: [60.58, 78.27, 86.89],
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6
      },
      {
        label: '% Wells Recording Fall',
        data: [39.42, 21.73, 13.11],
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderRadius: 6
      }
    ]
  };

  const fluctuationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' }
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
        max: 100,
        title: {
          display: true,
          text: 'Percentage of Monitored Wells (%)',
          color: '#94a3b8'
        },
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#94a3b8', callback: (v) => `${v}%` }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#cbd5e1', font: { size: 10 } }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Info */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
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
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Statewide Seasonal Hydrogeological Dynamics</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Analysis of water table elevation from Pre-Monsoon (May 2024) to Peak Post-Monsoon Recharge (Jan 2025)
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
        
        {/* Chart 1: Statewide Seasonal Progression Curve */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Statewide Water Table Curve</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average depth across all 818 monitoring wells</p>
            </div>
            <span className="badge badge-emerald">
              +{fluctuationStats.avgRiseMeters}m Total Recharge
            </span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <Line data={lineData} options={lineOptions} />
          </div>

          <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>Hydrological Note:</strong> Water levels begin deepest in May (summer draft), rise moderately with Southwest Monsoon (Aug), and reach peak shallow depth in January following intense Northeast Monsoon rainfall.
          </div>
        </div>

        {/* Chart 2: Depth Bracket Donut Distribution */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Depth Bracket Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current January 2025 Post-Monsoon state</p>
            </div>
            <span className="badge badge-cyan">
              97% in &lt;10m range
            </span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ color: '#34d399', fontWeight: '700' }}>79% Safe Zone:</span>
              <div style={{ color: 'var(--text-secondary)' }}>&lt; 5m depth to water level</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <span style={{ color: '#f87171', fontWeight: '700' }}>3.5% Critical Zone:</span>
              <div style={{ color: 'var(--text-secondary)' }}>&gt; 10m depth (Western TN)</div>
            </div>
          </div>
        </div>

        {/* Chart 3: Fluctuation Breakdown (Rise vs Fall by Season) */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Seasonal Fluctuation Ratio</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Percentage of observation stations showing rise vs fall</p>
            </div>
            <span className="badge badge-purple">
              Year Book Annexure-I
            </span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <Bar data={fluctuationData} options={fluctuationOptions} />
          </div>

          <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>Recharge Acceleration:</strong> By Jan 2025, <strong>86.89%</strong> of stations exhibited net water level rise compared to pre-monsoon baseline, with only 13.11% in rain-shadow or heavy draft zones experiencing localized fall.
          </div>
        </div>

      </div>

      {/* 2024 Monsoon Rainfall Correlation Summary Banner */}
      <div className="glass-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CloudRain size={22} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>IMD Rainfall Correlation (Ground Water Year 2024–25)</h3>
          </div>
          <span className="badge badge-emerald">Annual State Rainfall: 1,172.7 mm (+27% Departure)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>South West Monsoon (Jun-Sep)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8', margin: '0.2rem 0' }}>
              {rainfallSummary2024.swmActual} mm
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Normal: {rainfallSummary2024.swmNormal} mm · <strong style={{ color: '#34d399' }}>{rainfallSummary2024.swmDeparture}</strong>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>North East Monsoon (Oct-Dec)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', margin: '0.2rem 0' }}>
              {rainfallSummary2024.nemActual} mm
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Normal: {rainfallSummary2024.nemNormal} mm · <strong style={{ color: '#34d399' }}>{rainfallSummary2024.nemDeparture}</strong>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Annual Realized</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a855f7', margin: '0.2rem 0' }}>
              {rainfallSummary2024.annualActual} mm
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Normal: 921.4 mm · <strong style={{ color: '#c084fc' }}>{rainfallSummary2024.annualDeparture}</strong>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
