import Lenis from 'lenis';
import gsap from 'gsap';

/* ==========================================================================
   AETHER ENTERPRISE PLATFORM & HERO MOTION
   ========================================================================== */

/* ==========================================================================
   SMOOTH INERTIAL SCROLL ENGINE (LENIS)
   ========================================================================== */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.8
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ==========================================================================
   BACKGROUND VIDEO AUTOPLAY SAFEGUARD
   ========================================================================== */
function initBackgroundVideo() {
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch((err) => {
      console.warn('Video autoplay initiated with fallback:', err);
    });
  }
}

/* ==========================================================================
   SMOOTH SCROLL NAVIGATION & EXPAND TOGGLE
   ========================================================================== */
function initScrollInteractions() {
  const dashboardApp = document.getElementById('dashboard-app');
  const scrollDownBtn = document.getElementById('dash-scroll-down-btn');
  const heroPrimaryBtn = document.getElementById('hero-primary-btn');
  const navCtaBtn = document.getElementById('nav-cta');
  const navPill = document.getElementById('main-nav-pill');

  function goToDashboard(e) {
    if (e) e.preventDefault();
    if (dashboardApp) {
      lenis.scrollTo(dashboardApp, { offset: -80, duration: 1.3 });
    }
  }

  if (scrollDownBtn) scrollDownBtn.addEventListener('click', goToDashboard);
  if (heroPrimaryBtn) heroPrimaryBtn.addEventListener('click', goToDashboard);
  if (navCtaBtn) navCtaBtn.addEventListener('click', goToDashboard);

  lenis.on('scroll', ({ scroll }) => {
    if (navPill) {
      if (scroll > 30) {
        navPill.classList.add('scrolled');
      } else {
        navPill.classList.remove('scrolled');
      }
    }
  });
}

/* ==========================================================================
   MAGNETIC INTERACTION FOR TOOL BADGES
   ========================================================================== */
function initMagneticTools() {
  const badges = document.querySelectorAll('.tool-badge');

  badges.forEach((badge) => {
    badge.addEventListener('mousemove', (e) => {
      const rect = badge.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(badge, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    badge.addEventListener('mouseleave', () => {
      gsap.to(badge, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}

/* ==========================================================================
   FULLSCREEN DASHBOARD LIGHTBOX MODAL
   ========================================================================== */
function initDashboardLightbox() {
  const lightbox = document.getElementById('dash-lightbox-modal');
  const openBtn = document.getElementById('btn-fullscreen-dash');
  const canvasTarget = document.getElementById('dash-canvas-wrapper');
  const closeBtn = document.getElementById('lightbox-close');

  function openLightbox(e) {
    // If click was on a hotspot pin, don't open modal
    if (e && e.target && e.target.closest('.hotspot-pin')) return;
    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  }

  if (openBtn) openBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(); });
  if (canvasTarget) canvasTarget.addEventListener('click', openLightbox);
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   HERO VIDEO MODAL
   ========================================================================== */
const videoModal = document.getElementById('video-modal');
const playBtn = document.getElementById('hero-play-btn');
const modalClose = document.getElementById('modal-close');

function openVideoModal() {
  if (!videoModal) return;
  videoModal.classList.add('active');
  videoModal.setAttribute('aria-hidden', 'false');
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('active');
  videoModal.setAttribute('aria-hidden', 'true');
}

if (playBtn) playBtn.addEventListener('click', openVideoModal);
if (modalClose) modalClose.addEventListener('click', closeVideoModal);
if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function init() {
  initBackgroundVideo();
  initScrollInteractions();
  initMagneticTools();
  initDashboardLightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
