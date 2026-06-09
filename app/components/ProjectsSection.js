'use client';

const PROJECTS = [
  {
    id: 1,
    emoji: '🐛',
    title: 'Wahala Tracker',
    subtitle: 'Issue Tracking Web App',
    description:
      'A web-based issue tracking application built during my learning journey. Designed to help teams log, manage, and resolve issues efficiently with a clean, responsive interface.',
    features: [
      'User Authentication',
      'Responsive Design',
      'Issue Tracking',
      'Cloud Deployment',
    ],
    tech: ['JavaScript', 'HTML', 'CSS', 'GitHub', 'Vercel'],
    color: '#D85A21',
    status: 'Live',
    github: 'https://github.com/Dannyblaq15',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}>
      <div className="container">
        <div className="text-center mb-5 reveal">
          <p className="section-eyebrow">Work</p>
          <h2 style={{ color: 'var(--cyan)' }} className="section-title">Featured Projects</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
            Projects I&apos;ve built along my development journey.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className="col-lg-8 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div
                className="glass"
                style={{
                  borderRadius: 24,
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                  border: `1px solid ${project.color}22`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${project.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Glow accent */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 200, height: 200,
                  background: `radial-gradient(circle, ${project.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div className="row g-4 align-items-center">
                  {/* Left: Info */}
                  <div className="col-md-7">
                    {/* Header */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span style={{ fontSize: '2.5rem' }}>{project.emoji}</span>
                      <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <h3 style={{
                            fontSize: '1.4rem', fontWeight: 900, margin: 0,
                            background: `linear-gradient(135deg, ${project.color}, #8B4513)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                          }}>
                            {project.title}
                          </h3>
                          <span style={{
                            background: `${project.color}18`, border: `1px solid ${project.color}44`,
                            borderRadius: 999, padding: '0.15rem 0.6rem',
                            fontSize: '0.6rem', color: project.color, fontWeight: 700, letterSpacing: '0.1em',
                          }}>
                            ● {project.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0, marginTop: '0.15rem', letterSpacing: '0.05em' }}>
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--white)', opacity: 0.8, lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {project.tech.map((t) => (
                        <span key={t} className="tech-pill">{t}</span>
                      ))}
                    </div>

                    {/* CTA */}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="magnetic-btn secondary"
                      style={{ fontSize: '0.82rem', textDecoration: 'none', display: 'inline-block' }}
                    >
                      View on GitHub ↗
                    </a>
                  </div>

                  {/* Right: Features */}
                  <div className="col-md-5">
                    <p style={{
                      fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: 'var(--gray-600)', fontWeight: 700, marginBottom: '1rem',
                    }}>
                      Key Features
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {project.features.map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                            background: project.color,
                            boxShadow: `0 0 8px ${project.color}`,
                          }} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--white)', opacity: 0.8 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
