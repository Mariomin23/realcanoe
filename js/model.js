/**
 * MODEL — Real Canoe Rugby NC
 * Arquitectura MVC: Capa de Datos
 * Obtiene datos desde la API REST del backend.
 */

const Model = (() => {

  const BASE = '/api';

  async function _get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  }

  /* =============================================
     API PÚBLICA
  ============================================= */
  return {
    getPlayers: (category = 'all') => {
      const url = category === 'all'
        ? `${BASE}/players`
        : `${BASE}/players?category=${encodeURIComponent(category)}`;
      return _get(url);
    },

    getPlayersByCategory: (category) => {
      const url = category === 'all'
        ? `${BASE}/players`
        : `${BASE}/players?category=${encodeURIComponent(category)}`;
      return _get(url);
    },

    getUpcomingMatches: () => _get(`${BASE}/matches/upcoming`),

    getCalendarMatches: () => _get(`${BASE}/matches/calendar`),

    getStandings: () => _get(`${BASE}/matches/standings`),

    getNews: () => _get(`${BASE}/news`),

    submitContactForm: async (data) => {
      const res = await fetch(`${BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  };

})();
