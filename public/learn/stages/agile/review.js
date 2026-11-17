/**
 * stages/agile/review.js — model 3D tahap REVIEW untuk metode AGILE.
 *
 * Key registry: STAGE_BUILDERS["agile/review"].
 * Isi awal = copy identik dari kode tahap sebelumnya — edit bebas per metode,
 * metode lain tidak terpengaruh.
 * WAJIB dimuat SETELAH stage-models.js (lihat urutan <script> di ar.html).
 * Helper dari stage-models.js: stageEntity(), stageBox(), stageWrap().
 */

// 7. REVIEW — papan kanban 3 kolom + centang selesai
STAGE_BUILDERS["agile/review"] = function () {
    // Helper untuk membuat label dengan connector line
    const createLabel = (text, position, targetPosition) => {
        return [
            // Label background
            stageBox(0.18, 0.04, 0.01, "#1e293b", position, { 
                opacity: 0.9 
            }),
            // Label text
            stageEntity({
                geometry: "primitive: plane; width: 0.17; height: 0.035",
                material: `color: #ffffff; shader: flat; transparent: true`,
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) + 0.001} ${parseFloat(position.split(' ')[2]) + 0.006}`,
                text: `value: ${text}; color: #ffffff; align: center; width: 0.17; font: mozillavr`,
            }),
            // Connector line (vertical)
            stageEntity({
                geometry: "primitive: cylinder; radius: 0.003; height: 0.06",
                material: "color: #64748b; opacity: 0.7",
                position: `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) - 0.03} ${position.split(' ')[2]}`,
            }),
            // Connector dot at target
            stageEntity({
                geometry: "primitive: sphere; radius: 0.008",
                material: "color: #3b82f6",
                position: targetPosition,
            }),
        ];
    };

    // Flatten array helper
    const flatten = (arr) => arr.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);

    return stageWrap(flatten([
        // === BASE PLATFORM ===
        stageBox(0.9, 0.02, 0.9, "#0f172a", "0 -0.15 0", { 
            opacity: 0.3 
        }),

        // === 1. SPRINT PRESENTATION (Large Screen - Center Focus) ===
        // Screen frame
        stageBox(0.4, 0.28, 0.02, "#1e293b", "0 0.2 0"),
        // Screen display
        stageBox(0.37, 0.25, 0.01, "#f1f5f9", "0 0.21 0.011"),
        // App UI on screen - Navigation bar
        stageBox(0.34, 0.03, 0.005, "#3b82f6", "0 0.31 0.017"),
        // Content cards
        stageBox(0.08, 0.06, 0.005, "#e2e8f0", "-0.1 0.2 0.017"),
        stageBox(0.08, 0.06, 0.005, "#e2e8f0", "0 0.2 0.017"),
        stageBox(0.08, 0.06, 0.005, "#e2e8f0", "0.1 0.2 0.017"),
        // Action button
        stageBox(0.12, 0.02, 0.005, "#10b981", "0 0.12 0.017"),
        // Screen stand
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.1",
            material: "color: #475569",
            position: "0 0.02 0",
        }),
        // Screen base
        stageBox(0.1, 0.01, 0.08, "#334155", "0 -0.04 0"),

        // === 2. DEVELOPMENT TEAM (Left side) ===
        // Team Member 1
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #3b82f6",
            position: "-0.3 0.1 0.15",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.06",
            material: "color: #3b82f6",
            position: "-0.3 0.04 0.15",
        }),
        // Laptop 1
        stageBox(0.06, 0.005, 0.04, "#1e293b", "-0.3 0.01 0.18"),
        stageBox(0.05, 0.04, 0.005, "#0f172a", "-0.3 0.03 0.2"),
        
        // Team Member 2
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #0ea5e9",
            position: "-0.38 0.1 0.08",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.06",
            material: "color: #0ea5e9",
            position: "-0.38 0.04 0.08",
        }),
        // Laptop 2
        stageBox(0.06, 0.005, 0.04, "#1e293b", "-0.38 0.01 0.11"),
        stageBox(0.05, 0.04, 0.005, "#0f172a", "-0.38 0.03 0.13"),

        // === 3. STAKEHOLDER FEEDBACK (Right side) ===
        // Stakeholder 1
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #f59e0b",
            position: "0.3 0.1 0.15",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.06",
            material: "color: #f59e0b",
            position: "0.3 0.04 0.15",
        }),
        // Speech bubble 1
        stageBox(0.08, 0.05, 0.01, "#fef3c7", "0.3 0.18 0.15"),
        stageBox(0.06, 0.008, 0.005, "#f59e0b", "0.3 0.19 0.156"),
        stageBox(0.05, 0.008, 0.005, "#f59e0b", "0.3 0.17 0.156"),
        
        // Stakeholder 2
        stageEntity({
            geometry: "primitive: sphere; radius: 0.025",
            material: "color: #f97316",
            position: "0.38 0.1 0.08",
        }),
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.02; height: 0.06",
            material: "color: #f97316",
            position: "0.38 0.04 0.08",
        }),
        // Speech bubble 2
        stageBox(0.08, 0.05, 0.01, "#fed7aa", "0.38 0.18 0.08"),
        stageBox(0.06, 0.008, 0.005, "#f97316", "0.38 0.19 0.086"),
        stageBox(0.05, 0.008, 0.005, "#f97316", "0.38 0.17 0.086"),

        // === 4. SPRINT PROGRESS (Kanban Board - Background) ===
        // Board frame
        stageBox(0.5, 0.35, 0.02, "#0f172a", "0 0.35 -0.2"),
        // Column headers
        stageBox(0.14, 0.04, 0.005, "#16a34a", "-0.17 0.48 -0.19"),
        stageBox(0.14, 0.04, 0.005, "#3b82f6", "0 0.48 -0.19"),
        stageBox(0.14, 0.04, 0.005, "#f59e0b", "0.17 0.48 -0.19"),
        // Column backgrounds
        stageBox(0.14, 0.28, 0.005, "#1e293b", "-0.17 0.3 -0.19"),
        stageBox(0.14, 0.28, 0.005, "#1e293b", "0 0.3 -0.19"),
        stageBox(0.14, 0.28, 0.005, "#1e293b", "0.17 0.3 -0.19"),
        // Task cards - Done column (green)
        stageBox(0.12, 0.04, 0.006, "#dcfce7", "-0.17 0.4 -0.185"),
        stageBox(0.12, 0.04, 0.006, "#dcfce7", "-0.17 0.34 -0.185"),
        stageBox(0.12, 0.04, 0.006, "#dcfce7", "-0.17 0.28 -0.185"),
        // Task cards - In Review column (blue)
        stageBox(0.12, 0.04, 0.006, "#dbeafe", "0 0.4 -0.185"),
        stageBox(0.12, 0.04, 0.006, "#dbeafe", "0 0.34 -0.185"),
        // Task cards - Feedback column (yellow/orange)
        stageBox(0.12, 0.04, 0.006, "#fef3c7", "0.17 0.4 -0.185"),

        // === 5. NEXT IMPROVEMENTS (Backlog Items) ===
        // Backlog item 1
        stageBox(0.15, 0.05, 0.02, "#1e293b", "0.35 -0.05 0.2"),
        stageBox(0.13, 0.04, 0.005, "#334155", "0.35 -0.05 0.211"),
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.35 -0.04 0.217"),
        stageBox(0.08, 0.008, 0.005, "#64748b", "0.35 -0.06 0.217"),
        
        // Backlog item 2
        stageBox(0.15, 0.05, 0.02, "#1e293b", "0.35 -0.13 0.2"),
        stageBox(0.13, 0.04, 0.005, "#334155", "0.35 -0.13 0.211"),
        stageBox(0.1, 0.008, 0.005, "#64748b", "0.35 -0.12 0.217"),
        stageBox(0.08, 0.008, 0.005, "#64748b", "0.35 -0.14 0.217"),
        
        // Arrow from feedback to backlog (showing flow)
        stageEntity({
            geometry: "primitive: cylinder; radius: 0.004; height: 0.15",
            material: "color: #f59e0b; opacity: 0.6",
            position: "0.25 0.05 0.18",
            rotation: "0 0 45",
        }),
        stageEntity({
            geometry: "primitive: cone; radius: 0.015; height: 0.03",
            material: "color: #f59e0b",
            position: "0.32 -0.02 0.18",
            rotation: "0 0 45",
        }),

        // === LABELS WITH CONNECTORS ===
        // Label 1: Sprint Presentation
        ...createLabel("Sprint Presentation", "0 0.55 0", "0 0.4 0.01"),
        
        // Label 2: Development Team
        ...createLabel("Development Team", "-0.34 0.25 0.12", "-0.34 0.12 0.12"),
        
        // Label 3: Stakeholder Feedback
        ...createLabel("Stakeholder Feedback", "0.34 0.3 0.12", "0.34 0.18 0.12"),
        
        // Label 4: Sprint Progress
        ...createLabel("Sprint Progress", "0 0.6 -0.2", "0 0.5 -0.19"),
        
        // Label 5: Next Improvements
        ...createLabel("Next Improvements", "0.35 0.1 0.2", "0.35 0 0.21"),
    ]));
};
