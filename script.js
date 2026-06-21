// =============================================
// NAV — scroll effect
// =============================================
const siteNav = document.getElementById('siteNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    siteNav.classList.add('scrolled');
  } else {
    siteNav.classList.remove('scrolled');
  }
}, { passive: true });


// =============================================
// SCROLL REVEAL
// =============================================
const revealEls = document.querySelectorAll(
  '.detail-card, .rule-card, .hotel-card, .invitation-card, .accordion-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// =============================================
// CAROUSEL
// =============================================
const track = document.getElementById('carouselTrack');
const slides = track.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
const totalSlides = slides.length;
let current = 1; // start on second slide so left/right are visible

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.dot');

function goTo(index) {
  // Clamp
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  current = index;

  // Each slide is 33.333% wide; offset so active is centred
  const offset = -(current - 1) * (100 / 3);
  track.style.transform = `translateX(${offset}%)`;

  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.querySelector('.carousel-btn.prev').addEventListener('click', () => goTo(current - 1));
document.querySelector('.carousel-btn.next').addEventListener('click', () => goTo(current + 1));

// Auto-play
let autoPlay = setInterval(() => goTo(current + 1), 4000);
track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.parentElement.addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => goTo(current + 1), 4000);
});

// Touch/swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
});

goTo(current); // init


// =============================================
// DIRECTIONS BUTTON
// =============================================
document.getElementById('directionsBtn').addEventListener('click', function() {
  this.classList.add('clicked');
  this.querySelector('span').textContent = 'Opening…';
  setTimeout(() => {
    this.classList.remove('clicked');
    this.querySelector('span').textContent = 'Open Directions';
  }, 1500);
});


// =============================================
// ACCORDION
// =============================================
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-body').style.maxHeight = null;
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});


// =============================================
// QR MODAL
// =============================================
const qrModal = document.getElementById('qrModal');

document.getElementById('qrBtn').addEventListener('click', () => {
  qrModal.classList.add('open');
});

document.getElementById('modalClose').addEventListener('click', () => {
  qrModal.classList.remove('open');
});

qrModal.addEventListener('click', e => {
  if (e.target === qrModal) qrModal.classList.remove('open');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') qrModal.classList.remove('open');
});


// =============================================
// RSVP TOGGLES
// =============================================
function setupToggle(checkboxId, fieldsId) {
  const checkbox = document.getElementById(checkboxId);
  const fields = document.getElementById(fieldsId);
  checkbox.addEventListener('change', () => {
    fields.classList.toggle('open', checkbox.checked);
  });
}

setupToggle('plusOneToggle', 'plusOneFields');
setupToggle('childrenToggle', 'childrenFields');


// =============================================
// DYNAMIC CHILDREN
// =============================================
let childCount = 0;
const childrenList = document.getElementById('childrenList');

document.getElementById('addChildBtn').addEventListener('click', () => {
  childCount++;
  const entry = document.createElement('div');
  entry.className = 'child-entry';
  entry.innerHTML = `
    <p class="child-entry-title">Child ${childCount}</p>
    <button class="remove-child" title="Remove">×</button>
    <div class="form-group">
      <label>Name *</label>
      <input type="text" class="child-name" placeholder="Child's name">
    </div>
    <div class="form-group">
      <label>Medical Conditions / Dietary Requirements</label>
      <input type="text" class="child-medical" placeholder="e.g. dairy allergy">
    </div>
    <div class="form-group">
      <label>Song Request 🎵</label>
      <input type="text" class="child-song" placeholder="e.g. Happy">
    </div>
  `;

  entry.querySelector('.remove-child').addEventListener('click', () => {
    entry.remove();
    // Re-number remaining children
    childrenList.querySelectorAll('.child-entry-title').forEach((t, i) => {
      t.textContent = `Child ${i + 1}`;
    });
  });

  childrenList.appendChild(entry);
});


// =============================================
// RSVP SUBMIT
// =============================================
document.getElementById('rsvpSubmit').addEventListener('click', () => {
  const errors = [];
  const errorsEl = document.getElementById('formErrors');

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  // Clear previous errors
  document.querySelectorAll('.form-group input').forEach(i => i.classList.remove('error'));
  errorsEl.innerHTML = '';

  if (!firstName) {
    errors.push('Please enter your first name.');
    document.getElementById('firstName').classList.add('error');
  }
  if (!lastName) {
    errors.push('Please enter your surname.');
    document.getElementById('lastName').classList.add('error');
  }

  // Plus one validation
  const plusOneChecked = document.getElementById('plusOneToggle').checked;
  if (plusOneChecked) {
    const pFirst = document.getElementById('plusFirstName').value.trim();
    const pLast = document.getElementById('plusLastName').value.trim();
    if (!pFirst) { errors.push("Please enter your plus one's first name."); document.getElementById('plusFirstName').classList.add('error'); }
    if (!pLast)  { errors.push("Please enter your plus one's surname.");    document.getElementById('plusLastName').classList.add('error'); }
  }

  // Children validation
  document.querySelectorAll('.child-name').forEach((input, i) => {
    if (!input.value.trim()) {
      errors.push(`Please enter a name for Child ${i + 1}.`);
      input.classList.add('error');
    }
  });

  if (errors.length) {
    errorsEl.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
    errorsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // Success
  document.getElementById('rsvpCard').style.display = 'none';
  const success = document.getElementById('rsvpSuccess');
  success.classList.add('show');
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
