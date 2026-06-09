'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// LAB SECTION — Three interactive experiments:
//  1. Neural Gravity Simulator (Canvas particle system)
//  2. AI Prompt Float (floating 3D text elements)
//  3. Code Orbit (orbiting holographic code cards)
// ──────────────────────────────────────────────────────────────────────────────

// ── 1. Neural Gravity Simulator ──────────────────────────────────────────────
function NeuralGravitySimulator() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], gravity: 0.05, rafId: null });
  const lastTapRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    const spawnParticle = (x, y) => {
      stateRef.current.particles.push({
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#D85A21' : '#8B4513',
        life: 1,
      });
      // Cap at 120 particles
      if (stateRef.current.particles.length > 120) {
        stateRef.current.particles.shift();
      }
    };

    // Spawn initial particles
    for (let i = 0; i < 60; i++) spawnParticle();

    // Click to throw particle
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      spawnParticle(e.clientX - rect.left, e.clientY - rect.top);
    };
    canvas.addEventListener('click', handleClick);

    // Animate
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { particles, gravity } = stateRef.current;
      particles.forEach((p, i) => {
        p.vy -= gravity; // anti-gravity: upward force
        p.vx *= 0.999;
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -0.8;
        if (p.y < 0 || p.y > canvas.height) { p.vy *= -0.8; p.y = Math.max(0, Math.min(canvas.height, p.y)); }

        // Draw connections
        particles.slice(i + 1).forEach((q) => {
          const dx = q.x - p.x, dy = q.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(216,90,33,${(1 - dist / 90) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });

        // Draw particle
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      stateRef.current.rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cancelAnimationFrame(stateRef.current.rafId);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Double-tap: reverse gravity
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      stateRef.current.gravity *= -1;
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      className="lab-canvas-wrap"
      style={{ height: 280 }}
      onClick={handleDoubleTap}
      title="Click to throw particles • Double-click to reverse gravity"
    >
      <div className="lab-canvas-label">NEURAL GRAVITY SIMULATOR</div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{
        position: 'absolute', bottom: '0.75rem', right: '0.75rem',
        fontSize: '0.6rem', color: 'rgba(216,90,33,0.5)', letterSpacing: '0.1em',
      }}>
        CLICK TO THROW · DOUBLE-CLICK TO FLIP GRAVITY
      </div>
    </div>
  );
}

// ── 2. AI Prompt Float ────────────────────────────────────────────────────────
const PRESET_PROMPTS = [
  "the universe is code",
  "zero gravity feels like freedom",
  "AI dreams in parallel",
  "build things that float",
  "defy digital gravity",
];

function AIPromptFloat() {
  const [floatingWords, setFloatingWords] = useState([]);
  const [input, setInput] = useState('');
  const idRef = useRef(0);

  const addPrompt = useCallback((text) => {
    if (!text.trim()) return;
    const words = text.trim().split(/\s+/);
    const colors = ['var(--cyan)', 'var(--violet)', '#111111', '#555555'];
    words.forEach((word, i) => {
      const id = ++idRef.current;
      setTimeout(() => {
        setFloatingWords((prev) => [
          ...prev.slice(-20),
          {
            id,
            text: word,
            x: 10 + Math.random() * 70,
            y: 20 + Math.random() * 60,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 0.8 + Math.random() * 1.2,
            delay: i * 0.1,
            rotate: (Math.random() - 0.5) * 20,
            duration: 4 + Math.random() * 4,
          },
        ]);
      }, i * 100);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPrompt(input);
    setInput('');
  };

  return (
    <div className="lab-canvas-wrap" style={{ minHeight: 280 }}>
      <div className="lab-canvas-label">AI PROMPT FLOAT</div>

      {/* Floating word cloud */}
      <div style={{
        position: 'relative', height: 200, overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 70%)',
        }} />
        {floatingWords.map((w) => (
          <div
            key={w.id}
            className="floating-text-3d"
            style={{
              position: 'absolute',
              left: `${w.x}%`,
              top: `${w.y}%`,
              color: w.color,
              fontSize: `${w.size}rem`,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              transform: `rotate(${w.rotate}deg)`,
              animation: `float ${w.duration}s ease-in-out ${w.delay}s infinite`,
              textShadow: `0 0 20px ${w.color}80`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {w.text}
          </div>
        ))}
        {floatingWords.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(0,0,0,0.3)', fontSize: '0.8rem', letterSpacing: '0.15em',
          }}>
            TYPE A PROMPT BELOW
          </div>
        )}
      </div>

      {/* Input + presets */}
      <div style={{ padding: '0.75rem' }}>
        <form onSubmit={handleSubmit} className="d-flex gap-2 mb-2">
          <input
            className="ai-prompt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type anything and watch it float..."
            aria-label="AI prompt input"
          />
          <button type="submit" className="magnetic-btn primary" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
            Float ↑
          </button>
        </form>
        <div className="d-flex flex-wrap gap-1">
          {PRESET_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => addPrompt(p)}
              style={{
                background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '999px', color: 'var(--gray-600)', fontSize: '0.6rem', padding: '0.2rem 0.6rem',
                cursor: 'pointer', letterSpacing: '0.05em', fontWeight: 600,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 3. Code Orbit ─────────────────────────────────────────────────────────────
const CODE_SNIPPETS = [
  {
    id: 1, label: 'Anti-Gravity Hook', short: 'useAntiGravity()', color: 'var(--cyan)', code: `const useAntiGravity = (ref) => {
  useEffect(() => {
    let raf;
    const animate = () => {
      const t = Date.now() / 1000;
      ref.current.style.transform =
        \`translateY(\${Math.sin(t) * 18}px)\`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [ref]);
};` },
  {
    id: 2, label: 'Particle Burst', short: 'spawnParticle()', color: 'var(--violet)', code: `const spawnParticles = (el) => {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 20) * 360;
    p.style.transform =
      \`rotate(\${angle}deg) translateX(80px)\`;
    el.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
};` },
  {
    id: 3, label: 'HUD Overlay', short: 'HUDOverlay()', color: '#555555', code: `const HUDOverlay = () => (
  <div className="hud">
    <div className="corner tl" />
    <div className="corner tr" />
    <div className="corner bl" />
    <div className="corner br" />
    <div className="scanline" />
  </div>
);` },
];

function CodeOrbit() {
  const [dockedId, setDockedId] = useState(null);
  const lastTapRef = useRef(0);

  const handleTap = useCallback((id) => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      setDockedId((prev) => (prev === id ? null : id));
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, []);

  return (
    <div className="lab-canvas-wrap" style={{ minHeight: 280, padding: '2.5rem 1rem 1rem' }}>
      <div className="lab-canvas-label">CODE ORBIT</div>

      {dockedId ? (
        // Docked view
        <div>
          {CODE_SNIPPETS.filter(s => s.id === dockedId).map(s => (
            <div key={s.id}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: '0.7rem', color: s.color, letterSpacing: '0.15em', fontWeight: 700 }}>
                  {s.label}
                </span>
                <button
                  onClick={() => setDockedId(null)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.85rem' }}
                >✕ Undock</button>
              </div>
              <div className="code-orbit-card docked" style={{ color: s.color }}>
                {s.code}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Orbit view — stacked cards with offset
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CODE_SNIPPETS.map((s, i) => (
            <div
              key={s.id}
              className="code-orbit-card"
              style={{
                color: s.color,
                marginLeft: `${i * 12}px`,
                animation: `float ${5 + i}s ease-in-out ${i * 0.8}s infinite`,
                borderColor: `${s.color}30`,
              }}
              onClick={() => handleTap(s.id)}
              onDoubleClick={() => setDockedId(s.id)}
              role="button"
              tabIndex={0}
              title={`Double-click to dock ${s.label}`}
              aria-label={`${s.label} snippet — double-click to dock`}
              onKeyDown={(e) => e.key === 'Enter' && setDockedId(s.id)}
            >
              <span style={{ opacity: 0.5, fontSize: '0.6rem', letterSpacing: '0.15em' }}>{s.label}</span>
              {'  '}{s.short}
            </div>
          ))}
          <p style={{ fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
            DOUBLE-CLICK ANY CARD TO DOCK ↓
          </p>
        </div>
      )}
    </div>
  );
}

// ── 4. Quantum Data Stream ────────────────────────────────────────────────────
function QuantumDataStream() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01'.split('');
    const fontSize = 12;
    let columns = canvas.width / fontSize;
    let drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    let frame = 0;
    const animate = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const fadeColor = isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#D85A21'; // cyan/burnt orange color
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="lab-canvas-wrap" style={{ height: 280, background: 'var(--bg-primary)' }}>
      <div className="lab-canvas-label">QUANTUM DATA STREAM</div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

// ── 5. AI Chatbot Integration ──────────────────────────────────────────
function ChatbotExperiment() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi! I'm Daniel's assistant. He's a Software Developer & React Native Developer based in Lagos, Nigeria. Ask me anything about his work!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "Network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lab-canvas-wrap" style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <div className="lab-canvas-label" style={{ zIndex: 10 }}>AI CHATBOT</div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            {m.role === 'assistant' && (
              <img src="/daniel-photo.jpg" alt="Daniel" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
            )}
            <div style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: m.role === 'user' ? 'var(--cyan)' : 'var(--bg-secondary)',
              color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
              fontSize: '0.8rem',
              border: m.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
              wordBreak: 'break-word'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
            <img src="/daniel-photo.jpg" alt="Daniel" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
              <span className="dot-typing" style={{ letterSpacing: '2px' }}>...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        <form onSubmit={sendMessage} className="d-flex gap-2">
          <input
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={loading}
          />
          <button type="submit" className="magnetic-btn primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Lab Section ──────────────────────────────────────────────────────────
export default function LabSection() {
  return (
    <section id="lab" className="section-padding lab-section">
      <div className="container">
        <div className="text-center mb-5 reveal">
          <p className="section-eyebrow">Experiments</p>
          <h2 style={{ color: 'var(--cyan)' }} className="section-title">The Lab</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', maxWidth: 480, margin: '1rem auto 0' }}>
            Interactive playgrounds where AI meets code meets physics.
          </p>
        </div>

        <div className="row g-4">
          {/* Neural Gravity */}
          <div className="col-12 col-lg-6 reveal" style={{ animationDelay: '0.1s' }}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>🧠</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan)' }}>Neural Gravity Simulator</span>
              <span className="tech-pill">Canvas API</span>
            </div>
            <NeuralGravitySimulator />
          </div>

          {/* AI Prompt Float */}
          <div className="col-12 col-lg-6 reveal" style={{ animationDelay: '0.2s' }}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan)' }}>AI Prompt Float</span>
              <span className="tech-pill">Web Animations</span>
            </div>
            <AIPromptFloat />
          </div>

          {/* Code Orbit */}
          <div className="col-12 col-lg-6 reveal" style={{ animationDelay: '0.3s' }}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>💻</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan)' }}>Code Orbit</span>
              <span className="tech-pill">CSS Animations</span>
            </div>
            <CodeOrbit />
          </div>

          {/* Quantum Data Stream */}
          <div className="col-12 col-lg-6 reveal" style={{ animationDelay: '0.4s' }}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>🌊</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan)' }}>Quantum Data Stream</span>
              <span className="tech-pill">Canvas Rain</span>
            </div>
            <QuantumDataStream />
          </div>

          {/* AI Chatbot */}
          <div className="col-12 col-lg-6 reveal" style={{ animationDelay: '0.5s' }}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan)' }}>Daniel AI</span>
              <span className="tech-pill">ChatGPT API</span>
            </div>
            <ChatbotExperiment />
          </div>
        </div>
      </div>
    </section>
  );
}
