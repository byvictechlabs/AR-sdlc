/**
 * stages/agile/maintenance.js — model 3D tahap MAINTENANCE untuk metode AGILE.
 *
 * Key registry: STAGE_BUILDERS["agile/maintenance"].
 * Isi awal = copy identik dari kode tahap sebelumnya — edit bebas per metode,
 * metode lain tidak terpengaruh.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */

// 6. MAINTENANCE — dua roda gigi (besar + kecil)
STAGE_BUILDERS["agile/maintenance"] = function () {
    // ============================================================
        //  SOFTWARE MAINTENANCE DIORAMA (Waterfall) - "Maintenance Cycle"
        //  Platform heksagon navy dengan siklus lantai berpanah:
        //  System Monitoring -> (temukan masalah) -> Bug Fixing -> Software Update -> kembali memantau
        //  Pusat: gear (System Maintenance) = simbol stabilitas sistem.
        //  Teks hanya ada pada label callout; objek 3D tidak memuat tulisan.
        // ============================================================
        var S = 1;          // skala keseluruhan diorama (kecilkan bila terlalu besar, mis. 0.7)
        var Y0 = -0.36;     // permukaan lantai zona (di atas platform)
        var items = [];
        var i, j, k, x, y;

        // palet: navy/biru/cyan/putih + abu metalik (alat) + merah (error) + hijau (sukses)
        var NAVY = "#0b1f4d", DEEP = "#1e3a8a", BLUE = "#1d4ed8", MID = "#2563eb",
            SKY = "#60a5fa", PALE = "#bfdbfe", ICE = "#e0f2fe", WHT = "#f8fafc",
            CYAN = "#22d3ee", AMBER = "#fbbf24", PADC = "#2f55b8",
            METAL = "#94a3b8", GRAY = "#64748b", DGRAY = "#475569", HUB = "#cbd5e1", INK = "#0f172a",
            GRN = "#4ade80", GRN_D = "#16a34a", RED = "#ef4444", RED_D = "#dc2626";

        // ---------- helper lokal (semua koordinat diskalakan lewat n()) ----------
        function n(v) { return +(v * S).toFixed(4); }
        function pos(p) { return n(p[0]) + " " + n(p[1]) + " " + n(p[2]); }
        function r2(v) { return +v.toFixed(2); }
        function rad(d) { return d * Math.PI / 180; }

        // frame lokal: titik asal + rotasi (urutan A-Frame: Y, X, Z). Objek di dalam frame
        // yang miring (rx/rz) hanya boleh memakai rotasi miliknya sendiri pada sumbu yang sama.
        function frame(ox, oy, oz, ry, rx, rz) {
            ry = ry || 0; rx = rx || 0; rz = rz || 0;
            var cy = Math.cos(rad(ry)), sy = Math.sin(rad(ry));
            var cx = Math.cos(rad(rx)), sx = Math.sin(rad(rx));
            var cz = Math.cos(rad(rz)), sz = Math.sin(rad(rz));
            var f = function (lx, ly, lz) {
                var x1 = lx * cz - ly * sz, y1 = lx * sz + ly * cz;
                var y2 = y1 * cx - lz * sx, z2 = y1 * sx + lz * cx;
                return [ox + x1 * cy + z2 * sy, oy + y2, oz - x1 * sy + z2 * cy];
            };
            f.ry = ry; f.rx = rx; f.rz = rz;
            return f;
        }
        function sub(f, lx, ly, lz, ry, rx, rz) {
            var o = f(lx, ly, lz);
            return frame(o[0], o[1], o[2], f.ry + (ry || 0), (f.rx || 0) + (rx || 0), (f.rz || 0) + (rz || 0));
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
                rotation: r2((f.rx || 0) + (o.rx || 0)) + " " + r2(f.ry + (o.ry || 0)) + " " + r2((f.rz || 0) + (o.rz || 0)),
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
        function cone(f, rb, h, color, lx, ly, lz, o) {
            part(f, "primitive: cone; radiusBottom: " + n(rb) + "; radiusTop: " + n((o && o.rt) || 0) +
                "; height: " + n(h) + "; segmentsRadial: 16", color, lx, ly, lz, o);
        }
        // cincin / busur (o.arc dalam derajat, mulai dari sumbu +x lokal, berlawanan arah jarum jam)
        function ring(f, r, t, color, lx, ly, lz, o) {
            part(f, "primitive: torus; radius: " + n(r) + "; radiusTubular: " + n(t) +
                "; segmentsRadial: 8; segmentsTubular: 48" + ((o && o.arc) ? "; arc: " + o.arc : ""),
                color, lx, ly, lz, o);
        }
        // ikon centang dan silang (batang), s = lebar ikon
        function check(f, cx, cy, cz, s, color) {
            B(f, 0.56 * s, 0.2 * s, 0.004, color, cx - 0.325 * s, cy - 0.2 * s, cz, { e: color, ei: 0.6, rz: -45 });
            B(f, 1.04 * s, 0.2 * s, 0.004, color, cx + 0.175 * s, cy, cz, { e: color, ei: 0.6, rz: 49 });
        }
        function cross(f, cx, cy, cz, s, color) {
            B(f, 1.0 * s, 0.2 * s, 0.004, color, cx, cy, cz, { e: color, ei: 0.6, rz: 45 });
            B(f, 1.0 * s, 0.2 * s, 0.004, color, cx, cy, cz, { e: color, ei: 0.6, rz: -45 });
        }
        // garis 2D pada bidang frame (grafik)
        function line2(f, x1, y1, x2, y2, z, color, t, o) {
            var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
            o = o || {};
            o.rz = Math.atan2(dy, dx) * 180 / Math.PI;
            B(f, L + t * 0.6, t, 0.003, color, (x1 + x2) / 2, (y1 + y2) / 2, z, o);
        }
        // string teks (hanya untuk label callout)
        function txt(v, color, w, wc, zo) {
            return "value: " + v + "; align: center; anchor: center; baseline: center; color: " + color +
                "; whiteSpace: nowrap; width: " + n(w) + "; wrapCount: " + wc + "; zOffset: " + n(zo || 0.0035);
        }
        function glow(ei) { return { e: CYAN, ei: ei || 0.8 }; }

        // arah garis 3D -> pitch & yaw
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
            var q = orient(a, b);
            C(W, r, q.len, color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2,
                { rx: q.pitch, ry: q.yaw, seg: 8, e: o.e, ei: o.ei, m: o.m === undefined ? 0.1 : o.m });
        }
        function arrow(a, b, color, r, h, hr) {
            var q = orient(a, b);
            var tail = [b[0] - q.ux * h, b[1] - q.uy * h, b[2] - q.uz * h];
            var mid = [b[0] - q.ux * h / 2, b[1] - q.uy * h / 2, b[2] - q.uz * h / 2];
            seg(a, tail, color, r, { e: color, ei: 1 });
            cone(W, hr, h, color, mid[0], mid[1], mid[2], { rx: q.pitch, ry: q.yaw, e: color, ei: 1 });
        }
        function mv(a, b, dur, o) {
            o = o || {};
            return "property: position; from: " + pos(a) + "; to: " + pos(b) +
                "; dur: " + dur + "; loop: true; easing: " + (o.ease || "linear") +
                (o.alt ? "; dir: alternate" : "") + (o.delay ? "; delay: " + o.delay : "");
        }
        function pkt(a, b, color, dur, o) {
            B(W, 0.014, 0.014, 0.014, color, a[0], a[1], a[2], { e: color, ei: 1, anim: mv(a, b, dur, o) });
        }
        function blink(dur) {
            return "property: scale; from: 1 1 1; to: 1 0.05 1; dur: " + dur +
                "; loop: true; dir: alternate; easing: linear";
        }
        function pulse(dur, q) {
            return "property: scale; from: 1 1 1; to: " + q + " " + q + " " + q + "; dur: " + dur +
                "; loop: true; dir: alternate; easing: easeInOutSine";
        }
        function spinZ(dur, dir) {
            return "property: rotation; to: 0 0 " + (dir * 360) + "; loop: true; dur: " + dur + "; easing: linear";
        }

        // label 3D + callout dengan kepala panah (gaya sama dengan Design/Coding/Testing/Deployment)
        function callout(text, cx, cy, cz, tip) {
            B(W, 0.475, 0.098, 0.006, CYAN, cx, cy, cz - 0.005, glow(0.8));
            B(W, 0.46, 0.09, 0.01, NAVY, cx, cy, cz, { m: 0.3, text: txt(text, "#ffffff", 0.44, 26, 0.0065) });
            arrow([cx, cy - 0.05, cz], tip, CYAN, 0.004, 0.045, 0.014);
            Sp(W, 0.008, "#ffffff", cx, cy - 0.05, cz, { e: "#ffffff", ei: 0.5 });
        }

        // ============================================================
        //  PLATFORM HEKSAGON + PAD ZONA
        // ============================================================
        C(W, 0.92, 0.03, "#071433", 0, -0.435, 0, { seg: 6, ry: 30 });
        C(W, 0.86, 0.04, NAVY, 0, -0.4, 0, { seg: 6, ry: 30 });
        C(W, 0.865, 0.008, CYAN, 0, -0.4, 0, { seg: 6, ry: 30, e: CYAN, ei: 0.7 });
        C(W, 0.82, 0.012, "#12306b", 0, -0.374, 0, { seg: 6, ry: 30, m: 0.2, r: 0.6 });
        C(W, 0.22, 0.008, PADC, 0, -0.364, 0, { seg: 40, m: 0.1 });         // gear
        C(W, 0.15, 0.008, PADC, -0.5, -0.364, -0.15, { seg: 40, m: 0.1 });  // bug fixing
        C(W, 0.15, 0.008, PADC, 0.4, -0.364, -0.34, { seg: 40, m: 0.1 });   // monitoring
        C(W, 0.15, 0.008, PADC, 0.12, -0.364, 0.42, { seg: 40, m: 0.1 });   // update

        // ============================================================
        //  A. SYSTEM MAINTENANCE (tengah): gear utama + gear kecil + wrench
        // ============================================================
        var G = frame(0, Y0 + 0.3, 0, 0);
        B(W, 0.3, 0.03, 0.26, DGRAY, 0, Y0 + 0.015, 0, { m: 0.5, r: 0.4 });                  // dudukan
        B(W, 0.06, 0.3, 0.04, DGRAY, 0, Y0 + 0.165, -0.11, { m: 0.5, r: 0.4 });              // tiang gear utama
        C(W, 0.02, 0.04, HUB, 0, Y0 + 0.3, -0.085, { rx: 90, seg: 12, m: 0.7 });             // as
        // gigi gear dibuat dinamis (logika asli dipertahankan)
        var NT = 12, Rt = 0.2;
        for (i = 0; i < NT; i++) {
            var a = (i / NT) * Math.PI * 2;
            B(G, 0.07, 0.06, 0.1, DGRAY, Rt * Math.cos(a), Rt * Math.sin(a), 0,
                { rz: (a * 180) / Math.PI, m: 0.6, r: 0.35 });
        }
        ring(G, 0.165, 0.04, GRAY, 0, 0, 0, { m: 0.6, r: 0.35 });                            // badan gear
        for (i = 0; i < 6; i++) {                                                           // jari-jari
            var sa = (i / 6) * Math.PI * 2;
            B(G, 0.12, 0.03, 0.04, METAL, 0.105 * Math.cos(sa), 0.105 * Math.sin(sa), 0,
                { rz: (sa * 180) / Math.PI, m: 0.6, r: 0.35 });
        }
        C(G, 0.06, 0.16, HUB, 0, 0, 0, { rx: 90, seg: 6, m: 0.7, r: 0.3 });                  // baut heksagonal
        C(G, 0.028, 0.004, CYAN, 0, 0, 0.081, { rx: 90, e: CYAN, ei: 0.9 });
        ring(G, 0.285, 0.007, CYAN, 0, 0, 0.1, { arc: 270, e: CYAN, ei: 0.9, anim: spinZ(5000, 1) }); // indikator perawatan berjalan
        // gear kecil (tetap dipertahankan), bergigi dan menyatu dengan gear utama
        var d1 = Rt + 0.1;
        var gp = G(d1 * Math.cos(rad(45)), d1 * Math.sin(rad(45)), 0);
        var Gs = frame(gp[0], gp[1], gp[2], 0);
        for (i = 0; i < 8; i++) {
            var b2 = rad(225 + i * 45);
            B(Gs, 0.05, 0.045, 0.09, MID, 0.1 * Math.cos(b2), 0.1 * Math.sin(b2), 0, { rz: (b2 * 180) / Math.PI, m: 0.5, r: 0.4 });
        }
        ring(Gs, 0.08, 0.03, SKY, 0, 0, 0, { m: 0.5, r: 0.4 });
        C(Gs, 0.035, 0.1, HUB, 0, 0, 0, { rx: 90, seg: 6, m: 0.7 });
        ring(Gs, 0.145, 0.005, CYAN, 0, 0, 0.055, { arc: 200, e: CYAN, ei: 0.8, anim: spinZ(3500, -1) });
        B(W, 0.1, 0.03, 0.1, DGRAY, gp[0], Y0 + 0.015, -0.11, { m: 0.5 });                  // kaki tiang gear kecil
        B(W, 0.04, 0.5, 0.03, DGRAY, gp[0], Y0 + 0.265, -0.11, { m: 0.5, r: 0.4 });
        C(W, 0.015, 0.06, HUB, gp[0], gp[1], -0.075, { rx: 90, seg: 12, m: 0.7 });
        // wrench (kunci pas) memasang baut gear
        var hb = G(0, 0, 0.065);
        var Wr = frame(hb[0], hb[1], hb[2], 0, 0, 140);
        ring(Wr, 0.075, 0.015, METAL, 0, 0, 0, { arc: 300, rz: -150, m: 0.8, r: 0.25 });      // kepala open-end
        B(Wr, 0.26, 0.034, 0.016, METAL, 0.205, 0, 0, { m: 0.8, r: 0.25 });                   // gagang
        B(Wr, 0.1, 0.036, 0.018, MID, 0.27, 0, 0, { m: 0.3 });                                // grip biru
        ring(Wr, 0.02, 0.008, METAL, 0.345, 0, 0, { m: 0.8, r: 0.25 });

        // ============================================================
        //  B. BUG FIXING (kiri): laptop code editor + bug + perbaikan
        // ============================================================
        var Lp = frame(-0.5, Y0, -0.15, 25);
        B(Lp, 0.24, 0.012, 0.16, METAL, 0, 0.006, 0, { m: 0.6, r: 0.35 });                    // deck
        for (i = 0; i < 3; i++) { B(Lp, 0.2, 0.003, 0.012, DGRAY, 0, 0.0135, -0.04 + i * 0.02); }
        B(Lp, 0.07, 0.002, 0.04, GRAY, 0, 0.013, 0.055);
        var Ls = sub(Lp, 0, 0.012, -0.08, 0, -12);                                            // layar miring ke belakang
        B(Ls, 0.24, 0.16, 0.01, NAVY, 0, 0.08, 0, { m: 0.4 });
        B(Ls, 0.22, 0.14, 0.004, INK, 0, 0.08, 0.007, { m: 0.05, r: 0.8 });
        var E = sub(Ls, 0, 0.08, 0, 0);
        var ez = 0.0105, ez2 = 0.0125;
        B(E, 0.22, 0.014, 0.003, "#1e293b", 0, 0.063, ez);
        Sp(E, 0.003, CYAN, -0.1, 0.063, ez2, glow(0.8));
        Sp(E, 0.003, AMBER, -0.09, 0.063, ez2, { e: AMBER, ei: 0.6 });
        Sp(E, 0.003, GRN, -0.08, 0.063, ez2, { e: GRN, ei: 0.6 });
        var rows = [
            [[0.03, SKY], [0.04, AMBER], [0.02, WHT]],
            [[0.026, SKY], [0.05, CYAN]],
            [[0.03, AMBER], [0.03, WHT], [0.04, GRN]],
            [[0.03, "#f87171"], [0.05, "#fca5a5"]],
            [[0.03, "#86efac"], [0.05, GRN]],
            [[0.02, SKY], [0.04, WHT]],
        ];
        for (i = 0; i < rows.length; i++) {
            y = 0.04 - i * 0.016;
            if (i === 3) { B(E, 0.2, 0.013, 0.002, "#7f1d1d", 0, y, ez); }                      // baris error
            if (i === 4) { B(E, 0.2, 0.013, 0.002, "#14532d", 0, y, ez); }                      // baris sudah diperbaiki
            x = -0.095 + (i % 3 === 1 ? 0.012 : 0);
            for (j = 0; j < rows[i].length; j++) {
                B(E, rows[i][j][0], 0.006, 0.003, rows[i][j][1], x + rows[i][j][0] / 2, y, ez2, { e: rows[i][j][1], ei: 0.35 });
                x += rows[i][j][0] + 0.004;
            }
        }
        cross(E, 0.088, 0.04 - 3 * 0.016, ez2, 0.014, RED);
        check(E, 0.088, 0.04 - 4 * 0.016, ez2, 0.016, GRN);
        B(E, 0.22, 0.012, 0.003, BLUE, 0, -0.062, ez);
        // bug (merah) melayang di kiri layar
        var bgx = -0.17, bgy = 0.22;
        C(Lp, 0.055, 0.003, RED, bgx, bgy, -0.02, { rx: 90, seg: 24, op: 0.3, e: RED, ei: 0.7, anim: pulse(800, 1.25) });
        Sp(Lp, 0.028, RED, bgx, bgy - 0.02, 0, { e: RED, ei: 0.6 });
        Sp(Lp, 0.018, RED_D, bgx, bgy + 0.024, 0, { e: RED, ei: 0.5 });
        Sp(Lp, 0.005, "#ffffff", bgx - 0.007, bgy + 0.03, 0.014);
        Sp(Lp, 0.005, "#ffffff", bgx + 0.007, bgy + 0.03, 0.014);
        for (k = 0; k < 3; k++) {
            var lgy = bgy - 0.004 - k * 0.018, ang = [30, 0, -30][k];
            B(Lp, 0.045, 0.004, 0.004, RED_D, bgx - 0.04, lgy, 0, { rz: ang });
            B(Lp, 0.045, 0.004, 0.004, RED_D, bgx + 0.04, lgy, 0, { rz: -ang });
        }
        B(Lp, 0.003, 0.022, 0.003, RED_D, bgx - 0.008, bgy + 0.048, 0, { rz: 25 });
        B(Lp, 0.003, 0.022, 0.003, RED_D, bgx + 0.008, bgy + 0.048, 0, { rz: -25 });
        // wrench kecil menyerang bug
        B(Lp, 0.075, 0.013, 0.007, HUB, -0.115, 0.14, 0.03, { rz: 40, m: 0.8, r: 0.25 });
        ring(Lp, 0.014, 0.005, HUB, -0.155, 0.17, 0.03, { arc: 300, rz: 165, m: 0.8, r: 0.25 });
        // perbaikan berhasil (hijau) di kanan layar
        C(Lp, 0.035, 0.006, GRN_D, 0.17, 0.2, 0, { rx: 90, seg: 32, e: GRN, ei: 0.5, anim: pulse(900, 1.1) });
        check(Lp, 0.17, 0.2, 0.006, 0.045, "#ffffff");

        // ============================================================
        //  C. SYSTEM MONITORING (kanan-belakang): dashboard status server
        // ============================================================
        var Md = frame(0.4, Y0, -0.34, -25);
        B(Md, 0.12, 0.008, 0.08, HUB, 0, 0.004, 0);
        B(Md, 0.025, 0.06, 0.014, METAL, 0, 0.038, 0);
        B(Md, 0.34, 0.24, 0.014, NAVY, 0, 0.2, 0, { m: 0.4 });
        B(Md, 0.32, 0.22, 0.004, INK, 0, 0.2, 0.009, { m: 0.05, r: 0.8 });
        var D = sub(Md, 0, 0.2, 0, 0);
        var dz1 = 0.0125, dz2 = 0.0145;
        B(D, 0.32, 0.02, 0.003, "#1e293b", 0, 0.1, dz1);                                    // top bar
        Sp(D, 0.004, GRN, -0.145, 0.1, dz2, { e: GRN, ei: 1 });
        Sp(D, 0.004, CYAN, -0.132, 0.1, dz2, glow(0.9));
        Sp(D, 0.004, RED, -0.119, 0.1, dz2, { e: RED, ei: 1, anim: blink(700) });             // peringatan terdeteksi
        B(D, 0.05, 0.012, 0.003, GRN_D, 0.12, 0.1, dz2, { e: GRN, ei: 0.5 });                 // status normal
        check(D, 0.12, 0.1, dz2 + 0.002, 0.014, "#ffffff");
        var gx = [-0.095, 0, 0.095], gv = [35, 55, 25], gc = [GRN, CYAN, SKY];                // gauge CPU / memori / disk
        for (i = 0; i < 3; i++) {
            var sw = gv[i] * 2.7;
            ring(D, 0.034, 0.005, "#334155", gx[i], 0.035, dz1, { arc: 270, rz: -45 });
            ring(D, 0.034, 0.006, gc[i], gx[i], 0.035, dz2, { arc: sw, rz: 225 - sw, e: gc[i], ei: 0.6 });
            Sp(D, 0.006, gc[i], gx[i], 0.035, dz2, { e: gc[i], ei: 0.8 });
        }
        B(D, 0.14, 0.07, 0.003, "#162447", -0.08, -0.058, dz1);                              // grafik performa
        var gy = [-0.07, -0.062, -0.066, -0.05, -0.03, -0.058, -0.066];
        for (i = 0; i < 6; i++) {
            var spike = (i === 3 || i === 4);
            line2(D, -0.14 + i * 0.02, gy[i], -0.12 + i * 0.02, gy[i + 1], dz2, spike ? RED : CYAN, 0.004, { e: spike ? RED : CYAN, ei: 0.8 });
        }
        for (i = 0; i < 10; i++) {                                                          // blok uptime
            var bad = (i === 4);
            B(D, 0.011, 0.03, 0.003, bad ? RED : GRN, 0.017 + i * 0.0135, -0.05, dz2, { e: bad ? RED : GRN, ei: 0.5 });
        }
        B(D, 0.32, 0.014, 0.003, "#14532d", 0, -0.103, dz1, { e: GRN, ei: 0.25 });          // sistem berjalan normal
        check(D, -0.14, -0.103, dz2, 0.014, GRN);

        // ============================================================
        //  D. SOFTWARE UPDATE (depan): versi lama -> versi baru
        // ============================================================
        var Us = frame(0.12, Y0, 0.42, 0);
        B(Us, 0.07, 0.06, 0.06, GRAY, -0.075, 0.033, 0, { m: 0.3 });                          // versi lama (pudar)
        B(Us, 0.074, 0.008, 0.064, DGRAY, -0.075, 0.067, 0);
        B(Us, 0.09, 0.08, 0.08, BLUE, 0.075, 0.043, 0, { e: MID, ei: 0.25 });                // versi baru
        B(Us, 0.095, 0.01, 0.085, DEEP, 0.075, 0.088, 0);
        B(Us, 0.02, 0.004, 0.086, CYAN, 0.075, 0.0935, 0, glow(0.8));
        C(Us, 0.016, 0.003, GRN_D, 0.095, 0.06, 0.0415, { rx: 90, e: GRN, ei: 0.5 });
        check(Us, 0.095, 0.06, 0.0445, 0.018, "#ffffff");
        arrow(Us(-0.03, 0.04, 0), Us(0.022, 0.04, 0), CYAN, 0.004, 0.025, 0.011);
        // ikon update: dua busur dengan kepala panah (melingkar)
        var Ui = frame(0, 0, 0, 0);
        var uc = Us(0.075, 0.19, 0.02), r0 = 0.05;
        ring(Ui, r0, 0.009, CYAN, uc[0], uc[1], uc[2], { arc: 120, rz: 30, e: CYAN, ei: 0.9, anim: mv(uc, [uc[0], uc[1] + 0.012, uc[2]], 2200, { alt: true, ease: "easeInOutSine" }) });
        ring(Ui, r0, 0.009, CYAN, uc[0], uc[1], uc[2], { arc: 120, rz: 210, e: CYAN, ei: 0.9, anim: mv(uc, [uc[0], uc[1] + 0.012, uc[2]], 2200, { alt: true, ease: "easeInOutSine" }) });
        var ends = [150, 330];
        for (i = 0; i < 2; i++) {
            var th = rad(ends[i]), hh = 0.03;
            var cx0 = uc[0] + r0 * Math.cos(th) - Math.sin(th) * hh / 2;
            var cy0 = uc[1] + r0 * Math.sin(th) + Math.cos(th) * hh / 2;
            cone(Ui, 0.014, hh, CYAN, cx0, cy0, uc[2], { rz: ends[i], e: CYAN, ei: 1, anim: mv([cx0, cy0, uc[2]], [cx0, cy0 + 0.012, uc[2]], 2200, { alt: true, ease: "easeInOutSine" }) });
        }
        B(Us, 0.16, 0.012, 0.02, NAVY, 0, 0.006, 0.1);                                      // progress bar
        B(Us, 0.05, 0.014, 0.022, CYAN, -0.055, 0.007, 0.1, { e: CYAN, ei: 0.9, anim: mv(Us(-0.055, 0.007, 0.1), Us(0.055, 0.007, 0.1), 1600) });

        // ============================================================
        //  SIKLUS MAINTENANCE: Monitoring -> Bug Fixing -> Update -> Monitoring
        // ============================================================
        var sM = [0.4, -0.34], sB = [-0.5, -0.15], sU = [0.12, 0.42];
        var yl = Y0 + 0.012, yp = Y0 + 0.026;
        function edge(p, q, o1, o2, delay) {
            var dx = q[0] - p[0], dz = q[1] - p[1], L = Math.sqrt(dx * dx + dz * dz);
            var ux = dx / L, uz = dz / L;
            var a = [p[0] + ux * o1, yl, p[1] + uz * o1], b = [q[0] - ux * o2, yl, q[1] - uz * o2];
            arrow(a, b, CYAN, 0.004, 0.035, 0.013);
            pkt([a[0], yp, a[2]], [b[0], yp, b[2]], CYAN, 3400, { delay: delay });
        }
        edge(sM, sB, 0.2, 0.2, 0);
        edge(sB, sU, 0.2, 0.2, 700);
        edge(sU, sM, 0.2, 0.2, 1400);

        // ============================================================
        //  LABEL + CALLOUT (konsisten dengan stage sebelumnya)
        // ============================================================
        var tipGear = G(0, 0.292, 0.1);
        var tipBug = Ls(0, 0.168, 0);
        var tipMon = Md(0, 0.325, 0);
        var tipUpd = Us(0.075, 0.255, 0.02);
        callout("System Maintenance", tipGear[0], 0.62, -0.05, tipGear);
        callout("Bug Fixing", tipBug[0], 0.3, -0.3, tipBug);
        callout("System Monitoring", tipMon[0], 0.4, -0.45, tipMon);
        callout("Software Update", 0.8, -0.12, tipUpd[2], tipUpd);

        return stageWrap(items);
    
};
