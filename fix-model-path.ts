import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { sdlcMethods } from "./db/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function fix() {
  console.log("Updating Agile modelPath...");
  
  await db
    .update(sdlcMethods)
    .set({ 
      modelPath: "https://models.byvictech.site/models/agile-new.glb",
      updatedAt: new Date()
    })
    .where(eq(sdlcMethods.slug, "agile"));

  console.log("✓ Updated!");
  process.exit(0);
}

fix();
