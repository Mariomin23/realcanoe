const Model = (() => {

  const BASE = '/api';

  function _getToken() {
    return localStorage.getItem('canoe_token');
  }

  async function _get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  }

  async function _authedFetch(url, options = {}) {
    const token = _getToken();
    const headers = { ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    return res;
  }

  return {
    /* ---- Players ---- */
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

    updatePlayer: async (id, formData) => {
      const res = await _authedFetch(`${BASE}/players/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar jugador');
      return data;
    },

    createPlayer: async (formData) => {
      const res = await _authedFetch(`${BASE}/players`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear jugador');
      return data;
    },

    deletePlayer: async (id) => {
      const res = await _authedFetch(`${BASE}/players/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar jugador');
      return data;
    },

    /* ---- Matches / Calendar / Standings ---- */
    getUpcomingMatches: () => _get(`${BASE}/matches/upcoming`),
    getCalendarMatches: () => _get(`${BASE}/matches/calendar`),
    getStandings:       () => _get(`${BASE}/matches/standings`),

    /* ---- News ---- */
    getNews: () => _get(`${BASE}/news`),

    /* ---- Contact ---- */
    submitContactForm: async (data) => {
      const res = await fetch(`${BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    /* ---- Auth ---- */
    login: async (username, password) => {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      localStorage.setItem('canoe_token', data.token);
      localStorage.setItem('canoe_user', JSON.stringify(data.user));
      return data.user;
    },

    logout: () => {
      localStorage.removeItem('canoe_token');
      localStorage.removeItem('canoe_user');
    },

    getStoredUser: () => {
      try {
        return JSON.parse(localStorage.getItem('canoe_user'));
      } catch {
        return null;
      }
    },

    verifyToken: async () => {
      const token = _getToken();
      if (!token) return null;
      try {
        const res = await _authedFetch(`${BASE}/auth/me`);
        if (!res.ok) {
          localStorage.removeItem('canoe_token');
          localStorage.removeItem('canoe_user');
          return null;
        }
        return res.json();
      } catch {
        return null;
      }
    }
  };

})();
