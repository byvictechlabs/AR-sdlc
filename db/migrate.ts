import "dotenv/config";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { resolve } from "path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
    process.exit(1);
  }

  console.log("Connecting to:", url.substring(0, 40) + "...");

  const client = createClient({ url, authToken: token });
  const db = drizzle(client);

  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "./migrations"),
  });

  console.log("Migrations completed.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
