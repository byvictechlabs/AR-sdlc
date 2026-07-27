import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
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

  const [category] = await db
    .insert(schema.categories)
    .values({
      name: "Software Engineering",
      slug: "software-engineering",
      description: "SDLC methods and software development processes",
      sortOrder: 1,
    })
    .returning()
    .onConflictDoNothing()
    .execute();

  const [method] = await db
    .insert(schema.sdlcMethods)
    .values({
      name: "Waterfall",
      slug: "waterfall",
      description:
        "A linear sequential software development life cycle model where each phase must be completed before the next phase begins.",
      modelPath: "/models/waterfall.glb",
      markerPath: "/markers/waterfall.png",
      categoryId: category?.id,
      status: "published",
      sortOrder: 1,
    })
    .returning()
    .onConflictDoNothing()
    .execute();

  if (method) {
    const waterfallSteps = [
      {
        meshName: "WF_REQUIREMENTS",
        title: "Requirements",
        description:
          "Tahap pengumpulan dan analisis kebutuhan sistem. Tim mengidentifikasi apa yang dibutuhkan pengguna dan mendokumentasikan persyaratan sistem secara lengkap.",
        stepOrder: 1,
      },
      {
        meshName: "WF_DESIGN",
        title: "Design",
        description:
          "Tahap perancangan sistem berdasarkan persyaratan yang telah dikumpulkan. Mencakup arsitektur sistem, desain basis data, dan desain antarmuka.",
        stepOrder: 2,
      },
      {
        meshName: "WF_IMPLEMENTATION",
        title: "Implementation",
        description:
          "Tahap implementasi kode program. Tim developer mulai menulis kode sesuai dengan desain yang telah dibuat.",
        stepOrder: 3,
      },
      {
        meshName: "WF_TESTING",
        title: "Testing",
        description:
          "Tahap pengujian untuk memastikan sistem berfungsi sesuai persyaratan. Dilakukan berbagai jenis pengujian seperti unit test, integration test, dan system test.",
        stepOrder: 4,
      },
      {
        meshName: "WF_DEPLOYMENT",
        title: "Deployment",
        description:
          "Tahap penyebaran sistem ke lingkungan produksi. Sistem mulai digunakan oleh pengguna akhir.",
        stepOrder: 5,
      },
      {
        meshName: "WF_MAINTENANCE",
        title: "Maintenance",
        description:
          "Tahap pemeliharaan sistem setelah deployment. Meliputi perbaikan bug, update fitur, dan optimasi performa.",
        stepOrder: 6,
      },
    ];

    for (const step of waterfallSteps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: method.id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  const [agileMethod] = await db
    .insert(schema.sdlcMethods)
    .values({
      name: "Agile",
      slug: "agile",
      description:
        "An iterative approach to software development that focuses on collaboration, flexibility, and delivering working software in short cycles called sprints.",
      modelPath: "/models/agile.glb",
      markerPath: "/markers/agile.png",
      categoryId: category?.id,
      status: "published",
      sortOrder: 2,
    })
    .returning()
    .onConflictDoNothing()
    .execute();

  if (agileMethod) {
    const agileSteps = [
      {
        meshName: "AG_PLANNING",
        title: "Sprint Planning",
        description:
          "Tahap perencanaan sprint di mana tim menentukan tujuan sprint dan memilih item dari product backlog yang akan dikerjakan selama sprint.",
        stepOrder: 1,
      },
      {
        meshName: "AG_DAILY",
        title: "Daily Standup",
        description:
          "Pertemuan harian singkat di mana setiap anggota tim berbagi progress, rencana hari ini, dan hambatan yang dihadapi.",
        stepOrder: 2,
      },
      {
        meshName: "AG_REVIEW",
        title: "Sprint Review",
        description:
          "Tahap demonstrasi hasil kerja sprint kepada stakeholder. Tim menunjukkan fitur yang telah selesai dan menerima feedback.",
        stepOrder: 3,
      },
      {
        meshName: "AG_RETRO",
        title: "Sprint Retrospective",
        description:
          "Tahap refleksi di mana tim mengevaluasi proses kerja selama sprint dan mengidentifikasi area untuk perbaikan.",
        stepOrder: 4,
      },
    ];

    for (const step of agileSteps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: agileMethod.id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  const [radMethod] = await db
    .insert(schema.sdlcMethods)
    .values({
      name: "RAD",
      slug: "rad",
      description:
        "Rapid Application Development is a type of incremental software development model that focuses on rapid prototyping and iterative delivery.",
      modelPath: "/models/rad.glb",
      markerPath: "/markers/rad.png",
      categoryId: category?.id,
      status: "published",
      sortOrder: 3,
    })
    .returning()
    .onConflictDoNothing()
    .execute();

  if (radMethod) {
    const radSteps = [
      {
        meshName: "RAD_REQUIREMENT",
        title: "Requirement Planning",
        description:
          "Tahap identifikasi kebutuhan proyek secara awal. Stakeholder dan developer mendiskusikan kebutuhan sistem dalam waktu singkat.",
        stepOrder: 1,
      },
      {
        meshName: "RAD_DESIGN",
        title: "User Design",
        description:
          "Tahap desain prototipe interaktif yang melibatkan pengguna akhir. Prototipe terus dimodifikasi berdasarkan feedback pengguna.",
        stepOrder: 2,
      },
      {
        meshName: "RAD_CONSTRUCTION",
        title: "Construction",
        description:
          "Tahap pembangunan sistem final berdasarkan prototipe yang telah divalidasi. Pengembangan dilakukan secara cepat dengan tools otomatisasi.",
        stepOrder: 3,
      },
      {
        meshName: "RAD_CUTOVER",
        title: "Cutover",
        description:
          "Tahap penyebaran sistem ke lingkungan produksi. Sistem yang telah selesai diuji dan diimplementasikan untuk pengguna akhir.",
        stepOrder: 4,
      },
    ];

    for (const step of radSteps) {
      await db
        .insert(schema.methodSteps)
        .values({ methodId: radMethod.id, ...step })
        .onConflictDoNothing()
        .execute();
    }
  }

  console.log("Seed completed.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
