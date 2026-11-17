/**
 * stages/rad/testing.js — model 3D tahap TESTING untuk metode RAD.
 *
 * Key registry: STAGE_BUILDERS["rad/testing"].
 * Isi awal = copy identik dari kode tahap sebelumnya — edit bebas per metode,
 * metode lain tidak terpengaruh.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */

// 4. TESTING — dokumen + bug merah + kaca pembesar + centang
STAGE_BUILDERS["rad/testing"] = function () {
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
};
