/**
 * VIEW — Real Canoe Rugby NC
 * Arquitectura MVC: Capa de Presentación
 * Responsable de renderizar todos los componentes del DOM.
 */

const View = (() => {

  /* =============================================
     RENDER: PRÓXIMOS PARTIDOS
  ============================================= */
  function renderUpcomingMatches(matches) {
    const container = document.getElementById('matches-container');
    if (!container) return;

    container.innerHTML = matches.map((match, i) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${i * 100}">
        <article class="match-card" aria-label="Partido: ${match.homeTeam} vs ${match.awayTeam}">
          <span class="match-date-badge">
            <i class="bi bi-calendar-event me-1"></i>${match.date} • ${match.time}
          </span>
          <div class="match-teams">
            <div class="match-team">
              <div class="match-team-name">${match.homeTeam}</div>
              <small style="color:var(--color-gray);font-size:0.75rem">LOCAL</small>
            </div>
            <div class="match-vs">VS</div>
            <div class="match-team">
              <div class="match-team-name">${match.awayTeam}</div>
              <small style="color:var(--color-gray);font-size:0.75rem">VISITANTE</small>
            </div>
          </div>
          <div class="match-info">
            <span><i class="bi bi-geo-alt me-1"></i>${match.venue}</span>
            <span><i class="bi bi-trophy me-1"></i>${match.competition}</span>
          </div>
          <div class="mt-3">
            <a
              href="https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(match.homeTeam + ' vs ' + match.awayTeam)}&details=${encodeURIComponent(match.competition)}&location=${encodeURIComponent(match.venue)}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-canoe-outline w-100"
              style="font-size:0.78rem;padding:8px 16px"
            >
              <i class="bi bi-calendar-plus me-2"></i>Añadir al calendario
            </a>
          </div>
        </article>
      </div>
    `).join('');
  }

  /* =============================================
     RENDER: JUGADORES
  ============================================= */
  function renderPlayers(players) {
    const container = document.getElementById('players-container');
    if (!container) return;

    if (players.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p style="color:rgba(255,255,255,0.4); font-family:var(--font-sub); font-size:1.1rem;">
            No hay jugadores en esta categoría
          </p>
        </div>`;
      return;
    }

    container.innerHTML = players.map((player, i) => `
      <div class="col-xl-4 col-lg-4 col-md-6 player-item" data-category="${player.category}" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}">
        <article class="player-card" aria-label="Jugador: ${player.name}">
          <div class="player-card-img">
            <img
              src="${player.avatar}"
              alt="Foto perfil de ${player.name}"
              class="player-avatar"
              loading="lazy"
              width="120"
              height="120"
            />
            <span class="player-number" aria-label="Dorsal ${player.number}">${player.number}</span>
            <span class="player-position-badge">${player.position}</span>
          </div>
          <div class="player-card-body">
            <h3 class="player-name">${player.nationality} ${player.name}</h3>
            <p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-bottom:12px;">
              <i class="bi bi-cake me-1"></i>${player.age} años &nbsp;•&nbsp; <i class="bi bi-tags me-1"></i>${_capitalize(player.category)}
            </p>
            <div class="player-details">
              <div class="player-stat">
                <div class="player-stat-value">${player.stats.partidos}</div>
                <div class="player-stat-label">Partidos</div>
              </div>
              <div class="player-stat">
                <div class="player-stat-value">${player.stats.tries}</div>
                <div class="player-stat-label">Tries</div>
              </div>
              <div class="player-stat">
                <div class="player-stat-value">${player.stats.tackles}</div>
                <div class="player-stat-label">Tackles</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    `).join('');

    // Re-trigger AOS for new elements
    _refreshAOS();
  }

  /* =============================================
     RENDER: CALENDARIO
  ============================================= */
  function renderCalendarMatches(matches) {
    const tbody = document.getElementById('calendar-body');
    if (!tbody) return;

    tbody.innerHTML = matches.map(match => {
      const resultHtml = match.status === 'upcoming'
        ? `<span class="result-badge upcoming"><i class="bi bi-clock me-1"></i>Pendiente</span>`
        : `<span class="result-badge ${match.status}">${match.homeScore} - ${match.awayScore}</span>`;

      const statusIcon = match.status === 'win' ? '✅' : match.status === 'draw' ? '🟡' : match.status === 'loss' ? '❌' : '⏳';

      return `
        <tr>
          <td><span style="font-weight:600; color:var(--color-primary)">${match.date}</span></td>
          <td><span style="font-weight: ${match.home === 'Real Canoe NC' ? '700' : '400'}">${match.home}</span></td>
          <td class="text-center">${resultHtml}</td>
          <td><span style="font-weight: ${match.away === 'Real Canoe NC' ? '700' : '400'}">${match.away}</span></td>
          <td class="text-center" aria-label="Estado: ${match.status}">${statusIcon}</td>
        </tr>`;
    }).join('');
  }

  /* =============================================
     RENDER: CLASIFICACIÓN
  ============================================= */
  function renderStandings(standings) {
    const tbody = document.getElementById('standings-body');
    if (!tbody) return;

    tbody.innerHTML = standings.map(team => `
      <tr class="${team.isHighlighted ? 'highlighted' : ''}">
        <td>
          ${team.isHighlighted
            ? `<span style="color:var(--color-accent);font-weight:700">${team.pos}</span>`
            : team.pos
          }
        </td>
        <td>
          ${team.isHighlighted
            ? `🏆 ${team.name}`
            : team.name
          }
        </td>
        <td>${team.played}</td>
        <td><strong>${team.points}</strong></td>
      </tr>
    `).join('');
  }

  /* =============================================
     RENDER: NOTICIAS
  ============================================= */
  function renderNews(newsItems) {
    const container = document.getElementById('news-container');
    if (!container) return;

    container.innerHTML = newsItems.map((item, i) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
        <article class="news-card" aria-label="Noticia: ${item.title}">
          <div class="news-card-img">
            <img
              src="${item.image}"
              alt="${item.title}"
              loading="lazy"
              width="600"
              height="220"
            />
            <span class="news-category-badge">${item.category}</span>
          </div>
          <div class="news-card-body">
            <div class="news-card-date">
              <i class="bi bi-calendar3"></i>${item.date}
            </div>
            <h3 class="news-card-title">${item.title}</h3>
            <p class="news-card-excerpt">${item.excerpt}</p>
            <a href="#noticias" class="news-card-link">
              Leer más <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    `).join('');

    _refreshAOS();
  }

  /* =============================================
     UTILIDADES PRIVADAS
  ============================================= */
  function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function _refreshAOS() {
    // Pequeño delay para que el DOM se actualice antes de re-observar
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('aos-animate');
        }
      });
    });
  }

  /* =============================================
     FEEDBACK: FORMULARIO
  ============================================= */
  function showFormSuccess() {
    document.getElementById('form-success').classList.remove('d-none');
    document.getElementById('form-error').classList.add('d-none');
    document.getElementById('contactForm').reset();
  }

  function showFormError() {
    document.getElementById('form-error').classList.remove('d-none');
    document.getElementById('form-success').classList.add('d-none');
  }

  function setFormLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    btn.disabled = isLoading;
    text.classList.toggle('d-none', isLoading);
    loader.classList.toggle('d-none', !isLoading);
  }

  /* =============================================
     API PÚBLICA
  ============================================= */
  return {
    renderUpcomingMatches,
    renderPlayers,
    renderCalendarMatches,
    renderStandings,
    renderNews,
    showFormSuccess,
    showFormError,
    setFormLoading
  };

})();
