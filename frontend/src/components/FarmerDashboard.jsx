import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  MapPin, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Power, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Layers, 
  Gauge, 
  Sprout, 
  Info,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
import { resolveFarmerProfile } from '../data/farmerUserData';
import FarmerAiForecastSection from './FarmerAiForecastSection';

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

export default function FarmerDashboard({ 
  userId = 'selvam-thanjavur',
  userProfile = null,
  onNavigate,
  theme = 'dark'
}) {
  const [selectedFarmerId, setSelectedFarmerId] = useState(userId);
  const [isPumpSimulating, setIsPumpSimulating] = useState(false);
  const [simulatedMinutes, setSimulatedMinutes] = useState(0);

  const farmer = useMemo(() => {
    return resolveFarmerProfile(selectedFarmerId, userProfile);
  }, [selectedFarmerId, userProfile]);

  const displayName = userProfile?.full_name || farmer.name;

  const handleFarmerChange = (newId) => {
    setSelectedFarmerId(newId);
    if (onNavigate) {
      onNavigate(`/users/${newId}`);
    }
  };

  const randomizeErodeWell = () => {
    const randomId = `IOT-ERD-${Math.floor(101 + Math.random() * 90)}`;
    handleFarmerChange(randomId.toLowerCase());
  };

  // Toggle pump simulation
  const togglePumpSimulation = () => {
    if (!isPumpSimulating) {
      setIsPumpSimulating(true);
      setSimulatedMinutes(farmer.mlWaterRecommendation.recommendedPumpMinutes || 30);
    } else {
      setIsPumpSimulating(false);
      setSimulatedMinutes(0);
    }
  };

  // 24-Hour Drawdown & Recovery Chart Configuration
  const chartData = useMemo(() => {
    const telemetry = farmer.historical24hTelemetry || [];
    return {
      labels: telemetry.map(t => t.time),
      datasets: [
        {
          label: 'Well Depth to Water (m bgl)',
          data: telemetry.map(t => t.depthBgl),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0ea5e9',
          yAxisID: 'y'
        },
        {
          label: 'Root-Zone Soil Moisture (%)',
          data: telemetry.map(t => t.soilMoisture),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointRadius: 3,
          pointBackgroundColor: '#10b981',
          yAxisID: 'y1'
        }
      ]
    };
  }, [farmer]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        reverse: true, // Depth: deeper means lower water table
        title: {
          display: true,
          text: 'Depth to Water Level (m bgl) [Inverted]',
          color: '#0ea5e9',
          font: { size: 11 }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Soil Moisture (%)',
          color: '#10b981',
          font: { size: 11 }
        },
        grid: { drawOnChartArea: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const rec = farmer.mlWaterRecommendation;
  const well = farmer.wellDetails;
  const soil = farmer.soilTelemetry;
  const weather = farmer.weatherForecast;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header / Navigation Strip */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate('/')}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} /> Back to Home
          </button>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>
                Uzhavar Smart Water Dashboard
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                உழவர் நீர் மேலாண்மை
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Personalized In-Situ IoT Well Telemetry, Weather Forecasting & ML Water Budgeting
            </p>
          </div>
        </div>

        {/* Farmer profile summary & telemetry pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Current Farmer:</span>
            <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.85rem' }}>{displayName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--emerald-safe)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div className="pulse-indicator" />
            <span>IoT Live (LoRaWAN)</span>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={randomizeErodeWell}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Randomly switch to any of Erode's 63 CGWB well monitoring stations"
          >
            <RefreshCw size={14} color="#38bdf8" />
            <span>Switch Erode Well (IoT Live)</span>
          </button>

          <button 
            className="btn btn-water"
            onClick={() => onNavigate && onNavigate('/government')}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Government Hub</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Farmer Land & Farm Profile Summary Ribbon */}
      <div className="glass-card" style={{ 
        padding: '1.25rem 1.5rem', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            {farmer.avatar}
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600' }}>
              {farmer.tamilName}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {farmer.location}
            </div>
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Crop & Land Holding</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {farmer.cropType}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {farmer.landSizeAcres} Acres · {farmer.soilType}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Well Infrastructure</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {well.type.split('(')[0]}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Depth: {well.totalDepthMeters}m · {well.pumpRating}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telemetry Gateway</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.2rem', fontFamily: 'monospace' }}>
            {farmer.iotHubId}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Synced {farmer.lastPing}
          </div>
        </div>
      </div>

      {/* HERO SECTION: Today's ML Smart Water Pouring Recommendation */}
      <div className="glass-card" style={{ 
        padding: '1.75rem', 
        background: rec.action === 'NO_IRRIGATION_NEEDED' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(15, 23, 42, 0.95) 100%)' 
          : 'linear-gradient(135deg, rgba(2, 132, 199, 0.16) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: `1px solid ${rec.action === 'NO_IRRIGATION_NEEDED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow circle */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rec.action === 'NO_IRRIGATION_NEEDED' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(14, 165, 233, 0.25)'} 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge" style={{ 
              background: rec.action === 'NO_IRRIGATION_NEEDED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(14, 165, 233, 0.2)',
              color: rec.action === 'NO_IRRIGATION_NEEDED' ? '#34d399' : '#38bdf8',
              border: `1px solid ${rec.action === 'NO_IRRIGATION_NEEDED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`,
              fontSize: '0.8rem',
              padding: '0.35rem 0.85rem'
            }}>
              <Sparkles size={13} /> ML PRECISION WATER ADVISORY
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Confidence Score: <strong>{rec.confidenceScore}%</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={togglePumpSimulation}
              className={isPumpSimulating ? 'btn btn-secondary' : 'btn btn-green'}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Power size={14} />
              {isPumpSimulating ? 'Stop Pump Test' : 'Trigger Automated Irrigation'}
            </button>
          </div>
        </div>

        {/* Big Numbers Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          
          {/* Box 1: Water to Pour */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recommended Water to Pour
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: rec.litersToPour === 0 ? '#10b981' : '#38bdf8', lineHeight: '1.2', margin: '0.35rem 0' }}>
              {rec.litersToPour.toLocaleString()} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Liters</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {rec.litersToPour === 0 ? '✓ Zero pumping required today' : `Equivalent to ~${(rec.litersToPour * 0.264172).toFixed(0)} Gallons`}
            </div>
          </div>

          {/* Box 2: Pump Runtime */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Optimal Pump Runtime
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: rec.recommendedPumpMinutes === 0 ? '#10b981' : '#f59e0b', lineHeight: '1.2', margin: '0.35rem 0' }}>
              {rec.recommendedPumpMinutes} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Minutes</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {rec.optimalTimeWindow}
            </div>
          </div>

          {/* Box 3: Groundwater Conserved */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Groundwater Conserved
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#10b981', lineHeight: '1.2', margin: '0.35rem 0' }}>
              +{rec.groundwaterSavedLiters.toLocaleString()} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Liters</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Saved vs. traditional uncontrolled flooding
            </div>
          </div>

        </div>

        {/* Rationale & Explanation Card */}
        <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Info size={18} color={rec.action === 'NO_IRRIGATION_NEEDED' ? '#34d399' : '#38bdf8'} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.25rem' }}>
                {rec.summaryMessage}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {rec.detailedRationale}
              </div>
            </div>
          </div>
        </div>

        {/* Active Pump Simulation Notification */}
        {isPumpSimulating && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <RefreshCw size={16} color="var(--cyan-primary)" style={{ animation: 'spin 2s linear infinite' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>
                Simulating Smart Automated Irrigation: <strong>{simulatedMinutes} Minutes Scheduled</strong> via Drip Line
              </span>
            </div>
            <span className="badge badge-cyan">Relay Active</span>
          </div>
        )}

      </div>
 
       {/* AI 30/60/90-Day Water Level Forecast & Critical Alert Section */}
       <FarmerAiForecastSection
         key={`${farmer.id}-${well.currentDepthBgl}-${farmer.iotHubId}`}
         wellId={farmer.id || 'NVW001'}
         initialDepth={Number(well.currentDepthBgl) || 12.8}
         initialPumpDepth={well.totalDepthMeters ? Math.round(well.totalDepthMeters * 0.7) : 24.0}
       />

       {/* 4 In-Situ IoT Telemetry Cards Grid */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Well Piezometer */}
        <div className="glass-card hover-lift" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={18} color="#0ea5e9" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Borewell Water Level</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: well.statusColor, fontWeight: '700', background: `${well.statusColor}15`, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
              {well.status.split('/')[0]}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: well.statusColor }}>
              {well.currentDepthBgl}m
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>below ground</span>
          </div>

          {/* Visual depth bar */}
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div style={{ 
              height: '100%', 
              width: `${Math.min(100, (well.currentDepthBgl / 30) * 100)}%`, 
              background: well.statusColor, 
              borderRadius: '999px' 
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>24h Aquifer Shift:</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{well.delta24h}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Well Depth:</span>
              <span>{well.totalDepthMeters} meters</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pump Rating:</span>
              <span>{well.pumpRating}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Soil Moisture & Root Zone */}
        <div className="glass-card hover-lift" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={18} color="#10b981" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Soil & Root Moisture</span>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              Capacitive Probes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
              {soil.rootZoneMoisture15cm}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>at 15cm root-depth</span>
          </div>

          {/* Dual Moisture Progress */}
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div style={{ 
              height: '100%', 
              width: `${soil.rootZoneMoisture15cm}%`, 
              background: '#10b981', 
              borderRadius: '999px' 
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sub-Root (30cm):</span>
              <span style={{ fontWeight: '600', color: '#38bdf8' }}>{soil.subZoneMoisture30cm}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Optimal Range:</span>
              <span>{soil.optimalRange}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Soil Temperature:</span>
              <span>{soil.soilTempCelsius}°C</span>
            </div>
          </div>
        </div>

        {/* Card 3: Weather & Precipitation Prediction */}
        <div className="glass-card hover-lift" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloudRain size={18} color="#38bdf8" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Rain Predictor (IMD)</span>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              3-Day Forecast
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: weather.rainProbabilityPercent >= 50 ? '#38bdf8' : 'var(--text-primary)' }}>
              {weather.rainProbabilityPercent}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>rain probability</span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: '600', marginBottom: '0.75rem' }}>
            {weather.rainExpectedNext24h ? `⚡ ${weather.rainAmountMm} mm rain expected next 24h` : '☀ Dry conditions next 24h'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', textAlign: 'center', fontSize: '0.72rem' }}>
            {weather.forecastDays.map(f => (
              <div key={f.day} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)' }}>{f.day}</div>
                <div style={{ fontWeight: '700', color: '#f8fafc' }}>{f.rainProb}</div>
                <div style={{ color: '#38bdf8' }}>{f.rainMm}mm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Power & Pump Grid Telemetry */}
        <div className="glass-card hover-lift" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#f59e0b" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Pump & Power State</span>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: isPumpSimulating ? 'rgba(14, 165, 233, 0.2)' : 'rgba(100, 116, 139, 0.2)', color: isPumpSimulating ? '#38bdf8' : '#94a3b8', fontWeight: '700' }}>
              {isPumpSimulating ? 'RUNNING' : 'STANDBY'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: isPumpSimulating ? '#38bdf8' : 'var(--text-primary)' }}>
              {isPumpSimulating ? '45 GPM' : '0 GPM'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>discharge flow</span>
          </div>

          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div style={{ 
              height: '100%', 
              width: isPumpSimulating ? '85%' : '0%', 
              background: '#38bdf8', 
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Grid Supply:</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>3-Phase Active (415V)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tariff:</span>
              <span>Free Agri Electricity</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Flow Meter:</span>
              <span style={{ fontFamily: 'monospace' }}>Digital Hall Effect</span>
            </div>
          </div>
        </div>

      </div>

      {/* 24-Hour Drawdown & Recovery Hydrograph Chart */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--cyan-primary)" />
              24-Hour IoT Borewell Drawdown vs. Soil Moisture Dynamics
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Continuous sensor data from hydrostatic pressure transducer (inverted depth) and capacitive soil moisture probes.
            </p>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
            Hourly Resolution · Automated Telemetry
          </span>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Weekly Water Balance & Irrigation Log */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Recent Irrigation & Water Pouring Log
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Tracking groundwater withdrawn versus ML recommended targets to ensure zero over-pumping.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.65rem' }}>Date</th>
                <th style={{ padding: '0.65rem' }}>Crop Stage</th>
                <th style={{ padding: '0.65rem' }}>Rain Recorded</th>
                <th style={{ padding: '0.65rem' }}>Soil Moisture</th>
                <th style={{ padding: '0.65rem' }}>Recommended Pour</th>
                <th style={{ padding: '0.65rem' }}>Actual Poured</th>
                <th style={{ padding: '0.65rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600' }}>Today (Scheduled)</td>
                <td style={{ padding: '0.65rem' }}>Tillering / Vegetative</td>
                <td style={{ padding: '0.65rem', color: '#38bdf8' }}>{weather.rainAmountMm} mm predicted</td>
                <td style={{ padding: '0.65rem' }}>{soil.rootZoneMoisture15cm}%</td>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#10b981' }}>{rec.litersToPour} L</td>
                <td style={{ padding: '0.65rem' }}>{isPumpSimulating ? `${(simulatedMinutes * 45 * 3.785).toFixed(0)} L` : '0 L (Pending)'}</td>
                <td style={{ padding: '0.65rem' }}><span className="badge badge-emerald">Optimal</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem' }}>Yesterday</td>
                <td style={{ padding: '0.65rem' }}>Tillering</td>
                <td style={{ padding: '0.65rem' }}>0.0 mm</td>
                <td style={{ padding: '0.65rem' }}>69%</td>
                <td style={{ padding: '0.65rem' }}>0 L</td>
                <td style={{ padding: '0.65rem' }}>0 L</td>
                <td style={{ padding: '0.65rem' }}><span className="badge badge-emerald">Conserved</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem' }}>2 Days Ago</td>
                <td style={{ padding: '0.65rem' }}>Tillering</td>
                <td style={{ padding: '0.65rem' }}>4.2 mm</td>
                <td style={{ padding: '0.65rem' }}>72%</td>
                <td style={{ padding: '0.65rem' }}>0 L</td>
                <td style={{ padding: '0.65rem' }}>0 L</td>
                <td style={{ padding: '0.65rem' }}><span className="badge badge-emerald">Conserved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
