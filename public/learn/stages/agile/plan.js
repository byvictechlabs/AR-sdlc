/**
 * agile/plan.js — Agile tahap 1: Plan (3 zona callout).
 * Label: Product Backlog, Prioritization, Stakeholder Meeting.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/plan"] = function () {
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
    // alas zona (3 zona: kiri-belakang, kanan-belakang, tengah-depan)
    B(W, 0.46, 0.008, 0.3, "#2a5bd7", -0.35, -0.364, -0.16, { m: 0.1 });
    B(W, 0.46, 0.008, 0.3, "#2a5bd7", 0.35, -0.364, -0.16, { m: 0.1 });
    B(W, 0.52, 0.008, 0.3, "#2a5bd7", 0, -0.364, 0.24, { m: 0.1 });

    // ============================================================
    //  1. PRODUCT BACKLOG (kiri-belakang): papan kartu + tumpukan kartu
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var P = board(A, 0.28, 0.17, { x: 0.02, z: -0.06, bg: WHITE, htxt: "BACKLOG", hc: MID });
    var cardC = [CYAN, AMBER, GREEN, SKY];
    for (i = 0; i < 4; i++) {
        var cx = -0.085 + (i % 2) * 0.09, cy = 0.008 - Math.floor(i / 2) * 0.062;
        B(P, 0.07, 0.052, 0.006, cardC[i], cx, cy, 0.004, { m: 0.2, r: 0.5 });
        B(P, 0.05, 0.007, 0.003, WHITE, cx, cy + 0.014, 0.008);
        B(P, 0.036, 0.007, 0.003, WHITE, cx - 0.007, cy + 0.001, 0.008);
        B(P, 0.02, 0.007, 0.003, WHITE, cx - 0.014, cy - 0.014, 0.008);
    }
    // tumpukan kartu di lantai
    for (i = 0; i < 3; i++) {
        B(A, 0.09, 0.006, 0.065, WHITE, -0.14, 0.004 + i * 0.007, 0.07, { ry: 6 - i * 6 });
    }
    B(A, 0.05, 0.004, 0.02, CYAN, -0.14, 0.027, 0.07, { ry: -6, e: CYAN, ei: 0.4 });

    // ============================================================
    //  2. PRIORITIZATION (kanan-belakang): kartu bernomor 1-2-3 + panah urut
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    var num = ["1", "2", "3"], numC = [RED, AMBER, GREEN];
    for (i = 0; i < 3; i++) {
        var px = -0.12 + i * 0.12, pz = -0.07 + i * 0.055;
        B(Bz, 0.07, 0.09, 0.008, numC[i], px, 0.05, pz, { m: 0.25, r: 0.45 });
        B(Bz, 0.056, 0.07, 0.004, WHITE, px, 0.05, pz + 0.006, { m: 0.05, r: 0.85 });
        B(Bz, 0.056, 0.07, 0.004, numC[i], px, 0.05, pz + 0.007, {
            text: "value: " + num[i] + "; align: center; anchor: center; baseline: center; " +
                "color: #ffffff; width: " + n(0.05) + "; zOffset: " + n(0.004),
        });
        B(Bz, 0.05, 0.006, 0.05, SLATE, px, 0.003, pz);
    }
    arrow(Bz(-0.17, 0.01, 0.12), Bz(0.17, 0.01, 0.12), CYAN, 0.005, { e: CYAN, ei: 0.8 });
    tag(Bz, "Prioritas", 0, 0.03, 0.155);

    // ============================================================
    //  3. STAKEHOLDER MEETING (tengah-depan): meja bundar + 3 peserta + bubble
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    C(Cz, 0.02, 0.06, SLATE, 0, 0.03, 0, { seg: 12 });
    C(Cz, 0.095, 0.014, DEEP, 0, 0.068, 0, { seg: 32, m: 0.3, r: 0.5 });
    C(Cz, 0.085, 0.004, MID, 0, 0.077, 0, { seg: 32 });
    // berkas di atas meja
    B(Cz, 0.07, 0.004, 0.05, WHITE, -0.02, 0.081, 0.01, { ry: -8, m: 0.05 });
    B(Cz, 0.05, 0.003, 0.036, ICE, 0.03, 0.084, -0.02, { ry: 12, m: 0.05 });
    // peserta (3 orang mengelilingi meja)
    person(Cz, -0.13, -0.06, { s: 0.9, c: MID });
    person(Cz, 0.13, -0.06, { s: 0.9, c: DEEP });
    person(Cz, 0.01, 0.13, { s: 0.9, c: SKY });
    // gelembung diskusi
    bubble(Cz, -0.02, 0.21, -0.03, { w: 0.1, h: 0.058 });
    Sp(Cz, 0.007, CYAN, 0.1, 0.17, -0.05, { e: CYAN, ei: 0.8, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 900; dir: alternate" });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.02, 0.2, -0.06);        // puncak papan backlog
    var t2 = Bz(0, 0.1, 0.02);           // kartu prioritas
    var t3 = Cz(0, 0.25, -0.03);         // gelembung diskusi
    callout("Product Backlog", t1[0], 0.32, -0.22, t1);
    callout("Prioritization", t2[0], 0.32, -0.22, t2);
    callout("Stakeholder Meeting", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
