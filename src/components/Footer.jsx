import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="footer-logo">BURGONOMICS</h2>
          <p className="footer-tagline">The House of Damn Good Burgers.</p>
        </div>
        <nav className="footer-nav">
          <Link to="/">HOME</Link>
          <Link to="/menu">MENU</Link>
          <Link to="/locations">LOCATIONS</Link>
          <Link to="/franchise">FRANCHISE</Link>
          <Link to="/about">ABOUT US</Link>
          <a href="https://www.instagram.com/burgonomicsindia/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
        </nav>
      </div>
      
      <div className="footer-divider"></div>
      
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {currentYear} Burgonomics. All rights reserved. | <span className="powered-by">Powered by Burgonomics</span>
        </div>
        <div className="footer-legal">
          Burgonomics is owned and operated by PANCHTATVA FOODS. |{' '}
          <span className="footer-gstin">GSTIN: 24ABHFP6677N1ZG</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
