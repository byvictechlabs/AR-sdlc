# AR System Documentation

# Sistem Augmented Reality — AR SDLC Learning Media

Version: 1.1  
Status: Final  
Author: Bayu Dani Kurniawan  
Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan **bagaimana fitur Augmented Reality (AR) bekerja** di dalam aplikasi — mulai dari pengguna memindai marker, model 3D muncul, sampai pengguna menekan bagian model dan membaca materi pembelajaran.

Pembaca non-teknis cukup memahami **bagian 1–5 dan 14–16** (alur pengguna, marker, model, audio, dan aturan bisnis). Bagian sisanya adalah pedoman teknis untuk tim developer dan pembuat model 3D.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
|---|---|
| **WebAR** | Augmented Reality yang berjalan di browser web — tidak perlu instal aplikasi. Cukup buka link di Chrome/Safari. |
| **Marker** | Gambar cetak (kertas/foto) yang dipindai kamera. Saat marker dikenali, objek 3D muncul di atasnya. |
| **Image Tracking** | Teknologi mengenali dan melacak gambar marker secara terus-menerus lewat kamera. |
| **MindAR** | Library open-source yang melakukan image tracking di browser. Jantung sistem AR aplikasi ini. |
| **A-Frame** | Kerangka kerja untuk membuat scene/ruang 3D di browser dengan cara menulis elemen HTML khusus. |
| **Three.js** | Library 3D dasar yang dipakai A-Frame di belakang layar (rendering, kamera, perhitungan posisi). |
| **Mesh** | Satu potongan/permukaan objek 3D. Di aplikasi ini, **setiap tahapan SDLC = satu mesh terpisah** sehingga bisa diklik satu per satu. |
| **GLB** | Format file model 3D (mirip JPG untuk foto — satu file berisi seluruh objek, tekstur, dan nama mesh). |
| **Raycaster** | Teknik menentukan objek 3D mana yang disentuh pengguna — bekerja seperti "sinar tak terlihat" dari titik sentuh layar ke arah model. |
| **TTS (Text-to-Speech)** | Fitur browser yang mengubah teks menjadi suara, sehingga materi bisa "dibacakan" tanpa file audio. |
| **Cache** | Penyimpanan sementara di browser. File yang sudah pernah diunduh tidak diunduh ulang, sehingga tampil lebih cepat. |

---

# 1. Overview

Sistem AR merupakan inti dari aplikasi AR SDLC Learning Media.

Sistem ini memungkinkan pengguna memindai marker menggunakan kamera perangkat untuk menampilkan model 3D metode SDLC yang dapat berinteraksi secara langsung.

Setiap tahapan pada model dapat dipilih sehingga pengguna dapat membaca materi pembelajaran serta mendengarkan penjelasan suara (Text-to-Speech).

**Ringkasan alur pengguna:**

```
Buka halaman AR
      ↓
Tekan tombol "Mulai Kamera"
      ↓
Arahkan kamera ke marker cetak
      ↓
Marker terdeteksi → model 3D muncul di atas marker
      ↓
Ketuk salah satu tahapan (bagian model)
      ↓
Popup materi tampil + tombol "Dengarkan" (suara)
```

---

# 2. Technologies

Sistem AR dibangun dengan teknologi berikut:

| Teknologi | Versi | Peran |
|---|---|---|
| **MindAR** | 1.2.5 | Mengenali dan melacak marker (gambar) lewat kamera. |
| **A-Frame** | 1.6.0 | Menyusun scene 3D, kamera, dan lampu di dalam halaman web. |
| **Three.js** | via A-Frame | Rendering objek 3D, raycaster, dan perhitungan posisi. Diakses lewat `AFRAME.THREE`. |
| **WebGL** | bawaan browser | Teknologi browser untuk menggambar grafis 3D. |
| **Browser Camera API** | bawaan browser | Mengakses kamera perangkat (dengan izin pengguna). |
| **SpeechSynthesis API** | bawaan browser | Text-to-Speech bahasa Indonesia untuk membacakan materi. |

**Catatan penting:**

- Halaman AR ditulis sebagai **file HTML statis** (`public/learn/ar.html`), **bukan** komponen React. Alasannya: A-Frame mengontrol DOM secara langsung dan bentrok dengan siklus hidup React (lihat `README.md` — bagian *Kenapa Menggunakan Static HTML*).
- **React Three Fiber tidak dipakai** pada versi produksi. (Kode React AR lama masih ada di repo sebagai arsip, tetapi tidak aktif.)
- MindAR dan A-Frame dimuat dari CDN — tidak perlu instalasi apapun di perangkat pengguna.

---

# 3. AR Workflow

```
┌─────────────────────────────────┐
│ 1. Buka halaman AR             │  /learn/ar.html?method=agile
├─────────────────────────────────┤
│ 2. Halaman memuat data metode   │  fetch API: method + tahapan + index marker
│    & konfigurasi (background)   │
├─────────────────────────────────┤
│ 3. Tekan "Mulai Kamera"         │  browser meminta izin kamera
├─────────────────────────────────┤
│ 4. MindAR diinisialisasi        │  memuat file marker targets.mind
├─────────────────────────────────┤
│ 5. Pindai marker                │  tampil indikator "scanning"
├─────────────────────────────────┤
│ 6. Marker terdeteksi            │  model 3D muncul menempel di marker
├─────────────────────────────────┤
│ 7. Model dimuat                 │  dari cache (cepat) atau unduh (progress bar)
├─────────────────────────────────┤
│ 8. Pengguna ketuk mesh/tahapan  │  raycaster menentukan mesh yang disentuh
├─────────────────────────────────┤
│ 9. Nama mesh dibaca (mesh.name) │  dicocokkan dengan database tahapan
├─────────────────────────────────┤
│ 10. Materi tampil (popup)       │  judul + penjelasan tahapan
├─────────────────────────────────┤
│ 11. Suara diputar (opsional)    │  tombol "Dengarkan" → Text-to-Speech
└─────────────────────────────────┘
```

---

# 4. Marker Tracking

Marker tracking menggunakan **MindAR Image Tracking** — kamera mengambil gambar terus-menerus, lalu sistem mencocokkannya dengan data marker yang sudah dikompilasi.

Setiap metode SDLC memiliki satu marker:

| Metode | Sumber gambar marker |
|---|---|
| Waterfall | waterfall.png |
| Agile | agile.png |
| RAD | rad.png |

**Cara kerja file marker:**

1. Gambar marker (PNG/JPG) disiapkan dengan resolusi dan kontras tinggi.
2. Semua gambar di-compile (kompilasi) lewat [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/mindarkit/image-targets/) menjadi **SATU file** `.mind`.
3. File hasil compile disimpan di:

```
public/markers/targets.mind
```

4. **Urutan upload saat kompilasi = nilai `mindTargetIndex` di database:**

| Index | Metode |
|---|---|
| 0 | Waterfall |
| 1 | Agile |
| 2 | RAD |

5. Pengguna **mencetak marker ke kertas** dan meletakkannya di depan kamera.

> ⚠️ **Aturan penting:** Jika marker di-compile ulang dengan urutan berbeda, nilai `mindTargetIndex` di admin (`/admin/methods`) harus disesuaikan. Salah index = marker tidak terbaca.

---

# 5. Model System

Setiap metode memiliki satu file model 3D dengan format GLB.

| Metode | File model | Lokasi hosting |
|---|---|---|
| Waterfall | waterfall.glb | Cloudflare R2 (`models.byvictech.site`) |
| Agile | agile-new.glb | Cloudflare R2 |
| RAD | RAD.glb | Cloudflare R2 |

**Aturan penyimpanan model:**

- Model di-host di **Cloudflare R2** (storage awan), diakses lewat URL lengkap.
- Lokasi model tercatat di kolom `modelPath` pada tabel `sdlc_methods` (diubah lewat admin `/admin/methods`).
- **Model TIDAK disimpan di database** — database hanya menyimpan *alamat/URL* modelnya.
- File di `public/models/` hanya berisi cadangan lokal, bukan sumber utama.
- Model dimuat **hanya setelah marker terdeteksi**, dan di-cache di browser supaya tidak unduh ulang.

---

# 6. Model Architecture

```
Marker (dicetak)
   │  dipindai kamera
   ▼
Metode (index marker di database)
   │  menentukan
   ▼
Model GLB (Cloudflare R2)
   │  berisi
   ▼
Mesh-mesh (tiap tahapan = 1 mesh)
   │  disentuh pengguna → Raycaster
   ▼
Popup materi (dari database)
```

---

# 7. Mesh Architecture

Setiap tahapan harus dipisahkan menjadi mesh terpisah di dalam file model 3D.

**Kenapa harus terpisah?**  
Agar pengguna bisa menekan **satu tahapan saja** dan hanya tahapan itu yang membuka popup-nya. Kalau seluruh model jadi satu mesh tunggal, tidak bisa dibedakan mana yang ditekan.

Contoh pemisahan (metode Waterfall):

```
WF_REQUIREMENTS
WF_DESIGN
WF_IMPLEMENTATION
WF_TESTING
WF_DEPLOYMENT
WF_MAINTENANCE
```

Setiap mesh wajib memiliki **nama unik** — nama inilah yang menjadi penghubung ke database (bagian 9).

---

# 8. Mesh Naming Rules

Format penamaan:

```
PREFIX_STEP
```

Aturan:

- Huruf **BESAR** semua, dipisah underscore `_`.
- Tanpa spasi dan tanpa karakter khusus.
- Konsisten dengan kolom `meshName` di database.

Contoh nama mesh per metode (sesuai data seed):

**Waterfall:**
```
WF_REQUIREMENTS
WF_DESIGN
WF_IMPLEMENTATION
WF_TESTING
WF_DEPLOYMENT
WF_MAINTENANCE
```

**Agile:**
```
AG_REQUIREMENT
AG_DESIGN
AG_DEVELOPMENT
AG_TESTING
AG_DEPLOYMENT
AG_REVIEW
```

**RAD:**
```
RAD_REQUIREMENT
RAD_DESIGN
RAD_CONSTRUCTION
RAD_CUTOVER
```

> ⚠️ **Mesh name tidak boleh diubah setelah dipakai di database.** Mengubah nama mesh membuat semua link ke materi putus (materi tidak muncul saat diklik).

---

# 9. Mesh Mapping

Mesh name adalah **jembatan tunggal** antara model 3D dan database.

```
Nama mesh di file GLB          Database (tabel method_steps)
─────────────────────          ─────────────────────────────
"WF_REQUIREMENTS"   ───────►  meshName: "WF_REQUIREMENTS"
                                     │
                                     ▼
                              title: "Requirements"
                              content: "Materi penjelasan..."
                                     │
                                     ▼
                              Popup materi tampil
```

**Alur saat pengguna menekan mesh:**

```
Pengguna ketuk layar
      ↓
Raycaster menentukan mesh yang disentuh
      ↓
Sistem membaca nama mesh (mesh.name)
      ↓
Nama dicari di database (stepsData)
      ↓
Ketemu  → popup materi tampil (+ highlight hijau pada mesh)
Tidak ketemu → muncul peringatan "mesh belum ada di data admin"
```

**Jika mesh tidak bisa diklik:**

- Cek apakah nama mesh di GLB **sama persis** dengan `meshName` di admin `/admin/steps`.
- Gunakan fitur tampilan debug di halaman AR (console browser) untuk melihat daftar nama mesh yang terbaca.

---

# 10. Blender Rules

Sebelum export model dari Blender:

- Pisahkan setiap tahapan menjadi objek/mesh yang terpisah.
- Beri nama mesh **final** sesuai aturan penamaan (bagian 8) — nama di Blender inilah yang terbawa ke GLB.
- Jangan memakai nama otomatis bawaan Blender seperti `Cube001` atau `Mesh` — nama itu tidak mewakili tahapan.
- **Apply transform** (Ctrl+A → All Transforms) sebelum export agar posisi/ukuran model konsisten.
- Hapus mesh yang tidak digunakan (objek dekorasi yang tidak perlu diklik boleh ada, tetapi beri nama yang jelas).

---

# 11. Export Rules

- Format export: **Binary GLTF (`.glb`)** — satu file, praktis, dan cepat dimuat.
- Gunakan kompresi (misal Draco) bila ukuran file terlalu besar untuk web.
- Setelah export, upload ke Cloudflare R2 dan perbarui `modelPath` di admin.
- **Jika mengganti file model dengan URL baru**, gunakan URL berbeda (misal `agile-v2.glb`) supaya cache browser mengunduh versi terbaru.

---

# 12. Click Interaction

Pengguna memilih objek menggunakan **Raycaster**.

**Penjelasan sederhana:** saat layar disentuh, sistem menembakkan "sinar tak terlihat" dari titik sentuhan ke arah model 3D. Objek pertama yang tersentuh sinar itulah yang dianggap ditekan pengguna.

```
Sentuhan layar
      ↓
Raycaster (sinar tak terlihat)
      ↓
Mesh yang tersentuh terdeteksi
      ↓
Nama mesh dibaca (mesh.name)
      ↓
Tahapan dicari di database
      ↓
Popup materi terbuka
```

**Detail implementasi:**

1. **Raycaster (utama)** — dipakai pertama kali, bersifat rekursif (menembus seluruh bagian model).
2. **Fallback bounding sphere** — jika raycaster meleset (model kecil di layar), sistem memproyeksikan setiap mesh ke layar dan memilih yang paling dekat dengan titik sentuh.
3. **Resolusi nama ke parent** — jika yang tersentuh adalah label/huruf kecil, sistem naik ke objek induknya sampai menemukan nama yang cocok dengan database.
4. **Feedback visual** — mesh yang berhasil dicocokkan berkedip hijau selama ±0,7 detik sebagai tanda berhasil diklik.

---

# 13. Raycaster Rules

- Raycaster hanya boleh mendeteksi mesh yang memang interaktif (berisi tahapan).
- Mesh dekoratif tidak boleh diberi event interaksi atau menutupi mesh tahapan.
- Jika menambah mesh baru di model, daftarkan ke database sebagai langkah baru (atau hapus dari model bila tidak dipakai).

---

# 14. State Flow (Alur State di Halaman AR)

Halaman AR ditulis dalam JavaScript murni (bukan React), sehingga state disimpan sebagai variabel di dalam `public/learn/ar.html`:

```
Mutasi (perubahan state)
      │
      ▼
Variabel state halaman AR
(isTracking, modelLoaded, stepsData, currentStep, dll)
      │
      ▼
Tampilan diperbarui
(popup, indikator scanning, overlay loading, feedback klik)
      │
      ▼
Audio / Text-to-Speech dimulai
```

> **Catatan:** Dokumen versi lama menyebut "React State Flow" dengan Zustand. Pada versi produksi saat ini, halaman AR berjalan mandiri di luar React sehingga tidak memakai Zustand. Store React tersebut masih ada di repo sebagai arsip dan tidak aktif.

---

# 15. Audio Flow

```
Popup materi terbuka
      ↓
Pengguna menekan tombol "▶ Dengarkan"
      ↓
Sistem memeriksa ketersediaan audio
      ↓
┌────────────────────────────────────────────┐
│ Mode 1 — File MP3 (audioUrl)               │
│ Data sudah tersedia di database & form     │
│ admin, TETAPI pemutaran MP3 belum aktif    │
│ pada versi saat ini.                       │
├────────────────────────────────────────────┤
│ Mode 2 — Text-to-Speech (AKTIF)            │
│ Browser membacakan teks materi dengan      │
│ suara pilihan pengguna. Pengguna bisa      │
│ memilih suara TTS & mengatur kecepatan    │
│ (0,6x–1,6x) lewat pengatur di popup;      │
│ pilihannya disimpan di localStorage.      │
│ Default: suara Indonesia (rate 0,9).       │
└────────────────────────────────────────────┘
```

**Kontrol audio di popup:**

| Tombol | Fungsi |
|---|---|
| ▶ Dengarkan | Mulai membacakan materi |
| ⏸ Jeda / Lanjutkan | Menjeda atau melanjutkan suara |
| ■ Berhenti | Menghentikan suara |
| 🔊 Suara (dropdown) | Memilih suara TTS dari daftar suara device (bahasa Indonesia diurutkan paling atas) |
| ⚡ Kecepatan (slider) | Mengatur kecepatan membaca 0,6x–1,6x |

Pilihan suara & kecepatan tersimpan di `localStorage` (`sdlc_tts_voice`, `sdlc_tts_rate`) — pengguna cukup memilih sekali.

Audio berhenti otomatis saat popup ditutup.

---

# 16. Performance Rules

- Model hanya dimuat **setelah marker terdeteksi** — tidak memuat semua model di awal.
- Unduhan model dimulai **sejak pengguna mengklik kartu metode** (halaman pemilihan), sehingga saat scan tinggal dibuka dari cache.
- Setiap model hanya diunduh **sekali** — selanjutnya disimpan di cache browser (`ar-models-v1`) dan cache Service Worker.
- Data seluruh tahapan diambil dalam **satu request API** (bukan per-tahapan).
- Overlay loading menampilkan **persentase unduhan**, dan disembunyikan saat model benar-benar siap (event `model-loaded`), bukan berdasarkan perkiraan waktu.
- Hindari render ulang dan permintaan jaringan yang tidak perlu.

---

# 17. Error Handling

| Kondisi | Tampilan ke pengguna |
|---|---|
| Marker belum terdeteksi | Indikator scanning aktif: *"Scan marker untuk memulai AR"* |
| Izin kamera ditolak | Banner kesalahan: *"Izin kamera diperlukan"* + tombol **Coba Lagi** |
| Model gagal dimuat | *"Gagal memuat model 3D. Cek koneksi internet, lalu coba lagi."* + tombol **Coba Lagi** |
| Mesh diklik tapi tidak ada di database | Peringatan: *`Mesh "..." belum ada di data admin`* |
| Klik tidak mengenai bagian manapun | *"Tidak ada bagian model yang terdeteksi"* |
| API data metode gagal | Sistem memakai konfigurasi cadangan (fallback) agar AR tetap berjalan |

Tampilan debug (daftar nama mesh, info model, info database) muncul otomatis beberapa detik di layar dan di console browser untuk membantu pengecekan.

---

# 18. Future Features

Fitur yang direncanakan untuk versi berikutnya (**belum diimplementasi**):

- AI Learning Assistant
- Quiz per tahapan
- Highlight mesh terpilih yang lebih halus
- Animasi mesh
- Pertanyaan suara (voice question)
- Multi marker tracking

---

# 19. Business Rules

- Satu metode memiliki **satu marker**.
- Satu metode memiliki **satu file model GLB**.
- Satu metode memiliki **banyak mesh**.
- Setiap mesh mewakili **satu tahapan**.
- `meshName` di database **harus sama persis** dengan nama mesh di GLB.
- Nama mesh tidak boleh diubah setelah digunakan.
- Semua model menggunakan format GLB.
- Model tidak disimpan di database (hanya URL-nya).
- Index marker (`mindTargetIndex`) harus sesuai urutan file `targets.mind`.

---

# 20. Definition of Done

Fitur AR dianggap selesai apabila:

- Marker berhasil terdeteksi oleh kamera.
- Model 3D muncul dan menempel pada marker.
- Seluruh mesh tahapan dapat diklik.
- Popup materi tampil sesuai mesh yang diklik.
- Data materi sesuai database.
- Suara (TTS) dapat diputar dan berhenti dengan benar.
- Tidak terdapat error TypeScript.
- Tidak terdapat error di console browser.

---

*Dokumen terakhir diperbarui: Oktober 2026*
