'use client';
import { useState, useEffect, useRef } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// DEVELOPER MODE EASTER EGG
// Activated by: triple-click/tap on the logo OR Konami code
// Opens a live CSS editor whose rules are injected into a <style> tag,
// letting the user modify the site in real-time.
// ──────────────────────────────────────────────────────────────────────────────

const DEFAULT_CSS = `/* Live CSS Editor — changes apply instantly! */

/* Try changing the accent color: */
:root {
  --cyan: #D85A21;
  --violet: #8B4513;
  --bg-primary: #F5F5DC;
}

/* Or make the body glow: */
/* body { background: #050520; } */

/* Float everything: */
/* * { animation: float 3s ease-in-out infinite; } */
`;

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

export default function DevModeModal({ onClose }) {
  const [css, setCss] = useState(DEFAULT_CSS);
  const [applied, setApplied] = useState(false);
  const styleRef = useRef(null);
  const textareaRef = useRef(null);

  // Inject a dedicated style tag on mount
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'ag-dev-mode-styles';
    document.head.appendChild(tag);
    styleRef.current = tag;
    return () => tag.remove();
  }, []);

  // Escape key closes
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const applyCSS = () => {
    if (styleRef.current) {
      styleRef.current.textContent = css;
      setApplied(true);
      setTimeout(() => setApplied(false), 1500);
    }
  };

  const resetCSS = () => {
    setCss(DEFAULT_CSS);
    if (styleRef.current) styleRef.current.textContent = '';
  };

  return (
    <div
      className="dev-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Developer Mode"
    >
      <div className="dev-modal">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <span style={{ fontWeight: 900, letterSpacing: '0.1em', color: '#D85A21', fontSize: '0.9rem' }}>
                DEVELOPER MODE
              </span>
              <span style={{
                background: 'rgba(216,90,33,0.1)', border: '1px solid rgba(216,90,33,0.3)',
                borderRadius: 999, padding: '0.1rem 0.5rem',
                fontSize: '0.55rem', color: '#D85A21', fontWeight: 700, letterSpacing: '0.1em',
              }}>
                EASTER EGG
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '0.2rem', margin: 0 }}>
              Live CSS editor — changes apply to the entire site in real-time
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%', width: 32, height: 32, color: '#9CA3AF',
              cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close developer mode"
          >✕</button>
        </div>

        {/* Quick tips */}
        <div style={{
          background: 'rgba(216,90,33,0.04)', border: '1px solid rgba(216,90,33,0.1)',
          borderRadius: 10, padding: '0.75rem', marginBottom: '1rem',
          fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.6,
        }}>
          <span style={{ color: '#D85A21', fontWeight: 700 }}>Tips: </span>
          Change <code style={{ color: '#8B4513' }}>--cyan</code> or <code style={{ color: '#8B4513' }}>--violet</code> to retheme instantly.
          Add <code style={{ color: '#8B4513' }}>animation: float 2s ease-in-out infinite</code> to any selector. Press{' '}
          <kbd style={{ background: '#111', border: '1px solid #333', borderRadius: 4, padding: '0 4px', fontSize: '0.65rem' }}>
            Ctrl+Enter
          </kbd>{' '}to apply.
        </div>

        {/* CSS textarea */}
        <textarea
          ref={textareaRef}
          className="dev-textarea"
          value={css}
          onChange={(e) => setCss(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              applyCSS();
            }
          }}
          spellCheck={false}
          aria-label="CSS editor"
        />

        {/* Actions */}
        <div className="d-flex gap-2 mt-2 flex-wrap align-items-center">
          <button className="dev-apply-btn" onClick={applyCSS}>
            {applied ? '✓ Applied!' : '⚡ Apply CSS'}
          </button>
          <button
            onClick={resetCSS}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, padding: '0.5rem 1rem',
              color: '#9CA3AF', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              setCss(`/* CHAOS MODE ⚡ */
body { animation: fullAntiGravity 4s ease-in-out infinite; }
.section-title { animation: holoBorder 2s ease infinite; background-size: 300% 300%; }
.project-card { animation: float 3s ease-in-out infinite; }
nav { animation: float 2s ease-in-out infinite; }
`);
            }}
            style={{
              background: 'rgba(139,69,19,0.1)', border: '1px solid rgba(139,69,19,0.3)',
              borderRadius: 999, padding: '0.5rem 1rem',
              color: '#8B4513', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            }}
          >
            🌀 Chaos Mode
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#2d2d2d' }}>
            Ctrl+Enter to apply
          </span>
        </div>

        {/* Konami hint */}
        <p style={{ fontSize: '0.6rem', color: '#1a1a1a', textAlign: 'center', marginTop: '1rem', letterSpacing: '0.1em' }}>
          ↑↑↓↓←→←→BA — You found the secret.
        </p>
      </div>
    </div>
  );
}

// ── Hook: listens for triple-click on logo + Konami code ──────────────────────
export function useDevMode() {
  const [devModeOpen, setDevModeOpen] = useState(false);
  const clicksRef = useRef([]);
  const konamiRef = useRef([]);

  useEffect(() => {
    // Konami code listener
    const handleKey = (e) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        setDevModeOpen(true);
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Triple-tap/click activator — call this from logo onClick
  const handleLogoClick = () => {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current.filter(t => now - t < 600), now];
    if (clicksRef.current.length >= 3) {
      setDevModeOpen(true);
      clicksRef.current = [];
    }
  };

  return { devModeOpen, setDevModeOpen, handleLogoClick };
}
