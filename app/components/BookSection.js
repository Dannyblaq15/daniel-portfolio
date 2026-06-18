'use client';
import { useState, useRef } from 'react';

const BOOKS = [
  {
    id: 'marod-tech',
    title: 'The Marod Tech Handbook',
    eyebrow: '📘 Free Resource',
    tagline: 'INNOVATE · SECURE · TRANSFORM',
    subtitle: 'A practical guide for businesses & leaders — free to download.',
    description: "Whether you're a startup founder, business leader, or tech enthusiast, this handbook breaks down how modern technology — from custom software to AI — can transform how your business operates, competes, and grows.",
    cover: '/book-cover.png',
    color: '#D85A21',
    fileName: 'Marod-Tech-Handbook.docx',
    chapters: [
      'Introduction to Modern Tech Architecture',
      'Building Scalable Custom Software',
      'AI Integration for Business Leaders',
      'Securing Your Digital Infrastructure',
      'Driving ROI Through Digital Transformation',
    ],
    features: [
      { icon: '</>',  label: 'Custom Software Development' },
      { icon: '🧠',  label: 'AI & Intelligent Solutions' },
      { icon: '📈',  label: 'Digital Innovation & Business Growth' },
    ]
  },
  {
    id: 'ai-stack',
    title: 'AI Stack for Junior Developers',
    eyebrow: '🤖 Free Guide',
    tagline: 'LEARN · BUILD · SCALE',
    subtitle: 'A hands-on guide to mastering modern AI stacks and APIs for junior developers.',
    description: "Master the tools, patterns, and architectures needed to build production-ready AI applications. From LLM API fundamentals to complex agentic reasoning workflows, this handbook is your fast-track to becoming an AI-capable engineer.",
    cover: '/ai-stack-cover.png',
    color: '#00b4d8',
    fileName: 'AI-Stack-for-Junior-Developers-MarodTech.pdf',
    chapters: [
      'Understanding LLMs & API Landscapes',
      'Prompt Engineering & System Prompts',
      'Building RAG (Retrieval-Augmented Generation) Systems',
      'Introduction to Agentic Frameworks',
      'Deploying & Scaling AI Applications',
    ],
    features: [
      { icon: '⚡',  label: 'AI APIs & Orchestration' },
      { icon: '🤖',  label: 'Agentic Workflows' },
      { icon: '🛠️',  label: 'Hands-on Coding Examples' },
    ]
  }
];

export default function BookSection() {
  const [activeBook, setActiveBook] = useState(BOOKS[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, bookId: activeBook.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('success');
      // Trigger download
      const a = document.createElement('a');
      a.href = data.downloadUrl;
      a.download = data.fileName || activeBook.fileName;
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
        style={{
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '3rem 0',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {/* Subtle Ambient glow based on activeBook color */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 320, height: 320,
          background: `radial-gradient(circle, ${activeBook.color}0d 0%, transparent 70%)`,
          pointerEvents: 'none', borderRadius: '50%',
          transition: 'background 0.5s ease',
          zIndex: 1,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Header */}
          <div className="text-center mb-4 reveal">
            <h2 style={{ fontSize: '1.25rem', color: 'var(--white)', margin: 0, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              📚 Library Ledge
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.78rem', marginTop: '0.25rem', opacity: 0.8 }}>
              Click a handbook to take it with you
            </p>
          </div>

          {/* Shelf Widget */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            maxWidth: '540px',
            marginTop: '1.5rem',
            padding: '0 1.5rem',
          }} className="reveal">
            
            {/* Shelf Books Container */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '2.5rem',
              width: '100%',
              paddingBottom: '3px',
              zIndex: 2,
            }}>
              {BOOKS.map((book) => {
                const isActive = activeBook.id === book.id;
                
                return (
                  <div
                    key={book.id}
                    onClick={() => {
                      setActiveBook(book);
                      setModalOpen(true);
                    }}
                    onMouseEnter={() => {
                      setActiveBook(book);
                    }}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      transform: isActive 
                        ? 'translateY(-16px) scale(1.03) rotateY(-8deg)' 
                        : 'translateY(0) scale(1) rotateY(0deg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* 3D Book Container */}
                    <div style={{
                      position: 'relative',
                      width: '110px',
                      height: '154px',
                      borderRadius: '3px 6px 6px 3px',
                      boxShadow: isActive 
                        ? `0 20px 40px rgba(0,0,0,0.65), 0 0 25px ${book.color}35`
                        : '0 8px 18px rgba(0,0,0,0.45)',
                      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      overflow: 'hidden',
                      transformStyle: 'preserve-3d',
                      perspective: '800px',
                      borderLeft: `3px solid rgba(255, 255, 255, 0.15)`,
                    }}>
                      {/* Cover Image */}
                      <img
                        src={book.cover}
                        alt={book.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      
                      {/* Cover overlay crease effect */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '4px',
                        width: '1px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                        pointerEvents: 'none',
                      }} />
                      
                      {/* Shine Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(115deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 40%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0.35) 100%)',
                        pointerEvents: 'none',
                      }} />
                    </div>

                    {/* Book Label / Title (Clean & Minimalist under book spine) */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-48px',
                      background: 'rgba(12, 12, 12, 0.92)',
                      border: `1px solid ${isActive ? book.color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '8px',
                      padding: '5px 10px',
                      pointerEvents: 'none',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(-6px)',
                      transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      zIndex: 10,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                      textAlign: 'center',
                      minWidth: '130px',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {book.title}
                      </span>
                      <span style={{ 
                        fontSize: '0.58rem', 
                        color: book.color, 
                        display: 'block', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginTop: '2px'
                      }}>
                        Take Book 📥
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glassmorphic Shelf Board */}
            <div style={{
              width: '100%',
              height: '10px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
              borderRadius: '6px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
            }}>
              {/* Shelf shadow underneath */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '2%',
                width: '96%',
                height: '6px',
                background: 'rgba(0, 0, 0, 0.7)',
                filter: 'blur(3px)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }} />
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
            background: activeBook.id === 'ai-stack' ? 'linear-gradient(145deg, #111, #05131a)' : 'linear-gradient(145deg, #111, #1a0a05)',
            border: `1px solid ${activeBook.color}44`,
            borderRadius: 24, padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            maxWidth: 460, width: '100%',
            boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 60px ${activeBook.color}22`,
            animation: 'slideUp 0.3s cubic-bezier(0.23,1,0.32,1)',
            transition: 'all 0.3s ease',
          }}>
            {status === 'success' ? (
              <div className="text-center" style={{ padding: '1rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: activeBook.color, fontWeight: 900, marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>You&apos;re all set!</h3>
                <p style={{ color: 'var(--white)', opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Your download should start automatically.<br />
                  Enjoy <em>{activeBook.title}</em>!
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
                      Get Free Access 📚
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
                  background: activeBook.id === 'ai-stack' ? 'rgba(0, 180, 216, 0.06)' : 'rgba(216, 90, 33, 0.06)',
                  border: `1px solid ${activeBook.color}22`,
                  borderRadius: 12, padding: '0.75rem', marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                }}>
                  <img src={activeBook.cover} alt="Book" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>{activeBook.title}</p>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.72rem', margin: '0.1rem 0 0' }}>
                      {activeBook.id === 'ai-stack' ? 'Mastering AI Stacks · DOCX' : 'Building Smarter Solutions · DOCX'}
                    </p>
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
                      onFocus={(e) => { e.target.style.borderColor = activeBook.color; }}
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
                      onFocus={(e) => { e.target.style.borderColor = activeBook.color; }}
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
                        ? 'rgba(255,255,255,0.1)'
                        : activeBook.id === 'ai-stack' ? 'linear-gradient(135deg, #00b4d8, #0077b6)' : 'linear-gradient(135deg, #D85A21, #C3162D)',
                      color: '#fff', border: 'none', borderRadius: 999,
                      padding: '0.85rem', fontSize: '0.9rem', fontWeight: 800,
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.06em', transition: 'all 0.2s',
                      boxShadow: `0 6px 24px ${activeBook.color}35`,
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
