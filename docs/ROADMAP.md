
# Roadmap

# AR SDLC Learning Media

Version: 1.0

Status: Active Development

---

# Project Goal

Membangun media pembelajaran berbasis Web Augmented Reality (WebAR) untuk mempelajari Software Development Life Cycle (SDLC) menggunakan MindAR, React Three Fiber, dan Next.js.

---

# Development Strategy

Pengembangan dilakukan secara bertahap dengan pendekatan **Backend First**.

Prioritas utama adalah membangun fondasi sistem (database, dashboard admin, dan API) sebelum mengembangkan fitur WebAR.

---

# Phase 1 — Project Foundation

Status: 🔄 In Progress

Objective

Menyiapkan fondasi project.

Tasks

- Initialize Next.js Project
- Install Dependencies
- Configure Tailwind CSS
- Configure ESLint
- Configure Prettier
- Configure Drizzle ORM
- Configure Turso Database
- Create Project Folder Structure
- Create Documentation
- Configure Environment Variables

Deliverables

- Project siap dikembangkan
- Dokumentasi lengkap
- Database terkoneksi

---

# Phase 2 — Database

Status: ⏳ Planned

Objective

Membangun struktur database.

Tasks

- Create Database Schema
- Create Migration
- Seed Initial Data
- Test Database Connection

Tables

- SDLC Methods
- Method Steps

Deliverables

- Database siap digunakan

---

# Phase 3 — Admin Panel

Status: ⏳ Planned

Objective

Membangun Content Management System (CMS) untuk mengelola materi pembelajaran.

Features

- Dashboard
- Login Admin
- CRUD SDLC Methods
- CRUD Method Steps
- Upload Audio
- Preview Content

Deliverables

- Seluruh konten dapat dikelola tanpa mengubah kode aplikasi

---

# Phase 4 — REST API

Status: ⏳ Planned

Objective

Menyediakan endpoint untuk aplikasi WebAR.

Endpoints

Methods

```
GET /api/methods
GET /api/methods/:id
```

Steps

```
GET /api/steps
GET /api/steps/:id
POST /api/steps
PUT /api/steps/:id
DELETE /api/steps/:id
```

Audio

```
POST /api/audio
DELETE /api/audio/:id
```

Deliverables

- API siap dikonsumsi frontend

---

# Phase 5 — WebAR

Status: ⏳ Planned

Objective

Mengintegrasikan WebAR.

Tasks

- Camera Access
- MindAR Integration
- Marker Tracking
- Load GLB
- Render Scene
- Raycaster
- Mesh Interaction

Deliverables

- Model tampil di AR
- Mesh dapat diklik

---

# Phase 6 — Learning Content

Status: ⏳ Planned

Objective

Menampilkan materi pembelajaran.

Features

- Detail Modal
- Description
- Step Navigation
- Audio Player
- Browser TTS Fallback

Deliverables

- Pengguna dapat mempelajari setiap tahapan SDLC

---

# Phase 7 — Optimization

Status: ⏳ Planned

Tasks

- Lazy Loading
- Asset Optimization
- Image Optimization
- Audio Optimization
- Database Optimization
- Performance Testing

Deliverables

- Aplikasi lebih cepat dan stabil

---

# Phase 8 — Testing

Status: ⏳ Planned

Testing

- Functional Testing
- API Testing
- Browser Compatibility
- Mobile Testing
- Performance Testing
- User Acceptance Testing (UAT)

Deliverables

- Sistem siap digunakan

---

# Phase 9 — Deployment

Status: ⏳ Planned

Tasks

- Deploy Database
- Deploy Next.js
- Configure Environment Variables
- Configure Domain
- Final Testing

Deployment Target

- Vercel
- Turso

Deliverables

- Production Ready

---

# Future Development

## AI Learning Assistant

Status: 💡 Future

Features

- Floating Chat Button
- AI Question Answering
- Context-aware Responses
- Explain SDLC Concepts

---

## Quiz

Status: 💡 Future

Features

- Quiz per Tahapan
- Multiple Choice
- Score
- Feedback

---

## Learning Progress

Status: 💡 Future

Features

- Progress Tracking
- Completion Percentage
- Learning History

---

## Analytics Dashboard

Status: 💡 Future

Features

- Most Viewed Methods
- Learning Statistics
- Audio Usage
- Quiz Results

---

# Milestones



Milestone 1
✅ Setup Project

Milestone 2
⬜ Database

Milestone 3
⬜ Admin Panel

Milestone 4
⬜ REST API

Milestone 5
⬜ AR Engine

Milestone 6
⬜ Learning Module

Milestone 7
⬜ Deployment

Milestone 8
⬜ AI Assistant

Milestone 9
⬜ Quiz

| Milestone         | Status |
| ----------------- | ------ |
| Project Setup     | 🔄     |
| Database          | ⏳     |
| Admin Panel       | ⏳     |
| REST API          | ⏳     |
| WebAR Integration | ⏳     |
| Learning Module   | ⏳     |
| Testing           | ⏳     |
| Deployment        | ⏳     |
| AI Assistant      | 💡     |
| Quiz              | 💡     |

---

# Current Sprint

Current Focus

✅ Configure Turso Database

⬜ Create Drizzle Schema

⬜ Database Migration

⬜ Seed Initial Data

⬜ Build Admin Dashboard

⬜ CRUD Methods

⬜ CRUD Steps

⬜ Upload Audio

---

# Success Criteria

Project dianggap selesai apabila:

- Database berjalan dengan baik.
- Admin dapat mengelola seluruh konten.
- API dapat diakses frontend.
- WebAR menampilkan model dengan benar.
- Seluruh tahapan dapat diklik.
- Materi dan audio tampil sesuai data.
- Sistem berhasil dideploy ke production.
