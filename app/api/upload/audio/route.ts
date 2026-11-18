import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

// GET /api/upload/audio
// Menyiapkan parameter upload Cloudinary untuk admin yang sudah login.
// Browser mengunggah file LANGSUNG ke Cloudinary (bukan lewat server Vercel)
// supaya file besar tidak kena batas body request Vercel (~4,5 MB).
//
// Dua mode yang didukung:
// 1. Unsigned preset (CLOUDINARY_UPLOAD_PRESET terisi) — dipakai lebih dulu.
//    Cocok ketika API key Cloudinary bersifat restricted (tanpa izin create).
// 2. Signed upload (fallback) — memakai CLOUDINARY_URL + tanda tangan SHA-1.
const UPLOAD_FOLDER = "sdlc-ar/audio";
const ALLOWED_FORMATS = "mp3,wav,ogg,m4a,aac";

function getCloudinaryConfig() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;

  try {
    // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
    const url = new URL(raw);
    const cloudName = url.hostname;
    const apiKey = decodeURIComponent(url.username);
    const apiSecret = decodeURIComponent(url.password);

    if (!cloudName) return null;
    return { cloudName, apiKey, apiSecret };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = getCloudinaryConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Cloudinary belum dikonfigurasi. Isi CLOUDINARY_URL di environment." },
        { status: 500 }
      );
    }

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

    // Mode 1 — unsigned preset (tidak perlu tanda tangan / API secret)
    if (uploadPreset) {
      return NextResponse.json({
        mode: "unsigned",
        cloudName: config.cloudName,
        uploadPreset,
      });
    }

    // Mode 2 — signed upload
    if (!config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary belum dikonfigurasi dengan benar (CLOUDINARY_URL)." },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Parameter diurutkan alfabetis: allowed_formats, folder, timestamp
    const signature = createHash("sha1")
      .update(
        `allowed_formats=${ALLOWED_FORMATS}&folder=${UPLOAD_FOLDER}&timestamp=${timestamp}${config.apiSecret}`
      )
      .digest("hex");

    return NextResponse.json({
      mode: "signed",
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      timestamp,
      folder: UPLOAD_FOLDER,
      allowedFormats: ALLOWED_FORMATS,
      signature,
    });
  } catch (error) {
    return handleApiError(error, "create audio upload signature");
  }
}
