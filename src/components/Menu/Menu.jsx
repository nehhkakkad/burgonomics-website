import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuData, menuCategories, favourites } from './menuData';
import './Menu.css';

const MenuItem = ({ item, hideImage = false }) => (
  <div className="product-item reveal">
    <div className="product-info">
      <h3 className="product-name">{item.name}</h3>
      {item.description && <p className="product-desc">{item.description}</p>}
    </div>
    <div className="product-price">₹{item.price}</div>
    {item.image && !hideImage && (
      <img src={item.image} alt={item.name} className="product-image-sleek" loading="lazy" onError={(e) => e.target.style.display='none'} />
    )}
  </div>
);

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          const id = entry.target.id;
          const category = menuCategories.find(cat => cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() === id);
          if (category) {
            setActiveCategory(category);
            const navElement = document.querySelector('.menu-nav');
            const activeItem = document.querySelector(`.menu-nav-item[data-category="${category}"]`);
            if (navElement && activeItem) {
              const scrollLeft = activeItem.offsetLeft - (navElement.clientWidth / 2) + (activeItem.clientWidth / 2);
              navElement.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
          }
        }
      });
    }, { rootMargin: "-140px 0px -60% 0px", threshold: 0 });

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveCategory('ALL');
        const navElement = document.querySelector('.menu-nav');
        if (navElement) {
          navElement.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      document.querySelectorAll('.menu-section[id], .combos-section[id]').forEach(el => sectionObserver.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleScrollTo = (category) => {
    setActiveCategory(category);
    if (category === 'ALL') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getFilteredMenu = () => {
    if (!searchQuery) return null;
    const lowerQuery = searchQuery.toLowerCase();
    return menuData.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(lowerQuery)) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  };

  const filteredItems = getFilteredMenu();

  const regularMenuData = menuData.filter(item => !favourites.includes(item.name));

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <h1 className="reveal">Menu</h1>
        <p className="hero-subtitle reveal">Damn good burgers. And a whole lot more.</p>
      </section>

      <div className="menu-nav-wrapper">
        <div className="menu-nav">
          {menuCategories.map(cat => (
            <button 
              key={cat} 
              data-category={cat}
              className={`menu-nav-item ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleScrollTo(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="menu-search-section reveal">
        <div className="menu-search-container">
          <svg className="menu-search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="menu-search-input" 
            placeholder="Search the menu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {searchQuery ? (
        <div className="menu-content">
          {filteredItems.length > 0 ? (
            <div className="grid-2-col">
              {filteredItems.map(item => (
                item.category === 'Momos' && item.steamPrice ? (
                   <div key={item.name} className="product-item reveal active">
                      <div className="product-info">
                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-desc">Steam: ₹{item.steamPrice} / Fried: ₹{item.friedPrice}</p>
                      </div>
                      {item.image && <img src={item.image} alt={item.name} className="product-image-sleek" />}
                   </div>
                ) : item.category === 'Momos' && !item.steamPrice ? (
                   <div key={item.name} className="product-item reveal active">
                      <div className="product-info">
                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-desc">Fried: ₹{item.friedPrice}</p>
                      </div>
                      {item.image && <img src={item.image} alt={item.name} className="product-image-sleek" />}
                   </div>
                ) : (
                  <MenuItem key={item.name} item={item} />
                )
              ))}
            </div>
          ) : (
            <div className="empty-state reveal active">
              <h2>Nothing found</h2>
              <p>Try searching for a burger, pizza, shake or something damn good.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="menu-content">
            {/* Favourites Section */}
            <section className="menu-section reveal">
              <h2 className="menu-section-title">Burgonomics Favourites</h2>
              <div className="featured-grid">
                {favourites.map(favName => {
                  const item = menuData.find(m => m.name === favName);
                  if(!item) return null;
                  return (
                    <div key={favName} className="featured-card reveal">
                      <div className="featured-card-img-container">
                        {item.image && <img src={item.image} alt={item.name} className="featured-card-img" onError={(e) => e.target.style.display='none'} />}
                      </div>
                      <div className="featured-card-content">
                        <div className="featured-card-title">{item.name}</div>
                        <div className="featured-card-price">₹{item.price || item.friedPrice}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Burgers */}
            <section id="burgers" className="menu-section reveal">
              <h2 className="menu-section-title">Burgers</h2>
              
              <h3 className="subsection-title reveal">Big Bang Burgers</h3>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.subcategory === 'Big Bang Burgers').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={true} />
                ))}
              </div>

              <h3 className="subsection-title reveal">Classic Burgers</h3>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.subcategory === 'Classic Burgers').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={true} />
                ))}
              </div>
            </section>

            {/* Sizzling */}
            <section id="sizzling" className="menu-section reveal">
              <h2 className="menu-section-title special-section-title">Sizzling Burgers</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Sizzling').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>

            {/* Sydney's Viral */}
            <section id="sydney-s-viral" className="menu-section reveal">
              <h2 className="menu-section-title">Sydney's Viral Burger</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === "Sydney's Viral").map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>

            {/* UFO */}
            <section id="ufo-burgers" className="menu-section reveal">
              <h2 className="menu-section-title special-section-title">UFO Burgers</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'UFO Burgers').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>
          </div>

          {/* Combos */}
          <section id="combos" className="combos-section reveal">
            <h2 className="menu-section-title reveal">Combos</h2>
            <div className="grid-2-col">
              {regularMenuData.filter(i => i.category === 'Combos').map(item => (
                <MenuItem key={item.name} item={item} hideImage={false} />
              ))}
            </div>
            
            <h3 className="subsection-title reveal" style={{marginTop: '60px'}}>Add-Ons</h3>
            <div className="grid-2-col">
              {regularMenuData.filter(i => i.category === 'Add-Ons').map(item => (
                <MenuItem key={item.name} item={item} hideImage={true} />
              ))}
            </div>
          </section>

          <div className="menu-content">
            {/* Sides */}
            <section id="sides" className="menu-section reveal">
              <h2 className="menu-section-title">Sides</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Sides').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={true} />
                ))}
              </div>
            </section>

            {/* Pizza */}
            <section id="pizza" className="menu-section reveal">
              <h2 className="menu-section-title">Pizza</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Pizza').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>

            {/* Pasta */}
            <section id="pasta" className="menu-section reveal">
              <h2 className="menu-section-title">Pasta</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Pasta').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={true} />
                ))}
              </div>
            </section>

            {/* Momos */}
            <section id="momos" className="menu-section reveal">
              <h2 className="menu-section-title">Momos</h2>
              <div className="reveal" style={{overflowX: 'auto'}}>
                <table className="momos-table">
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th>STEAM</th>
                      <th>FRIED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularMenuData.filter(i => i.category === 'Momos').map(item => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.steamPrice ? `₹${item.steamPrice}` : '—'}</td>
                        <td>₹{item.friedPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Coolers */}
            <section id="coolers" className="menu-section reveal">
              <h2 className="menu-section-title">Coolers</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Coolers').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>

            {/* Shakes */}
            <section id="shakes" className="menu-section reveal">
              <h2 className="menu-section-title">Shakes</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Shakes').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>

            {/* Cold Coffee */}
            <section id="cold-coffee" className="menu-section reveal">
              <h2 className="menu-section-title">Cold Coffee</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Cold Coffee').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={true} />
                ))}
              </div>
            </section>

            {/* Desserts */}
            <section id="desserts" className="menu-section reveal">
              <h2 className="menu-section-title">Desserts</h2>
              <div className="grid-2-col">
                {regularMenuData.filter(i => i.category === 'Desserts').map(item => (
                  <MenuItem key={item.name} item={item} hideImage={false} />
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* CTA Area */}
      <div className="cta-section reveal">
        <h2>Found your favourite?</h2>
        <p>NOW FIND YOUR NEAREST BURGONOMICS.</p>
        <div className="cta-buttons">
          <Link to="/locations" className="btn-primary">Find a store</Link>
          <Link to="/franchise" className="btn-secondary">Franchise with us</Link>
        </div>
      </div>

      <div className="menu-legal reveal">
        <p>5% GST extra. Packaging charges extra.</p>
      </div>
    </div>
  );
};

export default Menu;
