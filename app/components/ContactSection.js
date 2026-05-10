'use client';
import { useState, useRef } from 'react';

export default function ContactSection() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [floating, setFloating] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFloating(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        // Animate form away then show success
        setTimeout(() => {
          setSubmitted(true);
          setFloating(false);
        }, 700);
      } else {
        console.error('Failed to submit form');
        setFloating(false);
      }
    } catch (err) {
      console.error('An error occurred during submission:', err);
      setFloating(false);
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="text-center mb-5 reveal">
              <p className="section-eyebrow">Contact</p>
              <h2 className="section-title">Let&apos;s Build Something<br />That Floats</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.7 }}>
                Whether you have a project in mind, a question, or just want to connect — I&apos;d love to hear from you.
              </p>
            </div>

            <div className="glass reveal" style={{ borderRadius: 24, padding: 'clamp(1.5rem, 4vw, 2.5rem)', animationDelay: '0.1s' }}>
              {submitted ? (
                <div className="contact-success">
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
                  <h3 style={{
                    fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #D85A21, #8B4513)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>Message Launched!</h3>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Your message is now floating through the digital cosmos. I&apos;ll catch it and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFields({ name: '', email: '', subject: '', message: '' }); }}
                    className="magnetic-btn secondary"
                    style={{ marginTop: '1.5rem', border: '1px solid rgba(216,90,33,0.3)' }}
                  >
                    Send Another ↑
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  style={{
                    transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1), opacity 0.7s',
                    transform: floating ? 'translateY(-120px)' : 'none',
                    opacity: floating ? 0 : 1,
                  }}
                  noValidate
                >
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-sm-6">
                      <div className="floating-label-wrap">
                        <input
                          type="text"
                          name="name"
                          id="contact-name"
                          className="floating-label-input"
                          value={fields.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          required
                          autoComplete="name"
                        />
                        <label htmlFor="contact-name" className="floating-label">Your Name</label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-sm-6">
                      <div className="floating-label-wrap">
                        <input
                          type="email"
                          name="email"
                          id="contact-email"
                          className="floating-label-input"
                          value={fields.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          required
                          autoComplete="email"
                        />
                        <label htmlFor="contact-email" className="floating-label">Email Address</label>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="col-12">
                      <div className="floating-label-wrap">
                        <input
                          type="text"
                          name="subject"
                          id="contact-subject"
                          className="floating-label-input"
                          value={fields.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          autoComplete="off"
                        />
                        <label htmlFor="contact-subject" className="floating-label">Subject</label>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <div className="floating-label-wrap">
                        <textarea
                          name="message"
                          id="contact-message"
                          className="floating-label-input floating-label-textarea"
                          value={fields.message}
                          onChange={handleChange}
                          placeholder="Your Message"
                          required
                        />
                        <label htmlFor="contact-message" className="floating-label">Your Message</label>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12 text-center pt-1">
                      <button
                        type="submit"
                        className="magnetic-btn primary"
                        style={{ fontSize: '0.9rem', padding: '0.85rem 2.5rem' }}
                        disabled={floating}
                      >
                        {floating ? 'Launching…' : 'Send Message ↑'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
