'use client';

const PILLARS = [
  'Software development',
  'System design',
  'GitHub and open source',
  'AI-assisted building',
  'Hackathons',
  'Technology product analysis',
  'Building in public',
];

export default function ContentSection() {
  return (
    <section id="content" className="section section-muted">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-eyebrow">Content</p>
          <h2 className="section-title">Content and Learning</h2>
          <p className="section-copy">
            I create simple, relatable content about software development, system design, GitHub,
            open source, AI-assisted development, hackathons, technology products, and building in
            public—with some phonk-powered personality.
          </p>
        </div>

        <div className="grid grid-3">
          {PILLARS.map((pillar) => (
            <article className="card content-card reveal" key={pillar}>
              <h3>{pillar}</h3>
              <p className="section-copy" style={{ fontSize: '0.95rem' }}>Content coming soon.</p>
            </article>
          ))}
        </div>

        <div className="developer-note reveal" style={{ marginTop: '1.5rem' }}>
          Developer note: the site has used both <strong>https://x.com/Marodtech</strong> and GitHub identity
          <strong> Dannyblaq15</strong>. Please choose the correct X/Twitter URL before adding it as a public profile link.
        </div>
      </div>
    </section>
  );
}
