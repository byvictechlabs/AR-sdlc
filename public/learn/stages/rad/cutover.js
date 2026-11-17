/**
 * rad/cutover.js — RAD tahap 4: Cutover (4 zona callout).
 * Label: Data Conversion, Final Testing, User Training, Go Live.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik RAD
 * (mesh RAD_IMPLEMENTATION → slug "cutover", bukan "coding").
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["rad/cutover"] = function () {
    var K = stageKit(), items = K.items, W = K.W;
    var NAVY = K.NAVY, DEEP = K.DEEP, BLUE = K.BLUE, MID = K.MID, SKY = K.SKY,
        PALE = K.PALE, ICE = K.ICE, WHITE = K.WHITE, SLATE = K.SLATE, CYAN = K.CYAN,
        AMBER = K.AMBER, GREEN = K.GREEN, RED = K.RED;
    var n = K.n, pos = K.pos, frame = K.frame, sub = K.sub, part = K.part,
        B = K.B, C = K.C, Sp = K.Sp, seg = K.seg, mv = K.mv, glow = K.glow,
        callout = K.callout, tag = K.tag, check = K.check, person = K.person,
        screen = K.screen, board = K.board, bubble = K.bubble, server = K.server,
        rocket = K.rocket, arrow = K.arrow;
    var Y0 = -0.36, i;

    K.platform();
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", -0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", 0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", -0.36, -0.364, 0.23, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", 0.36, -0.364, 0.23, { m: 0.1 });

    // ============================================================
    //  1. DATA CONVERSION (kiri-belakang): lemari arsip → panah → server
    // ============================================================
    var A = frame(-0.36, Y0, -0.19, 8);
    // lemari arsip (3 laci)
    B(A, 0.1, 0.17, 0.075, DEEP, -0.12, 0.085, -0.02, { m: 0.3 });
    B(A, 0.104, 0.006, 0.079, SKY, -0.12, 0.173, -0.02);
    for (i = 0; i < 3; i++) {
        B(A, 0.09, 0.045, 0.004, MID, -0.12, 0.032 + i * 0.055, 0.0195, { m: 0.2 });
        B(A, 0.03, 0.006, 0.007, SLATE, -0.12, 0.032 + i * 0.055, 0.023);
    }
    tag(A, "Arsip", -0.12, 0.2, -0.02);
    var Srv = server(A, 0.1, -0.02, { n: 3 });
    // panah konversi + paket data melayang
    var pa = A(-0.12, 0.205, -0.02), pb = A(0.1, 0.14, -0.02);
    arrow(pa, pb, CYAN, 0.004, { e: CYAN, ei: 0.9 });
    Sp(W, 0.008, "#ffffff", pa[0], pa[1], pa[2], {
        e: "#ffffff", ei: 1,
        anim: mv(pa, pb, 1600),
    });

    // ============================================================
    //  2. FINAL TESTING (kanan-belakang): orang mengecek layar daftar centang
    // ============================================================
    var Bz = frame(0.36, Y0, -0.19, -8);
    var Sc = screen(Bz, 0.24, 0.18, { x: 0.03, z: -0.05, bg: "#0f172a" });
    for (i = 0; i < 3; i++) {
        B(Sc, 0.14, 0.01, 0.003, SLATE, -0.025, 0.05 - i * 0.04, 0.004);
        check(Sc, 0.08, 0.05 - i * 0.04, 0.005, 0.017, GREEN);
    }
    B(Sc, 0.07, 0.012, 0.003, CYAN, -0.04, -0.075, 0.004, glow(0.5));
    person(Bz, -0.17, 0.07, { point: true, c: DEEP });

    // ============================================================
    //  3. USER TRAINING (kiri-depan): pelatih + papan + beberapa pendengar
    // ============================================================
    var Cz = frame(-0.36, Y0, 0.23, -8);
    var Bd = board(Cz, 0.24, 0.15, { x: -0.05, z: -0.06, bg: WHITE, htxt: "TRAINING", hc: MID });
    // isi papan: garis materi + centang (Bd = frame isi papan)
    B(Bd, 0.14, 0.008, 0.004, SLATE, -0.02, 0.03, 0.005);
    B(Bd, 0.1, 0.008, 0.004, SLATE, -0.04, 0.008, 0.005);
    check(Bd, 0.07, 0.03, 0.006, 0.015, CYAN);
    // pelatih (menunjuk papan)
    person(Cz, 0.1, 0.0, { point: true, c: MID });
    bubble(Cz, 0.13, 0.16, 0.0, { w: 0.06, h: 0.04 });
    // pendengar (2 orang kecil, di depan)
    person(Cz, -0.09, 0.11, { s: 0.75, c: DEEP });
    person(Cz, 0.04, 0.13, { s: 0.75, c: SKY });

    // ============================================================
    //  4. GO LIVE (kanan-depan): roket meluncur dari landasan
    // ============================================================
    var Dz = frame(0.36, Y0, 0.23, 8);
    // landasan roket
    C(Dz, 0.075, 0.02, "#334155", 0, 0.01, 0, { seg: 24, m: 0.3 });
    C(Dz, 0.06, 0.006, SLATE, 0, 0.023, 0, { seg: 24 });
    // menara peluncur
    B(Dz, 0.012, 0.2, 0.012, AMBER, -0.1, 0.1, 0, { m: 0.4 });
    for (i = 0; i < 3; i++) { B(Dz, 0.05, 0.008, 0.01, AMBER, -0.078, 0.05 + i * 0.06, 0, { m: 0.4 }); }
    Sp(Dz, 0.008, RED, -0.1, 0.207, 0, {
        e: RED, ei: 1,
        anim: "property: emissiveIntensity; from: 0.2; to: 1; loop: true; dur: 500; dir: alternate",
    });
    var apex = rocket(Dz, 0.01, 0.045, 0, { c: WHITE, s: RED });
    // garis kecepatan naik + asap di landasan
    B(Dz, 0.006, 0.09, 0.006, WHITE, -0.05, 0.1, 0.05, {
        e: "#ffffff", ei: 0.7, op: 0.6,
        anim: "property: position; from: " + pos(Dz(-0.05, 0.06, 0.05)) + "; to: " +
            pos(Dz(-0.05, 0.3, 0.05)) + "; dur: 900; loop: true",
    });
    B(Dz, 0.006, 0.07, 0.006, WHITE, 0.07, 0.1, 0.05, {
        e: "#ffffff", ei: 0.7, op: 0.6,
        anim: "property: position; from: " + pos(Dz(0.07, 0.05, 0.05)) + "; to: " +
            pos(Dz(0.07, 0.28, 0.05)) + "; dur: 1100; loop: true; delay: 300",
    });
    for (i = 0; i < 3; i++) {
        Sp(Dz, 0.03 - i * 0.006, "#e2e8f0", -0.03 + i * 0.04, 0.035, 0.055 + (i % 2) * 0.02, {
            op: 0.55, m: 0.1, r: 0.9,
            anim: "property: scale; from: 0.7 0.7 0.7; to: 1.25 1.25 1.25; loop: true; dur: " +
                (1400 + i * 300) + "; dir: alternate; easing: easeInOutSine",
        });
    }
    // garis jalur data tetap hijau di layar? (tidak perlu) → jaga zona tetap bersih

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = Srv(0, 0.03, 0);        // puncak server
    var t2 = Bz(0.03, 0.2, -0.05);   // puncak layar
    var t3 = Cz(-0.05, 0.19, -0.06);// puncak papan training
    var t4 = apex(0, 0.02, 0);       // puncak roket
    callout("Data Conversion", t1[0] - 0.1, 0.32, -0.22, t1);
    callout("Final Testing", t2[0] + 0.05, 0.32, -0.22, t2);
    callout("User Training", -0.66, 0.12, 0.3, t3);
    callout("Go Live", 0.66, 0.12, 0.3, t4);

    return stageWrap(items);
};
