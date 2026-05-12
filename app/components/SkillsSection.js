'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// SKILLS SECTION
// Double-tap any skill → skill icon breaks free, floats around screen with
// glowing trail. Other skills pulse reactively.
// ──────────────────────────────────────────────────────────────────────────────

const SKILLS = [
  { id: 1, icon: '🐍', name: 'Python', category: 'Backend' },
  { id: 2, icon: '⚡', name: 'JavaScript', category: 'Frontend' },
  { id: 3, icon: '🤖', name: 'AI / LLMs', category: 'AI/ML' },
  { id: 4, icon: '⚛️', name: 'React / Next.js', category: 'Frontend' },
  { id: 5, icon: '🌐', name: 'Node.js', category: 'Backend' },
  { id: 6, icon: '✨', name: 'Generative AI', category: 'AI/ML' },
  { id: 7, icon: '🗄️', name: 'Databases / SQL', category: 'Backend' },
  { id: 8, icon: '🔧', name: 'REST APIs', category: 'Backend' },
  { id: 10, icon: '🐳', name: 'Git / DevOps', category: 'Tools' },
  { id: 11, icon: '🎨', name: 'HTML / CSS', category: 'Frontend' },
  { id: 12, icon: '🏗️', name: 'Systems Design', category: 'Tools' },
];

function FloatingSkill({ skill, onDone }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [trails, setTrails] = useState([]);
  const rafRef = useRef(null);
  const posRef = useRef(null);
  const velRef = useRef(null);
  const trailIdRef = useRef(0);
  const elRef = useRef(null);

  useEffect(() => {
    if (!posRef.current) posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (!velRef.current) velRef.current = { vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 };

    let frame = 0;
    const animate = () => {
      const { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      // Bounce
      if (x < 60 || x > window.innerWidth - 60) vx *= -1;
      if (y < 60 || y > window.innerHeight - 60) vy *= -1;

      posRef.current = { x: x + vx, y: y + vy };
      velRef.current = { vx, vy };

      setPos({ x: posRef.current.x, y: posRef.current.y });

      // Spawn trail every 6 frames
      if (frame % 6 === 0) {
        const id = ++trailIdRef.current;
        setTrails((t) => [
          ...t.slice(-12),
          { id, x: posRef.current.x, y: posRef.current.y },
        ]);
      }
      frame++;
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Auto-return after 6s
    const timer = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      onDone();
    }, 6000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <>
      {/* Trails */}
      {trails.map((t, i) => (
        <div
          key={t.id}
          className="skill-trail"
          style={{
            left: t.x,
            top: t.y,
            opacity: (i / trails.length) * 0.8,
            transform: 'translate(-50%, -50%)',
            width: 4 + i / 3,
            height: 4 + i / 3,
          }}
        />
      ))}
      {/* Floating skill */}
      <div
        ref={elRef}
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 600,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--cyan)',
          borderRadius: 14,
          padding: '0.75rem 1rem',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(216,90,33,0.5)',
          pointerEvents: 'none',
          minWidth: 80,
        }}
      >
        <span style={{ fontSize: '1.5rem', display: 'block' }}>{skill.icon}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontWeight: 700 }}>{skill.name}</span>
      </div>
    </>
  );
}

export default function SkillsSection() {
  const [floatingSkill, setFloatingSkill] = useState(null);
  const [pulsingIds, setPulsingIds] = useState([]);
  const lastTapRef = useRef({});

  const handleTap = useCallback((skill) => {
    const now = Date.now();
    const last = lastTapRef.current[skill.id] || 0;
    if (now - last < 350) {
      // Launch skill
      setFloatingSkill(skill);
      // Pulse others
      const others = SKILLS.filter((s) => s.id !== skill.id).map((s) => s.id);
      setPulsingIds(others);
      setTimeout(() => setPulsingIds([]), 600);
      lastTapRef.current[skill.id] = 0;
    } else {
      lastTapRef.current[skill.id] = now;
    }
  }, []);

  const categories = [...new Set(SKILLS.map((s) => s.category))];

  return (
    <section id="skills" className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
      <div className="container">
        <div className="text-center mb-5 reveal">
          <p className="section-eyebrow">Capabilities</p>
          <h2 style={{ color: 'var(--cyan)' }} className="section-title">Skills & Tools</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
            Double-click any skill to watch it defy gravity ↑
          </p>
        </div>

        {categories.map((cat, ci) => (
          <div key={cat} className="mb-5 reveal" style={{ animationDelay: `${ci * 0.1}s` }}>
            <p style={{
              fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--gray-400)', fontWeight: 700, marginBottom: '1rem',
            }}>
              {cat}
            </p>
            <div className="row g-3">
              {SKILLS.filter((s) => s.category === cat).map((skill) => (
                <div key={skill.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <div
                    className={`skill-item${pulsingIds.includes(skill.id) ? ' pulsing' : ''}`}
                    onClick={() => handleTap(skill)}
                    onDoubleClick={() => { setFloatingSkill(skill); }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${skill.name} — double-click to launch`}
                    onKeyDown={(e) => e.key === 'Enter' && setFloatingSkill(skill)}
                    title="Double-click to launch into orbit"
                  >
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating skill overlay */}
      {floatingSkill && (
        <FloatingSkill
          skill={floatingSkill}
          onDone={() => setFloatingSkill(null)}
        />
      )}
    </section>
  );
}
