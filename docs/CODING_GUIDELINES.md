
# Coding Guidelines

# AR SDLC Learning Media

Version: 1.0

---

# 1. General Principles

Semua kode harus mengikuti prinsip berikut:

- Clean Code
- SOLID Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Separation of Concerns
- Reusable Components
- Type Safety
- Readability over Cleverness

---

# 2. Language

Gunakan:

- TypeScript

Jangan gunakan:

- JavaScript (.js)

Semua file menggunakan:

```
.ts
.tsx
```

---

# 3. Framework

Gunakan

- Next.js App Router

Jangan gunakan

- Pages Router

---

# 4. Styling

Gunakan

- Tailwind CSS
- shadcn

Tidak diperbolehkan

- Bootstrap
- Bulma
- Material UI
- Inline CSS

---

# 5. Component Rules

Gunakan Functional Component.

Contoh

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

Jangan gunakan

```tsx
class Button extends React.Component
```

---

# 6. File Naming

Gunakan PascalCase

```
MethodCard.tsx

AudioPlayer.tsx

DetailModal.tsx
```

Hooks

```
useAudio.ts

useRaycaster.ts
```

Utility

```
formatTime.ts

getMeshName.ts
```

---

# 7. Folder Responsibilities

app/

Routing

components/

Reusable Components

ar/

MindAR + Three.js

db/

Database

services/

Business Logic

hooks/

Custom Hooks

lib/

Configuration

types/

Type Definition

utils/

Helper Functions

---

# 8. TypeScript Rules

Tidak boleh menggunakan

```ts
any
```

Gunakan interface atau type.

Contoh

```ts
interface MethodStep {

    id:number

    meshName:string

    title:string

}
```

---

# 9. React Rules

Gunakan

- useState
- useEffect
- useMemo
- useCallback

Jika state digunakan lintas halaman gunakan

- Zustand

---

# 10. State Management

Global State

Menggunakan

- Zustand

Jangan gunakan

- Redux

---

# 11. Validation

Semua request API wajib menggunakan

- Zod

Contoh

```ts
const schema = z.object({

    title:z.string(),

    description:z.string()

})
```

---

# 12. Database

ORM

- Drizzle ORM

Database

- Turso SQLite

Tidak menggunakan

- Prisma

---

# 13. API Rules

Gunakan

Next.js Route Handler

```
app/api/
```

Semua endpoint harus

- Validate Request
- Try Catch
- Return JSON
- Return HTTP Status

Contoh

```
200

201

400

404

500
```

---

# 14. Error Handling

Semua async function wajib

```ts
try{

}catch(error){

}
```

Tidak boleh membiarkan Promise tanpa error handling.

---

# 15. AR Rules

Semua logic AR ditempatkan pada

```
ar/
```

Jangan mencampur kode Three.js dengan UI React.

Gunakan

- React Three Fiber
- MindAR

---

# 16. Mesh Naming Rules

Nama mesh harus konsisten.

Waterfall

```
WF_REQUIREMENTS

WF_DESIGN

WF_IMPLEMENTATION

WF_TESTING

WF_DEPLOYMENT

WF_MAINTENANCE
```

Agile

```
AG_PLANNING

AG_DAILY

AG_REVIEW

AG_RETRO
```

RAD

```
RAD_REQUIREMENT

RAD_DESIGN

RAD_CONSTRUCTION

RAD_CUTOVER
```

Mesh Name tidak boleh diubah melalui dashboard admin.

---

# 17. Asset Rules

Model 3D

```
public/models
```

Marker

```
public/markers
```

Audio

```
public/audio
```

---

# 18. Import Rules

Gunakan absolute import bila memungkinkan.

Contoh

```ts
import AudioPlayer from "@/components/audio/AudioPlayer";
```

Hindari

```ts
../../../components
```

---

# 19. Naming Convention

Variable

camelCase

```
selectedStep

currentMethod
```

Constant

UPPER_CASE

```
DEFAULT_METHOD

API_URL
```

Component

PascalCase

```
MethodCard
```

Type

PascalCase

```
Method

MethodStep
```

---

# 20. Async Rules

Gunakan

async/await

Jangan gunakan

then()

Contoh

```ts
const methods = await getMethods();
```

---

# 21. Comment Rules

Komentar hanya digunakan apabila logika cukup kompleks.

Jangan memberi komentar yang menjelaskan hal yang sudah jelas.

Buruk

```ts
// Increment counter

counter++;
```

Baik

```ts
// Raycaster digunakan untuk menentukan mesh yang diklik
```

---

# 22. Git Rules

Branch

```
feature/

fix/

refactor/
```

Commit

Gunakan Conventional Commit

```
feat:

fix:

docs:

style:

refactor:

chore:
```

Contoh

```
feat: add AR scan page

fix: resolve mesh click detection

docs: update architecture

refactor: simplify audio player
```

---

# 23. Performance Rules

- Lazy load model GLB.
- Hindari render berulang yang tidak diperlukan.
- Gunakan React.memo bila diperlukan.
- Ambil seluruh data tahapan dalam satu request.
- Jangan melakukan request setiap mesh diklik.

---

# 24. Security Rules

- Validasi semua input.
- Sanitasi data sebelum disimpan.
- Jangan hardcode secret key.
- Gunakan environment variable.
- Validasi file upload audio.

---

# 25. AI Agent Rules

Saat menghasilkan kode, AI harus mengikuti aturan berikut:

- Jangan mengubah struktur folder tanpa persetujuan.
- Jangan mengganti teknologi utama.
- Jangan menggunakan library lain jika fitur dapat dibuat dengan library yang sudah dipilih.
- Jangan membuat kode duplikat.
- Selalu gunakan TypeScript.
- Selalu gunakan Tailwind CSS.
- Selalu gunakan React Three Fiber untuk rendering 3D.
- Selalu gunakan MindAR untuk image tracking.
- Selalu gunakan Drizzle ORM untuk database.
- Selalu gunakan Turso SQLite sebagai database.
- Selalu gunakan Route Handler untuk API.
- Selalu gunakan Zod untuk validasi.
- Gunakan Zustand untuk global state.
- Pastikan kode modular, reusable, dan mudah dipelihara.

---

# 26. Definition of Done

Sebuah fitur dianggap selesai apabila:

- Berjalan sesuai kebutuhan.
- Tidak memiliki TypeScript Error.
- Tidak memiliki ESLint Error.
- Responsive.
- Mudah dipahami.
- Mengikuti struktur folder.
- Mengikuti seluruh Coding Guidelines.
- Siap diintegrasikan dengan fitur lain.
