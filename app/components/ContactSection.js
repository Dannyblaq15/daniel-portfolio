'use client';

import { useMemo, useRef, useState } from 'react';

const INITIAL_FIELDS = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
};

const LIMITS = {
  name: [2, 80],
  subject: [3, 120],
  message: [20, 1200],
};

function validate(fields) {
  const errors = {};
  if (fields.name.trim().length < LIMITS.name[0]) errors.name = 'Please enter your name.';
  if (fields.name.trim().length > LIMITS.name[1]) errors.name = 'Name is too long.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Please enter a valid email address.';
  if (fields.subject.trim().length < LIMITS.subject[0]) errors.subject = 'Please add a short subject.';
  if (fields.subject.trim().length > LIMITS.subject[1]) errors.subject = 'Subject is too long.';
  if (fields.message.trim().length < LIMITS.message[0]) errors.message = 'Message should be at least 20 characters.';
  if (fields.message.trim().length > LIMITS.message[1]) errors.message = 'Message is too long.';
  return errors;
}

export default function ContactSection() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const statusRef = useRef(null);
  const errors = useMemo(() => validate(fields), [fields]);
  const canSubmit = Object.keys(errors).length === 0 && status.type !== 'loading';

  const updateField = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const currentErrors = validate(fields);
    if (Object.keys(currentErrors).length) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields before sending.' });
      statusRef.current?.focus();
      return;
    }

    setStatus({ type: 'loading', message: 'Sending your message...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'The message could not be sent. Please try again.');
      }

      setFields(INITIAL_FIELDS);
      setTouched({});
      setStatus({ type: 'success', message: 'Thanks — your message has been sent.' });
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please retry or use the email link.' });
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  const showError = (name) => touched[name] && errors[name];

  return (
    <section id="contact" className="section">
      <div className="container contact-layout">
        <div className="section-header reveal">
          <p className="section-eyebrow">Contact</p>
          <h2 className="section-title">Let&apos;s Build Something Useful</h2>
          <p className="section-copy">
            Have a project, role, collaboration, or technical idea in mind? Send me a message and I&apos;ll get back to you.
          </p>

          <div className="contact-links" style={{ marginTop: '1.25rem' }}>
            <a className="button button-secondary" href="mailto:dl5357742@gmail.com">Email Daniel</a>
            <a className="button button-secondary" href="https://github.com/Dannyblaq15" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="button button-secondary" href="https://www.linkedin.com/in/daniel-lewis-739635232/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>

          <p className="privacy-note" style={{ marginTop: '1rem' }}>
            Privacy note: your message is used only to respond to your inquiry.
          </p>
        </div>

        <form className="card contact-form reveal" onSubmit={handleSubmit} noValidate>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" tabIndex="-1" autoComplete="off" value={fields.company} onChange={updateField} />
          </div>

          <div
            ref={statusRef}
            className={`status-region ${status.type === 'success' ? 'success' : ''} ${status.type === 'error' ? 'error' : ''}`}
            tabIndex="-1"
            role="status"
            aria-live="polite"
          >
            {status.message || 'All fields marked with an asterisk are required.'}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="contact-name">Name <span className="required">*</span></label>
              <input
                id="contact-name"
                name="name"
                value={fields.name}
                onChange={updateField}
                onBlur={() => setTouched((current) => ({ ...current, name: true }))}
                placeholder="Daniel Lewis"
                autoComplete="name"
                required
                minLength={LIMITS.name[0]}
                maxLength={LIMITS.name[1]}
                aria-invalid={Boolean(showError('name'))}
                aria-describedby="contact-name-error"
              />
              <p id="contact-name-error" className="field-error">{showError('name') || ''}</p>
            </div>

            <div className="field">
              <label htmlFor="contact-email">Email <span className="required">*</span></label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={fields.email}
                onChange={updateField}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-invalid={Boolean(showError('email'))}
                aria-describedby="contact-email-error"
              />
              <p id="contact-email-error" className="field-error">{showError('email') || ''}</p>
            </div>

            <div className="field full">
              <label htmlFor="contact-subject">Subject <span className="required">*</span></label>
              <input
                id="contact-subject"
                name="subject"
                value={fields.subject}
                onChange={updateField}
                onBlur={() => setTouched((current) => ({ ...current, subject: true }))}
                placeholder="Project, role, collaboration, or idea"
                required
                minLength={LIMITS.subject[0]}
                maxLength={LIMITS.subject[1]}
                aria-invalid={Boolean(showError('subject'))}
                aria-describedby="contact-subject-error"
              />
              <p id="contact-subject-error" className="field-error">{showError('subject') || ''}</p>
            </div>

            <div className="field full">
              <label htmlFor="contact-message">Message <span className="required">*</span></label>
              <textarea
                id="contact-message"
                name="message"
                value={fields.message}
                onChange={updateField}
                onBlur={() => setTouched((current) => ({ ...current, message: true }))}
                placeholder="Tell me what you are building, hiring for, or exploring."
                required
                minLength={LIMITS.message[0]}
                maxLength={LIMITS.message[1]}
                aria-invalid={Boolean(showError('message'))}
                aria-describedby="contact-message-error contact-message-count"
              />
              <p id="contact-message-error" className="field-error">{showError('message') || ''}</p>
              <span id="contact-message-count" className="char-count">{fields.message.length}/{LIMITS.message[1]} characters</span>
            </div>
          </div>

          <div className="form-foot">
            <button type="submit" className="button button-primary" disabled={!canSubmit}>
              {status.type === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status.type === 'error' && (
              <button type="button" className="button button-secondary" onClick={handleSubmit}>
                Retry
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
