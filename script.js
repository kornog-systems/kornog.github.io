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

/* ── Showcase fonctionnalités ── */
const thumbs       = Array.from(document.querySelectorAll('.feature-thumb'));
const showcaseImg  = document.getElementById('showcaseImg');
const showcaseTitle = document.getElementById('showcaseTitle');
const showcaseDesc  = document.getElementById('showcaseDesc');
const showcaseTag   = document.getElementById('showcaseTag');
const btnPrev      = document.getElementById('galleryPrev');
const btnNext      = document.getElementById('galleryNext');

if (thumbs.length && showcaseImg) {
  let current = 0;

  function activateFeature(idx) {
    current = (idx + thumbs.length) % thumbs.length;
    const t = thumbs[current];

    showcaseImg.style.opacity = '0';
    setTimeout(() => {
      showcaseImg.src = t.dataset.src;
      showcaseImg.alt = t.dataset.title;
      showcaseImg.style.opacity = '1';
    }, 150);

    showcaseTitle.textContent = t.dataset.title;
    showcaseDesc.textContent  = t.dataset.desc;
    showcaseTag.textContent   = t.dataset.tag;

    thumbs.forEach((th, i) => th.classList.toggle('active', i === current));
    t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  thumbs.forEach((th, i) => th.addEventListener('click', () => activateFeature(i)));
  btnPrev?.addEventListener('click', () => activateFeature(current - 1));
  btnNext?.addEventListener('click', () => activateFeature(current + 1));
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
