/**
 * waterfall/requirements-analysis.js — Waterfall tahap 1: Requirements Analysis (3 zona callout).
 * Label: Requirement Gathering, Feasibility Study, SRS Document.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Waterfall.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["waterfall/requirements-analysis"] = function () {
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
    //  1. REQUIREMENT GATHERING (kiri-belakang): wawancara + papan catatan
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Nt = board(A, 0.2, 0.15, { x: 0.0, z: -0.07, bg: WHITE, htxt: "NOTES", hc: MID });
    for (i = 0; i < 3; i++) {
        B(Nt, 0.13 - i * 0.02, 0.009, 0.004, SLATE, -0.012, 0.03 - i * 0.032, 0.005);
        check(Nt, 0.075, 0.03 - i * 0.032, 0.006, 0.014, CYAN);
    }
    person(A, -0.15, 0.05, { point: true, c: MID });
    bubble(A, -0.16, 0.17, 0.045, { w: 0.06, h: 0.04 });
    person(A, 0.15, 0.05, { s: 0.9, c: DEEP });

    // ============================================================
    //  2. FEASIBILITY STUDY (kanan-belakang): timbangan menimbang dokumen & koin
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    C(Bz, 0.05, 0.012, DEEP, 0, 0.006, 0, { seg: 24, m: 0.3 });
    C(Bz, 0.013, 0.115, SLATE, 0, 0.063, 0, { seg: 12, m: 0.5, r: 0.3 });
    // balok miring (kiri naik, kanan turun)
    B(Bz, 0.18, 0.012, 0.016, "#94a3b8", 0, 0.124, 0, { rz: -7, m: 0.5, r: 0.3 });
    Sp(Bz, 0.013, AMBER, 0, 0.136, 0, { m: 0.4 });
    // panci kiri (dokumen studi) & tali
    seg(Bz(-0.088, 0.134, 0), Bz(-0.088, 0.086, 0), SLATE, 0.003);
    C(Bz, 0.04, 0.008, ICE, -0.088, 0.08, 0, { seg: 24, m: 0.2, r: 0.6 });
    B(Bz, 0.05, 0.006, 0.04, WHITE, -0.088, 0.088, 0, { ry: -6, m: 0.05 });
    B(Bz, 0.03, 0.002, 0.004, SLATE, -0.088, 0.092, 0.012, { ry: -6 });
    B(Bz, 0.036, 0.002, 0.004, SLATE, -0.09, 0.092, 0, { ry: -6 });
    // panci kanan (tumpukan koin)
    seg(Bz(0.088, 0.116, 0), Bz(0.088, 0.07, 0), SLATE, 0.003);
    C(Bz, 0.04, 0.008, ICE, 0.088, 0.064, 0, { seg: 24, m: 0.2, r: 0.6 });
    for (i = 0; i < 4; i++) {
        C(Bz, 0.017, 0.007, AMBER, 0.088, 0.073 + i * 0.008, 0, { seg: 20, m: 0.5, r: 0.35 });
    }
    tag(Bz, "Feasibility", 0, 0.02, 0.12);

    // ============================================================
    //  3. SRS DOCUMENT (tengah-depan): dokumen tebal + timbunan lembar + centang
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    doc(Cz, -0.06, 0.105, -0.03, { w: 0.14, h: 0.18, lines: 5, sign: true, htxt: "SRS", hc: MID });
    // timbunan lembar (dokumen tebal)
    for (i = 0; i < 5; i++) {
        B(Cz, 0.14, 0.007, 0.1, WHITE, 0.1, 0.005 + i * 0.008, 0.05, { ry: 5 - i * 3, m: 0.05, r: 0.85 });
    }
    B(Cz, 0.1, 0.003, 0.06, ICE, 0.1, 0.047, 0.05, { ry: -6, m: 0.05 });
    check(Cz, 0.1, 0.075, 0.05, 0.045, GREEN);
    Sp(Cz, 0.009, GREEN, 0.17, 0.09, 0.05, { e: GREEN, ei: 0.8, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 900; dir: alternate" });
    // pensil tanda tangan
    var Pc = sub(Cz, -0.14, 0.006, 0.08, 24);
    C(Pc, 0.005, 0.07, MID, 0, 0, 0, { rz: 90, seg: 8, m: 0.3 });
    part(Pc, "primitive: cone; radiusBottom: " + n(0.005) + "; radiusTop: 0; height: " + n(0.016) +
        "; segmentsRadial: 8", "#fde68a", 0.043, 0, 0, { rz: -90 });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.0, 0.2, -0.07);        // puncak papan catatan
    var t2 = Bz(0, 0.17, 0);            // puncak timbangan
    var t3 = Cz(-0.06, 0.21, -0.03);    // puncak dokumen SRS
    callout("Requirement Gathering", t1[0], 0.32, -0.22, t1);
    callout("Feasibility Study", t2[0], 0.32, -0.22, t2);
    callout("SRS Document", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
