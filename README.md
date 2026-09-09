# 💎 Crystal Collector 2.0 — Neon Cyber Odyssey

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-Windows%20Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![60 FPS](https://img.shields.io/badge/Performance-Smooth%2060%20FPS-00ff88?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

**A high-octane 3D cyberpunk arcade runner built with React, Three.js & Electron. Traverse 10 procedural sci-fi biomes, pilot the CyberRunner astronaut, conquer the Crystal Titan boss, unlock 3D pets & skins, and compete for S-Rank speedrun glory!**

[🎮 **Play in Browser**](https://3dcrystalcollector.netlify.app/) · [📦 **Download Windows Release (.zip)**](https://github.com/lumidren/crystal-collector/releases/latest) · [Report Bug](https://github.com/lumidren/crystal-collector/issues)

</div>

---

## ⚡ 1-Click Quick Start (Windows ZIP)

If you downloaded the repository ZIP from GitHub:
1. **Extract the ZIP file** to any folder.
2. Double-click **`PLAY.bat`** (launches directly in your web browser).
3. Or double-click **`PLAY-DESKTOP.bat`** (launches in a native standalone game window).

*(Requires [Node.js](https://nodejs.org) installed on Windows).*

## 🌟 What's New in 2.0

* **🧑‍🚀 Next-Gen CyberRunner 3D Astronaut**:
  * Fully articulated low-poly cyberpunk runner with reflective curved gold visor, glowing chest arc reactor, and dual jetpack thrusters.
  * Physics-driven animated stride, mid-air jump tuck, dynamic sprint lean, and thruster particle trails.

* **🅰️ Sci-Fi Arcade Typography (Orbitron & Rajdhani)**:
  * Overhauled visual identity with **`Orbitron`** for HUD gauges, speedrun timers, combo streaks, and buttons.
  * Monospace tabular numerals (`tabular-nums`) to eliminate layout jitter during high-speed runs.
  * **`Rajdhani`** for crisp, technical field manual descriptions and menus.

* **🛡️ 3-Second Spawn Grace Period (Invulnerability)**:
  * 3.0 seconds of 100% damage immunity upon spawning into any level, proceeding to next level, or retrying.
  * Rotating protective energy shield prevents cheap obstacle hits at spawn.

* **🏆 End-of-Run Scoreboard & S/A/B/C Letter Ranks**:
  * Competitive end-of-run debrief screen to challenge your friends!
  * Evaluates clear speed, combo streaks, and damage taken to award **S, A, B, or C Ranks**.
  * Live speedrun stopwatch and per-level personal best time records.

* **📖 Interactive Field Manual & Game Pause Freeze**:
  * 4-tab visual codex explaining crystals, power-up matrix, hazards, and jump pads.
  * **Complete Gameplay Freeze**: Obstacles, hazards, boss attacks, and timers halt 100% while reading instructions!

* **💻 Standalone Windows Desktop App (`.exe`)**:
  * Run Crystal Collector natively on Windows as a dedicated standalone app.
  * Ultra-clean arcade window with hardware-accelerated Three.js rendering and zero browser URL bars or tabs.
  * One-click 155 MB portable build ready to extract and play anywhere!

* **🌍 10 Distinct Biomes**:
  * **Forest Valley (Lvl 1–2)**: Pine trees, mossy stepping boulders, and sunny atmosphere.
  * **Crystal Caverns (Lvl 3–4)**: Glowing crystal stalagmites, luminescent cavern fog, and neon lighting.
  * **Frozen Tundra (Lvl 5–6)**: Translucent ice pillars, frosty mist, and slick ice physics!
  * **Volcanic Caldera (Lvl 7–8)**: Molten lava hazard pools (stepping into them hurts!), rising ash, and basalt rock pillars.
  * **Cosmic Void (Lvl 9–10)**: Infinite space void, anti-gravity launch pads, and neon boundary lines.

* **👾 Level 10 Guardian Boss — The Crystal Titan**:
  * Colossal mechanical titan in the center of the arena.
  * Emits rotating sweeping lasers and ground shockwaves that require jump timing.
  * Activate all **4 Power Pylons** in the corners to shatter its shield and capture the Master Core Crystal to win!

* **🚀 Trampoline Jump Pads & Double Jump**:
  * Golden jump pads launch the player high into the air.
  * Mid-air **Double Jump** (<kbd>Spacebar</kbd> twice) for enhanced aerial maneuverability.

* **🐾 3D Pet Companions**:
  * **Cyber Drone** 🛸: Hovers above your shoulder and vacuums coins from 6m away.
  * **Magic Pixie** 🧚: Flutters with translucent wings and pulls crystals from 8m away.
  * **Fire Sprite** 🔥: Super magnet aura pulling items from up to 10m away.

* **🎵 Procedural Synthwave BGM & Chiptune Audio**:
  * **0 KB Download Size**: Real-time algorithmic synth basslines, arpeggios, and sound effects generated entirely with the HTML5 Web Audio API.
  * Dynamic tempo: Speeds up during sprints and Prism Fever Mode!

* **🛒 Shop 2.0 & Meta-Progression**:
  * **5 Character Skins** & **4 Custom 3D Hats**.
  * **Footstep Trails**: Flame Spark, Rainbow Stardust, and Cyber Neon.
  * **Permanent Stat Upgrades**: Max Hearts (up to 5), Stamina Tank (up to 150), and Natural Magnet Reach.

* **💾 Save State Persistence**:
  * Automatically saves all coins, unlocked hats, pets, upgrades, and achievements to `localStorage`.

* **✨ Particle VFX & Game Juice**:
  * Particle bursts on crystal & coin pickups.
  * Running dust trails and dynamic screen trauma camera shake on impacts.
  * Floating 3D score text popups (`+1 💎`, `COMBO x3!`, `LAUNCH! 🚀`, `FEVER! 🌈`).

---

## 🎮 Controls

| Action | Key / Input | Notes |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | Normalized diagonal movement relative to camera |
| **Sprint** | Hold <kbd>Shift</kbd> | Increases speed by up to 2.2x; consumes Stamina ⚡ |
| **Jump** | <kbd>Spacebar</kbd> | Ground jump |
| **Double Jump** | <kbd>Spacebar</kbd> (mid-air) | Mid-air flutter jump 🪶 |
| **Look / Orbit** | **Click Screen** + **Mouse Move** | Locks cursor via Pointer Lock API for smooth 3D camera look |
| **Release Mouse** | <kbd>Esc</kbd> / <kbd>P</kbd> | Opens the Pause & Settings Menu |
| **Zoom Camera** | **Mouse Wheel** | Adjusts third-person camera distance (3m – 15m) |

---

## 🗺️ 10 Levels & Biomes

| Level | Realm & Biome | 💎 Crystals | 🪙 Coins | ⚠️ Hazards | Special Mechanics |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | Forest Valley | 8 | 15 | 5 | Pine Trees & 2 Jump Pads |
| **2** | Forest Valley (Deep) | 10 | 20 | 8 | Dense Woods & Jump Pads |
| **3** | Crystal Cavern | 12 | 25 | 10 | Glowing Stalagmites & Fog |
| **4** | Crystal Cavern (Depths) | 15 | 30 | 12 | Neon Light Clusters & Speed Hazards |
| **5** | Frozen Tundra | 18 | 35 | 14 | Slick Ice Physics & Ice Spikes |
| **6** | Frozen Tundra (Blizzard) | 20 | 40 | 16 | 3 Trampoline Jump Pads |
| **7** | Volcanic Caldera | 22 | 45 | 18 | Molten Lava Pools (Damage on touch!) |
| **8** | Volcanic Caldera (Eruption) | 25 | 50 | 20 | Ash Fog & Lava Stream Crossing |
| **9** | Cosmic Void | 28 | 55 | 22 | Anti-Gravity Platforms & 4 Jump Pads |
| **10** | **THE FINAL TITAN** | 30 | 60 | Boss | **Crystal Titan Boss: Lasers, Shockwaves & 4 Pylons** |

---

## 🏗️ Project Architecture

```text
crystal-collector/
├── README.md               # Game documentation & 2.0 guide
├── index.html              # HTML entrypoint
├── vite.config.js          # Vite build config
├── package.json            # Dependencies & build scripts
└── src/
    ├── main.jsx            # React root mounting
    ├── index.css           # Global viewport reset
    ├── App.css             # Arcade HUD, glassmorphism, animations & shop styling
    ├── App.jsx             # Main game controller, Three.js loop, HUD & shop modals
    ├── audio/
    │   └── soundEngine.js  # Procedural Web Audio chiptune/synthwave BGM & SFX
    ├── world/
    │   └── biomeGenerator.js # Procedural biomes, jump pads, scenery & lava hazards
    └── game/
        ├── particles.js    # High-performance particle bursts, dust & floating popups
        ├── boss.js         # Level 10 Guardian Titan boss, laser sweep & shockwaves
        ├── pets.js         # Pet companion follower system (Drone, Pixie, Sprite)
        └── saveManager.js  # LocalStorage persistence for stats, upgrades & unlocks
```

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lumidren/crystal-collector.git
   cd crystal-collector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local arcade server (Web Browser)**:
   ```bash
   npm run dev
   ```

4. **Launch as Standalone Windows Desktop App**:
   ```bash
   npm run app:dev
   ```

5. **Build Standalone Windows Portable Executable (`.exe`)**:
   ```bash
   npm run app:dist
   ```
   *The portable binary will be generated directly in the `release/` directory ready to run anywhere on Windows!*

6. **Build for Web production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

**Created with ✨ by [Lumidren](https://github.com/lumidren)**

</div>
