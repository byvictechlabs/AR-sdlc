/**
 * stages/agile/coding.js — model 3D tahap CODING untuk metode AGILE.
 *
 * Key registry: STAGE_BUILDERS["agile/coding"].
 * Isi awal = copy identik dari kode tahap sebelumnya — edit bebas per metode,
 * metode lain tidak terpengaruh.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */

// 3. CODING — monitor + baris kode + keyboard
STAGE_BUILDERS["agile/coding"] = function () {
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
    };
