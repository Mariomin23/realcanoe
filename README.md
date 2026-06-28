# 🛶 Real Canoe

Website for a canoe / rugby club: news, event calendar and contact, backed by a Node/Express API with authentication.

🔗 **Live demo:** https://realcanoe.vercel.app

<!-- TODO: add a screenshot -->
<!-- ![Real Canoe screenshot](./docs/screenshot.png) -->

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
