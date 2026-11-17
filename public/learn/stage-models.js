/**
 * stage-models.js — Model 3D detail per tahap (Stage Model).
 *
 * DIPISAH dari ar.html. Berisi:
 *   - detectStageType()       deteksi slug tahap dari nama mesh (PER METODE —
 *                             RAD 4 / Agile 7 / Waterfall 5 sesuai rancangan)
 *   - detectMethod()          deteksi metode dari prefix mesh (WF_ / AG_ / RAD_)
 *   - stageKit()              kit diorama bersama (palet, frame, part, callout, platform)
 *   - STAGE_BUILDERS          registry kosong — ISI 16 builder tahap ada di
 *                             public/learn/stages/<metode>/<tahap>.js (dimuat SETELAH
 *                             file ini), key-nya "<metode>/<tahap>" mis. "rad/cutover"
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
 *   targetLost()    → TIDAK menyembunyikan apa pun (pose dibekukan oleh
 *                     patchTargetFreeze() di ar.html — model tetap tampil)
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
//  2. Model hardcode     → file public/learn/stages/<metode>/<tahap>.js (16 file sesuai
//     rancangan: RAD 4, Agile 7, Waterfall 5) dengan key "<metode>/<tahap>" — boleh beda per metode
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
    const method = detectMethod(n);
    // Slug tahap per metode — sesuai docs/Rancangan_Isi_Model_3D_Tahapan_SDLC
    if (method === "rad") {
        if (/IMPLEMENT|CUTOVER/.test(n)) return "cutover";          // RAD_IMPLEMENTATION
        if (/DEVELOP|CONSTRUCTION/.test(n)) return "construction";  // RAD_DEVELOPMENT
        if (/DESIGN/.test(n)) return "user-design";                // RAD_DESIGN
        if (/REQUIREMENT|PLANN/.test(n)) return "requirements-planning";
    } else if (method === "agile") {
        if (/LAUNCH|RELEASE/.test(n)) return "launch";
        if (/REVIEW/.test(n)) return "review";
        if (/DEPLOY/.test(n)) return "deploy";
        if (/TEST/.test(n)) return "test";
        if (/DEVELOP/.test(n)) return "develop";
        if (/DESIGN/.test(n)) return "design";
        if (/PLAN|BACKLOG/.test(n)) return "plan";
    } else if (method === "waterfall") {
        if (/MAINTENANCE/.test(n)) return "maintenance";
        if (/TEST/.test(n)) return "testing";
        if (/DEVELOP/.test(n)) return "development";
        if (/DESIGN/.test(n)) return "design";
        if (/REQUIREMENT|ANALYS/.test(n)) return "requirements-analysis";
    }
    return null;
}

// Deteksi metode dari prefix/segmen nama mesh (WF_ / AG_ / RAD_).
// Dipakai untuk memilih builder PER METODE: STAGE_BUILDERS["<metode>/<tahap>"].
function detectMethod(meshName) {
    const n = String(meshName || "").toUpperCase();
    if (/(^|_)RAD(_|$)/.test(n)) return "rad";
    if (/(^|_)AG(_|$)/.test(n)) return "agile";
    if (/(^|_)WF(_|$)/.test(n)) return "waterfall";
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

// Pembungkus wajib: platform dasar + grup STASIS (TANPA putar otomatis —
// model tahap harus stabil; putar/geser hanya lewat gesture user)
function stageWrap(children) {
    const g = stageEntity({});
    g.appendChild(stageEntity({
        geometry: "primitive: cylinder; radius: 0.6; height: 0.05",
        material: "color: #e2e8f0; roughness: 0.85",
        position: "0 -0.5 0",
    }));
    children.forEach((c) => g.appendChild(c));
    return g;
}

// ===== Kit diorama — gaya label callout + garis penunjuk (seperti tahap User Design RAD) =====
// Dipakai semua builder per tahap, agar helper tidak diduplikasi 16×:
//   var K = stageKit();  K.platform();  K.B(...)  ...  return stageWrap(K.items);
// Semua state (items, palet warna, frame world) di-close di dalam factory ini.
function stageKit() {
    var items = [];
    var NAVY = "#0b1f4d", DEEP = "#1e3a8a", BLUE = "#1d4ed8", MID = "#2563eb",
        SKY = "#60a5fa", PALE = "#bfdbfe", ICE = "#e0f2fe", WHITE = "#f8fafc",
        SLATE = "#94a3b8", CYAN = "#22d3ee", AMBER = "#fbbf24",
        GREEN = "#22c55e", RED = "#ef4444";
    function n(v) { return +(v).toFixed(4); }
    function pos(p) { return n(p[0]) + " " + n(p[1]) + " " + n(p[2]); }
    function r2(v) { return +v.toFixed(2); }
    // frame: titik lokal zona → koordinat dunia (rotasi Y + offset)
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
    var W = frame(0, 0, 0, 0);
    // part: tambahkan primitif ke items (dunia lokal frame f)
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
        part(f, "primitive: sphere; radius: " + n(r) +
            "; segmentsWidth: 12; segmentsHeight: 8", color, lx, ly, lz, o);
    }
    function orient(a, b) {
        var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        return {
            len: len,
            ux: dx / len, uy: dy / len, uz: dz / len,
            pitch: Math.acos(Math.max(-1, Math.min(1, dy / len))) * 180 / Math.PI,
            yaw: Math.atan2(dx, dz) * 180 / Math.PI,
        };
    }
    // garis lurus antar titik (dipakai callout pointer + kabel)
    function seg(a, b, color, r, o) {
        o = o || {};
        var k = orient(a, b);
        C(W, r, k.len, color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2,
            { rx: k.pitch, ry: k.yaw, seg: 6, e: o.e, ei: o.ei, m: 0.1 });
    }
    function mv(a, b, dur, o) {
        o = o || {};
        return "property: position; from: " + pos(a) + "; to: " + pos(b) +
            "; dur: " + dur + "; loop: true; easing: " + (o.ease || "linear") +
            (o.alt ? "; dir: alternate" : "") + (o.delay ? "; delay: " + o.delay : "");
    }
    function glow(ei) { return { e: CYAN, ei: ei || 0.8 }; }

    // ---------- prop bersama (dipakai lintas tahap) ----------
    // centang hijau (lis tiga kotak)
    function check(f, lx, ly, lz, s, color) {
        s = s || 0.02;
        B(f, s * 0.6, s * 0.28, s * 0.25, color || GREEN, lx - s * 0.3, ly - s * 0.08, lz, { rz: -50 });
        B(f, s * 1.1, s * 0.28, s * 0.25, color || GREEN, lx + s * 0.2, ly + s * 0.1, lz, { rz: 55 });
    }
    // figur orang: alas + badan + kepala + lengan (o.point: lengan kanan menunjuk)
    function person(f, lx, lz, o) {
        o = o || {};
        var s = o.s || 1, body = o.c || MID;
        B(f, 0.05 * s, 0.012 * s, 0.032 * s, DEEP, lx, 0.006 * s, lz);
        C(f, 0.027 * s, 0.064 * s, body, lx, 0.044 * s, lz, { seg: 12 });
        Sp(f, 0.021 * s, o.skin || "#fcd34d", lx, 0.092 * s, lz);
        if (o.arm !== "none") {
            B(f, 0.013 * s, 0.046 * s, 0.013 * s, body, lx + 0.037 * s, (o.point ? 0.076 : 0.05) * s, lz,
                { rz: o.point ? -75 : -20 });
            B(f, 0.013 * s, 0.046 * s, 0.013 * s, body, lx - 0.037 * s, 0.05 * s, lz, { rz: 20 });
        }
        return sub(f, lx, 0.092 * s, lz, 0);   // titik kepala (untuk aksesori)
    }
    // layar berdiri — return frame isi layar (pusat, sedikit di depan permukaan)
    function screen(f, w, h, o) {
        o = o || {};
        var x = o.x || 0, z = o.z || 0, y0 = o.y || 0;
        B(f, w * 0.45, 0.006, 0.045, SLATE, x, y0 + 0.003, z);
        B(f, 0.016, 0.05, 0.012, SLATE, x, y0 + 0.03, z);
        var cy = y0 + 0.05 + h / 2;
        B(f, w, h, 0.014, o.frame || NAVY, x, cy, z, { m: 0.35 });
        B(f, w - 0.02, h - 0.02, 0.004, o.bg || "#dbeafe", x, cy, z + 0.009, { m: 0.05, r: 0.8 });
        return sub(f, x, cy, z + 0.013, 0);
    }
    // papan berdiri (dua kaki, kop opsional) — return frame isi papan
    function board(f, w, h, o) {
        o = o || {};
        var x = o.x || 0, z = o.z || 0;
        B(f, 0.014, 0.05, 0.014, SLATE, x - w / 2 + 0.02, 0.025, z);
        B(f, 0.014, 0.05, 0.014, SLATE, x + w / 2 - 0.02, 0.025, z);
        var cy = 0.05 + h / 2;
        B(f, w, h, 0.012, o.frame || DEEP, x, cy, z, { m: 0.3 });
        B(f, w - 0.016, h - 0.016, 0.003, o.bg || WHITE, x, cy, z + 0.0075, { m: 0.05, r: 0.85 });
        if (o.htxt) {
            B(f, w - 0.016, 0.03, 0.004, o.hc || MID, x, cy + h / 2 - 0.02, z + 0.009, {
                text: "value: " + o.htxt + "; align: center; anchor: center; baseline: center; " +
                    "color: #ffffff; width: " + n(w - 0.03) + "; wrapCount: 12; zOffset: " + n(0.003),
            });
        } else if (o.head) {
            B(f, w - 0.016, 0.03, 0.004, o.hc || MID, x, cy + h / 2 - 0.02, z + 0.009);
        }
        return sub(f, x, cy, z + 0.011, 0);
    }
    // dokumen berdiri (kop + garis teks; opsional centang/tanda tangan)
    function doc(f, lx, ly, lz, o) {
        o = o || {};
        var w = o.w || 0.1, h = o.h || 0.13;
        B(f, w, h, 0.006, o.c || WHITE, lx, ly, lz, { m: 0.05, r: 0.85, ry: o.ry || 0 });
        var d = sub(f, lx, ly, lz, o.ry || 0);
        if (o.htxt) {
            B(d, w - 0.016, 0.02, 0.004, o.hc || MID, 0, h / 2 - 0.016, 0.004, {
                text: "value: " + o.htxt + "; align: center; anchor: center; baseline: center; " +
                    "color: #ffffff; width: " + n(w - 0.03) + "; wrapCount: 14; zOffset: " + n(0.003),
            });
        } else if (o.hc !== false) {
            B(d, w - 0.016, 0.02, 0.004, o.hc || MID, 0, h / 2 - 0.016, 0.004);
        }
        for (var j = 0; j < (o.lines === undefined ? 4 : o.lines); j++) {
            B(d, (w - 0.024) * (j % 2 ? 0.66 : 0.9), 0.006, 0.004, SLATE, -0.004, h / 2 - 0.042 - j * 0.015, 0.004);
        }
        if (o.chk) check(d, w / 2 - 0.024, h / 2 - 0.042, 0.005, 0.014, GREEN);
        if (o.sign) B(d, w * 0.5, 0.004, 0.004, SKY, -w * 0.06, -h / 2 + 0.018, 0.004, { rz: -6 });
        if (o.stamp) {
            C(d, 0.02, 0.006, GREEN, w * 0.2, -h / 2 + 0.026, 0.006, { seg: 16, e: GREEN, ei: 0.4 });
            B(d, 0.056, 0.02, 0.004, GREEN, w * 0.2, -h / 2 + 0.026, 0.007, {
                e: GREEN, ei: 0.5,
                text: "value: APPROVED; align: center; anchor: center; baseline: center; " +
                    "color: #ffffff; width: " + n(0.052) + "; zOffset: " + n(0.004),
            });
        }
        return d;
    }
    // gelembung ucapan (panel + ekor kon + garis teks)
    function bubble(f, lx, ly, lz, o) {
        o = o || {};
        var w = o.w || 0.07, h = o.h || 0.045, c = o.c || WHITE;
        B(f, w, h, 0.014, c, lx, ly, lz, { m: 0.1, r: 0.8 });
        part(f, "primitive: cone; radiusBottom: " + n(0.011) + "; radiusTop: 0; height: " + n(0.02) +
            "; segmentsRadial: 10", c, lx + w * 0.18, ly - h / 2 - 0.01, lz, { rx: 180, m: 0.1, r: 0.8 });
        if (o.lines !== false) {
            B(f, w * 0.66, 0.005, 0.004, SLATE, lx, ly + h * 0.16, lz + 0.009);
            B(f, w * 0.46, 0.005, 0.004, SLATE, lx - w * 0.1, ly - h * 0.16, lz + 0.009);
        }
    }
    // rak server (n laci + LED) — return frame atas
    function server(f, lx, lz, o) {
        o = o || {};
        var w = o.w || 0.09, d = o.d || 0.06, cnt = o.n || 3, i, sy;
        for (i = 0; i < cnt; i++) {
            sy = 0.015 + i * 0.033;
            B(f, w, 0.029, d, DEEP, lx, sy, lz, { m: 0.4, r: 0.4 });
            Sp(f, 0.004, CYAN, lx - w / 2 + 0.018, sy, lz + d / 2 + 0.001, glow(1));
            B(f, w * 0.45, 0.004, 0.003, SKY, lx + w * 0.1, sy + 0.006, lz + d / 2 + 0.001);
            B(f, w * 0.45, 0.004, 0.003, SKY, lx + w * 0.1, sy - 0.006, lz + d / 2 + 0.001);
        }
        var top = 0.033 * cnt;
        B(f, w + 0.004, 0.006, d + 0.004, SKY, lx, top, lz);
        return sub(f, lx, top, lz, 0);
    }
    // awan (4 bola + alas)
    function cloud(f, lx, ly, lz, s, o) {
        o = o || {};
        s = s || 1;
        var c = o.c || WHITE;
        Sp(f, 0.038 * s, c, lx - 0.03 * s, ly, lz, { m: 0.1, r: 0.9 });
        Sp(f, 0.05 * s, c, lx + 0.012 * s, ly + 0.012 * s, lz, { m: 0.1, r: 0.9 });
        Sp(f, 0.034 * s, c, lx + 0.05 * s, ly - 0.004 * s, lz, { m: 0.1, r: 0.9 });
        B(f, 0.13 * s, 0.03 * s, 0.05 * s, c, lx + 0.006 * s, ly - 0.026 * s, lz, { m: 0.1, r: 0.9 });
    }
    // roket berdiri (badan + hidung + sirip + jendela + api)
    function rocket(f, lx, ly, lz, o) {
        o = o || {};
        var body = o.c || WHITE, fin = o.s || RED;
        C(f, 0.03, 0.12, body, lx, ly + 0.06, lz, { seg: 16, m: 0.3, r: 0.4 });
        part(f, "primitive: cone; radiusBottom: " + n(0.03) + "; radiusTop: 0; height: " + n(0.05) +
            "; segmentsRadial: 16", fin, lx, ly + 0.145, lz, { m: 0.3, r: 0.4 });
        C(f, 0.032, 0.02, DEEP, lx, ly + 0.014, lz, { seg: 16 });
        Sp(f, 0.014, CYAN, lx, ly + 0.078, lz + 0.028, { e: CYAN, ei: 0.5, m: 0.2 });
        var j, a, dx, dz;
        for (j = 0; j < 4; j++) {
            a = j * 90 + 45;
            dx = Math.cos(a * Math.PI / 180) * 0.036;
            dz = Math.sin(a * Math.PI / 180) * 0.036;
            B(f, 0.03, 0.05, 0.006, fin, lx + dx, ly + 0.012, lz + dz, { ry: -a });
        }
        if (o.fire !== false) {
            part(f, "primitive: cone; radiusBottom: " + n(0.022) + "; radiusTop: 0; height: " + n(0.05) +
                "; segmentsRadial: 12", AMBER, lx, ly - 0.038, lz, {
                rx: 180, e: AMBER, ei: 0.9,
                anim: "property: emissiveIntensity; from: 0.6; to: 1; loop: true; dur: 320; dir: alternate",
            });
            part(f, "primitive: cone; radiusBottom: " + n(0.011) + "; radiusTop: 0; height: " + n(0.032) +
                "; segmentsRadial: 10", "#fff7ed", lx, ly - 0.044, lz, { rx: 180, e: "#ffffff", ei: 0.8 });
        }
        return sub(f, lx, ly + 0.17, lz, 0);   // puncak roket
    }
    // kutu/bug (badan + kepala + kaki + bintik)
    function bug(f, lx, ly, lz, o) {
        o = o || {};
        var s = o.s || 1, col = o.c || RED, dark = "#7f1d1d", j;
        Sp(f, 0.03 * s, col, lx, ly, lz, { m: 0.3 });
        Sp(f, 0.017 * s, dark, lx, ly + 0.006 * s, lz + 0.027 * s, { m: 0.3 });
        Sp(f, 0.007 * s, "#fde68a", lx + 0.012 * s, ly + 0.014 * s, lz + 0.024 * s);
        Sp(f, 0.007 * s, "#fde68a", lx - 0.012 * s, ly - 0.004 * s, lz + 0.026 * s);
        for (j = 0; j < 3; j++) {
            B(f, 0.044 * s, 0.006, 0.006, dark, lx, ly + (0.016 - j * 0.014) * s, lz + (0.01 - j * 0.014) * s, { rz: 24 });
            B(f, 0.044 * s, 0.006, 0.006, dark, lx, ly + (0.016 - j * 0.014) * s, lz + (0.01 - j * 0.014) * s, { rz: -24 });
        }
        B(f, 0.004 * s, 0.03 * s, 0.004 * s, dark, lx - 0.01 * s, ly + 0.036 * s, lz + 0.024 * s, { rz: 30 });
        B(f, 0.004 * s, 0.03 * s, 0.004 * s, dark, lx + 0.01 * s, ly + 0.036 * s, lz + 0.024 * s, { rz: -30 });
    }
    // panah lurus dari a ke b (shaft + kepala kon)
    function arrow(a, b, color, r, o) {
        o = o || {};
        var h = o.h || 0.04, k = orient(a, b);
        var tail = [b[0] - k.ux * h, b[1] - k.uy * h, b[2] - k.uz * h];
        seg(a, tail, color, r || 0.005, { e: o.e, ei: o.ei });
        part(W, "primitive: cone; radiusBottom: " + n((r || 0.005) * 3) + "; radiusTop: 0; height: " + n(h) +
            "; segmentsRadial: 12", color, (tail[0] + b[0]) / 2, (tail[1] + b[1]) / 2, (tail[2] + b[2]) / 2,
        { rx: k.pitch, ry: k.yaw, e: o.e, ei: o.ei });
    }
    // callout: label panel navy + border cyan + garis panah penunjuk ke objek (tip)
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
        part(W, "primitive: cone; radiusBottom: " + n(0.012) +
            "; radiusTop: 0; height: " + n(h) + "; segmentsRadial: 12",
        CYAN, mid[0], mid[1], mid[2], { rx: k.pitch, ry: k.yaw, e: CYAN, ei: 1 });
        Sp(W, 0.007, "#ffffff", a[0], a[1], a[2], { e: "#ffffff", ei: 0.5 });
    }
    // tag: label kecil pada objek (mis. "Staging", "v2.0")
    function tag(f, txt, lx, ly, lz) {
        B(f, 0.12, 0.026, 0.006, NAVY, lx, ly, lz, {
            text: "value: " + txt + "; align: center; anchor: center; baseline: center; " +
                "color: #e0f2fe; width: " + n(0.11) + "; wrapCount: 11; zOffset: " + n(0.0035),
        });
        B(f, 0.12, 0.004, 0.007, CYAN, lx, ly - 0.015, lz, glow(0.8));
    }
    // alas diorama (navy + strip cyan) — ukuran sama di semua tahap biar konsisten
    function platform() {
        items.push(stageBox(1.26, 0.03, 0.91, "#071433", pos([0, -0.435, 0])));
        items.push(stageBox(1.2, 0.04, 0.85, NAVY, pos([0, -0.4, 0])));
        items.push(stageBox(1.16, 0.012, 0.81, BLUE, pos([0, -0.374, 0])));
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, 0.426, glow(0.7));
        part(W, gBox(1.2, 0.008, 0.012), CYAN, 0, -0.4, -0.426, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, 0.6, -0.4, 0, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.85), CYAN, -0.6, -0.4, 0, glow(0.7));
    }
    return {
        items: items, W: W, NAVY: NAVY, DEEP: DEEP, BLUE: BLUE, MID: MID, SKY: SKY,
        PALE: PALE, ICE: ICE, WHITE: WHITE, SLATE: SLATE, CYAN: CYAN, AMBER: AMBER,
        GREEN: GREEN, RED: RED,
        n: n, pos: pos, frame: frame, sub: sub, part: part, B: B, C: C, Sp: Sp,
        seg: seg, mv: mv, glow: glow, callout: callout, tag: tag, platform: platform,
        check: check, person: person, screen: screen, board: board, doc: doc,
        bubble: bubble, server: server, cloud: cloud, rocket: rocket, bug: bug, arrow: arrow,
    };
}

const STAGE_BUILDERS = {};   // registry "<metode>/<tahap>" — diisi 16 file di public/learn/stages/<metode>/<tahap>.js (dimuat SETELAH file ini)

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
    const method = detectMethod(meshName);
    // Builder: "<metode>/<tahap>" dulu → fallback "<tahap>" (registry generik bila ada)
    const builder = (method && type && STAGE_BUILDERS[method + "/" + type])
        || (type && STAGE_BUILDERS[type]) || null;

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
            console.warn("[Stage] GLB gagal → fallback:", builder ? (method ? method + "/" : "") + type : "tampilan normal");
            if (child.parentNode) child.parentNode.removeChild(child);
            if (builder) {
                stageEl.appendChild(builder());
                activateStageSwap();
            }
        });
        stageEl.appendChild(child);
        return true;           // tampilan menyusul setelah model siap
    }

    if (builder) {
        stageStep = step;
        stageEl.appendChild(builder());
        activateStageSwap();
        console.log("[Stage] Model hardcode:", (method ? method + "/" : "") + type, "| mesh:", meshName);
        return true;
    }
    console.log("[Stage] Tanpa model (URL kosong & builder tak ditemukan) → popup langsung");
    return false;
}
