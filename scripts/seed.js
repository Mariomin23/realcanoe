require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('../api/models/Player');
const Match = require('../api/models/Match');
const News = require('../api/models/News');
const Standings = require('../api/models/Standings');
const User = require('../api/models/User');

const players = [
  { name: "Carlos Martínez", number: 1, position: "Pilar", category: "delantera", nationality: "🇪🇸", age: 26, stats: { partidos: 22, tries: 3, tackles: 87 }, avatar: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Alejandro Ruiz", number: 2, position: "Talonador", category: "delantera", nationality: "🇪🇸", age: 24, stats: { partidos: 19, tries: 5, tackles: 72 }, avatar: "https://ui-avatars.com/api/?name=Alejandro+Ruiz&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Iñigo Fernández", number: 4, position: "Segunda Línea", category: "delantera", nationality: "🇪🇸", age: 28, stats: { partidos: 25, tries: 2, tackles: 110 }, avatar: "https://ui-avatars.com/api/?name=Inigo+Fernandez&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Pablo García", number: 7, position: "Ala / Flanker", category: "delantera", nationality: "🇪🇸", age: 23, stats: { partidos: 20, tries: 8, tackles: 95 }, avatar: "https://ui-avatars.com/api/?name=Pablo+Garcia&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Sergio López", number: 9, position: "Medio Melé", category: "medios", nationality: "🇪🇸", age: 25, stats: { partidos: 24, tries: 6, tackles: 55 }, avatar: "https://ui-avatars.com/api/?name=Sergio+Lopez&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Adrián Torres", number: 10, position: "Apertura", category: "medios", nationality: "🇪🇸", age: 27, stats: { partidos: 23, tries: 9, tackles: 48 }, avatar: "https://ui-avatars.com/api/?name=Adrian+Torres&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Diego Sánchez", number: 11, position: "Ala", category: "trasera", nationality: "🇪🇸", age: 22, stats: { partidos: 18, tries: 12, tackles: 34 }, avatar: "https://ui-avatars.com/api/?name=Diego+Sanchez&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Marcos Díaz", number: 12, position: "Centro", category: "trasera", nationality: "🇪🇸", age: 29, stats: { partidos: 26, tries: 7, tackles: 68 }, avatar: "https://ui-avatars.com/api/?name=Marcos+Diaz&background=213c94&color=fef744&size=200&bold=true" },
  { name: "Luis Rodríguez", number: 15, position: "Zaguero", category: "trasera", nationality: "🇪🇸", age: 30, stats: { partidos: 27, tries: 4, tackles: 82 }, avatar: "https://ui-avatars.com/api/?name=Luis+Rodriguez&background=213c94&color=fef744&size=200&bold=true" }
];

const matches = [
  { date: "11 Ene", homeTeam: "Real Canoe NC", awayTeam: "Alcobendas RC", homeScore: 28, awayScore: 14, status: "win", competition: "Liga Madrileña", sortOrder: 1 },
  { date: "25 Ene", homeTeam: "Cisneros RC", awayTeam: "Real Canoe NC", homeScore: 10, awayScore: 21, status: "win", competition: "Liga Madrileña", sortOrder: 2 },
  { date: "8 Feb",  homeTeam: "Real Canoe NC", awayTeam: "Universitario",  homeScore: 17, awayScore: 17, status: "draw", competition: "Liga Madrileña", sortOrder: 3 },
  { date: "22 Feb", homeTeam: "BUC Rugby",     awayTeam: "Real Canoe NC",  homeScore: 24, awayScore: 15, status: "loss", competition: "Liga Madrileña", sortOrder: 4 },
  { date: "8 Mar",  homeTeam: "Real Canoe NC", awayTeam: "Pozuelo RC",     homeScore: 34, awayScore: 7,  status: "win",  competition: "Liga Madrileña", sortOrder: 5 },
  { date: "29 Mar", homeTeam: "Liceo Francés", awayTeam: "Real Canoe NC",  homeScore: 12, awayScore: 19, status: "win",  competition: "Liga Madrileña", sortOrder: 6 },
  { date: "Sáb 19 Abr 2025", time: "17:00h", homeTeam: "Real Canoe NC", awayTeam: "Arquitectura RC", homeScore: null, awayScore: null, status: "upcoming", competition: "Liga Madrileña", venue: "Campo del Real Canoe, Madrid", sortOrder: 7 },
  { date: "Sáb 3 May 2025",  time: "12:00h", homeTeam: "Pozuelo RC",     awayTeam: "Real Canoe NC",  homeScore: null, awayScore: null, status: "upcoming", competition: "Liga Madrileña", venue: "Campo Municipal Pozuelo", sortOrder: 8 },
  { date: "Dom 18 May 2025", time: "11:30h", homeTeam: "Real Canoe NC", awayTeam: "Liceo Francés",  homeScore: null, awayScore: null, status: "upcoming", competition: "Copa de Madrid",  venue: "Campo del Real Canoe, Madrid", sortOrder: 9 }
];

const news = [
  { title: "Gran victoria ante el Alcobendas RC en la apertura de liga", excerpt: "El equipo mostró una gran actuación colectiva con un resultado de 28-14 que consolida el liderato en la liga madrileña de rugby.", date: "11 Enero 2025", category: "Partido", image: "https://rugby.isquad.es/images/afiliacion_clubs/204/square_70776a67326b306a7738.jpg" },
  { title: "Nuevas incorporaciones para reforzar la plantilla 2025/26", excerpt: "El Real Canoe Rugby NC anuncia tres nuevos fichajes para la próxima temporada, reforzando la delantera y la línea trasera.", date: "5 Marzo 2025", category: "Club", image: "https://images.unsplash.com/photo-1529932404-13d98da5574f?w=600&q=80" },
  { title: "Inscripciones abiertas para el campus de verano de rugby", excerpt: "Dal 5 al 20 de julio, el Real Canoe organiza su campus de verano de rugby para jóvenes de entre 8 y 17 años en Madrid.", date: "20 Marzo 2025", category: "Academia", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80" },
  { title: "El equipo sube al liderato tras 5 jornadas de liga", excerpt: "Con 23 puntos en 6 partidos, el Real Canoe NC lidera la clasificación de la liga madrileña de rugby a falta de dos jornadas.", date: "30 Marzo 2025", category: "Liga", image: "https://images.unsplash.com/photo-1494913148647-353ae514b35e?w=600&q=80" },
  { title: "Cómo iniciarse en el rugby en Madrid: guía para principiantes", excerpt: "Todo lo que necesitas saber para empezar a jugar al rugby cerca de ti en Madrid. El Real Canoe NC te abre sus puertas.", date: "1 Abril 2025", category: "Blog", image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=600&q=80" },
  { title: "El primer equipo prepara la gran final de la Copa de Madrid", excerpt: "Tras la victoria ante Liceo Francés, el equipo se prepara para la final de la Copa de Madrid prevista para el mes de junio.", date: "8 Abril 2025", category: "Copa", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" }
];

const standings = [
  { position: 1, name: "Real Canoe NC", played: 6, points: 23, isHighlighted: true },
  { position: 2, name: "Alcobendas RC", played: 6, points: 21 },
  { position: 3, name: "Cisneros RC",   played: 6, points: 17 },
  { position: 4, name: "BUC Rugby",     played: 6, points: 14 },
  { position: 5, name: "Pozuelo RC",    played: 6, points: 11 },
  { position: 6, name: "Liceo Francés", played: 6, points: 10 },
  { position: 7, name: "Universitario", played: 6, points: 8 },
  { position: 8, name: "Arquitectura RC", played: 6, points: 5 }
];

const defaultUsers = [
  { username: 'admin', password: 'canoe2025admin', role: 'admin' },
  { username: 'superadmin', password: 'canoe2025super', role: 'superadmin' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');

    await Promise.all([
      Player.deleteMany({}),
      Match.deleteMany({}),
      News.deleteMany({}),
      Standings.deleteMany({})
    ]);

    await Promise.all([
      Player.insertMany(players),
      Match.insertMany(matches),
      News.insertMany(news),
      Standings.insertMany(standings)
    ]);

    for (const u of defaultUsers) {
      const exists = await User.findOne({ username: u.username });
      if (!exists) {
        await User.create(u);
        console.log(`Usuario creado: ${u.username} (${u.role})`);
      } else {
        console.log(`Usuario ya existe: ${u.username}`);
      }
    }

    console.log('Seed completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
