/**
 * CONTROLLER — Real Canoe Rugby NC
 * Arquitectura MVC: Capa de Lógica / Orquestación
 * Orquesta Model y View, maneja eventos e interacciones del usuario.
 */

const Controller = (() => {

  /* =============================================
     INIT
  ============================================= */
  function init() {
    _setFooterYear();
    _renderAllSections();
    _initNavbar();
    _initFilters();
    _initContactForm();
    _initScrollTop();
    _initAOS();
    _initParticles();
    _initNavHighlight();
    _animateCounters();
  }

  /* =============================================
     RENDER ALL SECTIONS
  ============================================= */
  function _renderAllSections() {
    View.renderUpcomingMatches(Model.getUpcomingMatches());
    View.renderPlayers(Model.getPlayers());
    View.renderCalendarMatches(Model.getCalendarMatches());
    View.renderStandings(Model.getStandings());
    View.renderNews(Model.getNews());
  }

  /* =============================================
     NAVBAR: Scroll + Shrink Effect
  ============================================= */
  function _initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Close mobile menu on nav-link click
    document.querySelectorAll('#navbarContent .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navbarContent'));
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  /* =============================================
     FILTROS DE PLANTILLA
  ============================================= */
  function _initFilters() {
    const filterBtns = document.querySelectorAll('.btn-filter');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Actualizar botón activo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Re-renderizar jugadores con filtro
        const filteredPlayers = Model.getPlayersByCategory(filter);
        View.renderPlayers(filteredPlayers);

        // Animación de entrada
        const container = document.getElementById('players-container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* =============================================
     FORMULARIO DE CONTACTO
  ============================================= */
  function _initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const data = {
        name: form.elements['name'].value.trim(),
        email: form.elements['email'].value.trim(),
        subject: form.elements['subject'].value,
        message: form.elements['message'].value.trim()
      };

      View.setFormLoading(true);

      try {
        const result = await Model.submitContactForm(data);
        if (result.success) {
          View.showFormSuccess();
          form.classList.remove('was-validated');
        } else {
          View.showFormError();
        }
      } catch (err) {
        console.error('Error al enviar formulario:', err);
        View.showFormError();
      } finally {
        View.setFormLoading(false);
      }
    });
  }

  /* =============================================
     SCROLL TO TOP
  ============================================= */
  function _initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     ANIMACIÓN AOS (propio, lightweight)
  ============================================= */
  function _initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || 0);
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* =============================================
     PARTÍCULAS HERO
  ============================================= */
  function _initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = ['#fef744', '#213c94', '#ffffff'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 8 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 8;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;

      container.appendChild(particle);
    }
  }

  /* =============================================
     NAV HIGHLIGHT ON SCROLL
  ============================================= */
  function _initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbarContent .nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
  }

  /* =============================================
     CONTADORES ANIMADOS EN HERO
  ============================================= */
  function _animateCounters() {
    const targets = [
      { id: 'stat-jugadores', end: 277, duration: 2000 },
      { id: 'stat-titulos', end: 12, duration: 1500 },
      { id: 'stat-fundacion', end: 1930, duration: 2500, start: 1900 }
    ];

    const heroSection = document.getElementById('inicio');
    if (!heroSection) return;

    let started = false;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        targets.forEach(({ id, end, duration, start = 0 }) => {
          _countUp(id, start, end, duration);
        });
      }
    }, { threshold: 0.3 });

    observer.observe(heroSection);
  }

  function _countUp(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const range = end - start;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(start + eased * range);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /* =============================================
     FOOT YEAR
  ============================================= */
  function _setFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =============================================
     API PÚBLICA
  ============================================= */
  return { init };

})();

/* Inicializar cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});
