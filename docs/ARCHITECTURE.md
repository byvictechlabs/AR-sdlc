# System Architecture

# AR SDLC Learning Media

Version: 1.0
Status: Draft
Author: Bayu Dani Kurniawan

---

# 1. Overview

AR SDLC Learning Media menggunakan arsitektur Client-Server berbasis WebAR.

Aplikasi dibangun menggunakan Next.js sebagai frontend sekaligus backend (Route Handler), MindAR sebagai image tracking engine, React Three Fiber (Three.js) sebagai 3D renderer, dan Turso (SQLite) sebagai database.

Sistem memisahkan aset 3D dengan data pembelajaran.

- Model 3D disimpan secara statis pada aplikasi.
- Konten pembelajaran disimpan di database.
- Interaksi antara model 3D dan database dilakukan menggunakan **meshName**.

Pendekatan ini membuat aplikasi lebih ringan, mudah dipelihara, dan mudah dikembangkan.

---

# 2. High Level Architecture

```
                        +----------------------+
                        |        User          |
                        +----------+-----------+
                                   |
                                   |
                            Browser (Next.js)
                                   |
              +--------------------+--------------------+
              |                                         |
              |                                         |
        React Components                        Admin Dashboard
              |                                         |
              +--------------------+--------------------+
                                   |
                           Next.js Route Handler
                                   |
                    +--------------+--------------+
                    |                             |
             Drizzle ORM                  Static Assets
                    |                             |
                Turso SQLite            GLB • Images • Marker
```

---

# 3. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## WebAR

- MindAR
- Three.js
- React Three Fiber

---

## Backend

- Next.js Route Handler

---

## ORM

- Drizzle ORM

---

## Database

- Turso SQLite

---

## Deployment

- Vercel

---

# 4. Layer Architecture

```
Presentation Layer

↓

Business Layer

↓

Data Layer

↓

Storage Layer
```

---

## Presentation Layer

Berfungsi sebagai antarmuka pengguna.

Komponen:

- Splash Screen
- Menu
- Scan Screen
- Popup Detail
- Audio Player
- Dashboard Admin

---

## Business Layer

Mengatur seluruh logika aplikasi.

Contohnya:

- Scan Marker
- Load Model
- Klik Mesh
- Fetch Materi
- Play Audio

---

## Data Layer

Berfungsi sebagai penghubung antara aplikasi dan database.

Menggunakan:

- Drizzle ORM

---

## Storage Layer

Berisi dua jenis data.

### Static Assets

- Model GLB
- Marker
- Texture

### Dynamic Data

- Metode
- Tahapan
- Materi
- Audio

---

# 5. Client Architecture

```
User

↓

Splash

↓

Method List

↓

Scan Screen

↓

MindAR Tracking

↓

Load GLB

↓

Raycaster

↓

Popup

↓

Audio Player
```

---

# 6. Backend Architecture

```
Request

↓

Route Handler

↓

Validation

↓

Controller

↓

Drizzle ORM

↓

Turso Database

↓

Response JSON
```

---

# 7. AR Architecture

```
Camera

↓

MindAR

↓

Image Tracking

↓

Marker Detected

↓

Load GLB

↓

React Three Fiber

↓

Render Scene

↓

User Click Mesh

↓

Raycaster

↓

Mesh Name

↓

Fetch Learning Content

↓

Popup Detail
```

---

# 8. Static Asset Architecture

Model 3D **tidak disimpan di database**.

Seluruh model disimpan pada folder public.

Contoh:

```
public/

models/

agile.glb

waterfall.glb

rad.glb

markers/

agile.png

waterfall.png

rad.png
```

Alasan:

- Loading lebih cepat
- Tidak perlu upload model melalui dashboard
- Mengurangi ukuran database
- Mempermudah deployment
- Model hanya terdiri dari tiga metode tetap

---

# 9. Mesh Mapping Architecture

Setiap objek pada model memiliki nama unik.

Contoh:

```
Waterfall.glb

Base

WF_REQUIREMENTS

WF_DESIGN

WF_IMPLEMENTATION

WF_TESTING

WF_DEPLOYMENT

WF_MAINTENANCE
```

Nama mesh menjadi penghubung antara objek 3D dan database.

```
Mesh Name

↓

WF_REQUIREMENTS

↓

Database

↓

Title

Description

Audio

↓

Popup
```

Dengan pendekatan ini model 3D tidak menyimpan isi materi.

---

# 10. User Interaction Flow

```
Open Website

↓

Splash

↓

Menu

↓

Select Method

↓

Open Camera

↓

Scan Marker

↓

Marker Detected

↓

Render Model

↓

User Click Step

↓

Read Mesh Name

↓

Find Learning Content

↓

Show Popup

↓

Play Audio
```

---

# 11. Admin Flow

```
Login

↓

Dashboard

↓

Manage Method

↓

Manage Steps

↓

Upload Audio

↓

Save

↓

Database Updated
```

---

# 12. Request Flow

Saat user membuka halaman scan.

```
GET

/api/methods/:id
```

Response

```
Method

+

All Steps
```

Data tersebut disimpan pada React State.

Saat user memilih salah satu tahapan.

```
Mesh Name

↓

Search React State

↓

Popup
```

Tidak perlu melakukan request ulang.

Keuntungan:

- Lebih cepat
- Mengurangi request
- Popup muncul instan

---

# 13. Audio Flow

```
User Click Step

↓

Step Detail

↓

Check Audio
```

Jika tersedia

```
Play MP3
```

Jika tidak tersedia

```
Browser Text To Speech
```

Menggunakan

```
SpeechSynthesis API
```

---

# 14. Component Architecture

```
App

│

├── Splash Screen

├── Method List

├── Scan Screen

│

├── AR Canvas

│     ├── MindAR

│     ├── Camera

│     ├── Lights

│     ├── Model Loader

│     └── Raycaster

│

├── Detail Modal

├── Audio Player

└── Floating Action Button (Future)
```

---

# 15. Folder Architecture

```
SDLC-AR/
│
├── app/
│   ├── admin/
│   │   ├── assets/
│   │   ├── categories/
│   │   ├── login/
│   │   ├── materials/
│   │   ├── methods/
│   │   ├── steps/
│   │   ├── users/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── assets/[id]/
│   │   ├── auth/[...nextauth]/
│   │   ├── categories/[id]/
│   │   ├── dashboard/stats/
│   │   ├── materials/[id]/
│   │   ├── methods/[id]/
│   │   ├── steps/[id]/
│   │   └── users/[id]/
│   │
│   ├── scan/
│   ├── layout.tsx
│   └── page.tsx
│
├── ar/
│   ├── core/
│   ├── hooks/
│   ├── interactions/
│   ├── loaders/
│   └── utils/
│
├── components/
│   ├── ar/
│   ├── audio/
│   ├── layout/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminNavbar.tsx
│   │   └── AdminSidebar.tsx
│   ├── modal/
│   └── ui/ (shadcn components)
│
├── constants/
├── db/
│   ├── migrations/
│   ├── schema/
│   │   ├── auth.ts
│   │   ├── assets.ts
│   │   ├── audios.ts
│   │   ├── categories.ts
│   │   ├── materials.ts
│   │   ├── methods.ts
│   │   ├── quizzes.ts
│   │   ├── relations.ts
│   │   ├── steps.ts
│   │   └── index.ts
│   ├── index.ts
│   ├── migrate.ts
│   └── seed.ts
│
├── docs/
├── hooks/
├── lib/
│   ├── auth.ts
│   └── utils.ts
├── public/
│   ├── audio/
│   ├── images/
│   ├── markers/
│   └── models/
│
├── schemas/
│   └── index.ts
├── services/
├── stores/
├── types/
│   └── next-auth.d.ts
├── utils/
│
├── .env.local
├── .env.example
├── drizzle.config.ts
├── middleware.ts
├── AGENTS.md
├── README.md
├── package.json
└── tsconfig.json
```

---

# 16. Data Separation

## Static Data

Tidak berubah.

- Model GLB
- Marker
- Texture

Disimpan pada aplikasi.

---

## Dynamic Data

Dapat diubah melalui dashboard.

- Nama metode
- Deskripsi
- Tahapan
- Detail materi
- Audio

Disimpan di Turso.

---

# 17. Future Architecture

Arsitektur dirancang agar mudah dikembangkan.

Fitur berikut dapat ditambahkan tanpa mengubah struktur utama.

## AI Assistant

```
Floating Button

↓

Open Chat

↓

LLM API

↓

Response
```

AI memperoleh konteks berdasarkan tahapan yang sedang dipelajari.

---

## Quiz

```
Step

↓

Load Questions

↓

Answer

↓

Score
```

---

## Progress Learning

```
User

↓

Study History

↓

Progress

↓

Achievement
```

---

# 18. Design Principles

Arsitektur mengikuti beberapa prinsip berikut.

### Separation of Concerns

Model 3D dipisahkan dari data pembelajaran.

---

### Low Coupling

Model hanya mengetahui nama mesh.

Database hanya mengetahui meshName.

---

### High Cohesion

Setiap modul memiliki tanggung jawab yang jelas.

---

### Scalability

Fitur AI, Quiz, dan Progress dapat ditambahkan tanpa mengubah struktur utama.

---

### Maintainability

Admin hanya mengelola konten.

Developer hanya mengelola model 3D.

Keduanya tidak saling bergantung.

---

# 19. Architecture Decisions

| Decision                | Reason                                           |
| ----------------------- | ------------------------------------------------ |
| Next.js                 | Fullstack framework                              |
| Turso                   | Ringan dan mudah dideploy                        |
| Drizzle ORM             | Type-safe ORM                                    |
| MindAR                  | Open source image tracking                       |
| React Three Fiber       | Integrasi terbaik dengan React                   |
| Static GLB              | Loading lebih cepat                              |
| meshName Mapping        | Menghubungkan objek 3D dengan database           |
| Browser TTS Fallback    | Audio tetap tersedia meskipun MP3 belum diunggah |
| Single Fetch per Method | Mengurangi request dan meningkatkan performa     |

---

# 20. Summary

Arsitektur aplikasi menggunakan pendekatan **Static 3D + Dynamic Learning Content**.

Model 3D hanya berfungsi sebagai media interaksi, sedangkan seluruh materi pembelajaran, audio, dan informasi tahapan dikelola melalui database. Hubungan antara objek 3D dan data dilakukan menggunakan `meshName`, sehingga sistem menjadi ringan, mudah dipelihara, dan siap dikembangkan dengan fitur AI Assistant, Quiz, serta Progress Learning pada versi berikutnya.
