/**
 * stages/deployment.js — Model 3D tahap DEPLOYMENT.
 *
 * Dipisah dari stage-models.js. Mendaftarkan builder ke registry global
 * STAGE_BUILDERS (dideklarasikan di stage-models.js — file ini WAJIB dimuat
 * SETELAH stage-models.js; lihat urutan <script> di ar.html).
 *
 * Dipakai showStageModel() → STAGE_BUILDERS[type]() saat mesh tahap diklik.
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */
    // 5. DEPLOYMENT — roket lepas landas + api berkedip
    STAGE_BUILDERS.deployment = function () {
    // ============================================================
        //  SOFTWARE DEPLOYMENT DIORAMA (Waterfall) - "Release Runway"
        //  Platform terang (putih-es) + pad bundar, beda dari Design/Coding/Testing.
        //  Alur kiri -> kanan:
        //  Application Release -> Deployment Pipeline -> Server + Cloud -> Live App -> User Access
        //  Roket dipertahankan sebagai elemen pendukung (simbol rilis sukses).
        // ============================================================
        var S = 1;          // skala keseluruhan diorama (kecilkan bila terlalu besar, mis. 0.7)
        var Y0 = -0.36;     // permukaan lantai zona (di atas platform)
        var items = [];
        var i, x, y;

        // palet: navy/biru/cyan/putih + hijau (sukses) + oranye (aksen rilis)
        var NAVY = "#0b1f4d", DEEP = "#1e3a8a", BLUE = "#1d4ed8", MID = "#2563eb",
            SKY = "#60a5fa", PALE = "#bfdbfe", ICE = "#e0f2fe", WHT = "#f8fafc",
            SLATE = "#94a3b8", CYAN = "#22d3ee", PAD = "#93c5fd", UNIT = "#12306b",
            GRN = "#4ade80", GRN_D = "#16a34a", ORG = "#f97316";

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
            if (o.dbl) { m += "; side: double"; }
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
            part(f, "primitive: sphere; radius: " + n(r) + "; segmentsWidth: 14; segmentsHeight: 10",
                color, lx, ly, lz, o);
        }
        // kerucut; o.rt = radiusTop (default 0)
        function cone(f, rb, h, color, lx, ly, lz, o) {
            part(f, "primitive: cone; radiusBottom: " + n(rb) + "; radiusTop: " + n((o && o.rt) || 0) +
                "; height: " + n(h) + "; segmentsRadial: 16", color, lx, ly, lz, o);
        }
        // cincin / busur (o.arc dalam derajat)
        function ring(f, r, t, color, lx, ly, lz, o) {
            part(f, "primitive: torus; radius: " + n(r) + "; radiusTubular: " + n(t) +
                "; segmentsRadial: 8; segmentsTubular: 48" + ((o && o.arc) ? "; arc: " + o.arc : ""),
                color, lx, ly, lz, o);
        }
        // segitiga datar (bendera), dua sisi
        function tri(f, a, b, c, color, lx, ly, lz, o) {
            o = o || {};
            o.dbl = true;
            part(f, "primitive: triangle; vertexA: " + n(a[0]) + " " + n(a[1]) + " 0; vertexB: " +
                n(b[0]) + " " + n(b[1]) + " 0; vertexC: " + n(c[0]) + " " + n(c[1]) + " 0",
                color, lx, ly, lz, o);
        }
        // ikon centang (2 batang), s = lebar ikon
        function check(f, cx, cy, cz, s, color) {
            B(f, 0.56 * s, 0.2 * s, 0.004, color, cx - 0.325 * s, cy - 0.2 * s, cz, { e: color, ei: 0.6, rz: -45 });
            B(f, 1.04 * s, 0.2 * s, 0.004, color, cx + 0.175 * s, cy, cz, { e: color, ei: 0.6, rz: 49 });
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
        function seg(a, b, color, r, o) {
            o = o || {};
            var k = orient(a, b);
            C(W, r, k.len, color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2,
                { rx: k.pitch, ry: k.yaw, seg: 8, e: o.e, ei: o.ei, m: o.m === undefined ? 0.1 : o.m });
        }
        // garis + kepala panah dari a ke b
        function arrow(a, b, color, r, h, hr) {
            var k = orient(a, b);
            var tail = [b[0] - k.ux * h, b[1] - k.uy * h, b[2] - k.uz * h];
            var mid = [b[0] - k.ux * h / 2, b[1] - k.uy * h / 2, b[2] - k.uz * h / 2];
            seg(a, tail, color, r, { e: color, ei: 1 });
            cone(W, hr, h, color, mid[0], mid[1], mid[2], { rx: k.pitch, ry: k.yaw, e: color, ei: 1 });
        }
        function mv(a, b, dur, o) {
            o = o || {};
            return "property: position; from: " + pos(a) + "; to: " + pos(b) +
                "; dur: " + dur + "; loop: true; easing: " + (o.ease || "linear") +
                (o.alt ? "; dir: alternate" : "") + (o.delay ? "; delay: " + o.delay : "");
        }
        // paket data kecil yang mengalir dari a ke b
        function pkt(a, b, color, dur, o) {
            B(W, 0.014, 0.014, 0.014, color, a[0], a[1], a[2], { e: color, ei: 1, anim: mv(a, b, dur, o) });
        }
        function bob(f, lx, ly, lz) {
            return mv(f(lx, ly, lz), f(lx, ly + 0.012, lz), 2800, { alt: true, ease: "easeInOutSine" });
        }
        function blink(dur) {
            return "property: scale; from: 1 1 1; to: 1 0.05 1; dur: " + dur +
                "; loop: true; dir: alternate; easing: linear";
        }
        function pulse(dur, k) {
            return "property: scale; from: 1 1 1; to: " + k + " " + k + " " + k + "; dur: " + dur +
                "; loop: true; dir: alternate; easing: easeInOutSine";
        }

        // label 3D + callout dengan kepala panah (gaya sama dengan Design/Coding/Testing)
        function callout(text, cx, cy, cz, tip) {
            B(W, 0.475, 0.098, 0.006, CYAN, cx, cy, cz - 0.005, glow(0.8));
            B(W, 0.46, 0.09, 0.01, NAVY, cx, cy, cz, { m: 0.3, text: txt(text, "#ffffff", 0.44, 26, 0.0065) });
            arrow([cx, cy - 0.05, cz], tip, CYAN, 0.004, 0.045, 0.014);
            Sp(W, 0.008, "#ffffff", cx, cy - 0.05, cz, { e: "#ffffff", ei: 0.5 });
        }
        // tag kecil di depan node
        function tag(f, text, lx, ly, lz, w) {
            B(f, w, 0.026, 0.006, NAVY, lx, ly, lz,
                { text: txt(text, "#e0f2fe", w - 0.01, Math.round((w - 0.01) / 0.01)) });
            B(f, w, 0.004, 0.007, CYAN, lx, ly - 0.015, lz, glow(0.8));
        }

        // ============================================================
        //  PLATFORM TERANG + PAD BUNDAR
        // ============================================================
        items.push(stageBox(n(1.62), n(0.03), n(0.88), "#071433", pos([0, -0.435, 0])));
        items.push(stageBox(n(1.56), n(0.04), n(0.82), NAVY, pos([0, -0.4, 0])));
        items.push(stageBox(n(1.52), n(0.012), n(0.78), "#e2e8f0", pos([0, -0.374, 0]),
            { material: "color: #e2e8f0; metalness: 0.1; roughness: 0.7" }));
        part(W, gBox(1.56, 0.008, 0.012), ORG, 0, -0.4, 0.416, { e: ORG, ei: 0.6 });   // strip oranye (sisi depan)
        part(W, gBox(1.56, 0.008, 0.012), CYAN, 0, -0.4, -0.416, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.82), CYAN, 0.78, -0.4, 0, glow(0.7));
        part(W, gBox(0.012, 0.008, 0.82), CYAN, -0.78, -0.4, 0, glow(0.7));
        C(W, 0.12, 0.008, PAD, -0.55, -0.364, 0.24, { seg: 40, m: 0.1 });   // paket rilis
        C(W, 0.11, 0.008, PAD, -0.5, -0.364, -0.26, { seg: 40, m: 0.1 });   // roket
        C(W, 0.15, 0.008, PAD, 0.3, -0.364, -0.12, { seg: 40, m: 0.1 });    // server
        C(W, 0.17, 0.008, PAD, 0.58, -0.364, -0.22, { seg: 40, m: 0.1 });   // aplikasi live
        C(W, 0.13, 0.008, PAD, 0.5, -0.364, 0.2, { seg: 40, m: 0.1 });      // perangkat pengguna
        // ban berjalan pipeline
        var pz = 0.24;
        B(W, 0.62, 0.006, 0.07, NAVY, -0.12, -0.363, pz);
        B(W, 0.62, 0.005, 0.006, CYAN, -0.12, -0.3595, pz - 0.038, glow(0.8));
        B(W, 0.62, 0.005, 0.006, CYAN, -0.12, -0.3595, pz + 0.038, glow(0.8));

        // ============================================================
        //  A. APPLICATION RELEASE (kiri): paket software siap rilis
        // ============================================================
        var Pk = frame(-0.55, Y0, 0.24, 12);
        B(Pk, 0.18, 0.006, 0.16, SLATE, 0, 0.009, 0);                                       // pallet
        B(Pk, 0.05, 0.006, 0.16, "#64748b", -0.06, 0.003, 0);
        B(Pk, 0.05, 0.006, 0.16, "#64748b", 0.06, 0.003, 0);
        B(Pk, 0.14, 0.11, 0.12, BLUE, 0, 0.068, 0, { m: 0.25 });                            // kotak paket
        B(Pk, 0.148, 0.012, 0.128, DEEP, 0, 0.129, 0);
        B(Pk, 0.02, 0.004, 0.13, ORG, 0, 0.1375, 0, { e: ORG, ei: 0.3 });                   // lakban
        B(Pk, 0.1, 0.075, 0.003, WHT, 0, 0.068, 0.0615);                                    // label paket
        B(Pk, 0.09, 0.04, 0.003, WHT, 0, 0.085, 0.0645, { text: txt("</>", BLUE, 0.07, 4) });
        B(Pk, 0.07, 0.02, 0.003, WHT, 0, 0.045, 0.0645, { text: txt("v1.0", "#334155", 0.05, 5) });
        C(Pk, 0.013, 0.003, GRN_D, 0.05, 0.105, 0.0645, { rx: 90, seg: 24, e: GRN, ei: 0.5 }); // stiker "lulus tes"
        check(Pk, 0.05, 0.105, 0.0675, 0.016, "#ffffff");

        // ============================================================
        //  ROKET (pendukung): simbol rilis sukses
        // ============================================================
        var Rk = frame(-0.5, Y0, -0.26, 0);
        C(Rk, 0.07, 0.01, NAVY, 0, 0.005, 0, { seg: 6 });
        C(Rk, 0.05, 0.003, CYAN, 0, 0.0115, 0, { seg: 6, e: CYAN, ei: 0.7 });
        Sp(Rk, 0.025, "#ffffff", -0.04, 0.03, 0.02, { op: 0.55 });                          // asap
        Sp(Rk, 0.03, "#ffffff", 0.035, 0.032, -0.01, { op: 0.5 });
        Sp(Rk, 0.022, "#ffffff", 0.0, 0.025, 0.05, { op: 0.45 });
        cone(Rk, 0.02, 0.06, "#fde047", 0, 0.065, 0, { rx: 180, e: "#fde047", ei: 0.9 });    // api dalam
        cone(Rk, 0.03, 0.08, ORG, 0, 0.07, 0, {
            rx: 180, e: ORG, ei: 0.8, op: 0.8,
            anim: "property: scale; from: 1 1 1; to: 1.15 1.35 1.15; dir: alternate; loop: true; dur: 350",
        });
        C(Rk, 0.02, 0.015, SLATE, 0, 0.11, 0, { seg: 16 });                                 // nozzle
        C(Rk, 0.035, 0.15, WHT, 0, 0.2, 0, { m: 0.3, r: 0.4 });                             // badan
        C(Rk, 0.0355, 0.015, BLUE, 0, 0.16, 0);
        C(Rk, 0.0355, 0.01, CYAN, 0, 0.245, 0, { e: CYAN, ei: 0.5 });
        cone(Rk, 0.035, 0.07, ORG, 0, 0.31, 0, { e: ORG, ei: 0.3 });                        // hidung
        Sp(Rk, 0.013, CYAN, 0, 0.21, 0.031, { e: CYAN, ei: 0.8 });                          // jendela
        B(Rk, 0.03, 0.06, 0.008, BLUE, -0.04, 0.15, 0, { rz: 18 });                         // sirip
        B(Rk, 0.03, 0.06, 0.008, BLUE, 0.04, 0.15, 0, { rz: -18 });
        B(Rk, 0.008, 0.06, 0.03, BLUE, 0, 0.15, -0.04, { rx: -18 });

        // ============================================================
        //  D. DEPLOYMENT PIPELINE (depan): Build -> Test -> Release -> Deploy
        // ============================================================
        var px = [-0.36, -0.2, -0.04, 0.12];
        var pn = ["BUILD", "TEST", "RELEASE", "DEPLOY"];
        for (i = 0; i < 4; i++) {
            C(W, 0.04, 0.004, i === 2 ? ORG : CYAN, px[i], Y0 + 0.002, pz,
                { seg: 6, e: i === 2 ? ORG : CYAN, ei: 0.7 });
            tag(W, pn[i], px[i], Y0 + 0.013, pz + 0.06, i === 1 ? 0.07 : 0.08);
        }
        B(W, 0.05, 0.012, 0.04, SKY, px[0], Y0 + 0.04, pz, { e: SKY, ei: 0.3 });             // BUILD: layer artefak
        B(W, 0.05, 0.012, 0.04, MID, px[0], Y0 + 0.056, pz, { e: MID, ei: 0.3 });
        B(W, 0.05, 0.012, 0.04, BLUE, px[0], Y0 + 0.072, pz, { e: BLUE, ei: 0.3 });
        check(W, px[1], Y0 + 0.065, pz, 0.06, GRN);                                         // TEST: lulus
        C(W, 0.003, 0.07, SLATE, px[2] - 0.016, Y0 + 0.04, pz, { seg: 8 });                 // RELEASE: bendera oranye
        tri(W, [0.04, 0], [0, 0.025], [0, -0.025], ORG, px[2] - 0.014, Y0 + 0.062, pz, { e: ORG, ei: 0.6 });
        cone(W, 0.022, 0.03, CYAN, px[3], Y0 + 0.085, pz, { e: CYAN, ei: 0.9 });            // DEPLOY: panah unggah
        B(W, 0.016, 0.03, 0.016, CYAN, px[3], Y0 + 0.055, pz, glow(0.9));
        B(W, 0.05, 0.006, 0.03, SKY, px[3], Y0 + 0.036, pz);
        var yl = Y0 + 0.012, yp = Y0 + 0.026;
        for (i = 0; i < 3; i++) {                                                           // konektor antar node
            seg([px[i] + 0.045, yl, pz], [px[i + 1] - 0.045, yl, pz], CYAN, 0.004, glow(0.9));
            cone(W, 0.011, 0.026, CYAN, (px[i] + px[i + 1]) / 2, yl + 0.002, pz, { rz: -90, e: CYAN, ei: 1 });
        }
        arrow([-0.465, yl, pz], [-0.405, yl, pz], CYAN, 0.004, 0.03, 0.012);               // paket -> BUILD
        pkt([-0.46, yp, pz], [0.12, yp, pz], CYAN, 3600);                                   // paket data mengalir
        pkt([-0.46, yp, pz], [0.12, yp, pz], "#ffffff", 3600, { delay: 1800 });
        // pipeline -> server
        seg([0.165, yl, pz], [0.3, yl, pz], CYAN, 0.004, glow(0.9));
        arrow([0.3, yl, pz], [0.3, yl, -0.04], CYAN, 0.004, 0.035, 0.013);
        pkt([0.165, yp, pz], [0.3, yp, pz], ORG, 1500);
        pkt([0.3, yp, pz], [0.3, yp, -0.04], ORG, 2200);

        // ============================================================
        //  B. PRODUCTION SERVER (tengah): rak server bertingkat
        // ============================================================
        var Sv = frame(0.3, Y0, -0.12, 0);
        B(Sv, 0.16, 0.012, 0.12, NAVY, 0, 0.006, 0, { m: 0.4 });                            // rangka rak
        B(Sv, 0.15, 0.3, 0.004, DEEP, 0, 0.162, -0.048);
        B(Sv, 0.004, 0.3, 0.1, DEEP, -0.073, 0.162, 0);
        B(Sv, 0.004, 0.3, 0.1, DEEP, 0.073, 0.162, 0);
        B(Sv, 0.16, 0.012, 0.12, NAVY, 0, 0.318, 0, { m: 0.4 });
        for (i = 0; i < 4; i++) {                                                           // 4 unit server
            var yy = 0.042 + i * 0.06;
            B(Sv, 0.13, 0.048, 0.09, UNIT, 0, yy, 0, { m: 0.4, r: 0.4 });
            Sp(Sv, 0.004, GRN, -0.052, yy + 0.012, 0.047, { e: GRN, ei: 1, anim: blink(500 + i * 170) });
            Sp(Sv, 0.004, CYAN, -0.04, yy + 0.012, 0.047, { e: CYAN, ei: 1, anim: blink(900 + i * 130) });
            B(Sv, 0.05, 0.006, 0.002, SKY, 0.02, yy + 0.012, 0.046);                        // ventilasi
            for (j = 0; j < 3; j++) {                                                       // port jaringan
                B(Sv, 0.012, 0.008, 0.002, CYAN, -0.01 + j * 0.02, yy - 0.012, 0.046, glow(0.6));
            }
        }
        B(Sv, 0.13, 0.034, 0.09, "#0e7490", 0, 0.275, 0, { m: 0.4, r: 0.4 });              // switch jaringan
        for (i = 0; i < 6; i++) { B(Sv, 0.01, 0.008, 0.002, WHT, -0.05 + i * 0.02, 0.275, 0.046); }

        // ============================================================
        //  C. CLOUD DEPLOYMENT: cloud dari primitive sphere + cylinder
        // ============================================================
        var cy0 = 0.42;
        C(Sv, 0.095, 0.03, WHT, 0, cy0, 0, { seg: 32, e: PALE, ei: 0.25, anim: bob(Sv, 0, cy0, 0) });
        Sp(Sv, 0.05, WHT, -0.06, cy0 + 0.035, 0, { e: PALE, ei: 0.25, anim: bob(Sv, -0.06, cy0 + 0.035, 0) });
        Sp(Sv, 0.068, WHT, 0, cy0 + 0.055, 0, { e: PALE, ei: 0.25, anim: bob(Sv, 0, cy0 + 0.055, 0) });
        Sp(Sv, 0.052, WHT, 0.062, cy0 + 0.035, 0, { e: PALE, ei: 0.25, anim: bob(Sv, 0.062, cy0 + 0.035, 0) });
        Sp(Sv, 0.036, WHT, 0.0, cy0 + 0.03, -0.05, { e: PALE, ei: 0.25, anim: bob(Sv, 0, cy0 + 0.03, -0.05) });
        cone(Sv, 0.016, 0.03, CYAN, 0, cy0 + 0.065, 0.073, { e: CYAN, ei: 1, anim: bob(Sv, 0, cy0 + 0.065, 0.073) });
        B(Sv, 0.014, 0.03, 0.006, CYAN, 0, cy0 + 0.037, 0.073, { e: CYAN, ei: 1, anim: bob(Sv, 0, cy0 + 0.037, 0.073) });
        ring(Sv, 0.14, 0.003, CYAN, 0, cy0 + 0.01, 0, {                                      // cincin infrastruktur cloud
            rx: 78, e: CYAN, ei: 0.6,
            anim: "property: rotation; to: 78 360 0; loop: true; dur: 8000; easing: linear",
        });
        // server <-> cloud
        seg(Sv(-0.04, 0.325, 0), Sv(-0.04, 0.405, 0), CYAN, 0.004, glow(0.9));
        seg(Sv(0.04, 0.325, 0), Sv(0.04, 0.405, 0), CYAN, 0.004, glow(0.9));
        pkt(Sv(-0.04, 0.33, 0), Sv(-0.04, 0.4, 0), CYAN, 1500);
        pkt(Sv(0.04, 0.4, 0), Sv(0.04, 0.33, 0), "#ffffff", 1500);

        // ============================================================
        //  E. LIVE APPLICATION (kanan-belakang): browser/monitor berstatus LIVE
        // ============================================================
        var Lm = frame(0.58, Y0, -0.22, -10);
        B(Lm, 0.1, 0.008, 0.07, "#cbd5e1", 0, 0.004, 0);
        B(Lm, 0.02, 0.06, 0.012, SLATE, 0, 0.038, 0);
        B(Lm, 0.3, 0.2, 0.012, NAVY, 0, 0.17, 0, { m: 0.4 });
        B(Lm, 0.28, 0.18, 0.004, WHT, 0, 0.17, 0.0085, { m: 0.05, r: 0.8 });
        var M2 = sub(Lm, 0, 0.17, 0, 0);
        var lz1 = 0.012, lz2 = 0.014;
        B(M2, 0.28, 0.02, 0.003, "#e2e8f0", 0, 0.08, lz1);                                  // chrome browser
        Sp(M2, 0.004, "#fb7185", -0.125, 0.08, lz2);
        Sp(M2, 0.004, "#fde047", -0.112, 0.08, lz2);
        Sp(M2, 0.004, GRN, -0.099, 0.08, lz2);
        B(M2, 0.12, 0.011, 0.003, WHT, -0.02, 0.08, lz2, { text: txt("myapp.com", "#334155", 0.1, 12) });
        Sp(M2, 0.005, GRN, 0.068, 0.08, lz2 + 0.002, { e: GRN, ei: 1, anim: pulse(700, 1.6) });
        B(M2, 0.05, 0.016, 0.003, GRN_D, 0.105, 0.08, lz2, { e: GRN, ei: 0.5, text: txt("LIVE", "#ffffff", 0.04, 4) });
        B(M2, 0.28, 0.022, 0.003, BLUE, 0, 0.059, lz1);                                     // navbar
        B(M2, 0.014, 0.01, 0.003, CYAN, -0.12, 0.059, lz2, glow(0.6));
        for (i = 0; i < 3; i++) { B(M2, 0.03, 0.006, 0.003, PALE, -0.05 + i * 0.04, 0.059, lz2); }
        B(M2, 0.26, 0.05, 0.003, MID, 0, 0.012, lz1);                                       // hero
        B(M2, 0.1, 0.012, 0.003, WHT, -0.07, 0.025, lz2);
        B(M2, 0.07, 0.007, 0.003, PALE, -0.085, 0.008, lz2);
        B(M2, 0.04, 0.012, 0.003, ORG, 0.09, 0.0, lz2, { e: ORG, ei: 0.4 });
        for (i = 0; i < 3; i++) {                                                           // kartu konten
            x = -0.09 + i * 0.09;
            B(M2, 0.08, 0.05, 0.003, ICE, x, -0.045, lz1);
            B(M2, 0.06, 0.006, 0.003, SLATE, x, -0.035, lz2);
            B(M2, 0.04, 0.005, 0.003, PALE, x, -0.048, lz2);
            B(M2, 0.03, 0.01, 0.003, CYAN, x, -0.06, lz2, { e: CYAN, ei: 0.3 });
        }
        B(M2, 0.28, 0.02, 0.003, GRN_D, 0, -0.08, lz1, {                                     // status operasional
            e: GRN, ei: 0.3, text: txt("All systems operational", "#ffffff", 0.24, 28),
        });

        // ============================================================
        //  F. USER ACCESS (kanan-depan): smartphone + pengguna + sinyal
        // ============================================================
        var Ph = frame(0.5, Y0, 0.2, -20);
        C(Ph, 0.035, 0.006, "#cbd5e1", 0, 0.003, 0);
        C(Ph, 0.006, 0.03, SLATE, 0, 0.021, 0, { seg: 12 });
        B(Ph, 0.08, 0.16, 0.01, NAVY, 0, 0.12, 0, { m: 0.4 });
        B(Ph, 0.072, 0.148, 0.004, "#dbeafe", 0, 0.12, 0.0065, { m: 0.05, r: 0.8 });
        var qz1 = 0.0095, qz2 = 0.0115;
        B(Ph, 0.072, 0.02, 0.003, BLUE, 0, 0.185, qz1);
        Sp(Ph, 0.005, WHT, -0.025, 0.185, qz2);
        Sp(Ph, 0.004, GRN, 0.026, 0.185, qz2, { e: GRN, ei: 1, anim: pulse(700, 1.6) });
        B(Ph, 0.062, 0.04, 0.003, MID, 0, 0.15, qz1);
        B(Ph, 0.04, 0.014, 0.003, GRN_D, 0, 0.15, qz2, { e: GRN, ei: 0.4, text: txt("Online", "#ffffff", 0.034, 6) });
        for (i = 0; i < 2; i++) {
            B(Ph, 0.062, 0.022, 0.003, WHT, 0, 0.112 - i * 0.028, qz1);
            Sp(Ph, 0.006, SKY, -0.022, 0.112 - i * 0.028, qz2);
            B(Ph, 0.03, 0.005, 0.003, PALE, 0.008, 0.112 - i * 0.028, qz2);
        }
        B(Ph, 0.05, 0.014, 0.003, CYAN, 0, 0.058, qz1, { e: CYAN, ei: 0.4, text: txt("Open", NAVY, 0.04, 5) });
        // sinyal akses (busur)
        Sp(Ph, 0.005, CYAN, 0, 0.24, 0, glow(1));
        ring(Ph, 0.02, 0.003, CYAN, 0, 0.24, 0, { arc: 90, rz: 45, e: CYAN, ei: 0.9 });
        ring(Ph, 0.034, 0.003, CYAN, 0, 0.24, 0, { arc: 90, rz: 45, e: CYAN, ei: 0.8 });
        ring(Ph, 0.048, 0.003, CYAN, 0, 0.24, 0, { arc: 90, rz: 45, e: CYAN, ei: 0.7, anim: blink(900) });
        // pengguna
        var Us = sub(Ph, -0.105, 0, 0.02, 20);
        C(Us, 0.03, 0.004, CYAN, 0, 0.002, 0, { seg: 24, e: CYAN, ei: 0.6 });
        cone(Us, 0.032, 0.065, MID, 0, 0.037, 0, { rt: 0.018 });
        Sp(Us, 0.022, ICE, 0, 0.09, 0);

        // ============================================================
        //  KONEKTOR CLOUD -> LIVE APP dan CLOUD -> PERANGKAT PENGGUNA
        // ============================================================
        var cA = Sv(0.1, cy0 + 0.02, 0), tA = Lm(-0.15, 0.275, 0);
        arrow(cA, tA, CYAN, 0.004, 0.035, 0.013);
        pkt(cA, tA, "#ffffff", 2600);
        var cB = Sv(0.06, cy0 + 0.0, 0.05), tB = Ph(-0.03, 0.205, 0);
        arrow(cB, tB, CYAN, 0.004, 0.035, 0.013);
        pkt(cB, tB, CYAN, 3000, { delay: 800 });

        // ============================================================
        //  LABEL + CALLOUT (konsisten dengan Design / Coding / Testing)
        // ============================================================
        var tipRel = Pk(-0.07, 0.115, 0);
        var tipPipe = [px[2], Y0 + 0.1, pz];
        var tipSrv = Sv(-0.06, 0.325, 0.03);
        var tipCld = Sv(0, 0.548, 0);
        var tipLive = Lm(0.04, 0.275, 0);
        var tipUser = Ph(0.035, 0.205, 0);
        callout("Application Release", -0.9, -0.01, 0.24, tipRel);
        callout("Deployment Pipeline", -0.1, 0.1, 0.24, tipPipe);
        callout("Production Server", -0.05, 0.38, -0.3, tipSrv);
        callout("Cloud Deployment", 0.3, 0.58, -0.3, tipCld);
        callout("Live Application", 0.62, 0.4, -0.3, tipLive);
        callout("User Access", 0.95, -0.02, 0.2, tipUser);

        return stageWrap(items);
};
