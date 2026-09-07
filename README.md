# Aqua Pulse — Industrial Water Purification & Sensor Digital Twin

An interactive 3D WebGL digital twin and SCADA monitoring prototype for a smart, off-grid water purification and automated safety diversion system. Built with Three.js and vanilla HTML/CSS/JavaScript.

![Aqua Pulse Prototype](https://img.shields.io/badge/Three.js-r128-blue.svg)
![Status](https://img.shields.io/badge/Status-Prototype%20Active-emerald.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)

---

## 🌊 Overview

**Aqua Pulse** models an industrial-grade, multi-stage water treatment skid equipped with inline sensors and a real-time safety divert mechanism:
- **Raw Water Inflow & Pre-filtration**: High-density polyethylene tank, 70 PSI booster pump, 5µm melt-blown polypropylene sediment filter, and high-iodine coconut CTO carbon block.
- **Advanced Purification**: 0.0001µm Polyamide Thin-Film Composite (TFC) Reverse Osmosis membrane and 253.7nm UV-C disinfection chamber (99.99% pathogen inactivation).
- **Inline SCADA Telemetry**: Real-time multi-spectral sensor cell measuring Turbidity (IR 850nm), Total Dissolved Solids (TDS), RO Hydraulic Pressure, and Permeate Flow Rate.
- **Fail-Safe Safety Interlock Gate**: High-speed 3-way solenoid valve (<45ms response) with an optical LED strobe beacon. Automatically trips and diverts water back to raw intake if TDS exceeds 100 ppm or Turbidity exceeds 1.0 NTU.
- **Off-Grid Autonomous Power**: 100W monocrystalline solar panel and 24V 20Ah LiFePO4 battery pack monitored by an ESP32-S3 microcontroller.

---

## ✨ Features

- **Full 3D Skid Assembly**: Procedurally modeled with Three.js (pumps, membrane vessels, piping manifolds, valves, sensors, frame).
- **Interactive Inspection**: Click any 3D component or legend row to fly the camera and inspect streamlined engineering specifications.
- **Realistic Sensor Telemetry**: Continuous SCADA telemetry simulation with damped harmonic noise for inflow/outflow water metrics.
- **Simulate Contaminant Spikes**: Trigger a high-turbidity / high-TDS spike to observe the 3D safety gate trip, strobe beacon activation, and flow diversion.
- **Streamlined Specs Drawer**: Compact view displaying only the most critical engineering ratings per subsystem.
- **Distraction-Free Mode**: Toggle on-screen HUD panels via the top navigation or pressing hotkey <kbd>H</kbd>.

---

## 🚀 Getting Started

No dependencies or build steps required. The project runs directly in any modern browser supporting WebGL.

### 1. Clone the repository
```bash
git clone https://github.com/maroofkhan000/Aqua-Pulse_3d_prototype.git
cd Aqua-Pulse_3d_prototype
```

### 2. Run locally
You can double-click `index.html` to open it in your browser, or start a local HTTP server:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your web browser.

---

## 🎮 Controls

| Action | Control |
|---|---|
| **Rotate / Orbit** | Left Click + Drag |
| **Pan** | Right Click + Drag (or Two-Finger Drag) |
| **Zoom** | Mouse Wheel / Pinch |
| **Inspect Component** | Left Click on any 3D part or module item |
| **Reset View** | Click **Reset View** in header or dock |
| **Toggle HUD Panels** | Click **Hide/Show Panels** or press <kbd>H</kbd> |

---

## 🛠️ Tech Stack

- **3D Graphics Engine**: [Three.js](https://threejs.org/) (r128)
- **Styling**: Modern CSS3 (Dark glassmorphism, responsive grid, custom scrollbars)
- **Logic**: Vanilla ES6+ JavaScript (zero external runtime dependencies)
