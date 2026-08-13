'use client';

import Image from 'next/image';

const BOOKS = [
  {
    title: 'The Marod Tech Handbook',
    description: 'A practical guide for businesses and leaders exploring modern technology.',
    cover: '/book-cover.png',
    href: '/ebook/marod-tech-handbook.docx',
    type: 'DOCX',
  },
  {
    title: 'AI Stack for Junior Developers',
    description: 'A hands-on guide to modern AI stacks, APIs, and junior developer workflows.',
    cover: '/ai-stack-cover.png',
    href: '/ebook/AI-Stack-for-Junior-Developers-MarodTech.pdf',
    type: 'PDF',
  },
];

export default function BookSection() {
  return (
    <section id="books" className="section">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-eyebrow">Books</p>
          <h2 className="section-title">Library Ledge</h2>
          <p className="section-copy">
            Free resources Daniel has made available. Each card is a real link and works with mouse,
            touch, keyboard, and screen readers.
          </p>
        </div>

        <div className="grid grid-2">
          {BOOKS.map((book) => (
            <a
              key={book.title}
              className="card book-card reveal"
              href={book.href}
              download
              aria-label={`Download ${book.title}, ${book.type} file`}
            >
              <Image
                className="book-cover"
                src={book.cover}
                alt={`${book.title} cover`}
                width={240}
                height={336}
                sizes="(max-width: 620px) 88px, 120px"
              />
              <span>
                <span className="pill">{book.type}</span>
                <h3 style={{ marginTop: '0.8rem' }}>{book.title}</h3>
                <span className="section-copy" style={{ display: 'block', fontSize: '0.95rem' }}>
                  {book.description}
                </span>
                <strong style={{ display: 'inline-block', marginTop: '0.8rem' }}>Download or Read</strong>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
