
# Coding Guidelines

# AR SDLC Learning Media

Version: 1.0
Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini berisi aturan penulisan kode untuk tim pengembang dan AI agent agar kode aplikasi tetap rapi, konsisten, dan mudah dirawat. Setiap aturan teknis kini diberi satu kalimat **"Kenapa"**, sehingga pembaca non-programmer pun dapat memahami tujuan aturan tersebut. Pembaca yang bukan programmer boleh melewati seluruh blok kode contoh; cukup membaca judul aturan, kalimat Kenapa, dan tabel aturan penting. Istilah teknis dijelaskan pada Glosarium di bawah ini.

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
| **React Three Fiber** | Pustaka React untuk Three.js; pada proyek ini **tidak dipakai di produksi** (hanya kode lama). |
| **Zustand** | Pustaka penyimpanan data global di React; pada proyek ini hanya dipakai pada kode lama yang tidak aktif. |
| **Next.js** | Kerangka kerja web yang menyediakan halaman (frontend) sekaligus API (backend) dalam satu aplikasi. |
| **Cloudflare R2** | Layanan penyimpanan file di cloud tempat file model 3D GLB di-host. |

---

# 1. General Principles

Seluruh kode harus mengikuti prinsip berikut:

| Prinsip | Kenapa |
| --- | --- |
| Clean Code | Kode yang bersih lebih mudah dibaca dan diperbaiki oleh orang lain. |
| SOLID Principle | Agar tiap bagian program punya satu tanggung jawab dan mudah diubah tanpa merusak bagian lain. |
| DRY (Don't Repeat Yourself) | Kode yang berulang harus diedit di banyak tempat sehingga rawan salah. |
| KISS (Keep It Simple) | Solusi sederhana lebih cepat dipahami dan lebih sedikit bug-nya. |
| Separation of Concerns | UI, logika, dan data dipisah agar salah satu bisa diubah tanpa menyentuh yang lain. |
| Reusable Components | Komponen yang dipakai ulang mengurangi duplikasi dan menjaga tampilan tetap konsisten. |
| Type Safety | Kesalahan data terdeteksi sebelum program dijalankan, bukan saat sudah dipakai pengguna. |
| Readability over Cleverness | Kode yang mudah dipahami lebih berharga daripada kode yang canggih tetapi membingungkan. |

---

# 2. Language

**Aturan:** Gunakan TypeScript. Jangan gunakan JavaScript (`.js`). Semua file menggunakan ekstensi `.ts` / `.tsx`.

**Kenapa:** TypeScript memeriksa tipe data sehingga kesalahan (seperti salah nama kolom database) terdeteksi lebih awal dan aplikasi lebih stabil.

---

# 3. Framework

**Aturan:** Gunakan Next.js App Router. Jangan gunakan Pages Router.

**Kenapa:** Seluruh aplikasi sudah disusun dengan App Router; memakai gaya lama berarti ada dua cara kerja berbeda dalam satu proyek.

---

# 4. Styling

**Aturan:**

| Gunakan | Jangan gunakan |
| --- | --- |
| Tailwind CSS | Bootstrap, Bulma, Material UI |
| shadcn | Inline CSS (gaya ditulis langsung di dalam kode komponen) |

**Kenapa:** Hanya memakai satu sistem gaya membuat tampilan konsisten dan menghindari konflik antar pustaka styling.

---

# 5. Component Rules

**Aturan:** Gunakan Functional Component. Jangan menggunakan class component.

Contoh:

```tsx
const Button = () => {
    return (
        <button>
            Click
        </button>
    )
}

export default Button
```

Jangan gunakan:

```tsx
class Button extends React.Component
```

**Kenapa:** Functional component lebih singkat, modern, dan mendukung fitur React terbaru yang dipakai proyek ini.

---

# 6. File Naming

**Aturan:**

| Jenis file | Gaya penamaan | Contoh |
| --- | --- | --- |
| Komponen | PascalCase | `MethodCard.tsx`, `AudioPlayer.tsx`, `DetailModal.tsx` |
| Hooks | camelCase berawalan `use` | `useAudio.ts`, `useRaycaster.ts` |
| Utility | camelCase | `formatTime.ts`, `getMeshName.ts` |

**Kenapa:** Penamaan yang konsisten membuat semua orang (dan AI) bisa menebak isi sebuah file hanya dari namanya.

---

# 7. Folder Responsibilities

**Aturan:** Setiap folder memiliki tanggung jawabnya sendiri dan tidak boleh dicampur.

| Folder | Tanggung jawab |
| --- | --- |
| `app/` | Routing: halaman (`admin/`, `home/`, `learn/`), API (`api/`), dan Service Worker (`sw.ts`) |
| `components/` | Komponen React yang dapat dipakai ulang (`admin/`, `ui/`, `ModelPreloader.tsx`) |
| `db/` | Database: skema tabel, koneksi, migration, dan seed |
| `schemas/` | Definisi validasi Zod untuk setiap request |
| `lib/` | Konfigurasi dan helper bersama (`auth.ts`, `api-error.ts`, `utils.ts`) |
| `types/` | Definisi tipe (`next-auth.d.ts`) |
| `public/` | Aset statis: halaman AR `learn/ar.html`, marker `markers/targets.mind`, cadangan `models/`, audio, Service Worker `sw.js` |
| `docs/` | Dokumentasi proyek |
| `ar/`, `components/ar/`, `stores/` | Kode AR React lama — **tidak aktif**, jangan dipakai sebagai referensi alur produksi |

**Kenapa:** Pemisahan folder membuat lokasi setiap kode jelas, sehingga perbaikan cepat dan tidak ada kode yang tersembunyi di tempat yang salah.

---

# 8. TypeScript Rules

**Aturan:** Tidak boleh menggunakan `any`. Gunakan `interface` atau `type`.

```ts
interface MethodStep {
    id: string
    meshName: string
    title: string
}
```

**Kenapa:** `any` mematikan pemeriksaan tipe, sehingga kesalahan data justru muncul saat aplikasi sudah berjalan.

---

# 9. React Rules

**Aturan:**

| Aturan | Kenapa |
| --- | --- |
| Gunakan `useState`, `useEffect`, `useMemo`, `useCallback` | Fitur bawaan React sudah cukup untuk kebutuhan aplikasi ini, tanpa pustaka tambahan. |
| Jika state dipakai lintas halaman, gunakan Zustand | Satu sumber data bersama mencegah nilai berbeda antar halaman. |
| Catatan: halaman aktif saat ini memakai state lokal dan cache server; Zustand hanya tersisa di kode AR lama | Agar developer tidak mengira Zustand adalah bagian dari alur produksi. |

**Kenapa:** Menggunakan alat bawaan terlebih dahulu membuat aplikasi tetap ringan dan mudah dipelihara.

---

# 10. State Management

**Aturan:**

| Gunakan | Jangan gunakan |
| --- | --- |
| Zustand (untuk state global bila benar-benar diperlukan) | Redux |

**Kenapa:** Zustand jauh lebih ringkas daripada Redux dan sudah dikenal tim; memakai dua pustaka state berbeda menambah kerumitan tanpa keuntungan.

---

# 11. Validation

**Aturan:** Semua request API wajib divalidasi dengan Zod.

```ts
const schema = z.object({
    title: z.string(),
    description: z.string()
})
```

**Kenapa:** Data dari pengguna tidak boleh dipercaya; validasi mencegah data kosong, salah format, atau berbahaya masuk ke database.

---

# 12. Database

**Aturan:**

| Gunakan | Jangan gunakan |
| --- | --- |
| Drizzle ORM | Prisma |
| Turso SQLite | Database lain di luar keputusan arsitektur |

**Kenapa:** Seluruh skema, migration, dan helper proyek sudah dibuat untuk Drizzle + Turso; menggantinya berarti mengerjakan ulang lapisan database dari awal.

---

# 13. API Rules

**Aturan:** API dibuat dengan Next.js Route Handler di `app/api/`.

| Aturan | Kenapa |
| --- | --- |
| Validasi request dengan Zod | Data yang masuk dipastikan berformat benar sebelum disentuh database. |
| Bungkus dengan `try/catch` | Kesalahan server tertangkap dan tidak membuat halaman crash. |
| Selalu balas dengan JSON | Klien (halaman AR, dashboard) membutuhkan format balasan yang konsisten. |
| Selalu kirim kode status HTTP (`200`, `201`, `400`, `404`, `500`) | Kode status membuat sistem otomatis (browser, pengujian) tahu sukses atau gagal. |

**Kenapa:** Konsistensi API memudahkan siapa pun memakai ulang API tersebut dan mempercepat penanganan kesalahan.

---

# 14. Error Handling

**Aturan:** Seluruh fungsi `async` wajib menangani kesalahan.

```ts
try {
    // proses
} catch (error) {
    // tangani dan balaskan error yang jelas
}
```

Jangan membiarkan Promise tanpa penanganan error.

**Kenapa:** Tanpa penangkapan, satu kegagalan kecil (misal koneksi database putus) bisa membekukan seluruh proses tanpa pesan yang jelas.

---

# 15. AR Rules

**Aturan:**

| Aturan | Kenapa |
| --- | --- |
| Implementasi AR aktif berada di `public/learn/ar.html` (A-Frame 1.6.0 + MindAR 1.2.5 via CDN, Three.js via `AFRAME.THREE`) | Halaman inilah yang dipakai pengguna; perubahan di tempat lain tidak berdampak pada fitur AR. |
| React Three Fiber **tidak dipakai di produksi**; komponen AR React (`components/ar/*`, `ar/`, `stores/ar-store.ts`) adalah kode lama | Mencegah developer mengaktifkan kembali jalur ganda yang sudah tidak dipakai. |
| Pisahkan kode AR (scene, raycaster, pemuatan model) dari kode UI React | Kode 3D dan kode halaman punya siklus hidup berbeda; mencampurnya membuat keduanya sulit diubah. |
| Jangan mengubah alur AR (scan → load GLB → klik mesh → popup → audio) tanpa persetujuan | Alur tersebut adalah inti produk dan sudah divalidasi pada pengujian. |

**Kenapa:** Fitur AR adalah bagian paling sensitif terhadap perubahan; menjaga satu jalur implementasi yang jelas mengurangi risiko regresi.

---

# 16. Mesh Naming Rules

**Aturan:** Nama mesh harus konsisten dan sesuai dengan nama di file GLB.

| Metode | Nama mesh yang sah |
| --- | --- |
| Waterfall | `WF_REQUIREMENTS`, `WF_DESIGN`, `WF_IMPLEMENTATION`, `WF_TESTING`, `WF_DEPLOYMENT`, `WF_MAINTENANCE` |
| Agile | `AG_REQUIREMENT`, `AG_DESIGN`, `AG_DEVELOPMENT`, `AG_TESTING`, `AG_DEPLOYMENT`, `AG_REVIEW` |
| RAD | `RAD_REQUIREMENT`, `RAD_DESIGN`, `RAD_CONSTRUCTION`, `RAD_CUTOVER` |

- Nama mesh hanya berisi huruf besar, angka, dan garis bawah.
- Nama mesh **tidak boleh diubah** melalui dashboard admin.

**Kenapa:** `meshName` adalah satu-satunya penghubung antara objek 3D dan database; satu karakter yang berbeda membuat tombol pada model tidak menampilkan materi apa pun.

---

# 17. Asset Rules

**Aturan:**

| Aset | Lokasi | Kenapa |
| --- | --- | --- |
| Model GLB | Cloudflare R2 (`https://models.byvictech.site/models/*.glb`); `public/models/` hanya cadangan | Model besar dihosting terpisah agar tidak membebani aplikasi. |
| Marker | `public/markers/` — seluruh marker dikompilasi jadi `targets.mind` | MindAR membutuhkan satu berkas gabungan berisi seluruh target. |
| Audio | Kolom `audio_url` pada `method_steps` + folder `public/audio/` | Audio bersifat opsional dan dikelola per tahapan. |
| File GLB tidak pernah disimpan di database | — | Database tetap kecil dan cepat; file binary bukan konten dinamis. |

**Kenapa:** Aset statis dan konten dinamis punya siklus hidup berbeda; mencampurnya membuat aplikasi lambat dan rumit.

---

# 18. Import Rules

**Aturan:** Gunakan absolute import bila memungkinkan.

```ts
import AudioPlayer from "@/components/audio/AudioPlayer";
```

Hindari:

```ts
../../../components
```

**Kenapa:** Import berbasis `../` mudah rusak ketika file dipindahkan; absolute import tetap valid di mana pun lokasi file.

---

# 19. Naming Convention

**Aturan:**

| Jenis | Gaya | Contoh |
| --- | --- | --- |
| Variabel | camelCase | `selectedStep`, `currentMethod` |
| Konstanta | UPPER_CASE | `DEFAULT_METHOD`, `API_URL` |
| Komponen | PascalCase | `MethodCard` |
| Tipe/Interface | PascalCase | `Method`, `MethodStep` |

**Kenapa:** Satu konvensi penamaan membuat kode terbaca seperti bahasa yang runtut, bukan kumpulan istilah campur aduk.

---

# 20. Async Rules

**Aturan:** Gunakan `async/await`. Jangan memakai `.then()`.

```ts
const methods = await getMethods();
```

**Kenapa:** `async/await` membuat alur asinkron terbaca seperti langkah biasa, sehingga lebih mudah diperiksa dan didebug.

---

# 21. Comment Rules

**Aturan:** Komentar hanya untuk logika yang cukup kompleks. Jangan mengomentari hal yang sudah jelas dari kodenya sendiri.

Buruk:

```ts
// Increment counter
counter++;
```

Baik:

```ts
// Raycaster digunakan untuk menentukan mesh yang diklik
```

**Kenapa:** Komentar yang berlebihan justru cepat basi dan menyesatkan; komentar yang tepat menjelaskan *mengapa*, bukan *apa*.

---

# 22. Git Rules

**Aturan:**

| Jenis | Format |
| --- | --- |
| Branch | `feature/`, `fix/`, `refactor/` |
| Commit | Conventional Commit: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:` |

Contoh:

```
feat: add AR scan page
fix: resolve mesh click detection
docs: update architecture
refactor: simplify audio player
```

**Kenapa:** Riwayat commit yang tertata membuat perubahan mudah ditelusuri dan lebih aman bila perlu mengembalikan versi sebelumnya.

---

# 23. Performance Rules

| Aturan | Kenapa |
| --- | --- |
| Lazy load model GLB | Model besar dimuat seperlunya agar halaman pertama tampil cepat. |
| Hindari render berulang yang tidak perlu | Render percuma membuang daya perangkat, terutama di ponsel. |
| Gunakan `React.memo` bila diperlukan | Komponen yang tidak berubah tidak perlu digambar ulang. |
| Ambil seluruh data tahapan dalam satu request | Satu permintaan lebih hemat waktu dan beban server daripada banyak permintaan kecil. |
| Jangan melakukan request setiap mesh diklik | Popup harus tampil seketika tanpa menunggu jaringan. |

---

# 24. Security Rules

| Aturan | Kenapa |
| --- | --- |
| Validasi semua input | Data dari luar tidak boleh dipercaya apa adanya. |
| Sanitasi data sebelum disimpan | Mencegah teks berbahaya ikut tersimpan dan ditampilkan kembali. |
| Jangan hardcode secret key | Kunci yang tertulis di kode bisa terbaca siapa pun yang melihat repositori. |
| Gunakan environment variable | Rahasia tetap terpisah dari kode dan bisa diganti per lingkungan. |
| Validasi file upload | File berbahaya atau berukuran berlebihan bisa merusak server. |

---

# 25. AI Agent Rules

Saat menghasilkan kode, AI harus mengikuti aturan berikut.

| Aturan | Kenapa |
| --- | --- |
| Jangan mengubah struktur folder tanpa persetujuan | Struktur folder adalah kesepakatan tim; perubahan diam-diam merusak prediksi semua orang. |
| Jangan mengganti teknologi utama | Pertukaran teknologi besar (misal Drizzle → Prisma) berbiaya tinggi dan di luar wewenang AI. |
| Jangan memakai library lain bila fitur bisa dibuat dengan library yang sudah ada | Setiap dependensi baru menambah risalah keamanan dan pemeliharaan. |
| Jangan membuat kode duplikat | Kode ganda berarti dua tempat yang harus diperbaiki untuk satu masalah yang sama. |
| Selalu gunakan TypeScript dan Tailwind CSS | Konsistensi bahasa dan gaya sesuai keputusan proyek. |
| Rendering 3D AR dilakukan di `public/learn/ar.html` dengan A-Frame + MindAR; React Three Fiber tidak dipakai di produksi | Mengaktifkan kembali R3F berarti ada dua implementasi AR yang saling bertabrakan. |
| Selalu gunakan MindAR untuk image tracking | MindAR adalah engine tracking yang sudah dipilih dan teruji pada proyek ini. |
| Selalu gunakan Drizzle ORM dan Turso SQLite untuk database | Sesuai lapisan data yang sudah ada pada `db/`. |
| Selalu gunakan Route Handler untuk API dan Zod untuk validasi | Menjaga API konsisten dan aman. |
| Gunakan Zustand untuk global state bila benar-benar diperlukan | Menghindari penyebaran data di banyak tempat. |
| Pastikan kode modular, reusable, dan mudah dipelihara | Kode harus bisa dilanjutkan orang lain setelah AI selesai. |

---

# 26. Definition of Done

**Aturan:** Sebuah fitur dianggap selesai apabila:

- Berjalan sesuai kebutuhan.
- Tidak memiliki TypeScript Error.
- Tidak memiliki ESLint Error.
- Responsive.
- Mudah dipahami.
- Mengikuti struktur folder.
- Mengikuti seluruh Coding Guidelines.
- Siap diintegrasikan dengan fitur lain.

**Kenapa:** Daftar ini adalah kesepakatan "selesai" yang objektif, sehingga tidak ada fitur yang ditutup sementara masih menyisakan masalah tersembunyi.
