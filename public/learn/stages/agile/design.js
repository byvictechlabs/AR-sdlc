/**
 * agile/design.js — Agile tahap 2: Design (3 zona callout).
 * Label: Wireframe, UI/UX Design, System Architecture.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/design"] = function () {
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
    //  1. WIREFRAME (kiri-belakang): layar berisi kerangka kotak + pensil
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Wf = screen(A, 0.3, 0.19, { x: 0.02, z: -0.05, bg: WHITE });
    // kerangka: navbar + sidebar + blok konten (hanya garis, tanpa warna)
    B(Wf, 0.26, 0.03, 0.003, "#cbd5e1", 0, 0.068, 0.005);
    B(Wf, 0.02, 0.016, 0.003, "#94a3b8", -0.11, 0.068, 0.008);
    B(Wf, 0.07, 0.11, 0.003, "#e2e8f0", -0.085, 0.003, 0.005);
    for (i = 0; i < 4; i++) { B(Wf, 0.05, 0.008, 0.003, "#cbd5e1", -0.085, 0.04 - i * 0.022, 0.008); }
    B(Wf, 0.16, 0.06, 0.003, "#e2e8f0", 0.045, 0.033, 0.005);
    B(Wf, 0.07, 0.04, 0.003, "#cbd5e1", -0.02, -0.038, 0.005);
    B(Wf, 0.07, 0.04, 0.003, "#cbd5e1", 0.06, -0.038, 0.005);
    B(Wf, 0.05, 0.016, 0.003, "#94a3b8", 0.13, -0.038, 0.008);   // kotak tombol kosong
    // pensil di depan layar
    var Pc = sub(A, 0.13, 0.006, 0.07, -18);
    C(Pc, 0.006, 0.08, AMBER, 0, 0, 0, { rz: 90, seg: 8, m: 0.3 });
    part(Pc, "primitive: cone; radiusBottom: " + n(0.006) + "; radiusTop: 0; height: " + n(0.02) +
        "; segmentsRadial: 8", "#fde68a", 0.05, 0, 0, { rz: -90 });
    B(A, 0.11, 0.004, 0.07, WHITE, -0.1, 0.003, 0.08, { ry: 9 });   // lembar wireframe lantai
    B(A, 0.07, 0.003, 0.04, PALE, -0.09, 0.006, 0.08, { ry: 9 });

    // ============================================================
    //  2. UI/UX DESIGN (kanan-belakang): desainer + palet warna + layar
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    var Ui = screen(Bz, 0.2, 0.15, { x: 0.04, z: -0.07, bg: ICE });
    B(Ui, 0.17, 0.026, 0.003, BLUE, 0, 0.05, 0.005);
    Sp(Ui, 0.006, CYAN, -0.07, 0.05, 0.008, glow(0.6));
    B(Ui, 0.17, 0.05, 0.003, CYAN, 0, 0.008, 0.005, { e: CYAN, ei: 0.3 });
    B(Ui, 0.05, 0.04, 0.003, WHITE, -0.055, -0.045, 0.005);
    B(Ui, 0.05, 0.04, 0.003, WHITE, 0.01, -0.045, 0.005);
    B(Ui, 0.03, 0.016, 0.003, AMBER, 0.065, -0.045, 0.005);
    person(Bz, -0.14, 0.04, { c: DEEP });
    bubble(Bz, -0.14, 0.17, 0.03, { w: 0.06, h: 0.04 });
    // palet warna (piringan + titik warna)
    C(Bz, 0.055, 0.01, "#e2e8f0", 0.07, 0.005, 0.06, { seg: 32, m: 0.1, r: 0.7 });
    Sp(Bz, 0.012, CYAN, 0.04, 0.012, 0.035, { m: 0.2 });
    Sp(Bz, 0.012, AMBER, 0.085, 0.012, 0.038, { m: 0.2 });
    Sp(Bz, 0.012, GREEN, 0.1, 0.012, 0.075, { m: 0.2 });
    Sp(Bz, 0.012, RED, 0.05, 0.012, 0.08, { m: 0.2 });
    Sp(Bz, 0.014, "#64748b", 0.078, 0.012, 0.085, { m: 0.3 });      // jempol palet
    var Br = sub(Bz, 0.01, 0.006, 0.1, -24);
    C(Br, 0.005, 0.07, MID, 0, 0, 0, { rz: 90, seg: 8 });            // kuas
    part(Br, "primitive: cone; radiusBottom: " + n(0.005) + "; radiusTop: 0; height: " + n(0.016) +
        "; segmentsRadial: 8", CYAN, 0.043, 0, 0, { rz: -90, e: CYAN, ei: 0.5 });

    // ============================================================
    //  3. SYSTEM ARCHITECTURE (tengah-depan): tiga simpul saling terhubung
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    function node(f, lx, color, label) {
        B(f, 0.11, 0.07, 0.06, DEEP, lx, 0.035, 0, { m: 0.35, r: 0.4 });
        B(f, 0.11, 0.074, 0.064, color, lx, 0.035, 0, { wire: true, e: color, ei: 0.6 });
        Sp(f, 0.005, CYAN, lx - 0.04, 0.062, 0.031, glow(1));
        B(f, 0.07, 0.026, 0.006, NAVY, lx, 0.005, 0.034, {
            text: "value: " + label + "; align: center; anchor: center; baseline: center; " +
                "color: #e0f2fe; width: " + n(0.064) + "; wrapCount: 9; zOffset: " + n(0.0035),
        });
        B(f, 0.116, 0.006, 0.066, SLATE, lx, 0.003, 0);
    }
    node(Cz, -0.16, CYAN, "UI");
    node(Cz, 0, AMBER, "API");
    node(Cz, 0.16, GREEN, "DB");
    seg(Cz(-0.105, 0.04, 0), Cz(-0.055, 0.04, 0), CYAN, 0.004, glow(0.9));
    seg(Cz(0.055, 0.04, 0), Cz(0.105, 0.04, 0), CYAN, 0.004, glow(0.9));
    Sp(W, 0.007, "#ffffff", Cz(-0.105, 0.04, 0)[0], Cz(-0.105, 0.04, 0)[1], Cz(-0.105, 0.04, 0)[2], {
        e: "#ffffff", ei: 1,
        anim: mv(Cz(-0.105, 0.04, 0), Cz(0.105, 0.04, 0), 2400),
    });
    Sp(W, 0.007, AMBER, Cz(0.105, 0.055, 0)[0], Cz(0.105, 0.055, 0)[1], Cz(0.105, 0.055, 0)[2], {
        e: AMBER, ei: 1,
        anim: mv(Cz(0.105, 0.055, 0), Cz(-0.105, 0.055, 0), 2400, { delay: 1200 }),
    });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.02, 0.24, -0.05);    // puncak layar wireframe
    var t2 = Bz(0.04, 0.2, -0.07);    // puncak layar UI
    var t3 = Cz(0, 0.1, 0);           // simpul API
    callout("Wireframe", t1[0], 0.32, -0.22, t1);
    callout("UI/UX Design", t2[0], 0.32, -0.22, t2);
    callout("System Architecture", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
