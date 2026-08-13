'use client';

import Image from 'next/image';

const CV_PATH = '/Daniel-Lewis-CV.pdf';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Dannyblaq15', text: 'GH' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-lewis-739635232/', text: 'IN' },
  { label: 'Email Daniel', href: 'mailto:dl5357742@gmail.com', text: '@' },
];

function scrollToSection(event, href) {
  event.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <div className="reveal">
          <span className="pill">
            <span className="status-dot" aria-hidden="true" />
            Available for opportunities
          </span>
          <h1>Software &amp; React Native Developer building practical web and mobile products.</h1>
          <p className="hero-sub">
            I create responsive applications with clean interfaces, reliable functionality,
            and thoughtful user experiences.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#projects" onClick={(event) => scrollToSection(event, '#projects')}>
              View My Work
            </a>
            <a className="button button-secondary" href="#contact" onClick={(event) => scrollToSection(event, '#contact')}>
              Contact Me
            </a>
            <a className="button button-quiet" href={CV_PATH} download>
              Download CV
            </a>
          </div>

          <div className="social-links" aria-label="Social links">
            {SOCIALS.map(({ label, href, text }) => (
              <a
                key={label}
                className="social-link"
                href={href}
                aria-label={label}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {text}
              </a>
            ))}
          </div>
        </div>

        <div className="portrait-wrap reveal">
          <div className="hero-image-frame">
            <Image
              src="/daniel-photo.jpg"
              alt="Portrait of Daniel Lewis"
              width={760}
              height={950}
              priority
              sizes="(max-width: 620px) 290px, (max-width: 900px) 320px, 380px"
            />
          </div>
          <p className="portrait-note">Double-tap the logo for a small anti-gravity moment.</p>
        </div>
      </div>
    </section>
  );
}
