import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Support.css';

const faqs = [
  {
    question: 'Something is wrong with my order',
    email: 'support@burgonomics.com',
    answer:
      'Email support@burgonomics.com with the order date, store and a short description. Attach up to three photos if that helps — the support form accepts them.',
  },
  {
    question: 'Payment failed or refund is pending',
    email: 'support@burgonomics.com',
    answer:
      'If a payment was deducted but no order was confirmed, or a refund has not appeared, email support@burgonomics.com with the payment reference. Refunds go back to the original payment method and usually settle in 5–7 business days, depending on your bank.',
  },
  {
    question: 'I am not receiving the OTP or cannot sign in',
    email: 'support@burgonomics.com',
    answer:
      'Check that the number is correct, that your network connection is up, and that messages are not being blocked. Wait for the resend timer before requesting another code. Still stuck? Email support@burgonomics.com from your registered number.',
  },
  {
    question: 'I want my account or my data deleted',
    email: 'support@burgonomics.com',
    answer:
      'Email support@burgonomics.com from the phone number registered to the account and we will process the deletion request.',
  },
  {
    question: 'I run a restaurant and want to partner with Burgonomics',
    email: '/partner/support',
    answer: 'Store and partner onboarding questions go to partner support.',
    link: '/partner/support',
    linkLabel: 'Go to partner support',
  },
];

const Support = () => {
  const location = useLocation();
  const isPartner = location.pathname === '/partner/support';

  return (
    <div className="legal-page">
      <div className="legal-content">
        <header className="legal-header">
          <h1 className="legal-title">SUPPORT</h1>
          {isPartner && <p className="legal-partner">Partner Support</p>}
          <p className="legal-effective">
            {isPartner
              ? 'Help for partner stores and onboarding questions. We normally reply within 2 business days.'
              : 'We normally reply within 2 business days.'}
          </p>
        </header>

        <section className="legal-section">
          <h2>Contact channels</h2>
          <ul className="legal-list">
            <li>
              <strong>General support:</strong> support@burgonomics.com — orders, payments,
              accounts and everything else.
            </li>
            <li>
              <strong>Privacy and consent questions:</strong> privacy@burgonomics.com
            </li>
            <li>
              <strong>Grievance officer:</strong> nodal@burgonomics.com
            </li>
            <li>
              <strong>Data protection contact:</strong> dpo@burgonomics.com
            </li>
            <li>
              <strong>Partner store support:</strong>{' '}
              <Link to="/partner/support">partner support</Link>
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Response time</h2>
          <p>We aim to respond to every request within 2 business days.</p>
        </section>

        <section className="legal-section">
          <h2>Common questions</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <div className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>
                  {faq.answer}{' '}
                  {faq.link ? (
                    <Link to={faq.link}>{faq.linkLabel}</Link>
                  ) : (
                    <a href={`mailto:${faq.email}`}>{faq.email}</a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
