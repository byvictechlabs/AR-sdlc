
# UI / UX Guidelines

# AR SDLC Learning Media

Version: 1.0

Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan **aturan tampilan dan pengalaman pengguna (UI/UX)** aplikasi AR SDLC Learning Media — yaitu media belajar berbasis WebAR: mulai dari palet warna, tipografi, komponen dashboard admin, sampai gaya halaman belajar AR.

Dokumen ini ditujukan untuk tim desain dan tim pengembang agar hasil kerja seragam. Pembaca non-teknis cukup membaca bagian **Design Philosophy**, **Palet Warna**, dan **Halaman Pengguna** untuk memahami kesan visual aplikasi. Istilah teknis dijelaskan pada **Glosarium Istilah** di bawah ini.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
|---|---|
| **WebAR** | Augmented Reality yang berjalan di browser web, tanpa instal aplikasi. |
| **Marker** | Gambar cetak yang dipindai kamera agar objek 3D muncul di atasnya. |
| **Mesh** | Satu bagian permukaan objek 3D; setiap tahapan SDLC = satu mesh yang bisa diklik. |
| **GLB** | Format file model 3D. |
| **TTS (Text-to-Speech)** | Fitur browser yang mengubah teks menjadi suara untuk membacakan materi. |
| **Cache** | Penyimpanan sementara di browser agar file yang sudah pernah diunduh tidak diunduh ulang. |
| **Toast Notification** | Notifikasi kecil yang muncul sementara di sudut layar sebagai umpan balik aksi. |
| **Skeleton Loading** | Pola abu-abu berkedip yang meniru bentuk konten sebagai penanda data sedang dimuat. |
| **Empty State** | Tampilan saat tidak ada data, biasanya ilustrasi kecil + pesan penjelas. |
| **Responsive** | Tata letak yang menyesuaikan ukuran layar (desktop, tablet, ponsel). |
| **Accessibility** | Keterbacaan dan keterjangkauan antarmuka bagi semua pengguna (kontras warna, fokus keyboard, dll.). |

---

# Design Philosophy

Dashboard Admin harus memiliki tampilan profesional, modern, bersih, dan mudah digunakan.

Prioritaskan usability dibanding dekorasi visual.

Desain harus terlihat seperti aplikasi enterprise, bukan landing page atau template AI.

---

# Design Keywords

- Clean
- Professional
- Modern
- Simple
- Spacious
- Consistent
- Accessible

---

# Overall Theme

| Peran | Warna |
|---|---|
| Primary | Biru |
| Accent | Biru muda |
| Background | Abu-abu sangat muda |
| Card | Putih |
| Danger | Merah |
| Success | Hijau |
| Warning | Oranye |

---

# Color Palette

Sumber palet resmi: `app/globals.css` (variabel CSS Tailwind v4). Nilai hex di bawah adalah konversi perkiraan dari format `oklch` yang dipakai di file tersebut.

| Peran | Variabel CSS | Nilai (oklch) | Perkiraan Hex |
|---|---|---|---|
| Primary | `--primary` | `oklch(0.48 0.18 260)` | `#1156C1` |
| Primary (teks di atasnya) | `--primary-foreground` | `oklch(0.985 0.005 260)` | `#F8FAFE` |
| Background | `--background` | `oklch(0.97 0.002 260)` | `#F4F5F6` |
| Card | `--card` | `oklch(1 0 0)` | `#FFFFFF` |
| Border | `--border` | `oklch(0.91 0.005 260)` | `#DFE1E5` |
| Text Primary | `--foreground` | `oklch(0.17 0.02 260)` | `#0A1018` |
| Text Secondary | `--muted-foreground` | `oklch(0.48 0.02 260)` | `#575E69` |
| Danger | `--destructive` | `oklch(0.577 0.245 27.325)` | `#E7000B` |
| Sidebar (latar gelap) | `--sidebar` | `oklch(0.22 0.025 260)` | `#141B26` |

Warna aksen pendukung yang dipakai langsung di komponen (kelas Tailwind):

| Peran | Kelas yang dipakai |
|---|---|
| Ikon statistik / aksen sekunder | `blue-500` / `blue-600`, `indigo-600`, `violet-600` |
| Success / status published | `emerald-50` + `emerald-700` |
| Warning / status draft | `amber-50` + `amber-700` |
| Danger / status hapus | `red-50` + `red-700` |
| Netral / status archived | `slate-100` + `slate-600` |

Catatan: halaman belajar AR (`public/learn/ar.html`) memakai latar gelap `#0B1220`, layar awal gradien `#2563EB → #4F46E5`, dan tombol utama `#2563EB`. Halaman splash/menu memakai latar putih dengan aksen gradien biru (`blue-600 → blue-400`).

---

# Visual Style

Gunakan desain flat modern.

Hindari

- Shadow tebal
- Gradient berlebihan
- Glassmorphism
- Neumorphism
- Glow effect
- Animasi berlebihan
- Warna terlalu mencolok

Gunakan

- Border tipis
- Shadow kecil
- Rounded seperlunya
- White space yang cukup

---

# Border Radius

Gunakan

```
rounded-xl
```

atau

```
rounded-2xl
```

untuk card dan container. Tombol bawaan shadcn/ui memakai `rounded-lg` — ikuti kelas tombol yang sudah ada.

Jangan gunakan

```
rounded-full
```

kecuali avatar.

---

# Shadow

Gunakan

```
shadow-sm
```

atau

```
shadow
```

Hindari

```
shadow-2xl
```

```
drop-shadow
```

```
shadow-blue
```

---

# Layout

Gunakan layout dashboard modern.

```
Sidebar (kiri, gelap)
        +
Top Navbar (putih)
        +
Main Content (maks. lebar, latar abu-abu muda)
```

Content memiliki maksimal width (`max-w-6xl`) agar nyaman dibaca.

---

# Sidebar

Sidebar berada di kiri dan bersifat bisa dilipat (collapse).

Background

Gelap (`#0F172A` / navy), teks terang.

Menu aktif

Biru (`bg-blue-500/15` + teks `blue-400`) dengan titik penanda biru.

Icon

Lucide Icons.

Menu memiliki hover yang halus. Bagian bawah berisi tombol Collapse dan Log Out.

---

# Navbar

Navbar sederhana, background putih, tinggi tetap.

Isi

- Profil Admin (nama, email, menu dropdown dengan Sign Out)
- Search (Future)

---

# Cards

Card harus

- Putih
- Border tipis
- Shadow kecil (`shadow-sm`)
- Padding cukup
- Radius `rounded-xl`

Jangan menggunakan gradient sebagai latar card.

---

# Buttons

| Variante | Warna |
|---|---|
| Primary | Biru (`bg-primary`) |
| Secondary | Abu-abu |
| Danger | Merah (`bg-destructive` dengan latar transparan) |
| Ghost | Tanpa latar, hover abu-abu |

Hover: lebih gelap / kontras naik.

---

# Forms

Gunakan

```
Label
   ↓
Input
   ↓
Helper Text / pesan error
```

Jarak antar field konsisten.

Input memiliki

- Border
- Rounded
- Focus Ring Blue
- Pesan error berwarna merah di bawah input

---

# Tables

Gunakan

- Sticky Header
- Hover Row
- Pagination
- Search
- Filter
- Zebra row (opsional)

Kolom tidak boleh terlalu rapat.

---

# Modal

Modal berada di tengah.

Background putih.

Header jelas (judul + tombol tutup).

Footer berisi tombol aksi.

Untuk dialog hapus, gunakan komponen `DeleteDialog` yang sudah ada.

---

# Icons

Gunakan

Lucide React

Jangan menggunakan emoji pada dashboard.

---

# Typography

Gunakan

Font

Poppins (font utama, sudah dikonfigurasi di `app/layout.tsx`) atau Inter sebagai fallback.

Font pendukung untuk teks monospace: JetBrains Mono.

Ukuran

| Elemen | Kelas |
|---|---|
| Heading | `text-2xl` |
| Sub Heading | `text-xl` |
| Body | `text-base` |
| Caption | `text-sm` |

---

# Spacing

Gunakan spacing konsisten.

```
4

6

8

12

16
```

Hindari layout yang terlalu padat.

---

# Animations

Gunakan animasi sederhana.

- Fade
- Scale kecil
- Transition

Durasi

150ms–250ms

Jangan menggunakan animasi berlebihan.

---

# Responsive Design

Dashboard minimal mendukung

- Desktop
- Tablet

Mobile hanya sebagai fallback.

Halaman belajar (splash, menu, pilih metode, halaman AR) dirancang mobile-first karena diakses lewat ponsel.

---

# Accessibility

Semua tombol memiliki

- Hover
- Focus
- Disabled State

Gunakan kontras warna yang baik.

---

# Empty State

Jika data kosong tampilkan ilustrasi sederhana dan pesan yang informatif.

Contoh

```
Belum ada data metode SDLC.

Klik tombol "Tambah Metode" untuk memulai.
```

---

# Loading State

Gunakan

Skeleton Loading

Untuk proses unduh model 3D, tampilkan dialog progress (bar + persentase + status) seperti pada kartu metode.

Hindari spinner fullscreen jika tidak diperlukan.

---

# Notifications

Gunakan Toast Notification.

Posisi

Top Center (bawaan Toaster aplikasi).

Jenis

- Success
- Error
- Warning
- Info

---

# Halaman Pengguna (Sisi Belajar)

Bagian ini menjelaskan gaya visual halaman yang dilihat pengguna belajar (bukan dashboard admin), mulai dari splash screen, menu, pilih metode, sampai halaman AR tempat marker dipindai dan mesh model 3D diklik untuk membuka materi beserta suara TTS. Model 3D (GLB) diunduh sekali lalu disimpan di cache browser.

## Splash Screen (`/`)

- Latar putih dengan hamparan gradien biru lembut di bagian atas
- Judul "SDLC AR" (SDLC hitam, AR biru) dan garis biru pendek sebagai aksen
- Ilustrasi AR di tengah
- Tombol utama **"Mulai Belajar"** berbentuk pil, gradien `blue-600 → blue-400`

## Menu Utama (`/home`)

- Gradien biru di bagian atas
- Dua tombol menu: **Mulai Belajar** (gradien biru) dan **Panduan** (putih dengan border abu-abu)
- Footer biru dengan bar kecil putih

## Pilih Metode (`/home/mulai-belajar`)

- Header gradien biru dengan tombol kembali
- Kartu metode: putih, border abu-abu, aksen gradien biru di bagian atas kartu, ikon dalam kotak gradien biru, dan nomor urut bulat biru
- Saat kartu diklik: dialog progress unduhan (bar biru + persentase + teks status)

## Halaman Panduan (`/home/panduan`)

- Latar `#F8FAFC`
- Header sticky putih semi-transparan dengan blur
- Kartu langkah putih dengan border tipis, nomor dalam kotak biru, dan panel tips berlatar `blue-50`

## Halaman AR (`/learn/ar.html`)

- Latar gelap `#0B1220`
- Layar awal: gradien `#2563EB → #4F46E5`, judul putih, tombol putih teks biru "Mulai Kamera"
- Overlay status berupa pill gelap transparan di atas
- Popup materi: lembar putih dari bawah, judul tebal gelap, teks abu sedang, tombol "Dengarkan" biru dan tombol tutup ✕
- Indikator: hijau = marker terdeteksi/sukses, oranye = peringatan, merah `#DC2626` = error

Aturan yang berlaku tetap sama: flat modern, shadow kecil, tanpa dekorasi berlebihan.

---

# Admin Experience

Dashboard harus memungkinkan admin menyelesaikan tugas utama dengan jumlah klik seminimal mungkin.

Prioritaskan:

- Navigasi yang jelas
- Form yang sederhana
- Feedback yang cepat
- Konsistensi antar halaman

---

# AI Design Constraints

Saat membuat antarmuka, AI harus mengikuti aturan berikut:

- Gunakan Tailwind CSS.
- Gunakan komponen yang konsisten di seluruh aplikasi.
- Jangan menggunakan gradient sebagai latar utama.
- Jangan menggunakan shadow tebal.
- Jangan membuat desain yang terlihat seperti template AI.
- Gunakan warna biru sebagai identitas utama dashboard.
- Utamakan keterbacaan dan kemudahan penggunaan dibanding efek visual.
- Pastikan setiap halaman memiliki hierarki visual yang jelas.
- Komponen harus reusable dan konsisten.
- Jangan mengubah palet warna di `app/globals.css` tanpa persetujuan.

---

# Design Inspiration

Dashboard sebaiknya memiliki nuansa seperti:

- GitHub
- Vercel Dashboard
- Linear
- Notion
- Stripe Dashboard

Bukan seperti:

- Landing page startup
- Crypto dashboard
- Gaming UI
- Glassmorphism showcase
- Template AI generik
