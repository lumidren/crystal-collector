# crystal-collector
A fast-paced 3D arcade game built with React and Three.js. Navigate 4 challenging levels, manage stamina, and collect crystals while dodging deadly obstacles in a fully interactive 3D environment.
# 💎 Crystal Collector 3D

Welcome to **Crystal Collector**, a 3D platforming adventure! This project demonstrates how to combine the power of **Three.js** (for 3D graphics) with **React** (for game state and UI).

---

## 🕹️ Controls
| Action | Key |
| :--- | :--- |
| **Move** | `W` `A` `S` `D` |
| **Sprint** | Hold `Shift` (Uses Stamina ⚡) |
| **Jump** | `Spacebar` |
| **Rotate Camera** | `Mouse Movement` |
| **Zoom** | `Mouse Wheel` |

---

## 🚀 How to Run It Locally
1. **Clone the project**: 
   `git clone https://github.com/YOUR_USERNAME/crystal-collector.git`
2. **Go into the folder**: 
   `cd crystal-collector`
3. **Install the tools**: 
   `npm install`
4. **Start the game**: 
   `npm run dev`

---

## 🏗️ How it Works (Under the Hood)

### 1. The 3D Engine (Three.js)
The game uses a `Scene`, a `PerspectiveCamera`, and a `WebGLRenderer`. 
- **Lighting**: Uses `AmbientLight` for visibility and `DirectionalLight` with shadows for realism.
- **Geometry**: The crystals are `Octahedrons`, and the player is a `Group` of a cylinder and a sphere.

### 2. The Game Loop (The Heartbeat)
The `animate()` function runs at **60 frames per second**. It calculates:
- **Gravity**: A constant force pulling the player down during jumps.
- **Collision Detection**: Uses math to check the distance between the player and items. If `distance < 2`, the item is collected.
- **Obstacle AI**: Each red box has a `velocity` and a timer that tells it when to change direction.

### 3. The React State (The Brain)
React handles everything you see on the screen that isn't 3D:
- **Health System**: Tracks `hearts` and triggers the Game Over screen.
- **Stamina System**: A dynamic energy bar that drains when sprinting and refills over time.
- **Level Scaling**: As you progress, the code automatically increases speed and enemy counts using a configuration object.

---

## 🌟 Features
- **4 Unique Levels**: Including the final "HELL'S GAUNTLET" with red fog.
- **Dynamic HUD**: Real-time bars for stamina and health.
- **3D Physics**: Bouncing movement, jumping, and momentum.
- **Memory Cleanup**: Automatically disposes of 3D objects to keep your computer fast.

To run the game:
- https://3dcrystalcollector.netlify.app/

**Created with ✨ by Lumidren**
