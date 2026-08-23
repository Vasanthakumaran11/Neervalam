import React from 'react';
import { 
  Sparkles, 
  Database, 
  Wifi, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  LineChart, 
  Compass,
  Zap,
  Target,
  FileSpreadsheet
} from 'lucide-react';

export default function RoadmapVision() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Banner */}
      <div className="glass-card" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(14, 165, 233, 0.12) 50%, rgba(139, 92, 246, 0.12) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={12} /> Strategic Architecture
            </span>
            <span className="badge badge-emerald">
              Phase 1 Live (MVP Ground Truth Baseline)
            </span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.25' }}>
            Smart Groundwater Monitoring, Prediction & Recharge Recommendation System
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            A phased multi-tier framework designed to transition Tamil Nadu from periodic manual well surveillance to an automated, AI-augmented groundwater decision support ecosystem.
          </p>
        </div>
      </div>

      {/* 4 Phased Roadmap Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Phase 1: Historical Baseline (Current MVP) */}
        <div className="glass-card" style={{ 
          padding: '1.5rem', 
          border: '1px solid rgba(16, 185, 129, 0.4)', 
          background: 'rgba(16, 185, 129, 0.04)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} /> Phase 1: Operational MVP
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald-safe)', fontWeight: '700' }}>COMPLETED</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-safe)'
            }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>CGWB Ground Truth Foundation</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Official Ground Water Year Book 2024-25</p>
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="var(--emerald-safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Digitized 818 unconfined monitoring well stations across 32 Tamil Nadu districts.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="var(--emerald-safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Multi-period tracking: May 2024 (Pre), Aug 2024 (SWM), Nov 2024 (NEM), Jan 2025 (Post).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="var(--emerald-safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Spatial GIS mapping, district aggregations, and individual hydrographs.</span>
            </li>
          </ul>
        </div>

        {/* Phase 2: In-Situ IoT Telemetry */}
        <div className="glass-card" style={{ 
          padding: '1.5rem', 
          border: '1px solid rgba(14, 165, 233, 0.3)', 
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} /> Phase 2: In-Situ Telemetry
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: '700' }}>UPCOMING</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-primary)'
            }}>
              <Wifi size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>IoT Piezometer Ingestion</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated Sensor Telemetry</p>
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--cyan-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Submersible hydrostatic pressure level sensors with LoRaWAN / 4G GSM telemetry.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--cyan-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Hourly digital data logger transmission into a central time-series database.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--cyan-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Automated outlier detection and sensor calibration checks.</span>
            </li>
          </ul>
        </div>

        {/* Phase 3: AI/ML Groundwater Prediction */}
        <div className="glass-card" style={{ 
          padding: '1.5rem', 
          border: '1px solid rgba(139, 92, 246, 0.3)', 
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} /> Phase 3: AI/ML Forecasting
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--purple-accent)', fontWeight: '700' }}>PLANNED</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--purple-accent)'
            }}>
              <BrainCircuit size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>LSTM & XGBoost Models</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hydro-meteorological Prediction</p>
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--purple-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Multi-variable training on rainfall, soil lithology, evapotranspiration, and extraction rates.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--purple-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>30-day, 60-day, and seasonal aquifer drawdown / recharge forecast curves.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--purple-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Drought early warning and localized water stress alerts.</span>
            </li>
          </ul>
        </div>

        {/* Phase 4: Decision Support & Recharge Recommendation */}
        <div className="glass-card" style={{ 
          padding: '1.5rem', 
          border: '1px solid rgba(245, 158, 11, 0.3)', 
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} /> Phase 4: Decision Support
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--amber-moderate)', fontWeight: '700' }}>FUTURE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--amber-moderate)'
            }}>
              <Target size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recharge Recommendation</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Artificial Recharge Structures</p>
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--amber-moderate)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Geo-tagged recommendations for Check Dams, Percolation Ponds, and Recharge Shafts.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--amber-moderate)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Firka-level agricultural draft vs recharge optimization strategies.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={15} color="var(--amber-moderate)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Policy decision support for State Ground & Surface Water Resources Data Centre.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Dataset Authenticity & Transparency Note */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--emerald-safe)" />
          <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Technical Statement & Data Provenance</h4>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          This MVP dashboard is powered exclusively by the published observational data from the <strong>Ground Water Year Book of Tamil Nadu & U.T. of Puducherry (2024-25)</strong>, issued by the <em>Central Ground Water Board (CGWB), Ministry of Jal Shakti, Government of India</em>. All 818 station coordinates, depth levels, and seasonal fluctuations are faithfully reconstructed from Annexure-I and associated official analytical tables.
        </p>
      </div>

    </div>
  );
}
