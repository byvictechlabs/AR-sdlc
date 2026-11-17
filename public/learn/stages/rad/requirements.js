/**
 * stages/rad/requirements.js — model 3D tahap REQUIREMENTS untuk metode RAD.
 *
 * Key registry: STAGE_BUILDERS["rad/requirements"].
 * Isi awal = copy identik dari kode tahap sebelumnya — edit bebas per metode,
 * metode lain tidak terpengaruh.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */

// 1. REQUIREMENTS — papan klip dokumen + kaca pembesar
STAGE_BUILDERS["rad/requirements"] = function () {
        return stageWrap([
            stageBox(0.5, 0.65, 0.05, "#f8fafc", "0 0.06 0"),
            stageBox(0.18, 0.09, 0.07, "#2563eb", "0 0.42 0.01"),
            stageBox(0.32, 0.035, 0.06, "#93c5fd", "-0.03 0.2 0.01"),
            stageBox(0.32, 0.035, 0.06, "#93c5fd", "-0.03 0.1 0.01"),
            stageBox(0.2, 0.035, 0.06, "#93c5fd", "-0.09 0 0.01"),
            stageBox(0.1, 0.03, 0.06, "#16a34a", "0.13 -0.12 0.01", { rotation: "0 0 40" }),
            stageBox(0.16, 0.03, 0.06, "#16a34a", "0.16 -0.17 0.01", { rotation: "0 0 -45" }),
            stageEntity({
                geometry: "primitive: torus; radius: 0.13; tube: 0.03",
                material: "color: #475569; roughness: 0.4",
                position: "0.34 -0.26 0.1",
            }),
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.025; height: 0.18",
                material: "color: #334155",
                position: "0.44 -0.37 0.1",
                rotation: "0 0 -45",
            }),
        ]);
    };
