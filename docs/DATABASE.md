
# Database Design

# AR SDLC Learning Media

Version: 2.0

Status: Implemented

Author: Bayu Dani Kurniawan

Last Updated: July 2026

---

# 1. Overview

Database digunakan untuk menyimpan seluruh konten pembelajaran yang bersifat dinamis.

Model 3D **tidak disimpan di database**.

Model GLB disimpan sebagai aset statis pada aplikasi.

Database hanya menyimpan informasi yang berkaitan dengan:

- Admin users & authentication
- Kategori pembelajaran
- Metode SDLC
- Tahapan
- Materi pembelajaran
- Audio (Cloudinary)
- 3D Asset metadata
- Quiz (preparation only)

Pendekatan ini membuat ukuran database tetap kecil serta mempercepat proses rendering model AR.

---

# 2. Database Technology

Database Development

- SQLite (local file)

Database Production

- Turso SQLite

ORM

- Drizzle ORM

Driver

- @libsql/client

---

# 3. Design Principles

Database dirancang berdasarkan beberapa prinsip berikut.

## Static Assets

Tidak masuk database.

- GLB
- Marker
- Texture

Lokasi:

```
public/models/
public/markers/
```

---

## Dynamic Content

Disimpan di database.

- Admin users
- Kategori
- Nama metode
- Deskripsi
- Tahapan
- Detail materi
- Audio URL
- 3D asset metadata

---

## Mesh Mapping

Setiap mesh pada model memiliki nama unik.

Contoh

```
WF_REQUIREMENTS
WF_DESIGN
WF_IMPLEMENTATION
```

Nama tersebut menjadi penghubung antara objek 3D dan data pembelajaran.

---

## Portable Design

Schema dirancang agar portabel antara SQLite dan Turso:

- Menggunakan text PK (UUID) untuk portabilitas
- Menggunakan integer timestamps untuk kompatibilitas
- Tidak menggunakan fitur SQLite-specific yang tidak ada di Turso
- File local.db untuk development, Turso untuk production

---

# 4. Entity Relationship Diagram

```
users ||--o{ sessions : has
users ||--o{ accounts : has

categories ||--o{ sdlc_methods : contains

sdlc_methods ||--o{ method_steps : has
sdlc_methods ||--o{ assets_3d : has

method_steps ||--o{ learning_materials : has
method_steps ||--o{ audios : has
method_steps ||--o{ quizzes : has
```

---

# 5. Database Schema

## users

Menyimpan informasi admin accounts.

| Field        | Type     | Description              |
| ------------ | -------- | ------------------------ |
| id           | text PK  | UUID                     |
| name         | text     | Nama lengkap             |
| email        | text     | Email (unique)           |
| password_hash| text     | Bcrypt hashed password   |
| role         | text     | admin / super_admin      |
| created_at   | integer  | Timestamp (ms)           |
| updated_at   | integer  | Timestamp (ms)           |

---

## sessions

Menyimpan session data untuk authentication.

| Field         | Type    | Description            |
| ------------- | ------- | ---------------------- |
| id            | text PK | UUID                   |
| user_id       | text FK | References users.id    |
| expires_at    | integer | Timestamp (ms)         |
| session_token | text    | Unique session token   |

---

## accounts

Menyimpan OAuth account data (prepared for future).

| Field               | Type    | Description            |
| ------------------- | ------- | ---------------------- |
| id                  | text PK | UUID                   |
| user_id             | text FK | References users.id    |
| type                | text    | Account type           |
| provider            | text    | OAuth provider         |
| provider_account_id | text    | Provider account ID    |

---

## categories

Menyimpan kategori pembelajaran.

| Field      | Type    | Description             |
| ---------- | ------- | ----------------------- |
| id         | text PK | UUID                    |
| name       | text    | Nama kategori (unique)  |
| description| text    | Deskripsi kategori      |
| slug       | text    | URL slug (unique)       |
| sort_order | integer | Urutan tampilan         |
| created_at | integer | Timestamp (ms)          |
| updated_at | integer | Timestamp (ms)          |

---

## sdlc_methods

Menyimpan informasi metode SDLC.

| Field       | Type    | Description                      |
| ----------- | ------- | -------------------------------- |
| id          | text PK | UUID                             |
| name        | text    | Nama metode                      |
| slug        | text    | URL slug (unique)                |
| description | text    | Deskripsi singkat                |
| model_path  | text    | Lokasi file GLB                  |
| marker_path | text    | Lokasi marker                    |
| category_id | text FK | References categories.id (nullable) |
| status      | text    | draft / published / archived     |
| sort_order  | integer | Urutan tampilan                  |
| created_at  | integer | Timestamp (ms)                   |
| updated_at  | integer | Timestamp (ms)                   |

---

## method_steps

Menyimpan seluruh tahapan.

| Field       | Type    | Description              |
| ----------- | ------- | ------------------------ |
| id          | text PK | UUID                     |
| method_id   | text FK | References sdlc_methods.id |
| mesh_name   | text    | Unique, must match 3D mesh |
| title       | text    | Judul tahapan            |
| description | text    | Penjelasan tahapan       |
| step_order  | integer | Urutan tahapan           |
| created_at  | integer | Timestamp (ms)           |
| updated_at  | integer | Timestamp (ms)           |

---

## learning_materials

Menyimpan konten pembelajaran detail.

| Field        | Type    | Description                |
| ------------ | ------- | -------------------------- |
| id           | text PK | UUID                       |
| step_id      | text FK | References method_steps.id |
| title        | text    | Judul materi               |
| content      | text    | Konten pembelajaran        |
| thumbnail_url| text    | URL thumbnail (nullable)   |
| status       | text    | draft / published          |
| created_at   | integer | Timestamp (ms)             |
| updated_at   | integer | Timestamp (ms)             |

---

## assets_3d

Menyimpan metadata 3D model.

| Field       | Type    | Description                      |
| ----------- | ------- | -------------------------------- |
| id          | text PK | UUID                             |
| method_id   | text FK | References sdlc_methods.id       |
| name        | text    | Nama aset                        |
| description | text    | Deskripsi aset                   |
| file_path   | text    | Lokasi file GLB/GLTF             |
| file_format | text    | glb / gltf                       |
| file_size   | integer | Ukuran file dalam bytes (nullable)|
| version     | text    | Versi aset                       |
| created_at  | integer | Timestamp (ms)                   |
| updated_at  | integer | Timestamp (ms)                   |

---

## audios

Menyimpan metadata file audio.

| Field      | Type    | Description                |
| ---------- | ------- | -------------------------- |
| id         | text PK | UUID                       |
| step_id    | text FK | References method_steps.id |
| audio_url  | text    | URL audio (Cloudinary)     |
| duration   | integer | Durasi dalam detik         |
| created_at | integer | Timestamp (ms)             |

Audio bersifat opsional.

Jika kosong maka Browser Text-to-Speech digunakan.

---

## quizzes

Menyimpan data quiz (prepared for future).

| Field           | Type    | Description                |
| --------------- | ------- | -------------------------- |
| id              | text PK | UUID                       |
| step_id         | text FK | References method_steps.id |
| question        | text    | Pertanyaan                 |
| option_a        | text    | Opsi A                     |
| option_b        | text    | Opsi B                     |
| option_c        | text    | Opsi C                     |
| option_d        | text    | Opsi D                     |
| correct_answer  | text    | A / B / C / D              |
| created_at      | integer | Timestamp (ms)             |

---

# 6. Relationships

```
User
│
├── Session 1
├── Session 2
└── Session N
```

Setiap User memiliki banyak Session.

---

```
Category
│
├── Method 1
├── Method 2
└── Method N
```

Setiap Category memiliki banyak Method.

---

```
Method
│
├── Step 1
├── Step 2
├── Step N
│
├── Asset 1
└── Asset N
```

Setiap Method memiliki banyak Step dan Asset.

---

```
Step
│
├── Material 1
├── Material N
│
└── Audio (max 1)
```

Setiap Step memiliki banyak Material dan maksimal satu Audio.

---

# 7. Migration & Seed

Generate migration:

```bash
npx drizzle-kit generate
```

Push schema:

```bash
npx drizzle-kit push
```

Run seed:

```bash
npx tsx db/seed.ts
```

---

# 8. Default Data

Seed menghasilkan:

1 Admin User

- Email: admin@sdlc-ar.com
- Password: admin123
- Role: super_admin

1 Category

- Software Engineering

3 Methods

- Waterfall (6 steps)
- Agile (4 steps)
- RAD (4 steps)

---

# 9. Request Flow

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

---

# 10. API Endpoints

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

---

# 11. Mesh Mapping

Contoh mapping.

| Mesh Name         | Database       |
| ----------------- | -------------- |
| WF_REQUIREMENTS   | Requirements   |
| WF_DESIGN         | Design         |
| WF_IMPLEMENTATION | Implementation |
| WF_TESTING        | Testing        |
| WF_DEPLOYMENT     | Deployment     |
| WF_MAINTENANCE    | Maintenance    |

---

Agile

| Mesh        |
| ----------- |
| AG_PLANNING |
| AG_DAILY    |
| AG_REVIEW   |
| AG_RETRO    |

---

RAD

| Mesh             |
| ---------------- |
| RAD_REQUIREMENT  |
| RAD_DESIGN       |
| RAD_CONSTRUCTION |
| RAD_CUTOVER      |

---

# 12. Database Optimization

- Menggunakan SQLite untuk development.
- Menggunakan Turso untuk production.
- Satu request mengambil seluruh tahapan berdasarkan metode.
- Detail tahapan disimpan pada React State.
- Tidak melakukan query setiap kali mesh diklik.
- mesh_name menggunakan UNIQUE INDEX.

---

# 13. Summary

Database menggunakan pendekatan **Static Asset + Dynamic Content**.

Model 3D menjadi bagian dari aplikasi, sedangkan database hanya menyimpan informasi pembelajaran. Hubungan antara objek 3D dan database dilakukan melalui `mesh_name`, sehingga interaksi AR dapat dilakukan secara cepat tanpa perlu menyimpan informasi pembelajaran di dalam file `.glb`.
