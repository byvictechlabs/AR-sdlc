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
| **Stage Model (model tahap)** | Model 3D khusus satu tahapan yang menggantikan model utama di atas marker saat tahap itu diklik; bisa berupa file GLB dari database atau model bawaan dari kode. Popup materi baru terbuka setelah tombol **"📋 Lihat Penjelasan"** ditekan. |
| **Tombol aksi (stage CTA)** | Tombol tetap di layar (`📋 Lihat Penjelasan` + `✕`) yang muncul saat mode tahap aktif; menjadi jalan membuka popup atau keluar dari mode tahap. |
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
Model 3D tahap menggantikan model utama
+ tombol aksi muncul: "📋 Lihat Penjelasan" dan "✕"
      ↓
Tombol "📋 Lihat Penjelasan" diklik
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
- Logika model 3D tahap (stage model) dipecah jadi tiga tempat: elemen HTML + CSS di `ar.html`, logika inti di **`public/learn/stage-models.js`** (525 baris — termasuk kit bersama `stageKit()`), dan 16 model per tahap di **`public/learn/stages/<metode>/<tahap>.js`** (RAD 4 + Agile 7 + Waterfall 5 sesuai rancangan client). `ar.html` (1344 baris) memuat ke-17 file itu lewat `<script>` berurutan (baris 348–364) sebelum script inline-nya — lihat bagian 5.1.
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
│ 10. Model 3D tahap tampil       │  model tahap menggantikan model utama
│    (stage model)                │  (di atas marker, ikut gesture)
├─────────────────────────────────┤
│ 10b. Tombol aksi tampil         │  "📋 Lihat Penjelasan" + "✕"
│     (fixed, bottom 126px)       │  popup BELUM terbuka
├─────────────────────────────────┤
│ 11. Materi tampil (popup)       │  saat tombol "📋 Lihat Penjelasan" diklik
│                                 │  judul + penjelasan tahapan
├─────────────────────────────────┤
│ 12. Suara diputar (opsional)    │  tombol "Dengarkan" → Text-to-Speech
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

## 5.1 Stage 3D Model (Model 3D Khusus Tahap)

Fitur **Stage Model** membuat model 3D khusus tahap yang diklik **menggantikan model utama** di atas marker (pilihan tampilan "ganti di marker"). Popup materi **tidak langsung terbuka** — yang muncul lebih dulu adalah **tombol aksi** di layar; popup baru terbuka setelah pengguna menekan tombol **"📋 Lihat Penjelasan"**.

**Lokasi kode:** fitur ini terbagi tiga tempat — semua file statis biasa (bukan module), murni pemisahan file, perilaku aplikasi tidak berubah:

| Bagian | File | Isi |
| --- | --- | --- |
| Elemen & CSS | `public/learn/ar.html` (**1344 baris**) | `<div id="stage-cta">`, CSS `#stage-cta` / `.stage-cta-detail` / `.stage-cta-close`, entity `#stage-entity` |
| Logika inti (**hub**) | `public/learn/stage-models.js` (**525 baris**) | state `stageToken` + `stageStep`, `showStageCTA()` / `hideStageCTA()` / `openDetailFromStage()`, `detectStageType()` (aware metode), `detectMethod()`, helper `stageEntity()` / `stageBox()` / `stageWrap()`, **`stageKit()`** (palet + `frame`/`part`/`callout`/`tag` + prop bersama `person`/`screen`/`board`/`doc`/`bubble`/`server`/`cloud`/`rocket`/`bug`/`check`/`arrow`), registry **`const STAGE_BUILDERS = {}` (kosong, key `<metode>/<tahap>`)**, `hideStageModel()`, `activateStageSwap()`, `fitStageGltf()`, `showStageModel()` |
| Isi 16 model tahap | `public/learn/stages/<metode>/<tahap>.js` (**16 file** = RAD 4 + Agile 7 + Waterfall 5, 89–343 baris, total 1956 baris) | `STAGE_BUILDERS["<metode>/<tahap>"] = function () { ... }` — mis. `rad/cutover`, `agile/launch`, `waterfall/testing` (nama tahap = spesifikasi `docs/Rancangan_Isi_Model_3D_Tahapan_SDLC.docx`) |

**Urutan `<script>` di ar.html (baris 348–364):** `stage-models.js` (hub) → 16 file builder `stages/waterfall/*.js` (baris 349–353) → `stages/agile/*.js` (baris 354–360) → `stages/rad/*.js` (baris 361–364) → script inline utama ar.html (baris 365–1342). Hub **wajib dimuat duluan** karena dialah yang mendeklarasikan `STAGE_BUILDERS`, dan semua **wajib sebelum** script inline — urutan ini yang menjamin 16 model siap dipakai `showStageModel()`. Seluruh fungsi di atas menjadi global sehingga `ar.html` bisa memanggilnya.

**Alur singkat:**

```
Pengguna klik mesh tahap
        ↓
showStageModel(step, meshName) → true (ada model tahap)
        ↓
Model utama disembunyikan → model 3D tahap muncul di atas marker
        ↓
Tombol aksi tampil: "📋 Lihat Penjelasan" + "✕"
        ↓
Tombol "📋 Lihat Penjelasan" diklik (openDetailFromStage)
        ↓
Popup materi terbuka (teks materi + kontrol TTS, persis seperti sebelumnya)
        ↓
Popup ditutup (✕ popup / backdrop) → popup hilang,
        model tahap TETAP tampil, tombol aksi muncul lagi
        ↓
Tombol "✕" aksi → keluar mode tahap → model utama tampil kembali
```

**Dua sumber model tahap (urutan prioritas):**

| Prioritas | Sumber | Cara kerja |
| --- | --- | --- |
| 1 | **GLB dari database** | Kolom opsional `stageModelUrl` pada tabel `method_steps`, diisi lewat form admin `/admin/steps` (label: *"Stage Model URL (opsional — GLB 3D tahap di R2)"*). File GLB disimpan di R2 (`https://models.byvictech.site/models/stages/...`); yang masuk database hanya URL-nya. |
| 2 | **Model hardcode** | Dibangun dari kode A-Frame primitives di **`public/learn/stages/<metode>/<tahap>.js`** (16 file = RAD 4 + Agile 7 + Waterfall 5), yang mendaftarkan dirinya ke registry `STAGE_BUILDERS["<metode>/<tahap>"]` di `stage-models.js` — tidak memakai file GLB sama sekali. Dipakai bila URL kosong atau GLB gagal dimuat. |
| 3 | **Perilaku lama** | Bila keduanya tidak tersedia (`showStageModel()` mengembalikan `false`): model utama tetap terlihat dan **popup terbuka langsung** tanpa tombol aksi (persis seperti versi sebelumnya). |

**16 jenis model hardcode** — dipilih oleh fungsi `detectStageType()` yang **aware metode** (nama mesh diterima `detectMethod()` dulu lewat prefix `RAD_` / `AG_` / `WF_`, baru kata kunci tahap cocokkan di dalam metode tersebut — RAD `DESIGN` ≠ Waterfall `DESIGN`):

| Metode | Kata kunci pada nama mesh | Slug (`<metode>/<tahap>`) | Bentuk model (ringkas) |
| --- | --- | --- | --- |
| RAD | `REQUIREMENT` / `PLANN` | `rad/requirements-planning` | papan "?" + orang menunjuk, dokumen scope berbatas, daftar centang, dokumen approval + stempel |
| RAD | `DESIGN` | `rad/user-design` | meja blueprint + kubus wireframe + pensil (4 zona callout — isi asli dipertahankan) |
| RAD | `DEVELOP` / `CONSTRUCTION` | `rad/construction` | monitor kode + programmer, modul puzzle menyatu, daftar centang + kutu, umpan balik + jempol |
| RAD | `IMPLEMENT` / `CUTOVER` | `rad/cutover` | lemari arsip → server, layar final test, pelatih + pendengar, roket go live |
| Agile | `PLAN` / `BACKLOG` | `agile/plan` | papan backlog + kartu, kartu prioritas 1-2-3, meja rapat stakeholder |
| Agile | `DESIGN` | `agile/design` | layar wireframe, desainer + palet warna, diagram simpul UI-API-DB |
| Agile | `DEVELOP` | `agile/develop` | monitor kode + programmer, diagram cabang `main`/`dev`, dua orang satu layar |
| Agile | `TEST` | `agile/test` | kartu kode + centang, kutu + alat perbaikan, penguji + kaca pembesar |
| Agile | `DEPLOY` | `agile/deploy` | server "Staging", paket rilis → awan, awan + panah data |
| Agile | `REVIEW` | `agile/review` | presenter + grafik, gelembung + jempol, pankan "IMPROVE" + panah melingkar |
| Agile | `LAUNCH` / `RELEASE` | `agile/launch` | roket rilis + bendera versi, orang memakai aplikasi, dashboard monitoring (menunggu step DB `AG_LAUNCH`) |
| Waterfall | `REQUIREMENT` / `ANALYS` | `waterfall/requirements-analysis` | papan wawancara, timbangan feasibility, dokumen SRS tebal |
| Waterfall | `DESIGN` | `waterfall/design` | rantai Frontend-API-Backend, silinder DB + ERD, layar UI + ponsel |
| Waterfall | `DEVELOP` | `waterfall/development` | terminal + programmer, modul terpisah M1–M3, dua modul disatukan |
| Waterfall | `TEST` | `waterfall/testing` | papan test case, kutu + tiket laporan, layar system testing + kaca pembesar |
| Waterfall | `MAINTENANCE` | `waterfall/maintenance` | kunci inggris + obeng, panah versi v1.0→v2.0, petugas headset |

Bentuk model tiap baris ditulis di file sendiri: **`public/learn/stages/<metode>/<tahap>.js`** — RAD (`requirements-planning` 112, `user-design` 343, `construction` 111, `cutover` 123 baris), Agile (`plan` 91, `design` 110, `develop` 112, `test` 96, `deploy` 100, `review` 96, `launch` 125), Waterfall (`requirements-analysis` 89, `design` 129, `development` 99, `testing` 94, `maintenance` 126) — total 16 file / 1956 baris. Tiap file memakai kit bersama `stageKit()` dari hub (tanpa duplikasi helper), lalu mendaftarkan diri ke registry, misalnya `STAGE_BUILDERS["rad/cutover"] = function () { ... }`.

**Sifat model tahap:**

- **Ikut gesture** (putar / zoom / geser) karena entity model tahap berada di dalam `#pivot`, bersama model utama.
- **Auto-fit**: ukuran GLB tahap disesuaikan otomatis ke ukuran standar (`fitStageGltf()`), sama seperti normalisasi model utama.
- Model tahap memakai **platform dasar + grup STASIS** (`stageWrap()` — **tanpa putar otomatis**; putar/geser hanya lewat gesture user, konsisten dengan model utama yang juga tidak berputar sendiri).
- Pembentukan model: `stageEntity()` (wadah) dan `stageBox()` (kotak ukuran) untuk mode hardcode.
- Selama mode tahap aktif, **ketukan bebas di scene diabaikan** — pengguna memakai tombol aksi.

**Pembatalan aman (anti-race):**

- `stageToken` (penghitung token) **dinaikkan saat keluar mode tahap** (tombol `✕` aksi saja) — bukan saat popup ditutup — sehingga proses load GLB tahap yang belum selesai otomatis batal dan respons lambat tidak menampilkan model yang sudah tidak diminta.
- **Marker hilang (`targetLost`) TIDAK menyembunyikan apa pun** (perubahan sesuai permintaan user): pose model dibekukan oleh `patchTargetFreeze()` di `ar.html` — model 3D, popup, dan tombol aksi tetap tampil & interaktif; `isTracking` tetap `true` supaya klik mesh masih berfungsi. Saat marker terdeteksi lagi, MindAR mengunci ulang model ke posisi marker.

**Fungsi terkait:**

- **Hub — `public/learn/stage-models.js` (525 baris, dimuat duluan):** `detectStageType()` (aware metode), `detectMethod()`, `stageEntity()`, `stageBox()`, `stageWrap()`, `stageKit()` (kit diorama bersama), `STAGE_BUILDERS` (registry), `hideStageModel()`, `activateStageSwap()`, `fitStageGltf()`, `showStageModel(step, meshName)` (**return boolean**), `showStageCTA()`, `hideStageCTA()`, `openDetailFromStage()`.
- **Isi builder — `public/learn/stages/<metode>/<tahap>.js` (16 file, dimuat setelah hub):** `STAGE_BUILDERS["rad/…"]` (4 tahap: requirements-planning, user-design, construction, cutover), `STAGE_BUILDERS["agile/…"]` (7 tahap: plan, design, develop, test, deploy, review, launch), `STAGE_BUILDERS["waterfall/…"]` (5 tahap: requirements-analysis, design, development, testing, maintenance) — satu fungsi tanpa parameter yang mengembalikan entity A-Frame, mengikuti gaya label callout + garis penunjuk tahap User Design.
- **`patchTargetFreeze()` — di `public/learn/ar.html` (fungsi `init()`):** mem-patch `updateWorldMatrix` komponen `mindar-image-target` MindAR agar `targetLost` **membekukan pose terakhir** (visible & matrix tidak disentuh) alih-alih menyembunyikan model; event `targetFound`/`targetLost` tetap dikirim seperti biasa, jadi seluruh alur aplikasi tidak berubah. Dipanggil saat init, saat scene `loaded`, dan sebagai jaring pengaman di listener `targetFound`.

**Sambungan dengan alur klik:**

```
handleClick()
   ├─ if (stageStep) return;                    ← mode tahap aktif: ketukan diabaikan
   └─ showStageModel(stepsData[name], name)
         ├─ true  → showStageCTA()              ← model tahap tampil + tombol aksi (popup belum buka)
         └─ false → openPopup(...)              ← tidak ada model tahap: popup langsung (perilaku lama)

tombol "📋 Lihat Penjelasan" → openDetailFromStage() → openPopup()
                                (openPopup menyembunyikan tombol aksi)
closePopup()                 → bila stageStep ada → showStageCTA() lagi
                                (model tahap TETAP tampil)
tombol "✕" aksi           → hideStageModel()   (keluar mode tahap:
                                bersihkan stageStep + tombol aksi + token)
targetLost                → TIDAK menyembunyikan apa pun — pose model
                                dibekukan (patchTargetFreeze di ar.html);
                                marker terlihat lagi → kunci ulang ke marker
```

**Entity:** `<a-entity id="stage-entity" visible="false">` adalah **saudara** `#model-entity` di dalam `#pivot` (bagian scene A-Frame).

**Log debug di console browser:**

```
[Stage] Muat GLB tahap dari database:
[Stage] GLB fit — size:
[Stage] GLB tahap tampil
[Stage] GLB gagal → fallback:
[Stage] Model hardcode:
[Stage] Tanpa model (URL kosong & builder tak ditemukan) → popup langsung
```

Catatan: kode interaktif pengguna (gesture rotate / pinch / pan) **tidak berubah** oleh fitur ini.

## 5.2 Tombol Aksi (Stage CTA)

Saat mode tahap aktif, pengguna **tidak langsung** membuka popup. Layar menampilkan **tombol aksi** tetap (*fixed*) di posisi `bottom: 126px`:

```
┌───────────────────────────────────────┐
│   [ model 3D tahap di atas marker ]   │
│                                       │
│                                       │
│  ┌───────────────────┐   ┌────────┐   │
│  │📋 Lihat Penjelasan│   │   ✕    │   │
│  └───────────────────┘   └────────┘   │
└───────────────────────────────────────┘
     fixed · bottom 126px · z-index 80
     animasi masuk: ctaIn
```

**Elemen & CSS (tetap di `public/learn/ar.html`; logika tombolnya di `stage-models.js`):**

- `<div id="stage-cta" class="hidden">` berisi `<button class="stage-cta-detail">📋 Lihat Penjelasan</button>` dan `<button class="stage-cta-close">✕</button>`.
- CSS baru: `#stage-cta` (fixed, bottom 126px, z-index 80, animasi `ctaIn`), `.stage-cta-detail` (biru `#2563eb`), `.stage-cta-close`.

**Daftar alur langkah (2 langkah — popup tidak auto-buka):**

| No | Aksi pengguna | Hasil |
| --- | --- | --- |
| 1 | Klik mesh tahap | Model utama digantikan model 3D tahap + **tombol aksi muncul** (tombol utama **"📋 Lihat Penjelasan"** dan tombol **"✕"**) |
| 2 | Klik **"📋 Lihat Penjelasan"** | **Barulah** popup detail terbuka (teks materi + kontrol TTS tetap persis seperti sebelumnya) |
| 3 | Tutup popup (✕ popup / backdrop) | Popup hilang, **model tahap tetap tampil**, tombol aksi muncul lagi |
| 4 | Klik tombol **"✕"** aksi | Keluar dari mode tahap → model utama tampil kembali |
| 5 | Fallback: mesh tanpa model tahap (URL kosong & builder tak ditemukan) | Popup terbuka **langsung** tanpa tombol (perilaku lama) |
| 6 | Ketuk bebas di scene selama mode tahap aktif | Diabaikan (guard `if (stageStep) return;`) — gunakan tombol. Marker hilang (`targetLost`) → **tidak membersihkan apa pun** — pose dibekukan, model + tombol aksi tetap tampil |
| 7 | Mode URL: tombol diklik saat GLB masih loading | Tombol tetap bisa diklik; model tampil begitu selesai dimuat |

**State & fungsi baru:**

- **`stageStep`** — step yang model tahapnya sedang tampil; keberadaannya berarti **mode tahap aktif**.
- **`stageToken`** — dinaikkan saat **keluar mode tahap**, bukan saat popup ditutup.
- `showStageCTA()` / `hideStageCTA()` — menampilkan / menyembunyikan tombol aksi.
- `openDetailFromStage()` — membuka popup detail dari tombol "📋 Lihat Penjelasan".
- **`showStageModel()` mengembalikan boolean**: `true` = model tahap diproses/tampil → tombol aksi muncul; `false` = tidak ada model tahap → popup langsung terbuka (perilaku lama).

**Perubahan fungsi lama:**

| Fungsi | Perubahan |
| --- | --- |
| `openPopup()` | Menyembunyikan tombol aksi |
| `closePopup()` | **Tidak lagi** menyembunyikan model tahap; justru menampilkan lagi tombol aksi bila `stageStep` ada |
| `handleClick()` | Guard `if (stageStep) return;` + percabangan `if (showStageModel(...)) showStageCTA(); else openPopup(...)` |
| `hideStageModel()` | Membersihkan `stageStep` + tombol aksi |
| `targetLost` | **Tidak menyembunyikan apa pun** (perubahan sesuai permintaan user): pose dibekukan oleh `patchTargetFreeze()` dan `isTracking` tetap `true` — `closePopup()`/`hideStageModel()` tidak lagi dipanggil dari sini |

**Catatan file split:** `hideStageModel()` kini berada di `public/learn/stage-models.js`, sedangkan `openPopup()`, `closePopup()`, `handleClick()`, dan `targetLost()` tetap di `public/learn/ar.html`. Keduanya saling memanggil sebagai fungsi global karena `stage-models.js` dimuat sebelum script inline ar.html.

> Detail teks materi dan kontrol TTS **tetap ada** — hanya waktu bukanya yang dipindah ke tombol. Tabel kontrol popup (Dengarkan / Jeda / Berhenti) tidak berubah.

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
Ketemu  → model 3D tahap menggantikan model utama
          lalu tombol aksi tampil ("📋 Lihat Penjelasan" + "✕")
          → popup materi baru terbuka saat tombol "📋 Lihat Penjelasan" diklik
            (+ highlight hijau pada mesh)
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
Model 3D tahap menggantikan model utama + tombol aksi tampil
      ↓
Tombol "📋 Lihat Penjelasan" diklik
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

Halaman AR ditulis dalam JavaScript murni (bukan React), sehingga state disimpan sebagai variabel di dalam `public/learn/ar.html` (state model tahap `stageToken` dan `stageStep` ada di `public/learn/stage-models.js`):

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
│ suara bahasa Indonesia (rate 0,9).         │
└────────────────────────────────────────────┘
```

**Kontrol audio di popup:**

| Tombol | Fungsi |
|---|---|
| ▶ Dengarkan | Mulai membacakan materi |
| ⏸ Jeda / Lanjutkan | Menjeda atau melanjutkan suara |
| ■ Berhenti | Menghentikan suara |

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
- Popup materi tampil sesuai mesh yang diklik (pada mode tahap: lewat tombol **📋 Lihat Penjelasan**).
- Data materi sesuai database.
- Suara (TTS) dapat diputar dan berhenti dengan benar.
- Tidak terdapat error TypeScript.
- Tidak terdapat error di console browser.

---

*Dokumen terakhir diperbarui: Oktober 2026*
