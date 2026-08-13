'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'System Design', href: '#system-design' },
  { label: 'Content', href: '#content' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLogoDoubleClick, onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#projects');
  const lastTapRef = useRef(0);
  const panelRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('menu-locked', menuOpen);
    if (!menuOpen) return undefined;

    const focusable = () =>
      panelRef.current?.querySelectorAll('a[href], button:not([disabled])') || [];

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = Array.from(focusable());
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => focusable()[0]?.focus());

    return () => {
      document.body.classList.remove('menu-locked');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: '-90px 0px -45% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href) => {
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleLogoInteraction = () => {
    onLogoClick?.();
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      onLogoDoubleClick?.();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const renderLinks = (mobile = false) =>
    NAV_LINKS.map(({ label, href }) => (
      <a
        key={href}
        className={`nav-link ${activeSection === href ? 'active' : ''}`}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          scrollTo(href);
        }}
        aria-current={activeSection === href ? 'true' : undefined}
      >
        {label}
      </a>
    ));

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="container nav-inner">
          <button
            type="button"
            className="wordmark"
            onClick={handleLogoInteraction}
            onDoubleClick={onLogoDoubleClick}
            aria-label="DANNYBLAQ home"
            title="Double-click for a small anti-gravity Easter egg"
          >
            <span className="wordmark-dot" aria-hidden="true" />
            DANNYBLAQ
          </button>

          <div className="nav-links" aria-label="Primary">
            {renderLinks()}
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle color theme"
          >
            <Sun className="theme-icon sun-icon" aria-hidden="true" size={18} />
            <Moon className="theme-icon moon-icon" aria-hidden="true" size={18} />
          </button>

          <a
            className="button button-primary nav-cta"
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollTo('#contact');
            }}
          >
            Let&apos;s Talk
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="nav-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div
            ref={panelRef}
            id="mobile-navigation"
            className="mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {renderLinks(true)}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              title="Toggle color theme"
            >
              <Sun className="theme-icon sun-icon" aria-hidden="true" size={18} />
              <Moon className="theme-icon moon-icon" aria-hidden="true" size={18} />
            </button>
            <a
              className="button button-primary"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollTo('#contact');
              }}
            >
              Let&apos;s Talk
            </a>
          </div>
        </>
      )}
    </>
  );
}
