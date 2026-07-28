import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
    process.exit(1);
  }

  console.log("Connecting to:", url.substring(0, 40) + "...");

  const client = createClient({ url, authToken: token });
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  const passwordHash = await bcryptjs.hash("admin123", 12);

  await db
    .insert(schema.users)
    .values({
      name: "Super Admin",
      email: "admin@sdlc-ar.com",
      passwordHash,
      role: "super_admin",
    })
    .onConflictDoNothing();

  const methodsData = [
    {
      name: "Waterfall",
      slug: "waterfall",
      description:
        "A linear sequential software development life cycle model where each phase must be completed before the next phase begins.",
      modelPath: "/models/waterfall.glb",
      markerPath: "/markers/waterfall.png",
      status: "published" as const,
      sortOrder: 1,
    },
    {
      name: "Agile",
      slug: "agile",
      description:
        "An iterative approach to software development that focuses on collaboration, flexibility, and delivering working software in short cycles called sprints.",
      modelPath: "/models/agile.glb",
      markerPath: "/markers/agile.png",
      status: "published" as const,
      sortOrder: 2,
    },
    {
      name: "RAD",
      slug: "rad",
      description:
        "Rapid Application Development is a type of incremental software development model that focuses on rapid prototyping and iterative delivery.",
      modelPath: "/models/rad.glb",
      markerPath: "/markers/rad.png",
      status: "published" as const,
      sortOrder: 3,
    },
  ];

  for (const m of methodsData) {
    await db.insert(schema.sdlcMethods).values(m).onConflictDoNothing().execute();
  }

  const waterfall = await db.select().from(schema.sdlcMethods).where(eq(schema.sdlcMethods.slug, "waterfall")).limit(1);
  const agile = await db.select().from(schema.sdlcMethods).where(eq(schema.sdlcMethods.slug, "agile")).limit(1);
  const rad = await db.select().from(schema.sdlcMethods).where(eq(schema.sdlcMethods.slug, "rad")).limit(1);

  if (waterfall[0]) {
    const steps = [
      {
        meshName: "WF_REQUIREMENTS",
        title: "Requirements",
        description: "Tahap pengumpulan dan analisis kebutuhan sistem.",
        content: "Pada tahap Requirements, tim pengembang bekerja sama dengan stakeholder untuk mengidentifikasi dan mendokumentasikan semua kebutuhan sistem. Proses ini meliputi wawancara pengguna, observasi lapangan, analisis dokumentasi yang ada, serta pembuatan dokumen formal seperti Software Requirements Specification (SRS). Hasil dari tahap ini menjadi dasar untuk seluruh siklus pengembangan.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 1,
      },
      {
        meshName: "WF_DESIGN",
        title: "Design",
        description: "Tahap perancangan sistem berdasarkan persyaratan yang telah dikumpulkan.",
        content: "Tahap Design mengubah kebutuhan yang telah terkumpul menjadi rancangan sistem. Tim merancang arsitektur sistem, struktur database, antarmuka pengguna (UI/UX), dan komponen perangkat lunak. Dokumen yang dihasilkan meliputi High-Level Design (HLD), Low-Level Design (LLD), diagram ERD, dan wireframe. Setiap elemen dirancang untuk memenuhi persyaratan fungsional dan non-fungsional.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 2,
      },
      {
        meshName: "WF_IMPLEMENTATION",
        title: "Implementation",
        description: "Tahap implementasi kode program berdasarkan desain yang telah dibuat.",
        content: "Pada tahap Implementation, para developer mulai menulis kode program sesuai dengan spesifikasi dan desain yang telah ditetapkan. Proses coding mengikuti standar dan guideline yang berlaku, termasuk penulisan kode yang bersih, terdokumentasi, dan mudah dipelihara. Setiap modul dikembangkan dan diuji secara individual sebelum diintegrasikan ke dalam sistem utama.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 3,
      },
      {
        meshName: "WF_TESTING",
        title: "Testing",
        description: "Tahap pengujian untuk memastikan sistem berfungsi sesuai persyaratan.",
        content: "Tahap Testing bertujuan untuk memverifikasi dan memvalidasi bahwa sistem yang telah dikembangkan memenuhi semua persyaratan yang telah ditetapkan. Jenis pengujian yang dilakukan meliputi unit testing, integration testing, system testing, dan acceptance testing. Bug dan defect yang ditemukan dicatat dan diperbaiki sebelum sistem diserahkan ke pengguna.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 4,
      },
      {
        meshName: "WF_DEPLOYMENT",
        title: "Deployment",
        description: "Tahap penyebaran sistem ke lingkungan produksi.",
        content: "Tahap Deployment meliputi proses instalasi dan penyebaran sistem ke lingkungan produksi yang sebenarnya. Tim memastikan semua komponen berfungsi dengan baik di lingkungan production, termasuk konfigurasi server, migrasi data, dan pengaturan jaringan. Pengguna akhir mulai menggunakan sistem dan dokumentasi pelatihan diserahkan.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 5,
      },
      {
        meshName: "WF_MAINTENANCE",
        title: "Maintenance",
        description: "Tahap pemeliharaan sistem setelah deployment.",
        content: "Tahap Maintenance adalah fase terakhir yang berlangsung terus-menerus setelah sistem di-deploy. Kegiatan meliputi perbaikan bug yang ditemukan oleh pengguna, penambahan fitur baru sesuai kebutuhan, optimasi performa sistem, dan pembaruan keamanan. Tim memantau sistem secara berkala dan memberikan dukungan teknis kepada pengguna.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 6,
      },
    ];

    for (const step of steps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: waterfall[0].id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  if (agile[0]) {
    const steps = [
      {
        meshName: "AG_PLANNING",
        title: "Sprint Planning",
        description: "Tahap perencanaan sprint di mana tim menentukan tujuan sprint.",
        content: "Sprint Planning adalah pertemuan pertama di awal setiap sprint. Tim bersama Product Owner mendefinisikan tujuan sprint dan memilih item-item dari Product Backlog yang akan dikerjakan. Estimasi dilakukan menggunakan teknik seperti story point atau time estimation. Hasilnya adalah Sprint Backlog yang berisi daftar tugas siap kerja untuk sprint yang akan datang.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 1,
      },
      {
        meshName: "AG_DAILY",
        title: "Daily Standup",
        description: "Pertemuan harian singkat untuk berbagi progress dan hambatan.",
        content: "Daily Standup (atau Daily Scrum) adalah pertemuan singkat berdurasi maksimal 15 menit yang diadakan setiap hari di awal jam kerja. Setiap anggota tim menjawab tiga pertanyaan: Apa yang sudah saya kerjakan kemarin? Apa yang akan saya kerjakan hari ini? Apa hambatan yang saya hadapi? Pertemuan ini memastikan koordinasi tim tetap berjalan efektif.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 2,
      },
      {
        meshName: "AG_REVIEW",
        title: "Sprint Review",
        description: "Tahap demonstrasi hasil kerja sprint kepada stakeholder.",
        content: "Sprint Review diadakan di akhir sprint untuk mendemonstrasikan hasil kerja yang telah selesai kepada stakeholder dan Product Owner. Tim menunjukkan fitur-fitur baru yang telah berfungsi dan menerima feedback langsung. Feedback ini menjadi masukan berharga untuk perencanaan sprint berikutnya dan penyesuaian Product Backlog.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 3,
      },
      {
        meshName: "AG_RETRO",
        title: "Sprint Retrospective",
        description: "Tahap refleksi untuk mengevaluasi proses kerja selama sprint.",
        content: "Sprint Retrospective adalah pertemuan internal tim setelah Sprint Review. Tim mendiskusikan apa yang berjalan baik, apa yang perlu diperbaiki, dan tindakan konkret untuk peningkatan di sprint berikutnya. Aktivitas seperti Start-Stop-Continue atau Mad-Sad-Glad digunakan untuk memfasilitasi diskusi. Tujuannya adalah continuous improvement dalam proses tim.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 4,
      },
    ];

    for (const step of steps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: agile[0].id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  if (rad[0]) {
    const steps = [
      {
        meshName: "RAD_REQUIREMENT",
        title: "Requirement Planning",
        description: "Tahap identifikasi kebutuhan proyek secara awal.",
        content: "Requirement Planning dalam RAD adalah tahap awal di mana stakeholder dan pengembang melakukan brainstorming untuk mengidentifikasi kebutuhan proyek. Berbeda dengan Waterfall, tahap ini dilakukan secara singkat dan fokus pada kebutuhan inti. Tim membuat daftar kebutuhan utama tanpa terlalu mendetail, karena detail akan dikembangkan melalui prototipe interaktif.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 1,
      },
      {
        meshName: "RAD_DESIGN",
        title: "User Design",
        description: "Tahap desain prototipe interaktif dengan feedback pengguna.",
        content: "User Design adalah tahap kunci dalam RAD di mana pengembang dan pengguna akhir bekerja sama secara intensif untuk mendesain prototipe. Prototipe ini terus dimodifikasi berdasarkan feedback langsung dari pengguna. Pendekatan ini memungkinkan identifikasi masalah dan perubahan kebutuhan secara dini, sehingga mengurangi risiko kesalahan desain yang costly.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 2,
      },
      {
        meshName: "RAD_CONSTRUCTION",
        title: "Construction",
        description: "Tahap pembangunan sistem final dengan tools otomatisasi.",
        content: "Construction adalah tahap di mana prototipe yang telah divalidasi dikembangkan menjadi sistem production-ready. Pengembangan dilakukan secara cepat menggunakan rapid application development tools, code generators, dan framework yang mempercepat proses coding. Iterasi pembangunan dilakukan dalam siklus pendek untuk memastikan kualitas tetap terjaga.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 3,
      },
      {
        meshName: "RAD_CUTOVER",
        title: "Cutover",
        description: "Tahap penyebaran sistem ke lingkungan produksi.",
        content: "Cutover adalah tahap akhir di mana sistem yang telah selesai dibangun dan diuji disebarkan ke lingkungan produksi. Proses ini meliputi migrasi data, pelatihan pengguna, dan transisi dari sistem lama ke sistem baru. Tim memastikan tidak ada gangguan terhadap operasi bisnis selama proses transisi berlangsung.",
        imageUrl: null,
        audioUrl: null,
        stepOrder: 4,
      },
    ];

    for (const step of steps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: rad[0].id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  const stepsCount = await db.select().from(schema.methodSteps);
  console.log(`Seed completed. Total steps: ${stepsCount.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
