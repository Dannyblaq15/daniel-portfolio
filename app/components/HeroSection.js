'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// HERO SECTION — Hexagonal holographic photo frame with:
//   • CSS floating animation (sine-wave bob)
//   • Mouse-following 3D tilt (requestAnimationFrame + CSS perspective)
//   • Device orientation gyroscopic tilt on mobile
//   • Double-tap / double-click → "Zero-G Mode" (80px rise, particles, audio)
//   • HUD overlay (scanlines + corner brackets) on hover
// ──────────────────────────────────────────────────────────────────────────────

function createWebAudioWhoosh() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (_) { }
}

function spawnParticles(container) {
  const colors = ['#D85A21', '#8B4513', '#ffffff'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 18) * 360;
    const dist = 60 + Math.random() * 80;
    const color = colors[i % colors.length];
    p.style.cssText = `
      background:${color};
      left:50%; top:50%;
      transform:translate(-50%,-50%);
      box-shadow:0 0 6px ${color};
      animation: particleUp 1s ease-out forwards;
      animation-delay:${Math.random() * 0.3}s;
      --dx:${Math.cos((angle * Math.PI) / 180) * dist}px;
      --dy:${Math.sin((angle * Math.PI) / 180) * dist}px;
    `;
    // Override animation to move in random directions
    p.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`);
    p.style.animation = 'none';
    p.style.transition = `transform 1s ease-out, opacity 1s ease-out`;
    container.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${(Math.random() - 0.5) * 200}px), calc(-50% + ${-80 - Math.random() * 120}px)) scale(0)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 1200);
  }
}

// Animated headline letters
function FloatingHeadline({ active }) {
  const text = "Hi, I'm < Daniel Lewis />";
  return (
    <h1 style={{ color: '#D85A21' }} className="hero-headline mb-4" aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            animation: active
              ? `letterFloat 0.6s ease-in-out ${i * 0.03}s both`
              : 'none',
            whiteSpace: ch === ' ' ? 'pre' : undefined,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h1>
  );
}

// ── Portrait photo ──
function HexAvatar() {
  return (
    <img
      src="/daniel-photo.jpg"
      alt="AI Generalist & software developer"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        display: 'block',
      }}
    />
  );
}

export default function HeroSection() {
  const frameRef = useRef(null);
  const wrapperRef = useRef(null);
  const lastTapRef = useRef(0);
  const rafRef = useRef(null);
  const [zeroGMode, setZeroGMode] = useState(false);
  const [letterAnimate, setLetterAnimate] = useState(false);

  // ── Mouse 3D tilt ──
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const frame = frameRef.current;
    if (!wrapper || !frame) return;

    const isMobile = () => window.innerWidth < 768;

    const handleMouseMove = (e) => {
      if (isMobile()) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotY = dx * 16;
        const rotX = -dy * 16;
        frame.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafRef.current);
      frame.style.transform = '';
    };

    // ── Device orientation (mobile gyroscope) ──
    const handleOrientation = (e) => {
      if (!isMobile()) return;
      const x = (e.beta || 0) / 45;
      const y = (e.gamma || 0) / 45;
      frame.style.transform = `perspective(900px) rotateX(${-x * 12}deg) rotateY(${y * 12}deg)`;
    };

    // ── Touch drag tilt fallback ──
    let touchStart = null;
    const handleTouchMove = (e) => {
      if (!touchStart || !isMobile()) return;
      const dx = (e.touches[0].clientX - touchStart.x) / 60;
      const dy = (e.touches[0].clientY - touchStart.y) / 60;
      frame.style.transform = `perspective(900px) rotateX(${-dy * 12}deg) rotateY(${dx * 12}deg)`;
    };
    const handleTouchStart = (e) => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => {
      touchStart = null;
      frame.style.transform = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('deviceorientation', handleOrientation);
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: true });
    wrapper.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('deviceorientation', handleOrientation);
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Zero-G Mode ──
  const activateZeroG = useCallback(() => {
    if (zeroGMode) return;
    setZeroGMode(true);
    setLetterAnimate(true);
    createWebAudioWhoosh();
    if (frameRef.current) spawnParticles(frameRef.current.parentElement);

    setTimeout(() => {
      setZeroGMode(false);
      setTimeout(() => setLetterAnimate(false), 800);
    }, 6000);
  }, [zeroGMode]);

  // ── Double-tap / double-click detection ──
  const handleInteraction = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      activateZeroG();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [activateZeroG]);

  // Social links
  const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/Dannyblaq15', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
    )},
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-lewis-739635232/', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    )},
    { label: 'X / Twitter', href: 'https://x.com/Marodtech', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    )},
    { label: 'Email', href: 'mailto:dl5357742@gmail.com', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    )},
  ];

  return (
    <section id="hero" className="hero-section section-padding">
      {/* Background orbs */}
      <div className="hero-bg-orb" style={{
        width: 500, height: 500,
        background: 'rgba(216,90,33,0.07)',
        top: '-10%', left: '-10%',
      }} />
      <div className="hero-bg-orb" style={{
        width: 400, height: 400,
        background: 'rgba(167,139,250,0.07)',
        bottom: '-5%', right: '-5%',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center gy-5">
          {/* Text content */}
          <div className="col-lg-7 order-lg-1 order-2">

            {/* ── Availability Badge ── */}
            <div className="reveal" style={{ marginBottom: '1.25rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)',
                borderRadius: 999, padding: '0.35rem 1rem',
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
                color: '#22c55e', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 0 0 rgba(34,197,94,0.6)',
                  animation: 'availablePulse 1.8s ease-in-out infinite',
                  display: 'inline-block', flexShrink: 0,
                }} />
                Available for opportunities
              </span>
            </div>

            <FloatingHeadline active={letterAnimate} />
            <p className="hero-sub mb-4 reveal" style={{ animationDelay: '0.1s' }}>
              Software Developer | React Native Developer.<br />
              Building responsive web and mobile applications with a focus on clean design, performance, and user experience.
            </p>

            {/* ── Social Links ── */}
            <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-lg-start reveal" style={{ animationDelay: '0.15s' }}>
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--white)', textDecoration: 'none',
                    transition: 'background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(216,90,33,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(216,90,33,0.5)';
                    e.currentTarget.style.color = '#D85A21';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.color = 'var(--white)';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* ── CTAs ── */}
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start reveal" style={{ animationDelay: '0.2s' }}>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="magnetic-btn secondary"
                style={{ textDecoration: 'none' }}
              >
                About Me
              </a>
              <a
                href="/daniel-lewis-cv.pdf"
                download
                className="magnetic-btn primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 8v2h14v-2H5z"/></svg>
                Download CV
              </a>
            </div>
          </div>

          {/* Photo frame */}
          <div className="col-lg-5 order-lg-2 order-1 d-flex flex-column align-items-center">
            <div
              ref={wrapperRef}
              className="hex-frame-wrapper"
              style={{ flexDirection: 'column' }}
              onClick={handleInteraction}
              onDoubleClick={activateZeroG}
              role="button"
              tabIndex={0}
              aria-label="Daniel Lewis portrait — Double-click to activate Zero-G Mode"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && activateZeroG()}
            >
              {/* Glow */}
              <div className="hex-glow" style={{
                background: zeroGMode
                  ? 'radial-gradient(circle, rgba(216,90,33,0.35) 0%, rgba(139,69,19,0.2) 50%, transparent 70%)'
                  : undefined,
              }} />

              {/* Outer animated frame */}
              <div
                ref={frameRef}
                className={`hex-frame-outer${zeroGMode ? ' zero-g' : ''}`}
                style={{
                  filter: zeroGMode
                    ? 'drop-shadow(0 0 30px #D85A21) drop-shadow(0 0 60px #8B4513)'
                    : 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(216,90,33,0.2))',
                  transition: 'filter 0.6s, transform 0.8s cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                {/* Holographic border gradient ring */}
                <div className="hex-border" />

                {/* Glass inner */}
                <div className="hex-inner">
                  <HexAvatar />

                  {/* HUD overlay — visible on hover */}
                  <div className="hex-hud-overlay">
                    <div className="hud-scanline" />
                    <div className="hud-corner tl" />
                    <div className="hud-corner tr" />
                    <div className="hud-corner bl" />
                    <div className="hud-corner br" />
                  </div>
                </div>
              </div>

              {/* Always visible role below the frame */}
              <div style={{
                marginTop: '30px',
                textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em',
                color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase'
              }}>
                DANIEL LEWIS // SOFTWARE & REACT NATIVE DEVELOPER
              </div>
            </div>

            {/* Tooltip */}
            <p className="double-click-tip">
              {zeroGMode ? '⚡ ZERO-G MODE ACTIVE' : 'Double-click to activate Zero-G Mode'}
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-5 pt-3 reveal" style={{ animationDelay: '0.4s' }}>
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px', opacity: 0.5,
          }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gray-600)' }}>SCROLL</span>
            <div style={{
              width: 1, height: 40,
              background: 'linear-gradient(to bottom, #D85A21, transparent)',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
