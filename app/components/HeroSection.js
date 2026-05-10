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
  const text = "Hi, I'm Daniel Lewis";
  return (
    <h1 className="hero-headline mb-4" aria-label={text}>
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
      alt=" AI Generalist & software developer"
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

  return (
    <section id="hero" className="hero-section section-padding" style={{ paddingTop: 120 }}>
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
            <FloatingHeadline active={letterAnimate} />
            <p className="hero-sub mb-5 reveal" style={{ animationDelay: '0.1s' }}>
              Beginner Software Developer &amp; AI Generalist.
            </p>
            <div className="d-flex flex-wrap gap-3 reveal" style={{ animationDelay: '0.2s' }}>
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="magnetic-btn primary"
                style={{ textDecoration: 'none' }}
              >
                View My Work ↓
              </a>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="magnetic-btn secondary"
                style={{ textDecoration: 'none' }}
              >
                About Me
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
                DANIEL LEWIS // AI GENERALIST & SYSTEMS BUILDER
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
