/**
 * MODEL — Real Canoe Rugby NC
 * Arquitectura MVC: Capa de Datos
 * Contiene toda la información del club (jugadores, partidos, noticias, clasificación).
 */

const Model = (() => {

  /* =============================================
     DATOS: JUGADORES
  ============================================= */
  const players = [
    {
      id: 1,
      name: "Carlos Martínez",
      number: 1,
      position: "Pilar",
      category: "delantera",
      nationality: "🇪🇸",
      age: 26,
      stats: { partidos: 22, tries: 3, tackles: 87 },
      avatar: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 2,
      name: "Alejandro Ruiz",
      number: 2,
      position: "Talonador",
      category: "delantera",
      nationality: "🇪🇸",
      age: 24,
      stats: { partidos: 19, tries: 5, tackles: 72 },
      avatar: "https://ui-avatars.com/api/?name=Alejandro+Ruiz&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 3,
      name: "Iñigo Fernández",
      number: 4,
      position: "Segunda Línea",
      category: "delantera",
      nationality: "🇪🇸",
      age: 28,
      stats: { partidos: 25, tries: 2, tackles: 110 },
      avatar: "https://ui-avatars.com/api/?name=Inigo+Fernandez&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 4,
      name: "Pablo García",
      number: 7,
      position: "Ala / Flanker",
      category: "delantera",
      nationality: "🇪🇸",
      age: 23,
      stats: { partidos: 20, tries: 8, tackles: 95 },
      avatar: "https://ui-avatars.com/api/?name=Pablo+Garcia&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 5,
      name: "Sergio López",
      number: 9,
      position: "Medio Melé",
      category: "medios",
      nationality: "🇪🇸",
      age: 25,
      stats: { partidos: 24, tries: 6, tackles: 55 },
      avatar: "https://ui-avatars.com/api/?name=Sergio+Lopez&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 6,
      name: "Adrián Torres",
      number: 10,
      position: "Apertura",
      category: "medios",
      nationality: "🇪🇸",
      age: 27,
      stats: { partidos: 23, tries: 9, tackles: 48 },
      avatar: "https://ui-avatars.com/api/?name=Adrian+Torres&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 7,
      name: "Diego Sánchez",
      number: 11,
      position: "Ala",
      category: "trasera",
      nationality: "🇪🇸",
      age: 22,
      stats: { partidos: 18, tries: 12, tackles: 34 },
      avatar: "https://ui-avatars.com/api/?name=Diego+Sanchez&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 8,
      name: "Marcos Díaz",
      number: 12,
      position: "Centro",
      category: "trasera",
      nationality: "🇪🇸",
      age: 29,
      stats: { partidos: 26, tries: 7, tackles: 68 },
      avatar: "https://ui-avatars.com/api/?name=Marcos+Diaz&background=213c94&color=fef744&size=200&bold=true"
    },
    {
      id: 9,
      name: "Luis Rodríguez",
      number: 15,
      position: "Zaguero",
      category: "trasera",
      nationality: "🇪🇸",
      age: 30,
      stats: { partidos: 27, tries: 4, tackles: 82 },
      avatar: "https://ui-avatars.com/api/?name=Luis+Rodriguez&background=213c94&color=fef744&size=200&bold=true"
    }
  ];

  /* =============================================
     DATOS: PARTIDOS
  ============================================= */
  const upcomingMatches = [
    {
      id: 1,
      date: "Sáb 19 Abr 2025",
      time: "17:00h",
      homeTeam: "Real Canoe NC",
      awayTeam: "Arquitectura RC",
      venue: "Campo del Real Canoe, Madrid",
      competition: "Liga Madrileña"
    },
    {
      id: 2,
      date: "Sáb 3 May 2025",
      time: "12:00h",
      homeTeam: "Pozuelo RC",
      awayTeam: "Real Canoe NC",
      venue: "Campo Municipal Pozuelo",
      competition: "Liga Madrileña"
    },
    {
      id: 3,
      date: "Dom 18 May 2025",
      time: "11:30h",
      homeTeam: "Real Canoe NC",
      awayTeam: "Liceo Francés",
      venue: "Campo del Real Canoe, Madrid",
      competition: "Copa de Madrid"
    }
  ];

  const calendarMatches = [
    { date: "11 Ene", home: "Real Canoe NC", away: "Alcobendas RC", homeScore: 28, awayScore: 14, status: "win" },
    { date: "25 Ene", home: "Cisneros RC", away: "Real Canoe NC", homeScore: 10, awayScore: 21, status: "win" },
    { date: "8 Feb", home: "Real Canoe NC", away: "Universitario", homeScore: 17, awayScore: 17, status: "draw" },
    { date: "22 Feb", home: "BUC Rugby", away: "Real Canoe NC", homeScore: 24, awayScore: 15, status: "loss" },
    { date: "8 Mar", home: "Real Canoe NC", away: "Pozuelo RC", homeScore: 34, awayScore: 7, status: "win" },
    { date: "29 Mar", home: "Liceo Francés", away: "Real Canoe NC", homeScore: 12, awayScore: 19, status: "win" },
    { date: "19 Abr", home: "Real Canoe NC", away: "Arquitectura RC", homeScore: null, awayScore: null, status: "upcoming" },
    { date: "3 May", home: "Pozuelo RC", away: "Real Canoe NC", homeScore: null, awayScore: null, status: "upcoming" }
  ];

  const standings = [
    { pos: 1, name: "Real Canoe NC", played: 6, points: 23, isHighlighted: true },
    { pos: 2, name: "Alcobendas RC", played: 6, points: 21 },
    { pos: 3, name: "Cisneros RC", played: 6, points: 17 },
    { pos: 4, name: "BUC Rugby", played: 6, points: 14 },
    { pos: 5, name: "Pozuelo RC", played: 6, points: 11 },
    { pos: 6, name: "Liceo Francés", played: 6, points: 10 },
    { pos: 7, name: "Universitario", played: 6, points: 8 },
    { pos: 8, name: "Arquitectura RC", played: 6, points: 5 }
  ];

  /* =============================================
     DATOS: NOTICIAS
  ============================================= */
  const news = [
    {
      id: 1,
      title: "Gran victoria ante el Alcobendas RC en la apertura de liga",
      excerpt: "El equipo mostró una gran actuación colectiva con un resultado de 28-14 que consolida el liderato en la liga madrileña de rugby.",
      date: "11 Enero 2025",
      category: "Partido",
      image: "https://www.realcanoe.es/images/2025/05/18/rugby.png"
    },
    {
      id: 2,
      title: "Nuevas incorporaciones para reforzar la plantilla 2025/26",
      excerpt: "El Real Canoe Rugby NC anuncia tres nuevos fichajes para la próxima temporada, reforzando la delantera y la línea trasera.",
      date: "5 Marzo 2025",
      category: "Club",
      image: "https://images.unsplash.com/photo-1529932404-13d98da5574f?w=600&q=80"
    },
    {
      id: 3,
      title: "Inscripciones abiertas para el campus de verano de rugby",
      excerpt: "Dal 5 al 20 de julio, el Real Canoe organiza su campus de verano de rugby para jóvenes de entre 8 y 17 años en Madrid.",
      date: "20 Marzo 2025",
      category: "Academia",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80"
    },
    {
      id: 4,
      title: "El equipo sube al liderato tras 5 jornadas de liga",
      excerpt: "Con 23 puntos en 6 partidos, el Real Canoe NC lidera la clasificación de la liga madrileña de rugby a falta de dos jornadas.",
      date: "30 Marzo 2025",
      category: "Liga",
      image: "https://images.unsplash.com/photo-1494913148647-353ae514b35e?w=600&q=80"
    },
    {
      id: 5,
      title: "Cómo iniciarse en el rugby en Madrid: guía para principiantes",
      excerpt: "Todo lo que necesitas saber para empezar a jugar al rugby cerca de ti en Madrid. El Real Canoe NC te abre sus puertas.",
      date: "1 Abril 2025",
      category: "Blog",
      image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=600&q=80"
    },
    {
      id: 6,
      title: "El primer equipo prepara la gran final de la Copa de Madrid",
      excerpt: "Tras la victoria ante Liceo Francés, el equipo se prepara para la final de la Copa de Madrid prevista para el mes de junio.",
      date: "8 Abril 2025",
      category: "Copa",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
    }
  ];

  /* =============================================
     API PÚBLICA
  ============================================= */
  return {
    getPlayers: () => players,
    getPlayersByCategory: (cat) => cat === 'all' ? players : players.filter(p => p.category === cat),
    getUpcomingMatches: () => upcomingMatches,
    getCalendarMatches: () => calendarMatches,
    getStandings: () => standings,
    getNews: () => news,
    submitContactForm: (data) => {
      // Simula un envío de formulario
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1500);
      });
    }
  };

})();
