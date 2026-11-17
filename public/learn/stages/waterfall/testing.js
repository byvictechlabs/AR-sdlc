/**
 * waterfall/testing.js — Waterfall tahap 4: Testing (3 zona callout).
 * Label: Test Case, Bug Reporting, System Testing.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Waterfall.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["waterfall/testing"] = function () {
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
    //  1. TEST CASE (kiri-belakang): clipboard daftar kasus uji
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Tc = board(A, 0.24, 0.19, { x: 0, z: -0.05, bg: ICE, htxt: "TEST CASE", hc: MID });
    B(A, 0.07, 0.018, 0.024, SLATE, 0, 0.254, -0.05, { m: 0.4, r: 0.35 });   // klip logam
    B(A, 0.03, 0.01, 0.008, "#cbd5e1", 0, 0.264, -0.038);
    for (i = 0; i < 4; i++) {
        B(Tc, 0.15, 0.01, 0.004, WHITE, -0.02, 0.045 - i * 0.034, 0.005);
        check(Tc, 0.09, 0.045 - i * 0.034, 0.006, 0.016, i === 3 ? AMBER : GREEN);
    }

    // ============================================================
    //  2. BUG REPORTING (kanan-belakang): kutu + tiket laporan bug
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    bug(Bz, -0.1, 0.038, 0.04, { s: 1.2 });
    // tiket laporan (berdiri miring)
    var Tk = sub(Bz, 0.08, 0.07, 0.02, -10);
    B(Tk, 0.15, 0.11, 0.007, WHITE, 0, 0, 0, { m: 0.05, r: 0.85 });
    B(Tk, 0.15, 0.03, 0.004, RED, 0, 0.04, 0.005, {
        text: "value: BUG REPORT; align: center; anchor: center; baseline: center; " +
            "color: #ffffff; width: " + n(0.14) + "; wrapCount: 13; zOffset: " + n(0.003),
    });
    B(Tk, 0.11, 0.008, 0.003, SLATE, -0.01, 0.012, 0.005);
    B(Tk, 0.08, 0.008, 0.003, SLATE, -0.025, -0.006, 0.005);
    B(Tk, 0.11, 0.008, 0.003, SLATE, -0.01, -0.024, 0.005);
    check(Tk, 0.055, -0.036, 0.006, 0.016, RED);
    // garis perforasi (titik-titik sisi tiket)
    for (i = 0; i < 5; i++) { Sp(Tk, 0.005, "#cbd5e1", -0.075, -0.04 + i * 0.02, 0.004); }
    // tiang penyangga tiket
    B(Bz, 0.01, 0.06, 0.01, SLATE, 0.08, 0.03, -0.02, { m: 0.4 });
    // status terbuka
    Sp(Bz, 0.009, AMBER, 0.17, 0.14, 0.02, {
        e: AMBER, ei: 1,
        anim: "property: emissiveIntensity; from: 0.25; to: 1; loop: true; dur: 650; dir: alternate",
    });
    tag(Bz, "Open", 0.17, 0.085, 0.02);

    // ============================================================
    //  3. SYSTEM TESTING (tengah-depan): penguji mengecek layar besar
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var St = screen(Cz, 0.3, 0.19, { x: 0.04, z: -0.07, bg: "#0f172a" });
    for (i = 0; i < 3; i++) {
        B(St, 0.17, 0.011, 0.003, SLATE, -0.035, 0.05 - i * 0.042, 0.005);
        check(St, 0.105, 0.05 - i * 0.042, 0.006, 0.018, i === 1 ? AMBER : GREEN);
    }
    B(St, 0.06, 0.014, 0.003, CYAN, -0.1, -0.07, 0.005, glow(0.5));
    person(Cz, -0.16, 0.07, { point: true, c: DEEP });
    // kaca pembesar melayang memeriksa baris kedua
    var Mg = sub(Cz, 0.1, 0.12, -0.04, 0);
    part(Mg, "primitive: torus; radius: " + n(0.04) + "; radiusTubular: " + n(0.008) +
        "; segmentsRadial: 8; segmentsTubular: 24", "#e2e8f0", 0, 0, 0, { m: 0.5, r: 0.3 });
    C(Mg, 0.032, 0.004, ICE, 0, 0, 0, { rx: 90, seg: 24, op: 0.45, m: 0.05, r: 0.2 });
    B(Mg, 0.016, 0.06, 0.016, AMBER, 0.042, -0.044, 0, { rz: -45, m: 0.35 });
    // garis pemeriksaan
    seg(Cz(0.07, 0.1, -0.02), Cz(0.06, 0.06, -0.03), CYAN, 0.003, glow(0.8));

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0, 0.27, -0.05);       // klip papan test case
    var t2 = Bz(-0.1, 0.1, 0.04);     // puncak kutu
    var t3 = Cz(0.04, 0.24, -0.07);   // puncak layar system testing
    callout("Test Case", t1[0], 0.32, -0.22, t1);
    callout("Bug Reporting", t2[0], 0.32, -0.22, t2);
    callout("System Testing", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
