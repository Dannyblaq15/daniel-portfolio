'use client';

const TIMELINE = [
  {
    year: '2022 — Present',
    role: 'Software Developer',
    place: 'Freelance / Independent',
    desc: 'Built and maintained web and mobile applications. Developed responsive user interfaces, integrated REST APIs, fixed application issues, and deployed projects managing code with Git and GitHub.',
  },
  {
    year: 'Internship',
    role: 'Software Developer Intern',
    place: 'Industry Experience',
    desc: 'Assisted in software development and testing. Worked on frontend features and bug fixes. Collaborated with developers on real-world projects.',
  },
  {
    year: '2022',
    role: 'National Diploma — Mechanical Engineering',
    place: 'Delta State Polytechnic, Otefe-Oghara',
    desc: 'Completed an ND in Mechanical Engineering, building strong analytical and problem-solving foundations that carry into software development.',
  },
  {
    year: 'In Training',
    role: 'Huawei Native Developer',
    place: 'Huawei Developer Program',
    desc: 'Currently undergoing Huawei Native Developer training, expanding expertise in mobile ecosystem development.',
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
            <h3 style={{ color: 'var(--cyan)' }} className="section-title mb-4">Daniel Lewis</h3>
            <p style={{
              fontSize: '1.05rem', color: 'var(--white)', opacity: 0.85, lineHeight: 1.8, marginBottom: '1.5rem',
            }}>
              I&apos;m <strong>Daniel Lewis</strong>, a Software Developer based in Lagos, Nigeria. I build web and mobile
              applications using JavaScript and React Native. I enjoy creating simple, user-friendly solutions
              and continuously improving my development skills.
            </p>
            <p style={{
              fontSize: '1.05rem', color: 'var(--white)', opacity: 0.85, lineHeight: 1.8, marginBottom: '1.5rem',
            }}>
              Currently training as a <strong style={{ color: 'var(--cyan)' }}>Huawei Native Developer</strong>,
              deepening my expertise in mobile ecosystem development.
            </p>

            {/* Stats */}
            <div className="row g-3">
              {[
                { n: '2+', label: 'Years Building' },
                { n: '5+', label: 'Projects Shipped' },
                { n: 'RN', label: 'React Native' },
                { n: '∞', label: 'Ideas to Build' },
              ].map(({ n, label }) => (
                <div key={label} className="col-6">
                  <div className="glass" style={{ borderRadius: 14, padding: '1rem' }}>
                    <div style={{
                      fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em',
                      background: 'linear-gradient(135deg, #D85A21, #8B4513)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{n}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--white)', opacity: 0.7, letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="col-lg-6 offset-lg-1 reveal" style={{ animationDelay: '0.2s' }}>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--white)', opacity: 0.8, fontWeight: 700, marginBottom: '2rem',
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
                    <p style={{ fontSize: '0.82rem', color: 'var(--white)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
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
