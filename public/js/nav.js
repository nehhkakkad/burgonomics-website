document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  
  if (toggleBtn && overlay) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      overlay.classList.toggle('active');
      
      // Prevent scrolling when menu is open
      if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }
});
