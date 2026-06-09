import * as React from 'react';

export interface EmailTemplateProps {
  firstName: string;
  message?: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ firstName, message }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
    <h1 style={{ color: '#333' }}>New message from {firstName}</h1>
    {message && <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>}
  </div>
);
