import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <header className="legal-header">
          <h1 className="legal-title">TERMS OF SERVICE</h1>
          <p className="legal-effective">Effective date: October 7, 2026</p>
        </header>

        <section className="legal-section">
          <h2>1. These terms</h2>
          <p>
            These Terms of Service ("Terms") are an agreement between you and Burgonomics Foods
            Pvt Ltd ("Burgonomics", "we", "us") and govern your use of the Burgonomics website
            and mobile app, including browsing the menu, placing orders and making payments. By
            using the service you accept these Terms. If you do not accept them, do not use the
            service.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Accounts</h2>
          <p>
            You sign in with your phone number through a one-time password (OTP). You are
            responsible for activity that happens through your account and for keeping your
            device and phone number secure. Provide accurate profile information and update it
            when it changes. We may suspend or close an account that is used for fraud, abuse or
            a serious breach of these Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="legal-list">
            <li>Use the service for any unlawful or fraudulent purpose</li>
            <li>Place orders with false or misleading information</li>
            <li>Interfere with, probe or reverse-engineer the service</li>
            <li>Scrape content or place automated bulk orders without written permission</li>
            <li>Impersonate another person or misrepresent your affiliation</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Menu and pricing</h2>
          <p>
            We aim to keep menu items, descriptions, images and prices accurate. Items may vary
            by store, and prices may change without notice. An order is an offer to buy; it is
            accepted only when the store confirms it. We may decline or cancel an order — for
            example when an item is out of stock, a store is closed, or we reasonably suspect
            fraud — and any amount already captured will be refunded to the original payment
            method.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Payments, cancellation and refunds</h2>
          <p>
            Payments are processed by Razorpay in its hosted checkout. By paying you confirm
            that you are authorised to use the chosen payment method. If you cancel an order
            before it is prepared, the amount paid is refunded to the original payment method.
            Refund timelines depend on your bank or card issuer and typically take 5–7 business
            days to appear. If a payment was deducted but your order was not confirmed, contact
            support@burgonomics.com with the order details and we will investigate.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Delivery</h2>
          <p>
            Delivery is carried out by our courier partners. Delivery times are estimates and
            can be affected by distance, traffic, weather and store workload. You are responsible
            for giving an accurate address and being reachable at the contact number provided.
            Risk in the order passes to you on delivery.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Intellectual property</h2>
          <p>
            The Burgonomics name, marks, logos, menu photography, site and app design, text and
            other content belong to Burgonomics Foods Pvt Ltd or its licensors. You may view and
            use them for personal, non-commercial purposes only. You may not copy, modify,
            distribute or use them for commercial purposes without our written permission.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Disclaimers</h2>
          <p>
            The service is provided "as is" and "as available". To the extent permitted by law,
            we make no warranties that the service will be uninterrupted, error-free or that
            menu descriptions, prices or availability will always be complete. Nothing in these
            Terms excludes rights you have under applicable consumer law.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Limitation of liability</h2>
          <p>
            To the extent permitted by law, Burgonomics is not liable for indirect, incidental or
            consequential losses arising from your use of the service, including loss of profit,
            loss of data or business interruption. Our total liability for any claim relating to
            an order is limited to the amount you paid for that order.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Indemnity</h2>
          <p>
            You agree to indemnify Burgonomics Foods Pvt Ltd against claims arising from your
            misuse of the service or your breach of these Terms, to the extent permitted by law.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Governing law</h2>
          <p>
            These Terms are governed by the laws of India, and the courts at Gujarat have
            jurisdiction over disputes arising from them.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Changes to these terms</h2>
          <p>
            We may update these Terms as the service changes. The effective date at the top of
            this page shows when the current version took effect. Continued use of the service
            after an update means you accept the revised Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Contact</h2>
          <p>Questions about these Terms: support@burgonomics.com.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
