'use client';

const PROJECTS = [
  {
    title: 'Wahala Tracker',
    description:
      'A Nigerian-flavoured stress-tracking application that helps users record daily problems, measure severity, identify patterns, and manage their wellbeing.',
    problem: 'People need a simple way to capture stressful events and notice repeat patterns without a heavy productivity tool.',
    role: 'Product builder and frontend developer',
    tech: ['TypeScript', 'Next.js 16', 'React 19', 'Supabase', 'Firebase packages', 'Recharts', 'Framer Motion', 'Vercel'],
    features: ['Daily problem logging', 'Severity tracking', 'Pattern-oriented dashboard'],
    decision: 'Keep the core flow focused on fast personal logging before adding heavier analytics or collaboration.',
    status: 'Live project. Public repository verified.',
    github: 'https://github.com/Dannyblaq15/wahala-tracker',
    demo: 'https://wahala-tracker.vercel.app/',
  },
  {
    title: 'HMS Health Connect',
    description:
      'A mobile health-connectivity project from Huawei Native Developer training, currently treated as training work until a public repository is available.',
    problem: 'Explore mobile health service integrations and account-based flows in the Huawei ecosystem.',
    role: 'Trainee developer',
    tech: ['Huawei Mobile Services', 'HarmonyOS training', 'Mobile UI'],
    features: ['Training project scope', 'Health service exploration', 'Mobile interaction patterns'],
    decision: 'Presented as in development so planned features are not shown as completed production functionality.',
    status: 'In development / private repository',
    github: null,
    demo: null,
  },
  {
    title: 'Ink and Paper',
    description:
      'A local-first Flutter notepad app translated from a Google Stitch design into a working mobile note-taking experience.',
    problem: 'Users need a simple notes app that can create and store notes locally without depending on a network connection.',
    role: 'Flutter developer',
    tech: ['Flutter', 'Dart', 'Riverpod', 'Hive', 'hive_flutter', 'path_provider', 'uuid', 'google_fonts', 'flutter_svg'],
    features: ['Local note storage', 'Note list and editor screens', 'Custom splash and app icon assets'],
    decision: 'Use Hive for lightweight local persistence and Riverpod to keep note state and UI updates organized.',
    status: 'Source available. Local-first mobile app.',
    github: 'https://github.com/Dannyblaq15/ink-and-paper',
    demo: null,
  },
  {
    title: 'Kinetic Finance',
    description:
      'A React Native fintech app prototype with authentication flow, dashboard navigation, budgets, cards, goals, subscriptions, and transaction screens.',
    problem: 'Personal finance apps need clear mobile navigation for money overview, budgeting, goals, cards, and account actions.',
    role: 'React Native developer',
    tech: ['React Native 0.85', 'Expo 56', 'React 19', 'React Navigation', 'Supabase', 'Firebase', 'Expo Local Authentication', 'Reanimated'],
    features: ['Auth and onboarding flow', 'Finance dashboard with tab navigation', 'Budget, card, goal, subscription, and transaction screens'],
    decision: 'Use stack and bottom-tab navigation to separate onboarding/auth screens from the main finance workspace.',
    status: 'Source available. React Native fintech prototype.',
    github: 'https://github.com/Dannyblaq15/kinetic-finance',
    demo: null,
  },
];

function ProjectMockup({ project }) {
  if (project.title === 'Ink and Paper') {
    return (
      <div className="project-shot" aria-label="Ink and Paper app preview">
        <div className="mock-phone">
          <div className="mock-phone-top" />
          <div className="mock-note-header">Ink &amp; Paper</div>
          <div className="mock-note-card"><strong>Project ideas</strong><span>Polish portfolio, ship notes...</span></div>
          <div className="mock-note-card"><strong>Learning log</strong><span>Flutter state, local storage...</span></div>
          <div className="mock-note-button">+</div>
        </div>
      </div>
    );
  }

  if (project.title === 'Kinetic Finance') {
    return (
      <div className="project-shot" aria-label="Kinetic Finance app preview">
        <div className="mock-phone finance">
          <div className="mock-phone-top" />
          <div className="mock-finance-balance">
            <span>Total balance</span>
            <strong>$8,420.00</strong>
          </div>
          <div className="mock-finance-row"><span>Budgets</span><strong>68%</strong></div>
          <div className="mock-finance-row"><span>Goals</span><strong>4 active</strong></div>
          <div className="mock-finance-row"><span>Cards</span><strong>2 linked</strong></div>
          <div className="mock-finance-tabs"><span /><span /><span /><span /></div>
        </div>
      </div>
    );
  }

  if (project.title === 'HMS Health Connect') {
    return (
      <div className="project-shot">
        <div className="mock-browser">
          <div className="mock-bar"><span /><span /><span /></div>
          <div className="mock-body">
            <div className="mock-card"><strong>Mobile health training</strong></div>
            <div className="mock-card">Account and service integration practice</div>
            <div className="mock-card">Private or in-development repository</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-shot" aria-label="Wahala Tracker interface preview">
      <div className="mock-browser">
        <div className="mock-bar"><span /><span /><span /></div>
        <div className="mock-body">
          <div className="mock-card">
            <strong>Today&apos;s Wahala</strong>
            <p className="section-copy" style={{ marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Log the issue, choose severity, and save the pattern.
            </p>
          </div>
          <div className="mock-card">
            <span className="meta-label">Severity</span>
            <div className="mock-meter"><span /></div>
          </div>
          <div className="grid grid-2">
            <div className="mock-card">Patterns</div>
            <div className="mock-card">Wellbeing notes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section section-muted">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-eyebrow">Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-copy">
            Completed and in-progress work, shown with honest scope, clear links, and the decisions behind the build.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <article key={project.title} className="card project-card reveal">
              <ProjectMockup project={project} />

              <div className="project-details">
                <span className="pill">{project.status}</span>
                <h3 style={{ marginTop: '1rem' }}>{project.title}</h3>
                <p className="section-copy">{project.description}</p>

                <div className="project-meta">
                  <div className="meta-box">
                    <span className="meta-label">Problem</span>
                    <span className="meta-value">{project.problem}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">My role</span>
                    <span className="meta-value">{project.role}</span>
                  </div>
                </div>

                <span className="meta-label">Technologies</span>
                <div className="tag-list">
                  {project.tech.map((tech) => <span className="tag" key={tech}>{tech}</span>)}
                </div>

                <span className="meta-label">Key features</span>
                <ul className="feature-list">
                  {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>

                <div className="meta-box" style={{ marginTop: '1rem' }}>
                  <span className="meta-label">Technical challenge or decision</span>
                  <span className="meta-value">{project.decision}</span>
                </div>

                <div className="card-actions">
                  <a className="button button-secondary" href="#system-design">
                    View Case Study
                  </a>
                  {project.demo && (
                    <a className="button button-primary" href={project.demo} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a className="button button-secondary" href={project.github} target="_blank" rel="noopener noreferrer">
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
