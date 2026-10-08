import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './Franchise.css';

const Franchise = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    capital: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replaced with actual EmailJS credentials
    const serviceId = 'service_qyj11hg';
    const templateId = 'template_hoo4ikc';
    const publicKey = 'j1jccvJyT0vc4WC-s';

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then((response) => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setIsSubmitting(false);
        alert("Something went wrong while sending your request. Please try again.");
      });
  };

  if (isSubmitted) {
    return (
      <div className="franchise-page">
        <section className="franchise-hero success-hero reveal">
          <div className="franchise-hero-content">
            <span className="franchise-label">APPLICATION RECEIVED</span>
            <h1 className="franchise-title">YOU'RE ONE STEP CLOSER.</h1>
            <p className="franchise-subtitle">
              Thank you for your interest in bringing Burgonomics to your city. 
              Our franchise team will review your application and get back to you shortly.
            </p>
            <button 
              className="cta-button-large reset-btn" 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  fullName: '', email: '', phone: '',
                  city: '', capital: '', message: ''
                });
              }}
            >
              SUBMIT ANOTHER &rarr;
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="franchise-page">
      {/* Hero Section */}
      <section className="franchise-hero reveal">
        <div className="franchise-hero-content">
          <span className="franchise-label">PARTNER WITH US</span>
          <h1 className="franchise-title">BRING BURGONOMICS<br/>TO YOUR CITY.</h1>
          <p className="franchise-subtitle">Join the fastest growing burger brand. Fill out the application below and let's build something damn good.</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="franchise-form-section reveal">
        <div className="form-container">
          <div className="form-header">
            <h2>PARTNERSHIP INQUIRY</h2>
            <p>Please provide accurate details so our team can best assist you.</p>
          </div>
          
          <form ref={form} onSubmit={handleSubmit} className="franchise-form">
            <div className="form-group full-width">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address (e.g. name@domain.com)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+91 XXXXX XXXXX"
                  pattern="[\+]?[0-9\s\-\(\)]{10,15}"
                  minLength="10"
                  maxLength="15"
                  title="Please enter a valid phone number (10 to 15 digits, optional + country code)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City of Interest</label>
                <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" />
              </div>
              <div className="form-group">
                <label htmlFor="capital">Available Capital</label>
                <select id="capital" name="capital" required value={formData.capital} onChange={handleChange}>
                  <option value="" disabled>Select an option</option>
                  <option value="25_30_lakh">₹25 - ₹30 Lakhs</option>
                  <option value="40_50_lakh">₹40 - ₹50 Lakhs</option>
                  <option value="50_1cr">₹50 Lakhs - ₹1 Crore</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">Message / Background</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>

            <div className="form-submit">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'SENDING...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Franchise;
