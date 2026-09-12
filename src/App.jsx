import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadGameState, saveGameState, resetGameState } from './game/saveManager.js';
import { soundEngine } from './audio/soundEngine.js';
import { ParticleManager } from './game/particles.js';
import { BiomeGenerator } from './world/biomeGenerator.js';
import { CrystalTitanBoss } from './game/boss.js';
import { PetCompanion } from './game/pets.js';
import { CyberRunner, CHARACTER_ROSTER } from './game/character.js';
import { createCyberCreature } from './game/creatures.js';
import { HomeScreen } from './components/HomeScreen.jsx';
import { LevelSelectModal } from './components/LevelSelectModal.jsx';
import { HowToPlayModal } from './components/HowToPlayModal.jsx';
import { InGameHUD } from './components/InGameHUD.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { FieldManualModal } from './components/FieldManualModal.jsx';
import { ScoreboardModal } from './components/ScoreboardModal.jsx';
import { AboutModal } from './components/AboutModal.jsx';
import './App.css';

const levelConfigs = [
  { crystals: 8, coins: 15, obs: 20, speed: 7, hearts: 4 },
  { crystals: 10, coins: 20, obs: 24, speed: 8, hearts: 5 },
  { crystals: 12, coins: 25, obs: 28, speed: 9, hearts: 5 },
  { crystals: 15, coins: 30, obs: 32, speed: 10, hearts: 6 },
  { crystals: 18, coins: 35, obs: 36, speed: 11, hearts: 6 },
  { crystals: 20, coins: 40, obs: 40, speed: 12, hearts: 7 },
  { crystals: 22, coins: 45, obs: 46, speed: 13, hearts: 7 },
  { crystals: 25, coins: 50, obs: 52, speed: 14, hearts: 8 },
  { crystals: 28, coins: 55, obs: 58, speed: 15, hearts: 8 },
  { crystals: 30, coins: 60, obs: 36, speed: 12, hearts: 8 } // Titan Guardian Boss Level!
];

// --- 3D HIGH-TECH COLLECTIBLE BUILDERS ---

function createCrystalCluster(isRainbow, isGirlsTheme = false) {
  const group = new THREE.Group();

  const crystalColor = isRainbow ? 0xff00ff : isGirlsTheme ? 0xff70a6 : 0x00f0ff;
  const crystalEmissive = isRainbow ? 0xff00bb : isGirlsTheme ? 0xff2a85 : 0x00aacc;

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: crystalColor,
    emissive: crystalEmissive,
    emissiveIntensity: isGirlsTheme ? 0.95 : 0.85,
    roughness: 0.08,
    metalness: isGirlsTheme ? 0.1 : 0.15,
    transmission: 0.72,
    transparent: true,
    opacity: 0.94,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08
  });

  // Main double-ended hexagonal crystal spire
  const spireBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 6), crystalMat);
  const spireTop = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 6), crystalMat);
  spireTop.position.y = 0.9;
  const spireBot = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 6), crystalMat);
  spireBot.position.y = -0.9;
  spireBot.rotation.x = Math.PI;

  group.add(spireBody);
  group.add(spireTop);
  group.add(spireBot);

  // Satellite smaller side crystals
  const shard1 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.7, 5), crystalMat);
  shard1.position.set(0.48, -0.2, 0.2);
  shard1.rotation.set(0.3, 0.2, -0.4);
  const shard2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 5), crystalMat);
  shard2.position.set(-0.45, -0.3, -0.2);
  shard2.rotation.set(-0.2, 0.4, 0.5);
  group.add(shard1);
  group.add(shard2);

  // Inner floating luminous core
  const innerCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32),
    new THREE.MeshBasicMaterial({ color: isRainbow ? 0xffffff : isGirlsTheme ? 0xfff0f6 : 0xccffff })
  );
  group.add(innerCore);

  // Floating tilted orbital energy ring
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.025, 8, 24),
    new THREE.MeshBasicMaterial({ color: isRainbow ? 0xff88ff : isGirlsTheme ? 0xffd1dc : 0x88ffff })
  );
  haloRing.rotation.x = Math.PI / 4;
  group.add(haloRing);

  group.userData = { innerCore, haloRing, rainbowMat: isRainbow ? crystalMat : null };
  return group;
}

function createCyberCoin(isGirlsTheme = false) {
  const group = new THREE.Group();

  // Beveled outer coin rim with notched arcade edge (Strawberry Gold in Girls Theme)
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.14, 28),
    new THREE.MeshStandardMaterial({
      color: isGirlsTheme ? 0xffa0bc : 0xffd700,
      emissive: isGirlsTheme ? 0xff6b8b : 0xff8800,
      emissiveIntensity: isGirlsTheme ? 0.5 : 0.35,
      metalness: isGirlsTheme ? 0.85 : 0.95,
      roughness: 0.14
    })
  );
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // Embossed crystal star emblem in center
  const star = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.26),
    new THREE.MeshStandardMaterial({
      color: 0xffea00,
      emissive: isGirlsTheme ? 0xff88aa : 0xffaa00,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    })
  );
  group.add(star);

  // Glowing neon groove ring
  const groove = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.03, 8, 24),
    new THREE.MeshBasicMaterial({ color: isGirlsTheme ? 0xffc2d1 : 0xfffa66 })
  );
  group.add(groove);

  group.userData = { star, groove };
  return group;
}

function createCyberHeart(isGirlsTheme = false) {
  const group = new THREE.Group();

  const heartMat = new THREE.MeshPhysicalMaterial({
    color: isGirlsTheme ? 0xff69b4 : 0xff0044,
    emissive: isGirlsTheme ? 0xff1493 : 0xcc0033,
    emissiveIntensity: isGirlsTheme ? 0.8 : 0.6,
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 0.8
  });

  // Left & Right curved upper lobes
  const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), heartMat);
  leftLobe.position.set(-0.22, 0.2, 0);
  const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), heartMat);
  rightLobe.position.set(0.22, 0.2, 0);

  // Inverted lower cone forming the tapered bottom point
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.75, 16), heartMat);
  tip.position.set(0, -0.15, 0);
  tip.rotation.z = Math.PI;

  group.add(leftLobe);
  group.add(rightLobe);
  group.add(tip);

  if (isGirlsTheme) {
    // Sparkling diamond star center
    const starCenter = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    starCenter.position.set(0, 0.08, 0.26);
    group.add(starCenter);
  } else {
    // Glowing medical cross emblem on front
    const crossV = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.32, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    crossV.position.set(0, 0.05, 0.28);
    const crossH = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.1, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    crossH.position.set(0, 0.05, 0.28);
    group.add(crossV);
    group.add(crossH);
  }

  return group;
}

function createPowerupRelic(type) {
  const group = new THREE.Group();

  if (type === 'shield') {
    // Aegis Energy Buckler (Hexagonal translucent shield)
    const shieldPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.1, 6),
      new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088cc,
        emissiveIntensity: 0.7,
        transmission: 0.65,
        transparent: true,
        opacity: 0.88,
        roughness: 0.1
      })
    );
    shieldPlate.rotation.x = Math.PI / 2;
    group.add(shieldPlate);

    const shieldCrest = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(shieldCrest);
  } else if (type === 'magnet') {
    // Graviton Horseshoe Magnet
    const uArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.14, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.8, roughness: 0.3 })
    );
    group.add(uArch);

    // North (Red) and South (Cyan/Blue) magnetic pole tips
    const poleN = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xaa0022, emissiveIntensity: 0.5 })
    );
    poleN.position.set(-0.45, -0.18, 0);
    const poleS = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044aa, emissiveIntensity: 0.5 })
    );
    poleS.position.set(0.45, -0.18, 0);
    group.add(poleN);
    group.add(poleS);
  } else {
    // Chrono Gyroscope
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.05, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.2 })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.85, roughness: 0.2 })
    );
    ring2.rotation.x = Math.PI / 2;
    const timeGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(ring1);
    group.add(ring2);
    group.add(timeGem);
    group.userData = { ring1, ring2 };
  }

  return group;
}

// --- 3D HIGH-TECH OBSTACLE BUILDERS ---

function createQuantumSentinelCube() {
  const group = new THREE.Group();

  // Dark obsidian exoskeleton armor box
  const armor = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.9, 1.9),
    new THREE.MeshStandardMaterial({
      color: 0x14141e,
      roughness: 0.3,
      metalness: 0.85
    })
  );
  group.add(armor);

  // 8 Corner Reinforcement Brackets with red glowing trim
  const cornerMat = new THREE.MeshStandardMaterial({
    color: 0x252535,
    emissive: 0xff0044,
    emissiveIntensity: 0.3,
    roughness: 0.4
  });
  [-0.9, 0.9].forEach(x => {
    [-0.9, 0.9].forEach(y => {
      [-0.9, 0.9].forEach(z => {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), cornerMat);
        bracket.position.set(x, y, z);
        group.add(bracket);
      });
    });
  });

  // Inner floating Magma Plasma Reactor Core
  const innerCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.88),
    new THREE.MeshStandardMaterial({
      color: 0xff0044,
      emissive: 0xff1100,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.2
    })
  );
  group.add(innerCore);

  // Glowing amber hazard chevron stripes on 4 sides
  const chevronMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const chevrons = [
    { pos: [0, 0, 0.96], rot: [0, 0, 0] },
    { pos: [0, 0, -0.96], rot: [0, Math.PI, 0] },
    { pos: [0.96, 0, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [-0.96, 0, 0], rot: [0, -Math.PI / 2, 0] }
  ];
  chevrons.forEach(c => {
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.02), chevronMat);
    ch.position.set(...c.pos);
    ch.rotation.set(...c.rot);
    group.add(ch);
  });

  // Anti-gravity repulsor emitter on bottom face
  const repulsor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.45, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x222533, metalness: 0.8, roughness: 0.2 })
  );
  repulsor.position.set(0, -0.96, 0);
  group.add(repulsor);

  const repulsorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0044 })
  );
  repulsorGlow.position.set(0, -1.01, 0);
  repulsorGlow.rotation.x = Math.PI / 2;
  group.add(repulsorGlow);

  group.userData = { innerCore };
  return group;
}

function createHunterInterceptorDrone() {
  const group = new THREE.Group();

  // Aerodynamic Stealth Fuselage
  const hull = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 1.8, 4),
    new THREE.MeshStandardMaterial({
      color: 0x1a0505,
      emissive: 0x330005,
      roughness: 0.35,
      metalness: 0.8
    })
  );
  hull.rotation.x = Math.PI / 2;
  group.add(hull);

  // Ocular Targeting Socket & Cyclops Eye
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0033 })
  );
  eye.position.set(0, 0.1, 0.9);
  group.add(eye);

  // Forward Laser Targeting Sight Beam
  const laserSight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.12, 2.5),
    new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.75 })
  );
  laserSight.position.set(0, 0.1, 2.15);
  laserSight.rotation.x = Math.PI / 2;
  group.add(laserSight);

  // Swept Predator Wings
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x2b0808,
    emissive: 0xff1100,
    emissiveIntensity: 0.4,
    metalness: 0.7
  });
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.6), wingMat);
  leftWing.position.set(-1.0, 0, -0.2);
  leftWing.rotation.y = 0.3;
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.6), wingMat);
  rightWing.position.set(1.0, 0, -0.2);
  rightWing.rotation.y = -0.3;
  group.add(leftWing);
  group.add(rightWing);

  // Dual Rear Ion Thrusters & Plasma Flames
  const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });

  [-0.35, 0.35].forEach((x, idx) => {
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.4, 12), thrusterMat);
    nozzle.position.set(x, 0, -0.9);
    nozzle.rotation.x = Math.PI / 2;
    group.add(nozzle);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.6, 12), flameMat);
    flame.position.set(x, 0, -1.35);
    flame.rotation.x = -Math.PI / 2;
    group.add(flame);
    if (idx === 0) group.userData.flame1 = flame;
    else group.userData.flame2 = flame;
  });

  group.userData.eye = eye;
  group.userData.laserSight = laserSight;
  group.userData.leftWing = leftWing;
  group.userData.rightWing = rightWing;

  return group;
}

function createAntiGravSkyMine() {
  const group = new THREE.Group();

  // Dark Naval Armor Core Sphere
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0x1c1508,
      emissive: 0x332200,
      roughness: 0.4,
      metalness: 0.85
    })
  );
  group.add(core);

  // 6 Magnetic Detonation Spires along ±X, ±Y, ±Z
  const spikeMat = new THREE.MeshStandardMaterial({
    color: 0x2b2210,
    emissive: 0xffaa00,
    emissiveIntensity: 0.6,
    metalness: 0.8
  });
  const dirs = [
    { pos: [0.95, 0, 0], rot: [0, 0, -Math.PI / 2] },
    { pos: [-0.95, 0, 0], rot: [0, 0, Math.PI / 2] },
    { pos: [0, 0.95, 0], rot: [0, 0, 0] },
    { pos: [0, -0.95, 0], rot: [Math.PI, 0, 0] },
    { pos: [0, 0, 0.95], rot: [Math.PI / 2, 0, 0] },
    { pos: [0, 0, -0.95], rot: [-Math.PI / 2, 0, 0] }
  ];
  dirs.forEach(d => {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 6), spikeMat);
    spike.position.set(...d.pos);
    spike.rotation.set(...d.rot);
    group.add(spike);
  });

  // Dual Counter-Rotating Gyroscopic Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.05, 8, 28),
    new THREE.MeshBasicMaterial({ color: 0xffaa00 })
  );
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.04, 8, 28),
    new THREE.MeshBasicMaterial({ color: 0xff7700 })
  );
  ring2.rotation.x = Math.PI / 2;
  group.add(ring1);
  group.add(ring2);

  // Flashing Danger Strobe Beacon on top
  const strobe = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffea00 })
  );
  strobe.position.set(0, 0.9, 0);
  group.add(strobe);

  group.userData = { ring1, ring2, strobe };
  return group;
}

const CrystalCollectorGame = () => {
  const mountRef = useRef(null);

  // Persistent user state: always start fresh as the first time whenever opening the application
  const [savedData, setSavedData] = useState(() => resetGameState());
  const savedDataRef = useRef(savedData);
  useEffect(() => {
    savedDataRef.current = savedData;
    saveGameState(savedData);
    soundEngine.setSettings(
      savedData.soundEnabled,
      savedData.musicEnabled,
      savedData.sfxVolume,
      savedData.musicVolume
    );
  }, [savedData]);

  // Session game state
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const cfg = levelConfigs[level - 1] || levelConfigs[0];
  const [hearts, setHearts] = useState(savedData.upgrades?.maxHearts || 3);
  const [stamina, setStamina] = useState(savedData.upgrades?.maxStamina || 100);
  const staminaRef = useRef(savedData.upgrades?.maxStamina || 100);

  const [combo, setCombo] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);

  // Active power-up timers
  const [shieldTime, setShieldTime] = useState(0);
  const [magnetTime, setMagnetTime] = useState(0);
  const [slowMoTime, setSlowMoTime] = useState(0);
  const [feverTime, setFeverTime] = useState(0);

  // Top-level screen & UI modal toggles
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'playing'
  const [showLevelStart, setShowLevelStart] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showFieldManual, setShowFieldManual] = useState(false);
  const [isFirstTimeManual, setIsFirstTimeManual] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [pylonsDeactivated, setPylonsDeactivated] = useState(0);
  const [bossPylons, setBossPylons] = useState([]);
  const [fps, setFps] = useState(60);

  // Combined frozen state: halts physics, obstacles, hazards, boss, and timers
  const isGameFrozen = isPaused || showFieldManual || showHowToPlay || showSettings || showShop || showAchievements || showLevelSelect || showAbout || showComplete || gameOver;
  const isGameFrozenRef = useRef(false);

  useEffect(() => {
    isGameFrozenRef.current = isGameFrozen;
    if (isGameFrozen && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [isGameFrozen]);

  // Speedrun timer, spawn grace immunity, and scoreboard tracking
  const [spawnGraceTime, setSpawnGraceTime] = useState(3.0);
  const spawnGraceRef = useRef(3.0);
  const [levelElapsedTime, setLevelElapsedTime] = useState(0);
  const levelElapsedRef = useRef(0);
  const [maxComboThisLevel, setMaxComboThisLevel] = useState(1);
  const maxComboRef = useRef(1);
  const [damageTakenThisLevel, setDamageTakenThisLevel] = useState(0);
  const damageTakenRef = useRef(0);
  const [shopTab, setShopTab] = useState('characters'); // 'characters', 'colors', 'hats', 'pets', 'trails', 'upgrades'
  const [isEndless, setIsEndless] = useState(false);
  const [endlessSurviveTime, setEndlessSurviveTime] = useState(0);

  // Catalogs
  const shopColors = [
    { name: 'Neon Green', color: '#00ff00', cost: 0 },
    { name: 'Electric Blue', color: '#0080ff', cost: 50 },
    { name: 'Crimson Red', color: '#ff0000', cost: 50 },
    { name: 'Mystic Purple', color: '#ff00ff', cost: 100 },
    { name: 'Radiant Gold', color: '#ffd700', cost: 150 }
  ];

  const shopHats = [
    { name: 'Baseball Cap', id: 'cap', cost: 0, icon: '🧢' },
    { name: 'Top Hat', id: 'tophat', cost: 100, icon: '🎩' },
    { name: 'Royal Crown', id: 'crown', cost: 150, icon: '👑' },
    { name: 'Santa Hat', id: 'santa', cost: 200, icon: '🎅' }
  ];

  const shopPets = [
    { name: 'Sugar Bunny', id: 'sugar_bunny', cost: 0, icon: '🐰', isSecret: true, desc: 'Enchanted fairy bunny with floppy ears, fluttering wings & 12m super-magnet reach!' },
    { name: 'Cyber Dog (Robo-Pup)', id: 'dog', cost: 280, icon: '🐕', desc: 'Trots on 4 paws, wags tail & huge 11m fetch reach!' },
    { name: 'Cyber Drone', id: 'drone', cost: 150, icon: '🛸', desc: 'Vacuums coins from 6m away' },
    { name: 'Magic Pixie', id: 'pixie', cost: 200, icon: '🧚', desc: 'Attracts crystals from 8m away' },
    { name: 'Cyber Falcon', id: 'falcon', cost: 220, icon: '🦅', desc: 'Avian scout with flapping wings & 9m reach' },
    { name: 'Fire Sprite', id: 'sprite', cost: 250, icon: '🔥', desc: 'Super magnet reach up to 10m' }
  ];

  const shopTrails = [
    { name: 'Flame Spark', id: 'fire', cost: 100, color: '#ff4500' },
    { name: 'Rainbow Stardust', id: 'rainbow', cost: 150, color: '#00ffff' },
    { name: 'Cyber Neon', id: 'cyber', cost: 200, color: '#bd00ff' }
  ];

  const achievementsList = [
    { id: 'first_crystal', name: 'First Steps', desc: 'Collect your first crystal', icon: '💎' },
    { id: 'level_1', name: 'Beginner', desc: 'Complete Level 1', icon: '🏆' },
    { id: 'level_5', name: 'Halfway There', desc: 'Complete Level 5', icon: '⭐' },
    { id: 'level_10', name: 'Champion', desc: 'Defeat the Crystal Titan (Level 10)', icon: '👑' },
    { id: 'coin_collector', name: 'Coin Collector', desc: 'Collect 100 coins', icon: '💰' },
    { id: 'fever_master', name: 'Fever Frenzy', desc: 'Trigger Prism Fever Mode', icon: '🌈' },
    { id: 'trampoline_ace', name: 'High Flyer', desc: 'Launch from a Jump Pad', icon: '🚀' }
  ];

  const unlockAchievement = (id) => {
    if (!savedData.achievements[id]) {
      setSavedData(prev => ({
        ...prev,
        achievements: { ...prev.achievements, [id]: true }
      }));
      soundEngine.playPowerup('fever');
    }
  };

  const buyItem = (type, item, cost) => {
    if (savedData.totalCoins < cost) return;

    setSavedData(prev => {
      const next = { ...prev, totalCoins: prev.totalCoins - cost };
      if (type === 'character') {
        next.ownedCharacters = [...(prev.ownedCharacters || ['cyber_runner']), item];
        next.currentCharacter = item;
      } else if (type === 'color') {
        next.ownedColors = [...prev.ownedColors, item];
        next.playerColor = item;
      } else if (type === 'hat') {
        next.ownedHats = [...prev.ownedHats, item];
        next.currentHat = item;
      } else if (type === 'pet') {
        next.ownedPets = [...prev.ownedPets, item];
        next.currentPet = item;
      } else if (type === 'trail') {
        next.ownedTrails = [...prev.ownedTrails, item];
        next.currentTrail = item;
      }
      return next;
    });
    soundEngine.playCoin();
  };

  const buyUpgrade = (upgradeKey, cost, increment) => {
    if (savedData.totalCoins < cost) return;

    setSavedData(prev => ({
      ...prev,
      totalCoins: prev.totalCoins - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeKey]: (prev.upgrades[upgradeKey] || 0) + increment
      }
    }));
    soundEngine.playPowerup('shield');
  };

  // Level flow handlers
  const startLevel = () => {
    // Show First-Time Guide automatically if never seen
    if (!savedData.hasSeenFirstTimeGuide && level === 1) {
      setShowFieldManual(true);
      setIsFirstTimeManual(true);
    }
    setShowLevelStart(false);
    setIsPaused(false);
    soundEngine.startBGM();

    // Reset level timers, hearts, and grant 3s spawn protection
    const activeHero = CHARACTER_ROSTER.find(c => c.id === (savedDataRef.current?.currentCharacter || 'cyber_runner'));
    const startingHearts = (savedDataRef.current?.upgrades?.maxHearts || 3) + (activeHero?.stats?.extraHearts || 0);
    setHearts(startingHearts);
    spawnGraceRef.current = 3.0;
    setSpawnGraceTime(3.0);
    levelElapsedRef.current = 0;
    setLevelElapsedTime(0);
    maxComboRef.current = 1;
    setMaxComboThisLevel(1);
    damageTakenRef.current = 0;
    setDamageTakenThisLevel(0);

    const isOpeningGuide = !savedData.hasSeenFirstTimeGuide && level === 1;
    if (mountRef.current && !isOpeningGuide) {
      const canvas = mountRef.current.querySelector('canvas');
      if (canvas && canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  };

  const returnToMainMenu = () => {
    setIsPaused(false);
    setGameOver(false);
    setShowComplete(false);
    setShowLevelStart(false);
    setCurrentScreen('home');
    soundEngine.stopBGM();
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  const onLevelComplete = () => {
    soundEngine.stopBGM();
    soundEngine.playPowerup('fever');
    const finalElapsed = levelElapsedRef.current;
    setSavedData(sd => {
      const prevBest = sd.levelBestTimes?.[level];
      const isNewBest = !prevBest || finalElapsed < prevBest;
      const updatedBest = { ...(sd.levelBestTimes || {}) };
      if (isNewBest) {
        updatedBest[level] = finalElapsed;
      }
      return {
        ...sd,
        levelBestTimes: updatedBest
      };
    });
    setShowComplete(true);
  };

  const nextLevel = () => {
    soundEngine.playPowerup('fever');
    setShowComplete(false);
    setShowLevelStart(true);
    setLevel(prev => {
      const nxt = prev + 1;
      setSavedData(sd => ({
        ...sd,
        unlockedLevels: Math.max(sd.unlockedLevels || 1, nxt)
      }));
      return nxt;
    });
    setScore(0);
    setCoins(0);
    setCombo(1);
    setPylonsDeactivated(0);
    const activeHeroNext = CHARACTER_ROSTER.find(c => c.id === (savedDataRef.current?.currentCharacter || 'cyber_runner'));
    const startHeartsNext = (savedDataRef.current?.upgrades?.maxHearts || 3) + (activeHeroNext?.stats?.extraHearts || 0);
    setHearts(prev => Math.max(prev, startHeartsNext));
    setShieldTime(0);
    setMagnetTime(0);
    setSlowMoTime(0);
    setFeverTime(0);
    spawnGraceRef.current = 3.0;
    setSpawnGraceTime(3.0);
    levelElapsedRef.current = 0;
    setLevelElapsedTime(0);
    maxComboRef.current = 1;
    setMaxComboThisLevel(1);
    damageTakenRef.current = 0;
    setDamageTakenThisLevel(0);
  };

  const retryCurrentLevel = () => {
    setGameOver(false);
    setShowComplete(false);
    setShowLevelStart(true);
    setScore(0);
    setCoins(0);
    setCombo(1);
    setPylonsDeactivated(0);
    const activeHeroRetry = CHARACTER_ROSTER.find(c => c.id === (savedDataRef.current?.currentCharacter || 'cyber_runner'));
    setHearts((savedDataRef.current?.upgrades?.maxHearts || 3) + (activeHeroRetry?.stats?.extraHearts || 0));
    const maxStam = savedDataRef.current.upgrades?.maxStamina || 100;
    setStamina(maxStam);
    staminaRef.current = maxStam;
    setShieldTime(0);
    setMagnetTime(0);
    setSlowMoTime(0);
    setFeverTime(0);
    spawnGraceRef.current = 3.0;
    setSpawnGraceTime(3.0);
    levelElapsedRef.current = 0;
    setLevelElapsedTime(0);
    maxComboRef.current = 1;
    setMaxComboThisLevel(1);
    damageTakenRef.current = 0;
    setDamageTakenThisLevel(0);
  };

  const restartGame = () => {
    setGameOver(false);
    setShowComplete(false);
    setShowLevelStart(true);
    setLevel(1);
    setScore(0);
    setCoins(0);
    setCombo(1);
    setPylonsDeactivated(0);
    const activeHeroRestart = CHARACTER_ROSTER.find(c => c.id === (savedDataRef.current?.currentCharacter || 'cyber_runner'));
    setHearts((savedDataRef.current?.upgrades?.maxHearts || 3) + (activeHeroRestart?.stats?.extraHearts || 0));
    const maxStam = savedDataRef.current.upgrades?.maxStamina || 100;
    setStamina(maxStam);
    staminaRef.current = maxStam;
    setShieldTime(0);
    setMagnetTime(0);
    setSlowMoTime(0);
    setFeverTime(0);
  };

  // --- Three.js Game World Effect ---
  useEffect(() => {
    if (!mountRef.current || showComplete || gameOver) return;

    const mountNode = mountRef.current;
    let scene, camera, renderer, player, petInstance, bossInstance;
    let crystals = [], coinObjs = [], obstacles = [], heartObjs = [], powerupObjs = [];
    let animId;
    let mounted = true;

    // Movement & physics
    let jumpVelocity = 0;
    let isGrounded = true;
    let canDoubleJump = false;
    let lastStamina = staminaRef.current;
    let localShieldTime = shieldTime;
    let localMagnetTime = magnetTime;
    let localSlowMoTime = slowMoTime;
    let localFeverTime = feverTime;
    let localCombo = combo;
    let localComboTimer = 0;
    let lavaCooldown = 0;

    const currentSaved = savedDataRef.current;
    const maxStamina = currentSaved.upgrades?.maxStamina || 100;
    const sprintSpeedMult = currentSaved.upgrades?.sprintMultiplier || 1.8;
    const baseMagnetRadius = currentSaved.upgrades?.magnetRadius || 0;

    // Scene & Camera
    scene = new THREE.Scene();
    const biomeEnv = BiomeGenerator.buildBiome(level, scene);
    const { biome, decorations, solidColliders, jumpPads, hazardZones, platforms } = biomeEnv;
    const isGirlsTheme = (currentSaved.activeTheme || 'default') === 'girls';

    if (isGirlsTheme) {
      scene.background = new THREE.Color(0x281028);
      scene.fog = new THREE.Fog(0x351433, 18, 80);
    } else {
      scene.background = new THREE.Color(biome.skyColor);
      if (biome.fog) {
        scene.fog = new THREE.Fog(biome.fog.color, biome.fog.near, biome.fog.far);
      }
    }

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const isUltra = (currentSaved.graphicsQuality || 'ultra') === 'ultra';
    const isHigh = (currentSaved.graphicsQuality || 'ultra') === 'high';
    const shadowsEnabled = isUltra || isHigh;

    renderer.shadowMap.enabled = shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountNode.appendChild(renderer.domElement);

    // Particle VFX Engine
    const particleManager = new ParticleManager(scene);

    // Dynamic Environmental Lighting (Ambient Fill + Hemisphere + Directional Soft Shadows)
    // Soft ambient fill light ensures all cast shadows remain light, luminous, and clearly visible underneath
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.62);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(biome.skyColor, 0x48586c, 0.85);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.10);
    dirLight.position.set(16, 26, 16);
    dirLight.castShadow = shadowsEnabled;
    dirLight.shadow.mapSize.width = isUltra ? 2048 : 1024;
    dirLight.shadow.mapSize.height = isUltra ? 2048 : 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 90;
    dirLight.shadow.camera.left = -42;
    dirLight.shadow.camera.right = 42;
    dirLight.shadow.camera.top = 42;
    dirLight.shadow.camera.bottom = -42;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // Ground Floor with PBR Texture (76x76 Arena)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 76),
      new THREE.MeshStandardMaterial({
        color: biome.groundColor,
        roughness: 0.75,
        metalness: 0.08
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(76, 38, 0x555555, 0x222222);
    grid.position.y = 0.01;
    scene.add(grid);

    // Boundary Walls (76x76 Arena with walls at +/- 38m)
    [[0, 2.5, -38], [0, 2.5, 38], [-38, 2.5, 0], [38, 2.5, 0]].forEach((pos, i) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(76, 5, 1),
        new THREE.MeshStandardMaterial({
          color: biome.wallColor,
          roughness: 0.7,
          metalness: 0.2
        })
      );
      wall.position.set(...pos);
      if (i > 1) wall.rotation.y = Math.PI / 2;
      wall.receiveShadow = true;
      scene.add(wall);
    });

    // Spawn Crystals (Ground and High-Altitude Sky Islands across 76x76 Arena)
    // Spawn Crystals (Ground and High-Altitude Sky Islands across 76x76 Arena)
    for (let i = 0; i < cfg.crystals; i++) {
      let posX, posY = 1.2, posZ;
      if (platforms && platforms.length > 0 && i < platforms.length) {
        const p = platforms[i];
        posX = p.x + (Math.random() - 0.5) * (p.width - 2.5);
        posY = p.topY + 1.2;
        posZ = p.z + (Math.random() - 0.5) * (p.depth - 2.5);
      } else {
        const angle = (i / cfg.crystals) * Math.PI * 2;
        const r = 10 + Math.random() * 22;
        posX = Math.cos(angle) * r;
        posZ = Math.sin(angle) * r;
      }
      const isRainbow = Math.random() < 0.15; // 15% chance for Rainbow Fever Crystal!

      const crystalGroup = createCrystalCluster(isRainbow, isGirlsTheme);
      crystalGroup.position.set(posX, posY, posZ);
      crystalGroup.castShadow = true;
      scene.add(crystalGroup);
      crystals.push({ mesh: crystalGroup, collected: false, isRainbow, startY: posY, phase: i * 0.8 });
    }

    // Spawn Coins (Ground and Elevated Sky Decks across 76x76 Arena)
    for (let i = 0; i < cfg.coins; i++) {
      let cX, cY = 1, cZ;
      if (platforms && platforms.length > 0 && i < platforms.length * 2) {
        const p = platforms[i % platforms.length];
        cX = p.x + (Math.random() - 0.5) * (p.width - 2);
        cY = p.topY + 1;
        cZ = p.z + (Math.random() - 0.5) * (p.depth - 2);
      } else {
        cX = (Math.random() - 0.5) * 64;
        cZ = (Math.random() - 0.5) * 64;
      }
      const coinGroup = createCyberCoin(isGirlsTheme);
      coinGroup.position.set(cX, cY, cZ);
      coinGroup.castShadow = true;
      scene.add(coinGroup);
      coinObjs.push({ mesh: coinGroup, collected: false, startY: cY, phase: i * 0.4 });
    }

    // Spawn Health Hearts (Distributed across wider arena)
    for (let i = 0; i < cfg.hearts; i++) {
      const heartGroup = createCyberHeart(isGirlsTheme);
      const angle = (i / cfg.hearts) * Math.PI * 2 + Math.PI / 4;
      const r = 16 + Math.random() * 14;
      heartGroup.position.set(Math.cos(angle) * r, 1.2, Math.sin(angle) * r);
      scene.add(heartGroup);
      heartObjs.push({ mesh: heartGroup, collected: false, startY: 1.2, phase: i });
    }

    // Spawn Powerups (Shield 🛡️, Magnet 🧲, Chrono Slow-Mo ⏳)
    const powerTypes = ['shield', 'magnet', 'slowmo'];
    powerTypes.forEach((type, idx) => {
      const pGroup = createPowerupRelic(type);
      const angle = (idx / 3) * Math.PI * 2 + 1.0;
      const r = 18 + Math.random() * 12;
      pGroup.position.set(Math.cos(angle) * r, 1.4, Math.sin(angle) * r);
      scene.add(pGroup);
      powerupObjs.push({ mesh: pGroup, type, collected: false, startY: 1.4, phase: idx * 2 });
    });

    // Spawn Obstacles (Quantum Sentinel Cubes, Cyber Stalker Creatures & Anti-Grav Sky Mines)
    const currentDiff = currentSaved.difficulty || 'medium';
    const isEasy = currentDiff === 'easy';
    const isMedium = currentDiff === 'medium';
    // Easy: No spiders, more cubes (+25% cubes, 70% speed)
    // Medium: A little bit of spiders (~16% spiders) and more cubes (+15% cubes, 85% speed)
    // Hard: Challenging density (~33% spiders, 100% cubes, 105% speed)
    const obsCount = isEasy
      ? Math.max(6, Math.round(cfg.obs * 1.25))
      : (isMedium ? Math.max(5, Math.round(cfg.obs * 1.15)) : cfg.obs);
    const obsBaseSpeed = isEasy
      ? cfg.speed * 0.70
      : (isMedium ? cfg.speed * 0.85 : cfg.speed * 1.05);

    for (let i = 0; i < obsCount; i++) {
      // Easy: NO spiders (0% spiders, 100% cubes)
      // Medium: a little bit of spiders (i % 6 === 0)
      // Hard: ~35% spiders (i % 3 === 0)
      const isCreature = isEasy ? false : (isMedium ? (i % 6 === 0) : (i % 3 === 0));
      let obsMesh;
      if (isCreature) {
        obsMesh = createCyberCreature();
      } else {
        obsMesh = createQuantumSentinelCube();
      }

      const angle = (i / obsCount) * Math.PI * 2;
      const r = 8 + Math.random() * 26;
      const startY = isCreature ? 0 : 1.4;
      obsMesh.position.set(Math.cos(angle) * r, startY, Math.sin(angle) * r);
      obsMesh.castShadow = true;
      scene.add(obsMesh);

      obstacles.push({
        type: isCreature ? 'creature' : 'roaming',
        mesh: obsMesh,
        baseY: startY,
        phase: i * 0.75,
        velocity: {
          x: (Math.random() - 0.5) * obsBaseSpeed,
          z: (Math.random() - 0.5) * obsBaseSpeed
        },
        speed: obsBaseSpeed,
        cooldown: 0,
        state: 'patrol', // 'patrol' | 'windup' | 'lunge'
        stateTimer: 0,
        lungeDir: { x: 0, z: 0 },
        difficultyMode: currentDiff
      });
    }

    // Spawn Aerial Sky Patrol Mines on elevated platforms
    // Easy: No sky mines on platforms (peaceful platforming)
    // Medium: Sky mines on select wide platforms (width >= 14 or pIdx % 4 === 0) at 80% patrol speed
    // Hard: Sky mines densely placed on alternating platforms (pIdx % 2 === 0 or width >= 12) at full speed
    if (platforms && platforms.length > 0 && level < 10) {
      platforms.forEach((p, pIdx) => {
        const shouldSpawnMine = isEasy
          ? false
          : (isMedium ? (p.width >= 14 || pIdx % 4 === 0) : (pIdx % 2 === 0 || p.width >= 12));

        if (shouldSpawnMine) {
          const mineGroup = createAntiGravSkyMine();
          const startX = p.x;
          const startY = p.topY + 1.2;
          const startZ = p.z;
          mineGroup.position.set(startX, startY, startZ);
          mineGroup.castShadow = true;
          scene.add(mineGroup);

          const useX = p.width >= p.depth;
          const baseMineSpeed = 3.5 + (pIdx % 3);
          obstacles.push({
            type: 'skymine',
            mesh: mineGroup,
            baseY: startY,
            axis: useX ? 'x' : 'z',
            min: useX ? p.minX + 1.2 : p.minZ + 1.2,
            max: useX ? p.maxX - 1.2 : p.maxZ - 1.2,
            speed: isMedium ? baseMineSpeed * 0.8 : baseMineSpeed,
            dir: 1,
            phase: pIdx * 1.5,
            cooldown: 0,
            platformTopY: p.topY
          });
        }
      });
    }

    // Boss Titan on Level 10
    if (level === 10) {
      bossInstance = new CrystalTitanBoss(scene);
      setBossPylons(bossInstance.pylons.map(p => ({ id: p.id, name: p.name, activated: false })));
      setPylonsDeactivated(0);
    }

    // Player Character (Next-Gen 3D Hero Exosuit)
    const activeHero = CHARACTER_ROSTER.find(c => c.id === (currentSaved.currentCharacter || 'cyber_runner')) || CHARACTER_ROSTER[0];
    const playerCharacter = new CyberRunner(currentSaved, scene);
    player = playerCharacter.group;

    // Shield Forcefield Mesh
    const shieldMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 24, 24),
      new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.25,
        emissive: 0x0088ff,
        side: THREE.DoubleSide
      })
    );
    shieldMesh.position.y = 1.5;
    shieldMesh.visible = false;
    player.add(shieldMesh);

    player.position.set(0, 0, 8);
    scene.add(player);

    // Pet Companion Follower
    if (currentSaved.currentPet) {
      petInstance = new PetCompanion(currentSaved.currentPet, scene);
    }

    // Input Controls & Pointer Lock
    const keys = {};
    let mouseX = 0, camDist = 8;
    let pointerLocked = false;

    const onCanvasClick = () => {
      if (currentScreen !== 'playing' || showLevelStart || isGameFrozenRef.current) return;
      if (!pointerLocked && renderer.domElement.requestPointerLock) {
        renderer.domElement.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      pointerLocked = document.pointerLockElement === renderer.domElement;
    };

    renderer.domElement.style.cursor = 'pointer';
    renderer.domElement.addEventListener('click', onCanvasClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    const onKeyDown = (e) => {
      if (currentScreen !== 'playing' || showLevelStart) {
        if (e.key === 'Escape') {
          if (showLevelSelect) setShowLevelSelect(false);
          if (showHowToPlay) setShowHowToPlay(false);
          if (showFieldManual) {
            setShowFieldManual(false);
            setIsFirstTimeManual(false);
            setSavedData(prev => ({ ...prev, hasSeenFirstTimeGuide: true }));
          }
          if (showSettings) setShowSettings(false);
          if (showShop) setShowShop(false);
          if (showAchievements) setShowAchievements(false);
        }
        return;
      }

      // If game is frozen (instructions, menus, or paused), Escape closes the modal or unpauses
      if (isGameFrozenRef.current) {
        if (e.key === 'Escape') {
          if (showAbout) {
            setShowAbout(false);
          } else if (showFieldManual) {
            setShowFieldManual(false);
            setIsFirstTimeManual(false);
            setSavedData(prev => ({ ...prev, hasSeenFirstTimeGuide: true }));
          } else if (showHowToPlay) {
            setShowHowToPlay(false);
          } else if (showSettings) {
            setShowSettings(false);
          } else if (showShop) {
            setShowShop(false);
          } else if (showAchievements) {
            setShowAchievements(false);
          } else if (showLevelSelect) {
            setShowLevelSelect(false);
          } else if (isPaused) {
            setIsPaused(false);
          }
        }
        return;
      }

      keys[e.key.toLowerCase()] = true;
      if (e.code) keys[e.code.toLowerCase()] = true;

      // Pause toggle
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (!gameOver && !showComplete) {
          setIsPaused(prev => !prev);
        }
      }

      // Jump & Double Jump
      if (e.key === ' ') {
        const jumpBoost = activeHero?.stats?.jumpBonus || 0;
        if (isGrounded) {
          jumpVelocity = 12 + jumpBoost;
          isGrounded = false;
          canDoubleJump = true;
          soundEngine.playJump();
        } else if (canDoubleJump) {
          jumpVelocity = 13 + jumpBoost;
          canDoubleJump = false;
          soundEngine.playDoubleJump();
          particleManager.createDust(player.position, 0x00ffff);
          particleManager.createFloatingText(player.position, 'DOUBLE JUMP! 🪶', '#00ffff', 36);
        }
      }
    };

    const onKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
      if (e.code) keys[e.code.toLowerCase()] = false;
    };

    const onBlur = () => {
      for (const k in keys) keys[k] = false;
    };

    const onMouse = (e) => {
      if (pointerLocked) {
        const sens = currentSaved.sensitivity || 0.003;
        mouseX -= e.movementX * sens;
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      camDist = Math.max(3, Math.min(15, camDist + e.deltaY * 0.01));
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouse);
    document.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('blur', onBlur);

    const clock = new THREE.Clock();
    let idleAngle = 0;
    let frameCount = 0;
    let fpsTimer = 0;

    // Damage handler
    const handlePlayerDamage = () => {
      if (localShieldTime > 0 || localFeverTime > 0 || spawnGraceRef.current > 0) return;

      damageTakenRef.current += 1;
      setDamageTakenThisLevel(damageTakenRef.current);

      soundEngine.playHurt();
      particleManager.addTrauma(0.5);
      particleManager.createBurst(player.position, 0xff0000, 20, 7);

      setHearts(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => {
            soundEngine.stopBGM();
            setGameOver(true);
          }, 100);
        }
        return next;
      });
    };

    // --- Main Game Animation Loop ---
    const animate = () => {
      if (!mounted) return;
      animId = requestAnimationFrame(animate);

      try {
        const dt = Math.min(clock.getDelta(), 0.033);
        const t = clock.getElapsedTime();

        // Home Screen or Level Start Idle 3D orbit
        if (currentScreen === 'home' || showLevelStart) {
          idleAngle += dt * 0.22;
          camera.position.x = Math.sin(idleAngle) * 20;
          camera.position.z = Math.cos(idleAngle) * 20;
          camera.position.y = 9;
          camera.lookAt(0, 1.5, 0);

          crystals.forEach(c => {
            if (c.mesh) {
              c.mesh.rotation.y += dt * 1.5;
              if (c.mesh.userData?.innerCore) c.mesh.userData.innerCore.rotation.y -= dt * 2.5;
            }
          });
          coinObjs.forEach(cn => {
            if (cn.mesh) {
              cn.mesh.rotation.y += dt * 2.5;
              cn.mesh.rotation.x = Math.sin(t * 2.5 + (cn.phase || 0)) * 0.2;
            }
          });

          particleManager.update(dt);
          renderer.render(scene, camera);
          return;
        }

        // If game is frozen (reading instructions/field manual, in menus, or paused), freeze all gameplay and render stationary scene
        if (isGameFrozenRef.current) {
          renderer.render(scene, camera);
          return;
        }

      // Performance Monitor (60 FPS tracker)
      frameCount++;
      fpsTimer += dt;
      if (fpsTimer >= 0.5) {
        setFps(Math.round(frameCount / fpsTimer));
        frameCount = 0;
        fpsTimer = 0;
      }

      // Countdown Spawn Grace Invulnerability
      if (spawnGraceRef.current > 0) {
        spawnGraceRef.current = Math.max(0, spawnGraceRef.current - dt);
        setSpawnGraceTime(spawnGraceRef.current);
        shieldMesh.visible = true;
        shieldMesh.rotation.y += dt * 3;
      }

      // Live Speedrun Stopwatch
      if (currentScreen === 'playing' && !showLevelStart && !isGameFrozenRef.current) {
        levelElapsedRef.current += dt;
        setLevelElapsedTime(levelElapsedRef.current);
      }

      // Update Celestial Starfield & Biome Weather Particles
      BiomeGenerator.updateEnvironment(dt, biomeEnv);

      // Power-up timer countdowns
      if (localShieldTime > 0) {
        localShieldTime = Math.max(0, localShieldTime - dt);
        setShieldTime(localShieldTime);
        shieldMesh.visible = true;
        shieldMesh.rotation.y += dt * 2;
      } else {
        shieldMesh.visible = false;
      }

      if (localMagnetTime > 0) {
        localMagnetTime = Math.max(0, localMagnetTime - dt);
        setMagnetTime(localMagnetTime);
      }

      if (localSlowMoTime > 0) {
        localSlowMoTime = Math.max(0, localSlowMoTime - dt);
        setSlowMoTime(localSlowMoTime);
      }

      if (localFeverTime > 0) {
        localFeverTime = Math.max(0, localFeverTime - dt);
        setFeverTime(localFeverTime);
        soundEngine.setFever(true);
      } else {
        soundEngine.setFever(false);
      }

      // Combo expiration timer
      if (localComboTimer > 0) {
        localComboTimer -= dt;
        if (localComboTimer <= 0) {
          localCombo = 1;
          setCombo(1);
        }
      }

      // Movement vectors
      let moveForward = 0;
      let moveRight = 0;

      const isW = keys['w'] || keys['keyw'];
      const isS = keys['s'] || keys['keys'];
      const isA = keys['a'] || keys['keya'];
      const isD = keys['d'] || keys['keyd'];

      if (isW) moveForward += 1;
      if (isS) moveForward -= 1;
      if (isD) moveRight += 1;
      if (isA) moveRight -= 1;

      const moving = moveForward !== 0 || moveRight !== 0;
      const isShift = keys['shift'] || keys['shiftleft'] || keys['shiftright'];
      const isSprinting = isShift && moving;

      // Stamina system
      if (isSprinting && staminaRef.current > 5 && localFeverTime <= 0) {
        staminaRef.current = Math.max(0, staminaRef.current - dt * 25);
      } else if (localFeverTime > 0) {
        staminaRef.current = maxStamina; // Infinite stamina in Fever Mode!
      } else {
        staminaRef.current = Math.min(maxStamina, staminaRef.current + dt * 15);
      }

      const roundedStam = Math.round(staminaRef.current);
      if (roundedStam !== lastStamina) {
        lastStamina = roundedStam;
        setStamina(roundedStam);
      }

      const canSprint = staminaRef.current > 5 || localFeverTime > 0;
      const moveSpeed = 8 * dt * (isSprinting && canSprint ? sprintSpeedMult : 1) * (activeHero?.stats?.speedMultiplier || 1.0);

      let mx = 0, mz = 0;
      if (moving) {
        const len = Math.hypot(moveForward, moveRight);
        const normF = moveForward / len;
        const normR = moveRight / len;

        mx = (-Math.sin(mouseX) * normF + Math.cos(mouseX) * normR) * moveSpeed;
        mz = (-Math.cos(mouseX) * normF - Math.sin(mouseX) * normR) * moveSpeed;

        // Footstep dust & trails
        if (Math.random() < 0.25) {
          particleManager.createDust(player.position, currentSaved.currentTrail === 'fire' ? 0xff4500 : 0xcccccc);
        }
      }

      player.position.x = Math.max(-36, Math.min(36, player.position.x + mx));
      player.position.z = Math.max(-36, Math.min(36, player.position.z + mz));

      // Physical Solid Collision Resolution (Trees, Rocks, Biome Pillars) - User cannot pass through them
      if (solidColliders && solidColliders.length > 0) {
        const playerRadius = 0.65;
        for (const col of solidColliders) {
          if (player.position.y < (col.height || 4.5)) {
            const dx = player.position.x - col.x;
            const dz = player.position.z - col.z;
            const dist = Math.hypot(dx, dz);
            const minDist = (col.radius || 1.2) + playerRadius;
            if (dist < minDist && dist > 0.0001) {
              const push = minDist - dist;
              player.position.x += (dx / dist) * push;
              player.position.z += (dz / dist) * push;
            }
          }
        }
      }

      // Multi-Tier Sky Platform & Ground Floor Detection
      let currentFloorY = 0;
      if (platforms && platforms.length > 0) {
        for (const p of platforms) {
          if (
            player.position.x >= p.minX && player.position.x <= p.maxX &&
            player.position.z >= p.minZ && player.position.z <= p.maxZ
          ) {
            // Check if player is on or above this platform surface
            if (player.position.y >= p.topY - 0.6) {
              if (p.topY > currentFloorY) {
                currentFloorY = p.topY;
              }
            }
          }
        }
      }

      // If walking off an elevated platform ledge into air, initiate falling
      if (isGrounded && player.position.y > currentFloorY + 0.15) {
        isGrounded = false;
        jumpVelocity = 0;
      }

      // Jump & Gravity physics
      if (!isGrounded) {
        const isGliding = activeHero?.stats?.airGlide && (keys[' '] || keys['space']) && jumpVelocity < 0;
        const currentGravity = isGliding ? 14 : 35;
        jumpVelocity -= currentGravity * dt;
        player.position.y += jumpVelocity * dt;
        if (player.position.y <= currentFloorY) {
          player.position.y = currentFloorY;
          jumpVelocity = 0;
          isGrounded = true;
          canDoubleJump = false;
        }
      }

      // Check Jump Pads (Trampolines - Launch high to reach Sky Islands!)
      jumpPads.forEach(pad => {
        const d = Math.hypot(player.position.x - pad.x, player.position.z - pad.z);
        if (d < pad.radius && (isGrounded || Math.abs(player.position.y - pad.group.position.y) < 1.5)) {
          jumpVelocity = 28; // High altitude super launch!
          isGrounded = false;
          canDoubleJump = true;
          soundEngine.playJumpPad();
          particleManager.addTrauma(0.3);
          particleManager.createBurst(pad.group.position, 0xffd700, 25, 10);
          particleManager.createFloatingText(player.position, 'SKY LAUNCH! 🚀', '#ffd700', 44);
          unlockAchievement('trampoline_ace');
        }
      });

      // Check Lava Hazard Pools (only hurts if near ground level)
      if (hazardZones.length > 0 && isGrounded && player.position.y < 1.0) {
        lavaCooldown -= dt;
        hazardZones.forEach(lava => {
          const d = Math.hypot(player.position.x - lava.x, player.position.z - lava.z);
          if (d < lava.radius && lavaCooldown <= 0) {
            if (spawnGraceRef.current > 0) return; // 100% immune during spawn grace period!
            lavaCooldown = 1.0;
            handlePlayerDamage();
            particleManager.createFloatingText(player.position, 'LAVA BURN! 🔥', '#ff3300', 36);
          }
        });
      }

      // Update CyberRunner Character Animations (run, sprint lean, jump pose, thruster VFX)
      if (playerCharacter) {
        playerCharacter.update(dt, t, {
          isMoving: moving,
          isSprinting: isSprinting && canSprint,
          isGrounded,
          mx,
          mz,
          feverTime: localFeverTime,
          particleManager
        });
      }

      // Update Pet Companion Follower
      if (petInstance) {
        petInstance.update(dt, t, player.position);
      }

      // Camera Position + Screen Shake (Smooth 60fps Spring Interpolation)
      const shake = particleManager.getShakeOffset(dt);
      const targetCamX = player.position.x + Math.sin(mouseX) * camDist + shake.x;
      const targetCamY = player.position.y + 5.5 + shake.y;
      const targetCamZ = player.position.z + Math.cos(mouseX) * camDist + shake.z;
      const camLerpSpeed = Math.min(1, dt * 14);
      camera.position.x += (targetCamX - camera.position.x) * camLerpSpeed;
      camera.position.y += (targetCamY - camera.position.y) * camLerpSpeed;
      camera.position.z += (targetCamZ - camera.position.z) * camLerpSpeed;
      camera.lookAt(player.position.x, player.position.y + 1.8, player.position.z);
      camera.rotation.z += shake.rotZ;

      // Magnet reach calculation
      let effectiveMagnetRadius = baseMagnetRadius + (activeHero?.stats?.magnetBonus || 0);
      if (localMagnetTime > 0) effectiveMagnetRadius = 14.0;
      if (petInstance && petInstance.magnetReach > effectiveMagnetRadius) {
        effectiveMagnetRadius = petInstance.magnetReach;
      }

      // Collect Crystals
      crystals.forEach(c => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 2.2;
          if (c.mesh.userData?.innerCore) c.mesh.userData.innerCore.rotation.y -= dt * 3.5;
          if (c.mesh.userData?.haloRing) c.mesh.userData.haloRing.rotation.z += dt * 3.0;
          if (c.isRainbow && c.mesh.userData?.rainbowMat) {
            c.mesh.userData.rainbowMat.color.setHSL((t * 0.3) % 1, 0.95, 0.6);
            c.mesh.userData.rainbowMat.emissive.setHSL((t * 0.3) % 1, 0.95, 0.4);
          }

          // Magnet pull (must be within vertical range so ground player doesn't pull sky crystals)
          const distToPlayer = Math.hypot(c.mesh.position.x - player.position.x, c.mesh.position.z - player.position.z);
          const distY = Math.abs(c.mesh.position.y - (player.position.y + 1.2));
          if (effectiveMagnetRadius > 0 && distToPlayer < effectiveMagnetRadius && distY < 4.5) {
            c.mesh.position.x += (player.position.x - c.mesh.position.x) * dt * 8;
            c.mesh.position.z += (player.position.z - c.mesh.position.z) * dt * 8;
            c.mesh.position.y += ((player.position.y + 1.2) - c.mesh.position.y) * dt * 6;
          }

          if (distToPlayer < 2.0 && distY < 2.5) {
            c.collected = true;
            scene.remove(c.mesh);

            // Combo chaining
            localComboTimer = 2.5;
            localCombo = Math.min(8, localCombo + 1);
            if (localCombo > maxComboRef.current) {
              maxComboRef.current = localCombo;
              setMaxComboThisLevel(localCombo);
            }
            setCombo(localCombo);
            soundEngine.playCollect(localCombo);

            const crystalColor = isGirlsTheme ? (c.isRainbow ? 0xff00ff : 0xff69b4) : (c.isRainbow ? 0xff00ff : 0x00ffff);
            particleManager.createBurst(c.mesh.position, crystalColor, 20, 8);

            if (c.isRainbow) {
              localFeverTime = 6;
              setFeverTime(6);
              soundEngine.playPowerup('fever');
              particleManager.createFloatingText(c.mesh.position, 'FEVER MODE! 🌈', '#ff00ff', 44);
              unlockAchievement('fever_master');
            } else {
              const pointsText = localCombo > 1
                ? (isGirlsTheme ? `+1 💖 (${localCombo}x)` : `+1 💎 (${localCombo}x)`)
                : (isGirlsTheme ? '+1 💖' : '+1 💎');
              particleManager.createFloatingText(c.mesh.position, pointsText, isGirlsTheme ? '#ff70a6' : '#00ffff');
            }

            setScore(prev => {
              const newScore = prev + 1;
              if (newScore === 1) unlockAchievement('first_crystal');
              if (newScore === cfg.crystals && level < 10) {
                setTimeout(() => {
                  onLevelComplete();
                  if (level === 1) unlockAchievement('level_1');
                  if (level === 5) unlockAchievement('level_5');
                }, 100);
              }
              return newScore;
            });
          }
        }
      });

      // Collect Coins
      coinObjs.forEach(cn => {
        if (!cn.collected) {
          cn.mesh.rotation.y += dt * 3.6;
          cn.mesh.rotation.x = Math.sin(t * 3.5 + (cn.phase || 0)) * 0.25;

          const distToPlayer = Math.hypot(cn.mesh.position.x - player.position.x, cn.mesh.position.z - player.position.z);
          const distY = Math.abs(cn.mesh.position.y - (player.position.y + 1.0));
          if (effectiveMagnetRadius > 0 && distToPlayer < effectiveMagnetRadius && distY < 4.5) {
            cn.mesh.position.x += (player.position.x - cn.mesh.position.x) * dt * 9;
            cn.mesh.position.z += (player.position.z - cn.mesh.position.z) * dt * 9;
            cn.mesh.position.y += ((player.position.y + 1.0) - cn.mesh.position.y) * dt * 6;
          }

          if (distToPlayer < 1.6 && distY < 2.2) {
            cn.collected = true;
            scene.remove(cn.mesh);
            soundEngine.playCoin();
            particleManager.createBurst(cn.mesh.position, isGirlsTheme ? 0xffa0bc : 0xffd700, 12, 6);
            particleManager.createFloatingText(cn.mesh.position, isGirlsTheme ? '+1 🍓' : '+1 🪙', isGirlsTheme ? '#ff70a6' : '#ffd700');

            setCoins(prev => prev + 1);
            setSavedData(prev => {
              const nextTotal = prev.totalCoins + 1;
              if (nextTotal >= 100) unlockAchievement('coin_collector');
              return { ...prev, totalCoins: nextTotal };
            });
          }
        }
      });

      // Collect Hearts & Respawn (Uncapped collection: gain as many hearts as you want!)
      heartObjs.forEach(h => {
        if (!h.collected) {
          h.mesh.rotation.y += dt * 2.2;
          const hPulse = 1.0 + (Math.sin(t * 7) > 0.45 ? 0.16 : 0.0) + Math.sin(t * 3.5) * 0.04;
          h.mesh.scale.set(hPulse, hPulse, hPulse);

          const distToPlayer = Math.hypot(h.mesh.position.x - player.position.x, h.mesh.position.z - player.position.z);
          const distY = Math.abs(h.mesh.position.y - (player.position.y + 1.0));
          if (distToPlayer < 1.6 && distY < 2.2) {
            h.collected = true;
            h.respawnTimer = 35.0; // Automatically respawns after 35 seconds
            scene.remove(h.mesh);
            soundEngine.playPowerup('shield');
            particleManager.createBurst(h.mesh.position, isGirlsTheme ? 0xff69b4 : 0xff0033, 16, 6);
            particleManager.createFloatingText(h.mesh.position, isGirlsTheme ? '+1 💖' : '+1 ❤️', isGirlsTheme ? '#ff70a6' : '#ff0033');
            setHearts(prev => prev + 1);
          }
        } else if (h.respawnTimer > 0) {
          h.respawnTimer -= dt;
          if (h.respawnTimer <= 0) {
            h.collected = false;
            h.mesh.position.y = h.startY || 1.2;
            scene.add(h.mesh);
            particleManager.createBurst(h.mesh.position, 0xff0044, 12, 4);
          }
        }
      });

      // Collect Powerups (Shield, Magnet, Slow-Mo)
      powerupObjs.forEach(p => {
        if (!p.collected) {
          p.mesh.rotation.y += dt * 2.8;
          if (p.mesh.userData?.ring1) p.mesh.userData.ring1.rotation.x += dt * 3.0;
          if (p.mesh.userData?.ring2) p.mesh.userData.ring2.rotation.y += dt * 3.5;
          p.mesh.position.y = (p.startY || 1.4) + Math.sin(t * 3 + (p.phase || 0)) * 0.15;

          const distToPlayer = Math.hypot(p.mesh.position.x - player.position.x, p.mesh.position.z - player.position.z);
          const distY = Math.abs(p.mesh.position.y - (player.position.y + 1.0));
          if (distToPlayer < 1.8 && distY < 2.2) {
            p.collected = true;
            scene.remove(p.mesh);
            soundEngine.playPowerup(p.type);

            if (p.type === 'shield') {
              localShieldTime = 10;
              setShieldTime(10);
              particleManager.createFloatingText(p.mesh.position, '10s SHIELD! 🛡️', '#00ffff');
            } else if (p.type === 'magnet') {
              localMagnetTime = 8;
              setMagnetTime(8);
              particleManager.createFloatingText(p.mesh.position, '8s MAGNET! 🧲', '#ff0055');
            } else if (p.type === 'slowmo') {
              localSlowMoTime = 7;
              setSlowMoTime(7);
              particleManager.createFloatingText(p.mesh.position, 'SLOW-MO! ⏳', '#ffd700');
            }
          }
        }
      });

      // Move Obstacles (Quantum Sentinel Cubes, Hunter Interceptors & Aerial Sky Mines)
      const slowMultiplier = localSlowMoTime > 0 ? 0.4 : 1.0;
      obstacles.forEach(o => {
        if (o.type === 'skymine') {
          // Aerial Sky Mine: Hover oscillation and platform patrol
          o.mesh.position.y = o.baseY + Math.sin(t * 3.5 + o.phase) * 0.25;
          o.mesh.position[o.axis] += o.dir * o.speed * dt * slowMultiplier;
          if (o.mesh.position[o.axis] >= o.max) {
            o.mesh.position[o.axis] = o.max;
            o.dir = -1;
          } else if (o.mesh.position[o.axis] <= o.min) {
            o.mesh.position[o.axis] = o.min;
            o.dir = 1;
          }
          o.mesh.rotation.y += dt * 2.5 * slowMultiplier;
          if (o.mesh.userData?.ring1) o.mesh.userData.ring1.rotation.x += dt * 3.5 * slowMultiplier;
          if (o.mesh.userData?.ring2) o.mesh.userData.ring2.rotation.z += dt * 3.0 * slowMultiplier;
          if (o.mesh.userData?.strobe) {
            o.mesh.userData.strobe.material.color.setHex(Math.sin(t * 12) > 0.2 ? 0xffea00 : 0x442200);
          }

          if (o.cooldown > 0) o.cooldown -= dt;

          // 3D Collision with elevated player on the platform
          const distH = Math.hypot(player.position.x - o.mesh.position.x, player.position.z - o.mesh.position.z);
          const distY = Math.abs(player.position.y - o.platformTopY);
          if (distH < 2.0 && distY < 1.8 && o.cooldown <= 0) {
            if (spawnGraceRef.current > 0) {
              o.cooldown = 0.5;
              return;
            }
            if (localShieldTime > 0 || localFeverTime > 0) {
              o.cooldown = 1.0;
              soundEngine.playPowerup('shield');
              particleManager.createBurst(o.mesh.position, 0xffaa00, 15, 8);
              particleManager.createFloatingText(player.position, 'DEFLECTED! 🛡️', '#00ffff');
            } else {
              o.cooldown = 2.0;
              handlePlayerDamage();
              particleManager.createFloatingText(player.position, 'SKY MINE! 💥', '#ff6600');
            }
          }
        } else if (o.type === 'creature') {
          // Cyber Stalker Creature: Intelligent Stalking & Telegraphed Lunge AI (Medium & Hard Modes)
          const distToPlayer = Math.hypot(player.position.x - o.mesh.position.x, player.position.z - o.mesh.position.z);
          const isPlayerOnGround = player.position.y < 2.2;
          const ud = o.mesh.userData || {};

          const isMed = o.difficultyMode === 'medium';
          const lungeMultiplier = isMed ? 1.45 : 1.85;
          const recoveryCooldown = isMed ? 2.0 : 1.4;
          const windupDuration = isMed ? 0.48 : 0.38;
          const pursuitMultiplier = isMed ? 1.0 : 1.15;
          const stalkRange = isMed ? 22 : 28;
          const lungeTriggerRange = isMed ? 10 : 12;

          // Stalking / Windup / Lunge State Machine
          if (o.state === 'lunge') {
            // Rapid high-speed forward strike!
            o.stateTimer -= dt;
            o.mesh.position.x += o.lungeDir.x * (o.speed * lungeMultiplier) * dt * slowMultiplier;
            o.mesh.position.z += o.lungeDir.z * (o.speed * lungeMultiplier) * dt * slowMultiplier;

            // Thrashing claws and biting mandibles
            if (ud.leftMandible && ud.rightMandible) {
              ud.leftMandible.rotation.z = -0.6 + Math.sin(t * 30) * 0.4;
              ud.rightMandible.rotation.z = 0.6 - Math.sin(t * 30) * 0.4;
            }
            if (o.stateTimer <= 0) {
              o.state = 'patrol';
              o.cooldown = recoveryCooldown; // Recovery breather
              if (ud.eyeLeft && ud.eyeRight) {
                ud.eyeLeft.material.color.setHex(0xff0022);
                ud.eyeRight.material.color.setHex(0xff0022);
              }
            }
          } else if (o.state === 'windup') {
            // Windup Telegraph: pauses for windupDuration, eyes flare bright crimson, tail shakes!
            o.stateTimer -= dt;
            if (ud.eyeLeft && ud.eyeRight) {
              ud.eyeLeft.material.color.setHex(0xff0000);
              ud.eyeRight.material.color.setHex(0xff0000);
            }
            if (ud.tailGroup) {
              ud.tailGroup.rotation.y = Math.sin(t * 40) * 0.45;
            }
            if (o.stateTimer <= 0) {
              o.state = 'lunge';
              o.stateTimer = 0.55; // 0.55 seconds of fierce lunge!
              const dX = player.position.x - o.mesh.position.x;
              const dZ = player.position.z - o.mesh.position.z;
              const len = Math.hypot(dX, dZ) || 1;
              o.lungeDir = { x: dX / len, z: dZ / len };
              o.mesh.rotation.y = Math.atan2(dX, dZ);
            }
          } else {
            // Normal Stalking or Patrol
            if (distToPlayer < lungeTriggerRange && isPlayerOnGround && o.cooldown <= 0) {
              // Initiate telegraphed lunge attack!
              o.state = 'windup';
              o.stateTimer = windupDuration;
              o.velocity.x = 0;
              o.velocity.z = 0;
            } else if (distToPlayer < stalkRange && isPlayerOnGround) {
              // Stalking Phase: smooth pursuit steering toward player
              const angle = Math.atan2(player.position.x - o.mesh.position.x, player.position.z - o.mesh.position.z);
              o.mesh.rotation.y = angle;
              const pursuitSpeed = o.speed * pursuitMultiplier;
              o.velocity.x += (Math.sin(angle) * pursuitSpeed - o.velocity.x) * dt * 3.5;
              o.velocity.z += (Math.cos(angle) * pursuitSpeed - o.velocity.z) * dt * 3.5;

              o.mesh.position.x += o.velocity.x * dt * slowMultiplier;
              o.mesh.position.z += o.velocity.z * dt * slowMultiplier;
            } else {
              // Peaceful patrol flight/crawl when player is far away or safe on sky islands
              o.mesh.position.x += o.velocity.x * dt * slowMultiplier;
              o.mesh.position.z += o.velocity.z * dt * slowMultiplier;
              if (Math.hypot(o.velocity.x, o.velocity.z) > 0.1) {
                o.mesh.rotation.y = Math.atan2(o.velocity.x, o.velocity.z);
              }
            }

            if (o.cooldown > 0) o.cooldown -= dt;
          }

          // Arena boundary bounce
          if (o.mesh.position.x > 36 || o.mesh.position.x < -36) {
            o.velocity.x *= -1;
            if (o.lungeDir) o.lungeDir.x *= -1;
          }
          if (o.mesh.position.z > 36 || o.mesh.position.z < -36) {
            o.velocity.z *= -1;
            if (o.lungeDir) o.lungeDir.z *= -1;
          }

          // Procedural limb & tail animations
          const legSpeed = o.state === 'lunge' ? 32 : (o.state === 'windup' ? 6 : 16);
          if (ud.legs) {
            ud.legs.forEach(l => {
              l.root.rotation.x = Math.sin(t * legSpeed + l.phase) * 0.45;
            });
          }
          if (ud.heartCore) {
            const pulseSpeed = o.state === 'lunge' ? 18 : 8;
            ud.heartCore.scale.setScalar(0.9 + Math.sin(t * pulseSpeed) * 0.25);
          }
          if (ud.tailGroup && o.state !== 'windup') {
            ud.tailGroup.rotation.y = Math.sin(t * 6) * 0.3;
          }

          // Collision Check
          if (distToPlayer < 2.2 && o.cooldown <= 0 && isPlayerOnGround) {
            if (spawnGraceRef.current > 0) {
              o.cooldown = 0.5;
              return;
            }
            if (localShieldTime > 0 || localFeverTime > 0) {
              o.cooldown = 1.0;
              o.state = 'patrol';
              soundEngine.playPowerup('shield');
              particleManager.createBurst(o.mesh.position, 0xff0044, 20, 10);
              particleManager.createFloatingText(player.position, 'BEAST DEFLECTED! 🛡️', '#00ffff');
            } else {
              o.cooldown = 2.0;
              o.state = 'patrol';
              handlePlayerDamage();
              soundEngine.playHazard?.();
              particleManager.createBurst(o.mesh.position, 0xff0033, 16, 8);
              particleManager.createFloatingText(player.position, 'BEAST STRIKE! 💥', '#ff0033');
            }
          }
        } else {
          // Quantum Sentinel Cube: Anti-gravity hovering sentinel
          o.mesh.position.x += o.velocity.x * dt * slowMultiplier;
          o.mesh.position.z += o.velocity.z * dt * slowMultiplier;

          if (o.mesh.position.x > 36) {
            o.mesh.position.x = 36;
            o.velocity.x *= -1;
          } else if (o.mesh.position.x < -36) {
            o.mesh.position.x = -36;
            o.velocity.x *= -1;
          }
          if (o.mesh.position.z > 36) {
            o.mesh.position.z = 36;
            o.velocity.z *= -1;
          } else if (o.mesh.position.z < -36) {
            o.mesh.position.z = -36;
            o.velocity.z *= -1;
          }

          // Bounce off solid tree and rock colliders
          if (solidColliders && solidColliders.length > 0) {
            const sentinelRadius = 1.2;
            for (const col of solidColliders) {
              const dx = o.mesh.position.x - col.x;
              const dz = o.mesh.position.z - col.z;
              const dist = Math.hypot(dx, dz);
              const minDist = (col.radius || 1.2) + sentinelRadius;
              if (dist < minDist && dist > 0.0001) {
                const push = minDist - dist;
                o.mesh.position.x += (dx / dist) * push;
                o.mesh.position.z += (dz / dist) * push;
                o.velocity.x *= -1;
                o.velocity.z *= -1;
              }
            }
          }

          // Calculate surface beneath cube (ground or platform)
          let surfaceY = 0;
          if (platforms && platforms.length > 0) {
            for (const p of platforms) {
              if (
                o.mesh.position.x >= p.minX && o.mesh.position.x <= p.maxX &&
                o.mesh.position.z >= p.minZ && o.mesh.position.z <= p.maxZ
              ) {
                if (o.mesh.position.y >= p.topY - 0.5 && p.topY > surfaceY) {
                  surfaceY = p.topY;
                }
              }
            }
          }

          // Set hovering altitude above surface (lowest point is >= 0.27m above floor)
          const hoverY = surfaceY + 1.4 + Math.sin(t * 3.0 + (o.phase || 0)) * 0.12;
          o.mesh.position.y = hoverY;

          // Upright anti-gravity hover rotation (yaw spin + subtle aerodynamic tilt, no tumbling below floor)
          o.mesh.rotation.y += dt * 1.6 * slowMultiplier;
          o.mesh.rotation.x = Math.sin(t * 2.2 + (o.phase || 0)) * 0.06;
          o.mesh.rotation.z = Math.cos(t * 2.5 + (o.phase || 0)) * 0.06;

          // Inner plasma reactor core counter-rotation and light pulse
          if (o.mesh.userData?.innerCore) {
            o.mesh.userData.innerCore.rotation.y -= dt * 3.5 * slowMultiplier;
            o.mesh.userData.innerCore.rotation.x += dt * 2.5 * slowMultiplier;
            const corePulse = 0.88 + Math.sin(t * 6) * 0.14;
            o.mesh.userData.innerCore.scale.set(corePulse, corePulse, corePulse);
          }

          if (o.cooldown > 0) o.cooldown -= dt;

          const distToPlayer = Math.hypot(player.position.x - o.mesh.position.x, player.position.z - o.mesh.position.z);
          const distY = Math.abs(player.position.y - o.mesh.position.y);
          if (distToPlayer < 2.5 && distY < 1.8 && o.cooldown <= 0) {
            if (spawnGraceRef.current > 0) {
              o.cooldown = 0.5;
              return;
            }
            if (localShieldTime > 0 || localFeverTime > 0) {
              o.cooldown = 1.0;
              soundEngine.playPowerup('shield');
              particleManager.createBurst(o.mesh.position, 0x00ffff, 15, 8);
              particleManager.createFloatingText(player.position, 'DEFLECTED! 🛡️', '#00ffff');
            } else {
              o.cooldown = 2.0;
              handlePlayerDamage();
            }
          }
        }
      });

      // Boss Logic on Level 10
      if (bossInstance) {
        // Check Pylon activation
        bossInstance.pylons.forEach(pylon => {
          if (!pylon.activated) {
            const d = Math.hypot(player.position.x - pylon.x, player.position.z - pylon.z);
            if (d < 2.8) {
              bossInstance.activatePylon(pylon.id, soundEngine, particleManager);
              setPylonsDeactivated(bossInstance.pylons.filter(p => p.activated).length);
              setBossPylons(bossInstance.pylons.map(p => ({ id: p.id, name: p.name, activated: p.activated })));
            }
          }
        });

        // Boss attacks & updates
        bossInstance.update(dt, t, player.position, isGrounded, soundEngine, handlePlayerDamage);

        // Core Crystal Collection (Victory!)
        if (bossInstance.shieldBroken && bossInstance.coreCrystal && !bossInstance.isDefeated) {
          const dToCore = Math.hypot(player.position.x, player.position.z);
          if (dToCore < 2.5) {
            bossInstance.isDefeated = true;
            soundEngine.stopBGM();
            soundEngine.playPowerup('fever');
            particleManager.createBurst({ x: 0, y: 2, z: 0 }, 0xffd700, 60, 15);
            particleManager.createFloatingText({ x: 0, y: 3, z: 0 }, 'TITAN DEFEATED! 🏆', '#ffd700', 52);
            unlockAchievement('level_10');

            setTimeout(() => {
              onLevelComplete();
            }, 1200);
          }
        }
      }

      // Girls Theme: Ambient floating fairy sakura dust
      if (isGirlsTheme && Math.random() < 0.22) {
        particleManager.createDust(
          {
            x: player.position.x + (Math.random() - 0.5) * 22,
            y: player.position.y + 1.2 + Math.random() * 3.5,
            z: player.position.z + (Math.random() - 0.5) * 22
          },
          Math.random() < 0.5 ? 0xffb7eb : 0xff70a6
        );
      }

      // Update Particle Systems
      particleManager.update(dt);

      renderer.render(scene, camera);
    } catch (loopErr) {
      console.error('Render loop encountered error:', loopErr);
    }
  };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('blur', onBlur);

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', onCanvasClick);
      }
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }

      particleManager.clear();
      if (playerCharacter) playerCharacter.destroy();
      if (petInstance) petInstance.destroy();
      if (bossInstance) bossInstance.destroy();

      if (scene) {
        scene.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
          }
        });
      }

      if (renderer && mountNode) {
        try {
          mountNode.removeChild(renderer.domElement);
          renderer.dispose();
        } catch {}
      }
    };
  }, [level, showComplete, gameOver, showLevelStart, currentScreen, savedData.difficulty]);

  return (
    <div
      className={(savedData.activeTheme || 'default') === 'girls' ? 'theme-girls' : ''}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: (savedData.activeTheme || 'default') === 'girls' ? '#180a18' : '#05050f'
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* --- HOME SCREEN --- */}
      {currentScreen === 'home' && (
        <HomeScreen
          savedData={savedData}
          setSavedData={setSavedData}
          onToggleDifficulty={(d) => setSavedData(prev => ({ ...prev, difficulty: d }))}
          onResetProgress={() => {
            const fresh = resetGameState();
            setSavedData(fresh);
            setLevel(1);
            setScore(0);
            setCoins(0);
            setCombo(1);
            setPylonsDeactivated(0);
            setHearts(fresh.upgrades?.maxHearts || 3);
            const maxStam = fresh.upgrades?.maxStamina || 100;
            setStamina(maxStam);
            staminaRef.current = maxStam;
            soundEngine.playPowerup('shield');
          }}
          onPlay={() => {
            setLevel(1);
            setScore(0);
            setCoins(0);
            setCombo(1);
            setPylonsDeactivated(0);
            setHearts(savedDataRef.current?.upgrades?.maxHearts || 3);
            setShieldTime(0);
            setMagnetTime(0);
            setSlowMoTime(0);
            setFeverTime(0);
            spawnGraceRef.current = 3.0;
            setSpawnGraceTime(3.0);
            levelElapsedRef.current = 0;
            setLevelElapsedTime(0);
            setCurrentScreen('playing');
            setShowLevelStart(true);
          }}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenHowToPlay={() => setShowFieldManual(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAbout={() => setShowAbout(true)}
          shopHats={shopHats}
          shopPets={shopPets}
        />
      )}

      {/* --- IN-GAME HUD --- */}
      {currentScreen === 'playing' && !showLevelStart && !gameOver && !showComplete && !isPaused && (
        <InGameHUD
          level={level}
          score={score}
          targetCrystals={cfg.crystals}
          coins={coins}
          savedData={savedData}
          hearts={hearts}
          stamina={stamina}
          combo={combo}
          shieldTime={shieldTime}
          magnetTime={magnetTime}
          slowMoTime={slowMoTime}
          feverTime={feverTime}
          bossState={{
            pylonsDeactivated,
            pylons: bossPylons.length > 0 ? bossPylons : [
              { id: 0, name: 'North-West (NW)', activated: pylonsDeactivated >= 1 },
              { id: 1, name: 'South-East (SE)', activated: pylonsDeactivated >= 2 },
              { id: 2, name: 'South-West (SW)', activated: pylonsDeactivated >= 3 },
              { id: 3, name: 'North-East (NE)', activated: pylonsDeactivated >= 4 }
            ]
          }}
          fps={fps}
          spawnGraceTime={spawnGraceTime}
          elapsedTime={levelElapsedTime}
          isPaused={isPaused}
          onPause={() => setIsPaused(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenGuide={() => setShowFieldManual(true)}
        />
      )}

      {/* --- LEVEL SELECT MODAL --- */}
      {showLevelSelect && (
        <LevelSelectModal
          unlockedLevels={savedData.unlockedLevels || 1}
          onSelectLevel={(lvl) => {
            setLevel(lvl);
            setShowLevelSelect(false);
            setCurrentScreen('playing');
            setShowLevelStart(true);
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* --- HOW TO PLAY MODAL --- */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* --- FIELD MANUAL & CODEX MODAL --- */}
      {showFieldManual && (
        <FieldManualModal
          isFirstTime={isFirstTimeManual}
          onClose={() => {
            setShowFieldManual(false);
            setIsFirstTimeManual(false);
            setSavedData(prev => ({ ...prev, hasSeenFirstTimeGuide: true }));
          }}
        />
      )}

      {/* --- SETTINGS MODAL --- */}
      {showSettings && (
        <SettingsModal
          savedData={savedData}
          setSavedData={setSavedData}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* --- ABOUT & ROOT ACCESS MODAL --- */}
      {showAbout && (
        <AboutModal
          unlockedLevels={savedData.unlockedLevels || 1}
          onUnlockRoot={() => {
            setSavedData(prev => ({ ...prev, unlockedLevels: 10 }));
            soundEngine.playPowerup('shield');
          }}
          onUnlockGirlsTheme={() => {
            setSavedData(prev => {
              const ownedChars = prev.ownedCharacters || ['cyber_runner'];
              const ownedPets = prev.ownedPets || [];
              return {
                ...prev,
                unlockedGirlsTheme: true,
                activeTheme: 'girls',
                currentCharacter: 'magical_rue',
                currentPet: 'sugar_bunny',
                ownedCharacters: ownedChars.includes('magical_rue') ? ownedChars : [...ownedChars, 'magical_rue'],
                ownedPets: ownedPets.includes('sugar_bunny') ? ownedPets : [...ownedPets, 'sugar_bunny']
              };
            });
            soundEngine.playMagicalChime?.();
          }}
          onClose={() => setShowAbout(false)}
        />
      )}

      {/* --- LEVEL START OVERLAY --- */}
      {currentScreen === 'playing' && showLevelStart && !gameOver && !showComplete && (
        <div className="modal-backdrop">
          <div className="hud-panel glass-card-glow" style={{ padding: '40px', maxWidth: '540px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#00f0ff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {level === 10 ? 'FINAL CONFRONTATION' : `ZONE EXPEDITION`}
            </div>
            <h1 style={{ fontSize: '42px', margin: '0 0 10px', color: level === 10 ? '#ff3366' : '#ffffff' }}>
              {level === 10 ? '👑 THE CRYSTAL TITAN 👑' : `💎 LEVEL ${level} 💎`}
            </h1>
            <h2 style={{ fontSize: '20px', color: '#ffd700', marginBottom: '20px' }}>
              {level === 10 ? 'GUARDIAN BOSS GAUNTLET' : BiomeGenerator.getBiomeData(level).name}
            </h2>

            {level === 10 ? (
              <div className="boss-protocol-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#ff4d6d', letterSpacing: '0.5px' }}>
                    HOW TO BEAT THE FINAL BOSS (4 SIMPLE STEPS):
                  </span>
                </div>

                <div className="boss-step-card">
                  <div className="boss-step-num">1</div>
                  <div>
                    <strong style={{ color: '#00f0ff' }}>Look for 4 Sky Beacons:</strong>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                      Look up! There are 4 tall blue light beams in the 4 corners of the arena powering the Titan's shield.
                    </div>
                  </div>
                </div>

                <div className="boss-step-card">
                  <div className="boss-step-num">2</div>
                  <div>
                    <strong style={{ color: '#00ff88' }}>Step On Each Glowing Floor Ring:</strong>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                      Sprint to each corner and simply walk into the glowing floor circle under the beacon to shut it down.
                    </div>
                  </div>
                </div>

                <div className="boss-step-card">
                  <div className="boss-step-num">3</div>
                  <div>
                    <strong style={{ color: '#ffd700' }}>Dodge Lasers & Shockwaves:</strong>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                      Tap Space to jump or double-jump over red ground shockwaves, and avoid the sweeping red laser.
                    </div>
                  </div>
                </div>

                <div className="boss-step-card">
                  <div className="boss-step-num">4</div>
                  <div>
                    <strong style={{ color: '#ff66aa' }}>Collect The Golden Master Crystal:</strong>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                      Once all 4 beacons are shut down, the shield shatters! Run to the golden sky beam in the center to win the game!
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '14px', marginBottom: '25px', textAlign: 'left', fontSize: '14px', lineHeight: 1.6 }}>
                <div>💎 <strong>Target</strong>: Collect {cfg.crystals} crystals to complete realm</div>
                <div>🚀 <strong>Jump Pads</strong>: Launch high to reach floating bonus items</div>
                <div>🪶 <strong>Double Jump</strong>: Tap Spacebar again mid-air</div>
                <div>🔥 <strong>Caution</strong>: Avoid molten lava hazard pools!</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="hud-btn btn-secondary"
                onClick={returnToMainMenu}
                style={{ flex: 1, padding: '14px', fontSize: '15px' }}
              >
                🏠 MAIN MENU
              </button>
              <button
                className="hud-btn btn-primary"
                onClick={startLevel}
                style={{ flex: 2, padding: '14px', fontSize: '18px' }}
              >
                ▶️ START LEVEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SHOP 2.0 MODAL --- */}
      {showShop && (
        <div className="modal-backdrop">
          <div className="hud-panel" style={{ padding: '30px', maxWidth: '750px', width: '92%', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '30px', color: '#ffd700' }}>🛒 ARCADE SHOP 2.0</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '22px', color: '#ffd700', fontWeight: 'bold' }}>🪙 {savedData.totalCoins} Coins</div>
                <button
                  className="shop-close-x-btn"
                  title="Close Shop"
                  onClick={() => {
                    soundEngine.playUIClick();
                    setShowShop(false);
                  }}
                  aria-label="Close Shop"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Shop Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button className={`shop-tab-btn ${shopTab === 'characters' ? 'active' : ''}`} onClick={() => setShopTab('characters')}>🦸 Characters</button>
              <button className={`shop-tab-btn ${shopTab === 'colors' ? 'active' : ''}`} onClick={() => setShopTab('colors')}>🎨 Armor Colors</button>
              <button className={`shop-tab-btn ${shopTab === 'hats' ? 'active' : ''}`} onClick={() => setShopTab('hats')}>🎩 3D Hats</button>
              <button className={`shop-tab-btn ${shopTab === 'pets' ? 'active' : ''}`} onClick={() => setShopTab('pets')}>🐾 Pets</button>
              <button className={`shop-tab-btn ${shopTab === 'trails' ? 'active' : ''}`} onClick={() => setShopTab('trails')}>✨ Trails</button>
              <button className={`shop-tab-btn ${shopTab === 'upgrades' ? 'active' : ''}`} onClick={() => setShopTab('upgrades')}>🏋️ Upgrades</button>
            </div>

            {/* Characters Tab */}
            {shopTab === 'characters' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px' }}>
                {CHARACTER_ROSTER.map(item => {
                  const owned = (savedData.ownedCharacters || ['cyber_runner']).includes(item.id);
                  const isEquipped = (savedData.currentCharacter || 'cyber_runner') === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isEquipped ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), #1c1c28)' : '#1c1c28',
                        padding: '18px',
                        borderRadius: '14px',
                        textAlign: 'center',
                        border: isEquipped ? '2px solid #00f0ff' : '1px solid #333',
                        boxShadow: isEquipped ? '0 0 15px rgba(0, 240, 255, 0.25)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '46px', marginBottom: '6px' }}>{item.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: '17px', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px' }}>
                          {item.title.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px', lineHeight: '1.4' }}>
                          {item.desc}
                        </div>
                        <div
                          style={{
                            background: 'rgba(0, 255, 136, 0.1)',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            fontSize: '11px',
                            color: '#00ff88',
                            fontWeight: 700,
                            marginBottom: '12px'
                          }}
                        >
                          {item.perk}
                        </div>
                      </div>

                      <div>
                        <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                          {owned ? 'UNLOCKED' : item.isSecret ? 'SECRET HERO' : item.cost === 0 ? 'FREE' : `🪙 ${item.cost}`}
                        </div>
                        {owned ? (
                          <button
                            className="hud-btn"
                            onClick={() => {
                              setSavedData(prev => ({ ...prev, currentCharacter: item.id }));
                              soundEngine.playUIClick?.();
                            }}
                            style={{
                              background: isEquipped ? '#00f0ff' : '#00ff88',
                              color: '#000',
                              width: '100%',
                              padding: '10px',
                              fontWeight: 800
                            }}
                          >
                            {isEquipped ? 'EQUIPPED' : 'SELECT HERO'}
                          </button>
                        ) : item.isSecret ? (
                          <button
                            className="hud-btn"
                            disabled
                            style={{
                              background: 'rgba(255, 112, 166, 0.2)',
                              border: '1px dashed #ff70a6',
                              color: '#ffb7eb',
                              width: '100%',
                              padding: '10px',
                              fontWeight: 800,
                              cursor: 'not-allowed'
                            }}
                          >
                            🔒 UNLOCK IN ABOUT
                          </button>
                        ) : (
                          <button
                            className="hud-btn"
                            disabled={savedData.totalCoins < item.cost}
                            onClick={() => buyItem('character', item.id, item.cost)}
                            style={{
                              background: savedData.totalCoins >= item.cost ? '#ffd700' : '#444',
                              color: '#000',
                              width: '100%',
                              padding: '10px',
                              fontWeight: 800
                            }}
                          >
                            UNLOCK HERO
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Skins Tab */}
            {shopTab === 'colors' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
                {shopColors.map(item => {
                  const owned = savedData.ownedColors.includes(item.color);
                  const isEquipped = savedData.playerColor === item.color;
                  return (
                    <div key={item.color} style={{ background: '#1c1c28', padding: '14px', borderRadius: '12px', textAlign: 'center', border: isEquipped ? '2px solid #00ff88' : '1px solid #333' }}>
                      <div style={{ width: '50px', height: '50px', background: item.color, borderRadius: '50%', margin: '0 auto 10px', boxShadow: `0 0 15px ${item.color}` }} />
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                      <div style={{ color: '#ffd700', margin: '6px 0', fontSize: '13px' }}>{owned ? 'OWNED' : `🪙 ${item.cost}`}</div>
                      {owned ? (
                        <button className="hud-btn" onClick={() => setSavedData(prev => ({ ...prev, playerColor: item.color }))} style={{ background: isEquipped ? '#444' : '#00ff88', color: isEquipped ? '#aaa' : '#000', width: '100%', padding: '6px' }}>
                          {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                        </button>
                      ) : (
                        <button className="hud-btn" disabled={savedData.totalCoins < item.cost} onClick={() => buyItem('color', item.color, item.cost)} style={{ background: savedData.totalCoins >= item.cost ? '#ffd700' : '#444', color: '#000', width: '100%', padding: '6px' }}>
                          BUY
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hats Tab */}
            {shopTab === 'hats' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
                {shopHats.map(item => {
                  const owned = savedData.ownedHats.includes(item.id);
                  const isEquipped = savedData.currentHat === item.id;
                  return (
                    <div key={item.id} style={{ background: '#1c1c28', padding: '14px', borderRadius: '12px', textAlign: 'center', border: isEquipped ? '2px solid #ff00aa' : '1px solid #333' }}>
                      <div style={{ fontSize: '40px', margin: '0 auto 8px' }}>{item.icon}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                      <div style={{ color: '#ffd700', margin: '6px 0', fontSize: '13px' }}>{owned ? 'OWNED' : item.cost === 0 ? 'FREE' : `🪙 ${item.cost}`}</div>
                      {owned ? (
                        <button className="hud-btn" onClick={() => setSavedData(prev => ({ ...prev, currentHat: isEquipped ? null : item.id }))} style={{ background: isEquipped ? '#ff00aa' : '#00ff88', color: '#000', width: '100%', padding: '6px' }}>
                          {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                        </button>
                      ) : (
                        <button className="hud-btn" disabled={savedData.totalCoins < item.cost} onClick={() => buyItem('hat', item.id, item.cost)} style={{ background: savedData.totalCoins >= item.cost ? '#ffd700' : '#444', color: '#000', width: '100%', padding: '6px' }}>
                          BUY
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pets Tab */}
            {shopTab === 'pets' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {shopPets.map(item => {
                  const owned = savedData.ownedPets.includes(item.id);
                  const isEquipped = savedData.currentPet === item.id;
                  return (
                    <div key={item.id} style={{ background: '#1c1c28', padding: '16px', borderRadius: '12px', textAlign: 'center', border: isEquipped ? '2px solid #00f0ff' : '1px solid #333' }}>
                      <div style={{ fontSize: '44px', marginBottom: '8px' }}>{item.icon}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#aaa', margin: '6px 0' }}>{item.desc}</div>
                      <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '10px' }}>{owned ? 'OWNED' : item.isSecret ? 'SECRET PET' : `🪙 ${item.cost}`}</div>
                      {owned ? (
                        <button className="hud-btn" onClick={() => setSavedData(prev => ({ ...prev, currentPet: isEquipped ? null : item.id }))} style={{ background: isEquipped ? '#00f0ff' : '#00ff88', color: '#000', width: '100%', padding: '8px' }}>
                          {isEquipped ? 'DISMISS' : 'SUMMON'}
                        </button>
                      ) : item.isSecret ? (
                        <button
                          className="hud-btn"
                          disabled
                          style={{
                            background: 'rgba(255, 112, 166, 0.2)',
                            border: '1px dashed #ff70a6',
                            color: '#ffb7eb',
                            width: '100%',
                            padding: '8px',
                            fontWeight: 800,
                            cursor: 'not-allowed'
                          }}
                        >
                          🔒 UNLOCK IN ABOUT
                        </button>
                      ) : (
                        <button className="hud-btn" disabled={savedData.totalCoins < item.cost} onClick={() => buyItem('pet', item.id, item.cost)} style={{ background: savedData.totalCoins >= item.cost ? '#ffd700' : '#444', color: '#000', width: '100%', padding: '8px' }}>
                          BUY PET
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trails Tab */}
            {shopTab === 'trails' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                {shopTrails.map(item => {
                  const owned = savedData.ownedTrails.includes(item.id);
                  const isEquipped = savedData.currentTrail === item.id;
                  return (
                    <div key={item.id} style={{ background: '#1c1c28', padding: '16px', borderRadius: '12px', textAlign: 'center', border: isEquipped ? '2px solid #ffd700' : '1px solid #333' }}>
                      <div style={{ width: '40px', height: '8px', background: item.color, borderRadius: '4px', margin: '15px auto', boxShadow: `0 0 15px ${item.color}` }} />
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ color: '#ffd700', margin: '8px 0' }}>{owned ? 'OWNED' : `🪙 ${item.cost}`}</div>
                      {owned ? (
                        <button className="hud-btn" onClick={() => setSavedData(prev => ({ ...prev, currentTrail: isEquipped ? null : item.id }))} style={{ background: isEquipped ? '#ffd700' : '#00ff88', color: '#000', width: '100%', padding: '8px' }}>
                          {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                        </button>
                      ) : (
                        <button className="hud-btn" disabled={savedData.totalCoins < item.cost} onClick={() => buyItem('trail', item.id, item.cost)} style={{ background: savedData.totalCoins >= item.cost ? '#ffd700' : '#444', color: '#000', width: '100%', padding: '8px' }}>
                          BUY TRAIL
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upgrades Tab */}
            {shopTab === 'upgrades' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#1c1c28', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>❤️ Vitality Boost (+1 Starting Heart)</div>
                    <div style={{ color: '#aaa', fontSize: '13px' }}>Current: {savedData.upgrades?.maxHearts || 3} / 10 Hearts</div>
                  </div>
                  {(savedData.upgrades?.maxHearts || 3) < 10 ? (
                    <button className="hud-btn" disabled={savedData.totalCoins < 100} onClick={() => buyUpgrade('maxHearts', 100, 1)} style={{ background: '#ffd700', color: '#000', padding: '10px 20px' }}>
                      UPGRADE (100 🪙)
                    </button>
                  ) : (
                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>MAXED OUT</span>
                  )}
                </div>

                <div style={{ background: '#1c1c28', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>⚡ Stamina Tank (+25 Capacity)</div>
                    <div style={{ color: '#aaa', fontSize: '13px' }}>Current: {savedData.upgrades?.maxStamina || 100} / 150 Stamina</div>
                  </div>
                  {(savedData.upgrades?.maxStamina || 100) < 150 ? (
                    <button className="hud-btn" disabled={savedData.totalCoins < 100} onClick={() => buyUpgrade('maxStamina', 100, 25)} style={{ background: '#ffd700', color: '#000', padding: '10px 20px' }}>
                      UPGRADE (100 🪙)
                    </button>
                  ) : (
                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>MAXED OUT</span>
                  )}
                </div>

                <div style={{ background: '#1c1c28', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>🧲 Natural Magnet Reach (+3m Radius)</div>
                    <div style={{ color: '#aaa', fontSize: '13px' }}>Current: +{savedData.upgrades?.magnetRadius || 0}m Reach</div>
                  </div>
                  {(savedData.upgrades?.magnetRadius || 0) < 9 ? (
                    <button className="hud-btn" disabled={savedData.totalCoins < 120} onClick={() => buyUpgrade('magnetRadius', 120, 3)} style={{ background: '#ffd700', color: '#000', padding: '10px 20px' }}>
                      UPGRADE (120 🪙)
                    </button>
                  ) : (
                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>MAXED OUT</span>
                  )}
                </div>
              </div>
            )}

            <button className="hud-btn" onClick={() => setShowShop(false)} style={{ width: '100%', background: '#ff3344', color: '#fff', padding: '14px', marginTop: '25px', fontSize: '18px' }}>
              ✖ CLOSE SHOP
            </button>
          </div>
        </div>
      )}

      {/* --- ACHIEVEMENTS MODAL --- */}
      {showAchievements && (
        <div className="modal-backdrop">
          <div className="hud-panel" style={{ padding: '30px', maxWidth: '540px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 20px', color: '#9d4edd' }}>🏆 BADGES & ACHIEVEMENTS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {achievementsList.map(a => {
                const unlocked = !!savedData.achievements[a.id];
                return (
                  <div key={a.id} style={{ background: unlocked ? '#1a3a2a' : '#1a1a24', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: unlocked ? '1px solid #00ff88' : '1px solid #333' }}>
                    <div style={{ fontSize: '32px' }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: unlocked ? '#00ff88' : '#fff' }}>{a.name}</div>
                      <div style={{ fontSize: '13px', color: '#aaa' }}>{a.desc}</div>
                    </div>
                    {unlocked && <span style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '13px' }}>✓ UNLOCKED</span>}
                  </div>
                );
              })}
            </div>
            <button className="hud-btn" onClick={() => setShowAchievements(false)} style={{ width: '100%', background: '#444', color: '#fff', padding: '12px', marginTop: '20px' }}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- PAUSE MENU MODAL --- */}
      {isPaused && (
        <div className="modal-backdrop">
          <div className="hud-panel glass-card-glow" style={{ padding: '35px', maxWidth: '440px', width: '90%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', color: '#00f0ff', marginBottom: '25px', letterSpacing: '1px' }}>
              ⏸️ GAME PAUSED
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="hud-btn btn-primary"
                onClick={() => setIsPaused(false)}
                style={{ padding: '14px', fontSize: '18px' }}
              >
                ▶️ RESUME
              </button>
              <button
                className="hud-btn btn-accent"
                onClick={() => { setIsPaused(false); retryCurrentLevel(); }}
                style={{ padding: '12px', fontSize: '16px' }}
              >
                🔄 RESTART LEVEL
              </button>
              <button
                className="hud-btn btn-secondary"
                onClick={() => setShowSettings(true)}
                style={{ padding: '12px', fontSize: '16px' }}
              >
                ⚙️ AUDIO & SETTINGS
              </button>
              <button
                className="hud-btn btn-secondary"
                onClick={returnToMainMenu}
                style={{ padding: '12px', fontSize: '16px', color: '#ff66aa' }}
              >
                🏠 EXIT TO MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER SCREEN --- */}
      {gameOver && (
        <div className="modal-backdrop">
          <div className="hud-panel" style={{ padding: '40px', maxWidth: '480px', width: '90%', textAlign: 'center', border: '2px solid #ff3366', boxShadow: '0 0 35px rgba(255, 51, 102, 0.4)' }}>
            <h1 style={{ fontSize: '52px', color: '#ff3366', margin: '0 0 10px' }}>💔 GAME OVER</h1>
            <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '15px' }}>
              You ran out of hearts on Level {level}!
            </p>
            <div className="stat-pill" style={{ fontSize: '18px', padding: '8px 18px', margin: '0 auto 25px' }}>
              <span>🪙 Banked Coins:</span>
              <span>{savedData.totalCoins}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="hud-btn btn-accent" onClick={retryCurrentLevel} style={{ padding: '14px', fontSize: '18px' }}>
                🔄 RETRY LEVEL
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="hud-btn btn-secondary" onClick={() => setShowShop(true)} style={{ flex: 1, padding: '12px' }}>
                  🛒 SHOP UPGRADES
                </button>
                <button className="hud-btn btn-secondary" onClick={returnToMainMenu} style={{ flex: 1, padding: '12px' }}>
                  🏠 MAIN MENU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- END-OF-RUN SCOREBOARD (S / A / B / C RANK) --- */}
      {showComplete && !gameOver && (
        <ScoreboardModal
          level={level}
          score={score}
          targetCrystals={cfg.crystals}
          coins={coins}
          totalCoins={savedData.totalCoins}
          elapsedTime={levelElapsedTime}
          maxCombo={maxComboThisLevel}
          damageTaken={damageTakenThisLevel}
          heartsRemaining={hearts}
          isBestTime={
            !savedData.levelBestTimes?.[level] ||
            levelElapsedTime <= savedData.levelBestTimes[level]
          }
          bestTime={savedData.levelBestTimes?.[level]}
          onNextLevel={nextLevel}
          onRetry={retryCurrentLevel}
          onMainMenu={returnToMainMenu}
        />
      )}
    </div>
  );
};

export default CrystalCollectorGame;