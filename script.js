
'use strict';

// Menu mobile
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Fermer le menu' : 'Ouvrir le menu'
    );

    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      menuToggle.textContent = '☰';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      menuToggle.textContent = '☰';
    }
  });
}

// Recherche et filtres des produits
const searchInput = document.querySelector('#searchInput');
const filterButtons = Array.from(document.querySelectorAll('.filter'));
const productCards = Array.from(document.querySelectorAll('.product-card'));
const noResults = document.querySelector('#noResults');

let activeFilter = 'all';

function filterProducts() {
  const query = (searchInput?.value || '')
    .trim()
    .toLocaleLowerCase('fr');

  let visibleCount = 0;

  productCards.forEach(card => {
    const productName = (card.dataset.name || '')
      .toLocaleLowerCase('fr');

    const productType = card.dataset.type || '';
    const matchesText = productName.includes(query);
    const matchesType =
      activeFilter === 'all' || productType === activeFilter;

    const visible = matchesText && matchesType;

    card.hidden = !visible;

    if (visible) {
      visibleCount++;
    }
  });

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

searchInput?.addEventListener('input', filterProducts);

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';

    filterButtons.forEach(item => {
      const isActive = item === button;

      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    filterProducts();
  });
});

// Apparition progressive des sections
const revealItems = document.querySelectorAll('.reveal');

if (
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Inclinaison du téléphone sur ordinateur
const heroVisual = document.querySelector('#heroVisual');
const phoneStage = document.querySelector('.phone-stage');

const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (heroVisual && phoneStage && supportsFinePointer && !reducedMotion) {
  heroVisual.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    phoneStage.style.animationPlayState = 'paused';
    phoneStage.style.transform =
      `translateY(-4px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg)`;
  });

  heroVisual.addEventListener('pointerleave', () => {
    phoneStage.style.transform = '';
    phoneStage.style.animationPlayState = 'running';
  });
}

// Année automatique dans le footer
const yearElement = document.querySelector('#year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Afficher un visuel de remplacement si une image manque
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('image-error');
    img.alt = img.alt || 'Image non disponible';
  });
});
