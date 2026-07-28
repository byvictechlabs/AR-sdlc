
# Roadmap

# AR SDLC Learning Media

Version: 2.0

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

Status: ✅ Complete

Objective

Menyiapkan fondasi project.

Tasks

- Initialize Next.js Project
- Install Dependencies
- Configure Tailwind CSS
- Configure ESLint
- Configure Drizzle ORM
- Configure SQLite Database (Turso-compatible)
- Create Project Folder Structure
- Create Documentation
- Configure Environment Variables
- Setup shadcn/ui

Deliverables

- Project siap dikembangkan
- Dokumentasi lengkap
- Database terkoneksi

---

# Phase 2 — Database

Status: ✅ Complete

Objective

Membangun struktur database.

Tasks

- Create Database Schema
- Create Migration
- Seed Initial Data
- Test Database Connection

Tables

- Users (Admin authentication)
- Sessions
- Accounts
- Categories
- SDLC Methods
- Method Steps
- Learning Materials
- 3D Assets
- Audios
- Quizzes (preparation only)

Deliverables

- Database siap digunakan
- 10 tables dengan relasi yang benar
- Seed data untuk 3 metode SDLC

---

# Phase 3 — Admin Panel

Status: ✅ Complete

Objective

Membangun Content Management System (CMS) untuk mengelola materi pembelajaran.

Features

- Dashboard dengan statistik
- Login Admin (NextAuth v5)
- Sidebar navigation
- CRUD Categories
- CRUD SDLC Methods
- CRUD Method Steps
- CRUD Learning Materials
- CRUD 3D Assets
- User Management
- Zod validation
- Toast notifications
- Responsive design

Pages

- /admin/login
- /admin (dashboard)
- /admin/categories
- /admin/methods
- /admin/steps
- /admin/materials
- /admin/assets
- /admin/users

Deliverables

- Seluruh konten dapat dikelola tanpa mengubah kode aplikasi

---

# Phase 4 — REST API

Status: ✅ Complete

Objective

Menyediakan endpoint untuk aplikasi WebAR.

Endpoints

Methods

```
GET    /api/methods
POST   /api/methods
GET    /api/methods/:id
PUT    /api/methods/:id
DELETE /api/methods/:id
```

Steps

```
GET    /api/steps
POST   /api/steps
GET    /api/steps/:id
PUT    /api/steps/:id
DELETE /api/steps/:id
```

Categories

```
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Materials

```
GET    /api/materials
POST   /api/materials
GET    /api/materials/:id
PUT    /api/materials/:id
DELETE /api/materials/:id
```

Assets

```
GET    /api/assets
POST   /api/assets
GET    /api/assets/:id
PUT    /api/assets/:id
DELETE /api/assets/:id
```

Users

```
GET    /api/users
POST   /api/users
DELETE /api/users/:id
```

Dashboard

```
GET    /api/dashboard/stats
```

Auth

```
POST   /api/auth/callback/credentials
GET    /api/auth/session
GET    /api/auth/signout
```

Deliverables

- API siap dikonsumsi frontend
- Zod validation pada semua endpoint
- Proper error handling

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

- Deploy Database (Turso)
- Deploy Next.js (Vercel)
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
✅ Database

Milestone 3
✅ Admin Panel

Milestone 4
✅ REST API

Milestone 5
⬜ AR Engine

Milestone 6
⬜ Learning Module

Milestone 7
⬜ Testing

Milestone 8
⬜ Deployment

Milestone 9
⬜ AI Assistant

Milestone 10
⬜ Quiz

| Milestone         | Status |
| ----------------- | ------ |
| Project Setup     | ✅     |
| Database          | ✅     |
| Admin Panel       | ✅     |
| REST API          | ✅     |
| WebAR Integration | ⏳     |
| Learning Module   | ⏳     |
| Testing           | ⏳     |
| Deployment        | ⏳     |
| AI Assistant      | 💡     |
| Quiz              | 💡     |

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
