// scripts.js
(function() {
  // Theme toggle (light/dark)
  const themeToggle = document.getElementById('themeToggle');
  const sun = themeToggle.querySelector('.sun');
  const moon = themeToggle.querySelector('.moon') || document.createElement('span');
  let dark = true;

  function applyTheme() {
    if (dark) {
      document.documentElement.style.setProperty('--bg', '#0b1020');
      document.documentElement.style.setProperty('--text', '#e6eafc');
      document.body.style.background = '';
    } else {
      document.documentElement.style.setProperty('--bg', '#f7f7f8');
      document.documentElement.style.setProperty('--text', '#111827');
      document.body.style.background = '#f7f7f7';
    }
  }

  themeToggle.addEventListener('click', () => {
    dark = !dark;
    applyTheme();
    sun.style.display = dark ? 'inline' : 'none';
    moon.style.display = dark ? 'none' : 'inline';
  });

  // Booking: populate times
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const times = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30'
  ];

  function populateTimes(selectedDate) {
    // Simple demo: disable past times if date is today
    timeSelect.innerHTML = '<option value="" disabled selected>Select a time</option>';
    const today = new Date();
    let available = times.slice();
    if (selectedDate) {
      const d = new Date(selectedDate);
      if (d.toDateString() === today.toDateString()) {
        // If today, filter times before current hour
        const now = today.getHours() * 60 + today.getMinutes();
        available = available.filter(t => {
          const [h, m] = t.split(':').map(Number);
          return h * 60 + m > now;
        });
      }
    }
    for (const t of available) {
      const o = document.createElement('option');
      o.value = t;
      o.textContent = t;
      timeSelect.appendChild(o);
    }
  }

  dateInput.addEventListener('change', (e) => {
    populateTimes(e.target.value);
    updatePreview();
  });

  ['patientName','doctor','specialty','date','time','notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updatePreview);
  });

  // Preview
  function updatePreview() {
    document.getElementById('pvName').textContent = document.getElementById('patientName').value || '—';
    document.getElementById('pvDoctor').textContent = document.getElementById('doctor').value || '—';
    document.getElementById('pvDate').textContent = document.getElementById('date').value || '—';
    document.getElementById('pvTime').textContent = document.getElementById('time').value || '—';
    document.getElementById('pvNotes').textContent = document.getElementById('notes').value || '—';
  }

  // Booking form submission (mock API)
  const bookingForm = document.getElementById('bookingForm');
  const formMsg = document.getElementById('formMsg');
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Basic validation
    if (!bookingForm.checkValidity()) {
      formMsg.textContent = 'Please complete all required fields.';
      formMsg.style.color = '#f87171';
      return;
    }
    formMsg.textContent = 'Submitting...';
    formMsg.style.color = 'var(--muted)';
    const payload = {
      name: document.getElementById('patientName').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      doctor: document.getElementById('doctor').value,
      specialty: document.getElementById('specialty').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      notes: document.getElementById('notes').value
    };
    try {
      const res = await BookingAPI.createBooking(payload);
      if (res.success) {
        formMsg.style.color = '#34d399';
        formMsg.textContent = 'Booking confirmed! Confirmation #: ' + res.confirmationId;
      } else {
        formMsg.style.color = '#f87171';
        formMsg.textContent = 'Failed to book. Please try again.';
      }
    } catch (err) {
      formMsg.style.color = '#f87171';
      formMsg.textContent = 'Error submitting booking.';
    }
  });

  // Contact form placeholder
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.createElement('p');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactMsg.textContent = 'Thank you. Your message has been received.';
    contactMsg.style.color = '#34d399';
    contactForm.appendChild(contactMsg);
    contactForm.reset();
  });

  // Init
  populateTimes();
  updatePreview();
  applyTheme();
})();
// api.js (mock API)
const BookingAPI = {
  createBooking: async (payload) => {
    // Simulate network latency
    await new Promise(res => setTimeout(res, 600));
    // Very basic validation
    const ok = payload.name && payload.date && payload.time && payload.doctor;
    if (!ok) return { success: false };
    // Generate mock confirmation
    const confirmationId = 'LC-' + Math.floor(Math.random() * 900000 + 100000);
    // In production, post to your backend e.g. fetch('/api/bookings', { method:'POST', body: JSON.stringify(payload), headers: { 'Content-Type':'application/json' }})
    return { success: true, confirmationId };
  }
};

window.BookingAPI = BookingAPI;
