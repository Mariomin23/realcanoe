# 🛶 Real Canoe

Website for a canoe / rugby club: news, event calendar and contact, backed by a Node/Express API with authentication.

**🌐 Live demo: [realcanoe.vercel.app](https://realcanoe.vercel.app)**

<p align="center">
  <img src="docs/screenshot.png" width="720" alt="Real Canoe Rugby — home page">
</p>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## Features
- Multi-page site: home, news (`noticias`), calendar (`calendario`), contact (`contacto`)
- Express backend with JWT authentication and password hashing (bcrypt)
- MongoDB persistence (Mongoose)
- Image / file uploads (multer)
- Database seeding script

## Tech stack
**Frontend:** HTML5 · CSS3 · JavaScript
**Backend:** Node.js · Express 5 · MongoDB (Mongoose) · JWT · bcrypt · multer

## Run locally
```bash
git clone https://github.com/Mariomin23/realcanoe.git
cd realcanoe
npm install
cp .env.example .env   # set MONGO_URI, JWT_SECRET
npm run seed           # optional: seed the database
npm run dev            # or: node index.js
```

## What I learned
Building a multi-page site on top of a REST backend, content modelling in MongoDB and deploying a fullstack app to Vercel.

## License

[MIT](LICENSE)
