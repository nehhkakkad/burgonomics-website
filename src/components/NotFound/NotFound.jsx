import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  // Stray/legacy URLs must not linger in the search index: mark the soft
  // 404 screen noindex for as long as it is mounted.
  useEffect(() => {
    document.title = 'Page Not Found — Burgonomics';

    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="nf-page">
      <div className="nf-card reveal active">
        <div className="nf-img-col">
          <img
            src="/menu_images/Big Bang/Super Hero.webp"
            alt="Burgonomics Super Hero Burger"
            className="nf-img"
            loading="eager"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="nf-body">
          <div className="nf-eyebrow">ERROR — 404</div>
          <h1 className="nf-title">This page isn't on the&nbsp;menu.</h1>
          <p className="nf-copy">
            The page you're after either moved, got eaten, or never existed.
            The damn good burgers, though, are right where they always are.
          </p>
          <div className="nf-actions">
            <Link to="/menu" className="nf-btn nf-btn-solid">See the full menu</Link>
            <Link to="/" className="nf-btn nf-btn-ghost">Back to home</Link>
          </div>
          <div className="nf-hint">
            Tried <span className="nf-hint-path">burgonomics.com/menu</span>? That works.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
