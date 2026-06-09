'use client';
import { useState, useRef } from 'react';

const FEATURES = [
  { icon: '</>',  label: 'Custom Software Development' },
  { icon: '🧠',  label: 'AI & Intelligent Solutions' },
  { icon: '📈',  label: 'Digital Innovation & Business Growth' },
];

const CHAPTERS = [
  'Introduction to Modern Tech Architecture',
  'Building Scalable Custom Software',
  'AI Integration for Business Leaders',
  'Securing Your Digital Infrastructure',
  'Driving ROI Through Digital Transformation',
];

export default function BookSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const bookRef = useRef(null);

  // 3D tilt on book hover
  const handleMouseMove = (e) => {
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 14 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('success');
      // Trigger download
      const a = document.createElement('a');
      a.href = data.downloadUrl;
      a.download = 'Marod-Tech-Handbook.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      {/* ── SECTION ──────────────────────────────────────────────────────────── */}
      <section
        id="book"
        className="section-padding"
        style={{
          background: 'linear-gradient(170deg, var(--bg-secondary) 0%, #0d0503 60%, var(--bg-primary) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(216,90,33,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(195,22,45,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div className="text-center mb-5 reveal">
            <p className="section-eyebrow">📘 Free Resource</p>
            <h2 style={{ color: 'var(--cyan)' }} className="section-title">The Marod Tech Handbook</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              A practical guide for businesses &amp; leaders — free for you to download.
            </p>
          </div>

          <div className="row align-items-center g-5">
            {/* ── LEFT: 3D Book ──────────────────────────────────────────── */}
            <div className="col-lg-5 text-center reveal">
              <div
                ref={bookRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTilt}
                style={{
                  display: 'inline-block',
                  perspective: 1000,
                  cursor: 'pointer',
                }}
                onClick={() => setModalOpen(true)}
              >
                <div style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: tilt.x === 0 ? 'transform 0.6s ease' : 'transform 0.1s ease',
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                }}>
                  {/* Book cover */}
                  <img
                    src="/book-cover.png"
                    alt="The Marod Tech Handbook book cover"
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      borderRadius: 12,
                      boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(216,90,33,0.3)',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                  {/* Floating badge */}
                  <div style={{
                    position: 'absolute', top: -14, right: -14,
                    background: 'linear-gradient(135deg, #D85A21, #C3162D)',
                    color: '#fff', borderRadius: 999,
                    padding: '0.35rem 0.8rem',
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                    boxShadow: '0 4px 16px rgba(216,90,33,0.5)',
                    animation: 'float 3s ease-in-out infinite',
                  }}>
                    FREE DOWNLOAD
                  </div>
                </div>
                {/* Reflection glow */}
                <div style={{
                  width: '60%', height: 20, margin: '12px auto 0',
                  background: 'radial-gradient(ellipse, rgba(216,90,33,0.25) 0%, transparent 70%)',
                  filter: 'blur(6px)',
                }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--gray-600)', marginTop: '0.75rem', letterSpacing: '0.08em' }}>
                  ✦ Hover to explore &nbsp;·&nbsp; Click to get access
                </p>
              </div>
            </div>

            {/* ── RIGHT: Info ────────────────────────────────────────────── */}
            <div className="col-lg-7 reveal">
              {/* Tagline */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(216,90,33,0.1)', border: '1px solid rgba(216,90,33,0.25)',
                borderRadius: 999, padding: '0.3rem 1rem', marginBottom: '1.5rem',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#D85A21', fontWeight: 700, letterSpacing: '0.15em' }}>
                  INNOVATE · SECURE · TRANSFORM
                </span>
              </div>

              <h3 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900,
                color: 'var(--white)', lineHeight: 1.25, marginBottom: '1rem',
              }}>
                Building Smarter Solutions.<br />
                Driving <span style={{ color: '#D85A21' }}>Real Impact.</span>
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--white)', opacity: 0.75, lineHeight: 1.8, marginBottom: '1.75rem' }}>
                Whether you&apos;re a startup founder, business leader, or tech enthusiast, this handbook
                breaks down how modern technology — from custom software to AI — can transform
                how your business operates, competes, and grows.
              </p>

              {/* What's inside */}
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
                What&apos;s inside
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {CHAPTERS.map((ch, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      minWidth: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(216,90,33,0.15)', border: '1px solid rgba(216,90,33,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 800, color: '#D85A21',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--white)', opacity: 0.8 }}>{ch}</span>
                  </div>
                ))}
              </div>

              {/* Feature pills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {FEATURES.map((f) => (
                  <span key={f.label} style={{
                    background: 'rgba(216,90,33,0.08)', border: '1px solid rgba(216,90,33,0.2)',
                    borderRadius: 8, padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem', color: 'var(--white)', opacity: 0.85,
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}>
                    <span style={{ fontSize: '0.85rem' }}>{f.icon}</span> {f.label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #D85A21, #C3162D)',
                  color: '#fff', border: 'none', borderRadius: 999,
                  padding: '0.8rem 2rem', fontSize: '0.9rem', fontWeight: 800,
                  letterSpacing: '0.06em', cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(216,90,33,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(216,90,33,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(216,90,33,0.4)';
                }}
              >
                📘 Get Free Access
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--gray-600)', marginTop: '0.6rem' }}>
                No credit card required · Instant PDF download
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ──────────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); setStatus('idle'); }}}
        >
          <div style={{
            background: 'linear-gradient(145deg, #111, #1a0a05)',
            border: '1px solid rgba(216,90,33,0.3)',
            borderRadius: 24, padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            maxWidth: 460, width: '100%',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(216,90,33,0.1)',
            animation: 'slideUp 0.3s cubic-bezier(0.23,1,0.32,1)',
          }}>
            {status === 'success' ? (
              <div className="text-center" style={{ padding: '1rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: '#D85A21', fontWeight: 900, marginBottom: '0.5rem' }}>You&apos;re all set!</h3>
                <p style={{ color: 'var(--white)', opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Your download should start automatically.<br />
                  Enjoy <em>The Marod Tech Handbook</em>!
                </p>
                <button
                  onClick={() => { setModalOpen(false); setStatus('idle'); setName(''); setEmail(''); }}
                  className="magnetic-btn secondary"
                  style={{ marginTop: '1.5rem', fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Modal header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--white)', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>
                      Get Free Access 📘
                    </h3>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                      Enter your details to download instantly
                    </p>
                  </div>
                  <button
                    onClick={() => { setModalOpen(false); setStatus('idle'); }}
                    style={{ background: 'none', border: 'none', color: 'var(--gray-600)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
                    aria-label="Close"
                  >×</button>
                </div>

                {/* Book mini-preview */}
                <div style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'center',
                  background: 'rgba(216,90,33,0.06)', border: '1px solid rgba(216,90,33,0.15)',
                  borderRadius: 12, padding: '0.75rem', marginBottom: '1.5rem',
                }}>
                  <img src="/book-cover.png" alt="Book" style={{ width: 48, borderRadius: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>The Marod Tech Handbook</p>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.72rem', margin: '0.1rem 0 0' }}>Building Smarter Solutions · DOCX</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div>
                    <label htmlFor="ebook-name" style={{ fontSize: '0.72rem', color: 'var(--gray-600)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                      YOUR NAME
                    </label>
                    <input
                      id="ebook-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Okafor"
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                        padding: '0.7rem 1rem', color: 'var(--white)', fontSize: '0.88rem',
                        outline: 'none', transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(216,90,33,0.6)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="ebook-email" style={{ fontSize: '0.72rem', color: 'var(--gray-600)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                      YOUR EMAIL
                    </label>
                    <input
                      id="ebook-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@company.com"
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                        padding: '0.7rem 1rem', color: 'var(--white)', fontSize: '0.88rem',
                        outline: 'none', transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(216,90,33,0.6)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ color: '#C3162D', fontSize: '0.78rem', margin: 0 }}>⚠ {errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      background: status === 'loading'
                        ? 'rgba(216,90,33,0.4)'
                        : 'linear-gradient(135deg, #D85A21, #C3162D)',
                      color: '#fff', border: 'none', borderRadius: 999,
                      padding: '0.85rem', fontSize: '0.9rem', fontWeight: 800,
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.06em', transition: 'all 0.2s',
                      boxShadow: '0 6px 24px rgba(216,90,33,0.35)',
                    }}
                  >
                    {status === 'loading' ? '⏳ Processing...' : '📥 Download Free Copy'}
                  </button>
                  <p style={{ fontSize: '0.68rem', color: 'var(--gray-600)', textAlign: 'center', margin: 0 }}>
                    🔒 No spam. Your email is safe with us.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
