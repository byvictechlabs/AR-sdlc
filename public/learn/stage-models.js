/**
 * stage-models.js — Model 3D detail per tahap (Stage Model).
 *
 * DIPISAH dari ar.html. Berisi:
 *   - detectStageType()       deteksi tipe tahap dari nama mesh / judul
 *   - detectMethod()          deteksi metode dari prefix mesh (WF_ / AG_ / RAD_)
 *   - STAGE_BUILDERS          registry kosong — ISI 21 model prosedural (7 tahap × 3 metode)
 *                             ada di public/learn/stages/{waterfall,agile,rad}.js (dimuat SETELAH
 *                             file ini), key-nya "<metode>/<tahap>" mis. "rad/design"
 *   - showStageModel()        tampilkan model tahap (GLB R2 → hardcode → fallback)
 *   - hideStageModel()        kembalikan ke model utama
 *   - activateStageSwap()     sembunyikan model utama, posisikan model tahap
 *   - fitStageGltf()          auto-fit skala/posisi GLB apapun
 *   - showStageCTA() / hideStageCTA() / openDetailFromStage()  tombol aksi
 *
 * Dipanggil global oleh ar.html:
 *   handleClick()   → showStageModel() + showStageCTA()
 *   openPopup()     → hideStageCTA()
 *   closePopup()    → showStageCTA() bila stageStep masih ada
 *   targetLost()    → closePopup() + hideStageModel()
 *
 * Ketergantungan runtime (ada di ar.html):
 *   FIT_SIZE, AFRAME, resetView(), openPopup(),
 *   variabel stageToken & stageStep (dideklarasikan di file ini).
 */
// ================= STAGE 3D (model detail per tahap) =================
// Saat mesh tahap diklik, model utama disembunyikan dan DIGANTIKAN oleh
// model 3D tahapan tersebut di atas marker (popup teks tetap di bawah).
// Dua sumber model, urutan prioritas:
//  1. GLB dari database  → step.stageModelUrl (file di R2, diisi via admin)
//  2. Model hardcode     → file public/learn/stages/<metode>.js (waterfall, agile, rad),
//     masing-masing berisi 7 tahap dengan key "<metode>/<tahap>" — isi tiap metode boleh beda
// Kalau dua-duanya tidak ada → tampilan normal (model utama tetap terlihat).
let stageToken = 0;   // dinaikkan saat keluar mode tahap → membatalkan proses async
let stageStep = null; // step yang model tahapnya sedang tampil (mode tahap aktif)

// ===== Tombol aksi (CTA) — muncul setelah model tahap tampil =====
function showStageCTA() {
    const cta = document.getElementById("stage-cta");
    if (cta) cta.classList.remove("hidden");
}
function hideStageCTA() {
    const cta = document.getElementById("stage-cta");
    if (cta) cta.classList.add("hidden");
}
// Dari tombol "📋 Lihat Penjelasan" → buka popup detail (teks + TTS)
function openDetailFromStage() {
    if (stageStep) openPopup(stageStep);
}

function detectStageType(meshName) {
    const n = String(meshName || "").toUpperCase();
    if (/MAINTENANCE/.test(n)) return "maintenance";
    if (/REVIEW|FEEDBACK/.test(n)) return "review";
    if (/DEPLOY|CUTOVER|LAUNCH|RELEASE/.test(n)) return "deployment";
    if (/TEST/.test(n)) return "testing";
    if (/IMPLEMENT|DEVELOP|CONSTRUCTION|CODING/.test(n)) return "coding";
    if (/DESIGN/.test(n)) return "design";
    if (/REQUIREMENT|ANALYS|PLANN/.test(n)) return "requirements";
    return null;
}

// Deteksi metode dari prefix/segmen nama mesh (WF_ / AG_ / RAD_).
// Dipakai untuk memilih builder PER METODE: STAGE_BUILDERS["<metode>/<tahap>"].
function detectMethod(meshName) {
    const n = String(meshName || "").toUpperCase();
    if (/(^|_)RAD(_|$)/.test(n)) return "rad";
    if (/(^|_)AG(_|$)/.test(n)) return "agile";
    if (/(^|_)WF(_|$)/.test(n)) return "waterfall";
    return null;
}

function stageEntity(attrs) {
    const el = document.createElement("a-entity");
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function stageBox(w, h, d, color, position, extra) {
    return stageEntity(Object.assign({
        geometry: "primitive: box; width: " + w + "; height: " + h + "; depth: " + d,
        material: "color: " + color + "; roughness: 0.6",
        position: position,
    }, extra || {}));
}

// Pembungkus wajib: platform dasar + grup berputar pelan (turntable)
function stageWrap(children) {
    const g = stageEntity({
        animation: "property: rotation; to: 0 360 0; loop: true; dur: 16000; easing: linear",
    });
    g.appendChild(stageEntity({
        geometry: "primitive: cylinder; radius: 0.6; height: 0.05",
        material: "color: #e2e8f0; roughness: 0.85",
        position: "0 -0.5 0",
    }));
    children.forEach((c) => g.appendChild(c));
    return g;
}

const STAGE_BUILDERS = {};   // registry "<metode>/<tahap>" — diisi public/learn/stages/{waterfall,agile,rad}.js (dimuat SETELAH file ini)

// Sembunyikan model tahap & tampilkan lagi model utama (panggil saat popup ditutup)
function hideStageModel() {
    stageToken++;
    stageStep = null;
    const stageEl = document.getElementById("stage-entity");
    const modelEl = document.getElementById("model-entity");
    if (stageEl) {
        while (stageEl.firstChild) stageEl.removeChild(stageEl.firstChild);
        stageEl.setAttribute("visible", false);
    }
    if (modelEl) modelEl.setAttribute("visible", true);
    hideStageCTA();
}

// Tukar tampilan: model utama off → model tahap on, view kembali tegak (mulus via lerp)
function activateStageSwap() {
    document.getElementById("model-entity").setAttribute("visible", false);
    document.getElementById("stage-entity").setAttribute("visible", true);
    resetView();
}

// Fit-kan GLB tahap ke ukuran standar (sama seperti normalizeModel utama)
function fitStageGltf(el) {
    try {
        const THREE = AFRAME.THREE;
        const root = el.object3D;
        root.position.set(0, 0, 0);
        root.scale.set(1, 1, 1);
        root.rotation.set(0, 0, 0);
        root.updateMatrixWorld(true);
        const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
        const box = new THREE.Box3();
        const tmp = new THREE.Box3();
        root.traverse((o) => {
            if (!o.isMesh || !o.geometry) return;
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            tmp.copy(o.geometry.boundingBox)
                .applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
            box.union(tmp);
        });
        if (box.isEmpty()) return;
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const fit = FIT_SIZE / maxDim;
        root.scale.setScalar(fit);
        root.position.copy(center).multiplyScalar(-fit);
        console.log("[Stage] GLB fit — size:", size.toArray().map((n) => n.toFixed(2)),
            "scale:", fit.toFixed(3));
    } catch (e) {
        console.warn("[Stage] fit GLB gagal:", e);
    }
}

// Titik masuk: dipanggil dari handleClick saat mesh dengan data admin diklik.
// Return true = model tahap sedang diproses/tampil → pakai tombol CTA;
// Return false = tidak ada model tahap → buka popup langsung (perilaku lama).
function showStageModel(step, meshName) {
    const stageEl = document.getElementById("stage-entity");
    if (!stageEl) return false;
    hideStageModel();          // bersihkan state lama + ambil token baru
    const token = stageToken;
    const url = step && step.stageModelUrl
        ? String(step.stageModelUrl).trim() : "";
    const type = detectStageType(meshName);
    const method = detectMethod(meshName);
    // Builder: "<metode>/<tahap>" dulu → fallback "<tahap>" (registry generik bila ada)
    const builder = (method && type && STAGE_BUILDERS[method + "/" + type])
        || (type && STAGE_BUILDERS[type]) || null;

    if (url) {
        console.log("[Stage] Muat GLB tahap dari database:", url);
        stageStep = step;
        const child = document.createElement("a-entity");
        child.setAttribute("gltf-model", "url(" + url + ")");
        child.addEventListener("model-loaded", function () {
            if (token !== stageToken) return;   // sudah keluar mode tahap → batal
            fitStageGltf(child);
            activateStageSwap();
            console.log("[Stage] GLB tahap tampil");
        });
        child.addEventListener("model-error", function () {
            if (token !== stageToken) return;
            console.warn("[Stage] GLB gagal → fallback:", builder ? (method ? method + "/" : "") + type : "tampilan normal");
            if (child.parentNode) child.parentNode.removeChild(child);
            if (builder) {
                stageEl.appendChild(builder());
                activateStageSwap();
            }
        });
        stageEl.appendChild(child);
        return true;           // tampilan menyusul setelah model siap
    }

    if (builder) {
        stageStep = step;
        stageEl.appendChild(builder());
        activateStageSwap();
        console.log("[Stage] Model hardcode:", (method ? method + "/" : "") + type, "| mesh:", meshName);
        return true;
    }
    console.log("[Stage] Tanpa model (URL kosong & builder tak ditemukan) → popup langsung");
    return false;
}
