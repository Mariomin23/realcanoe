const Controller = (() => {

  let _currentUser = null;

  /* =============================================
     INIT
  ============================================= */
  function init() {
    _setFooterYear();
    _initAuth();
    _initNavbar();
    _initFilters();
    _initContactForm();
    _initScrollTop();
    _initAOS();
    _initParticles();
    _initNavHighlight();
    _animateCounters();
    _initLoginModal();
    _initEditPlayerModal();
    _initAddPlayerModal();
  }

  /* =============================================
     AUTH INIT
  ============================================= */
  async function _initAuth() {
    const stored = Model.getStoredUser();
    if (stored) {
      const verified = await Model.verifyToken();
      _currentUser = verified;
    } else {
      _currentUser = null;
    }
    View.updateAuthUI(_currentUser);
    await _renderAllSections();
  }

  /* =============================================
     RENDER ALL SECTIONS
  ============================================= */
  async function _renderAllSections() {
    try {
      const [matches, players, calendar, standings, news] = await Promise.all([
        Model.getUpcomingMatches(),
        Model.getPlayers(),
        Model.getCalendarMatches(),
        Model.getStandings(),
        Model.getNews()
      ]);

      View.renderUpcomingMatches(matches);
      View.renderPlayers(players, _currentUser?.role);
      View.renderCalendarMatches(calendar);
      View.renderStandings(standings);
      View.renderNews(news);
    } catch (err) {
      console.error('Error cargando datos:', err.message);
    }
  }

  /* =============================================
     LOGIN MODAL
  ============================================= */
  function _initLoginModal() {
    const loginBtn = document.getElementById('navLoginBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    const form = document.getElementById('loginForm');

    loginBtn?.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('loginModal'));
      modal.show();
    });

    logoutBtn?.addEventListener('click', () => {
      Model.logout();
      _currentUser = null;
      View.updateAuthUI(null);
      _renderAllSections();
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      View.hideLoginError();
      View.setLoginLoading(true);

      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      try {
        _currentUser = await Model.login(username, password);
        View.updateAuthUI(_currentUser);
        bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
        form.reset();
        _renderAllSections();
      } catch (err) {
        View.showLoginError(err.message);
      } finally {
        View.setLoginLoading(false);
      }
    });

    document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => {
      document.getElementById('loginForm')?.reset();
      View.hideLoginError();
    });
  }

  /* =============================================
     EDIT PLAYER MODAL
  ============================================= */
  function _initEditPlayerModal() {
    const form = document.getElementById('editPlayerForm');
    if (!form) return;

    const photoInput   = document.getElementById('editPlayerPhoto');
    const photoPreview = document.getElementById('editPhotoPreview');

    photoInput?.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file && photoPreview) {
        photoPreview.src = URL.createObjectURL(file);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = form.dataset.playerId;
      if (!id) return;

      const saveBtn = document.getElementById('editPlayerSaveBtn');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando...'; }

      const formData = new FormData();
      formData.append('name',     document.getElementById('editPlayerName').value.trim());
      formData.append('number',   document.getElementById('editPlayerNumber').value);
      formData.append('position', document.getElementById('editPlayerPosition').value.trim());
      if (photoInput?.files[0]) formData.append('photo', photoInput.files[0]);

      try {
        await Model.updatePlayer(id, formData);
        bootstrap.Modal.getInstance(document.getElementById('editPlayerModal'))?.hide();
        const activeFilter = document.querySelector('.btn-filter.active')?.dataset.filter || 'all';
        const players = await Model.getPlayersByCategory(activeFilter);
        View.renderPlayers(players, _currentUser?.role);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Guardar cambios'; }
      }
    });
  }

  /* =============================================
     ADD PLAYER MODAL
  ============================================= */
  function _initAddPlayerModal() {
    const form = document.getElementById('addPlayerForm');
    if (!form) return;

    const photoInput   = document.getElementById('addPlayerPhoto');
    const photoPreview = document.getElementById('addPhotoPreview');

    photoInput?.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file && photoPreview) {
        photoPreview.src = URL.createObjectURL(file);
        photoPreview.classList.remove('d-none');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('addPlayerSaveBtn');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando...'; }

      const formData = new FormData();
      formData.append('name',        document.getElementById('addPlayerName').value.trim());
      formData.append('number',      document.getElementById('addPlayerNumber').value);
      formData.append('position',    document.getElementById('addPlayerPosition').value.trim());
      formData.append('category',    document.getElementById('addPlayerCategory').value);
      formData.append('nationality', document.getElementById('addPlayerNationality').value.trim() || '🇪🇸');
      formData.append('age',         document.getElementById('addPlayerAge').value);
      if (photoInput?.files[0]) formData.append('photo', photoInput.files[0]);

      try {
        await Model.createPlayer(formData);
        bootstrap.Modal.getInstance(document.getElementById('addPlayerModal'))?.hide();
        form.reset();
        if (photoPreview) photoPreview.classList.add('d-none');
        const players = await Model.getPlayers();
        View.renderPlayers(players, _currentUser?.role);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Añadir jugador'; }
      }
    });
  }

  /* =============================================
     PUBLIC: OPEN EDIT PLAYER
  ============================================= */
  function openEditPlayer(id, name, position, number, avatar) {
    const form = document.getElementById('editPlayerForm');
    if (!form) return;

    form.dataset.playerId = id;
    document.getElementById('editPlayerName').value     = name;
    document.getElementById('editPlayerNumber').value   = number;
    document.getElementById('editPlayerPosition').value = position;

    const preview = document.getElementById('editPhotoPreview');
    if (preview) preview.src = avatar;

    const photoInput = document.getElementById('editPlayerPhoto');
    if (photoInput) photoInput.value = '';

    new bootstrap.Modal(document.getElementById('editPlayerModal')).show();
  }

  /* =============================================
     PUBLIC: CONFIRM DELETE PLAYER
  ============================================= */
  async function confirmDeletePlayer(id, name) {
    if (!confirm(`¿Eliminar al jugador "${name}"? Esta acción no se puede deshacer.`)) return;

    try {
      await Model.deletePlayer(id);
      const players = await Model.getPlayers();
      View.renderPlayers(players, _currentUser?.role);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  /* =============================================
     NAVBAR: Scroll + Shrink
  ============================================= */
  function _initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
      btn.addEventListener('click', async () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        try {
          const filteredPlayers = await Model.getPlayersByCategory(filter);
          const container = document.getElementById('players-container');
          container.style.opacity = '0';
          container.style.transform = 'translateY(20px)';

          View.renderPlayers(filteredPlayers, _currentUser?.role);

          requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
          });
        } catch (err) {
          console.error('Error filtrando jugadores:', err.message);
        }
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
        name:    form.elements['name'].value.trim(),
        email:   form.elements['email'].value.trim(),
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
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     AOS (Intersection Observer)
  ============================================= */
  function _initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || 0);
          setTimeout(() => entry.target.classList.add('aos-animate'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* =============================================
     PARTÍCULAS HERO
  ============================================= */
  function _initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = ['#fef744', '#213c94', '#ffffff'];
    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size     = Math.random() * 8 + 3;
      const color    = colors[Math.floor(Math.random() * colors.length)];
      const left     = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay    = Math.random() * 8;
      particle.style.cssText = `width:${size}px;height:${size}px;background:${color};left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s;opacity:${Math.random() * 0.5 + 0.1};`;
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
     CONTADORES ANIMADOS
  ============================================= */
  function _animateCounters() {
    const targets = [
      { id: 'stat-jugadores', end: 277, duration: 2000 },
      { id: 'stat-titulos',   end: 12,  duration: 1500 },
      { id: 'stat-fundacion', end: 1930, duration: 2500, start: 1900 }
    ];

    const heroSection = document.getElementById('inicio');
    if (!heroSection) return;

    let started = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        targets.forEach(({ id, end, duration, start = 0 }) => _countUp(id, start, end, duration));
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
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + eased * range);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* =============================================
     FOOTER YEAR
  ============================================= */
  function _setFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =============================================
     API PÚBLICA
  ============================================= */
  return { init, openEditPlayer, confirmDeletePlayer };

})();

document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});
