/**
 * rad/requirements-planning.js — RAD tahap 1: Requirements Planning (4 zona callout).
 * Label: Problem Identification, Project Scope, User Requirements, Approval.
 * DISESUAIKAN docs/Rancangan_Isi_Model_3D_Tahapan_SDLC — isi spesifik RAD.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageKit() → { W, B, C, Sp, part, callout, person, ... }, stageWrap().
 */
STAGE_BUILDERS["rad/requirements-planning"] = function () {
    var K = stageKit(), items = K.items, W = K.W;
    var NAVY = K.NAVY, DEEP = K.DEEP, BLUE = K.BLUE, MID = K.MID, SKY = K.SKY,
        PALE = K.PALE, ICE = K.ICE, WHITE = K.WHITE, SLATE = K.SLATE, CYAN = K.CYAN,
        AMBER = K.AMBER, GREEN = K.GREEN;
    var n = K.n, pos = K.pos, frame = K.frame, sub = K.sub, part = K.part,
        B = K.B, C = K.C, Sp = K.Sp, glow = K.glow, callout = K.callout, tag = K.tag,
        check = K.check, person = K.person, board = K.board, doc = K.doc, bubble = K.bubble;
    var Y0 = -0.36, i;

    K.platform();   // alas navy + strip cyan (sama di semua tahap)
    // alas zona (2×2 kuadran)
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", -0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.3, "#2a5bd7", 0.36, -0.364, -0.19, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", -0.36, -0.364, 0.23, { m: 0.1 });
    B(W, 0.44, 0.008, 0.28, "#2a5bd7", 0.36, -0.364, 0.23, { m: 0.1 });

    // ============================================================
    //  1. PROBLEM IDENTIFICATION (kiri-belakang): orang menunjuk papan "?"
    // ============================================================
    var A = frame(-0.36, Y0, -0.19, 8);
    person(A, -0.15, 0.07, { point: true, c: MID });
    var P = board(A, 0.26, 0.17, { x: 0.05, z: -0.01, bg: WHITE });
    B(P, 0.09, 0.09, 0.004, WHITE, 0.01, 0.012, 0.005, {
        text: "value: ?; align: center; anchor: center; baseline: center; " +
            "color: #f59e0b; width: " + n(0.07) + "; zOffset: " + n(0.004),
    });
    B(P, 0.15, 0.007, 0.004, SLATE, -0.02, -0.04, 0.005);
    B(P, 0.1, 0.007, 0.004, SLATE, -0.045, -0.058, 0.005);
    Sp(P, 0.006, AMBER, 0.07, -0.05, 0.006, { e: AMBER, ei: 0.7 });

    // ============================================================
    //  2. PROJECT SCOPE (kanan-belakang): dokumen + garis batas putus-putus
    // ============================================================
    var Bz = frame(0.36, Y0, -0.19, -8);
    // dokumen datar
    B(Bz, 0.17, 0.005, 0.22, WHITE, 0, 0.003, 0, { m: 0.05, r: 0.85 });
    B(Bz, 0.14, 0.003, 0.03, MID, 0, 0.007, -0.085);
    for (i = 0; i < 4; i++) {
        B(Bz, i % 2 ? 0.1 : 0.14, 0.003, 0.008, SLATE, i % 2 ? -0.02 : 0, 0.007, -0.045 + i * 0.03);
    }
    check(Bz, 0.06, 0.009, 0.075, 0.02, GREEN);
    // garis batas (persegi putus-putus + sudut glow)
    function dashRect(f, w, d, y, color) {
        var j, gap = 0.02, dl = (w - gap * 4) / 3;
        for (j = 0; j < 3; j++) {
            B(f, dl, 0.006, 0.008, color, -w / 2 + dl / 2 + gap + j * (dl + gap), y, d / 2);
            B(f, dl, 0.006, 0.008, color, -w / 2 + dl / 2 + gap + j * (dl + gap), y, -d / 2);
        }
        dl = (d - gap * 4) / 3;
        for (j = 0; j < 3; j++) {
            B(f, 0.008, 0.006, dl, color, w / 2, y, -d / 2 + dl / 2 + gap + j * (dl + gap));
            B(f, 0.008, 0.006, dl, color, -w / 2, y, -d / 2 + dl / 2 + gap + j * (dl + gap));
        }
    }
    dashRect(Bz, 0.3, 0.3, 0.006, AMBER);
    Sp(Bz, 0.008, CYAN, -0.15, 0.01, 0.15, glow(1));
    Sp(Bz, 0.008, CYAN, 0.15, 0.01, -0.15, glow(1));
    tag(Bz, "SCOPE", 0, 0.028, 0.185);

    // ============================================================
    //  3. USER REQUIREMENTS (kiri-depan): orang + daftar centang + bubble
    // ============================================================
    var Cz = frame(-0.36, Y0, 0.23, -8);
    person(Cz, -0.13, 0.05, { c: DEEP });
    bubble(Cz, -0.13, 0.175, 0.04, { w: 0.075, h: 0.046 });
    var L = board(Cz, 0.2, 0.17, { x: 0.07, z: -0.02, bg: ICE });
    B(Cz, 0.05, 0.014, 0.02, SLATE, 0.07, 0.235, -0.02);   // klip papan
    for (i = 0; i < 3; i++) {
        B(L, 0.11, 0.008, 0.004, SLATE, -0.015, 0.05 - i * 0.035, 0.005);
        check(L, 0.065, 0.05 - i * 0.035, 0.006, 0.015, GREEN);
    }

    // ============================================================
    //  4. APPROVAL (kanan-depan): dokumen bertanda tangan + stempel "Approved"
    // ============================================================
    var Dz = frame(0.36, Y0, 0.23, 8);
    doc(Dz, -0.045, 0.1, 0, { w: 0.12, h: 0.15, sign: true, stamp: true, lines: 3, htxt: "APPROVAL" });
    // stempel melayang (tiga bagian digerakkan bersamaan — animasi cap turun-naik)
    var stampAnim = function (y) {
        return "property: position; from: " + pos(Dz(0.005, y, 0.02)) + "; to: " +
            pos(Dz(0.005, y - 0.015, 0.02)) +
            "; dur: 1400; loop: true; easing: easeInOutSine; dir: alternate";
    };
    C(Dz, 0.02, 0.036, NAVY, 0.005, 0.2, 0.02, { m: 0.4, anim: stampAnim(0.2) });
    Sp(Dz, 0.013, AMBER, 0.005, 0.224, 0.02, { anim: stampAnim(0.224) });
    part(Dz, "primitive: cylinder; radius: " + n(0.034) + "; height: " + n(0.012) +
        "; segmentsRadial: 16", "#0f172a", 0.005, 0.176, 0.02, { m: 0.4, anim: stampAnim(0.176) });
    Sp(Dz, 0.008, GREEN, 0.12, 0.02, 0.05, { e: GREEN, ei: 0.8 });
    Sp(Dz, 0.008, GREEN, -0.11, 0.02, -0.06, { e: GREEN, ei: 0.6 });

    // ============================================================
    //  LABEL + CALLOUT
    // ============================================================
    var t1 = A(0.05, 0.2, -0.01);      // papan "?"
    var t2 = Bz(0, 0.012, -0.16);      // dokumen scope
    var t3 = L(0, 0.1, 0.005);         // daftar centang
    var t4 = Dz(-0.045, 0.18, 0);      // dokumen approval
    callout("Problem Identification", t1[0], 0.32, -0.22, t1);
    callout("Project Scope", t2[0], 0.32, -0.22, t2);
    callout("User Requirements", -0.66, 0.12, 0.3, t3);
    callout("Approval", 0.66, 0.12, 0.3, t4);

    return stageWrap(items);
};
