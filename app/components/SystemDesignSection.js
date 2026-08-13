'use client';

const NODES = [
  ['Visitor', 'Uses the web app to log and review stress entries.'],
  ['Client app', 'Responsive interface for entry creation, severity, and pattern review.'],
  ['Auth', 'Supabase configuration is present; exact auth screens and policies should be reviewed before documenting deeper.'],
  ['API / server', 'Next.js App Router project with server-capable routes and integrations.'],
  ['Database', 'Supabase is configured for backend data services.'],
];

const DETAILS = [
  ['User problem', 'Wahala Tracker focuses on quick personal stress logging and lightweight reflection.'],
  ['Client application', 'The visible product is a responsive web app deployed to Vercel.'],
  ['Authentication', 'The public repository includes Supabase environment configuration. Auth behavior should be reviewed directly before describing policy details.'],
  ['API or server', 'The repository is a TypeScript Next.js 16 app with React 19 and server-capable framework conventions.'],
  ['Database', 'Supabase is present in configuration and dependencies; database schema details are not repeated here without inspecting migrations or tables.'],
  ['Deployment', 'The live demo is deployed at wahala-tracker.vercel.app.'],
  ['Data flow', 'A user creates an entry, adds severity/context, the app validates input, stores the record, then presents patterns back in the UI.'],
  ['Security and privacy', 'Stress logs are personal data, so the product should validate input, avoid exposing user records, and keep secrets server-side.'],
  ['Current tradeoffs', 'The product keeps the first version simple and understandable instead of adding heavier analytics too early.'],
  ['Possible scaling improvements', 'After repository verification, useful next steps may include stronger analytics, export flows, retention controls, and clearer privacy settings.'],
];

export default function SystemDesignSection() {
  return (
    <section id="system-design" className="section">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-eyebrow">System Design</p>
          <h2 className="section-title">How I Design Systems</h2>
          <p className="section-copy">
            Wahala Tracker is the first case study: a compact product shaped around fast input,
            user-owned records, and clear feedback loops.
          </p>
        </div>

        <div className="system-diagram reveal" aria-label="Wahala Tracker architecture overview">
          {NODES.map(([title, copy]) => (
            <div className="system-node" key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-2" style={{ marginTop: '1.25rem' }}>
          {DETAILS.map(([label, copy]) => (
            <article className="meta-box reveal" key={label}>
              <span className="meta-label">{label}</span>
              <span className="meta-value">{copy}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
