'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-md-4 text-center text-md-start">
            <span className="navbar-brand-logo" style={{ fontSize: '0.95rem', letterSpacing: '0.2em' }}>
              DANNYBLAQ
            </span>
            <p className="footer-text mt-2 mb-0" style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
              © {year} Daniel Lewis. All rights reserved.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center gap-4">
              {[
                { label: 'GitHub', href: 'https://github.com/dannyblaq', icon: '⌥' },
                { label: 'X', href: 'https://x.com/Marodtech', icon: '✕' },
                { label: 'LinkedIn', href: '#', icon: '◈' },
                { label: 'Email', href: 'mailto:daniel@anti-gravity.dev', icon: '✉' },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    color: 'var(--gray-400)', fontSize: '0.75rem', textDecoration: 'none',
                    letterSpacing: '0.08em', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '0.25rem', transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D85A21')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                  aria-label={label}
                >
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.65rem' }}>{label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <p className="footer-text mb-0" style={{ color: 'var(--gray-600)', fontSize: '0.75rem' }}>
              ↑ Triple-tap logo for Developer Mode
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
