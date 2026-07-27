
# UI / UX Guidelines

# AR SDLC Learning Media

Version: 1.0

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

Primary Color

Blue

Accent

Light Blue

Background

Light Gray

Card

White

Danger

Red

Success

Green

Warning

Orange

---

# Color Palette

Primary

```
#2563EB
```

Primary Hover

```
#1D4ED8
```

Background

```
#F8FAFC
```

Card

```
#FFFFFF
```

Border

```
#E5E7EB
```

Text Primary

```
#111827
```

Text Secondary

```
#6B7280
```

Success

```
#16A34A
```

Danger

```
#DC2626
```

Warning

```
#F59E0B
```

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
Sidebar

+

Top Navbar

+

Main Content
```

Content memiliki maksimal width agar nyaman dibaca.

---

# Sidebar

Sidebar berada di kiri.

Background

Putih.

Menu aktif

Blue.

Icon

Lucide Icons.

Menu memiliki hover yang halus.

---

# Navbar

Navbar sederhana.

Isi

- Logo
- Judul Halaman
- Search (Future)
- Admin Profile

---

# Cards

Card harus

- Putih
- Border tipis
- Shadow kecil
- Padding cukup

Jangan menggunakan gradient.

---

# Buttons

Primary

Blue

Secondary

Gray

Danger

Red

Success

Green

Hover

Lebih gelap 10%.

---

# Forms

Gunakan

Label

↓

Input

↓

Helper Text

Jarak antar field konsisten.

Input memiliki

- Border
- Rounded
- Focus Ring Blue

---

# Tables

Gunakan

- Zebra row optional
- Sticky Header
- Hover Row
- Pagination
- Search
- Filter

Kolom tidak boleh terlalu rapat.

---

# Modal

Modal berada di tengah.

Background putih.

Header jelas.

Footer berisi tombol aksi.

---

# Icons

Gunakan

Lucide React

Jangan menggunakan emoji pada dashboard.

---

# Typography

Gunakan

Font

Geist

atau

Inter

Ukuran

Heading

```
text-2xl
```

Sub Heading

```
text-xl
```

Body

```
text-base
```

Caption

```
text-sm
```

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

Hindari spinner fullscreen jika tidak diperlukan.

---

# Notifications

Gunakan Toast Notification.

Posisi

Top Right.

Jenis

- Success
- Error
- Warning
- Info

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
