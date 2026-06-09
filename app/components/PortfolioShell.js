'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import LabSection from './LabSection';
import SkillsSection from './SkillsSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import ProjectsSection from './ProjectsSection';
import Footer from './Footer';
import DevModeModal, { useDevMode } from './DevModeModal';

// ──────────────────────────────────────────────────────────────────────────────
// PORTFOLIO SHELL
// Manages global effects:
//   • Scroll-reveal (IntersectionObserver on .reveal elements)
//   • Full Anti-Gravity Easter egg (logo double-click → page elements float)
//   • Dev Mode (triple logo click OR Konami code)
// ──────────────────────────────────────────────────────────────────────────────

export default function PortfolioShell() {
  const [antiGravityActive, setAntiGravityActive] = useState(false);
  const rafRef = useRef(null);
  const { devModeOpen, setDevModeOpen, handleLogoClick } = useDevMode();

  // ── Scroll Reveal via IntersectionObserver ──────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    // Observe all .reveal elements — use a small delay so DOM is fully painted
    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  // ── Full Anti-Gravity Easter Egg ──────────────────────────────────────────
  // All major elements gently float upward with randomised offsets for 4s
  const triggerAntiGravity = useCallback(() => {
    if (antiGravityActive) return;
    setAntiGravityActive(true);

    const targets = document.querySelectorAll(
      'section, .project-card, .skill-item, .timeline-card, nav'
    );

    targets.forEach((el) => {
      const dy = -(20 + Math.random() * 30);
      const rot = (Math.random() - 0.5) * 4;
      const delay = Math.random() * 0.4;
      el.style.transition = `transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}s`;
      el.style.transform = `translateY(${dy}px) rotate(${rot}deg)`;
    });

    setTimeout(() => {
      targets.forEach((el) => {
        el.style.transition = 'transform 0.8s cubic-bezier(0.23,1,0.32,1)';
        el.style.transform = '';
      });
      setTimeout(() => {
        targets.forEach((el) => { el.style.transition = ''; });
        setAntiGravityActive(false);
      }, 900);
    }, 4000);
  }, [antiGravityActive]);

  // Combined logo click handler: triple → dev mode, double → anti-gravity
  const handleLogoCombined = useCallback(() => {
    handleLogoClick();      // tracks triple-click for dev mode
    triggerAntiGravity();   // double-click handled in Navbar via onLogoDoubleClick
  }, [handleLogoClick, triggerAntiGravity]);

  return (
    <>
      <Navbar onLogoDoubleClick={triggerAntiGravity} onLogoClick={handleLogoCombined} />
      <main id="main-content">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <LabSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Dev Mode Modal */}
      {devModeOpen && <DevModeModal onClose={() => setDevModeOpen(false)} />}

      {/* Anti-gravity active indicator */}
      {antiGravityActive && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(216,90,33,0.12)', border: '1px solid rgba(216,90,33,0.3)',
            borderRadius: 999, padding: '0.4rem 1.2rem',
            color: '#D85A21', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            zIndex: 800, backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          ⚡ FULL ANTI-GRAVITY ACTIVE
        </div>
      )}
    </>
  );
}
