/**
 * agile/deploy.js — Agile tahap 5: Deploy (3 zona callout).
 * Label: Staging Environment, Release Build, Cloud Server.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/deploy"] = function () {
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
    //  1. STAGING ENVIRONMENT (kiri-belakang): server uji berlabel "Staging"
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    var St = server(A, -0.02, -0.02, { n: 3 });
    tag(A, "Staging", -0.02, 0.135, -0.02);
    // kabel jaringan ke tepi zona
    seg(A(-0.065, 0.05, -0.02), A(-0.2, 0.012, 0.1), SKY, 0.004);
    seg(A(-0.065, 0.017, -0.02), A(-0.18, 0.012, 0.14), CYAN, 0.004, glow(0.7));
    // badge "siap uji"
    C(A, 0.03, 0.008, GREEN, 0.14, 0.03, 0.08, { seg: 16, e: GREEN, ei: 0.35, m: 0.3 });
    check(A, 0.14, 0.035, 0.085, 0.03, WHITE);
    // animasi LED berdenyut (satu LED tambahan)
    Sp(A, 0.006, AMBER, 0.045, 0.07, 0.011, {
        e: AMBER, ei: 1,
        anim: "property: emissiveIntensity; from: 0.2; to: 1; loop: true; dur: 700; dir: alternate",
    });

    // ============================================================
    //  2. RELEASE BUILD (kanan-belakang): paket rilis → panah naik → awan
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    // kotak paket
    B(Bz, 0.11, 0.1, 0.1, "#f59e0b", 0, 0.05, 0.03, { m: 0.2, r: 0.5 });
    B(Bz, 0.114, 0.104, 0.02, "#fde68a", 0, 0.05, 0.03, { m: 0.15 });
    B(Bz, 0.02, 0.104, 0.104, "#fde68a", 0, 0.05, 0.03, { m: 0.15 });
    B(Bz, 0.07, 0.03, 0.004, WHITE, 0, 0.05, 0.081, {
        text: "value: v1.0; align: center; anchor: center; baseline: center; " +
            "color: #78350f; width: " + n(0.062) + "; zOffset: " + n(0.003),
    });
    tag(Bz, "Build", -0.13, 0.06, 0.1);
    // awan rilis + panah naik
    cloud(Bz, 0.02, 0.235, -0.05, 1);
    arrow(Bz(0.02, 0.13, 0.02), Bz(0.02, 0.185, -0.03), CYAN, 0.006, { e: CYAN, ei: 0.9 });
    Sp(W, 0.007, "#ffffff", Bz(0.02, 0.13, 0.02)[0], Bz(0.02, 0.13, 0.02)[1], Bz(0.02, 0.13, 0.02)[2], {
        e: "#ffffff", ei: 1,
        anim: mv(Bz(0.02, 0.13, 0.02), Bz(0.02, 0.19, -0.03), 1400),
    });

    // ============================================================
    //  3. CLOUD SERVER (tengah-depan): awan + panah naik + server di bawah
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Cs = server(Cz, 0, -0.05, { n: 2, w: 0.1 });
    cloud(Cz, 0, 0.22, -0.05, 1.15);
    // pancaran sinyal dari awan
    part(Cz, "primitive: torus; radius: " + n(0.05) + "; radiusTubular: " + n(0.004) +
        "; segmentsRadial: 6; segmentsTubular: 24", CYAN, 0, 0.16, -0.05, {
        rx: 70, e: CYAN, ei: 0.7, op: 0.7,
    });
    arrow(Cz(0, 0.09, -0.05), Cz(0, 0.15, -0.05), CYAN, 0.006, { e: CYAN, ei: 0.9 });
    for (i = 0; i < 2; i++) {
        Sp(W, 0.007, CYAN, Cz(-0.03 + i * 0.06, 0.09, -0.05)[0], Cz(-0.03 + i * 0.06, 0.09, -0.05)[1],
            Cz(-0.03 + i * 0.06, 0.09, -0.05)[2], {
            e: CYAN, ei: 1,
            anim: mv(Cz(-0.03 + i * 0.06, 0.09, -0.05), Cz(-0.03 + i * 0.06, 0.15, -0.05), 1300, { delay: i * 650 }),
        });
    }
    // lampu status server
    Sp(Cz, 0.006, GREEN, -0.035, 0.068, -0.019, {
        e: GREEN, ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 900; dir: alternate",
    });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = St(0, 0.03, 0);          // puncak server staging
    var t2 = Bz(0.02, 0.12, -0.05);   // awan rilis
    var t3 = Cz(0, 0.27, -0.05);      // puncak awan cloud
    callout("Staging Environment", t1[0], 0.32, -0.22, t1);
    callout("Release Build", t2[0], 0.32, -0.22, t2);
    callout("Cloud Server", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
