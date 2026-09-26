/**
 * NihonPass · Hauptskript & Interaktionen
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initFaqAccordion();
  initMobileMenu();
  initCompanionSelector();
  initWidgetPile();
  initWidgetThemeToggle();
  initPricingSwitch();
  initTourInteractivity();
  initShowcaseDeck();
});

/* ==========================================================================
   Sprachverwaltung (i18n)
   ========================================================================== */
function getInitialLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  if (paramLang && ['de', 'en', 'ja'].includes(paramLang)) {
    return paramLang;
  }

  const savedLang = localStorage.getItem('nihonpass_lang');
  if (savedLang && ['de', 'en', 'ja'].includes(savedLang)) {
    return savedLang;
  }

  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('ja')) return 'ja';
  return 'en';
}

function setLanguage(lang) {
  if (!translations[lang]) lang = 'de';
  localStorage.setItem('nihonpass_lang', lang);
  document.documentElement.lang = lang;

  // Buttons aktualisieren
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Texte ersetzen
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // App Store Badges tauschen
  document.querySelectorAll('.app-store-badge-img').forEach(img => {
    let badgeSrc = 'assets/icons/app-store-badge-de.svg';
    if (lang === 'en') badgeSrc = 'assets/icons/app-store-badge.svg';
    if (lang === 'ja') badgeSrc = 'assets/icons/app-store-badge-ja.svg';
    img.src = badgeSrc;
  });

  // Lokalisierte Screenshots tauschen (DE / EN / JA)
  document.querySelectorAll('[data-i18n-src]').forEach(img => {
    const screenKey = img.getAttribute('data-i18n-src');
    img.src = `assets/images/screenshots/${lang}/${screenKey}.jpg`;
  });

  // Lokalisierte Download-Links tauschen
  document.querySelectorAll('[data-i18n-href]').forEach(link => {
    const screenKey = link.getAttribute('data-i18n-href');
    // Presse-Downloads in voller Aufloesung (1320 x 2868)
    link.href = `assets/images/screenshots/${lang}/gross/${screenKey}.jpg`;
  });

  // Widget-Bilder gibt es je Sprache (hell und dunkel)
  widgetLang = lang;
  updateWidgetImages();

  // Textblöcke für rechtliche Seiten & Pressekit umschalten
  document.querySelectorAll('[data-lang-block]').forEach(b => {
    if (b.getAttribute('data-lang-block') === lang) {
      b.style.display = 'block';
    } else {
      b.style.display = 'none';
    }
  });

  // URL-Parameter sanft anpassen ohne Neuladen
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
}

function initLanguage() {
  const currentLang = getInitialLanguage();
  setLanguage(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.currentTarget.getAttribute('data-lang');
      if (selected) setLanguage(selected);
    });
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Mobiles Navigationsmenü
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.mobile-menu-backdrop');
  if (!toggleBtn || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('mobile-open');
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Schließen bei Klick auf einen Nav-Link oder mobilen CTA-Button
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Schließen bei Klick oder Touch auf den Backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
    backdrop.addEventListener('touchstart', (e) => {
      e.preventDefault();
      closeMenu();
    }, { passive: false });
  }

  // Schließen bei Klick außerhalb
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Sanftes Schließen beim Weiterscrollen
  window.addEventListener('scroll', () => {
    if (navMenu.classList.contains('mobile-open')) {
      closeMenu();
    }
  }, { passive: true });

  // Schließen wenn Fenster auf Desktop-Größe vergrößert wird
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   Begleiter-Auswahl (Tanuki, Shiba, Neko)
   ========================================================================== */
function initCompanionSelector() {
  const cards = document.querySelectorAll('.companion-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.style.borderColor = 'var(--c-border-subtle)');
      card.style.borderColor = 'var(--c-hanko-red)';
    });
  });
}

/* ==========================================================================
   Widget-Haufen: Klick / Touch zum Nach-Vorne-Holen
   ========================================================================== */
function initWidgetPile() {
  const pile = document.querySelector('.widgets-pile-stage');
  if (!pile) return;

  let currentHighestZ = 12;
  const items = pile.querySelectorAll('.pile-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      currentHighestZ++;
      item.style.zIndex = currentHighestZ;
    });

    item.addEventListener('touchstart', () => {
      currentHighestZ++;
      item.style.zIndex = currentHighestZ;
    }, { passive: true });
  });
}

/* ==========================================================================
   Homescreen Widgets: Hell / Dunkel und Sprache
   Bilder liegen unter assets/images/widgets/<sprache>/<name>_<light|dark>.webp
   ========================================================================== */
let widgetLang = 'de';
let widgetTheme = 'light';

function updateWidgetImages() {
  document.querySelectorAll('.wh-img[data-widget]').forEach(img => {
    const src = `assets/images/widgets/${widgetLang}/${img.dataset.widget}_${widgetTheme}.webp`;
    if (img.getAttribute('src') === src) return;
    img.style.opacity = '0.6';
    img.onload = () => { img.style.opacity = '1'; };
    img.src = src;
  });
  const stage = document.getElementById('widgetStage');
  if (stage) stage.classList.toggle('is-dark', widgetTheme === 'dark');
}

function initWidgetThemeToggle() {
  const buttons = document.querySelectorAll('.widget-theme-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      widgetTheme = btn.dataset.theme === 'dark' ? 'dark' : 'light';
      buttons.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      updateWidgetImages();
    });
  });
}

/* ==========================================================================
   Preise auf Smartphones: Jahr / Monat
   ========================================================================== */
function initPricingSwitch() {
  const grid = document.getElementById('pricingGrid');
  const buttons = document.querySelectorAll('.pricing-switch-btn');
  if (!grid || buttons.length === 0) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      grid.dataset.plan = btn.dataset.plan;
      buttons.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  });
}

/* ==========================================================================
   Reisebildschirm-Tour: Hotspots, Cards & Mobile Stepper
   ========================================================================== */
function initTourInteractivity() {
  const wrapper = document.querySelector('.tour-wrapper');
  if (!wrapper) return;

  const cards = wrapper.querySelectorAll('.tour-card');
  const hotspots = wrapper.querySelectorAll('.tour-hotspot');
  const tabs = wrapper.querySelectorAll('.tour-tab-btn');
  const dots = wrapper.querySelectorAll('.tour-dot');
  const btnPrev = wrapper.querySelector('.btn-prev');
  const btnNext = wrapper.querySelector('.btn-next');

  let currentStep = 1;
  const totalSteps = 4;

  function setActiveStep(step, isHover = false) {
    const s = parseInt(step, 10);
    if (isNaN(s) || s < 1 || s > totalSteps) return;

    if (!isHover) {
      currentStep = s;
    }

    cards.forEach(c => {
      const active = parseInt(c.dataset.step, 10) === s;
      c.classList.toggle('is-active', active);
    });

    hotspots.forEach(h => {
      const active = parseInt(h.dataset.step, 10) === s;
      h.classList.toggle('is-active', active);
    });

    tabs.forEach(t => {
      const active = parseInt(t.dataset.step, 10) === s;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    dots.forEach(d => {
      const active = parseInt(d.dataset.step, 10) === s;
      d.classList.toggle('is-active', active);
    });
  }

  // Initial step 1
  setActiveStep(1);

  // Desktop Hover / Click
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) {
        setActiveStep(card.dataset.step, true);
      }
    });
    card.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        setActiveStep(currentStep);
      }
    });
    card.addEventListener('click', () => setActiveStep(card.dataset.step));
  });

  hotspots.forEach(pin => {
    pin.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) {
        setActiveStep(pin.dataset.step, true);
      }
    });
    pin.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        setActiveStep(currentStep);
      }
    });
    pin.addEventListener('click', () => setActiveStep(pin.dataset.step));
  });

  // Mobile Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setActiveStep(tab.dataset.step));
  });

  // Mobile Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => setActiveStep(dot.dataset.step));
  });

  // Mobile Prev / Next Buttons
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      const next = currentStep === 1 ? totalSteps : currentStep - 1;
      setActiveStep(next);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const next = currentStep === totalSteps ? 1 : currentStep + 1;
      setActiveStep(next);
    });
  }

  // Touch Swipe on Tour Layout (Mobile)
  let touchStartX = 0;
  let touchStartY = 0;
  const tourLayout = wrapper.querySelector('.tour-layout');
  if (tourLayout) {
    tourLayout.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    tourLayout.addEventListener('touchend', e => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          const next = currentStep === totalSteps ? 1 : currentStep + 1;
          setActiveStep(next);
        } else {
          const prev = currentStep === 1 ? totalSteps : currentStep - 1;
          setActiveStep(prev);
        }
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   App-Einblicke 3D Spotlight Deck
   ========================================================================== */
function initShowcaseDeck() {
  const deck = document.querySelector('.showcase-deck-wrapper');
  if (!deck) return;

  const cards = Array.from(deck.querySelectorAll('.showcase-card'));
  const tabs = Array.from(deck.querySelectorAll('.showcase-tab-btn'));
  const dots = Array.from(deck.querySelectorAll('.showcase-dot'));
  const btnPrev = deck.querySelector('.stage-prev');
  const btnNext = deck.querySelector('.stage-next');
  const stage = deck.querySelector('.showcase-stage');

  if (cards.length === 0) return;

  let currentIndex = 0;
  const total = cards.length;

  function updateDeck(newIndex) {
    currentIndex = ((newIndex % total) + total) % total;

    // Update cards with 3D positions
    cards.forEach((card, i) => {
      card.classList.remove('pos-active', 'pos-prev', 'pos-next', 'pos-hidden');
      const offset = (i - currentIndex + total) % total;
      if (offset === 0) {
        card.classList.add('pos-active');
      } else if (offset === 1) {
        card.classList.add('pos-next');
      } else if (offset === total - 1) {
        card.classList.add('pos-prev');
      } else {
        card.classList.add('pos-hidden');
      }
    });

    // Update tabs
    tabs.forEach((tab, i) => {
      const isActive = i === currentIndex;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  // Click tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!isNaN(idx)) updateDeck(idx);
    });
  });

  // Click dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) updateDeck(idx);
    });
  });

  // Arrows
  if (btnPrev) {
    btnPrev.addEventListener('click', () => updateDeck(currentIndex - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => updateDeck(currentIndex + 1));
  }

  // Clicking on peeked cards brings them to front
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (card.classList.contains('pos-prev')) {
        e.preventDefault();
        updateDeck(currentIndex - 1);
      } else if (card.classList.contains('pos-next')) {
        e.preventDefault();
        updateDeck(currentIndex + 1);
      }
    });
  });

  // Touch Swipe for mobile/tablet
  if (stage) {
    let touchStartX = 0;
    let touchStartY = 0;

    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          updateDeck(currentIndex + 1);
        } else {
          updateDeck(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation when focusing inside the deck
  deck.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateDeck(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateDeck(currentIndex + 1);
    }
  });

  // Initial setup
  updateDeck(0);
}





