import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <header className="legal-header">
          <h1 className="legal-title">PRIVACY POLICY</h1>
          <p className="legal-effective">Effective date: October 7, 2026</p>
        </header>

        <section className="legal-section">
          <h2>Who we are</h2>
          <p>
            This Privacy Policy explains how Burgonomics Foods Pvt Ltd ("Burgonomics", "we", "us")
            collects, uses and shares personal information when you use our website and mobile app.
          </p>
          <ul className="legal-list">
            <li>Publisher: Burgonomics Foods Pvt Ltd</li>
            <li>Location: Ahmedabad, Gujarat, India – 380015</li>
            <li>Support: support@burgonomics.com</li>
            <li>Privacy enquiries: privacy@burgonomics.com</li>
            <li>Grievance officer: nodal@burgonomics.com</li>
            <li>Data protection contact: dpo@burgonomics.com</li>
          </ul>
          <p>
            Our services are served over HTTPS, which encrypts traffic between your device and our
            servers while the pages and app requests are in transit.
          </p>
        </section>

        <section className="legal-section">
          <h2>Information we collect</h2>
          <ul className="legal-list">
            <li>
              <strong>Phone number.</strong> Used for login through OTP verification, delivered by
              Firebase Authentication.
            </li>
            <li>
              <strong>Account profile.</strong> Name, email address, date of birth, gender and
              profile photo, when you provide them.
            </li>
            <li>
              <strong>Delivery information.</strong> Delivery addresses and, only with your
              permission, precise device location (GPS) so a rider can reach you.
            </li>
            <li>
              <strong>Orders.</strong> Order details and order history.
            </li>
            <li>
              <strong>Payment.</strong> Payments are handled by Razorpay in its hosted checkout.
              We store only order and payment identifiers — no card numbers, UPI IDs or other
              payment credentials ever touch our servers.
            </li>
            <li>
              <strong>Push notification tokens.</strong> Used to send you order and offer
              notifications; you can turn these off in your device settings.
            </li>
            <li>
              <strong>Fraud and abuse prevention identifiers.</strong> App and device identifiers
              checked through Google App Check and Play Integrity.
            </li>
            <li>
              <strong>Support messages.</strong> What you write to us, plus up to three attached
              photos.
            </li>
            <li>
              <strong>Cart and favorites.</strong> Items you save while browsing the menu.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How we use information</h2>
          <ul className="legal-list">
            <li>Operating your account and keeping you signed in</li>
            <li>Processing and fulfilling orders</li>
            <li>Arranging delivery to your address</li>
            <li>Collecting payment through our payment provider</li>
            <li>Answering customer support requests</li>
            <li>Security, fraud prevention and abuse prevention</li>
            <li>Improving the app and the service</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Who we share information with</h2>
          <p>
            We do not sell personal data. We share only what each processor needs to do its job:
          </p>
          <ul className="legal-list">
            <li>
              <strong>Google / Firebase</strong> — hosting, authentication, database and push
              notifications.
            </li>
            <li>
              <strong>Razorpay</strong> — payment processing in hosted checkout.
            </li>
            <li>
              <strong>Petpooja</strong> — submitting orders to the restaurant's point-of-sale
              system.
            </li>
            <li>
              <strong>Courier partners</strong> — Porter, Borzo and Shadowfax, for delivery of
              your order to your address.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Retention and deletion</h2>
          <p>
            We keep personal information while your account is active and for as long as we are
            required to keep it by law. To delete your account and your data, email
            support@burgonomics.com from the phone number registered to the account and we will
            process the request.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your rights</h2>
          <ul className="legal-list">
            <li>Access the personal information we hold about you</li>
            <li>Correct information that is inaccurate or out of date</li>
            <li>Request deletion of your account and associated data</li>
            <li>Raise a grievance with our grievance officer at nodal@burgonomics.com</li>
            <li>Contact our data protection contact at dpo@burgonomics.com</li>
          </ul>
          <p>
            We do not sell personal data, and we do not embed third-party advertising SDKs in the
            app.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about this policy: privacy@burgonomics.com. Everything else:
            support@burgonomics.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
