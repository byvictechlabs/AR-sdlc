
# Database Design

# AR SDLC Learning Media

Version: 2.0

Status: Implemented

Author: Bayu Dani Kurniawan

Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan desain database aplikasi: tabel apa saja yang ada, isi setiap kolom, dan bagaimana data pembelajaran dihubungkan dengan model 3D. Database hanya menyimpan **konten yang bisa berubah** (judul, deskripsi, materi, audio), sedangkan file model 3D dan marker **tidak pernah** disimpan di dalam database. Dokumen ini ditujukan kepada dosen, pembimbing, dan klien; pembaca non-teknis cukup memahami bagian Overview, Skema Tabel, dan Penghubung dengan AR, sedangkan bagian perintah teknis boleh dilewati. Istilah teknis dijelaskan pada Glosarium di bawah ini.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
| --- | --- |
| **API** | Cara resmi agar satu program meminta data ke program lain, berupa alamat khusus dengan format balasan yang tetap. |
| **Endpoint** | Satu alamat API tertentu, misalnya `/api/methods` untuk mengambil daftar metode pembelajaran. |
| **Database** | Tempat penyimpanan data terstruktur yang bisa dicari dan diubah, seperti buku kas digital. |
| **Tabel** | Kumpulan baris data dengan kolom yang sama di dalam database, mirip tabel Excel. |
| **ORM** | Lapisan perantara agar program dapat mengakses database menggunakan bahasa program biasa, bukan bahasa query khusus. |
| **Drizzle** | ORM yang dipakai proyek ini untuk membaca dan menulis data dari kode TypeScript ke database. |
| **Turso** | Layanan database SQLite yang dijalankan di cloud (online), dipakai untuk menyimpan data produksi. |
| **Migration** | Berkas perubahan struktur database yang dijalankan agar tabel di database selalu sesuai dengan kode program. |
| **Cache / ISR / Revalidate** | Penyimpanan sementara hasil data agar tidak dihitung ulang terus-menerus; `revalidate` menentukan kapan cache dianggap kedaluwarsa dan perlu diperbarui. |
| **Service Worker** | Program kecil di browser yang berjalan di latar belakang untuk menyimpan aset (misalnya file model) agar bisa dibuka ulang tanpa mengunduh ulang. |
| **Middleware** | Kode yang dijalankan sebelum halaman dilayani; pada proyek ini dipakai untuk memeriksa login sebelum pengguna masuk halaman admin. |
| **Authentication (Autentikasi)** | Proses memastikan identitas pengguna, misalnya lewat email dan kata sandi. |
| **JWT** | Token (tanda pengenal) digital berisi identitas pengguna yang dibuat setelah login berhasil, dipakai agar sesi login tetap terjaga. |
| **Slug** | Bagian alamat web yang mudah dibaca, misalnya metode "Waterfall" memiliki slug `waterfall` sehingga alamatnya `/learn/waterfall`. |
| **Validasi (Zod)** | Pemeriksaan format data yang masuk (wajib diisi atau tidak, tipe datanya benar atau tidak) sebelum data diproses atau disimpan. |
| **Mesh** | Satu permukaan objek 3D yang diberi nama unik, misalnya `WF_DESIGN`; mesh adalah bagian yang bisa diklik pengguna. |
| **GLB** | Format berkas model 3D tempat seluruh bentuk dan tekstur dikompres dalam satu file. |
| **Marker** | Gambar cetak yang di-scan lewat kamera; saat marker terdeteksi, model 3D muncul di atasnya. |
| **MindAR** | Pustaka open source yang mengenali marker (disebut *image tracking*) melalui kamera browser. |
| **A-Frame** | Pustaka penyusun scene 3D berbasis HTML yang menjadi dasar halaman AR statis `ar.html`. |
| **Raycaster** | Teknik menembakkan "garis pandang" dari posisi klik/tap pengguna untuk menentukan mesh 3D mana yang tersentuh. |
| **TypeScript** | Bahasa JavaScript yang ditambah pemeriksaan tipe data agar kesalahan program terdeteksi lebih awal. |
| **React component** | Potongan antarmuka (UI) yang bisa dipakai ulang di berbagai halaman. |
| **Server component vs client component** | Server component dihitung di server sehingga lebih ringan dan cocok untuk memuat data awal; client component berjalan di browser dan bisa merespons klik pengguna. |
| **Cloudflare R2** | Layanan penyimpanan file di cloud tempat file model 3D GLB di-host. |

---

# 1. Overview

Database digunakan untuk menyimpan seluruh konten pembelajaran yang bersifat **dinamis**.

Model 3D **tidak pernah disimpan di database**. File GLB dihosting di Cloudflare R2 (`https://models.byvictech.site/models/*.glb`) dengan salinan cadangan pada folder `public/models/`.

Database hanya menyimpan informasi berikut:

- Akun admin & autentikasi (tabel `users`, `sessions`, `accounts`)
- Metode SDLC (tabel `sdlc_methods`)
- Tahapan/metode steps beserta materi dan audio URL (tabel `method_steps`)
- Quiz (tabel `quizzes`, disiapkan untuk fitur masa depan, belum dipakai UI)

Pendekatan ini membuat ukuran database tetap kecil serta mempercepat proses rendering model AR.

---

# 2. Database Technology

| Bagian | Teknologi |
| --- | --- |
| Database pengembangan | SQLite berkas lokal (`local.db`) |
| Database produksi | Turso (SQLite cloud) |
| ORM | Drizzle ORM |
| Driver | `@libsql/client` |
| Lokasi definisi tabel | `db/schema/` (`auth.ts`, `methods.ts`, `steps.ts`, `quizzes.ts`, `relations.ts`) |
| Lokasi koneksi | `db/index.ts` |
| Kredensial | Environment variable `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` |

---

# 3. Design Principles

## Static Assets — tidak masuk database

File GLB, marker, dan texture disimpan sebagai file, bukan sebagai data database:

- `public/markers/targets.mind` (seluruh marker dalam satu berkas)
- `public/models/` (cadangan model) + Cloudflare R2 (sumber utama)

## Dynamic Content — disimpan di database

- Akun admin
- Nama metode, slug, deskripsi, status, urutan
- Lokasi model (`model_path`) dan marker (`marker_path`)
- Tahapan: judul, deskripsi, isi materi, gambar, audio URL, urutan
- Data quiz (persiapan fitur baru)

## Mesh Mapping

Setiap mesh pada model memiliki nama unik, contoh: `WF_REQUIREMENTS`, `WF_DESIGN`, `WF_IMPLEMENTATION`. Nama tersebut menjadi penghubung antara objek 3D dan data pembelajaran (lihat bagian 7).

## Portable Design

Skema dirancang agar portabel antara SQLite lokal dan Turso:

- Menggunakan primary key teks (UUID) untuk portabilitas
- Menggunakan timestamp integer untuk kompatibilitas
- Tidak memakai fitur khusus SQLite yang tidak tersedia di Turso
- Berkas `local.db` untuk pengembangan, Turso untuk produksi

---

# 4. Entity Relationship Diagram

```
users ──< sessions                (satu user bisa punya banyak sesi login)
users ──< accounts                (satu user bisa punya banyak akun OAuth)

sdlc_methods ──< method_steps     (satu metode punya banyak tahapan)
                                          │
method_steps ──< quizzes                (satu tahapan punya banyak soal quiz)
```

Keterangan: `──<` berarti relasi *satu ke banyak*. Penghapusan metode akan ikut menghapus seluruh tahapannya (*cascade*), dan penghapusan tahapan ikut menghapus quiz-nya.

---

# 5. Database Schema

Terdapat **enam tabel** aktif saat ini.

## 5.1 users

Menyimpan akun admin.

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| name | text | Nama lengkap |
| email | text | Email (unique) |
| password_hash | text | Kata sandi hasil hash bcrypt |
| role | text | `admin` / `super_admin` |
| created_at | integer | Timestamp (ms) |
| updated_at | integer | Timestamp (ms) |

## 5.2 sessions

Menyimpan data sesi untuk autentikasi.

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| user_id | text FK | References `users.id` (cascade) |
| expires_at | integer | Waktu kedaluwarsa sesi |
| session_token | text | Token sesi (unique) |

## 5.3 accounts

Menyimpan data akun OAuth (disiapkan untuk kebutuhan masa depan).

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| user_id | text FK | References `users.id` (cascade) |
| type | text | Jenis akun |
| provider | text | Penyedia OAuth |
| provider_account_id | text | ID akun pada penyedia |

## 5.4 sdlc_methods

Menyimpan informasi metode SDLC.

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| name | text | Nama metode (Waterfall, Agile, RAD) |
| slug | text | Alamat ramah pembaca (unique), dipakai halaman AR |
| description | text | Deskripsi singkat |
| model_path | text | Alamat file GLB (URL R2 atau path lokal) |
| marker_path | text | Alamat gambar marker sumber |
| status | text | `draft` / `published` / `archived` |
| sort_order | integer | Urutan tampilan |
| mind_target_index | integer | Nomor urut target di `targets.mind` (penghubung marker) |
| created_at | integer | Timestamp (ms) |
| updated_at | integer | Timestamp (ms) |

## 5.5 method_steps

Menyimpan seluruh tahapan beserta materinya. Kolom `mesh_name` adalah penghubung kritis dengan model 3D.

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| method_id | text FK | References `sdlc_methods.id` (cascade) |
| mesh_name | text | Unique; **wajib sama persis** dengan nama mesh di GLB |
| title | text | Judul tahapan |
| description | text | Penjelasan singkat tahapan |
| content | text | Isi materi pembelajaran (teks panjang) |
| image_url | text | URL gambar pendukung (nullable) |
| audio_url | text | URL audio narasi (nullable) |
| step_order | integer | Urutan tahapan |
| created_at | integer | Timestamp (ms) |
| updated_at | integer | Timestamp (ms) |

Catatan: materi dan audio disimpan langsung di tabel ini, sehingga tidak diperlukan tabel terpisah untuk materi atau audio.

## 5.6 quizzes

Menyimpan data quiz — **struktur sudah tersedia, tetapi belum dipakai oleh UI**.

| Field | Type | Description |
| --- | --- | --- |
| id | text PK | UUID |
| step_id | text FK | References `method_steps.id` (cascade) |
| question | text | Pertanyaan |
| option_a … option_d | text | Opsi jawaban A–D |
| correct_answer | text | `A` / `B` / `C` / `D` |
| created_at | integer | Timestamp (ms) |

---

# 6. Relationships

| Relasi | Jumlah | Keterangan |
| --- | --- | --- |
| User → Sessions | satu ke banyak | Satu admin bisa memiliki banyak sesi login |
| User → Accounts | satu ke banyak | Disiapkan untuk login via OAuth |
| Method → Steps | satu ke banyak | Satu metode memiliki beberapa tahapan |
| Step → Quizzes | satu ke banyak | Satu tahapan bisa memiliki beberapa soal |

Penghapusan data mengikuti aturan *cascade*: menghapus metode otomatis menghapus seluruh tahapannya, dan menghapus tahapan otomatis menghapus quiz-nya.

---

# 7. Mesh Mapping & Marker (Penghubung dengan AR)

Dua kolom berikut adalah penghubung kritis antara database dan dunia AR. **Salah satu tidak cocok = fitur AR gagal.**

## 7.1 `mesh_name` (penghubung 1)

| Mesh Name (di GLB) | Tahapan di database |
| --- | --- |
| WF_REQUIREMENTS | Requirements |
| WF_DESIGN | Design |
| WF_IMPLEMENTATION | Implementation |
| WF_TESTING | Testing |
| WF_DEPLOYMENT | Deployment |
| WF_MAINTENANCE | Maintenance |

**Agile**

| Mesh Name (di GLB) | Tahapan di database |
| --- | --- |
| AG_REQUIREMENT | Requirement |
| AG_DESIGN | Design |
| AG_DEVELOPMENT | Development |
| AG_TESTING | Testing |
| AG_DEPLOYMENT | Deployment |
| AG_REVIEW | Review |

**RAD**

| Mesh Name (di GLB) | Tahapan di database |
| --- | --- |
| RAD_REQUIREMENT | Requirement |
| RAD_DESIGN | Design |
| RAD_CONSTRUCTION | Construction |
| RAD_CUTOVER | Cutover |

Nama mesh hanya boleh diisi sesuai nama di file GLB dan tidak boleh diubah sembarang melalui dashboard.

## 7.2 `mind_target_index` (penghubung 2)

Seluruh gambar marker dikompilasi menjadi satu berkas `public/markers/targets.mind`. **Urutan upload saat kompilasi** menjadi nomor target dan disimpan di kolom ini.

| Metode | `mind_target_index` |
| --- | --- |
| Waterfall | 0 |
| Agile | 1 |
| RAD | 2 |

Jika kolom kosong, API memakai nilai bawaan berdasarkan slug (waterfall 0, agile 1, rad 2).

---

# 8. Migration & Seed

Membuat berkas migration (perubahan struktur tabel):

```bash
npx drizzle-kit generate
```

Menjalankan migration ke database:

```bash
npx drizzle-kit push
```

Mengisi data awal:

```bash
npx tsx db/seed.ts
```

---

# 9. Default Data (Hasil Seed)

**1 Admin User**

- Email: `admin@sdlc-ar.com`
- Password: `admin123`
- Role: `super_admin`

**3 Metode beserta tahapannya**

| Metode | Slug | Tahapan | `mind_target_index` |
| --- | --- | --- | --- |
| Waterfall | `waterfall` | 6 (Requirements → Maintenance) | 0 |
| Agile | `agile` | 6 (Requirement → Review) | 1 |
| RAD | `rad` | 4 (Requirement, Design, Construction, Cutover) | 2 |

---

# 10. Request Flow (Alur Permintaan Data)

Saat halaman AR terbuka, sistem memuat seluruh data tahapan dalam **satu kali permintaan**:

```
GET /api/methods/by-slug/<slug>
            ↓
Respons JSON: data metode + seluruh daftar tahapan
            ↓
Disimpan di memori halaman AR (JavaScript)
```

Saat pengguna mengklik bagian model:

```
Nama mesh diklik  →  dicari di memori  →  popup detail tampil
```

Tidak ada query database tambahan pada setiap klik, sehingga popup tampil seketika.

Halaman `/home/mulai-belajar` juga memakai cache server: `unstable_cache` dengan tag `"methods"` dan `revalidate: 3600` detik, yang di-reset oleh `revalidateTag("methods", { expire: 0 })` setiap metode dibuat/diubah/dihapus melalui API.

---

# 11. API Endpoints

**Methods**

```
GET    /api/methods              → daftar metode
POST   /api/methods              → buat metode baru
GET    /api/methods/:id          → detail metode + seluruh tahapan
PUT    /api/methods/:id          → ubah metode
DELETE /api/methods/:id          → hapus metode
GET    /api/methods/by-slug/:slug → detail metode berdasarkan slug (dipakai halaman AR)
```

**Steps**

```
GET    /api/steps                → daftar tahapan
POST   /api/steps                → buat tahapan baru
GET    /api/steps/:id            → detail tahapan
PUT    /api/steps/:id            → ubah tahapan
DELETE /api/steps/:id            → hapus tahapan
```

**Users**

```
GET    /api/users                → daftar pengguna
POST   /api/users                → tambah pengguna
DELETE /api/users/:id            → hapus pengguna
```

**Dashboard**

```
GET    /api/dashboard/stats      → ringkasan statistik admin
```

**Auth (NextAuth v5)**

```
/api/auth/[...nextauth]           → session, sign-in, sign-out
```

---

# 12. Validation & Security

| Aspek | Implementasi |
| --- | --- |
| Validasi input | Zod (`schemas/index.ts`): `loginSchema`, `methodSchema`, `stepSchema`, `quizSchema` |
| Kata sandi | bcrypt (hash, bukan teks biasa) |
| Sesi | JWT melalui NextAuth v5 |
| Penjaga halaman admin | `middleware.ts` pada route `/admin/*` |
| Kredensial database | Environment variable, tidak ada di dalam kode |

Aturan validasi penting pada input admin:

- `slug` hanya boleh berisi huruf kecil, angka, dan tanda hubung (`/^[a-z0-9-]+$/`).
- `meshName` hanya boleh berisi huruf besar, angka, dan garis bawah (`/^[A-Z0-9_]+$/`).

**Known issue (diketahui, belum ditangani):** endpoint API methods, steps, dan users saat ini **belum memeriksa status login**; perlindungan utama baru ada pada lapisan halaman admin. Pemeriksaan autentikasi di API menjadi rencana perbaikan.

---

# 13. Database Optimization

| Upaya | Manfaat |
| --- | --- |
| SQLite lokal untuk pengembangan, Turso untuk produksi | Pengembangan cepat, produksi andal di cloud |
| Satu request mengambil seluruh tahapan berdasarkan metode | Jumlah query database sangat sedikit |
| Data tahapan disimpan di memori halaman AR | Klik mesh tidak memicu query baru |
| Cache server `unstable_cache` tag `"methods"` | Halaman daftar metode tidak menghitung ulang database setiap kunjungan |
| Service Worker (Serwist) menyimpan file `.glb` | Model tidak diunduh berulang |
| `mesh_name` memakai UNIQUE INDEX | Mencegah dua tahapan memakai nama mesh yang sama |

---

# 14. Summary

Database menggunakan pendekatan **Static Asset + Dynamic Content**.

Model 3D menjadi aset statis yang dihosting di Cloudflare R2, sedangkan database hanya menyimpan informasi pembelajaran: metode, tahapan, materi, audio URL, beserta data akun admin. Hubungan antara objek 3D dan database dilakukan melalui dua kolom kunci, yaitu `mesh_name` dan `mind_target_index`, sehingga interaksi AR dapat berjalan cepat tanpa menyimpan informasi pembelajaran di dalam file `.glb`.
