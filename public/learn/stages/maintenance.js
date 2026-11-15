/**
 * stages/maintenance.js — Model 3D tahap MAINTENANCE.
 *
 * Dipisah dari stage-models.js. Mendaftarkan builder ke registry global
 * STAGE_BUILDERS (dideklarasikan di stage-models.js — file ini WAJIB dimuat
 * SETELAH stage-models.js; lihat urutan <script> di ar.html).
 *
 * Dipakai showStageModel() → STAGE_BUILDERS[type]() saat mesh tahap diklik.
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */
    // 6. MAINTENANCE — dua roda gigi (besar + kecil)
   STAGE_BUILDERS.maintenance = function () {
    const parts = [];

    // ---------- util lokal (tidak mengubah helper global) ----------
    const f = (n) => n.toFixed(3);
    const P = (x, y, z) => f(x) + " " + f(y) + " " + f(z);

    const NAVY = "#0f172a";
    const PLATE = "#0b1b34";
    const PANEL = "#1e293b";
    const SCREEN = "#0b1220";
    const STEEL = "#475569";
    const METAL = "#64748b";
    const SILVER = "#94a3b8";
    const LIGHT = "#cbd5e1";
    const CYAN = "#22d3ee";
    const BLUE = "#3b82f6";
    const LINE = "#7dd3fc";
    const RED = "#ef4444";
    const GREEN = "#22c55e";

    // Entity dengan efek emissive (untuk indikator / aksen)
    const glow = (geometry, color, pos, extra, intensity) =>
        stageEntity(Object.assign({
            geometry: geometry,
            material: "color: " + color + "; emissive: " + color +
                "; emissiveIntensity: " + (intensity || 0.6),
            position: pos,
        }, extra || {}));

    // Bar tipis rata kiri (baris kode, progress bar, dsb.)
    const bar = (x0, y, w, h, color, z) =>
        stageBox(w, h, 0.008, color, P(x0 + w / 2, y, z));

    // Centang dari dua box
    const check = (cx, cy, color, s) => {
        parts.push(stageBox(0.028 * s, 0.01 * s, 0.01, color,
            P(cx - 0.01 * s, cy - 0.0075 * s, 0.04), { rotation: "0 0 -45" }));
        parts.push(stageBox(0.05 * s, 0.01 * s, 0.01, color,
            P(cx + 0.0175 * s, cy + 0.0025 * s, 0.04), { rotation: "0 0 45" }));
    };

    // Connector: garis tipis + titik di ujung objek
    const connector = (x1, y1, x2, y2) => {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        parts.push(stageBox(len, 0.008, 0.008, LINE,
            P((x1 + x2) / 2, (y1 + y2) / 2, 0.16),
            { rotation: "0 0 " + ang.toFixed(1) }));
        parts.push(glow("primitive: sphere; radius: 0.014", LINE, P(x2, y2, 0.16)));
    };

    // Label: backdrop navy + teks (di luar objek, tidak menempel di permukaan)
    // CATATAN: ganti dengan sistem label/billboard milik stage lain bila ada.
    const label = (text, x, y) => {
        const w = text.length * 0.034;
        parts.push(stageBox(w + 0.08, 0.085, 0.01, NAVY, P(x, y, 0.15)));
        parts.push(stageEntity({
            text: "value: " + text + "; align: center; anchor: center; baseline: center; " +
                "width: " + f(w) + "; wrapCount: " + (text.length + 2) + "; color: #ffffff",
            position: P(x, y, 0.162),
        }));
    };

    const pulse = (from, to, dur) =>
        "property: scale; from: " + from + "; to: " + to +
        "; dir: alternate; dur: " + dur + "; loop: true; easing: easeInOutSine";

    // ---------- posisi utama ----------
    const GX = 0, GY = 0.12;   // pusat gear
    const LX = -0.72;          // pusat laptop (Bug Fixing)
    const DX = 0.72;           // pusat dashboard (System Monitoring)

    // ---------- alas diorama ----------
    parts.push(stageBox(2.2, 1.46, 0.04, PLATE, P(0, -0.03, -0.08)));

    // ================= A. SYSTEM MAINTENANCE =================
    // Gigi (logika asli dipertahankan, dipusatkan di GY)
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        parts.push(stageBox(
            0.08, 0.08, 0.1, STEEL,
            P(GX + Math.cos(a) * 0.3, GY + Math.sin(a) * 0.3, 0),
            { rotation: "0 0 " + ((a * 180) / Math.PI).toFixed(1) }
        ));
    }
    // Badan gear
    parts.push(stageEntity({
        geometry: "primitive: torus; radius: 0.24; tube: 0.07",
        material: "color: " + METAL,
        position: P(GX, GY, 0),
    }));
    // Hub
    parts.push(stageEntity({
        geometry: "primitive: cylinder; radius: 0.08; height: 0.12",
        material: "color: " + LIGHT,
        position: P(GX, GY, 0.04),
        rotation: "90 0 0",
    }));
    parts.push(glow("primitive: cylinder; radius: 0.035; height: 0.14", CYAN,
        P(GX, GY, 0.04), { rotation: "90 0 0" }, 0.7));
    // Ring hijau tipis = sistem stabil
    parts.push(glow("primitive: torus; radius: 0.37; tube: 0.008", GREEN,
        P(GX, GY, 0.0), null, 0.7));

    // Kunci pas (wrench) mencengkeram gigi pada sudut 315 derajat
    parts.push(stageBox(0.04, 0.3, 0.03, SILVER, P(0.318, -0.198, 0.13),
        { rotation: "0 0 45" }));
    parts.push(stageEntity({
        geometry: "primitive: torus; radius: 0.055; tube: 0.017",
        material: "color: " + LIGHT,
        position: P(0.212, -0.092, 0.13),
    }));
    parts.push(stageEntity({
        geometry: "primitive: torus; radius: 0.025; tube: 0.01",
        material: "color: " + METAL,
        position: P(0.424, -0.304, 0.13),
    }));

    // ================= B. BUG FIXING =================
    parts.push(stageBox(0.46, 0.32, 0.03, PANEL, P(LX, 0, 0)));          // bezel
    parts.push(stageBox(0.42, 0.28, 0.01, SCREEN, P(LX, 0, 0.02)));      // layar
    parts.push(stageBox(0.52, 0.035, 0.14, STEEL, P(LX, -0.18, 0.04)));  // base

    // Baris code editor
    const cx0 = LX - 0.18;
    parts.push(bar(cx0, 0.11, 0.16, 0.018, CYAN, 0.032));
    parts.push(bar(cx0, 0.065, 0.24, 0.018, SILVER, 0.032));
    parts.push(bar(cx0, 0.02, 0.26, 0.018, RED, 0.032));      // baris error
    parts.push(bar(cx0, -0.025, 0.22, 0.018, GREEN, 0.032));  // baris sudah diperbaiki
    parts.push(bar(cx0, -0.07, 0.14, 0.018, SILVER, 0.032));
    parts.push(bar(cx0, -0.115, 0.2, 0.018, STEEL, 0.032));

    // Simbol bug (error) di ujung baris merah
    parts.push(glow("primitive: sphere; radius: 0.028", RED, P(LX + 0.15, 0.02, 0.045),
        { animation: pulse("1 1 1", "1.35 1.35 1.35", 700) }, 0.8));
    parts.push(stageBox(0.08, 0.008, 0.008, RED, P(LX + 0.15, 0.02, 0.045),
        { rotation: "0 0 35" }));
    parts.push(stageBox(0.08, 0.008, 0.008, RED, P(LX + 0.15, 0.02, 0.045),
        { rotation: "0 0 -35" }));
    // Centang hijau di baris yang sudah benar
    check(LX + 0.12, -0.025, GREEN, 1);

    // ================= C. SYSTEM MONITORING =================
    parts.push(stageBox(0.46, 0.4, 0.03, PANEL, P(DX, 0.12, 0)));        // frame
    parts.push(stageBox(0.42, 0.36, 0.01, SCREEN, P(DX, 0.12, 0.02)));   // layar
    parts.push(stageBox(0.05, 0.1, 0.03, STEEL, P(DX, -0.13, 0)));       // tiang
    parts.push(stageBox(0.24, 0.025, 0.1, STEEL, P(DX, -0.185, 0.03)));  // alas

    // Header: LED hijau + judul
    parts.push(glow("primitive: sphere; radius: 0.018", GREEN, P(DX - 0.17, 0.26, 0.04),
        { animation: pulse("1 1 1", "1.4 1.4 1.4", 900) }, 0.9));
    parts.push(bar(DX - 0.13, 0.26, 0.16, 0.014, CYAN, 0.032));

    // CPU usage (45%) dan uptime (92%)
    parts.push(bar(DX - 0.18, 0.19, 0.36, 0.03, PANEL, 0.032));
    parts.push(bar(DX - 0.18, 0.19, 0.36 * 0.45, 0.03, GREEN, 0.04));
    parts.push(bar(DX - 0.18, 0.13, 0.36, 0.03, PANEL, 0.032));
    parts.push(bar(DX - 0.18, 0.13, 0.36 * 0.92, 0.03, CYAN, 0.04));

    // Grafik performa
    const heights = [0.04, 0.07, 0.05, 0.09, 0.1];
    for (let i = 0; i < heights.length; i++) {
        parts.push(stageBox(
            0.04, heights[i], 0.008,
            i === heights.length - 1 ? GREEN : (i === 2 ? BLUE : CYAN),
            P(DX - 0.16 + i * 0.055, -0.04 + heights[i] / 2, 0.034)
        ));
    }

    // Status OK
    parts.push(glow("primitive: cylinder; radius: 0.045; height: 0.01", GREEN,
        P(DX + 0.14, 0.01, 0.034), { rotation: "90 0 0" }, 0.7));
    check(DX + 0.14, 0.01, "#f8fafc", 0.9);

    // ================= D. SOFTWARE UPDATE =================
    const UX = -0.06, UY = -0.47;
    parts.push(stageBox(0.22, 0.16, 0.1, "#1e40af", P(UX, UY, 0)));      // paket
    parts.push(stageBox(0.04, 0.16, 0.105, CYAN, P(UX, UY, 0)));         // pita
    parts.push(glow("primitive: sphere; radius: 0.02", GREEN, P(UX + 0.09, UY + 0.06, 0.06))); // sudah update

    // Download arrow (naik-turun ringan)
    parts.push(stageBox(0.03, 0.06, 0.03, CYAN, P(UX, -0.30, 0.03),
        { animation: "property: position; from: " + P(UX, -0.30, 0.03) + "; to: " +
            P(UX, -0.325, 0.03) + "; dir: alternate; dur: 900; loop: true; easing: easeInOutSine" }));
    parts.push(glow("primitive: cone; radiusBottom: 0.04; radiusTop: 0; height: 0.05", CYAN,
        P(UX, -0.355, 0.03),
        { rotation: "0 0 180",
          animation: "property: position; from: " + P(UX, -0.355, 0.03) + "; to: " +
            P(UX, -0.38, 0.03) + "; dir: alternate; dur: 900; loop: true; easing: easeInOutSine" }));

    // Ikon update (panah melingkar)
    parts.push(glow("primitive: torus; radius: 0.07; tube: 0.012; arc: 270", CYAN,
        P(0.2, UY, 0.04)));
    parts.push(glow("primitive: cone; radiusBottom: 0.028; radiusTop: 0; height: 0.05", CYAN,
        P(0.2, UY - 0.07, 0.04), { rotation: "0 0 -90" }));

    // Progress bar update (75%)
    parts.push(bar(UX - 0.13, -0.585, 0.26, 0.025, PANEL, 0.03));
    parts.push(bar(UX - 0.13, -0.585, 0.26 * 0.75, 0.025, CYAN, 0.038));

    // ================= ALUR (Monitoring -> Bug Fixing -> Update) =================
    const cone = "primitive: cone; radiusBottom: 0.03; radiusTop: 0; height: 0.06";
    parts.push(glow(cone, CYAN, P(0.43, 0, 0.05), { rotation: "0 0 90" }));
    parts.push(glow(cone, CYAN, P(-0.43, 0, 0.05), { rotation: "0 0 90" }));
    parts.push(glow(cone, CYAN, P(-0.3, UY, 0.05), { rotation: "0 0 -90" }));

    // ================= LABEL + CONNECTOR =================
    label("System Maintenance", GX, 0.62);
    connector(GX, 0.577, GX, 0.495);

    label("Bug Fixing", LX, 0.46);
    connector(LX, 0.418, LX, 0.165);

    label("System Monitoring", DX, 0.46);
    connector(DX, 0.418, DX, 0.325);

    label("Software Update", 0.75, -0.55);
    connector(0.455, -0.55, 0.285, -0.49);

    return stageWrap(parts);
};
