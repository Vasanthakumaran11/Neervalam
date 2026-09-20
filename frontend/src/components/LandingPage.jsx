import React from 'react';
import { 
  ArrowRight, 
  Wifi, 
  CloudSun, 
  Brain, 
  Droplet, 
  Building2, 
  Leaf, 
  TrendingUp, 
  Sprout, 
  Users, 
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ 
      color: '#1e293b', 
      background: '#ffffff',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* =========================================================================
          1. ENHANCED DISTINCTIVE NAVBAR (FULL-WIDTH STICKY WITH ALIGNED GRID)
          Anchors to top: 0, spanning the full screen with glassmorphic backdrop
          and an inner container aligned exactly to the 1360px content grid.
         ========================================================================= */}
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(22, 101, 52, 0.1)',
        boxShadow: '0 4px 20px -2px rgba(15, 63, 50, 0.04)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1360px',
          width: '92%',
          margin: '0 auto',
          padding: '1.1rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* Brand Logo & Subtitle */}
          <div 
            onClick={() => onNavigate && onNavigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f3b32', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                Neervalam
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600', letterSpacing: '0.01em' }}>
                Water Today, Harvest Tomorrow.
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.75rem', 
            fontSize: '0.92rem', 
            fontWeight: '600'
          }}>
            <a 
              href="#home" 
              style={{ 
                color: '#166534', 
                background: '#ecfdf5',
                padding: '0.4rem 1.1rem', 
                borderRadius: '999px', 
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'all 0.2s ease'
              }}
            >
              Home
            </a>
            <a 
              href="#about" 
              style={{ 
                color: '#475569', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#166534'}
              onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
            >
              About
            </a>
            <a 
              href="#features" 
              style={{ 
                color: '#475569', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#166534'}
              onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
            >
              Features
            </a>
            <a 
              href="#impact" 
              style={{ 
                color: '#475569', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#166534'}
              onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
            >
              Impact
            </a>
            <a 
              href="#contact" 
              style={{ 
                color: '#475569', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#166534'}
              onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
            >
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <button 
              onClick={() => onNavigate && onNavigate('/users/selvam-thanjavur')}
              style={{ 
                background: '#ffffff', 
                color: '#0f3b32', 
                border: '1.5px solid #cbd5e1', 
                borderRadius: '999px', 
                padding: '0.55rem 1.5rem', 
                fontSize: '0.88rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.background = '#f0fdf4';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              Login
            </button>
            
            <button 
              onClick={() => onNavigate && onNavigate('/government')}
              style={{ 
                background: 'linear-gradient(135deg, #196342 0%, #15803d 100%)', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '999px', 
                padding: '0.6rem 1.6rem', 
                fontSize: '0.88rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(25, 99, 66, 0.28)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(25, 99, 66, 0.38)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(25, 99, 66, 0.28)';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN LANDING CONTENT CONTAINER (1360px Max Width with Generous Gaps)
         ========================================================================= */}
      <main className="landing-content-container">

        {/* =======================================================================
            2. HERO SECTION
           ======================================================================= */}
        <section id="home" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.05fr 1.15fr', 
          gap: '3.5rem', 
          alignItems: 'center',
          paddingTop: '4.5rem',
          paddingBottom: '5.5rem'
        }}>
          
          {/* Left Column: Heading, Subtitle, Buttons, Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h1 style={{ 
                fontSize: 'clamp(2.8rem, 4vw, 3.8rem)', 
                fontWeight: '800', 
                lineHeight: '1.1', 
                color: '#111827', 
                margin: 0, 
                letterSpacing: '-0.03em' 
              }}>
                Every Drop.
              </h1>
              <h1 style={{ 
                fontSize: 'clamp(2.8rem, 4vw, 3.8rem)', 
                fontWeight: '800', 
                lineHeight: '1.1', 
                color: '#196342', 
                margin: '0.2rem 0 0 0', 
                letterSpacing: '-0.03em' 
              }}>
                Smarter Decisions.
              </h1>
            </div>

            <p style={{ 
              fontSize: '1.08rem', 
              color: '#475569', 
              lineHeight: '1.7', 
              margin: '0.5rem 0 0.75rem 0', 
              maxWidth: '540px' 
            }}>
              Neervalam connects groundwater, farm conditions, IoT sensors and weather intelligence to help farmers make better irrigation decisions while giving authorities a unified view of groundwater resources.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigate && onNavigate('/users/selvam-thanjavur')}
                style={{
                  background: '#196342',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 4px 14px rgba(25, 99, 66, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('/government')}
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Learn More
              </button>
            </div>

            {/* 3 Mini Benefits */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2.25rem', 
              marginTop: '1.75rem', 
              flexWrap: 'wrap', 
              fontSize: '0.92rem', 
              color: '#475569' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Sprout size={20} color="#10b981" />
                <span style={{ fontWeight: '600' }}>Healthy Crops</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Droplet size={20} color="#0284c7" />
                <span style={{ fontWeight: '600' }}>Sustainable Water Use</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <TrendingUp size={20} color="#10b981" />
                <span style={{ fontWeight: '600' }}>Stronger Communities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Tablet & Phone Mockup */}
          <div style={{ 
            position: 'relative', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.12)',
            border: '1px solid #f1f5f9'
          }}>
            <img 
              src="/images/landing/hero_mockup.jpg" 
              alt="Neervalam Farm Dashboard tablet and smartphone mockup in field" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>

        </section>

        {/* =======================================================================
            3. KEY FEATURES
           ======================================================================= */}
        <section id="features" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          textAlign: 'center',
          paddingTop: '5rem',
          paddingBottom: '5.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.6rem 0', letterSpacing: '-0.02em' }}>
              Key Features
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '0 0 3.5rem 0' }}>
              Everything you need for smarter farming and sustainable water management.
            </p>
          </div>

          {/* 6 Circular Feature Icons in a Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gap: '1.75rem',
            textAlign: 'center'
          }}>
            {/* 1. Real-time IoT Monitoring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', margin: '0 auto 0.5rem auto' }}>
                <Wifi size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Real-time IoT Monitoring</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Track well water levels, soil moisture, pump status and more.
              </p>
            </div>

            {/* 2. Weather Integration */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 0.5rem auto' }}>
                <CloudSun size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Weather Integration</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Get accurate weather data and rain forecasts for better planning.
              </p>
            </div>

            {/* 3. AI-Powered Predictions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', margin: '0 auto 0.5rem auto' }}>
                <Brain size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>AI-Powered Predictions</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Predict groundwater levels and crop water needs using advanced algorithms.
              </p>
            </div>

            {/* 4. Irrigation Advisory */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', margin: '0 auto 0.5rem auto' }}>
                <Droplet size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Irrigation Advisory</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Know when and how much water to apply for maximum yield.
              </p>
            </div>

            {/* 5. Government Dashboard */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', margin: '0 auto 0.5rem auto' }}>
                <Building2 size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Government Dashboard</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Helps authorities monitor groundwater resources across regions.
              </p>
            </div>

            {/* 6. Sustainable Future */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', margin: '0 auto 0.5rem auto' }}>
                <Leaf size={28} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Sustainable Future</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                Conserve water, protect resources, secure livelihoods.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================================
            4. DUAL PILLARS: FOR FARMERS vs FOR GOVERNMENT
           ======================================================================= */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem'
        }}>
          
          {/* Card 1: For Farmers */}
          <div style={{ 
            background: '#eefbf4', 
            borderRadius: '26px', 
            padding: '2.5rem 2.25rem', 
            border: '1px solid #d1fae5',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '1.75rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Left Text Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#14532d', margin: 0 }}>
                  For Farmers
                </h3>
                <Leaf size={20} color="#10b981" />
              </div>

              <div style={{ fontSize: '1.12rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.3', margin: '0.25rem 0' }}>
                Your Land. Your Data. Your Control.
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                Manage your farms, wells and crops with ease. Get real-time updates, weather alerts and personalized irrigation recommendations — all in one place.
              </p>

              <div>
                <button 
                  onClick={() => onNavigate && onNavigate('/users/selvam-thanjavur')}
                  style={{
                    background: '#196342',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0.75rem 1.6rem',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 10px rgba(25, 99, 66, 0.25)'
                  }}
                >
                  <span>Explore Farmer Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Visual Column with Farmer & Floating Stat Pills */}
            <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '250px' }}>
              <img 
                src="/images/landing/farmer_phone.jpg" 
                alt="Farmer checking smart irrigation on smartphone" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '18px' }}
              />
              {/* 3 Floating Stat Chips */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', color: '#0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Soil Moisture </span>31%
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', color: '#0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Well Level </span>8.4 m
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', color: '#0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Rain Forecast </span>18 mm
                </div>
              </div>
            </div>

          </div>

          {/* Card 2: For Government */}
          <div style={{ 
            background: '#edf7fc', 
            borderRadius: '26px', 
            padding: '2.5rem 2.25rem', 
            border: '1px solid #e0f2fe',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '1.75rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Left Text Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0369a1', margin: 0 }}>
                For Government
              </h3>

              <div style={{ fontSize: '1.12rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.3', margin: '0.25rem 0' }}>
                Better Insights. Better Decisions.
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                Monitor groundwater levels, analyze trends, identify high-stress areas and plan sustainable water management strategies with a unified dashboard.
              </p>

              <div>
                <button 
                  onClick={() => onNavigate && onNavigate('/government')}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0.75rem 1.6rem',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 10px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <span>Explore Government Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Visual Column with Tamil Nadu Map & Chart */}
            <div style={{ borderRadius: '18px', overflow: 'hidden', height: '250px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/images/landing/gov_map.jpg" 
                alt="Tamil Nadu map with groundwater level analytics card" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '18px' }}
              />
            </div>

          </div>

        </section>

        {/* =======================================================================
            5. HOW IT WORKS
           ======================================================================= */}
        <section style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          textAlign: 'center',
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.6rem 0', letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '0 0 4rem 0' }}>
              From data to decisions — in just a few steps.
            </p>
          </div>

          {/* 4 Steps with Connected Arrows */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '2rem', 
            alignItems: 'flex-start',
            position: 'relative'
          }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', margin: '0 auto 0.5rem auto' }}>
                <Wifi size={26} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>1. Collect Data</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '210px' }}>
                IoT sensors capture real-time information from your land, wells and environment.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', margin: '0 auto 0.5rem auto' }}>
                <CloudSun size={26} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>2. Analyze & Predict</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '210px' }}>
                Our AI models process the data to predict groundwater levels, weather changes and water needs.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 0.5rem auto' }}>
                <Sparkles size={26} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>3. Get Recommendations</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '210px' }}>
                Receive personalized irrigation advice and actionable insights for better productivity.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', margin: '0 auto 0.5rem auto' }}>
                <Sprout size={26} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>4. Grow Sustainably</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5', margin: 0, maxWidth: '210px' }}>
                Use water efficiently, improve yields and contribute to a healthier environment.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================================
            6. OUR IMPACT
           ======================================================================= */}
        <section id="impact" style={{ 
          background: '#f8fafc', 
          borderRadius: '28px', 
          border: '1px solid #e2e8f0', 
          padding: '2.5rem 3rem', 
          display: 'grid', 
          gridTemplateColumns: '1.05fr 1.6fr', 
          gap: '3rem', 
          alignItems: 'center',
          marginTop: '2rem',
          marginBottom: '5.5rem'
        }}>
          {/* Left Side: Landscape Image */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', height: '210px' }}>
            <img 
              src="/images/landing/impact_landscape.jpg" 
              alt="Lush green paddy fields with irrigation canal" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Right Side: Impact Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Our Impact
              </h3>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
                Real data. Real change.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {/* Stat 1 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <Droplet size={22} color="#0ea5e9" />
                  <span style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>20%</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>Water Savings</div>
              </div>

              {/* Stat 2 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <Sprout size={22} color="#10b981" />
                  <span style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>35%</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>Higher Crop Yield</div>
              </div>

              {/* Stat 3 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <Users size={22} color="#059669" />
                  <span style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>10K+</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>Farmers Supported</div>
              </div>

              {/* Stat 4 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <Leaf size={22} color="#16a34a" />
                  <span style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>100%</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>Sustainable Future</div>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            7. CALL TO ACTION BANNER (WITH FARMER OVERLOOKING FIELD)
           ======================================================================= */}
        <section style={{ 
          position: 'relative', 
          borderRadius: '28px', 
          overflow: 'hidden', 
          background: 'linear-gradient(105deg, #ecfdf5 0%, #e0f2fe 55%, transparent 100%)',
          border: '1px solid #d1fae5',
          minHeight: '190px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '3rem 3.5rem',
          marginTop: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ zIndex: 2, maxWidth: '580px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
              <Leaf size={22} />
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.45rem 0', letterSpacing: '-0.01em' }}>
              Ready to build a smarter, more sustainable future?
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', margin: '0 0 1.75rem 0' }}>
              Join Neervalam today and be a part of the change.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => onNavigate && onNavigate('/users/selvam-thanjavur')}
                style={{
                  background: '#196342',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(25, 99, 66, 0.28)'
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('/government')}
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Farmer looking out at sunrise */}
          <div style={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            bottom: 0, 
            width: '38%', 
            overflow: 'hidden' 
          }}>
            <img 
              src="/images/landing/cta_farmer.jpg" 
              alt="Farmer looking out over sustainable fields at sunrise" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Subtle gradient blend on left edge */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #e0f2fe 0%, transparent 40%)',
              pointerEvents: 'none'
            }} />
          </div>
        </section>

      </main>

    </div>
  );
}
