import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { locations } from './locationsData';
import './Locations.css';

const Locations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [activeLocationId, setActiveLocationId] = useState(null);

  const cardRefs = useRef({});

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

  const totalLocations = locations.length;
  const existingLocations = locations.filter(l => l.status === 'open' || l.status === 'new').length;
  const upcomingLocationsCount = locations.filter(l => l.status === 'upcoming').length;

  const states = useMemo(() => {
    const s = new Set(locations.map(l => l.state));
    return Array.from(s).sort();
  }, []);

  const cities = useMemo(() => {
    let filtered = locations;
    if (stateFilter !== 'ALL') {
      filtered = filtered.filter(l => l.state === stateFilter);
    }
    const c = new Set(filtered.map(l => l.city));
    return Array.from(c).sort();
  }, [stateFilter]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'OPEN NOW') matchesStatus = loc.status === 'open';
      if (statusFilter === 'NEWLY OPENED') matchesStatus = loc.status === 'new';
      if (statusFilter === 'COMING SOON') matchesStatus = loc.status === 'upcoming';
      
      const matchesState = stateFilter === 'ALL' || loc.state === stateFilter;
      const matchesCity = cityFilter === 'ALL' || loc.city === cityFilter;
      
      return matchesSearch && matchesStatus && matchesState && matchesCity;
    });
  }, [searchQuery, statusFilter, stateFilter, cityFilter]);

  const handleLocationClick = (loc, prefix) => {
    setActiveLocationId(loc.id);
    const refId = prefix ? `${prefix}-${loc.id}` : loc.id;
    if (cardRefs.current[refId]) {
      cardRefs.current[refId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getDirectionsUrl = (loc) => {
    if (loc.directionsUrl) return loc.directionsUrl;
    const query = encodeURIComponent(`${loc.name}, ${loc.address}, ${loc.city}, ${loc.state}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const newlyOpened = locations.filter(l => l.status === 'new');
  const existingFiltered = filteredLocations.filter(l => l.status === 'open' || l.status === 'new');
  const upcomingFiltered = filteredLocations.filter(l => l.status === 'upcoming');
  const timelineData = useMemo(() => {
    const years = {};
    locations.forEach(loc => {
      const yearMatch = loc.openingDate.match(/\d{4}/);
      if (yearMatch) {
        const year = yearMatch[0];
        if (!years[year]) years[year] = { count: 0, cities: {} };
        years[year].count += 1;
        years[year].cities[loc.city] = (years[year].cities[loc.city] || 0) + 1;
      }
    });
    return Object.keys(years).sort().map(year => {
      const cityEntries = Object.entries(years[year].cities).sort((a, b) => b[1] - a[1]);
      return {
        year,
        count: years[year].count,
        cities: cityEntries
      };
    });
  }, []);


  return (
    <div className="locations-page">
      {/* Hero Section */}
      <section className="loc-hero reveal">
        <div className="loc-hero-content">
          <span className="loc-label">BURGONOMICS LOCATIONS</span>
          <h1 className="loc-title">FIND YOUR<br/>DAMN GOOD BURGER.</h1>
          <p className="loc-subtitle">{totalLocations} locations. Growing fast.</p>
          
          <div className="loc-timeline-vertical">
            {timelineData.map((data, index) => (
              <div key={data.year} className="timeline-v-item">
                <div className="timeline-v-year">
                  <span>{data.year}</span>
                </div>
                <div className="timeline-v-marker"></div>
                <div className="timeline-v-content">
                  <p className="timeline-v-summary">
                    <strong>{data.count}</strong> {data.count === 1 ? 'Location' : 'Locations'} added
                  </p>
                  <div className="timeline-locs">
                    {data.cities.map(([city, count]) => (
                      <span key={city} className="timeline-loc-pill">
                        {city} {count > 1 && <span className="city-count-badge">x{count}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="loc-stats reveal">
        <div className="stat-item">
          <h2>{totalLocations}</h2>
          <p>TOTAL LOCATIONS</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h2>{existingLocations}</h2>
          <p>CURRENT / EXISTING</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item orange-stat">
          <h2>{upcomingLocationsCount}</h2>
          <p>COMING SOON</p>
        </div>
      </section>

      {/* Controls: Search & Filters */}
      <section className="loc-controls reveal">
        <div className="loc-search-container">
          <input 
            type="text" 
            placeholder="Search city, area or outlet..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="loc-search"
          />
        </div>
        
        <div className="loc-filters">
          <div className="status-filters">
            {['ALL', 'OPEN NOW', 'NEWLY OPENED', 'COMING SOON'].map(status => (
              <button 
                key={status}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="geo-filters">
            <select 
              value={stateFilter} 
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCityFilter('ALL');
              }}
              className="loc-select"
            >
              <option value="ALL">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={cityFilter} 
              onChange={(e) => setCityFilter(e.target.value)}
              className="loc-select"
            >
              <option value="ALL">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="loc-main-content">
        
        {filteredLocations.length === 0 ? (
          <div className="loc-empty-state">
            <h2>NO BURGONOMICS HERE... YET.</h2>
            <p>Try another city or explore our upcoming locations.</p>
          </div>
        ) : (
          <>
            {/* Just Landed */}
            {statusFilter === 'ALL' && newlyOpened.length > 0 && searchQuery === '' && (
              <section className="loc-section just-landed reveal">
                <h2 className="section-title">JUST LANDED</h2>
                <p className="section-subtitle">The newest places to get your damn good burger.</p>
                <div className="loc-grid featured-grid">
                  {newlyOpened.map(loc => (
                    <div 
                      key={loc.id} 
                      className="loc-card featured-card"
                      onClick={() => handleLocationClick(loc, 'new')}
                      ref={el => cardRefs.current[`new-${loc.id}`] = el}
                    >
                      <span className="badge new">NEWLY OPENED</span>
                      <h3>{loc.name}</h3>
                      <p className="loc-city-state">{loc.city}, {loc.state}</p>
                      <p className="loc-date"><strong>OPENED</strong> {loc.openingDate}</p>
                      <p className="loc-address">{loc.address}</p>
                      <a href={getDirectionsUrl(loc)} target="_blank" rel="noreferrer" className="loc-cta" onClick={e => e.stopPropagation()}>
                        GET DIRECTIONS &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Existing Locations */}
            {existingFiltered.length > 0 && (
              <section className="loc-section existing-locations reveal">
                <h2 className="section-title">FIND A STORE</h2>
                <p className="section-subtitle">Pick a city. Find your burger.</p>
                <div className="loc-grid">
                  {existingFiltered.map(loc => (
                    <div 
                      key={loc.id} 
                      className={`loc-card ${activeLocationId === loc.id ? 'active' : ''}`}
                      onClick={() => handleLocationClick(loc, 'exist')}
                      ref={el => cardRefs.current[`exist-${loc.id}`] = el}
                    >
                      <h3>{loc.name}</h3>
                      <p className="loc-city-state">{loc.city}, {loc.state}</p>
                      <span className={`badge ${loc.status}`}>
                        {loc.status === 'new' ? 'NEWLY OPENED' : 'OPEN NOW'}
                      </span>
                      <p className="loc-date"><strong>OPENED</strong> {loc.openingDate}</p>
                      <p className="loc-address">{loc.address}</p>
                      <a href={getDirectionsUrl(loc)} target="_blank" rel="noreferrer" className="loc-cta" onClick={e => e.stopPropagation()}>
                        GET DIRECTIONS &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon */}
            {upcomingFiltered.length > 0 && (
              <section className="loc-section coming-soon reveal">
                <h2 className="section-title">WE'RE COMING YOUR WAY.</h2>
                <p className="section-subtitle">More damn good burgers are on the way.</p>
                <div className="loc-grid upcoming-grid">
                  {upcomingFiltered.map(loc => (
                    <div 
                      key={loc.id} 
                      className={`loc-card upcoming-card ${activeLocationId === loc.id ? 'active' : ''}`}
                      onClick={() => handleLocationClick(loc, 'upcoming')}
                      ref={el => cardRefs.current[`upcoming-${loc.id}`] = el}
                    >
                      <span className="badge upcoming">COMING SOON</span>
                      <h3>{loc.name}</h3>
                      <p className="loc-city-state">{loc.city}, {loc.state}</p>
                      <p className="loc-date"><strong>EXPECTED</strong> {loc.openingDate}</p>
                      <p className="loc-address">{loc.address}</p>
                      <a href={getDirectionsUrl(loc)} target="_blank" rel="noreferrer" className="loc-cta" onClick={e => e.stopPropagation()}>
                        VIEW LOCATION &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Franchise CTA */}
      <section className="franchise-cta reveal">
        <div className="franchise-content">
          <h2>DON'T SEE US IN YOUR CITY?</h2>
          <p>BRING BURGONOMICS TO YOUR CITY.</p>
          <Link to="/franchise" className="cta-button-large">FRANCHISE WITH US &rarr;</Link>
        </div>
      </section>
    </div>
  );
};

export default Locations;
