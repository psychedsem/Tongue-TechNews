import * as Sentry from '@sentry/browser';

import '../css/style.css';
import { initEventsFeed } from './events.js';
import { initNewsFeed } from './news.js';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}

function initNavigation() {
  const nav = document.querySelector('#site-nav');
  const links = [...document.querySelectorAll('.site-nav__link')];
  const sections = [...document.querySelectorAll('#home, #about, #events')];

  function setActiveLink(sectionId) {
    links.forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateNavOnScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 120);
  }

  updateNavOnScroll();
  window.addEventListener('scroll', updateNavOnScroll, { passive: true });

  links.forEach((link) => {
    link.addEventListener('click', () => setActiveLink(link.dataset.section));
  });

  const observer = new IntersectionObserver((entries) => {
    const currentSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (currentSection) {
      setActiveLink(currentSection.target.id);
    }
  }, {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0.01, 0.2, 0.5],
  });

  sections.forEach((section) => observer.observe(section));
}

let toastTimer;
let hideToastTimer;

function showDemoToast(message) {
  const toast = document.querySelector('#demo-toast');

  window.clearTimeout(toastTimer);
  window.clearTimeout(hideToastTimer);

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add('is-visible');

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');

    hideToastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 180);
  }, 3200);
}

initNavigation();
initNewsFeed();
initEventsFeed((event) => {
  showDemoToast(`Demo UI - la registrazione a “${event.title}” non è collegata a un backend.`);
});
