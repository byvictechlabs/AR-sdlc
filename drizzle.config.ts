import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
