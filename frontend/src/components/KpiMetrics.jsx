import React from 'react';
import { 
  Building2, 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  Gauge, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';

export default function KpiMetrics({ stateStats, filteredCount, totalWells, onSelectCategory }) {
  if (!stateStats) return null;

  const {
    stateAverageLatest,
    stateMinDepth,
    stateMaxDepth,
    seasonalAverages,
    depthDistribution,
    fluctuationStats,
    rainfallSummary2024
  } = stateStats;

  const safePercentage = Math.round(
    ((depthDistribution.lessThan2m + depthDistribution.between2And5m) / totalWells) * 100
  );

  const criticalPercentage = Math.round(
    ((depthDistribution.between10And20m + depthDistribution.moreThan20m) / totalWells) * 100
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
      
      {/* Metric 1: Total Active Monitoring Wells */}
      <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monitored Stations
          </span>
          <div style={{
            padding: '0.4rem',
            borderRadius: '8px',
            background: 'rgba(14, 165, 233, 0.15)',
            color: 'var(--cyan-primary)'
          }}>
            <Building2 size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {filteredCount !== totalWells ? `${filteredCount} / ${totalWells}` : totalWells}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dug Wells</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span className="badge badge-cyan">32 Districts Covered</span>
          <span style={{ color: 'var(--text-muted)' }}>May 2024 – Jan 2025</span>
        </div>
      </div>

      {/* Metric 2: State Average Water Level Depth */}
      <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            State Average Depth (bgl)
          </span>
          <div style={{
            padding: '0.4rem',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--emerald-safe)'
          }}>
            <Gauge size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--emerald-safe)' }}>
            {stateAverageLatest} <span style={{ fontSize: '1.1rem' }}>m</span>
          </span>
          <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', color: 'var(--emerald-safe)', fontWeight: '600' }}>
            <ArrowUpRight size={15} /> +{fluctuationStats.avgRiseMeters}m rise
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Pre-monsoon: <strong style={{ color: 'var(--text-primary)' }}>{seasonalAverages['May 2024']}m</strong> → Post-monsoon: <strong style={{ color: 'var(--emerald-safe)' }}>{seasonalAverages['January 2025']}m</strong>
          </span>
        </div>
      </div>

      {/* Metric 3: Post-Monsoon Recharge Rate */}
      <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Net Aquifer Recharge
          </span>
          <div style={{
            padding: '0.4rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8'
          }}>
            <TrendingUp size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#38bdf8' }}>
            {fluctuationStats.overallRisePercentage}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Wells Recorded Rise</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span className="badge badge-emerald">NEM Rainfall +33% Excess</span>
          <span style={{ color: 'var(--text-muted)' }}>{fluctuationStats.overallFallPercentage}% wells fell</span>
        </div>
      </div>

      {/* Metric 4: Safe vs Stressed Ratio */}
      <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vulnerability Index
          </span>
          <div style={{
            padding: '0.4rem',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--amber-moderate)'
          }}>
            <ShieldCheck size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#34d399' }}>
            {safePercentage}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Safe Zone (&lt;5m bgl)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span className="badge badge-crimson">{depthDistribution.moreThan20m + depthDistribution.between10And20m} Wells &gt;10m</span>
          <span style={{ color: 'var(--text-muted)' }}>Min: {stateMinDepth}m · Max: {stateMaxDepth}m</span>
        </div>
      </div>

    </div>
  );
}
