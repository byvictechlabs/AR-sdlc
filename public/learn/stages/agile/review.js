/**
 * agile/review.js — Agile tahap 6: Review (3 zona callout).
 * Label: Demo, Feedback, Improvement Plan.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile
 * (mengganti label lama: Sprint Presentation, Stakeholder Feedback, dst).
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/review"] = function () {
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
    //  1. DEMO (kiri-belakang): presenter + layar grafik performa sprint
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Dm = screen(A, 0.27, 0.18, { x: 0.05, z: -0.05, bg: "#0f172a" });
    B(Dm, 0.23, 0.024, 0.003, MID, 0, 0.06, 0.005);
    // batang grafik
    var barH = [0.05, 0.08, 0.065, 0.1], barC = [SKY, CYAN, AMBER, GREEN];
    for (i = 0; i < 4; i++) {
        B(Dm, 0.035, barH[i], 0.004, barC[i], -0.075 + i * 0.05, -0.055 + barH[i] / 2, 0.005,
            { e: barC[i], ei: 0.35 });
    }
    B(Dm, 0.21, 0.006, 0.003, SLATE, 0, -0.057, 0.005);
    person(A, -0.14, 0.07, { point: true, c: DEEP });
    bubble(A, -0.16, 0.17, 0.06, { w: 0.055, h: 0.036 });

    // ============================================================
    //  2. FEEDBACK (kanan-belakang): gelembung komentar + jempol
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    // gelembung besar (komentar utama)
    B(Bz, 0.17, 0.11, 0.016, WHITE, -0.02, 0.15, -0.02, { m: 0.1, r: 0.8 });
    part(Bz, "primitive: cone; radiusBottom: " + n(0.016) + "; radiusTop: 0; height: " + n(0.03) +
        "; segmentsRadial: 10", WHITE, 0.0, 0.078, -0.02, { rx: 180, m: 0.1, r: 0.8 });
    for (i = 0; i < 3; i++) {
        B(Bz, 0.13 - i * 0.03, 0.01, 0.005, SLATE, -0.03, 0.175 - i * 0.03, -0.011);
    }
    // gelembung kecil pendamping
    bubble(Bz, -0.15, 0.06, 0.06, { w: 0.06, h: 0.04, lines: false, c: ICE });
    bubble(Bz, 0.13, 0.05, 0.05, { w: 0.05, h: 0.034, lines: false, c: PALE });
    // jempol (apresiasi) di kanan-bawah
    B(Bz, 0.05, 0.055, 0.022, "#fde68a", 0.11, 0.13, 0.07, { rz: -10, m: 0.4 });
    B(Bz, 0.02, 0.05, 0.02, "#fcd34d", 0.093, 0.172, 0.07, { rz: -22, m: 0.4 });
    B(Bz, 0.056, 0.02, 0.024, "#f59e0b", 0.112, 0.098, 0.07, { rz: -10, m: 0.4 });
    Sp(Bz, 0.014, CYAN, 0.155, 0.155, 0.07, { e: CYAN, ei: 0.8, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 1000; dir: alternate" });

    // ============================================================
    //  3. IMPROVEMENT PLAN (tengah-depan): papan tugas + panah melingkar
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Pb = board(Cz, 0.24, 0.16, { x: -0.05, z: -0.05, bg: WHITE, htxt: "IMPROVE", hc: MID });
    for (i = 0; i < 3; i++) {
        B(Pb, 0.13, 0.01, 0.004, SLATE, -0.025, 0.035 - i * 0.035, 0.005);
        check(Pb, 0.075, 0.035 - i * 0.035, 0.006, 0.015, i < 2 ? GREEN : AMBER);
    }
    // panah melingkar (perbaikan berkelanjutan) di kanan depan papan
    var ccx = 0.13, ccy = 0.14, cr = 0.055, ang, rad = Math.PI / 180;
    for (i = 0; i < 4; i++) {
        ang = 35 + i * 78;
        B(Cz, 0.05, 0.012, 0.01, CYAN,
            ccx + cr * Math.cos(ang * rad), ccy + cr * Math.sin(ang * rad), 0.06,
            { rz: ang + 90, e: CYAN, ei: 0.5 });
    }
    arrow(
        Cz(ccx + cr * Math.cos(326 * rad), ccy + cr * Math.sin(326 * rad), 0.06),
        Cz(ccx + cr * Math.cos(352 * rad), ccy + cr * Math.sin(352 * rad), 0.06),
        CYAN, 0.005, { e: CYAN, ei: 0.9, h: 0.03 });
    Sp(Cz, 0.01, GREEN, ccx, ccy, 0.06, { e: GREEN, ei: 0.8 });
    tag(Cz, "Iterasi", ccx, ccy - 0.1, 0.06);

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.05, 0.22, -0.05);    // puncak layar demo
    var t2 = Bz(-0.02, 0.23, -0.02);  // puncak gelembung besar
    var t3 = Cz(ccx, ccy + 0.09, 0.06);// puncak panah melingkar
    callout("Demo", t1[0], 0.32, -0.22, t1);
    callout("Feedback", t2[0], 0.32, -0.22, t2);
    callout("Improvement Plan", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
