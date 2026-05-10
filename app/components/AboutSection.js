'use client';

const TIMELINE = [
  {
    year: '2024 — Present',
    role: 'AI Generalist & Full-Stack Developer',
    place: 'Freelance / Independent',
    desc: 'Building AI-powered applications and full-stack systems using Python and JavaScript. Exploring the intersection of software development and engineering to deliver real, working products.',
  },
  {
    year: '2023 — 2024',
    role: 'Software Developer',
    place: 'Systems Engineering',
    desc: 'Developed production-ready web applications and integrated AI capabilities into existing workflows. Focused on Python backends and modern JavaScript frontends.',
  },
  {
    year: '2022 — 2023',
    role: 'Junior Developer & AI Enthusiast',
    place: 'Self-Taught / Open Source',
    desc: 'Deep-dived into Python, JavaScript, and AI fundamentals. Built personal projects, contributed to open source, and developed a strong foundation in full-stack development.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="container">
        <div className="row gy-5 align-items-start">
          {/* Bio */}
          <div className="col-lg-5 reveal">
            <p className="section-eyebrow">About</p>
            <h3 className="section-title mb-4">Daniel Lewis</h3>
            <p style={{
              fontSize: '1.05rem', color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '1.5rem',
            }}>
              I&apos;m an aspiring Software Developer and AI Generalist based in Lagos. I’m currently focused on developing my skills in programming, web development, artificial intelligence, and automation technologies.

              My passion for technology comes from a desire to create smart, useful, and innovative solutions that improve how people interact with digital systems. I enjoy learning new tools, building projects, and exploring how AI can be integrated into modern applications.

              As a beginner developer, I value consistency, curiosity, and continuous improvement. Every project I build helps me strengthen my understanding of software engineering principles and real-world development practices.

              I’m actively growing in areas such as:

              Frontend development
              Backend development
              Artificial intelligence tools
              Prompt engineering
              Automation systems
              API integration
              Modern web technologies
              Problem-solving with code

              My long-term goal is to become a highly skilled developer capable of building intelligent and impactful technology products.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Whether it&apos;s integrating AI into practical applications, building full-stack platforms
              from scratch, or tackling complex system challenges — I focus on shipping code that works.
              I believe in learning by building, and every project is an opportunity to push further.
            </p>

            {/* Stats */}
            <div className="row g-3">
              {[
                { n: '3+', label: 'Years Building' },
                { n: '15+', label: 'Projects Shipped' },
                { n: 'AI', label: 'Generalist' },
                { n: '∞', label: 'Ideas to Ship' },
              ].map(({ n, label }) => (
                <div key={label} className="col-6">
                  <div className="glass" style={{ borderRadius: 14, padding: '1rem' }}>
                    <div style={{
                      fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em',
                      background: 'linear-gradient(135deg, #D85A21, #8B4513)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{n}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="col-lg-6 offset-lg-1 reveal" style={{ animationDelay: '0.2s' }}>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gray-400)', fontWeight: 700, marginBottom: '2rem',
            }}>
              Journey
            </p>
            <div>
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="timeline-item reveal"
                  style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                >
                  <div className="timeline-card">
                    <div style={{ fontSize: '0.65rem', color: 'var(--cyan)', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {item.year}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.15rem' }}>{item.role}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--violet)', fontWeight: 600, marginBottom: '0.5rem' }}>{item.place}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
