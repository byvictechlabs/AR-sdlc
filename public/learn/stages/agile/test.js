/**
 * agile/test.js — Agile tahap 4: Test (3 zona callout).
 * Label: Unit Test, Bug Fixing, Quality Assurance.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik Agile.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["agile/test"] = function () {
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
    //  1. UNIT TEST (kiri-belakang): potongan kode + centang hijau besar
    // ============================================================
    var A = frame(-0.35, Y0, -0.16, 8);
    // kartu potongan kode (melayang sedikit, animasi bob lembut)
    var bobA = "property: position; from: " + pos(A(0, 0.075, -0.03)) + "; to: " +
        pos(A(0, 0.085, -0.03)) + "; dur: 2400; loop: true; dir: alternate; easing: easeInOutSine";
    B(A, 0.19, 0.13, 0.012, "#0f172a", 0, 0.075, -0.03, { m: 0.3, anim: bobA });
    B(A, 0.17, 0.11, 0.004, "#1e293b", 0, 0.075, -0.021, { m: 0.2, anim: bobA });
    var uW = [0.11, 0.07, 0.13, 0.09], uC = [CYAN, AMBER, PALE, SKY];
    for (i = 0; i < 4; i++) {
        B(A, uW[i], 0.01, 0.003, uC[i], -0.07 + uW[i] / 2, 0.11 - i * 0.024, -0.017, { anim: bobA });
    }
    // centang besar menempel di pojok kanan-atas kartu
    check(A, 0.11, 0.115, -0.012, 0.05, GREEN);
    Sp(A, 0.012, GREEN, 0.1, 0.1, -0.01, { e: GREEN, ei: 0.9, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 800; dir: alternate" });
    // lambang "&lt;/&gt;" sederhana di bawah kartu
    B(A, 0.06, 0.008, 0.04, SLATE, -0.1, 0.005, 0.08, { ry: -8 });
    part(A, "primitive: cone; radiusBottom: " + n(0.007) + "; radiusTop: 0; height: " + n(0.024) +
        "; segmentsRadial: 8", CYAN, -0.11, 0.02, 0.07, { rz: 45, e: CYAN, ei: 0.5 });

    // ============================================================
    //  2. BUG FIXING (kanan-belakang): kutu + alat perbaikan (obeng + tanda +)
    // ============================================================
    var Bz = frame(0.35, Y0, -0.16, -8);
    bug(Bz, -0.07, 0.038, 0.03, { s: 1.2 });
    Sp(Bz, 0.008, AMBER, -0.07, 0.13, 0.03, {
        e: AMBER, ei: 1,
        anim: "property: emissiveIntensity; from: 0.25; to: 1; loop: true; dur: 600; dir: alternate",
    });
    // obeng menyeberang di depan kutu
    var Sd = sub(Bz, 0.06, 0.03, 0.08, -35);
    B(Sd, 0.02, 0.05, 0.02, MID, 0.045, 0, 0, { rz: -12, m: 0.3 });          // gagang
    B(Sd, 0.008, 0.07, 0.008, SLATE, -0.005, 0, 0, { rz: -12, m: 0.6, r: 0.3 }); // mata
    part(Sd, "primitive: box; width: " + n(0.016) + "; height: " + n(0.012) + "; depth: " + n(0.004),
        SLATE, -0.043, 0, 0, { rz: -12, m: 0.6, r: 0.3 });
    // tanda plus melayang (simbol perbaikan)
    var plusAnim = "property: position; from: " + pos(Bz(0.1, 0.15, 0.04)) + "; to: " +
        pos(Bz(0.1, 0.17, 0.04)) + "; dur: 1600; loop: true; dir: alternate; easing: easeInOutSine";
    B(Bz, 0.06, 0.016, 0.016, GREEN, 0.1, 0.15, 0.04, { e: GREEN, ei: 0.7, anim: plusAnim });
    B(Bz, 0.016, 0.06, 0.016, GREEN, 0.1, 0.15, 0.04, { e: GREEN, ei: 0.7, anim: plusAnim });
    tag(Bz, "Fix", 0.1, 0.09, 0.04);

    // ============================================================
    //  3. QUALITY ASSURANCE (tengah-depan): penguji + layar daftar + kaca pembesar
    // ============================================================
    var Cz = frame(0, Y0, 0.24, 0);
    var Qs = screen(Cz, 0.26, 0.17, { x: 0.03, z: -0.07, bg: "#0f172a" });
    for (i = 0; i < 3; i++) {
        B(Qs, 0.14, 0.01, 0.003, SLATE, -0.03, 0.05 - i * 0.04, 0.005);
        check(Qs, 0.08, 0.05 - i * 0.04, 0.006, 0.017, i === 2 ? AMBER : GREEN);
    }
    person(Cz, -0.16, 0.07, { c: DEEP });
    // kaca pembesar melayang di atas layar
    var Mg = sub(Cz, 0.1, 0.14, -0.03, 0);
    part(Mg, "primitive: torus; radius: " + n(0.035) + "; radiusTubular: " + n(0.007) +
        "; segmentsRadial: 8; segmentsTubular: 24", "#e2e8f0", 0, 0, 0, { m: 0.5, r: 0.3 });
    C(Mg, 0.028, 0.004, ICE, 0, 0, 0, { rx: 90, seg: 24, op: 0.45, m: 0.05, r: 0.2 });
    B(Mg, 0.014, 0.055, 0.014, SLATE, 0.038, -0.038, 0, { rz: -45, m: 0.4 });
    Sp(Mg, 0.006, CYAN, -0.025, 0.025, 0.008, glow(1));

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0, 0.16, -0.03);       // kartu unit test
    var t2 = Bz(-0.07, 0.1, 0.03);    // kutu
    var t3 = Cz(0.07, 0.2, -0.05);    // puncak layar QA
    callout("Unit Test", t1[0], 0.32, -0.22, t1);
    callout("Bug Fixing", t2[0], 0.32, -0.22, t2);
    callout("Quality Assurance", 0, 0.14, 0.6, t3);

    return stageWrap(items);
};
