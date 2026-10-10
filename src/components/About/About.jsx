import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const teamMembers = [
  {
      number: "01",
      name: "Nehh Kakkad",
      role: "Marketing & Tech",
      description: "Leading brand strategy, digital presence, and marketing innovation.",
      image: "/team_images/nehh kakkad.webp"
  },
  {
      number: "02",
      name: "Devarshi Malviya",
      role: "Sales & Expansion",
      description: "15+ years of culinary expertise and the original researcher of the brand model.",
      image: "/team_images/devarshi malvia.webp"
  },
  {
      number: "03",
      name: "Yash Kakkad",
      role: "Legal & Finance",
      description: "Managing real estate, franchise frameworks, and partnership structures.",
      image: "/team_images/yash_kakkad_new2.webp",
      objectPosition: "center top"
  },
  {
      number: "04",
      name: "Shivam Bhimani",
      role: "Supply Chain Operations",
      description: "Ensuring flawless logistics and consistency across all Burgonomics outlets.",
      image: "/team_images/shivam_new.webp"
  },
  {
      number: "05",
      name: "Dipen Bhimani",
      role: "HR & Operations",
      description: "Building a strong, unified team culture and managing staffing operations.",
      image: "/team_images/dipen_new2.webp",
      objectPosition: "center top"
  }
];

const About = () => {
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="about-page-dark">


      <div className="about-content-wrapper">
        <section className="about-header-section reveal">
          <h1 className="about-main-title">THE MINDS BEHIND THE BURGER</h1>
          <p className="about-intro-text">
            At Burgonomics, we blend culinary artistry with precision execution. Meet<br />
            the team that turns simple ingredients into an obsession.
          </p>
        </section>

        <section className="team-grid-section">
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card reveal" key={member.number} style={{animationDelay: `${index * 0.1}s`}}>
                <div className="team-card-image-wrapper">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="team-card-img" 
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: member.objectPosition || 'center center' }}
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} 
                    />
                  ) : null}
                  <div className="team-card-placeholder" style={{display: member.image ? 'none' : 'flex'}}>
                    <div className="placeholder-logo">BURGONOMICS</div>
                    <span className="placeholder-text">PHOTO PLACEHOLDER</span>
                  </div>
                </div>
                
                <div className="team-card-info">
                  <h3 className="team-card-name">{member.name.toUpperCase()}</h3>
                  <p className="team-card-role">{member.role.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA (Kept minimal to match dark theme) */}
        <section className="about-cta-dark reveal">
          <h2>COME JOIN THE BURGONOMICS FAMILY.</h2>
          <div className="cta-buttons-dark">
            <Link to="/franchise" className="btn-dark-primary">FRANCHISE WITH US</Link>
            <Link to="/locations" className="btn-dark-secondary">FIND A STORE</Link>
            <Link to="/menu" className="btn-dark-secondary">EXPLORE THE MENU</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
