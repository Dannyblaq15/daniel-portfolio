'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// Nav links config
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: '📘 Handbook', href: '#book' },
  { label: 'Skills', href: '#skills' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLogoDoubleClick, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDark, setIsDark] = useState(true);
  const lastTapRef = useRef(0);
  const navRef = useRef(null);

  useEffect(() => {
    // initialize theme state
    if (typeof document !== 'undefined') {
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(isDarkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for indicator dot
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection('#' + entry.target.id);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  // Logo single/double-click/tap handler
  const handleLogoInteraction = useCallback(() => {
    onLogoClick?.();
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      onLogoDoubleClick?.();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [onLogoClick, onLogoDoubleClick]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const islandState = menuOpen
    ? 'expanded'
    : scrolled
      ? 'scrolled'
      : 'idle';

  return (
    <>
      <nav
        ref={navRef}
        className={`dynamic-island ${islandState} ${hovered ? 'hovered' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Ambient glow */}
        <div className="island-glow" />

        {/* Inner content */}
        <div className="island-content">
          {/* Logo */}
          <button
            className="island-logo"
            onClick={handleLogoInteraction}
            onDoubleClick={onLogoDoubleClick}
            title="Double-click to activate Full Anti-Gravity"
            aria-label="DANNYBLAQ logo — double-click for Easter egg"
          >
            <span className="island-logo-dot" />
            <span className="island-logo-text">DANNYBLAQ</span>
          </button>

          {/* Desktop Nav Links */}
          <div className="island-links">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                className={`island-link ${activeSection === href ? 'active' : ''}`}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
                {activeSection === href && (
                  <span className="island-link-indicator" />
                )}
              </a>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="island-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', fontSize: '1.1rem' }}
            aria-label="Toggle Theme"
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* CTA Button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="island-cta"
          >
            <span className="island-cta-dot" />
            Let&apos;s Talk
          </a>

          {/* Mobile toggle */}
          <button
            className="island-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <div className={`island-hamburger ${menuOpen ? 'open' : ''}`}>
              <span />
              <span />
            </div>
          </button>
        </div>

        {/* Mobile expanded menu */}
        {menuOpen && (
          <div className="island-menu">
            {NAV_LINKS.map(({ label, href }, i) => (
              <a
                key={label}
                className="island-menu-link"
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="island-menu-link-number">0{i + 1}</span>
                {label}
              </a>
            ))}
            <button
              className="island-menu-link"
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <span className="island-menu-link-number">0{NAV_LINKS.length + 1}</span>
              Theme: {isDark ? 'Dark' : 'Light'}
            </button>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="island-menu-cta"
              style={{ animationDelay: `${NAV_LINKS.length * 0.05}s` }}
            >
              Get in Touch
            </a>
          </div>
        )}
      </nav>

      {/* Backdrop for mobile menu */}
      {menuOpen && (
        <div
          className="island-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
