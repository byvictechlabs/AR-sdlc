/**
 * agile/launch.js — Agile tahap 7: Launch (3 zona callout).
 * Label: Release, User Adoption, Monitoring.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * CATATAN: mesh AG_LAUNCH belum ada di GLB & DB (Agile punya 6 mesh aktif) —
 * builder ini disiapkan lebih dulu supaya langsung jalan saat mesh+step ditambahkan.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/launch"] = function () {
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
    //  1. RELEASE (kiri-belakang): roket rilis + bendera versi
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    C(A, 0.06, 0.016, "#334155", -0.05, 0.008, 0, { seg: 24, m: 0.3 });
    C(A, 0.048, 0.005, SLATE, -0.05, 0.019, 0, { seg: 24 });
    var apex = rocket(A, -0.05, 0.035, 0, { c: ICE, s: MID });
    // bendera rilis di samping
    B(A, 0.007, 0.17, 0.007, SLATE, 0.13, 0.085, 0.02, { m: 0.5, r: 0.4 });
    B(A, 0.07, 0.045, 0.004, CYAN, 0.17, 0.15, 0.02, { e: CYAN, ei: 0.5, m: 0.2 });
    tag(A, "v1.0", 0.17, 0.105, 0.02);
    // garis kecepatan
    B(A, 0.005, 0.08, 0.005, WHITE, -0.11, 0.12, 0.05, {
        e: "#ffffff", ei: 0.7, op: 0.6,
        anim: "property: position; from: " + pos(A(-0.11, 0.06, 0.05)) + "; to: " +
            pos(A(-0.11, 0.26, 0.05)) + "; dur: 950; loop: true",
    });

    // ============================================================
    //  2. USER ADOPTION (kanan-belakang): banyak orang memakai aplikasi
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    var seats = [
        [-0.15, -0.04, 0.8], [-0.06, 0.07, 0.85], [0.05, -0.06, 0.8],
        [0.15, 0.05, 0.85], [0.0, -0.14, 0.75],
    ];
    for (i = 0; i < seats.length; i++) {
        var sx = seats[i][0], sz = seats[i][1];
        person(Bz, sx, sz, { s: seats[i][2], c: i % 2 ? DEEP : MID });
        // ponsel melayang di depan dada
        B(Bz, 0.03, 0.05, 0.007, NAVY, sx + 0.045, 0.075 * seats[i][2], sz + 0.03,
            { ry: -14, m: 0.4 });
        B(Bz, 0.024, 0.04, 0.003, CYAN, sx + 0.045, 0.075 * seats[i][2], sz + 0.035,
            { ry: -14, e: CYAN, ei: 0.55 });
    }
    // layar aplikasi bersama melayang di atas
    B(Bz, 0.13, 0.09, 0.008, NAVY, 0, 0.235, -0.04, {
        m: 0.4,
        anim: "property: position; from: " + pos(Bz(0, 0.23, -0.04)) + "; to: " +
            pos(Bz(0, 0.245, -0.04)) + "; dur: 2600; loop: true; dir: alternate; easing: easeInOutSine",
    });
    B(Bz, 0.11, 0.07, 0.003, ICE, 0, 0.235, -0.034, {
        m: 0.05,
        anim: "property: position; from: " + pos(Bz(0, 0.23, -0.034)) + "; to: " +
            pos(Bz(0, 0.245, -0.034)) + "; dur: 2600; loop: true; dir: alternate; easing: easeInOutSine",
    });
    B(Bz, 0.11, 0.016, 0.003, BLUE, 0, 0.26, -0.031, {
        anim: "property: position; from: " + pos(Bz(0, 0.255, -0.031)) + "; to: " +
            pos(Bz(0, 0.27, -0.031)) + "; dur: 2600; loop: true; dir: alternate; easing: easeInOutSine",
    });
    B(Bz, 0.06, 0.03, 0.003, CYAN, -0.01, 0.23, -0.031, {
        e: CYAN, ei: 0.4,
        anim: "property: position; from: " + pos(Bz(-0.01, 0.225, -0.031)) + "; to: " +
            pos(Bz(-0.01, 0.24, -0.031)) + "; dur: 2600; loop: true; dir: alternate; easing: easeInOutSine",
    });
    tag(Bz, "Adoption", 0, 0.17, -0.04);

    // ============================================================
    //  3. MONITORING (tengah-depan): dashboard grafik + titik denyut
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Mn = screen(Cz, 0.3, 0.19, { x: 0, z: -0.06, bg: "#0f172a" });
    B(Mn, 0.26, 0.026, 0.003, MID, 0, 0.068, 0.005);
    B(Mn, 0.04, 0.014, 0.003, GREEN, 0.1, 0.068, 0.008, { e: GREEN, ei: 0.5 });
    // grafik garis naik
    var gPts = [[-0.11, -0.04], [-0.05, -0.015], [0.01, -0.03], [0.07, 0.015]];
    for (i = 0; i < gPts.length - 1; i++) {
        seg(Mn(gPts[i][0], gPts[i][1], 0.006), Mn(gPts[i + 1][0], gPts[i + 1][1], 0.006),
            CYAN, 0.0045, glow(1));
    }
    for (i = 0; i < gPts.length; i++) {
        var q = Mn(gPts[i][0], gPts[i][1], 0.007);
        Sp(W, 0.008, CYAN, q[0], q[1], q[2], { e: CYAN, ei: 0.9, m: 0.3 });
    }
    // titik denyut di ujung grafik
    var last = Mn(gPts[3][0], gPts[3][1], 0.008);
    Sp(W, 0.011, GREEN, last[0], last[1], last[2], {
        e: GREEN, ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 700; dir: alternate",
    });
    // batang kecil di kanan-bawah + garis dasar
    var mH = [0.03, 0.045, 0.038];
    for (i = 0; i < 3; i++) {
        B(Mn, 0.024, mH[i], 0.004, AMBER, 0.05 + i * 0.036, -0.06 + mH[i] / 2, 0.006, { e: AMBER, ei: 0.3 });
    }
    B(Mn, 0.24, 0.005, 0.003, SLATE, 0, -0.062, 0.006);
    person(Cz, -0.19, 0.08, { s: 0.8, c: DEEP });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = apex(0, 0.01, 0);        // puncak roket
    var t2 = Bz(0, 0.29, -0.04);      // layar adoption melayang
    var t3 = Mn(0, 0.11, 0.005);      // puncak layar dashboard
    callout("Release", t1[0], 0.32, -0.22, t1);
    callout("User Adoption", t2[0], 0.32, -0.22, t2);
    callout("Monitoring", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
