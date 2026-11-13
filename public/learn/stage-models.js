/**
 * stage-models.js — Model 3D detail per tahap (Stage Model).
 *
 * DIPISAH dari ar.html. Berisi:
 *   - detectStageType()       deteksi tipe tahap dari nama mesh / judul
 *   - STAGE_BUILDERS          7 model prosedural (requirements, design, coding,
 *                             testing, deployment, maintenance, review)
 *   - showStageModel()        tampilkan model tahap (GLB R2 → hardcode → fallback)
 *   - hideStageModel()        kembalikan ke model utama
 *   - activateStageSwap()     sembunyikan model utama, posisikan model tahap
 *   - fitStageGltf()          auto-fit skala/posisi GLB apapun
 *   - showStageCTA() / hideStageCTA() / openDetailFromStage()  tombol aksi
 *
 * Dipanggil global oleh ar.html:
 *   handleClick()   → showStageModel() + showStageCTA()
 *   openPopup()     → hideStageCTA()
 *   closePopup()    → showStageCTA() bila stageStep masih ada
 *   targetLost()    → closePopup() + hideStageModel()
 *
 * Ketergantungan runtime (ada di ar.html):
 *   FIT_SIZE, AFRAME, resetView(), openPopup(),
 *   variabel stageToken & stageStep (dideklarasikan di file ini).
 */
// ================= STAGE 3D (model detail per tahap) =================
// Saat mesh tahap diklik, model utama disembunyikan dan DIGANTIKAN oleh
// model 3D tahapan tersebut di atas marker (popup teks tetap di bawah).
// Dua sumber model, urutan prioritas:
//  1. GLB dari database  → step.stageModelUrl (file di R2, diisi via admin)
//  2. Model hardcode     → bawaan ar.html per jenis tahap (requirements,
//     design, coding, testing, deployment, maintenance, review)
// Kalau dua-duanya tidak ada → tampilan normal (model utama tetap terlihat).
let stageToken = 0;   // dinaikkan saat keluar mode tahap → membatalkan proses async
let stageStep = null; // step yang model tahapnya sedang tampil (mode tahap aktif)

// ===== Tombol aksi (CTA) — muncul setelah model tahap tampil =====
function showStageCTA() {
    const cta = document.getElementById("stage-cta");
    if (cta) cta.classList.remove("hidden");
}
function hideStageCTA() {
    const cta = document.getElementById("stage-cta");
    if (cta) cta.classList.add("hidden");
}
// Dari tombol "📋 Lihat Penjelasan" → buka popup detail (teks + TTS)
function openDetailFromStage() {
    if (stageStep) openPopup(stageStep);
}

function detectStageType(meshName) {
    const n = String(meshName || "").toUpperCase();
    if (/MAINTENANCE/.test(n)) return "maintenance";
    if (/REVIEW|FEEDBACK/.test(n)) return "review";
    if (/DEPLOY|CUTOVER|LAUNCH|RELEASE/.test(n)) return "deployment";
    if (/TEST/.test(n)) return "testing";
    if (/IMPLEMENT|DEVELOP|CONSTRUCTION|CODING/.test(n)) return "coding";
    if (/DESIGN/.test(n)) return "design";
    if (/REQUIREMENT|ANALYS|PLANN/.test(n)) return "requirements";
    return null;
}

function stageEntity(attrs) {
    const el = document.createElement("a-entity");
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function stageBox(w, h, d, color, position, extra) {
    return stageEntity(Object.assign({
        geometry: "primitive: box; width: " + w + "; height: " + h + "; depth: " + d,
        material: "color: " + color + "; roughness: 0.6",
        position: position,
    }, extra || {}));
}

// Pembungkus wajib: platform dasar + grup berputar pelan (turntable)
function stageWrap(children) {
    const g = stageEntity({
        animation: "property: rotation; to: 0 360 0; loop: true; dur: 16000; easing: linear",
    });
    g.appendChild(stageEntity({
        geometry: "primitive: cylinder; radius: 0.6; height: 0.05",
        material: "color: #e2e8f0; roughness: 0.85",
        position: "0 -0.5 0",
    }));
    children.forEach((c) => g.appendChild(c));
    return g;
}

const STAGE_BUILDERS = {
    // 1. REQUIREMENTS — papan klip dokumen + kaca pembesar
    requirements: function () {
        return stageWrap([
            stageBox(0.5, 0.65, 0.05, "#f8fafc", "0 0.06 0"),
            stageBox(0.18, 0.09, 0.07, "#2563eb", "0 0.42 0.01"),
            stageBox(0.32, 0.035, 0.06, "#93c5fd", "-0.03 0.2 0.01"),
            stageBox(0.32, 0.035, 0.06, "#93c5fd", "-0.03 0.1 0.01"),
            stageBox(0.2, 0.035, 0.06, "#93c5fd", "-0.09 0 0.01"),
            stageBox(0.1, 0.03, 0.06, "#16a34a", "0.13 -0.12 0.01", { rotation: "0 0 40" }),
            stageBox(0.16, 0.03, 0.06, "#16a34a", "0.16 -0.17 0.01", { rotation: "0 0 -45" }),
            stageEntity({
                geometry: "primitive: torus; radius: 0.13; tube: 0.03",
                material: "color: #475569; roughness: 0.4",
                position: "0.34 -0.26 0.1",
            }),
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.025; height: 0.18",
                material: "color: #334155",
                position: "0.44 -0.37 0.1",
                rotation: "0 0 -45",
            }),
        ]);
    },
    // 2. DESIGN — meja blueprint + kubus wireframe + pensil
    design: function () {
        // ============================================================
        //  SYSTEM DESIGN DIORAMA (Waterfall - tahap Design)
        //  Zona: UI/UX (kiri-belakang), Database (kanan-belakang),
        //        Mockup (kiri-depan), Arsitektur (kanan-depan)
        // ============================================================
        var S = 1;          // skala keseluruhan diorama (kecilkan bila terlalu besar, mis. 0.7)
        var Y0 = -0.36;     // permukaan lantai zona (di atas platform)
        var items = [];

        // palet
        var NAVY = "#0b1f4d", DEEP = "#1e3a8a", BLUE = "#1d4ed8", MID = "#2563eb",
            SKY = "#60a5fa", PALE = "#bfdbfe", ICE = "#e0f2fe", WHITE = "#f8fafc",
            SLATE = "#94a3b8", CYAN = "#22d3ee", AMBER = "#fbbf24";

        // ---------- helper lokal (semua koordinat diskalakan lewat n()) ----------
        function n(v) { return +(v * S).toFixed(4); }
        function pos(p) { return n(p[0]) + " " + n(p[1]) + " " + n(p[2]); }
        function r2(v) { return +v.toFixed(2); }

        // frame lokal: titik asal + putaran sumbu Y, supaya satu kelompok objek bisa diputar utuh
        function frame(ox, oy, oz, ry) {
            var c = Math.cos(ry * Math.PI / 180), s = Math.sin(ry * Math.PI / 180);
            var f = function (lx, ly, lz) {
                return [ox + lx * c + lz * s, oy + ly, oz - lx * s + lz * c];
            };
            f.ry = ry;
            return f;
        }
        function sub(f, lx, ly, lz, ry) {
            var o = f(lx, ly, lz);
            return frame(o[0], o[1], o[2], f.ry + (ry || 0));
        }
        var W = frame(0, 0, 0, 0); // frame dunia

        function part(f, geo, color, lx, ly, lz, o) {
            o = o || {};
            var p = f(lx, ly, lz);
            var m = "color: " + color +
                "; metalness: " + (o.m === undefined ? 0.15 : o.m) +
                "; roughness: " + (o.r === undefined ? 0.55 : o.r);
            if (o.e) { m += "; emissive: " + o.e + "; emissiveIntensity: " + (o.ei || 0.7); }
            if (o.op) { m += "; opacity: " + o.op + "; transparent: true"; }
            if (o.wire) { m += "; wireframe: true"; }
            var cfg = {
                geometry: geo,
                material: m,
                position: pos(p),
                rotation: r2(o.rx || 0) + " " + r2(f.ry + (o.ry || 0)) + " " + r2(o.rz || 0),
            };
            if (o.anim) { cfg.animation = o.anim; }
            if (o.text) { cfg.text = o.text; }
            items.push(stageEntity(cfg));
        }
        function gBox(w, h, d) {
            return "primitive: box; width: " + n(w) + "; height: " + n(h) + "; depth: " + n(d);
        }
        function B(f, w, h, d, color, lx, ly, lz, o) {
            part(f, gBox(w, h, d), color, lx, ly, lz, o);
        }
        function C(f, r, h, color, lx, ly, lz, o) {
            part(f, "primitive: cylinder; radius: " + n(r) + "; height: " + n(h) +
                "; segmentsRadial: " + ((o && o.seg) || 24), color, lx, ly, lz, o);
        }
        function Sp(f, r, color, lx, ly, lz, o) {
            part(f, "primitive: sphere; radius: " + n(r) + "; segmentsWidth: 12; segmentsHeight: 8",
                color, lx, ly, lz, o);
        }

        // arah garis 3D -> pitch & yaw (urutan rotasi A-Frame: Y lalu X)
        function orient(a, b) {
            var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
            var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return {
                len: len,
                ux: dx / len, uy: dy / len, uz: dz / len,
                pitch: Math.acos(Math.max(-1, Math.min(1, dy / len))) * 180 / Math.PI,
                yaw: Math.atan2(dx, dz) * 180 / Math.PI,
            };
        }
        // batang tipis dari titik a ke b (garis relasi / koneksi / callout)
        function seg(a, b, color, r, o) {
            o = o || {};
            var k = orient(a, b);
            C(W, r, k.len, color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2,
                { rx: k.pitch, ry: k.yaw, seg: 6, e: o.e, ei: o.ei, m: 0.1 });
        }
        // animasi perpindahan (paket data, kursor)
        function mv(a, b, dur, o) {
            o = o || {};
            return "property: position; from: " + pos(a) + "; to: " + pos(b) +
                "; dur: " + dur + "; loop: true; easing: " + (o.ease || "linear") +
                (o.alt ? "; dir: alternate" : "") + (o.delay ? "; delay: " + o.delay : "");
        }
        function glow(ei) { return { e: CYAN, ei: ei || 0.8 }; }

        // label 3D utama + garis callout dengan kepala panah
        function callout(txt, cx, cy, cz, tip) {
            B(W, 0.41, 0.078, 0.006, CYAN, cx, cy, cz - 0.005, glow(0.8));
            B(W, 0.4, 0.07, 0.01, NAVY, cx, cy, cz, {
                m: 0.3,
                text: "value: " + txt + "; align: center; anchor: center; baseline: center; " +
                    "color: #ffffff; width: " + n(0.38) + "; wrapCount: 24; zOffset: " + n(0.0065),
            });
            var a = [cx, cy - 0.04, cz];
            var k = orient(a, tip), h = 0.04;
            var tail = [tip[0] - k.ux * h, tip[1] - k.uy * h, tip[2] - k.uz * h];
            var mid = [tip[0] - k.ux * h / 2, tip[1] - k.uy * h / 2, tip[2] - k.uz * h / 2];
            seg(a, tail, CYAN, 0.0035, glow(1));
            part(W, "primitive: cone; radiusBottom: " + n(0.012) + "; radiusTop: 0; height: " + n(h) +
                "; segmentsRadial: 12", CYAN, mid[0], mid[1], mid[2],
                { rx: k.pitch, ry: k.yaw, e: CYAN, ei: 1 });
            Sp(W, 0.007, "#ffffff", a[0], a[1], a[2], { e: "#ffffff", ei: 0.5 });
        }
        // tag kecil pada node arsitektur
        function tag(f, txt, lx, ly, lz) {
            B(f, 0.12, 0.026, 0.006, NAVY, lx, ly, lz, {
                text: "value: " + txt + "; align: center; anchor: center; baseline: center; " +
                    "color: #e0f2fe; width: " + n(0.11) + "; wrapCount: 11; zOffset: " + n(0.0035),
            });
            B(f, 0.12, 0.004, 0.007, CYAN, lx, ly - 0.015, lz, glow(0.8));
        }

        // ============================================================
        //  PLATFORM
        // ============================================================
        items.push(stageBox(n(1.26), n(0.03), n(0.91), "#071433", pos([0, -0.435, 0])));
        items.push(stageBox(n(1.2), n(0.04), n(0.85), NAVY, pos([0, -0.4, 0])));
        items.push(stageBox(n(1.16), n(0.012), n(0.81), BLUE, pos([0, -0.374, 0])));
        // strip cyan di tepi platform
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, 0.426, glow(0.7));
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, -0.426, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, 0.6, -0.4, 0, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, -0.6, -0.4, 0, glow(0.7));
        // alas zona
        part(W, gBox(0.44, 0.008, 0.3), "#2a5bd7", -0.36, -0.364, -0.2, { m: 0.1 }); // UI/UX
        part(W, gBox(0.44, 0.008, 0.28), "#2a5bd7", -0.36, -0.364, 0.24, { m: 0.1 }); // Mockup
        part(W, gBox(0.4, 0.008, 0.3), "#2a5bd7", 0.38, -0.364, -0.2, { m: 0.1 });   // Database
        part(W, gBox(0.7, 0.008, 0.28), "#2a5bd7", 0.18, -0.364, 0.24, { m: 0.1 });  // Arsitektur

        // ============================================================
        //  1. UI/UX WIREFRAME  (kiri-belakang)
        // ============================================================
        var A = frame(-0.36, Y0, -0.2, 8);
        var zs = -0.04;
        // monitor desktop
        B(A, 0.12, 0.008, 0.07, "#cbd5e1", 0, 0.004, zs);
        B(A, 0.02, 0.07, 0.014, SLATE, 0, 0.043, zs);
        B(A, 0.32, 0.2, 0.014, NAVY, 0, 0.18, zs, { m: 0.3 });
        B(A, 0.30, 0.18, 0.004, WHITE, 0, 0.18, zs + 0.009, { m: 0.05, r: 0.8 });
        var ez = zs + 0.0125, ez2 = ez + 0.002, i, x;
        B(A, 0.30, 0.026, 0.003, MID, 0, 0.257, ez);                    // navbar
        B(A, 0.014, 0.012, 0.003, CYAN, -0.13, 0.257, ez2, glow(0.6));  // logo
        for (i = 0; i < 3; i++) { B(A, 0.03, 0.006, 0.003, PALE, -0.03 + i * 0.05, 0.257, ez2); }
        B(A, 0.055, 0.15, 0.003, "#dbeafe", -0.1225, 0.165, ez);        // sidebar
        for (i = 0; i < 4; i++) { B(A, 0.036, 0.006, 0.003, SKY, -0.1225, 0.215 - i * 0.022, ez2); }
        B(A, 0.11, 0.055, 0.003, PALE, -0.03, 0.2, ez);                 // placeholder gambar
        C(A, 0.009, 0.003, CYAN, -0.055, 0.215, ez2, { rx: 90 });
        for (i = 0; i < 3; i++) { B(A, 0.07, 0.006, 0.003, SLATE, 0.095, 0.222 - i * 0.016, ez); }
        B(A, 0.045, 0.016, 0.003, CYAN, 0.095, 0.172, ez, glow(0.5));   // tombol
        for (i = 0; i < 3; i++) {                                       // card
            x = -0.045 + i * 0.075;
            B(A, 0.06, 0.05, 0.003, ICE, x, 0.118, ez);
            B(A, 0.06, 0.008, 0.003, SKY, x, 0.138, ez2);
        }
        // lembar wireframe di lantai
        B(A, 0.13, 0.003, 0.095, "#f1f5f9", -0.1, 0.0015, 0.085, { ry: 12 });
        B(A, 0.13, 0.003, 0.095, WHITE, -0.07, 0.0045, 0.09, { ry: -6 });
        var S2 = sub(A, -0.07, 0.006, 0.09, -6);
        B(S2, 0.11, 0.002, 0.014, SKY, 0, 0.001, -0.03);
        B(S2, 0.05, 0.002, 0.04, PALE, -0.03, 0.001, 0);
        for (i = 0; i < 3; i++) { B(S2, 0.045, 0.002, 0.006, SLATE, 0.03, 0.001, -0.012 + i * 0.014); }
        B(S2, 0.04, 0.002, 0.012, CYAN, 0.03, 0.001, 0.033, glow(0.4));
        // wireframe mobile berdiri
        var M = sub(A, 0.15, 0, 0.08, -12);
        B(M, 0.06, 0.006, 0.04, "#cbd5e1", 0, 0.003, 0);
        B(M, 0.08, 0.14, 0.008, DEEP, 0, 0.076, 0);
        B(M, 0.07, 0.13, 0.003, WHITE, 0, 0.076, 0.0055);
        B(M, 0.07, 0.014, 0.003, MID, 0, 0.133, 0.0085);
        B(M, 0.058, 0.04, 0.003, PALE, 0, 0.1, 0.0085);
        for (i = 0; i < 2; i++) { B(M, 0.05, 0.006, 0.003, SLATE, 0, 0.068 - i * 0.014, 0.0085); }
        B(M, 0.05, 0.012, 0.003, CYAN, 0, 0.03, 0.0085, glow(0.5));
        // pensil perancang
        var Pc = sub(A, 0.05, 0.005, 0.125, 20);
        C(Pc, 0.005, 0.07, AMBER, 0, 0, 0, { rz: 90, seg: 8 });
        part(Pc, "primitive: cone; radiusBottom: " + n(0.005) + "; radiusTop: 0; height: " + n(0.018) +
            "; segmentsRadial: 8", "#fde68a", 0.044, 0, 0, { rz: -90 });

        // ============================================================
        //  2. APPLICATION MOCKUP  (kiri-depan)
        // ============================================================
        var Mk = frame(-0.36, Y0, 0.24, -10);
        var Ph = sub(Mk, -0.12, 0, 0, 0);
        C(Ph, 0.035, 0.006, "#cbd5e1", 0, 0.003, 0);
        C(Ph, 0.006, 0.03, SLATE, 0, 0.021, 0, { seg: 12 });
        B(Ph, 0.085, 0.17, 0.01, NAVY, 0, 0.121, 0, { m: 0.4, r: 0.35 });
        B(Ph, 0.077, 0.158, 0.004, "#dbeafe", 0, 0.121, 0.0065, { m: 0.05, r: 0.8 });
        var pz = 0.0095, pz2 = 0.0115;
        B(Ph, 0.077, 0.022, 0.003, BLUE, 0, 0.189, pz);
        Sp(Ph, 0.005, "#ffffff", -0.027, 0.189, pz2);
        B(Ph, 0.03, 0.005, 0.003, PALE, 0.008, 0.189, pz2);
        B(Ph, 0.065, 0.045, 0.003, CYAN, 0, 0.152, pz, glow(0.35));
        var bars = [0.012, 0.02, 0.03];
        for (i = 0; i < 3; i++) { B(Ph, 0.008, bars[i], 0.003, "#ffffff", -0.014 + i * 0.014, 0.134 + bars[i] / 2, pz2); }
        for (i = 0; i < 2; i++) {
            var py = 0.105 - i * 0.028;
            B(Ph, 0.065, 0.022, 0.003, "#ffffff", 0, py, pz);
            B(Ph, 0.012, 0.012, 0.003, SKY, -0.022, py, pz2);
            B(Ph, 0.032, 0.004, 0.003, PALE, 0.008, py + 0.004, pz2);
            B(Ph, 0.022, 0.004, 0.003, PALE, 0.003, py - 0.004, pz2);
        }
        B(Ph, 0.055, 0.014, 0.003, MID, 0, 0.052, pz);                  // tombol CTA
        // kursor klik (animasi tap ringan)
        part(Ph, "primitive: cone; radiusBottom: " + n(0.007) + "; radiusTop: 0; height: " + n(0.03) +
            "; segmentsRadial: 12", AMBER, 0.0186, 0.0437, 0.024,
            { rz: 35, e: AMBER, ei: 0.3,
              anim: mv(Ph(0.0186, 0.0437, 0.024), Ph(0.0186, 0.0437, 0.016), 900, { alt: true, ease: "easeInOutSine" }) });
        // tablet (flat) + layer UI melayang
        var T = sub(Mk, 0.07, 0, 0.01, 6);
        B(T, 0.15, 0.01, 0.1, NAVY, 0, 0.005, 0, { m: 0.4 });
        B(T, 0.14, 0.003, 0.09, "#dbeafe", 0, 0.0115, 0, { m: 0.05, r: 0.8 });
        B(T, 0.14, 0.002, 0.016, BLUE, 0, 0.0145, -0.037);
        B(T, 0.03, 0.002, 0.06, WHITE, -0.052, 0.0145, 0.008);
        B(T, 0.08, 0.002, 0.04, WHITE, 0.02, 0.0145, -0.005);
        var tb = [0.008, 0.014, 0.01, 0.02];
        for (i = 0; i < 4; i++) { B(T, 0.01, tb[i], 0.008, i === 3 ? CYAN : SKY, -0.003 + i * 0.018, 0.0155 + tb[i] / 2, -0.005); }
        B(T, 0.036, 0.002, 0.018, WHITE, 0.002, 0.0145, 0.028);
        B(T, 0.036, 0.002, 0.018, WHITE, 0.043, 0.0145, 0.028);
        B(T, 0.12, 0.002, 0.08, CYAN, 0, 0.09, 0, {
            op: 0.25, e: CYAN, ei: 0.3,
            anim: mv(T(0, 0.085, 0), T(0, 0.097, 0), 2600, { alt: true, ease: "easeInOutSine" }),
        });

        // ============================================================
        //  3. SYSTEM ARCHITECTURE  (kanan-depan): Frontend -> API -> Backend -> Database
        // ============================================================
        var R = frame(0.18, Y0, 0.24, 0);
        // Frontend
        var Fe = sub(R, -0.22, 0, -0.01, 0);
        B(Fe, 0.1, 0.07, 0.05, MID, 0, 0.035, 0, { m: 0.25 });
        B(Fe, 0.1, 0.012, 0.052, DEEP, 0, 0.064, 0);
        Sp(Fe, 0.0035, CYAN, -0.04, 0.064, 0.027, glow(1));
        Sp(Fe, 0.0035, SKY, -0.03, 0.064, 0.027);
        Sp(Fe, 0.0035, "#ffffff", -0.02, 0.064, 0.027);
        B(Fe, 0.088, 0.045, 0.003, WHITE, 0, 0.03, 0.0265);
        B(Fe, 0.07, 0.01, 0.003, SKY, 0, 0.043, 0.0295);
        B(Fe, 0.03, 0.016, 0.003, CYAN, -0.02, 0.022, 0.0295, glow(0.4));
        B(Fe, 0.03, 0.016, 0.003, PALE, 0.02, 0.022, 0.0295);
        tag(Fe, "Frontend", 0, 0.013, 0.065);
        // API gateway (wireframe berputar + cincin orbit)
        var Ap = sub(R, -0.01, 0, -0.01, 0);
        C(Ap, 0.04, 0.008, "#0e7490", 0, 0.004, 0, { seg: 6 });
        C(Ap, 0.034, 0.004, CYAN, 0, 0.01, 0, { seg: 6, e: CYAN, ei: 0.6 });
        C(Ap, 0.004, 0.04, SLATE, 0, 0.032, 0, { seg: 8 });
        part(Ap, "primitive: octahedron; radius: " + n(0.045), CYAN, 0, 0.085, 0, {
            wire: true, e: CYAN, ei: 0.6,
            anim: "property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear",
        });
        part(Ap, "primitive: octahedron; radius: " + n(0.022), MID, 0, 0.085, 0, { e: MID, ei: 0.5 });
        part(Ap, "primitive: torus; radius: " + n(0.062) + "; radiusTubular: " + n(0.0025) +
            "; segmentsRadial: 6; segmentsTubular: 32", "#ffffff", 0, 0.085, 0, {
            rx: 72, e: "#ffffff", ei: 0.4,
            anim: "property: rotation; to: 72 360 0; loop: true; dur: 6000; easing: linear",
        });
        tag(Ap, "API", 0, 0.013, 0.065);
        // Backend (rak server)
        var Be = sub(R, 0.2, 0, -0.01, 0);
        for (i = 0; i < 3; i++) {
            var sy = 0.014 + i * 0.032;
            B(Be, 0.09, 0.028, 0.06, DEEP, 0, sy, 0, { m: 0.4, r: 0.4 });
            Sp(Be, 0.004, CYAN, -0.032, sy, 0.0305, glow(1));
            B(Be, 0.04, 0.004, 0.002, SKY, 0.008, sy + 0.005, 0.0305);
            B(Be, 0.04, 0.004, 0.002, SKY, 0.008, sy - 0.005, 0.0305);
        }
        B(Be, 0.092, 0.005, 0.062, SKY, 0, 0.0945, 0);
        tag(Be, "Backend", 0, 0.013, 0.065);
        // jalur koneksi + paket data
        seg(R(-0.17, 0.012, -0.01), R(-0.05, 0.012, -0.01), CYAN, 0.004, glow(0.9));
        seg(R(0.03, 0.012, -0.01), R(0.155, 0.012, -0.01), CYAN, 0.004, glow(0.9));
        Sp(W, 0.007, "#ffffff", R(-0.17, 0.024, -0.01)[0], R(-0.17, 0.024, -0.01)[1], R(-0.17, 0.024, -0.01)[2],
            { e: "#ffffff", ei: 1, anim: mv(R(-0.17, 0.024, -0.01), R(0.155, 0.024, -0.01), 2600) });
        Sp(W, 0.007, AMBER, R(0.155, 0.024, -0.01)[0], R(0.155, 0.024, -0.01)[1], R(0.155, 0.024, -0.01)[2],
            { e: AMBER, ei: 1, anim: mv(R(0.155, 0.024, -0.01), R(-0.17, 0.024, -0.01), 2600, { delay: 1300 }) });

        // ============================================================
        //  4. DATABASE DESIGN  (kanan-belakang)
        // ============================================================
        var D = frame(0.38, Y0, -0.2, 0);
        var St = sub(D, 0, 0, 0.03, 0);
        for (i = 0; i < 3; i++) {
            C(St, 0.065, 0.032, BLUE, 0, 0.016 + i * 0.038, 0, { seg: 32, m: 0.3, r: 0.4 });
            B(St, 0.03, 0.005, 0.002, CYAN, 0, 0.016 + i * 0.038, 0.066, glow(1));
        }
        for (i = 0; i < 2; i++) { C(St, 0.0665, 0.006, CYAN, 0, 0.035 + i * 0.038, 0, { seg: 32, e: CYAN, ei: 0.8 }); }
        C(St, 0.065, 0.004, PALE, 0, 0.11, 0, { seg: 32 });
        // dua tabel (ERD)
        function table(f) {
            B(f, 0.1, 0.012, 0.075, ICE, 0, 0.006, 0);
            B(f, 0.1, 0.003, 0.018, MID, 0, 0.0135, -0.0285);
            Sp(f, 0.004, CYAN, -0.04, 0.0165, -0.0285, glow(1));
            for (var j = 0; j < 3; j++) { B(f, 0.085, 0.002, 0.006, SKY, 0, 0.013, -0.006 + j * 0.014); }
        }
        var TA = sub(D, -0.14, 0, -0.08, 0), TB = sub(D, 0.14, 0, -0.08, 0);
        table(TA);
        table(TB);
        // garis relasi antar tabel & ke database
        seg(D(-0.09, 0.01, -0.08), D(0.09, 0.01, -0.08), CYAN, 0.0035, glow(0.9));
        Sp(W, 0.006, "#ffffff", D(-0.09, 0.01, -0.08)[0], D(-0.09, 0.01, -0.08)[1], D(-0.09, 0.01, -0.08)[2], glow(1));
        Sp(W, 0.006, CYAN, D(0.09, 0.01, -0.08)[0], D(0.09, 0.01, -0.08)[1], D(0.09, 0.01, -0.08)[2], glow(1));
        seg(D(-0.09, 0.01, -0.06), D(-0.05, 0.01, 0.03), CYAN, 0.0025, glow(0.7));
        seg(D(0.09, 0.01, -0.06), D(0.05, 0.01, 0.03), CYAN, 0.0025, glow(0.7));
        Sp(W, 0.006, "#ffffff", D(-0.09, 0.02, -0.08)[0], D(-0.09, 0.02, -0.08)[1], D(-0.09, 0.02, -0.08)[2], {
            e: "#ffffff", ei: 1, anim: mv(D(-0.09, 0.02, -0.08), D(0.09, 0.02, -0.08), 2000, { alt: true, ease: "easeInOutSine" }),
        });

        // pipa Backend -> Database
        seg(R(0.2, 0.012, -0.04), D(0, 0.012, 0.095), CYAN, 0.004, glow(0.9));
        Sp(W, 0.007, "#ffffff", R(0.2, 0.024, -0.04)[0], R(0.2, 0.024, -0.04)[1], R(0.2, 0.024, -0.04)[2], {
            e: "#ffffff", ei: 1, anim: mv(R(0.2, 0.024, -0.04), D(0, 0.024, 0.095), 2200, { alt: true, ease: "easeInOutSine" }),
        });

        // ============================================================
        //  LABEL + CALLOUT (konsisten: panel navy, border cyan, teks putih)
        // ============================================================
        var tipUI = A(0, 0.284, zs);
        var tipDB = St(0, 0.114, 0);
        var tipMK = Ph(0, 0.21, 0);
        var tipAR = Be(0, 0.102, 0);
        callout("UI/UX Design", tipUI[0], 0.32, -0.22, tipUI);
        callout("Database Design", tipDB[0], 0.32, -0.22, tipDB);
        callout("Application Mockup", -0.66, 0.12, 0.3, tipMK);
        callout("System Architecture", 0.66, 0.12, 0.3, tipAR);

        return stageWrap(items);
    },
    // 3. CODING — monitor + baris kode + keyboard
    coding: function () {
        // ============================================================
        //  CODING / IMPLEMENTATION DIORAMA (Waterfall)
        //  Zona: Workstation + code editor (kiri), Frontend (tengah-belakang),
        //        Backend (kanan-belakang), Database (kanan-depan),
        //        Build & Run (tengah-depan)
        // ============================================================
        var S = 1;          // skala keseluruhan diorama (kecilkan bila terlalu besar, mis. 0.7)
        var Y0 = -0.36;     // permukaan lantai zona (di atas platform)
        var items = [];
        var i, j, x;

        // palet
        var NAVY = "#0b1f4d", DEEP = "#1e3a8a", BLUE = "#1d4ed8", MID = "#2563eb",
            SKY = "#60a5fa", PALE = "#bfdbfe", ICE = "#e0f2fe", WHT = "#f8fafc",
            SLATE = "#94a3b8", CYAN = "#22d3ee", AMBER = "#fbbf24",
            YEL = "#fde047", GRN = "#4ade80", PAD = "#2a5bd7";

        // ---------- helper lokal (semua koordinat diskalakan lewat n()) ----------
        function n(v) { return +(v * S).toFixed(4); }
        function pos(p) { return n(p[0]) + " " + n(p[1]) + " " + n(p[2]); }
        function r2(v) { return +v.toFixed(2); }

        // frame lokal: titik asal + putaran sumbu Y, supaya satu kelompok objek bisa diputar utuh
        function frame(ox, oy, oz, ry) {
            var c = Math.cos(ry * Math.PI / 180), s = Math.sin(ry * Math.PI / 180);
            var f = function (lx, ly, lz) {
                return [ox + lx * c + lz * s, oy + ly, oz - lx * s + lz * c];
            };
            f.ry = ry;
            return f;
        }
        function sub(f, lx, ly, lz, ry) {
            var o = f(lx, ly, lz);
            return frame(o[0], o[1], o[2], f.ry + (ry || 0));
        }
        var W = frame(0, 0, 0, 0); // frame dunia

        function part(f, geo, color, lx, ly, lz, o) {
            o = o || {};
            var p = f(lx, ly, lz);
            var m = "color: " + color +
                "; metalness: " + (o.m === undefined ? 0.15 : o.m) +
                "; roughness: " + (o.r === undefined ? 0.55 : o.r);
            if (o.e) { m += "; emissive: " + o.e + "; emissiveIntensity: " + (o.ei || 0.7); }
            if (o.op) { m += "; opacity: " + o.op + "; transparent: true"; }
            if (o.wire) { m += "; wireframe: true"; }
            var cfg = {
                geometry: geo,
                material: m,
                position: pos(p),
                rotation: r2(o.rx || 0) + " " + r2(f.ry + (o.ry || 0)) + " " + r2(o.rz || 0),
            };
            if (o.anim) { cfg.animation = o.anim; }
            if (o.text) { cfg.text = o.text; }
            items.push(stageEntity(cfg));
        }
        function gBox(w, h, d) {
            return "primitive: box; width: " + n(w) + "; height: " + n(h) + "; depth: " + n(d);
        }
        function B(f, w, h, d, color, lx, ly, lz, o) {
            part(f, gBox(w, h, d), color, lx, ly, lz, o);
        }
        function C(f, r, h, color, lx, ly, lz, o) {
            part(f, "primitive: cylinder; radius: " + n(r) + "; height: " + n(h) +
                "; segmentsRadial: " + ((o && o.seg) || 24), color, lx, ly, lz, o);
        }
        function Sp(f, r, color, lx, ly, lz, o) {
            part(f, "primitive: sphere; radius: " + n(r) + "; segmentsWidth: 12; segmentsHeight: 8",
                color, lx, ly, lz, o);
        }
        function cone(f, rb, h, color, lx, ly, lz, o) {
            part(f, "primitive: cone; radiusBottom: " + n(rb) + "; radiusTop: 0; height: " + n(h) +
                "; segmentsRadial: 12", color, lx, ly, lz, o);
        }
        // string teks (komponen text bawaan A-Frame)
        function txt(v, color, w, wc, zo) {
            return "value: " + v + "; align: center; anchor: center; baseline: center; color: " + color +
                "; whiteSpace: nowrap; width: " + n(w) + "; wrapCount: " + wc + "; zOffset: " + n(zo || 0.0035);
        }
        function glow(ei) { return { e: CYAN, ei: ei || 0.8 }; }

        // arah garis 3D -> pitch & yaw (urutan rotasi A-Frame: Y lalu X)
        function orient(a, b) {
            var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
            var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return {
                len: len, ux: dx / len, uy: dy / len, uz: dz / len,
                pitch: Math.acos(Math.max(-1, Math.min(1, dy / len))) * 180 / Math.PI,
                yaw: Math.atan2(dx, dz) * 180 / Math.PI,
            };
        }
        // batang tipis dari titik a ke b (konektor / callout)
        function seg(a, b, color, r, o) {
            o = o || {};
            var k = orient(a, b);
            C(W, r, k.len, color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2,
                { rx: k.pitch, ry: k.yaw, seg: 6, e: o.e, ei: o.ei, m: 0.1 });
        }
        // animasi perpindahan (paket data, kursor)
        function mv(a, b, dur, o) {
            o = o || {};
            return "property: position; from: " + pos(a) + "; to: " + pos(b) +
                "; dur: " + dur + "; loop: true; easing: " + (o.ease || "linear") +
                (o.alt ? "; dir: alternate" : "") + (o.delay ? "; delay: " + o.delay : "");
        }
        function pkt(a, b, color, dur, o) {
            Sp(W, 0.006, color, a[0], a[1], a[2], { e: color, ei: 1, anim: mv(a, b, dur, o) });
        }
        function blink(dur) {
            return "property: scale; from: 1 1 1; to: 1 0.05 1; dur: " + dur +
                "; loop: true; dir: alternate; easing: linear";
        }
        function pulse(dur) {
            return "property: scale; from: 1 1 1; to: 1.7 1.7 1.7; dur: " + dur +
                "; loop: true; dir: alternate; easing: easeInOutSine";
        }
        function spinY(dur) {
            return "property: rotation; to: 0 360 0; loop: true; dur: " + dur + "; easing: linear";
        }

        // label 3D utama + garis callout dengan kepala panah
        function callout(text, cx, cy, cz, tip) {
            B(W, 0.39, 0.078, 0.006, CYAN, cx, cy, cz - 0.005, glow(0.8));
            B(W, 0.38, 0.07, 0.01, NAVY, cx, cy, cz, { m: 0.3, text: txt(text, "#ffffff", 0.36, 24, 0.0065) });
            var a = [cx, cy - 0.04, cz];
            var k = orient(a, tip), h = 0.04;
            var tail = [tip[0] - k.ux * h, tip[1] - k.uy * h, tip[2] - k.uz * h];
            var mid = [tip[0] - k.ux * h / 2, tip[1] - k.uy * h / 2, tip[2] - k.uz * h / 2];
            seg(a, tail, CYAN, 0.0035, glow(1));
            cone(W, 0.012, h, CYAN, mid[0], mid[1], mid[2], { rx: k.pitch, ry: k.yaw, e: CYAN, ei: 1 });
            Sp(W, 0.007, "#ffffff", a[0], a[1], a[2], { e: "#ffffff", ei: 0.5 });
        }
        // tag kecil pada node
        function tag(f, text, lx, ly, lz, w) {
            w = w || 0.12;
            B(f, w, 0.026, 0.006, NAVY, lx, ly, lz,
                { text: txt(text, "#e0f2fe", w - 0.01, Math.round((w - 0.01) / 0.01)) });
            B(f, w, 0.004, 0.007, CYAN, lx, ly - 0.015, lz, glow(0.8));
        }

        // ============================================================
        //  PLATFORM
        // ============================================================
        items.push(stageBox(n(1.26), n(0.03), n(0.91), "#071433", pos([0, -0.435, 0])));
        items.push(stageBox(n(1.2), n(0.04), n(0.85), NAVY, pos([0, -0.4, 0])));
        items.push(stageBox(n(1.16), n(0.012), n(0.81), BLUE, pos([0, -0.374, 0]),
            { material: "color: " + BLUE + "; metalness: 0.2; roughness: 0.6" }));
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, 0.426, glow(0.7));
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, -0.426, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, 0.6, -0.4, 0, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, -0.6, -0.4, 0, glow(0.7));
        // alas zona
        part(W, gBox(0.5, 0.008, 0.58), PAD, -0.33, -0.364, -0.09, { m: 0.1 });   // workstation
        part(W, gBox(0.32, 0.008, 0.35), PAD, 0.11, -0.364, -0.205, { m: 0.1 });  // frontend
        part(W, gBox(0.28, 0.008, 0.35), PAD, 0.44, -0.364, -0.205, { m: 0.1 });  // backend
        part(W, gBox(0.28, 0.008, 0.35), PAD, 0.44, -0.364, 0.205, { m: 0.1 });   // database
        part(W, gBox(0.32, 0.008, 0.35), PAD, 0.11, -0.364, 0.205, { m: 0.1 });   // build & run

        // ============================================================
        //  A. CODING WORKSTATION + CODE EDITOR  (kiri)
        // ============================================================
        var Ws = frame(-0.33, Y0, -0.09, 0);
        var yt = 0.116;   // tinggi permukaan meja
        // meja modern
        B(Ws, 0.4, 0.016, 0.3, "#f1f5f9", 0.04, 0.108, -0.12, { m: 0.1, r: 0.4 });
        B(Ws, 0.016, 0.1, 0.28, NAVY, -0.15, 0.05, -0.12);
        B(Ws, 0.016, 0.1, 0.28, NAVY, 0.23, 0.05, -0.12);
        B(Ws, 0.3, 0.06, 0.01, DEEP, 0.04, 0.075, -0.255);
        B(Ws, 0.4, 0.004, 0.004, CYAN, 0.04, 0.098, 0.03, glow(0.9));
        // monitor
        var zm = -0.2;
        B(Ws, 0.1, 0.006, 0.07, "#cbd5e1", 0.04, yt + 0.003, zm);
        B(Ws, 0.02, 0.07, 0.014, SLATE, 0.04, yt + 0.041, zm);
        B(Ws, 0.38, 0.24, 0.014, NAVY, 0.04, 0.296, zm, { m: 0.4, r: 0.35 });
        B(Ws, 0.36, 0.22, 0.004, "#0f172a", 0.04, 0.296, zm + 0.009, { m: 0.05, r: 0.8 });
        // --- layar code editor (M = pusat layar) ---
        var M = sub(Ws, 0.04, 0.296, zm, 0);
        var ez = 0.0125, ez2 = 0.0145;
        B(M, 0.36, 0.018, 0.003, "#1e293b", 0, 0.101, ez);                              // title bar
        Sp(M, 0.004, CYAN, -0.165, 0.101, ez2, glow(0.8));
        Sp(M, 0.004, YEL, -0.152, 0.101, ez2, { e: YEL, ei: 0.6 });
        Sp(M, 0.004, GRN, -0.139, 0.101, ez2, { e: GRN, ei: 0.6 });
        B(M, 0.07, 0.014, 0.003, "#162447", -0.085, 0.083, ez, { text: txt("app.js", "#e2e8f0", 0.05, 8) });   // tab aktif
        B(M, 0.07, 0.002, 0.003, CYAN, -0.085, 0.0755, ez2, glow(1));
        B(M, 0.06, 0.014, 0.003, "#1e293b", -0.015, 0.083, ez, { text: txt("api.js", "#94a3b8", 0.045, 8) });
        B(M, 0.06, 0.176, 0.003, "#111c33", -0.15, -0.012, ez);                          // file explorer
        var tree = [[SKY, 0, 0.03], [SLATE, 1, 0.028], [CYAN, 1, 0.028], [SLATE, 1, 0.024], [SKY, 0, 0.03]];
        for (i = 0; i < 5; i++) {
            B(M, tree[i][2], 0.005, 0.003, tree[i][0], -0.162 + tree[i][1] * 0.008 + tree[i][2] / 2, 0.06 - i * 0.014, ez2);
        }
        B(M, 0.003, 0.15, 0.003, "#334155", -0.098, -0.01, ez2);                         // pemisah gutter
        B(M, 0.17, 0.011, 0.002, "#1e3a8a", -0.005, 0.058 - 5 * 0.014, ez);              // highlight baris aktif
        B(M, 0.006, 0.006, 0.003, CYAN, -0.104, 0.058 - 5 * 0.014, ez2, glow(1));
        // baris kode dengan syntax highlighting
        var code = [
            [0, [[0.034, SKY], [0.04, YEL], [0.014, WHT]]],
            [1, [[0.024, SKY], [0.026, WHT], [0.008, WHT], [0.036, YEL], [0.03, GRN]]],
            [1, [[0.026, SKY], [0.05, CYAN], [0.03, GRN]]],
            [1, [[0.016, SKY], [0.03, WHT], [0.02, CYAN]]],
            [2, [[0.06, SLATE]]],
            [2, [[0.03, YEL], [0.04, WHT], [0.03, GRN]]],
            [1, [[0.012, WHT]]],
            [1, [[0.03, SKY], [0.05, CYAN], [0.02, WHT]]],
            [0, [[0.012, WHT]]],
            [0, [[0.03, SKY], [0.034, YEL], [0.02, WHT]]],
        ];
        var cx = 0, cy = 0;
        for (i = 0; i < code.length; i++) {
            cx = -0.085 + code[i][0] * 0.014;
            cy = 0.058 - i * 0.014;
            for (j = 0; j < code[i][1].length; j++) {
                var w = code[i][1][j][0], col = code[i][1][j][1];
                B(M, w, 0.007, 0.003, col, cx + w / 2, cy, ez2, { e: col, ei: 0.4 });
                cx += w + 0.004;
            }
        }
        B(M, 0.004, 0.01, 0.003, "#ffffff", cx + 0.004, cy, ez2, { e: "#ffffff", ei: 1, anim: blink(500) }); // kursor berkedip
        // panel simbol programming
        B(M, 0.095, 0.176, 0.003, "#111c33", 0.1325, -0.012, ez);
        B(M, 0.075, 0.036, 0.003, "#0f172a", 0.1325, 0.045, ez2, { text: txt("{ }", YEL, 0.05, 4) });
        B(M, 0.075, 0.036, 0.003, "#0f172a", 0.1325, -0.002, ez2, { text: txt("</>", CYAN, 0.05, 4) });
        B(M, 0.075, 0.036, 0.003, "#0f172a", 0.1325, -0.049, ez2, { text: txt("fn()", GRN, 0.05, 4) });
        // status bar + indikator build berjalan
        B(M, 0.36, 0.016, 0.003, BLUE, 0, -0.102, ez);
        B(M, 0.1, 0.004, 0.003, NAVY, -0.1, -0.102, ez2);
        B(M, 0.03, 0.004, 0.003, CYAN, -0.145, -0.102, ez2 + 0.001, {
            e: CYAN, ei: 1, anim: mv(M(-0.145, -0.102, ez2 + 0.001), M(-0.055, -0.102, ez2 + 0.001), 1800),
        });
        B(M, 0.08, 0.012, 0.003, BLUE, 0.13, -0.102, ez2, { text: txt("Building...", "#ffffff", 0.07, 11) });
        // keyboard
        var kx = 0.05, kz = -0.03;
        B(Ws, 0.2, 0.008, 0.075, "#1e293b", kx, yt + 0.004, kz, { m: 0.4 });
        for (i = 0; i < 4; i++) {
            B(Ws, i === 3 ? 0.09 : 0.18, 0.004, 0.012, i === 3 ? "#e2e8f0" : "#cbd5e1", kx, yt + 0.01, kz - 0.027 + i * 0.018);
        }
        B(Ws, 0.014, 0.0045, 0.012, CYAN, kx + 0.07, yt + 0.0105, kz - 0.027, glow(0.8));
        B(Ws, 0.014, 0.0045, 0.012, YEL, kx - 0.07, yt + 0.0105, kz - 0.027, { e: YEL, ei: 0.5 });
        // mouse + mousepad
        var mx = 0.2;
        B(Ws, 0.07, 0.002, 0.07, NAVY, mx, yt + 0.001, kz);
        B(Ws, 0.024, 0.012, 0.04, "#e2e8f0", mx, yt + 0.008, kz, { m: 0.3 });
        C(Ws, 0.003, 0.008, CYAN, mx, yt + 0.0145, kz - 0.008, { rz: 90, seg: 8, e: CYAN, ei: 0.8 });
        // lembar Design Doc (input dari tahap Design)
        var Dd = sub(Ws, -0.11, yt + 0.001, -0.03, 12);
        B(Dd, 0.075, 0.002, 0.1, "#dbeafe", 0, 0.001, 0, { m: 0.05 });
        B(Dd, 0.06, 0.0015, 0.012, MID, 0, 0.0025, -0.035);
        B(Dd, 0.03, 0.0015, 0.03, SKY, -0.015, 0.0025, 0.0);
        B(Dd, 0.025, 0.0015, 0.006, SLATE, 0.02, 0.0025, -0.01);
        B(Dd, 0.025, 0.0015, 0.006, SLATE, 0.02, 0.0025, 0.004);
        // mug kopi
        C(Ws, 0.02, 0.04, WHT, -0.1, yt + 0.02, -0.14);
        C(Ws, 0.0205, 0.006, CYAN, -0.1, yt + 0.026, -0.14, { e: CYAN, ei: 0.5 });
        C(Ws, 0.017, 0.002, "#7c4a2d", -0.1, yt + 0.039, -0.14);
        part(Ws, "primitive: torus; radius: " + n(0.011) + "; radiusTubular: " + n(0.003) +
            "; segmentsRadial: 6; segmentsTubular: 12", WHT, -0.079, yt + 0.02, -0.14);
        // CPU tower dengan kipas berputar
        var Cp = sub(Ws, -0.2, 0, -0.12, 0);
        B(Cp, 0.07, 0.17, 0.15, NAVY, 0, 0.085, 0, { m: 0.4, r: 0.35 });
        B(Cp, 0.06, 0.15, 0.003, DEEP, 0, 0.085, 0.0765);
        B(Cp, 0.05, 0.008, 0.002, "#0f172a", 0, 0.13, 0.0785);
        C(Cp, 0.007, 0.004, CYAN, -0.02, 0.15, 0.0785, { rx: 90, e: CYAN, ei: 0.9 });
        B(Cp, 0.004, 0.11, 0.002, CYAN, 0.026, 0.08, 0.0785, glow(0.9));
        part(Cp, "primitive: torus; radius: " + n(0.022) + "; radiusTubular: " + n(0.002) +
            "; segmentsRadial: 6; segmentsTubular: 24", CYAN, 0, 0.065, 0.0785, glow(0.8));
        B(Cp, 0.038, 0.005, 0.002, SKY, 0, 0.065, 0.0795, {
            anim: "property: rotation; to: 0 0 360; loop: true; dur: 1500; easing: linear",
        });
        B(Cp, 0.038, 0.005, 0.002, SKY, 0, 0.065, 0.0795, {
            rz: 90, anim: "property: rotation; to: 0 0 450; loop: true; dur: 1500; easing: linear",
        });

        // ============================================================
        //  C. FRONTEND DEVELOPMENT  (tengah-belakang): browser window
        // ============================================================
        var Fe = frame(0.09, Y0, -0.205, -8);
        B(Fe, 0.12, 0.008, 0.07, "#cbd5e1", 0, 0.004, 0);
        B(Fe, 0.02, 0.04, 0.014, SLATE, 0, 0.028, 0);
        B(Fe, 0.3, 0.2, 0.012, NAVY, 0, 0.15, 0, { m: 0.4, r: 0.35 });
        B(Fe, 0.28, 0.18, 0.004, WHT, 0, 0.15, 0.0085, { m: 0.05, r: 0.8 });
        var fz = 0.012, fz2 = 0.014;
        B(Fe, 0.28, 0.022, 0.003, "#e2e8f0", 0, 0.229, fz);                              // chrome browser
        Sp(Fe, 0.004, "#fb7185", -0.125, 0.229, fz2);
        Sp(Fe, 0.004, YEL, -0.112, 0.229, fz2);
        Sp(Fe, 0.004, GRN, -0.099, 0.229, fz2);
        B(Fe, 0.15, 0.012, 0.003, "#ffffff", 0.02, 0.229, fz2, { text: txt("localhost", "#334155", 0.1, 16) });
        Sp(Fe, 0.005, GRN, 0.115, 0.229, fz2 + 0.002, { e: GRN, ei: 0.9, anim: pulse(700) }); // indikator live
        B(Fe, 0.28, 0.024, 0.003, BLUE, 0, 0.206, fz);                                   // navbar
        B(Fe, 0.014, 0.012, 0.003, CYAN, -0.12, 0.206, fz2, glow(0.6));
        for (i = 0; i < 3; i++) { B(Fe, 0.03, 0.006, 0.003, PALE, -0.05 + i * 0.045, 0.206, fz2); }
        C(Fe, 0.008, 0.003, SKY, 0.12, 0.206, fz2, { rx: 90 });
        B(Fe, 0.055, 0.134, 0.003, "#dbeafe", -0.1125, 0.127, fz);                       // sidebar
        for (i = 0; i < 4; i++) { B(Fe, 0.035, 0.006, 0.003, i === 1 ? CYAN : SKY, -0.1125, 0.18 - i * 0.02, fz2); }
        B(Fe, 0.15, 0.05, 0.003, MID, 0.03, 0.165, fz);                                  // hero
        B(Fe, 0.07, 0.008, 0.003, WHT, 0.0, 0.178, fz2);
        B(Fe, 0.05, 0.005, 0.003, SKY, -0.01, 0.166, fz2);
        B(Fe, 0.034, 0.012, 0.003, CYAN, -0.018, 0.151, fz2, { e: CYAN, ei: 0.6, text: txt("Start", NAVY, 0.028, 6) });
        C(Fe, 0.014, 0.003, PALE, 0.08, 0.165, fz2, { rx: 90 });
        var cardCol = [SKY, CYAN, AMBER];
        for (i = 0; i < 3; i++) {                                                          // content card
            x = -0.0525 + i * 0.075;
            B(Fe, 0.065, 0.06, 0.003, ICE, x, 0.097, fz);
            C(Fe, 0.007, 0.003, cardCol[i], x, 0.115, fz2, { rx: 90, e: cardCol[i], ei: 0.4 });
            B(Fe, 0.045, 0.005, 0.003, SLATE, x, 0.099, fz2);
            B(Fe, 0.03, 0.004, 0.003, PALE, x, 0.09, fz2);
        }
        cone(Fe, 0.007, 0.03, AMBER, -0.0014, 0.1377, 0.03, {                              // kursor klik
            rz: 35, e: AMBER, ei: 0.3,
            anim: mv(Fe(-0.0014, 0.1377, 0.03), Fe(-0.0014, 0.1377, 0.02), 900, { alt: true, ease: "easeInOutSine" }),
        });

        // ============================================================
        //  D. BACKEND DEVELOPMENT  (kanan-belakang): server rack + API + service
        // ============================================================
        var Sv = frame(0.44, Y0, -0.205, 0);
        for (i = 0; i < 4; i++) {
            var sy = 0.015 + i * 0.034;
            B(Sv, 0.1, 0.03, 0.07, DEEP, 0, sy, -0.04, { m: 0.4, r: 0.4 });
            Sp(Sv, 0.004, CYAN, -0.036, sy, -0.0035, { e: CYAN, ei: 1, anim: blink(450 + i * 170) });
            B(Sv, 0.045, 0.004, 0.002, SKY, 0.01, sy + 0.005, -0.0045);
            B(Sv, 0.045, 0.004, 0.002, SKY, 0.01, sy - 0.005, -0.0045);
        }
        B(Sv, 0.102, 0.005, 0.072, SKY, 0, 0.1345, -0.04);
        // mikroservice terhubung ke rack
        Sp(Sv, 0.014, CYAN, -0.09, 0.02, 0.04, glow(0.8));
        part(Sv, "primitive: octahedron; radius: " + n(0.02), SKY, 0.09, 0.02, 0.04, { wire: true, e: SKY, ei: 0.6, anim: spinY(7000) });
        seg(Sv(-0.05, 0.02, -0.04), Sv(-0.09, 0.02, 0.04), CYAN, 0.0025, glow(0.8));
        seg(Sv(0.05, 0.02, -0.04), Sv(0.09, 0.02, 0.04), CYAN, 0.0025, glow(0.8));
        // API gateway di antara frontend dan backend
        C(W, 0.025, 0.008, "#0e7490", 0.285, Y0 + 0.004, -0.205, { seg: 6 });
        C(W, 0.021, 0.004, CYAN, 0.285, Y0 + 0.01, -0.205, { seg: 6, e: CYAN, ei: 0.7 });
        part(W, "primitive: octahedron; radius: " + n(0.02), CYAN, 0.285, Y0 + 0.05, -0.205,
            { wire: true, e: CYAN, ei: 0.6, anim: spinY(8000) });
        tag(W, "API", 0.285, Y0 + 0.013, -0.15, 0.06);

        // ============================================================
        //  E. DATABASE INTEGRATION  (kanan-depan)
        // ============================================================
        var Db = frame(0.44, Y0, 0.205, 0);
        var St = sub(Db, 0, 0, -0.04, 0);
        for (i = 0; i < 3; i++) {
            C(St, 0.065, 0.032, BLUE, 0, 0.016 + i * 0.038, 0, { seg: 32, m: 0.3, r: 0.4 });
            B(St, 0.03, 0.005, 0.002, CYAN, 0, 0.016 + i * 0.038, 0.066, glow(1));
        }
        for (i = 0; i < 2; i++) { C(St, 0.0665, 0.006, CYAN, 0, 0.035 + i * 0.038, 0, { seg: 32, e: CYAN, ei: 0.8 }); }
        C(St, 0.065, 0.004, PALE, 0, 0.11, 0, { seg: 32 });
        // tabel hasil query
        var Dt = sub(Db, 0, 0, 0.1, 0);
        B(Dt, 0.1, 0.012, 0.075, ICE, 0, 0.006, 0);
        B(Dt, 0.1, 0.003, 0.018, MID, 0, 0.0135, -0.0285);
        Sp(Dt, 0.004, CYAN, -0.04, 0.0165, -0.0285, glow(1));
        for (i = 0; i < 3; i++) { B(Dt, 0.085, 0.002, 0.006, SKY, 0, 0.013, -0.006 + i * 0.014); }
        seg(Db(0, 0.01, 0.025), Db(0, 0.01, 0.0625), CYAN, 0.003, glow(0.9));

        // ============================================================
        //  BUILD & RUN (tengah-depan): kode diterjemahkan menjadi aplikasi berjalan
        // ============================================================
        var Bc = frame(0.11, Y0, 0.205, 0);
        C(Bc, 0.07, 0.01, "#0e7490", 0, 0.005, 0, { seg: 6 });
        C(Bc, 0.06, 0.004, NAVY, 0, 0.012, 0, { seg: 6 });
        C(Bc, 0.045, 0.003, CYAN, 0, 0.0145, 0, { seg: 6, e: CYAN, ei: 0.7 });
        part(Bc, "primitive: torusKnot; radius: " + n(0.03) + "; radiusTubular: " + n(0.006) +
            "; p: 2; q: 3; segmentsRadial: 8; segmentsTubular: 64", CYAN, 0, 0.075, 0,
            { wire: true, e: CYAN, ei: 0.7, anim: spinY(6000) });
        part(Bc, "primitive: octahedron; radius: " + n(0.014), MID, 0, 0.075, 0, { e: MID, ei: 0.6 });
        part(Bc, "primitive: torus; radius: " + n(0.055) + "; radiusTubular: " + n(0.0025) +
            "; segmentsRadial: 6; segmentsTubular: 32", "#ffffff", 0, 0.075, 0, {
            rx: 72, e: "#ffffff", ei: 0.4,
            anim: "property: rotation; to: 72 360 0; loop: true; dur: 5000; easing: linear",
        });
        tag(Bc, "Build & Run", 0, 0.013, 0.12, 0.14);

        // ============================================================
        //  KONEKTOR + PAKET DATA (alur: kode -> build -> frontend -> API -> backend -> database)
        // ============================================================
        var yl = Y0 + 0.012, yp = Y0 + 0.024;
        // kode -> build
        seg([-0.07, yl, -0.05], [0.045, yl, 0.19], CYAN, 0.004, glow(0.9));
        Sp(W, 0.007, "#ffffff", -0.07, yl, -0.05, glow(1));
        pkt([-0.07, yp, -0.05], [0.045, yp, 0.19], "#ffffff", 2400);
        // build -> frontend
        seg([0.1, yl, 0.135], [0.1, yl, -0.165], CYAN, 0.004, glow(0.9));
        pkt([0.1, yp, 0.135], [0.1, yp, -0.165], CYAN, 2200);
        // frontend -> API -> backend
        seg([0.15, yl, -0.205], [0.26, yl, -0.205], CYAN, 0.004, glow(0.9));
        seg([0.31, yl, -0.205], [0.39, yl, -0.205], CYAN, 0.004, glow(0.9));
        pkt([0.15, yp, -0.205], [0.39, yp, -0.205], "#ffffff", 2200);
        pkt([0.39, yp + 0.008, -0.205], [0.15, yp + 0.008, -0.205], AMBER, 2200, { delay: 1100 });
        // backend -> database
        seg(Sv(0, 0.012, -0.005), Db(0, 0.012, -0.105), CYAN, 0.004, glow(0.9));
        pkt(Sv(0, 0.024, -0.005), Db(0, 0.024, -0.105), "#ffffff", 2400, { alt: true, ease: "easeInOutSine" });

        // ============================================================
        //  LABEL + CALLOUT (konsisten: panel navy, border cyan, teks putih)
        // ============================================================
        var tipSrc = M(0, 0.124, 0);
        var tipFe = Fe(0, 0.256, 0);
        var tipBe = Sv(0, 0.14, -0.04);
        var tipDb = St(0, 0.114, 0);
        callout("Source Code", tipSrc[0], 0.34, -0.25, tipSrc);
        callout("Frontend Development", tipFe[0], 0.47, -0.25, tipFe);
        callout("Backend Development", tipBe[0], 0.34, -0.25, tipBe);
        callout("Database Integration", 0.69, 0.08, 0.3, tipDb);

        return stageWrap(items);
    },
    // 4. TESTING — dokumen + bug merah + kaca pembesar + centang
    testing: function () {
    // Helper untuk membuat label dengan connector line
    const createLabel = (text, position, targetPosition) => {
        const labelHeight = 0.08;
        const labelY = parseFloat(position.split(' ')[1]) + labelHeight;
        
        return [
            // Label background
            stageBox(0.18, 0.04, 0.01, "#1e293b", position, { 
                opacity: 0.9 
            }),
            // Label text (menggunakan plane dengan text component)
            stageEntity({
                geometry: "primitive: plane; width: 0.17; height: 0.035",
                material: `color: #ffffff; shader: flat; transparent: true`,
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) + 0.001} ${parseFloat(position.split(' ')[2]) + 0.006}`,
                text: `value: ${text}; color: #ffffff; align: center; width: 0.17; font: mozillavr`,
            }),
            // Connector line (vertical)
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.003; height: 0.06",
                material: "color: #64748b; opacity: 0.7",
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) - 0.03} ${position.split(' ')[2]}`,
            }),
            // Connector dot at target
            stageEntity({
                geometry: "primitive: sphere; radius: 0.008",
                material: "color: #3b82f6",
                position: targetPosition,
            }),
        ];
    };

    // Flatten array helper
    const flatten = (arr) => arr.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);

    return stageWrap(flatten([
        // === BASE PLATFORM ===
        stageBox(0.8, 0.02, 0.8, "#0f172a", "0 -0.15 0", { 
            opacity: 0.3 
        }),

        // === 1. APPLICATION UNDER TEST (Monitor) ===
        // Monitor frame
        stageBox(0.28, 0.2, 0.02, "#1e293b", "0 0.15 -0.15"),
        // Screen
        stageBox(0.25, 0.17, 0.01, "#f1f5f9", "0 0.16 -0.14"),
        // UI Elements on screen
        // Navigation bar
        stageBox(0.23, 0.02, 0.005, "#3b82f6", "0 0.22 -0.135"),
        // Logo placeholder
        stageBox(0.03, 0.015, 0.005, "#ffffff", "-0.09 0.22 -0.134"),
        // Nav items
        stageBox(0.02, 0.01, 0.005, "#ffffff", "-0.04 0.22 -0.134"),
        stageBox(0.02, 0.01, 0.005, "#ffffff", "0 0.22 -0.134"),
        stageBox(0.02, 0.01, 0.005, "#ffffff", "0.04 0.22 -0.134"),
        // Content cards
        stageBox(0.07, 0.05, 0.005, "#e2e8f0", "-0.07 0.14 -0.135"),
        stageBox(0.07, 0.05, 0.005, "#e2e8f0", "0 0.14 -0.135"),
        stageBox(0.07, 0.05, 0.005, "#e2e8f0", "0.07 0.14 -0.135"),
        // Buttons
        stageBox(0.04, 0.015, 0.005, "#10b981", "-0.07 0.1 -0.135"),
        stageBox(0.04, 0.015, 0.005, "#3b82f6", "0 0.1 -0.135"),
        // Input field
        stageBox(0.08, 0.015, 0.005, "#ffffff", "0.07 0.1 -0.135"),
        // Monitor stand
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.08",
            material: "color: #475569",
            position: "0 0.01 -0.15",
        }),
        // Monitor base
        stageBox(0.08, 0.01, 0.06, "#334155", "0 -0.03 -0.15"),

        // === 2. BUG DETECTION (Magnifying Glass + Bug) ===
        // Magnifying glass lens
        stageEntity({
            geometry: "primitive: torus; radius: 0.06; tube: 0.008",
            material: "color: #0ea5e9",
            position: "-0.25 0.2 0.05",
            rotation: "0 0 0",
        }),
        // Glass lens (transparent)
        stageEntity({
            geometry: "primitive: circle; radius: 0.055",
            material: "color: #bae6fd; opacity: 0.3; side: double",
            position: "-0.25 0.2 0.05",
        }),
        // Magnifying glass handle
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.012; height: 0.12",
            material: "color: #0369a1",
            position: "-0.32 0.12 0.05",
            rotation: "0 0 45",
        }),
        // Bug body
        stageEntity({
            geometry: "primitive: sphere; radius: 0.035",
            material: "color: #dc2626",
            position: "-0.25 0.2 0.06",
        }),
        // Bug head
        stageEntity({
            geometry: "primitive: sphere; radius: 0.02",
            material: "color: #991b1b",
            position: "-0.25 0.24 0.06",
        }),
        // Bug antennae
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.003; height: 0.04",
            material: "color: #7f1d1d",
            position: "-0.26 0.27 0.06",
            rotation: "0 0 20",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.003; height: 0.04",
            material: "color: #7f1d1d",
            position: "-0.24 0.27 0.06",
            rotation: "0 0 -20",
        }),
        // Bug legs
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.003; height: 0.03",
            material: "color: #7f1d1d",
            position: "-0.28 0.2 0.06",
            rotation: "0 0 90",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.003; height: 0.03",
            material: "color: #7f1d1d",
            position: "-0.22 0.2 0.06",
            rotation: "0 0 90",
        }),
        // Error indicator (red circle with X)
        stageEntity({
            geometry: "primitive: circle; radius: 0.025",
            material: "color: #ef4444",
            position: "-0.2 0.15 0.06",
        }),
        stageBox(0.025, 0.005, 0.005, "#ffffff", "-0.2 0.15 0.065", { 
            rotation: "0 0 45" 
        }),
        stageBox(0.025, 0.005, 0.005, "#ffffff", "-0.2 0.15 0.065", { 
            rotation: "0 0 -45" 
        }),

        // === 3. TEST CASE CHECKLIST ===
        // Checklist panel
        stageBox(0.2, 0.25, 0.02, "#1e293b", "0.28 0.15 0"),
        // Panel header
        stageBox(0.18, 0.03, 0.005, "#3b82f6", "0.28 0.25 0.011"),
        // Checklist items
        // Item 1 - Passed (green check)
        stageBox(0.16, 0.025, 0.005, "#334155", "0.28 0.2 0.011"),
        stageBox(0.015, 0.015, 0.005, "#10b981", "0.21 0.2 0.012"),
        stageBox(0.008, 0.003, 0.005, "#ffffff", "0.21 0.2 0.013", { 
            rotation: "0 0 45" 
        }),
        stageBox(0.012, 0.003, 0.005, "#ffffff", "0.21 0.2 0.013", { 
            rotation: "0 0 -45" 
        }),
        // Item 2 - Passed
        stageBox(0.16, 0.025, 0.005, "#334155", "0.28 0.16 0.011"),
        stageBox(0.015, 0.015, 0.005, "#10b981", "0.21 0.16 0.012"),
        stageBox(0.008, 0.003, 0.005, "#ffffff", "0.21 0.16 0.013", { 
            rotation: "0 0 45" 
        }),
        stageBox(0.012, 0.003, 0.005, "#ffffff", "0.21 0.16 0.013", { 
            rotation: "0 0 -45" 
        }),
        // Item 3 - Failed (red X)
        stageBox(0.16, 0.025, 0.005, "#334155", "0.28 0.12 0.011"),
        stageBox(0.015, 0.015, 0.005, "#ef4444", "0.21 0.12 0.012"),
        stageBox(0.012, 0.003, 0.005, "#ffffff", "0.21 0.12 0.013", { 
            rotation: "0 0 45" 
        }),
        stageBox(0.012, 0.003, 0.005, "#ffffff", "0.21 0.12 0.013", { 
            rotation: "0 0 -45" 
        }),
        // Item 4 - Passed
        stageBox(0.16, 0.025, 0.005, "#334155", "0.28 0.08 0.011"),
        stageBox(0.015, 0.015, 0.005, "#10b981", "0.21 0.08 0.012"),
        stageBox(0.008, 0.003, 0.005, "#ffffff", "0.21 0.08 0.013", { 
            rotation: "0 0 45" 
        }),
        stageBox(0.012, 0.003, 0.005, "#ffffff", "0.21 0.08 0.013", { 
            rotation: "0 0 -45" 
        }),
        // Text lines (simulated)
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.3 0.2 0.012"),
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.3 0.16 0.012"),
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.3 0.12 0.012"),
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.3 0.08 0.012"),

        // === 4. AUTOMATED TESTING (Robot + Gears) ===
        // Robot body
        stageBox(0.08, 0.1, 0.06, "#0ea5e9", "-0.15 0.05 -0.25"),
        // Robot head
        stageBox(0.06, 0.05, 0.05, "#0284c7", "-0.15 0.13 -0.25"),
        // Robot eyes
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "-0.16 0.14 -0.22",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "-0.14 0.14 -0.22",
        }),
        // Robot antenna
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.003; height: 0.03",
            material: "color: #475569",
            position: "-0.15 0.17 -0.25",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #ef4444; emissive: #ef4444; emissiveIntensity: 0.5",
            position: "-0.15 0.19 -0.25",
        }),
        // Robot arms
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.01; height: 0.08",
            material: "color: #0369a1",
            position: "-0.2 0.05 -0.25",
            rotation: "0 0 30",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.01; height: 0.08",
            material: "color: #0369a1",
            position: "-0.1 0.05 -0.25",
            rotation: "0 0 -30",
        }),
        // Gears
        stageEntity({
            geometry: "primitive: torus; radius: 0.04; tube: 0.01",
            material: "color: #f59e0b",
            position: "-0.05 0.08 -0.25",
            rotation: "90 0 0",
        }),
        stageEntity({
            geometry: "primitive: torus; radius: 0.03; tube: 0.008",
            material: "color: #fbbf24",
            position: "-0.05 0.02 -0.25",
            rotation: "90 0 0",
        }),
        // Terminal/Screen
        stageBox(0.1, 0.08, 0.01, "#1e293b", "-0.15 -0.05 -0.28"),
        stageBox(0.09, 0.06, 0.005, "#0f172a", "-0.15 -0.05 -0.275"),
        // Code lines on terminal
        stageBox(0.06, 0.005, 0.005, "#10b981", "-0.17 -0.03 -0.27"),
        stageBox(0.05, 0.005, 0.005, "#3b82f6", "-0.16 -0.05 -0.27"),
        stageBox(0.07, 0.005, 0.005, "#f59e0b", "-0.18 -0.07 -0.27"),

        // === 5. VALIDATION RESULTS (Dashboard) ===
        // Dashboard panel
        stageBox(0.22, 0.18, 0.02, "#1e293b", "0.15 -0.05 0.2"),
        // Dashboard header
        stageBox(0.2, 0.025, 0.005, "#3b82f6", "0.15 0.02 0.211"),
        // Results bars
        // Passed bar (green)
        stageBox(0.15, 0.02, 0.005, "#10b981", "0.12 -0.02 0.211"),
        // Failed bar (red)
        stageBox(0.05, 0.02, 0.005, "#ef4444", "0.05 -0.02 0.211"),
        // Status indicators
        stageEntity({
            geometry: "primitive: sphere; radius: 0.015",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.3",
            position: "0.08 -0.06 0.211",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.015",
            material: "color: #ef4444; emissive: #ef4444; emissiveIntensity: 0.3",
            position: "0.15 -0.06 0.211",
        }),
        // Percentage indicators
        stageBox(0.04, 0.015, 0.005, "#10b981", "0.08 -0.09 0.211"),
        stageBox(0.04, 0.015, 0.005, "#ef4444", "0.15 -0.09 0.211"),
        // Chart lines
        stageBox(0.005, 0.1, 0.005, "#475569", "0.05 -0.05 0.211"),
        stageBox(0.15, 0.005, 0.005, "#475569", "0.12 -0.1 0.211"),

        // === LABELS WITH CONNECTORS ===
        // Label 1: Application Under Test
        ...createLabel("Application Under Test", "0 0.35 -0.15", "0 0.25 -0.14"),
        
        // Label 2: Bug Detection
        ...createLabel("Bug Detection", "-0.25 0.35 0.05", "-0.25 0.24 0.06"),
        
        // Label 3: Test Case Checklist
        ...createLabel("Test Case Checklist", "0.28 0.35 0", "0.28 0.27 0.01"),
        
        // Label 4: Automated Testing
        ...createLabel("Automated Testing", "-0.15 0.28 -0.25", "-0.15 0.18 -0.25"),
        
        // Label 5: Validation Results
        ...createLabel("Validation Results", "0.15 0.15 0.2", "0.15 0.04 0.21"),
    ]));
},
    // 5. DEPLOYMENT — roket lepas landas + api berkedip
    deployment: function () {
    // Helper untuk membuat label dengan connector line
    const createLabel = (text, position, targetPosition) => {
        const labelHeight = 0.08;
        
        return [
            // Label background
            stageBox(0.18, 0.04, 0.01, "#1e293b", position, { 
                opacity: 0.9 
            }),
            // Label text
            stageEntity({
                geometry: "primitive: plane; width: 0.17; height: 0.035",
                material: `color: #ffffff; shader: flat; transparent: true`,
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) + 0.001} ${parseFloat(position.split(' ')[2]) + 0.006}`,
                text: `value: ${text}; color: #ffffff; align: center; width: 0.17; font: mozillavr`,
            }),
            // Connector line (vertical)
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.003; height: 0.06",
                material: "color: #64748b; opacity: 0.7",
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) - 0.03} ${position.split(' ')[2]}`,
            }),
            // Connector dot at target
            stageEntity({
                geometry: "primitive: sphere; radius: 0.008",
                material: "color: #3b82f6",
                position: targetPosition,
            }),
        ];
    };

    // Flatten array helper
    const flatten = (arr) => arr.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);

    return stageWrap(flatten([
        // === BASE PLATFORM ===
        stageBox(0.9, 0.02, 0.9, "#0f172a", "0 -0.15 0", { 
            opacity: 0.3 
        }),

        // === 1. APPLICATION RELEASE (Package/Container) ===
        // Container box
        stageBox(0.15, 0.18, 0.15, "#1e293b", "-0.35 0.05 0"),
        // Container lid
        stageBox(0.16, 0.02, 0.16, "#3b82f6", "-0.35 0.15 0"),
        // Code symbol </>
        stageBox(0.008, 0.06, 0.005, "#10b981", "-0.38 0.08 0.076"),
        stageBox(0.008, 0.06, 0.005, "#10b981", "-0.32 0.08 0.076"),
        stageBox(0.04, 0.008, 0.005, "#10b981", "-0.35 0.08 0.076"),
        // Package tape
        stageBox(0.15, 0.015, 0.005, "#f59e0b", "-0.35 0.12 0.076"),
        // Release arrow
        stageEntity({
            geometry: "primitive: cone; radius: 0.02; height: 0.04",
            material: "color: #10b981",
            position: "-0.35 0.2 0",
            rotation: "0 0 0",
        }),

        // === 2. DEPLOYMENT PIPELINE ===
        // Pipeline track
        stageBox(0.25, 0.02, 0.04, "#334155", "-0.15 -0.05 0"),
        // Pipeline nodes
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #3b82f6; emissive: #3b82f6; emissiveIntensity: 0.3",
            position: "-0.25 -0.04 0",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #3b82f6; emissive: #3b82f6; emissiveIntensity: 0.3",
            position: "-0.15 -0.04 0",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #3b82f6; emissive: #3b82f6; emissiveIntensity: 0.3",
            position: "-0.05 -0.04 0",
        }),
        // Directional arrows
        stageEntity({
            geometry: "primitive: cone; radius: 0.015; height: 0.03",
            material: "color: #10b981",
            position: "-0.2 -0.04 0",
            rotation: "0 0 90",
        }),
        stageEntity({
            geometry: "primitive: cone; radius: 0.015; height: 0.03",
            material: "color: #10b981",
            position: "-0.1 -0.04 0",
            rotation: "0 0 90",
        }),

        // === 3. PRODUCTION SERVER (Server Rack) ===
        // Server cabinet
        stageBox(0.18, 0.3, 0.12, "#1e293b", "0.05 0.05 0"),
        // Server units
        stageBox(0.16, 0.04, 0.005, "#0f172a", "0.05 0.15 0.061"),
        stageBox(0.16, 0.04, 0.005, "#0f172a", "0.05 0.09 0.061"),
        stageBox(0.16, 0.04, 0.005, "#0f172a", "0.05 0.03 0.061"),
        stageBox(0.16, 0.04, 0.005, "#0f172a", "0.05 -0.03 0.061"),
        // Indicator lights (green = active)
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "0.1 0.15 0.065",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "0.1 0.09 0.065",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "0.1 0.03 0.065",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.008",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "0.1 -0.03 0.065",
        }),
        // Network ports
        stageBox(0.015, 0.015, 0.005, "#3b82f6", "-0.02 0.15 0.065"),
        stageBox(0.015, 0.015, 0.005, "#3b82f6", "-0.02 0.09 0.065"),
        stageBox(0.015, 0.015, 0.005, "#3b82f6", "-0.02 0.03 0.065"),
        stageBox(0.015, 0.015, 0.005, "#3b82f6", "-0.02 -0.03 0.065"),
        // Server ventilation
        stageBox(0.14, 0.005, 0.005, "#475569", "0.05 -0.08 0.061"),

        // === 4. CLOUD DEPLOYMENT ===
        // Cloud shape (multiple spheres)
        stageEntity({
            geometry: "primitive: sphere; radius: 0.08",
            material: "color: #0ea5e9; opacity: 0.8",
            position: "0.05 0.35 0",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.06",
            material: "color: #0ea5e9; opacity: 0.8",
            position: "-0.03 0.33 0",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.06",
            material: "color: #0ea5e9; opacity: 0.8",
            position: "0.13 0.33 0",
        }),
        stageEntity({
            geometry: "primitive: sphere; radius: 0.05",
            material: "color: #0ea5e9; opacity: 0.8",
            position: "0.05 0.3 0.05",
        }),
        // Cloud to server connection
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.005; height: 0.15",
            material: "color: #3b82f6; opacity: 0.6",
            position: "0.05 0.25 0",
        }),
        // Upload arrow
        stageEntity({
            geometry: "primitive: cone; radius: 0.015; height: 0.03",
            material: "color: #10b981",
            position: "0.05 0.22 0",
            rotation: "180 0 0",
        }),

        // === 5. LIVE APPLICATION (Monitor) ===
        // Monitor frame
        stageBox(0.2, 0.15, 0.02, "#1e293b", "0.35 0.1 0"),
        // Screen
        stageBox(0.18, 0.13, 0.01, "#f1f5f9", "0.35 0.11 0.01"),
        // App UI elements
        stageBox(0.16, 0.015, 0.005, "#3b82f6", "0.35 0.16 0.016"),
        stageBox(0.05, 0.04, 0.005, "#e2e8f0", "0.3 0.1 0.016"),
        stageBox(0.05, 0.04, 0.005, "#e2e8f0", "0.37 0.1 0.016"),
        // Live badge (green)
        stageEntity({
            geometry: "primitive: sphere; radius: 0.012",
            material: "color: #10b981; emissive: #10b981; emissiveIntensity: 0.5",
            position: "0.42 0.16 0.016",
        }),
        // Monitor stand
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.015; height: 0.06",
            material: "color: #475569",
            position: "0.35 -0.01 0",
        }),
        // Monitor base
        stageBox(0.06, 0.008, 0.05, "#334155", "0.35 -0.05 0"),

        // === 6. USER ACCESS (Smartphone) ===
        // Phone body
        stageBox(0.08, 0.14, 0.01, "#1e293b", "0.35 -0.1 0.15"),
        // Phone screen
        stageBox(0.07, 0.12, 0.005, "#f1f5f9", "0.35 -0.1 0.156"),
        // App on phone
        stageBox(0.06, 0.01, 0.005, "#3b82f6", "0.35 -0.05 0.157"),
        stageBox(0.05, 0.03, 0.005, "#e2e8f0", "0.35 -0.1 0.157"),
        // Connection line from server to phone
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.004; height: 0.12",
            material: "color: #10b981; opacity: 0.5",
            position: "0.2 -0.05 0.08",
            rotation: "0 45 0",
        }),
        // User icon
        stageEntity({
            geometry: "primitive: sphere; radius: 0.015",
            material: "color: #3b82f6",
            position: "0.35 -0.02 0.15",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.01; height: 0.02",
            material: "color: #3b82f6",
            position: "0.35 -0.04 0.15",
        }),

        // === OPTIONAL: Rocket (Secondary Element) ===
        // Small rocket indicating successful release
        stageEntity({
            geometry: "primitive: cone; radius: 0.02; height: 0.06",
            material: "color: #f97316",
            position: "-0.35 0.25 0.1",
            rotation: "0 0 0",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.04",
            material: "color: #f8fafc",
            position: "-0.35 0.2 0.1",
        }),
        stageEntity({
            geometry: "primitive: cone; radius: 0.015; height: 0.03",
            material: "color: #ef4444; emissive: #ef4444; emissiveIntensity: 0.5",
            position: "-0.35 0.17 0.1",
            rotation: "180 0 0",
        }),

        // === LABELS WITH CONNECTORS ===
        // Label 1: Application Release
        ...createLabel("Application Release", "-0.35 0.35 0", "-0.35 0.2 0"),
        
        // Label 2: Deployment Pipeline
        ...createLabel("Deployment Pipeline", "-0.15 0.1 0", "-0.15 -0.04 0"),
        
        // Label 3: Production Server
        ...createLabel("Production Server", "0.05 0.35 0.15", "0.05 0.2 0.06"),
        
        // Label 4: Cloud Deployment
        ...createLabel("Cloud Deployment", "0.05 0.5 0", "0.05 0.35 0"),
        
        // Label 5: Live Application
        ...createLabel("Live Application", "0.35 0.3 0", "0.35 0.18 0.01"),
        
        // Label 6: User Access
        ...createLabel("User Access", "0.35 0.1 0.25", "0.35 -0.02 0.15"),
    ]));
},
    // 6. MAINTENANCE — dua roda gigi (besar + kecil)
    maintenance: function () {
        const parts = [];
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            parts.push(stageBox(0.08, 0.08, 0.1, "#475569",
                (Math.cos(a) * 0.3).toFixed(3) + " " + (Math.sin(a) * 0.3).toFixed(3) + " 0",
                { rotation: "0 0 " + ((a * 180) / Math.PI).toFixed(1) }));
        }
        parts.push(stageEntity({
            geometry: "primitive: torus; radius: 0.24; tube: 0.07",
            material: "color: #64748b",
            position: "0 0.05 0",
        }));
        parts.push(stageEntity({
            geometry: "primitive: cylinder; radius: 0.08; height: 0.12",
            material: "color: #cbd5e1",
            position: "0 0.05 0",
            rotation: "90 0 0",
        }));
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            parts.push(stageBox(0.06, 0.06, 0.08, "#f59e0b",
                (0.34 + Math.cos(a) * 0.15).toFixed(3) + " " + (-0.32 + Math.sin(a) * 0.15).toFixed(3) + " 0.05",
                { rotation: "0 0 " + ((a * 180) / Math.PI).toFixed(1) }));
        }
        parts.push(stageEntity({
            geometry: "primitive: torus; radius: 0.14; tube: 0.05",
            material: "color: #fbbf24",
            position: "0.34 -0.32 0.05",
        }));
        return stageWrap(parts);
    },

    // 7. REVIEW — papan kanban 3 kolom + centang selesai
    review: function () {
        return stageWrap([
            stageBox(0.68, 0.52, 0.05, "#0f172a", "0 0.1 0"),
            stageBox(0.17, 0.36, 0.055, "#334155", "-0.22 0.1 0"),
            stageBox(0.17, 0.36, 0.055, "#2563eb", "0 0.1 0"),
            stageBox(0.17, 0.36, 0.055, "#16a34a", "0.22 0.1 0"),
            stageBox(0.11, 0.05, 0.06, "#f8fafc", "-0.22 0.18 0.03"),
            stageBox(0.11, 0.05, 0.06, "#f8fafc", "-0.22 0.02 0.03"),
            stageBox(0.11, 0.05, 0.06, "#dbeafe", "0 0.18 0.03"),
            stageBox(0.11, 0.05, 0.06, "#dcfce7", "0.22 0.18 0.03"),
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.09; height: 0.04",
                material: "color: #16a34a",
                position: "0.3 -0.3 0.1",
                rotation: "90 0 0",
            }),
            stageBox(0.06, 0.02, 0.05, "#ffffff", "0.28 -0.3 0.13", { rotation: "0 0 40" }),
            stageBox(0.1, 0.02, 0.05, "#ffffff", "0.31 -0.33 0.13", { rotation: "0 0 -50" }),
        ]);
    },
};

// Sembunyikan model tahap & tampilkan lagi model utama (panggil saat popup ditutup)
function hideStageModel() {
    stageToken++;
    stageStep = null;
    const stageEl = document.getElementById("stage-entity");
    const modelEl = document.getElementById("model-entity");
    if (stageEl) {
        while (stageEl.firstChild) stageEl.removeChild(stageEl.firstChild);
        stageEl.setAttribute("visible", false);
    }
    if (modelEl) modelEl.setAttribute("visible", true);
    hideStageCTA();
}

// Tukar tampilan: model utama off → model tahap on, view kembali tegak (mulus via lerp)
function activateStageSwap() {
    document.getElementById("model-entity").setAttribute("visible", false);
    document.getElementById("stage-entity").setAttribute("visible", true);
    resetView();
}

// Fit-kan GLB tahap ke ukuran standar (sama seperti normalizeModel utama)
function fitStageGltf(el) {
    try {
        const THREE = AFRAME.THREE;
        const root = el.object3D;
        root.position.set(0, 0, 0);
        root.scale.set(1, 1, 1);
        root.rotation.set(0, 0, 0);
        root.updateMatrixWorld(true);
        const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
        const box = new THREE.Box3();
        const tmp = new THREE.Box3();
        root.traverse((o) => {
            if (!o.isMesh || !o.geometry) return;
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            tmp.copy(o.geometry.boundingBox)
                .applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
            box.union(tmp);
        });
        if (box.isEmpty()) return;
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const fit = FIT_SIZE / maxDim;
        root.scale.setScalar(fit);
        root.position.copy(center).multiplyScalar(-fit);
        console.log("[Stage] GLB fit — size:", size.toArray().map((n) => n.toFixed(2)),
            "scale:", fit.toFixed(3));
    } catch (e) {
        console.warn("[Stage] fit GLB gagal:", e);
    }
}

// Titik masuk: dipanggil dari handleClick saat mesh dengan data admin diklik.
// Return true = model tahap sedang diproses/tampil → pakai tombol CTA;
// Return false = tidak ada model tahap → buka popup langsung (perilaku lama).
function showStageModel(step, meshName) {
    const stageEl = document.getElementById("stage-entity");
    if (!stageEl) return false;
    hideStageModel();          // bersihkan state lama + ambil token baru
    const token = stageToken;
    const url = step && step.stageModelUrl
        ? String(step.stageModelUrl).trim() : "";
    const type = detectStageType(meshName);

    if (url) {
        console.log("[Stage] Muat GLB tahap dari database:", url);
        stageStep = step;
        const child = document.createElement("a-entity");
        child.setAttribute("gltf-model", "url(" + url + ")");
        child.addEventListener("model-loaded", function () {
            if (token !== stageToken) return;   // sudah keluar mode tahap → batal
            fitStageGltf(child);
            activateStageSwap();
            console.log("[Stage] GLB tahap tampil");
        });
        child.addEventListener("model-error", function () {
            if (token !== stageToken) return;
            console.warn("[Stage] GLB gagal → fallback:", type || "tampilan normal");
            if (child.parentNode) child.parentNode.removeChild(child);
            if (type) {
                stageEl.appendChild(STAGE_BUILDERS[type]());
                activateStageSwap();
            }
        });
        stageEl.appendChild(child);
        return true;           // tampilan menyusul setelah model siap
    }

    if (type && STAGE_BUILDERS[type]) {
        stageStep = step;
        stageEl.appendChild(STAGE_BUILDERS[type]());
        activateStageSwap();
        console.log("[Stage] Model hardcode:", type, "| mesh:", meshName);
        return true;
    }
    console.log("[Stage] Tanpa model (URL kosong & tipe tak dikenal) → popup langsung");
    return false;
}
