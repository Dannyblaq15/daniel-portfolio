'use client';

const TIMELINE = [
  {
    type: 'Professional / freelance',
    title: 'Software Developer',
    detail: 'Independent project work',
    copy: 'Builds responsive interfaces, integrates APIs, fixes application issues, and deploys projects with Git, GitHub, and Vercel.',
  },
  {
    type: 'Internship',
    title: 'Software Developer Intern',
    detail: 'Industry experience',
    copy: 'Supported frontend features, testing, and bug fixes while learning how real development teams ship software.',
  },
  {
    type: 'Education',
    title: 'National Diploma — Mechanical Engineering',
    detail: 'Delta State Polytechnic, Otefe-Oghara',
    copy: 'Built analytical and problem-solving foundations that carry into software design and debugging.',
  },
  {
    type: 'Training',
    title: 'Huawei Native Developer',
    detail: 'Huawei Developer Program',
    copy: 'Training focused on mobile ecosystem development and Huawei service integrations.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container about-layout">
        <div className="section-header reveal">
          <p className="section-eyebrow">About</p>
          <h2 className="section-title">Daniel Lewis</h2>
          <p className="section-copy">
            I&apos;m Daniel Lewis, a software developer focused on building useful web and mobile
            applications with JavaScript, TypeScript, and React Native. I enjoy turning ideas into
            simple, responsive products and improving how they perform, scale, and feel to use.
          </p>
          <div className="tag-list" aria-label="Core focus areas">
            {['Web apps', 'Mobile apps', 'Responsive UI', 'API integration'].map((item) => (
              <span className="tag" key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="timeline reveal" aria-label="Experience and training timeline">
          {TIMELINE.map((item) => (
            <article className="card timeline-card" key={`${item.type}-${item.title}`}>
              <span className="timeline-type">{item.type}</span>
              <h3>{item.title}</h3>
              <p className="meta-value">{item.detail}</p>
              <p className="section-copy" style={{ marginTop: '0.5rem', fontSize: '0.98rem' }}>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
