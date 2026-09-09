# 💎 Crystal Collector 3D

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

**A high-energy, low-poly 3D arcade platformer built with React 19 and Three.js.**  
Dash, jump, and collect crystals across 10 dangerous arenas while dodging lethal obstacles, managing stamina, unlocking cosmetics, and racking up achievements.

[🎮 **Play Live on Netlify**](https://3dcrystalcollector.netlify.app/) · [Report Bug](https://github.com/lumidren/crystal-collector/issues) · [Request Feature](https://github.com/lumidren/crystal-collector/issues)

</div>

---

## 🕹️ Gameplay & Features

### 🌟 Core Highlights
- **10 Progressively Challenging Stages**: Advance from *Tutorial Valley* through treacherous frozen wastes and shadow realms to the dreaded *FINAL GAUNTLET*.
- **🛒 In-Game Cosmetics Shop**: Earn coins on every run to buy custom character colors and stylish 3D hats.
- **🏆 Badges & Achievements System**: Track milestones like collecting your first crystal, clearing intermediate worlds, and accumulating 100+ coins.
- **🛡️ Shield Power-Ups**: Grab glowing 3D shields that project an animated protective force field for 10 seconds of obstacle immunity.
- **⚡ Stamina & Sprint Mechanics**: Manage your energy meter for tactical burst-sprints with dynamic camera framing and character bobbing.
- **🔊 Procedural Web Audio Engine**: Zero-asset audio powered by HTML5 `AudioContext` with custom frequencies and envelope ramps for crystal & coin pickups.
- **🎯 Pointer-Lock Camera**: Seamless first/third-person hybrid mouse-look controls with zoom wheel and escape handling.
- **🏃 Skeletal-Style Animations**: Procedurally animated swinging arms and legs synced to walking and sprinting speeds.

---

## 🎮 Controls

| Action | Key / Input | Notes |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | Directional movement relative to camera |
| **Sprint** | Hold <kbd>Shift</kbd> | Increases speed by 1.8x; consumes Stamina ⚡ |
| **Jump** | <kbd>Spacebar</kbd> | Jump over ground hazards and obstacles |
| **Look / Orbit** | **Click Screen** + **Mouse Move** | Locks cursor via Pointer Lock API for smooth camera orbit |
| **Release Mouse** | <kbd>Esc</kbd> | Unlocks cursor to click UI / Shop / Badges |
| **Zoom Camera** | **Mouse Wheel** | Adjusts third-person camera distance (3m - 15m) |
| **Mute / Unmute** | **🔊 / 🔇 Button** | Quick toggle for procedural audio effects |

---

## 🗺️ Level Progression

Each stage escalates in speed, danger, and rewards:

| Level | Realm Name | 💎 Crystals | 🪙 Coins | ⚠️ Obstacles | Speed | ❤️ Hearts |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **1** | Tutorial Valley | 8 | 15 | 5 | 4 | 2 |
| **2** | Crystal Cavern | 10 | 20 | 8 | 5 | 2 |
| **3** | Mystic Peaks | 12 | 25 | 10 | 6 | 3 |
| **4** | Thunder Plains | 15 | 30 | 12 | 7 | 3 |
| **5** | Frozen Tundra | 18 | 35 | 14 | 8 | 3 |
| **6** | Lava Fields | 20 | 40 | 16 | 9 | 4 |
| **7** | Sky Gardens | 22 | 45 | 18 | 10 | 4 |
| **8** | Shadow Realm | 25 | 50 | 20 | 11 | 4 |
| **9** | Cosmic Void | 28 | 55 | 22 | 12 | 5 |
| **10** | **FINAL GAUNTLET** | 30 | 60 | 25 | 13 | 5 |

---

## 🛒 Shop & Customization

Spend your hard-earned coins directly from the HUD:

### 🎨 Character Colors
- **Classic Green** (Default, Free)
- **Electric Blue** (50 🪙)
- **Crimson Red** (50 🪙)
- **Mystic Purple** (100 🪙)
- **Radiant Gold** (150 🪙)

### 🎩 Headwear Collection
- **Baseball Cap** 🧢 (Free) - Red cap with a sporty front visor
- **Dapper Top Hat** 🎩 (100 🪙) - Classic black silk hat with a velvet ribbon
- **Royal Crown** 👑 (150 🪙) - Gold crown set with alternating ruby and sapphire gems
- **Santa Hat** 🎅 (200 🪙) - Festive red conical hat with fluffy white trim & pompom

---

## 🏆 Achievements & Badges

| Badge | Title | Requirement |
| :---: | :--- | :--- |
| 💎 | **First Steps** | Collect your first crystal |
| 🏆 | **Beginner** | Complete Level 1 |
| ⭐ | **Halfway There** | Complete Level 5 |
| 👑 | **Champion** | Complete Level 10 (*The Final Gauntlet*) |
| 💰 | **Coin Collector** | Accumulate 100+ total coins |

---

## 🏗️ Architecture & Technical Details

### 1. Three.js Graphics Pipeline
- **Scene Graph**: Managed through React `useRef` attachment to cleanly separate DOM layout from the WebGL canvas.
- **Lighting & Atmosphere**: Directional sunlight with high-resolution PCF soft shadow maps (`2048x2048`), complemented by low-intensity ambient fill lighting.
- **Low-Poly Primitives**: Octahedron crystals with emissive shading, multi-part procedural hats, and composite humanoid meshes built with cylinders and spheres.
- **Resource Disposal**: Comprehensive lifecycle traversal in `useEffect` cleanup disposing all geometries, materials, and renderer contexts to prevent WebGL memory leaks.

### 2. High-Performance Game Loop
- **Decoupled State**: Animation runs via `requestAnimationFrame` using a `THREE.Clock` delta timer (`dt`).
- **Zero-Stutter Mechanics**: Frame-rate independent physics for velocity, obstacle bounces, and jumping arcs.
- **Stable React Binding**: HUD values like stamina and shield timers update state without triggering full 3D scene re-instantiations.

### 3. Procedural Audio Engine
- Built directly on the native Web Audio API with zero external asset dependencies.
- Generates dynamic square/sine oscillator tones with fast exponential decay curves for crisp, nostalgic arcade feedback.

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/lumidren/crystal-collector.git
   cd crystal-collector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
crystal-collector/
├── README.md               # Project documentation & overview
├── index.html              # HTML entrypoint
├── vite.config.js          # Vite build configuration
├── package.json            # Project manifest and dependencies
└── src/
    ├── main.jsx            # React root mounting
    ├── index.css           # Global reset and viewport styling
    ├── App.css             # Component layout styles
    ├── App.jsx             # Main 3D Game component (Three.js + React UI)
    └── assets/             # Static game assets & icons
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Created with ✨ by [Lumidren](https://github.com/lumidren)**

</div>
