const locations = [
  {
    id: 1,
    name: "Burgonomics",
    address: "Shop No. 2, Nilamber Complex, H.L. College Road",
    category: "Fast Food",
    rating: 4.5,
    reviews: 496,
    price: "₹1–200",
    services: ["Dine-in", "Kerbside pickup", "No-contact delivery"],
    opening: "Opens 9 AM",
    lat: 23.0360,
    lng: 72.5448
  },
  {
    id: 2,
    name: "Burgonomics Nehrunagar",
    address: "BRTS Bus Stop, 54/1, H Colony, Surendra Mangaldas Rd, Opp. L Colony",
    category: "Fast Food",
    rating: 4.5,
    reviews: 70,
    price: "₹1–200",
    services: ["Dine-in", "Kerbside pickup", "No-contact delivery"],
    opening: "Opens 11 AM",
    lat: 23.0182,
    lng: 72.5463
  },
  {
    id: 3,
    name: "Burgonomics Mansi Circle",
    address: "GF, Shop No. 07, Saaman Complex, Near Mansi Circle, Vastrapur",
    category: "Fast Food",
    rating: 4.5,
    reviews: 256,
    price: "₹1–200",
    services: ["Dine-in", "Kerbside pickup", "Delivery"],
    opening: "Opens 9 AM",
    lat: 23.0362,
    lng: 72.5186
  },
  {
    id: 4,
    name: "Burgonomics Science City",
    address: "GF-8, City Square, Science City Road, Opp. Science City",
    category: "Fast Food",
    rating: 4.9,
    reviews: 37,
    price: "₹1–800",
    services: ["Dine-in", "Takeaway"],
    opening: "Opens 11 AM",
    lat: 23.0801,
    lng: 72.5113
  },
  {
    id: 5,
    name: "Burgonomics",
    address: "GANESH GLORY, Gota, Ahmedabad, Gujarat 382470",
    category: "Fast Food",
    rating: 4.8,
    reviews: 96,
    price: null,
    services: ["Dine-in", "Kerbside pickup", "No-contact delivery"],
    opening: null,
    lat: 23.0994, 
    lng: 72.5358
  }
];

const upcomingLocations = [
  {
    city: "Coming Soon",
    description: "A new Burgonomics location is on its way."
  },
  {
    city: "Coming Soon",
    description: "Bringing The House of Damn Good Burgers to a new neighborhood."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('location-cards-container');
  const searchInput = document.getElementById('location-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const upcomingContainer = document.getElementById('upcoming-carousel');

  let map;
  let markers = [];
  let currentFilter = 'ALL';
  let activeCardId = null;

  // Initialize Map
  function initMap() {
    // Default center (Ahmedabad approx)
    map = L.map('locations-map').setView([23.0225, 72.5714], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      className: 'map-tiles'
    }).addTo(map);
  }

  // Generate Google Maps Directions URL
  function getDirectionsUrl(address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }

  // Render a single location card
  function createCardHTML(loc) {
    const servicesHTML = loc.services.map(s => `<span class="service-tag">${s}</span>`).join('');
    const directionsUrl = getDirectionsUrl(loc.address);
    
    return `
      <div class="loc-card" data-id="${loc.id}">
        <div class="loc-card-header">
          <h3 class="loc-name">${loc.name}</h3>
          <div class="loc-rating">
            <span class="star">★</span> ${loc.rating} <span class="reviews">(${loc.reviews})</span>
          </div>
        </div>
        <p class="loc-address">${loc.address}</p>
        <div class="loc-details">
          ${loc.price ? `<span class="loc-price">${loc.price}</span>` : ''}
          ${loc.opening ? `<span class="loc-opening">${loc.opening}</span>` : ''}
        </div>
        <div class="loc-services">
          ${servicesHTML}
        </div>
        <div class="loc-actions">
          ${loc.lat && loc.lng ? `<button class="btn-map" onclick="focusMap(${loc.id})">VIEW ON MAP</button>` : `<button class="btn-map disabled" disabled>NO MAP DATA</button>`}
          <a href="${directionsUrl}" target="_blank" class="btn-directions">GET DIRECTIONS</a>
        </div>
      </div>
    `;
  }

  // Render cards to DOM
  function renderCards(filteredLocations) {
    if (filteredLocations.length === 0) {
      cardsContainer.innerHTML = '<p class="no-results">No Burgonomics location found.</p>';
      return;
    }
    cardsContainer.innerHTML = filteredLocations.map(createCardHTML).join('');
    
    // Add event listeners for highlighting
    document.querySelectorAll('.loc-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const id = parseInt(card.dataset.id);
        highlightMarker(id);
      });
      card.addEventListener('mouseleave', () => {
        resetMarkerHighlight();
      });
    });
  }

  // Render Map Markers
  function renderMarkers(filteredLocations) {
    // Clear existing
    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];

    const bounds = L.latLngBounds();
    let hasValidCoords = false;

    filteredLocations.forEach(loc => {
      if (loc.lat && loc.lng) {
        hasValidCoords = true;
        
        // Custom icon for brand consistency
        const icon = L.divIcon({
          className: 'burgonomics-marker',
          html: `<div class="marker-pin"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
        
        const popupContent = `
          <div class="map-popup">
            <h4>${loc.name}</h4>
            <p>${loc.address}</p>
            <div class="popup-rating">★ ${loc.rating}</div>
            <a href="${getDirectionsUrl(loc.address)}" target="_blank" class="popup-dir">GET DIRECTIONS</a>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
          highlightCard(loc.id);
        });

        bounds.extend([loc.lat, loc.lng]);
        markers.push({ id: loc.id, marker });
      }
    });

    if (hasValidCoords) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  // Filter Logic
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = locations.filter(loc => {
      // Text Match
      const matchesText = 
        loc.name.toLowerCase().includes(searchTerm) || 
        loc.address.toLowerCase().includes(searchTerm);
        
      // Service Match
      const matchesService = 
        currentFilter === 'ALL' ? true : 
        loc.services.some(s => s.toUpperCase() === currentFilter.toUpperCase());
        
      return matchesText && matchesService;
    });

    renderCards(filtered);
    renderMarkers(filtered);
  }

  // Expose focus map globally for inline onclick
  window.focusMap = (id) => {
    const loc = locations.find(l => l.id === id);
    if (loc && loc.lat && loc.lng) {
      map.setView([loc.lat, loc.lng], 16);
      const markerObj = markers.find(m => m.id === id);
      if (markerObj) {
        markerObj.marker.openPopup();
      }
      highlightCard(id);
    }
  };

  function highlightCard(id) {
    document.querySelectorAll('.loc-card').forEach(c => c.classList.remove('active'));
    const card = document.querySelector(`.loc-card[data-id="${id}"]`);
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  function highlightMarker(id) {
    const markerObj = markers.find(m => m.id === id);
    if (markerObj) {
      markerObj.marker.getElement().classList.add('hovered');
    }
  }

  function resetMarkerHighlight() {
    markers.forEach(m => {
      const el = m.marker.getElement();
      if(el) el.classList.remove('hovered');
    });
  }

  // Setup Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        applyFilters();
      });
    });
  }

  // Render Upcoming Locations
  function renderUpcoming() {
    if (!upcomingContainer) return;
    const html = upcomingLocations.map(up => `
      <div class="upcoming-card slide-reveal">
        <div class="up-tag">COMING SOON</div>
        <h3>${up.city}</h3>
        <p>${up.description}</p>
        <div class="up-graphic">B</div>
      </div>
    `).join('');
    upcomingContainer.innerHTML = html;
  }

  // Intersection Observer for scroll animations
  function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.slide-reveal').forEach(el => observer.observe(el));
  }

  // Init
  if(document.getElementById('locations-map')) {
    initMap();
    applyFilters(); // Renders initial cards and markers
  }
  renderUpcoming();
  
  // Need slight delay for dynamically added elements to be picked up by observer
  setTimeout(setupScrollAnimations, 100);
});
