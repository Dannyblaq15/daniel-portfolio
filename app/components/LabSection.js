'use client';

import { useEffect, useRef, useState } from 'react';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function ParticlePanel() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let raf = 0;
    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      ctx.strokeStyle = 'rgba(201, 79, 22, 0.22)';

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const x = p.x * width;
        const y = p.y * height;
        ctx.beginPath();
        ctx.arc(x, y, 3 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        particles.slice(index + 1).forEach((other) => {
          const ox = other.x * width;
          const oy = other.y * height;
          const distance = Math.hypot(ox - x, oy - y);
          if (distance < 130 * window.devicePixelRatio) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        });
      });

      frame += 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <div className="prompt-stage" aria-label="Animated particle canvas">
      {reducedMotion ? (
        <p className="section-copy" style={{ padding: '1rem', margin: 0 }}>Motion is reduced, so the particle field is paused.</p>
      ) : (
        <canvas ref={canvasRef} style={{ width: '100%', height: 180, display: 'block' }} />
      )}
    </div>
  );
}

function PromptPlayground() {
  const [words, setWords] = useState([]);
  const reducedMotion = useReducedMotion();

  const addWords = (text) => {
    const next = text.trim().split(/\s+/).filter(Boolean).slice(0, 8).map((word, index) => ({
      word,
      left: 8 + ((index * 17) % 70),
      top: 18 + ((index * 23) % 58),
    }));
    setWords(next);
  };

  return (
    <>
      <div className="lab-controls">
        {['Build useful things', 'Ship, learn, improve', 'Open source energy'].map((prompt) => (
          <button key={prompt} type="button" className="button button-secondary" onClick={() => addWords(prompt)}>
            {prompt}
          </button>
        ))}
        <button type="button" className="button button-quiet" onClick={() => setWords([])}>Reset</button>
      </div>
      <div className="prompt-stage" aria-live="polite">
        {words.length ? words.map((item) => (
          <span
            key={`${item.word}-${item.left}`}
            className="floating-word"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              animation: reducedMotion ? 'none' : undefined,
            }}
          >
            {item.word}
          </span>
        )) : (
          <p className="section-copy" style={{ padding: '1rem', margin: 0 }}>Choose a prompt to float a few words.</p>
        )}
      </div>
    </>
  );
}

function PortfolioChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm Daniel's portfolio assistant. Ask me about his work, skills, projects, or how to contact him.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const statusRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.message || 'I could not answer that yet.' }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'The chat service is unavailable right now. Please try again later.' }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => statusRef.current?.scrollIntoView({ block: 'nearest' }));
    }
  };

  return (
    <div className="chatbot-shell">
      <div className="chatbot-log" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="chat-message assistant">Thinking...</div>}
        <div ref={statusRef} />
      </div>
      <form className="chatbot-form" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="portfolio-chat-input">Ask Daniel&apos;s assistant</label>
        <input
          id="portfolio-chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Daniel's projects..."
          disabled={loading}
        />
        <button type="submit" className="button button-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default function LabSection() {
  return (
    <section id="lab" className="section section-muted">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-eyebrow">Lab</p>
          <h2 className="section-title">Playful Experiments</h2>
          <p className="section-copy">
            Optional experiments that show Daniel&apos;s creative side without getting in the way of the portfolio.
          </p>
        </div>

        <div className="grid grid-3">
          <article className="card lab-card reveal">
            <h3>Signal Field</h3>
            <p className="section-copy" style={{ fontSize: '0.95rem' }}>
              A small canvas experiment with cleanup on unmount and reduced-motion support.
            </p>
            <ParticlePanel />
          </article>
          <article className="card lab-card reveal">
            <h3>Prompt Float</h3>
            <p className="section-copy" style={{ fontSize: '0.95rem' }}>
              Keyboard-friendly buttons add and reset floating prompt fragments.
            </p>
            <PromptPlayground />
          </article>
          <article className="card lab-card reveal">
            <h3>Daniel AI</h3>
            <p className="section-copy" style={{ fontSize: '0.95rem' }}>
              A Qwen-powered assistant for quick questions about Daniel&apos;s portfolio.
            </p>
            <PortfolioChatbot />
          </article>
        </div>
      </div>
    </section>
  );
}
