/**
 * waterfall/maintenance.js — Waterfall tahap 5: Maintenance (3 zona callout).
 * Label: Bug Fixing, Updates, User Support.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Waterfall.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["waterfall/maintenance"] = function () {
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
    //  1. BUG FIXING (kiri-belakang): kunci inggris + obeng disilang + gerigi
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    // kunci inggris (miring ke kanan-atas)
    var Wr = sub(A, -0.02, 0.045, 0.02, 0);
    B(Wr, 0.16, 0.018, 0.024, "#94a3b8", 0, 0, 0, { rz: 30, m: 0.6, r: 0.3 });
    part(Wr, "primitive: torus; radius: " + n(0.026) + "; radiusTubular: " + n(0.01) +
        "; segmentsRadial: 8; segmentsTubular: 20", "#cbd5e1", -0.075, -0.043, 0,
    { rz: 30, m: 0.6, r: 0.3 });
    part(Wr, "primitive: torus; radius: " + n(0.024) + "; radiusTubular: " + n(0.009) +
        "; segmentsRadial: 8; segmentsTubular: 16; arc: 260", "#cbd5e1", 0.072, 0.042, 0,
    { rz: 30, m: 0.6, r: 0.3 });
    // obeng (menyeberang ke kiri-atas)
    var Sd = sub(A, 0.0, 0.045, 0.04, 0);
    B(Sd, 0.05, 0.026, 0.026, RED, 0.03, -0.018, 0, { rz: -35, m: 0.3, r: 0.5 });
    B(Sd, 0.009, 0.1, 0.009, "#cbd5e1", -0.03, 0.03, 0, { rz: -35, m: 0.7, r: 0.25 });
    part(Sd, "primitive: box; width: " + n(0.018) + "; height: " + n(0.02) + "; depth: " + n(0.006),
        "#e2e8f0", -0.075, 0.066, 0, { rz: -35, m: 0.7, r: 0.25 });
    // gerigi (cincin datar) + percikan
    part(A, "primitive: torus; radius: " + n(0.035) + "; radiusTubular: " + n(0.011) +
        "; segmentsRadial: 8; segmentsTubular: 20", CYAN, -0.16, 0.016, -0.06,
    { rx: 90, e: CYAN, ei: 0.5, m: 0.3 });
    Sp(A, 0.018, "#e2e8f0", 0.16, 0.03, 0.05, {
        e: "#ffffff", ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 700; dir: alternate",
    });
    Sp(A, 0.01, AMBER, 0.12, 0.07, 0.04, { e: AMBER, ei: 0.8 });
    tag(A, "Fix", 0, 0.115, 0.06);

    // ============================================================
    //  2. UPDATES (kanan-belakang): kartu versi lama → panah naik → versi baru
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    // versi lama (kartu datar)
    B(Bz, 0.14, 0.01, 0.1, SLATE, 0, 0.005, 0.07, { ry: -4, m: 0.2 });
    B(Bz, 0.1, 0.004, 0.05, "#cbd5e1", 0, 0.011, 0.07, {
        ry: -4,
        text: "value: v1.0; align: center; anchor: center; baseline: center; " +
            "color: #475569; width: " + n(0.09) + "; zOffset: " + n(0.003),
    });
    // panah naik besar
    C(Bz, 0.014, 0.1, CYAN, 0, 0.075, 0, { seg: 14, e: CYAN, ei: 0.5, m: 0.3 });
    part(Bz, "primitive: cone; radiusBottom: " + n(0.04) + "; radiusTop: 0; height: " + n(0.055) +
        "; segmentsRadial: 16", CYAN, 0, 0.155, 0, { e: CYAN, ei: 0.8, m: 0.3 });
    // versi baru (kartu melayang — tiap lapis pakai from/to sendiri biar tidak lompat)
    var upAnim = function (x, y, z) {
        return "property: position; from: " + pos(Bz(x, y, z)) + "; to: " + pos(Bz(x, y + 0.015, z)) +
            "; dur: 2200; loop: true; dir: alternate; easing: easeInOutSine";
    };
    B(Bz, 0.15, 0.09, 0.014, MID, 0, 0.23, 0, { m: 0.3, anim: upAnim(0, 0.23, 0) });
    B(Bz, 0.13, 0.07, 0.004, ICE, 0, 0.23, 0.009, { m: 0.05, anim: upAnim(0, 0.23, 0.009) });
    B(Bz, 0.13, 0.07, 0.004, MID, 0, 0.23, 0.01, {
        text: "value: v2.0; align: center; anchor: center; baseline: center; " +
            "color: #ffffff; width: " + n(0.12) + "; zOffset: " + n(0.004),
        anim: upAnim(0, 0.23, 0.01),
    });
    Sp(Bz, 0.01, GREEN, 0.08, 0.26, 0.02, {
        e: GREEN, ei: 1, anim: upAnim(0.08, 0.26, 0.02),
    });
    tag(Bz, "Update", 0, 0.31, 0);

    // ============================================================
    //  3. USER SUPPORT (tengah-depan): petugas headset melayani pengguna
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    // meja + laptop
    B(Cz, 0.16, 0.012, 0.1, DEEP, 0.02, 0.06, 0.06, { m: 0.3 });
    B(Cz, 0.014, 0.06, 0.014, SLATE, 0.02, 0.03, 0.06, { m: 0.4 });
    B(Cz, 0.11, 0.008, 0.07, "#cbd5e1", 0.02, 0.07, 0.06, { m: 0.3 });
    B(Cz, 0.11, 0.075, 0.008, NAVY, 0.02, 0.107, 0.028, { rx: -18, m: 0.4 });
    B(Cz, 0.1, 0.062, 0.003, ICE, 0.02, 0.107, 0.033, { rx: -18, m: 0.05 });
    B(Cz, 0.07, 0.012, 0.003, CYAN, 0.02, 0.11, 0.036, { rx: -18, e: CYAN, ei: 0.4 });
    // petugas + headset (koordinat lokal frame zona — kepala di y0.092)
    person(Cz, -0.1, 0.0, { c: MID });
    part(Cz, "primitive: torus; radius: " + n(0.027) + "; radiusTubular: " + n(0.005) +
        "; segmentsRadial: 6; segmentsTubular: 20; arc: 180", DEEP,
    -0.1, 0.092, 0.0, { rz: -8, m: 0.4, r: 0.4 });
    B(Cz, 0.012, 0.026, 0.016, DEEP, -0.127, 0.092, 0.0, { m: 0.4 });   // earcup kiri
    B(Cz, 0.012, 0.026, 0.016, DEEP, -0.073, 0.092, 0.0, { m: 0.4 });   // earcup kanan
    seg(Cz(-0.124, 0.085, 0.008), Cz(-0.108, 0.058, 0.026), SLATE, 0.003);
    Sp(Cz, 0.006, CYAN, -0.108, 0.054, 0.028, glow(1));                  // mikrofon
    // gelembung layanan
    bubble(Cz, -0.1, 0.19, -0.05, { w: 0.075, h: 0.046 });
    // tombol status "siap membantu"
    Sp(Cz, 0.009, GREEN, -0.17, 0.06, 0.05, {
        e: GREEN, ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 900; dir: alternate",
    });
    tag(Cz, "Online", -0.17, 0.015, 0.05);

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0, 0.16, 0.04);        // perkakas bug fixing
    var t2 = Bz(0, 0.3, 0);           // kartu versi baru
    var t3 = Cz(-0.1, 0.15, 0);       // kepala petugas
    callout("Bug Fixing", t1[0], 0.32, -0.22, t1);
    callout("Updates", t2[0], 0.32, -0.22, t2);
    callout("User Support", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
