(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Only entering elements animate. Nothing is hidden while waiting for the observer.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.benefits, .section-heading, .cards > .card, .advice-panel, .guide-details, #tjekliste, #ruteideer > h2');
    try {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          revealObserver.unobserve(element);
          if (reducedMotion.matches || element.contains(document.activeElement)) return;
          element.classList.add('reveal-enter');
          element.addEventListener('animationend', event => {
            if (event.target === element) element.classList.remove('reveal-enter');
          }, { once: true });
        });
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
      revealTargets.forEach(element => revealObserver.observe(element));
      reducedMotion.addEventListener('change', event => {
        if (!event.matches) return;
        revealObserver.disconnect();
        revealTargets.forEach(element => element.classList.remove('reveal-enter'));
      });
    } catch {
      // An unavailable optional observer never affects navigation or the checklist.
      revealTargets.forEach(element => element.classList.remove('reveal-enter'));
    }
  }

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-nav');

  if (header && toggle && navigation) {
    const desktop = window.matchMedia('(min-width: 72rem)');
    header.classList.add('menu-enhanced');

    function setMenu(open, returnFocus = false) {
      navigation.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Luk menu' : 'Åbn menu');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMenu(false);
    });
    header.addEventListener('focusout', event => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
    });
    desktop.addEventListener('change', () => {
      const focusWasInMenu = navigation.contains(document.activeElement);
      setMenu(false, !desktop.matches && focusWasInMenu);
    });
  }

  // Desktop columns stay open; native mobile disclosures also work without JavaScript.
  const footerColumns = document.querySelectorAll('.footer-section');
  const wideFooter = window.matchMedia('(min-width: 64rem)');
  function syncFooter() {
    footerColumns.forEach(column => {
      column.open = wideFooter.matches;
      const summary = column.querySelector('summary');
      if (wideFooter.matches) summary.setAttribute('tabindex', '-1');
      else summary.removeAttribute('tabindex');
    });
  }
  syncFooter();
  wideFooter.addEventListener('change', syncFooter);
  footerColumns.forEach(column => column.querySelector('summary').addEventListener('click', event => {
    if (wideFooter.matches) event.preventDefault();
  }));

  const checklist = document.querySelector('[data-checklist]');
  if (!checklist) return;

  const inputs = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
  const status = checklist.querySelector('[data-checklist-status]');
  const persistenceNote = document.querySelector('[data-storage-note]');
  const storageKey = 'milemark-checklist-v1';
  let storageAvailable = true;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object') {
      inputs.forEach(input => { input.checked = saved[input.id] === true; });
    }
  } catch {
    storageAvailable = false;
  }

  function updateStatus() {
    const completed = inputs.filter(input => input.checked).length;
    checklist.classList.toggle('is-complete', completed === inputs.length);
    status.textContent = completed === inputs.length
      ? 'Alt er krydset af. God tur – start roligt, og mærk efter undervejs.'
      : `${completed} af ${inputs.length} punkter er klar.`;
    if (persistenceNote) {
      persistenceNote.textContent = storageAvailable
        ? 'Dine valg gemmes kun i denne browser. Du kan altid fjerne krydserne igen.'
        : 'Du kan bruge listen her, men browseren kan ikke gemme dine valg.';
    }
  }

  checklist.querySelector('.checklist-status').hidden = false;
  if (persistenceNote) persistenceNote.hidden = false;
  updateStatus();

  checklist.addEventListener('change', () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(inputs.map(input => [input.id, input.checked]))));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
    updateStatus();
  });
})();
