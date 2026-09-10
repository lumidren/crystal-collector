# 💎 Crystal Collector 2.0 — Neon Cyber Odyssey

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-Windows%20Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-26%2F26%20Passing-00ff88?style=for-the-badge&logo=node.js&logoColor=white)
![60 FPS](https://img.shields.io/badge/Performance-Smooth%2060%20FPS-00e5ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

**A high-octane 3D cyberpunk arcade platformer built with React, Three.js & Electron.**  
Traverse 10 procedural sci-fi biomes across a massive 76×76 arena, scale multi-tier vertical sky islands, adopt animated 3D cyber pets, conquer the Crystal Titan guardian boss, and compete for S-Rank speedrun glory!

[🎮 **Play in Browser**](https://3dcrystalcollector.netlify.app/) · [📦 **Download Windows Portable (.exe)**](https://github.com/lumidren/crystal-collector/releases/latest) · [🐛 **Report Bug**](https://github.com/lumidren/crystal-collector/issues)

</div>

---

## ⚡ Quick Start (Windows Standalone)

- **Option A (Instant Desktop Play — No Installation Needed)**:
  Download the latest release ZIP, extract it, and run:
  ```
  release\win-unpacked\Crystal Collector.exe
  ```
- **Option B (1-Click Batch Launchers)**:
  - Double-click **`PLAY.bat`** (launches instantly in your default web browser).
  - Double-click **`PLAY-DESKTOP.bat`** (launches as a dedicated native desktop window).

---

## 🌟 What's New in Crystal Collector 2.0

### 🐕 1. 3D Cyber Dog (Robo-Pup) & Cyber Falcon Companions
- **Robo-Pup (`dog`)**: A fully articulated 4-legged robotic canine with animated synchronized trotting kinematics, an active antenna tail that wags, an armored chest plate, and an expressive cyan glowing visor. Snaps dynamically to elevated sky platforms and possesses the game's greatest companion magnet utility: an **11-meter item fetch radius**!
- **Cyber Falcon (`falcon`)**: Aerodynamic mechanical scout with banking turns, flapping articulated wings, and a **9-meter magnetic pull**.
- **Companions Roster**: Adopt and equip companions from the **Arcade Shop 2.0** under the "🐾 Pets" catalog (Cyber Dog, Cyber Falcon, Cyber Drone, Magic Pixie, Fire Sprite).

### 🏝️ 2. Vertical Sky Islands & Floating Bridges (3D Multi-Level World)
- **Multi-Tier Elevated Architecture**: Floating hexagonal platforms, suspension skyways, and high apex lookouts suspended at $Y = 3.8\text{m}$, $4.6\text{m}$, $5.8\text{m}$, $7.55\text{m}$, and $9.0\text{m}$.
- **Under-Platform Ambient Repulsor Lighting**: Each floating sky island is equipped with an anti-gravity repulsor emitter and a dedicated downward point light, casting a soft ambient glow over the ground beneath so shadowed items and hazards remain crystal clear!
- **True 3D Platform Collision & Physics**: Axis-aligned platform boundary snapping, organic ledge falling physics, vertical 3D distance gating (preventing ground looting of sky caches), and catapult trampoline jump pads ($V = 28$).
- **High-Altitude Hazard Immunity**: Standing on elevated platforms grants complete immunity to ground molten lava pools and ground hazard drones below.

### 🕹️ 3. Fresh Run From The Beginning & Clean Minimalist HUD
- **Fresh Arcade Run on Launch**: Each time the application opens, the player starts from the beginning (Level 1) for a clean, authentic campaign progression.
- **Uncluttered Clean Viewport**: Removed intrusive radar overlays to give the player an open, distraction-free view of the 3D world with neatly anchored bottom-left power-up status badges.

### 🗺️ 4. Expanded Arena ($76 \times 76$, $5,776\text{ m}^2$) & 5 Unique Biome Platform Topologies
The entire playable world has been expanded by **+131%**, and every biome features its own handcrafted platform architecture and elevation profile:
1. **🌿 Forest Valley (Levels 1–2)**: Redwood treehouses ($3.7\text{m}$ & $5.5\text{m}$), central suspension bridge ($4.5\text{m}$), lookout terrace ($7.55\text{m}$), and bouncy giant mushroom pads.
2. **🔮 Crystal Cavern (Levels 3–4)**: Subterranean ravine with dual suspended canyon catwalks ($4.3\text{m}$ & $5.7\text{m}$), an arched crystal bridge ($6.85\text{m}$), and apex stalactite perch ($8.9\text{m}$) flanked by pulsing geode launch pads.
3. **❄️ Frozen Tundra (Levels 5–6)**: A monumental 3-tiered stepped Glacier Mountain Peak ($3.55\text{m} \rightarrow 6.15\text{m} \rightarrow 9.0\text{m}$ summit!) surrounded by blizzard geyser catapults and responsive ice sliding physics.
4. **🌋 Volcanic Caldera (Levels 7–8)**: Concentric fortress ring with a central caldera citadel ($5.0\text{m}$) enclosed by a molten lava moat, basalt stepping stones ($2.5\text{m}$), and outer perimeter battlements ($4.1\text{m}$).
5. **🌌 Cosmic Void & Titan Gauntlet (Levels 9–10)**: Hexagonal orbital satellite platforms ($4.3\text{m}$ up to $10.9\text{m}$) connected by cyber light bridges, leading into the Titan Colosseum Throne ($3.9\text{m}$) and 4 elevated shield towers ($5.8\text{m}$).

### ⚔️ 5. Easy / Hard Difficulty Switch & Hazard Rebalance
Tailor your session between casual relaxed platforming and hardcore arcade challenge:
- **🟢 Easy Mode (Relaxed & Safe)**:
  - **Zero Sky Mines**: Completely suppresses all aerial sky mines across all sky islands.
  - **Rebalanced Swarms**: Reduces obstacle counts by ~55% and slows movement speeds to 55% for peaceful, stress-free exploration.
- **⚡ Hard Mode (The Full Arcade Challenge)**:
  - **Aerial Sky Mines**: Hovering gyroscopic mines actively patrol sky decks and bridges, reversing at platform edges.
  - **High-Speed Patrol Drones**: Autonomous stealth interceptor drones cruise the arena airspace.
  - **Full Swarm Density**: Scales up to 44 high-speed hazards ($7 \rightarrow 15\text{ m/s}$) for adrenaline-fueled runs.
- **1-Click Accessibility**: Toggle instantly on the Home Screen command deck, in the Settings modal, or observe the real-time badge on the in-game HUD (`🟢 EASY` / `⚡ HARD`).

### 🎨 6. Next-Gen 3D Sci-Fi Visual Overhaul
- **Quantum Sentinel Cubes**: Heavy carbon-fiber armored exoskeleton with beveled corners, glowing amber hazard chevrons, and an inner **Magma Plasma Reactor Core** that counter-rotates and breathes light.
- **Patrol Interceptor Drones**: Aerodynamic stealth fuselage with swept-back wings, dual ion plasma thrusters, and autonomous flight routes.
- **Anti-Grav Quantum Sky Mines**: Heavy naval armor core, 6 Cartesian detonation spires, dual counter-rotating gyroscopic gimbal rings, and pulsing hazard strobes.
- **Prismatic Crystal Clusters**: Refractive double-ended hexagonal crystal spires with clearcoat transmission ($0.72$), base crystal shards, luminous core, and spinning orbital particle energy rings.
- **Radiant Aurora Fever Crystals**: Hyper-faceted star gems with dynamic real-time HSV rainbow hue rotation and dual intersecting ribbon halos.
- **Embossed Holographic Cyber Medallions**: Thick arcade tokens with notched perimeter teeth, embossed 3D crystal star glyphs, neon groove rings, and gyroscopic precession wobble.
- **Sculpted 3D Cyber Hearts**: Sculpted dual-lobed anatomical hearts with glowing nano-cross emblems and double-thump heartbeat pulse animations.

### 🏠 7. Solid Obsidian Command Deck (Zero Blurry Glassmorphism)
- **Zero Transparency & Zero Blur**: Eliminated all fuzzy `rgba(...)` see-through panels and `backdrop-filter: blur()`. Replaced with a solid, high-contrast obsidian command deck (`#080c14` with a deep navy vignette `#111a2e`).
- **Uncrowded 2-Tier Action Deck**:
  - Full-width hero **`▶ PLAY CAMPAIGN`** button in electric cyan.
  - 2-column primary grid: **`🗺️ LEVELS (X/10)`** and **`🛒 ARCADE SHOP`**.
  - 3-column utility grid: **`🏆 BADGES`**, **`⚙️ SETTINGS`**, and **`📖 GUIDE`**.
  - Subtle solid **`❌ EXIT GAME`** option.
- **Branding**: Prominent creator credit tag `⚡ MADE BY LUMIDREN ⚡` in header and footer.

### 🎵 8. Procedural Synthwave BGM (0 KB Download Size)
- **Pure Web Audio Synthesis**: Real-time algorithmic multi-oscillator synth basslines, arpeggios, kick/snare drums, and retro chiptune sound effects generated dynamically via HTML5 Web Audio API.
- **Dynamic Pacing**: Music tempo dynamically accelerates during sprints and Rainbow Fever Mode!

---

## 🎮 Controls

| Action | Key / Input | Details |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / Arrow Keys | Camera-relative omnidirectional movement |
| **Sprint** | Hold <kbd>Shift</kbd> | Up to 2.2x speed boost; consumes Stamina ⚡ |
| **Jump** | <kbd>Spacebar</kbd> | Ground jump |
| **Double Jump** | <kbd>Spacebar</kbd> (mid-air) | Mid-air flutter jump 🪶 |
| **3D Camera Look** | **Click Screen** + **Move Mouse** | Pointer Lock API for smooth free-look rotation |
| **Zoom Camera** | **Mouse Wheel** | Adjusts third-person distance (3m – 15m) |
| **Pause / Menu** | <kbd>Esc</kbd> / <kbd>P</kbd> | Opens Settings, Codex & Audio Menu |
| **Toggle FPS** | Settings Menu / <kbd>F</kbd> | Toggles live performance telemetry counter |

---

## 🗺️ 10 Levels & Biome Architectures ($76 \times 76$ Arena)

| Level | Realm & Biome | 💎 Crystals | 🪙 Coins | Platform Architecture & Elevation | Hazards & Mechanics |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | Forest Valley | 8 | 15 | Canopy treehouses ($3.7\text{m}$, $5.5\text{m}$), bridge ($4.5\text{m}$), terrace ($7.55\text{m}$) | 3 Bouncy mushroom jump pads |
| **2** | Forest Valley (Deep) | 10 | 20 | Multi-level redwood deck & high treetop cache ($7.55\text{m}$) | Roving cubes & canopy traversal |
| **3** | Crystal Cavern | 12 | 25 | Subterranean catwalks ($4.3\text{m}$, $5.7\text{m}$), crystal bridge ($6.85\text{m}$), stalactite ($8.9\text{m}$) | 4 Pulsing geode launch pads |
| **4** | Crystal Cavern (Depths) | 15 | 30 | High crystal spire climb & suspended catwalk network | Patrol interceptor drones active |
| **5** | Frozen Tundra | 18 | 35 | 3-Tiered Glacier Mountain Peak ($3.55\text{m} \rightarrow 6.15\text{m} \rightarrow 9.0\text{m}$ summit!) | 4 Blizzard geysers & slick ice physics |
| **6** | Frozen Tundra (Blizzard) | 20 | 40 | Glacier summit crossing with twin outer ice outposts ($4.65\text{m}$) | Ice sliding & aerial platform jumps |
| **7** | Volcanic Caldera | 22 | 45 | Concentric caldera citadel ($5.0\text{m}$), moat, basalt stones ($2.5\text{m}$), battlements ($4.1\text{m}$) | 4 Molten lava pools (Damage on touch!) |
| **8** | Volcanic Caldera (Eruption) | 25 | 50 | Basalt stepping stone maze over active lava lakes | High-density lava streams & sky mines |
| **9** | Cosmic Void | 28 | 55 | 6 Floating hexagonal orbital docks & satellite relays ($4.3\text{m}$ to $10.9\text{m}$) | Anti-gravity quantum jumps & void space |
| **10** | **THE FINAL TITAN** | 30 | 60 | Colosseum Throne ($3.9\text{m}$) & 4 Elevated Shield Pylon Towers ($5.8\text{m}$) | **Crystal Titan Boss: Lasers, Shockwaves & 4 Pylons** |

---

## 🛡️ Power-Ups & Collectibles

| Icon | Item | Type | Effect |
| :---: | :--- | :--- | :--- |
| 💎 | **Prismatic Crystal** | Objective | Core level progression collectible with clearcoat refraction & orbital energy rings. |
| 🌈 | **Aurora Fever Gem** | Power-Up | Activates **Prism Fever Mode**: invincibility, 2x speed, double coin value, and chromatic trail. |
| 🪙 | **Cyber Medallion** | Currency | Arcade token for purchasing skins, hats, pets, and permanent stat upgrades in the shop. |
| ❤️ | **Cyber Heart** | Health | Anatomical 3D heart restoring 1 Life Heart with dual-thump heartbeat pulse. |
| 🛡️ | **Aegis Forcefield** | Power-Up | Hexagonal energy shield deflecting obstacle collisions and hazard damage for 10s. |
| 🧲 | **Graviton Magnet** | Power-Up | Vacuum aura pulling distant crystals and coins from up to 18m away for 12s. |
| ⏳ | **Temporal Chrono** | Power-Up | Temporal stasis slowing all obstacles, drones, and boss attacks by 60% for 8s. |

---

## 🧪 Comprehensive Automated Test Suite (26/26 Passing)

The game codebase is verified by an automated test suite executed with Node's native test runner (`node --test test/*.test.js`):

| Test Suite | File | Tests | Status | Scope & Verifications |
| :--- | :--- | :---: | :---: | :--- |
| **Difficulty Scaling** | `test/difficultyMath.test.js` | 2/2 | ✅ Pass | Easy mode hazard suppression (disables sky mines), speed/density scaling; Hard mode arcade swarms |
| **World & Biome** | `test/biomeGenerator.test.js` | 3/3 | ✅ Pass | 10 biome configurations, 5 unique platform architectures, jump pad placement, and lava hazard zones |
| **Physics & Bounds** | `test/physicsMath.test.js` | 8/8 | ✅ Pass | Platform floor snapping, ledge falling, 3D distance gating, jump velocity ($V=28$), $76\times 76$ arena clamping, lava damage immunity, and Sky Mine patrol bounds |
| **Radar & Orientation** | `test/radarMath.test.js` | 2/2 | ✅ Pass | 55m projection math relative to camera forward, perimeter clamping, and altitude markers (`^`) |
| **Companions & Pets** | `test/pets.test.js` | 3/3 | ✅ Pass | Cyber Dog (Robo-Pup) 4-leg trotting kinematics & 11m reach, Cyber Falcon flight & 9m reach, Drone, Pixie, and Sprite magnet radiuses |
| **Save Manager** | `test/saveManager.test.js` | 3/3 | ✅ Pass | Default state schema integrity, `difficulty` mode persistence, round-trip serialization, and corrupted JSON recovery |
| **Scoreboard & Timer** | `test/scoreboardMath.test.js` | 2/2 | ✅ Pass | S/A/B/C letter grade boundary logic, and sub-second millisecond timer formatting precision (`mm:ss.ms`) |
| **Procedural Audio** | `test/soundEngineMath.test.js` | 3/3 | ✅ Pass | MIDI-to-Hertz acoustic conversion ($f = 440 \cdot 2^{(m-69)/12}$), volume bounds $[0, 1]$, and harmonic synthwave progressions |

---

## 🏗️ Project Architecture

```text
crystal-collector/
├── README.md                     # Game documentation, mechanics & quickstart
├── index.html                    # HTML5 canvas container & font loading
├── vite.config.js                # Vite high-performance bundler config
├── package.json                  # Scripts & dependencies
├── PLAY.bat                      # 1-click web launcher
├── PLAY-DESKTOP.bat              # 1-click native desktop launcher
├── electron/
│   ├── main.cjs                  # Electron desktop window process & lifecycle
│   └── preload.cjs               # Secure desktop IPC bridge
├── public/                       # Static web assets & icons
├── test/
│   ├── biomeGenerator.test.js    # Biome platform layouts & hazard testing
│   ├── difficultyMath.test.js    # Easy vs Hard difficulty math tests
│   ├── pets.test.js              # Cyber Dog, Cyber Falcon & pet mechanics tests
│   ├── physicsMath.test.js       # 3D collision, ledge falling & physics tests
│   ├── radarMath.test.js         # Orientation projection & altitude math tests
│   ├── saveManager.test.js       # Save state persistence & recovery tests
│   ├── scoreboardMath.test.js    # S/A/B/C ranks & formatTime precision tests
│   └── soundEngineMath.test.js   # Procedural Web Audio synthwave tests
└── src/
    ├── main.jsx                  # React 19 application entrypoint
    ├── index.css                 # Global viewport styling
    ├── App.css                   # Solid obsidian HUD, animations & modal stylesheets
    ├── App.jsx                   # Central Three.js game loop, state & entity management
    ├── audio/
    │   └── soundEngine.js        # Procedural Web Audio synthesizer (0 KB audio assets)
    ├── components/
    │   ├── HomeScreen.jsx        # Solid obsidian command deck & 2-tier action grid
    │   ├── InGameHUD.jsx         # Live telemetry, stamina, combo & difficulty badge
    │   ├── ScoreboardModal.jsx   # End-of-run S/A/B/C letter grade debrief
    │   ├── LevelSelectModal.jsx  # 10-level campaign world map selector
    │   ├── SettingsModal.jsx     # Audio volumes, difficulty toggle & FPS display
    │   ├── HowToPlayModal.jsx    # Controls guide & quick tutorial
    │   └── FieldManualModal.jsx  # 4-tab interactive codex for biomes, items & hazards
    ├── game/
    │   ├── boss.js               # Level 10 Guardian Titan boss, lasers & shockwaves
    │   ├── particles.js          # High-performance particle bursts & floating 3D text
    │   ├── pets.js               # Cyber Dog, Cyber Falcon & pet companion models
    │   └── saveManager.js        # LocalStorage persistence for stats, unlocks & badges
    └── world/
        └── biomeGenerator.js     # 5 unique 3D platform topologies, jump pads & biomes
```

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lumidren/crystal-collector.git
   cd crystal-collector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run automated unit tests**:
   ```bash
   npm test
   ```

4. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

5. **Launch in native Electron desktop mode**:
   ```bash
   npm run app:dev
   ```

6. **Build standalone Windows portable executable (`.exe`)**:
   ```bash
   npm run app:dist
   ```
   *Packaged binaries are output to `release/win-unpacked/Crystal Collector.exe`.*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

**⚡ Built with passion by [lumidren](https://github.com/lumidren) ⚡**

</div>
