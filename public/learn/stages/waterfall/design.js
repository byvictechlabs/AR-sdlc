/**
 * waterfall/design.js — Waterfall tahap 2: Design (3 zona callout).
 * Label: System Architecture, Database Design, UI Design.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Waterfall.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["waterfall/design"] = function () {
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
    //  1. SYSTEM ARCHITECTURE (kiri-belakang): Frontend → API → Backend
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    // Frontend (monitor kecil)
    var Fe = sub(A, -0.15, 0, -0.02, 0);
    B(Fe, 0.075, 0.006, 0.045, SLATE, 0, 0.003, 0);
    B(Fe, 0.014, 0.04, 0.01, SLATE, 0, 0.026, 0);
    B(Fe, 0.115, 0.08, 0.01, MID, 0, 0.09, 0, { m: 0.35 });
    B(Fe, 0.101, 0.066, 0.003, ICE, 0, 0.09, 0.006, { m: 0.05 });
    B(Fe, 0.101, 0.014, 0.003, BLUE, 0, 0.116, 0.008);
    B(Fe, 0.06, 0.02, 0.003, CYAN, -0.01, 0.078, 0.008, { e: CYAN, ei: 0.4 });
    B(Fe, 0.04, 0.014, 0.003, WHITE, -0.02, 0.056, 0.008);
    tag(Fe, "Frontend", 0, 0.017, 0.055);
    // API (oktahedron wireframe berputar di atas tiang)
    var Ap = sub(A, 0, 0, -0.02, 0);
    C(Ap, 0.04, 0.008, "#0e7490", 0, 0.004, 0, { seg: 6 });
    C(Ap, 0.004, 0.05, SLATE, 0, 0.033, 0, { seg: 8 });
    part(Ap, "primitive: octahedron; radius: " + n(0.05), CYAN, 0, 0.1, 0, {
        wire: true, e: CYAN, ei: 0.6,
        anim: "property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear",
    });
    part(Ap, "primitive: octahedron; radius: " + n(0.024), MID, 0, 0.1, 0, { e: MID, ei: 0.5 });
    tag(Ap, "API", 0, 0.017, 0.055);
    // Backend (rak server)
    var Be = sub(A, 0.15, 0, -0.02, 0);
    var Sb = server(Be, 0, 0, { n: 3, w: 0.085, d: 0.055 });
    tag(Be, "Backend", 0, 0.017, 0.055);
    // jalur data + paket
    seg(A(-0.09, 0.04, -0.02), A(-0.05, 0.04, -0.02), CYAN, 0.004, glow(0.9));
    seg(A(0.05, 0.04, -0.02), A(0.09, 0.04, -0.02), CYAN, 0.004, glow(0.9));
    Sp(W, 0.007, "#ffffff", A(-0.09, 0.05, -0.02)[0], A(-0.09, 0.05, -0.02)[1], A(-0.09, 0.05, -0.02)[2], {
        e: "#ffffff", ei: 1,
        anim: mv(A(-0.09, 0.05, -0.02), A(0.09, 0.05, -0.02), 2400),
    });
    Sp(W, 0.007, AMBER, A(0.09, 0.065, -0.02)[0], A(0.09, 0.065, -0.02)[1], A(0.09, 0.065, -0.02)[2], {
        e: AMBER, ei: 1,
        anim: mv(A(0.09, 0.065, -0.02), A(-0.09, 0.065, -0.02), 2400, { delay: 1200 }),
    });

    // ============================================================
    //  2. DATABASE DESIGN (kanan-belakang): silinder database + ERD
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    for (i = 0; i < 3; i++) {
        C(Bz, 0.06, 0.034, BLUE, 0.06, 0.017 + i * 0.04, -0.03, { seg: 32, m: 0.3, r: 0.4 });
        B(Bz, 0.028, 0.005, 0.002, CYAN, 0.06, 0.017 + i * 0.04, 0.031, glow(1));
    }
    for (i = 0; i < 2; i++) { C(Bz, 0.0615, 0.006, CYAN, 0.06, 0.034 + i * 0.04, -0.03, { seg: 32, e: CYAN, ei: 0.8 }); }
    C(Bz, 0.06, 0.004, PALE, 0.06, 0.106, -0.03, { seg: 32 });
    // dua tabel ERD
    function table(f) {
        B(f, 0.1, 0.012, 0.075, ICE, 0, 0.006, 0);
        B(f, 0.1, 0.003, 0.018, MID, 0, 0.0135, -0.0285);
        Sp(f, 0.004, CYAN, -0.04, 0.0165, -0.0285, glow(1));
        for (var j = 0; j < 3; j++) { B(f, 0.085, 0.002, 0.006, SKY, 0, 0.013, -0.006 + j * 0.014); }
    }
    table(sub(Bz, -0.14, 0, 0.06, 0));
    table(sub(Bz, 0.1, 0, 0.07, 0));
    seg(Bz(-0.09, 0.01, 0.06), Bz(0.05, 0.01, 0.07), CYAN, 0.0035, glow(0.9));
    seg(Bz(-0.14, 0.01, 0.02), Bz(-0.04, 0.01, -0.01), CYAN, 0.0025, glow(0.7));
    seg(Bz(0.1, 0.01, 0.03), Bz(0.1, 0.01, 0.0), CYAN, 0.0025, glow(0.7));
    Sp(W, 0.006, "#ffffff", Bz(-0.09, 0.02, 0.06)[0], Bz(-0.09, 0.02, 0.06)[1], Bz(-0.09, 0.02, 0.06)[2], {
        e: "#ffffff", ei: 1,
        anim: mv(Bz(-0.09, 0.02, 0.06), Bz(0.05, 0.02, 0.07), 2000, { alt: true, ease: "easeInOutSine" }),
    });
    tag(Bz, "Tabel", -0.14, 0.03, 0.13);

    // ============================================================
    //  3. UI DESIGN (tengah-depan): layar wireframe UI + mockup ponsel
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Ui = screen(Cz, 0.3, 0.19, { x: -0.04, z: -0.05, bg: WHITE });
    B(Ui, 0.26, 0.03, 0.003, MID, 0, 0.068, 0.005);
    B(Ui, 0.016, 0.014, 0.003, CYAN, -0.115, 0.068, 0.008, glow(0.6));
    for (i = 0; i < 3; i++) { B(Ui, 0.026, 0.006, 0.003, PALE, 0.02 + i * 0.04, 0.068, 0.008); }
    B(Ui, 0.06, 0.106, 0.003, ICE, -0.095, 0.005, 0.005);
    for (i = 0; i < 4; i++) { B(Ui, 0.04, 0.008, 0.003, SKY, -0.095, 0.04 - i * 0.024, 0.008); }
    B(Ui, 0.13, 0.05, 0.003, "#e2e8f0", 0.03, 0.03, 0.005);
    B(Ui, 0.06, 0.016, 0.003, CYAN, 0.03, 0.03, 0.008, { e: CYAN, ei: 0.4 });
    B(Ui, 0.06, 0.03, 0.003, "#e2e8f0", -0.01, -0.038, 0.005);
    B(Ui, 0.06, 0.03, 0.003, "#e2e8f0", 0.06, -0.038, 0.005);
    B(Ui, 0.03, 0.014, 0.003, AMBER, 0.12, -0.038, 0.008);
    // mockup ponsel berdiri di kanan
    var Mp = sub(Cz, 0.16, 0, -0.01, -14);
    B(Mp, 0.055, 0.006, 0.035, SLATE, 0, 0.003, 0);
    B(Mp, 0.075, 0.15, 0.01, NAVY, 0, 0.081, 0, { m: 0.4 });
    B(Mp, 0.065, 0.138, 0.003, ICE, 0, 0.081, 0.006, { m: 0.05 });
    B(Mp, 0.065, 0.02, 0.003, BLUE, 0, 0.14, 0.008);
    B(Mp, 0.05, 0.03, 0.003, CYAN, 0, 0.105, 0.008, { e: CYAN, ei: 0.35 });
    B(Mp, 0.05, 0.012, 0.003, SLATE, 0, 0.075, 0.008);
    B(Mp, 0.05, 0.012, 0.003, SLATE, 0, 0.055, 0.008);
    B(Mp, 0.05, 0.014, 0.003, AMBER, 0, 0.03, 0.008);

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0, 0.17, -0.02);        // puncak oktahedron API
    var t2 = Bz(0.06, 0.12, -0.03);    // puncak silinder database
    var t3 = Cz(-0.04, 0.24, -0.05);   // puncak layar UI
    callout("System Architecture", t1[0], 0.32, -0.22, t1);
    callout("Database Design", t2[0], 0.32, -0.22, t2);
    callout("UI Design", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
