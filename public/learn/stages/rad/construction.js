/**
 * rad/construction.js — RAD tahap 3: Construction (4 zona callout).
 * Label: Coding, Integration, Testing, User Feedback.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik RAD
 * (Construction boleh kembali ke User Design bila ada perubahan besar — lihat popup).
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 */
STAGE_BUILDERS["rad/construction"] = function () {
    var K = stageKit(), items = K.items, W = K.W;
    var NAVY = K.NAVY, DEEP = K.DEEP, BLUE = K.BLUE, MID = K.MID, SKY = K.SKY,
        PALE = K.PALE, ICE = K.ICE, WHITE = K.WHITE, SLATE = K.SLATE, CYAN = K.CYAN,
        AMBER = K.AMBER, GREEN = K.GREEN, RED = K.RED;
    var n = K.n, pos = K.pos, frame = K.frame, sub = K.sub, part = K.part,
        B = K.B, C = K.C, Sp = K.Sp, seg = K.seg, mv = K.mv, glow = K.glow,
        callout = K.callout, tag = K.tag, check = K.check, person = K.person,
        screen = K.screen, board = K.board, bubble = K.bubble, bug = K.bug, arrow = K.arrow;
    var Y0 = -0.36, i;

    K.platform();
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", -0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", 0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", -0.36, -0.364, 0.23, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", 0.36, -0.364, 0.23, { m: 0.1 });

    // ============================================================
    //  1. CODING (kiri-belakang): monitor baris kode + programmer
    // ============================================================
    var A = frame(-0.36, Y0, -0.19, 8);
    var Sc = screen(A, 0.3, 0.2, { x: 0.03, z: -0.04, bg: "#0f172a" });
    // baris kode berwarna + kursor berkedip
    var codeW = [0.16, 0.1, 0.2, 0.13, 0.18, 0.09];
    var codeC = [CYAN, AMBER, PALE, WHITE, SKY, CYAN];
    for (i = 0; i < 6; i++) {
        B(Sc, codeW[i], 0.01, 0.003, codeC[i], -0.13 + codeW[i] / 2, 0.062 - i * 0.021, 0.004);
    }
    B(Sc, 0.012, 0.01, 0.003, AMBER, -0.11, -0.055, 0.004, {
        e: AMBER, ei: 1,
        anim: "property: emissiveIntensity; from: 1; to: 0.2; loop: true; dur: 600; dir: alternate",
    });
    person(A, -0.15, 0.07, { c: DEEP });
    // keyboard + meja keyboard
    B(A, 0.13, 0.008, 0.05, "#cbd5e1", -0.13, 0.004, 0.09, { ry: -4 });
    for (i = 0; i < 3; i++) { B(A, 0.11, 0.004, 0.008, SLATE, -0.13, 0.009, 0.076 + i * 0.013, { ry: -4 }); }

    // ============================================================
    //  2. INTEGRATION (kanan-belakang): dua modul puzzle menyatu
    // ============================================================
    var Bz = frame(0.36, Y0, -0.19, -8);
    // modul kiri (statis, bertelinga/pin)
    B(Bz, 0.1, 0.08, 0.07, CYAN, -0.1, 0.04, 0, { m: 0.25, r: 0.45 });
    C(Bz, 0.016, 0.03, CYAN, -0.035, 0.04, 0, { rz: 90, seg: 14, m: 0.25, e: CYAN, ei: 0.4 });
    tag(Bz, "Modul A", -0.1, 0.092, 0);
    // modul kanan (animasi merapat ke kiri)
    var mergeAnim = "property: position; from: " + pos(Bz(0.14, 0.04, 0)) + "; to: " +
        pos(Bz(0.085, 0.04, 0)) + "; dur: 2200; loop: true; easing: easeInOutSine; dir: alternate";
    B(Bz, 0.1, 0.08, 0.07, AMBER, 0.14, 0.04, 0, { m: 0.25, r: 0.45, anim: mergeAnim });
    B(Bz, 0.05, 0.05, 0.074, "#b45309", 0.09, 0.04, 0, { m: 0.25, r: 0.5, anim: mergeAnim });  // soket
    C(Bz, 0.017, 0.006, "#b45309", 0.038, 0.04, 0, { rx: 90, seg: 14, anim: mergeAnim });      // lubang pin
    tag(Bz, "Modul B", 0.14, 0.092, 0);
    // kilat saat menyentuh + dua panah merapat
    Sp(Bz, 0.012, "#ffffff", -0.008, 0.04, 0, {
        e: "#ffffff", ei: 1,
        anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 900; dir: alternate",
    });
    arrow(Bz(-0.19, 0.02, 0.085), Bz(-0.11, 0.02, 0.085), CYAN, 0.004, { e: CYAN, ei: 0.8 });
    arrow(Bz(0.19, 0.02, 0.085), Bz(0.11, 0.02, 0.085), AMBER, 0.004, { e: AMBER, ei: 0.8 });

    // ============================================================
    //  3. TESTING (kiri-depan): daftar centang + ikon kutu
    // ============================================================
    var Cz = frame(-0.36, Y0, 0.23, -8);
    var L = board(Cz, 0.2, 0.17, { x: -0.05, z: -0.02, bg: ICE });
    B(Cz, 0.05, 0.014, 0.02, SLATE, -0.05, 0.235, -0.02);   // klip
    for (i = 0; i < 3; i++) {
        B(L, 0.11, 0.008, 0.004, SLATE, -0.015, 0.05 - i * 0.035, 0.005);
        check(L, 0.065, 0.05 - i * 0.035, 0.006, 0.015, i === 1 ? GREEN : CYAN);
    }
    bug(Cz, 0.1, 0.04, 0.07, { s: 1.1 });
    Sp(Cz, 0.007, AMBER, 0.1, 0.09, 0.07, { e: AMBER, ei: 0.9, anim: "property: emissiveIntensity; from: 0.3; to: 1; loop: true; dur: 700; dir: alternate" });

    // ============================================================
    //  4. USER FEEDBACK (kanan-depan): orang mencoba aplikasi + bubble + jempol
    // ============================================================
    var Dz = frame(0.36, Y0, 0.23, 8);
    person(Dz, -0.09, 0.05, { c: MID });
    bubble(Dz, -0.09, 0.175, 0.04, { w: 0.075, h: 0.046 });
    // aplikasi di layar kecil
    var Ph = screen(Dz, 0.09, 0.1, { x: 0.07, z: -0.03, bg: ICE });
    B(Ph, 0.07, 0.016, 0.003, BLUE, 0, 0.03, 0.004);
    B(Ph, 0.07, 0.03, 0.003, CYAN, 0, 0.002, 0.004, { e: CYAN, ei: 0.35 });
    B(Ph, 0.03, 0.018, 0.003, PALE, -0.019, -0.032, 0.004);
    B(Ph, 0.03, 0.018, 0.003, PALE, 0.019, -0.032, 0.004);
    // jempol (apresiasi)
    B(Dz, 0.04, 0.046, 0.018, "#fde68a", 0.14, 0.18, 0.04, { rz: -8, m: 0.4 });
    B(Dz, 0.016, 0.042, 0.016, "#fcd34d", 0.126, 0.215, 0.04, { rz: -20, m: 0.4 });
    B(Dz, 0.008, 0.05, 0.02, CYAN, 0.14, 0.18, 0.04, { rz: -8, op: 0.35, e: CYAN, ei: 0.6 });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.03, 0.23, -0.04);   // puncak monitor kode
    var t2 = Bz(-0.1, 0.085, 0);     // modul A
    var t3 = Cz(-0.05, 0.2, -0.02);  // daftar centang
    var t4 = Dz(0.07, 0.16, -0.03);  // layar aplikasi
    callout("Coding", t1[0], 0.32, -0.22, t1);
    callout("Integration", t2[0], 0.32, -0.22, t2);
    callout("Testing", -0.66, 0.12, 0.3, t3);
    callout("User Feedback", 0.66, 0.12, 0.3, t4);

    return stageWrap(items);
};
