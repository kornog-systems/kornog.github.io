/* ============================================================
   KORNOG — script.js
   Menu mobile · Header scroll · Reveal · Galerie · Formulaire
   ============================================================ */

/* ── Header scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Menu mobile ── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

/* Ferme le menu au clic sur un lien mobile */
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Galerie de captures ── */
const track  = document.getElementById('galleryTrack');
const dots   = document.getElementById('galleryDots');
const prev   = document.getElementById('galleryPrev');
const next   = document.getElementById('galleryNext');

if (track && dots) {
  const items      = Array.from(track.querySelectorAll('.gallery-item'));
  const itemCount  = items.length;
  let   current    = 0;

  /* Créer les points */
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Capture ${i + 1}`);
    dot.addEventListener('click', () => scrollTo(i));
    dots.appendChild(dot);
  });

  function scrollTo(idx) {
    current = Math.max(0, Math.min(idx, itemCount - 1));
    items[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dots.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => scrollTo(current - 1));
  next.addEventListener('click', () => scrollTo(current + 1));

  /* Mise à jour du point actif au scroll natif (swipe) */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = items.indexOf(entry.target);
        if (idx !== -1) {
          current = idx;
          dots.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        }
      }
    });
  }, { root: track, threshold: 0.6 });
  items.forEach(item => io.observe(item));
}

/* ── Formulaire de contact (mailto fallback) ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    const subjectLabels = {
      retour:      'Retour utilisateur / test',
      partenariat: 'Partenariat',
      presse:      'Presse',
      bug:         'Signalement d\'un problème',
      autre:       'Autre'
    };

    const mailSubject = encodeURIComponent(`[Kornog] ${subjectLabels[subject] || subject}`);
    const mailBody    = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`
    );

    window.location.href = `mailto:kornog@mailo.com?subject=${mailSubject}&body=${mailBody}`;

    const success = contactForm.querySelector('.form-success');
    if (success) {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
  });
}
