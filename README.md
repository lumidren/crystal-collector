# 💎 Crystal Collector 2.0 — Neo-Arcade 3D Platformer

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-Windows%20Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-47%2F47%20Passing-00ff88?style=for-the-badge&logo=node.js&logoColor=white)
![60 FPS](https://img.shields.io/badge/Performance-Smooth%2060%20FPS-00e5ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

**An adrenaline-fueled 3D neo-arcade platformer built with React 19, Three.js & Electron.**  
Traverse 10 procedural biomes across a massive 76×76m arena, scale multi-tier vertical sky islands, adopt 3D animated companions, pilot 6 distinct heroes with signature abilities, conquer the Level 10 Guardian Titan boss, and experience dual visual worlds (*Cyberpunk Neon* & *Sakura Dreamland*)!

[🎮 **Play in Browser**](https://3dcrystalcollector.netlify.app/) · [📦 **Download Windows Standalone (.exe)**](https://github.com/lumidren/crystal-collector/releases/latest) · [🐛 **Report Bug**](https://github.com/lumidren/crystal-collector/issues)

</div>

---

## ⚡ Quick Start

### 🪟 Windows Standalone (No Installation Required)
1. Download the latest portable release:
   - **`Crystal Collector 2.0.0.exe`** (Single-file portable Windows executable)
   - Or extract `release/win-unpacked/` and run `Crystal Collector.exe`.
2. Launch and play instantly at locked 60 FPS with native desktop hardware acceleration!

### 🚀 1-Click Launch Scripts
- **`PLAY.bat`**: Launches the web production build immediately in your default browser.
- **`PLAY-DESKTOP.bat`**: Launches the native desktop Electron app directly.

---

## 🌟 Key Features & Gameplay Highlights

### 🏝️ 1. Multi-Tier Vertical Sky Islands & 3D Physics
- **Multi-Level Verticality**: High-altitude platforms, suspended catwalks, and apex perches floating between $Y = 3.5\text{m}$ and $10.9\text{m}$.
- **Solid Physics & Collision**: Axis-aligned platform boundary snapping, ledge-drop falling physics, and true 3D distance gating preventing ground players from looting elevated caches.
- **Under-Platform Ambient Repulsor Lighting**: Each floating island houses an anti-gravity repulsor crystal and downward point light illuminating shadowed terrain and hazards below.
- **Catapult Launch Trampolines**: Biome-tuned jump pads propel players high into the air ($V = 28\text{ m/s}$) to reach soaring sky islands.
- **Lava Hazard Immunity**: Elevating onto any sky deck grants complete safety from ground molten lava pools and roving hazards.

### 🎭 2. Dual Aesthetic Themes: Cyberpunk & Sakura Dreamland
Switch instantly between two distinct visual experiences via the Home Screen toggle or Developer Root Console:
- **⚡ Cyberpunk Neo-Arcade (Default)**:
  - Deep obsidian ground with electric cyan floor grid and glowing neon perimeter edge rails.
  - Magma-core Quantum Sentinel Cubes with hazard chevrons, interceptor drones, and naval sky mines.
  - Volcanic lava pools, cyber light bridges, and cosmic void rifts.
- **🌸 Sakura Dreamland (Enchanted Girls Theme)**:
  - **High-Contrast Porcelain Alabaster Floor** (`0xede8f2`) providing crisp, readable drop shadows for all entities.
  - **Deep Midnight Twilight Dome** (`0x16132b`) and gentle horizon fog (`near: 35m`, `far: 110m`) for clear sightlines with zero eye fatigue.
  - **Luminous Mint-Cyan Jump Pads** (`0x2dd4bf`) with dark bronze rims and rotating golden stars.
  - **Cursed Obsidian Abyss Hazard Wells** (`0x42104f`, emissive `0x260530`) with eerie violet bubbles for unambiguous danger recognition.
  - **Sleek Obsidian-Violet Mecha Sentinel Cubes** (`0x1a1524`) with ruby danger cores and golden ribbon trims.
  - **Midnight Blackberry Stalker Crawlers** with sparkling anime cyan compound eyes (`0x00ffff`).
  - **Organic Cherry-Wood Sakura Trees** (`0x42271d`) with blush petal clouds and fresh green spring leaf accents.
  - **Translucent Rose Quartz Geodes** and ivory-stemmed fairy toadstools.

### ⚔️ 3. Three Tuned Difficulty Modes
- **🟢 Easy**: 0 spiders/crawlers, +25% Sentinel Cubes, relaxed obstacle speed (70%) for chill exploration.
- **🟡 Medium**: Balanced experience with moderate spider frequency (1 out of every 6 hazards), +15% cubes, and 85% speed.
- **⚡ Hard**: High-octane arcade challenge with frequent aggressive stalker crawlers (35% density), aerial sky mines, and 105% speed.

### 👑 4. Level 10 Guardian Boss: The Titan / Starlight Empress
The ultimate trial awaiting at Level 10:
- **Colosseum Throne Arena**: A grand central platform surrounded by 4 elevated Shield Pylon Towers.
- **Invulnerability Forcefield**: The boss remains completely immune to damage until you activate the 4 corner pylon target beacons.
- **Sweeping Laser Beams & Shockwaves**: Evade high-damage rotating energy beams and ground shockwave rings while climbing to the pylons.
- **Shield Collapse & Core Vulnerability**: Once all 4 pylons are triggered, the boss shield shatters, exposing the pulsating core to deliver the finishing blow!

### 🎵 5. Procedural Web Audio Synthwave (0 KB Asset Size)
- Pure algorithmic sound synthesis generated dynamically via the HTML5 Web Audio API:
  - Multi-oscillator synthwave basslines and harmonic chord progressions.
  - Real-time arpeggiators that accelerate tempo during sprints and Rainbow Fever Mode.
  - Procedural sound effects: jump pads, coin chimes, heart collection, hazard alerts, and the pentatonic fairy harp cascade!

---

## 🎮 Controls

| Action | Key / Input | Details |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / Arrow Keys | Camera-relative omnidirectional movement |
| **Sprint** | Hold <kbd>Shift</kbd> | Up to $2.2\times$ speed boost; consumes Stamina ⚡ |
| **Jump** | <kbd>Spacebar</kbd> | Ground jump |
| **Double Jump** | <kbd>Spacebar</kbd> (mid-air) | Mid-air flutter jump 🪶 |
| **Air Glide** | Hold <kbd>Spacebar</kbd> in air | Glide gently across long gaps *(Neon Valkyrie & Magical Girl)* |
| **3D Camera Look** | **Click Screen** + **Move Mouse** | Smooth Pointer Lock 360° free-look camera |
| **Zoom Camera** | **Mouse Wheel** | Adjusts third-person camera distance ($3\text{m} - 15\text{m}$) |
| **Pause / Menu** | <kbd>Esc</kbd> / <kbd>P</kbd> | Pauses game and opens settings & sound controls |
| **Toggle FPS** | <kbd>F</kbd> / Settings Menu | Toggles real-time FPS performance counter |

---

## 🦸 Playable Heroes Roster

Unlock and select from 6 unique playable characters in the **Arcade Shop**, each featuring custom 3D geometries, animated accessories, and stat modifiers:

| Hero | Icon | Title | Signature Ability / Perks | Stat Bonuses | 3D Visual Signatures |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Cyber Runner** | 🏃 | Neo-Racer | Starter standard runner with high maneuverability | Speed: $1.0\times$, Jump: $+0\text{m}$, Hearts: $3$ | Armored chassis, twin rocket jetpack with exhaust trails |
| **Shadow Shinobi** | 🥷 | Nightblade | Nimble cyber ninja with high jump boost | Speed: $1.15\times$, Jump: $+2.5\text{m}$ | Trailing animated fabric scarf, ninja visor & cowl |
| **Titan Juggernaut** | 🛡️ | Iron Vanguard | Heavy armor tank with extra starting health | Speed: $0.9\times$, Jump: $-0.5\text{m}$, **$+1$ Extra Heart** | Heavy industrial plating, vertical furnace exhaust stacks |
| **Void Sorcerer** | 🔮 | Astral Weaver | Cosmic mage with massive crystal pull | Speed: $1.05\times$, **$+5.0\text{m}$ Magnet Radius** | Orbiting celestial rune rings, floating astral catalyst orb |
| **Neon Valkyrie** | 🪽 | Sky Queen | Aerial warrior capable of gliding across sky gaps | Speed: $1.12\times$, Jump: $+3.0\text{m}$, **Air Glide** | Swept-back dual photonic energy wings, thruster flight heels |
| **Magical Girl** | ✨ | Starlight Dreamer | Secret fairy heroine with triple perks | Speed: $1.16\times$, Jump: $+3.5\text{m}$, **$+1$ Heart**, **$+4\text{m}$ Magnet**, **Air Glide** | Flared peplum skirt, fluttering fairy wings, ribbons, tiara & star wand |

---

## 🐾 Companions & Pets Roster

Adopt companions from the Arcade Shop to follow you across sky islands and ground terrain, providing passive item-collection magnet reach:

| Pet | Icon | Name | Fetch Reach | Kinematics & 3D Model |
| :--- | :---: | :--- | :---: | :--- |
| **Robo-Pup** | 🐕 | Cyber Dog | **11.0m** | 4 articulated legs with synchronized trotting animations, wagging antenna tail, and glowing cyan visor. |
| **Cyber Falcon** | 🦅 | Sky Scout | **9.0m** | Aerodynamic mechanical falcon with articulated flapping wings, banking flight turns, and aerial hover. |
| **Sugar Bunny** | 🐰 | Enchanted Bunny | **12.0m** | Fluffy body with bouncing animated floppy ears, fluttering fairy wings, and super-magnet aura. |
| **Cyber Drone** | 🛸 | Orbit Drone | **8.0m** | Dual counter-rotating gyroscopic rings with directional sensor eye and hovering bob motion. |
| **Magic Pixie** | 🧚 | Starlight Sprite | **7.5m** | Glittering celestial pixie orb with dual fluttering translucent wings and sparkling trail. |
| **Fire Sprite** | 🔥 | Plasma Flame | **7.0m** | Molten fire elemental with undulating plasma crown and heat distortion particles. |

---

## 🗺️ 10 Levels & Biome Architectures ($76 \times 76\text{m}$ Arena)

| Level | Realm & Biome | 💎 | 🪙 | Platform Topologies & Elevations | Biome Hazard Mechanics |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | Forest Valley | 8 | 15 | Redwood canopy treehouses ($3.7\text{m}$, $5.5\text{m}$), suspension bridge ($4.5\text{m}$), lookout terrace ($7.55\text{m}$) | 3 Bouncy giant mushroom / launch pads |
| **2** | Forest Valley (Deep) | 10 | 20 | Multi-level redwood deck & high treetop cache ($7.55\text{m}$) | Roving Sentinel Cubes & canopy traversal |
| **3** | Crystal Cavern | 12 | 25 | Dual suspended canyon catwalks ($4.3\text{m}$, $5.7\text{m}$), crystal arch ($6.85\text{m}$), stalactite perch ($8.9\text{m}$) | 4 Subterranean geode jump launchers |
| **4** | Crystal Cavern (Depths) | 15 | 30 | High crystal spire climb & suspended catwalk network | Patrol interceptor drones active |
| **5** | Frozen Tundra | 18 | 35 | 3-Tiered Glacier Mountain Peak ($3.55\text{m} \rightarrow 6.15\text{m} \rightarrow 9.0\text{m}$ summit!) | 4 Blizzard geysers & slick ice physics ($F=0.94$) |
| **6** | Frozen Tundra (Blizzard) | 20 | 40 | Glacier summit crossing with twin outer ice outposts ($4.65\text{m}$) | Ice sliding & high-altitude platform leaps |
| **7** | Volcanic Caldera | 22 | 45 | Caldera citadel ($5.0\text{m}$), moat, basalt stones ($2.5\text{m}$), perimeter battlements ($4.1\text{m}$) | 4 Molten lava pools (Lethal on ground contact!) |
| **8** | Volcanic Caldera (Eruption) | 25 | 50 | Basalt stepping stone maze over active lava lakes | High-density lava streams & aerial sky mines |
| **9** | Cosmic Void | 28 | 55 | 6 Floating hexagonal orbital docks & satellite relays ($4.3\text{m}$ to $10.9\text{m}$) | Anti-gravity quantum jumps & void space rifts |
| **10** | **THE FINAL TITAN** | 30 | 60 | Colosseum Throne ($3.9\text{m}$) & 4 Elevated Shield Pylon Towers ($5.8\text{m}$) | **Guardian Titan Boss: Forcefield, Lasers & 4 Shield Pylons** |

---

## 🛡️ Power-Ups & Collectibles

| Icon | Item | Type | Effect & Mechanics |
| :---: | :--- | :--- | :--- |
| 💎 | **Prismatic Crystal** | Objective | Primary level progression collectible with clearcoat refraction and spinning orbital rings. |
| 🌈 | **Aurora Fever Gem** | Power-Up | Activates **Prism Fever Mode**: temporary invincibility, $2\times$ movement speed, double coin multiplier, and chromatic light trail. |
| 🪙 | **Cyber Medallion** | Currency | Thick arcade token with notched edge teeth and embossed star glyph for shop upgrades. |
| ❤️ | **Cyber Heart** | Health | Anatomical 3D heart restoring 1 Life Heart with dual-thump heartbeat pulse animations. Uncapped accumulation allowed! |
| 🛡️ | **Aegis Forcefield** | Power-Up | Hexagonal energy shield deflecting all obstacle collisions and hazard damage for 10s. |
| 🧲 | **Graviton Magnet** | Power-Up | Vacuum aura drawing crystals and coins from up to 18m away for 12s. |
| ⏳ | **Temporal Chrono** | Power-Up | Chrono stasis slowing all obstacles, drones, and boss attacks by 60% for 8s. |

---

## 🔐 Developer Root Access Console

Click the **ℹ️ ABOUT** button on the Home Screen to open the About Modal. At the bottom lies the **Developer Root Access Console**:
- **`lumidren`**: Developer master key that immediately unlocks all 10 campaign levels for unrestricted level selection.
- **`iloverue`**: Secret easter-egg code that unlocks the **Girls Theme** (*Sakura Dreamland*), the **Magical Girl** hero, and the **Sugar Bunny** pet companion!

---

## 🧪 Comprehensive Automated Test Suite (47/47 Passing)

Every module, mathematical calculation, and collision rule is covered by automated unit tests running on Node's native test runner (`node --test test/*.test.js`):

| Test Suite | File | Tests | Status | Scope & Verifications |
| :--- | :--- | :---: | :---: | :--- |
| **World & Biome** | `test/biomeGenerator.test.js` | 4/4 | ✅ Pass | 10 level biome configs, 5 unique platform architectures, jump pad placement, lava hazard zones, solid colliders |
| **Characters & Heroes** | `test/characters.test.js` | 6/6 | ✅ Pass | CHARACTER_ROSTER definitions, Titan Mech armor heart, Void Sorcerer magnet bonus, Valkyrie air glide, Magical Girl perks, 3D geometry instantiation |
| **Difficulty Scaling** | `test/difficultyMath.test.js` | 5/5 | ✅ Pass | Easy mode spider suppression (0%), Medium mode balanced ratio, Hard mode arcade swarms, root password unlock math |
| **Companions & Pets** | `test/pets.test.js` | 4/4 | ✅ Pass | Robo-Pup trotting & 11m reach, Cyber Falcon flight & 9m reach, Drone/Pixie/Sprite magnet radii, Sugar Bunny 12m super-magnet |
| **Physics & Collision** | `test/physicsMath.test.js` | 12/12 | ✅ Pass | CurrentFloorY snapping across multi-tier decks, ledge falling, 3D vertical distance gating, jump velocity ($V=28$), arena clamping, lava immunity, Hunter homing, Sky Mine bounds, tree/rock collision, uncapped hearts, Sentinel hover, Level 10 Titan pylon triggers |
| **Radar & Orientation** | `test/radarMath.test.js` | 2/2 | ✅ Pass | 55m radar screen coordinate projection relative to camera forward, perimeter clamping, altitude indicators (`^`) |
| **Save Management** | `test/saveManager.test.js` | 4/4 | ✅ Pass | Complete default state fallback, round-trip serialization, corrupted JSON error recovery, resetGameState data wipe |
| **Scoreboard & Ranking** | `test/scoreboardMath.test.js` | 2/2 | ✅ Pass | S, A, B, C grade boundary calculations, sub-second millisecond timer formatting (`mm:ss.ms`) |
| **Procedural Audio** | `test/soundEngineMath.test.js` | 4/4 | ✅ Pass | MIDI-to-Hertz acoustic conversion ($f = 440 \cdot 2^{(m-69)/12}$), volume clamp bounds $[0, 1]$, harmonic chord progressions, safe API invocation |
| **Theme Systems** | `test/worldTheme.test.js` | 4/4 | ✅ Pass | Sakura Dreamland palette config, 14 cherry trees, 8 rose geodes, 6 toadstools, anime-eyed stalker creature, Starlight Empress boss |

---

## 🏗️ Project Structure

```text
crystal-collector/
├── README.md                     # Comprehensive documentation & game guide
├── index.html                    # HTML5 canvas container & font loader
├── vite.config.js                # High-performance bundler configuration
├── package.json                  # Dependencies, build scripts & electron-builder metadata
├── PLAY.bat                      # 1-click web launcher
├── PLAY-DESKTOP.bat              # 1-click native desktop launcher
├── electron/
│   ├── main.cjs                  # Electron desktop window process & lifecycle
│   └── preload.cjs               # Secure desktop IPC bridge
├── public/                       # Static web assets & icons
├── test/
│   ├── biomeGenerator.test.js    # Biome platform layouts & hazard testing
│   ├── characters.test.js        # Playable heroes roster & 3D mesh tests
│   ├── difficultyMath.test.js    # Easy/Medium/Hard difficulty scaling tests
│   ├── pets.test.js              # Robo-Pup, Falcon, Bunny & pet companion tests
│   ├── physicsMath.test.js       # 3D collision, ledge falling & physics tests
│   ├── radarMath.test.js         # Orientation projection & altitude math tests
│   ├── saveManager.test.js       # Save state persistence & recovery tests
│   ├── scoreboardMath.test.js    # S/A/B/C letter grade & timer precision tests
│   ├── soundEngineMath.test.js   # Procedural Web Audio synthesizer tests
│   └── worldTheme.test.js        # Sakura Dreamland & Girls Theme tests
└── src/
    ├── main.jsx                  # React 19 application entrypoint
    ├── index.css                 # Global viewport styles
    ├── App.css                   # Obsidian HUD, modal styling & Girls Theme CSS
    ├── App.jsx                   # Central Three.js game loop, physics & entity engine
    ├── audio/
    │   └── soundEngine.js        # Procedural Web Audio synthesizer (0 KB audio files)
    ├── components/
    │   ├── HomeScreen.jsx        # Command deck, difficulty switch & theme toggle
    │   ├── InGameHUD.jsx         # Telemetry, stamina, combo counter & status badges
    │   ├── ScoreboardModal.jsx   # End-of-run S/A/B/C debrief & performance breakdown
    │   ├── LevelSelectModal.jsx  # 10-level campaign world map selector
    │   ├── ShopModal.jsx         # Arcade Shop with '✕' close button (Heroes, Pets, Upgrades)
    │   ├── AchievementsModal.jsx # 16 unlockable trophies & achievements
    │   ├── AboutModal.jsx        # Developer info, GitHub/LinkedIn links & Root Console
    │   ├── SettingsModal.jsx     # Volume sliders, graphics quality & FPS toggle
    │   ├── HowToPlayModal.jsx    # Controls guide & quick tutorial
    │   └── FieldManualModal.jsx  # Interactive codex for biomes, items & hazards
    ├── game/
    │   ├── boss.js               # Level 10 Titan Boss / Starlight Empress with 4 Pylons
    │   ├── character.js          # 6 playable heroes with custom 3D geometries & perks
    │   ├── creatures.js          # Cyber Stalker Bio-Mecha crawlers with anime eyes
    │   ├── particles.js          # High-performance particle bursts & 3D floating text
    │   ├── pets.js               # 6 companions with animated trotting & flight
    │   └── saveManager.js        # LocalStorage persistence for stats, unlocks & badges
    └── world/
        └── biomeGenerator.js     # 5 platform topologies, weather systems & jump pads
```

---

## 💻 Local Development & Build Commands

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lumidren/crystal-collector.git
   cd crystal-collector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run automated test suite (47 tests)**:
   ```bash
   npm test
   ```

4. **Start local Vite development server**:
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
   *Packaged binary is output to `release/Crystal Collector 2.0.0.exe` and `release/win-unpacked/`.*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

**⚡ Built with passion by [lumidren](https://github.com/lumidren) ⚡**

</div>
