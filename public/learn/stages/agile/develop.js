/**
 * agile/develop.js — Agile tahap 3: Develop (3 zona callout).
 * Label: Coding, Version Control, Collaboration.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/develop"] = function () {
    var K = stageKit(), items = K.items, W = K.W;
    var NAVY = K.NAVY, DEEP = K.DEEP, BLUE = K.BLUE, MID = K.MID, SKY = K.SKY,
        PALE = K.PALE, ICE = K.ICE, WHITE = K.WHITE, SLATE = K.SLATE, CYAN = K.CYAN,
        AMBER = K.AMBER, GREEN = K.GREEN, RED = K.RED;
    var n = K.n, pos = K.pos, frame = K.frame, sub = K.sub, part = K.part,
        B = K.B, C = K.C, Sp = K.Sp, seg = K.seg, mv = K.mv, glow = K.glow,
        callout = K.callout, tag = K.tag, check = K.check, person = K.person,
        screen = K.screen, board = K.board, doc = K.doc, bubble = K.bubble,
        server = K.server, cloud = K.cloud, rocket = K.rocket, bug = K.bug, arrow = K.arrow;
    var Y0 = -0.36, i;

    K.platform();
    B(W, 0.46, 0.008, 0.3, "#2a5bd7", -0.35, -0.364, -0.16, { m: 0.1 });
    B(W, 0.46, 0.008, 0.3, "#2a5bd7", 0.35, -0.364, -0.16, { m: 0.1 });
    B(W, 0.52, 0.008, 0.3, "#2a5bd7", 0, -0.364, 0.24, { m: 0.1 });

    // ============================================================
    //  1. CODING (kiri-belakang): programmer + monitor berisi kode
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Sc = screen(A, 0.29, 0.19, { x: 0.04, z: -0.05, bg: "#0f172a" });
    var cW = [0.15, 0.2, 0.1, 0.18, 0.12, 0.19], cC = [CYAN, PALE, AMBER, WHITE, SKY, CYAN];
    for (i = 0; i < 6; i++) {
        B(Sc, cW[i], 0.01, 0.003, cC[i], -0.125 + cW[i] / 2, 0.06 - i * 0.021, 0.004);
    }
    B(Sc, 0.012, 0.01, 0.003, "#ffffff", -0.1, -0.06, 0.004, {
        e: "#ffffff", ei: 1,
        anim: "property: emissiveIntensity; from: 0.2; to: 1; loop: true; dur: 550; dir: alternate",
    });
    person(A, -0.15, 0.06, { point: true, c: MID });
    // cangkir kopi
    C(A, 0.013, 0.03, WHITE, -0.02, 0.015, 0.09, { seg: 14, m: 0.1, r: 0.6 });
    B(A, 0.008, 0.014, 0.006, WHITE, -0.005, 0.017, 0.09, { m: 0.1 });

    // ============================================================
    //  2. VERSION CONTROL (kanan-belakang): diagram cabang (commit + branch)
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    // garis utama (main) + garis cabang (dev)
    var mA = Bz(-0.17, 0.07, -0.06), mB = Bz(0.17, 0.07, -0.06);
    seg(mA, mB, CYAN, 0.005, glow(0.9));
    var bA = Bz(-0.02, 0.07, -0.06), bB = Bz(0.13, 0.16, -0.01);
    seg(bA, bB, AMBER, 0.005, glow(0.9));
    // titik commit di garis utama
    var mainX = [-0.17, -0.1, 0.04, 0.17], j;
    for (i = 0; i < 4; i++) {
        var p = Bz(mainX[i], 0.07, -0.06);
        Sp(W, 0.011, CYAN, p[0], p[1], p[2], { e: CYAN, ei: 0.8, m: 0.3 });
        seg([p[0], -0.355, p[2]], [p[0], p[1] - 0.012, p[2]], "#334155", 0.003);
    }
    // titik commit di cabang dev
    var devPts = [Bz(0.04, 0.1, -0.045), Bz(0.13, 0.16, -0.01)];
    for (i = 0; i < 2; i++) {
        Sp(W, 0.011, AMBER, devPts[i][0], devPts[i][1], devPts[i][2], { e: AMBER, ei: 0.9, m: 0.3 });
    }
    // panah gabung (merge dev → main)
    arrow(Bz(0.16, 0.2, -0.01), Bz(0.175, 0.09, -0.055), GREEN, 0.004, { e: GREEN, ei: 0.9 });
    tag(Bz, "main", -0.17, 0.02, -0.06);
    tag(Bz, "dev", 0.14, 0.2, -0.01);
    // potongan cabang kecil (referensi visual)
    Sp(Bz, 0.006, GREEN, -0.14, 0.14, 0.08, { e: GREEN, ei: 0.7, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 1100; dir: alternate" });

    // ============================================================
    //  3. COLLABORATION (tengah-depan): dua orang berbagi satu layar
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Sh = screen(Cz, 0.26, 0.17, { x: 0, z: -0.06, bg: ICE });
    B(Sh, 0.22, 0.026, 0.003, BLUE, 0, 0.056, 0.005);
    Sp(Sh, 0.005, CYAN, -0.095, 0.056, 0.008, glow(0.6));
    B(Sh, 0.1, 0.05, 0.003, WHITE, -0.05, 0.005, 0.005);
    B(Sh, 0.1, 0.05, 0.003, WHITE, 0.06, 0.005, 0.005);
    B(Sh, 0.08, 0.01, 0.003, SLATE, -0.05, -0.03, 0.005);
    B(Sh, 0.08, 0.01, 0.003, SLATE, 0.06, -0.03, 0.005);
    // dua kursor saling menunjuk (animasi keduanya)
    part(Sh, "primitive: cone; radiusBottom: " + n(0.008) + "; radiusTop: 0; height: " + n(0.032) +
        "; segmentsRadial: 10", AMBER, -0.03, 0.02, 0.012, {
        rz: 40, e: AMBER, ei: 0.7,
        anim: "property: position; from: " + pos(Sh(-0.03, 0.02, 0.012)) + "; to: " +
            pos(Sh(-0.06, -0.01, 0.012)) + "; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine",
    });
    part(Sh, "primitive: cone; radiusBottom: " + n(0.008) + "; radiusTop: 0; height: " + n(0.032) +
        "; segmentsRadial: 10", CYAN, 0.05, -0.02, 0.012, {
        rz: 40, e: CYAN, ei: 0.7,
        anim: "property: position; from: " + pos(Sh(0.05, -0.02, 0.012)) + "; to: " +
            pos(Sh(0.08, 0.02, 0.012)) + "; dur: 2300; loop: true; dir: alternate; easing: easeInOutSine",
    });
    // dua pengembang di kiri-kanan
    person(Cz, -0.17, 0.08, { c: DEEP });
    person(Cz, 0.17, 0.08, { c: SKY });
    seg(Cz(-0.155, 0.14, 0.07), Cz(-0.1, 0.1, 0.0), CYAN, 0.003, glow(0.6));
    seg(Cz(0.155, 0.14, 0.07), Cz(0.1, 0.08, 0.0), CYAN, 0.003, glow(0.6));
    bubble(Cz, 0, 0.23, -0.02, { w: 0.1, h: 0.055 });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.04, 0.23, -0.05);    // puncak monitor
    var t2 = Bz(-0.02, 0.1, -0.06);   // garis utama
    var t3 = Cz(0, 0.28, -0.02);      // puncak gelembung
    callout("Coding", t1[0], 0.32, -0.22, t1);
    callout("Version Control", t2[0], 0.32, -0.22, t2);
    callout("Collaboration", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
