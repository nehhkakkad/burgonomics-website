import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const IMAGE_SIZES = "(max-width: 650px) 90vw, (max-width: 1024px) 46vw, 380px";

const teamMembers = [
  {
      number: "01",
      name: "Nehh Kakkad",
      role: "Marketing & Tech",
      description: "Leading brand strategy, digital presence, and marketing innovation.",
      image: "/team_images/nehh-1280.jpg",
      webpSrcSet: "/team_images/nehh-1280.webp 1280w, /team_images/nehh-800.webp 800w, /team_images/nehh-400.webp 400w, /team_images/nehh-320.webp 320w",
      imgSrcSet: "/team_images/nehh-1280.jpg 1280w, /team_images/nehh-800.jpg 800w, /team_images/nehh-400.jpg 400w, /team_images/nehh-320.jpg 320w"
  },
  {
      number: "02",
      name: "Devarshi Malviya",
      role: "Sales & Expansion",
      description: "15+ years of culinary expertise and the original researcher of the brand model.",
      image: "/team_images/devarshi malvia.jpeg",
      webpSrcSet: "/team_images/devarshi-1280.webp 1280w, /team_images/devarshi-800.webp 800w, /team_images/devarshi-400.webp 400w, /team_images/devarshi-320.webp 320w",
      imgSrcSet: "/team_images/devarshi-1280.jpg 1280w, /team_images/devarshi-800.jpg 800w, /team_images/devarshi%20malvia.jpeg 640w, /team_images/devarshi-400.jpg 400w, /team_images/devarshi-320.jpg 320w"
  },
  {
      number: "03",
      name: "Yash Kakkad",
      role: "Legal & Finance",
      description: "Managing real estate, franchise frameworks, and partnership structures.",
      image: "/team_images/yash_kakkad_new.jpg",
      objectPosition: "center 25%",
      webpSrcSet: "/team_images/yash-1152.webp 1152w, /team_images/yash-800.webp 800w, /team_images/yash-400.webp 400w, /team_images/yash-320.webp 320w",
      imgSrcSet: "/team_images/yash-1152.jpg 1152w, /team_images/yash-800.jpg 800w, /team_images/yash_kakkad_new.jpg 576w, /team_images/yash-400.jpg 400w, /team_images/yash-320.jpg 320w"
  },
  {
      number: "04",
      name: "Shivam Bhimani",
      role: "Supply Chain Operations",
      description: "Ensuring flawless logistics and consistency across all Burgonomics outlets.",
      image: "/team_images/shivam_new.jpg",
      webpSrcSet: "/team_images/shivam-1280.webp 1280w, /team_images/shivam-320.webp 320w",
      imgSrcSet: "/team_images/shivam-1280.jpg 1280w, /team_images/shivam_new.jpg 768w, /team_images/shivam-320.jpg 320w"
  },
  {
      number: "05",
      name: "Dipen Bhimani",
      role: "HR & Operations",
      description: "Building a strong, unified team culture and managing staffing operations.",
      image: "/team_images/dipen-1280.jpg",
      webpSrcSet: "/team_images/dipen-1280.webp 1280w, /team_images/dipen-800.webp 800w, /team_images/dipen-400.webp 400w",
      imgSrcSet: "/team_images/dipen-1280.jpg 1280w, /team_images/dipen-800.jpg 800w, /team_images/dipen-400.jpg 400w"
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
                    <picture>
                      <source type="image/webp" srcSet={member.webpSrcSet} sizes={IMAGE_SIZES} />
                      <img 
                        src={member.image} 
                        srcSet={member.imgSrcSet}
                        sizes={IMAGE_SIZES}
                        alt={member.name} 
                        className="team-card-img" 
                        style={{ objectPosition: member.objectPosition || 'center center' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const wrapper = e.target.closest('.team-card-image-wrapper');
                          const placeholder = wrapper && wrapper.querySelector('.team-card-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    </picture>
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
