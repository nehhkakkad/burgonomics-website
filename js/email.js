// Initialize EmailJS with your Public Key
emailjs.init('j1jccvJyT0vc4WC-s');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('franchise-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Basic UI feedback
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;
      statusEl.style.display = 'none';

      // Replace these with your actual Service ID and Template ID from EmailJS
      const serviceID = 'service_qyj11hg';
      const templateID = 'template_hoo4ikc';

      // Send the form using EmailJS
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          submitBtn.textContent = 'APPLICATION SUBMITTED';
          statusEl.textContent = 'Thank you! We will review your inquiry and get back to you soon.';
          statusEl.style.color = '#0E4825'; // Brand green
          statusEl.style.display = 'block';
          form.reset();
        }, (error) => {
          submitBtn.textContent = 'SUBMIT APPLICATION';
          submitBtn.disabled = false;
          statusEl.textContent = 'Oops! Something went wrong. Please try again later.';
          statusEl.style.color = '#FF6600'; // Brand orange
          statusEl.style.display = 'block';
          console.error('EmailJS Error:', error);
        });
    });
  }
});
