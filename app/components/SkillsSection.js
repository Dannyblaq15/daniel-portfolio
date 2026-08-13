'use client';

const SKILL_GROUPS = [
  { title: 'Frontend', skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Responsive Design'] },
  { title: 'Mobile', skills: ['React Native', 'Mobile UI', 'Huawei Native training'] },
  { title: 'Backend and APIs', skills: ['REST APIs', 'Node.js basics', 'Server routes'] },
  { title: 'Developer tools', skills: ['Git', 'GitHub', 'Vercel', 'ESLint'] },
  { title: 'Design', skills: ['Figma', 'Canva', 'Adobe Photoshop', 'Interface polish'] },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="section section-muted">
      <div className="container">
        <div className="section-header center reveal">
          <p className="section-eyebrow">Skills</p>
          <h2 className="section-title">Technologies Daniel Uses</h2>
          <p className="section-copy">
            A practical stack for building responsive products, integrating APIs, and polishing user-facing interfaces.
          </p>
        </div>

        <div className="grid skills-grid">
          {SKILL_GROUPS.map((group) => (
            <article className="card skill-card reveal" key={group.title}>
              <h3>{group.title}</h3>
              <div className="tag-list">
                {group.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
