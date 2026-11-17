/**
 * waterfall/development.js — Waterfall tahap 3: Development (3 zona callout).
 * Label: Coding, Module Development, Integration.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Waterfall.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["waterfall/development"] = function () {
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
    //  1. CODING (kiri-belakang): terminal + programmer
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var Tm = screen(A, 0.3, 0.19, { x: 0.04, z: -0.05, bg: "#020617" });
    B(Tm, 0.26, 0.024, 0.003, "#1e293b", 0, 0.07, 0.005);
    Sp(Tm, 0.004, RED, -0.115, 0.07, 0.008);
    Sp(Tm, 0.004, AMBER, -0.1, 0.07, 0.008);
    Sp(Tm, 0.004, GREEN, -0.085, 0.07, 0.008);
    var tW = [0.14, 0.09, 0.17, 0.11, 0.15], tC = [GREEN, CYAN, PALE, AMBER, CYAN];
    for (i = 0; i < 5; i++) {
        B(Tm, tW[i], 0.009, 0.003, tC[i], -0.115 + tW[i] / 2, 0.042 - i * 0.024, 0.006);
    }
    B(Tm, 0.012, 0.009, 0.003, "#ffffff", -0.1, -0.07, 0.006, {
        e: "#ffffff", ei: 1,
        anim: "property: emissiveIntensity; from: 0.2; to: 1; loop: true; dur: 550; dir: alternate",
    });
    person(A, -0.15, 0.06, { c: MID });
    bubble(A, -0.15, 0.17, 0.05, { w: 0.055, h: 0.036, lines: false, c: ICE });

    // ============================================================
    //  2. MODULE DEVELOPMENT (kanan-belakang): modul-modul terpisah
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    var modC = [CYAN, AMBER, GREEN], modX = [-0.15, 0, 0.15];
    for (i = 0; i < 3; i++) {
        var mx = modX[i];
        // blok modul + chip + garis kode
        B(Bz, 0.1, 0.07, 0.07, DEEP, mx, 0.035, 0, { m: 0.35, r: 0.4 });
        B(Bz, 0.1, 0.074, 0.02, modC[i], mx, 0.035, -0.025, { m: 0.3 });
        B(Bz, 0.05, 0.02, 0.004, "#0f172a", mx, 0.05, 0.037, {
            text: "value: M" + (i + 1) + "; align: center; anchor: center; baseline: center; " +
                "color: #e0f2fe; width: " + n(0.044) + "; zOffset: " + n(0.003),
        });
        Sp(Bz, 0.005, modC[i], mx - 0.035, 0.018, 0.037, glow(1));
        B(Bz, 0.06, 0.006, 0.004, SKY, mx + 0.005, 0.018, 0.037);
        // garis putus-putus (modul masih terpisah)
        B(Bz, 0.02, 0.006, 0.006, SLATE, mx - 0.075, 0.004, 0.05);
        B(Bz, 0.02, 0.006, 0.006, SLATE, mx + 0.075, 0.004, 0.05);
    }
    tag(Bz, "Terpisah", 0, 0.11, 0);

    // ============================================================
    //  3. INTEGRATION (tengah-depan): dua modul disatukan + penyambung
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    B(Cz, 0.1, 0.08, 0.075, MID, -0.1, 0.04, 0, { m: 0.3, r: 0.45 });
    B(Cz, 0.1, 0.08, 0.075, AMBER, 0.1, 0.04, 0, { m: 0.3, r: 0.45 });
    B(Cz, 0.104, 0.084, 0.016, DEEP, -0.1, 0.04, 0, { m: 0.35 });
    B(Cz, 0.104, 0.084, 0.016, "#b45309", 0.1, 0.04, 0, { m: 0.35 });
    // penyambung di tengah (kabel data)
    C(Cz, 0.022, 0.11, CYAN, 0, 0.04, 0, { rz: 90, seg: 16, m: 0.3, e: CYAN, ei: 0.5 });
    C(Cz, 0.028, 0.014, DEEP, -0.056, 0.04, 0, { rz: 90, seg: 16, m: 0.4 });
    C(Cz, 0.028, 0.014, "#b45309", 0.056, 0.04, 0, { rz: 90, seg: 16, m: 0.4 });
    // kilat sambungan + panah dua arah
    Sp(Cz, 0.013, "#ffffff", 0, 0.04, 0.03, {
        e: "#ffffff", ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 800; dir: alternate",
    });
    arrow(Cz(-0.17, 0.1, 0.05), Cz(-0.1, 0.09, 0.04), CYAN, 0.004, { e: CYAN, ei: 0.8 });
    arrow(Cz(0.17, 0.1, 0.05), Cz(0.1, 0.09, 0.04), AMBER, 0.004, { e: AMBER, ei: 0.8 });
    check(Cz, 0, 0.14, 0.03, 0.04, GREEN);
    Sp(Cz, 0.01, GREEN, 0.06, 0.15, 0.03, { e: GREEN, ei: 0.7, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 1000; dir: alternate" });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.04, 0.23, -0.05);    // puncak terminal
    var t2 = Bz(0, 0.13, 0);          // puncak modul tengah
    var t3 = Cz(0, 0.19, 0);          // puncak sambungan
    callout("Coding", t1[0], 0.32, -0.22, t1);
    callout("Module Development", t2[0], 0.32, -0.22, t2);
    callout("Integration", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
