import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadGameState, saveGameState } from './game/saveManager.js';
import { soundEngine } from './audio/soundEngine.js';
import { ParticleManager } from './game/particles.js';
import { BiomeGenerator } from './world/biomeGenerator.js';
import { CrystalTitanBoss } from './game/boss.js';
import { PetCompanion } from './game/pets.js';
import { CyberRunner } from './game/character.js';
import { HomeScreen } from './components/HomeScreen.jsx';
import { LevelSelectModal } from './components/LevelSelectModal.jsx';
import { HowToPlayModal } from './components/HowToPlayModal.jsx';
import { InGameHUD } from './components/InGameHUD.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { FieldManualModal } from './components/FieldManualModal.jsx';
import { ScoreboardModal } from './components/ScoreboardModal.jsx';
import './App.css';

const levelConfigs = [
  { crystals: 8, coins: 15, obs: 5, speed: 4, hearts: 2 },
  { crystals: 10, coins: 20, obs: 8, speed: 5, hearts: 2 },
  { crystals: 12, coins: 25, obs: 10, speed: 6, hearts: 3 },
  { crystals: 15, coins: 30, obs: 12, speed: 7, hearts: 3 },
  { crystals: 18, coins: 35, obs: 14, speed: 8, hearts: 3 },
  { crystals: 20, coins: 40, obs: 16, speed: 9, hearts: 4 },
  { crystals: 22, coins: 45, obs: 18, speed: 10, hearts: 4 },
  { crystals: 25, coins: 50, obs: 20, speed: 11, hearts: 4 },
  { crystals: 28, coins: 55, obs: 22, speed: 12, hearts: 5 },
  { crystals: 30, coins: 60, obs: 12, speed: 10, hearts: 5 } // Titan Guardian Boss Level!
];

const CrystalCollectorGame = () => {
  const mountRef = useRef(null);

  // Persistent user state
  const [savedData, setSavedData] = useState(() => loadGameState());
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
  const [pylonsDeactivated, setPylonsDeactivated] = useState(0);
  const [fps, setFps] = useState(60);

  // Combined frozen state: halts physics, obstacles, hazards, boss, and timers
  const isGameFrozen = isPaused || showFieldManual || showHowToPlay || showSettings || showShop || showAchievements || showLevelSelect || showComplete || gameOver;
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
  const radarDataRef = useRef({
    player: { x: 0, z: 0, rot: 0 },
    crystals: [],
    coins: [],
    jumpPads: [],
    hazards: [],
    obstacles: [],
    boss: null
  });
  const [shopTab, setShopTab] = useState('colors'); // 'colors', 'hats', 'pets', 'trails', 'upgrades'
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
      if (type === 'color') {
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

    // Reset level timers and grant 3s spawn protection
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
    setHearts(savedDataRef.current.upgrades?.maxHearts || 3);
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
    setHearts(savedDataRef.current.upgrades?.maxHearts || 3);
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
    const { biome, decorations, jumpPads, hazardZones, platforms } = biomeEnv;
    scene.background = new THREE.Color(biome.skyColor);

    if (biome.fog) {
      scene.fog = new THREE.Fog(biome.fog.color, biome.fog.near, biome.fog.far);
    }

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const isUltra = (currentSaved.graphicsQuality || 'ultra') === 'ultra';
    const isHigh = (currentSaved.graphicsQuality || 'ultra') === 'high';
    const shadowsEnabled = isUltra || isHigh;

    renderer.shadowMap.enabled = shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountNode.appendChild(renderer.domElement);

    // Particle VFX Engine
    const particleManager = new ParticleManager(scene);

    // Dynamic Environmental Lighting (Hemisphere + Directional + Soft Shadows)
    const hemiLight = new THREE.HemisphereLight(biome.skyColor, biome.groundColor, 0.75);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    dirLight.position.set(16, 26, 16);
    dirLight.castShadow = shadowsEnabled;
    dirLight.shadow.mapSize.width = isUltra ? 2048 : 1024;
    dirLight.shadow.mapSize.height = isUltra ? 2048 : 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 70;
    dirLight.shadow.camera.left = -28;
    dirLight.shadow.camera.right = 28;
    dirLight.shadow.camera.top = 28;
    dirLight.shadow.camera.bottom = -28;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // Ground Floor with PBR Texture
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: biome.groundColor,
        roughness: 0.85,
        metalness: 0.1
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(50, 25, 0x555555, 0x222222);
    grid.position.y = 0.01;
    scene.add(grid);

    // Boundary Walls
    [[0, 2.5, -25], [0, 2.5, 25], [-25, 2.5, 0], [25, 2.5, 0]].forEach((pos, i) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(50, 5, 1),
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

    // Spawn Crystals (Ground and High-Altitude Sky Islands)
    for (let i = 0; i < cfg.crystals; i++) {
      let posX, posY = 1.2, posZ;
      if (platforms && platforms.length > 0 && i < platforms.length) {
        const p = platforms[i];
        posX = p.x + (Math.random() - 0.5) * (p.width - 2.5);
        posY = p.topY + 1.2;
        posZ = p.z + (Math.random() - 0.5) * (p.depth - 2.5);
      } else {
        const angle = (i / cfg.crystals) * Math.PI * 2;
        const r = 8 + Math.random() * 11;
        posX = Math.cos(angle) * r;
        posZ = Math.sin(angle) * r;
      }
      const isRainbow = Math.random() < 0.15; // 15% chance for Rainbow Fever Crystal!

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.85),
        new THREE.MeshPhysicalMaterial({
          color: isRainbow ? 0xff00ff : 0x00f0ff,
          emissive: isRainbow ? 0xff00bb : 0x00aacc,
          emissiveIntensity: 0.8,
          roughness: 0.12,
          metalness: 0.18,
          transmission: 0.55,
          transparent: true,
          opacity: 0.92,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        })
      );
      crystal.position.set(posX, posY, posZ);
      crystal.castShadow = true;
      scene.add(crystal);
      crystals.push({ mesh: crystal, collected: false, isRainbow });
    }

    // Spawn Coins (Ground and Elevated Sky Decks)
    for (let i = 0; i < cfg.coins; i++) {
      let cX, cY = 1, cZ;
      if (platforms && platforms.length > 0 && i < platforms.length * 2) {
        const p = platforms[i % platforms.length];
        cX = p.x + (Math.random() - 0.5) * (p.width - 2);
        cY = p.topY + 1;
        cZ = p.z + (Math.random() - 0.5) * (p.depth - 2);
      } else {
        cX = (Math.random() - 0.5) * 40;
        cZ = (Math.random() - 0.5) * 40;
      }
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 24),
        new THREE.MeshStandardMaterial({
          color: 0xffd700,
          emissive: 0xff9900,
          emissiveIntensity: 0.25,
          metalness: 0.92,
          roughness: 0.18
        })
      );
      coin.position.set(cX, cY, cZ);
      coin.rotation.x = Math.PI / 2;
      coin.castShadow = true;
      scene.add(coin);
      coinObjs.push({ mesh: coin, collected: false });
    }

    // Spawn Health Hearts
    for (let i = 0; i < cfg.hearts; i++) {
      const heart = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x660000 })
      );
      const angle = (i / cfg.hearts) * Math.PI * 2 + Math.PI / 4;
      const r = 12 + Math.random() * 8;
      heart.position.set(Math.cos(angle) * r, 1, Math.sin(angle) * r);
      scene.add(heart);
      heartObjs.push({ mesh: heart, collected: false });
    }

    // Spawn Powerups (Shield, Magnet 🧲, Chrono Slow-Mo ⏳)
    const powerTypes = ['shield', 'magnet', 'slowmo'];
    powerTypes.forEach((type, idx) => {
      const pGroup = new THREE.Group();
      let pColor = 0x00ffff;
      if (type === 'magnet') pColor = 0xff0055;
      if (type === 'slowmo') pColor = 0xffd700;

      const pMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.2, 8, 16),
        new THREE.MeshPhongMaterial({ color: pColor, emissive: pColor, emissiveIntensity: 0.6 })
      );
      pGroup.add(pMesh);

      const angle = (idx / 3) * Math.PI * 2 + 1.0;
      const r = 13 + Math.random() * 6;
      pGroup.position.set(Math.cos(angle) * r, 1.4, Math.sin(angle) * r);
      scene.add(pGroup);
      powerupObjs.push({ mesh: pGroup, type, collected: false });
    });

    // Spawn Obstacles (unless boss stage)
    for (let i = 0; i < cfg.obs; i++) {
      const obs = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 0xff0044, emissive: 0x440011 })
      );
      const angle = (i / cfg.obs) * Math.PI * 2;
      obs.position.set(Math.cos(angle) * 7, 1.5, Math.sin(angle) * 7);
      scene.add(obs);
      obstacles.push({
        mesh: obs,
        velocity: { x: (Math.random() - 0.5) * cfg.speed, z: (Math.random() - 0.5) * cfg.speed },
        cooldown: 0
      });
    }

    // Boss Titan on Level 10
    if (level === 10) {
      bossInstance = new CrystalTitanBoss(scene);
    }

    // Player Character (Next-Gen CyberRunner Astronaut)
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
          if (showFieldManual) {
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
        if (isGrounded) {
          jumpVelocity = 12;
          isGrounded = false;
          canDoubleJump = true;
          soundEngine.playJump();
        } else if (canDoubleJump) {
          jumpVelocity = 13;
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
          if (c.mesh) c.mesh.rotation.y += dt * 1.5;
        });
        coinObjs.forEach(cn => {
          if (cn.mesh) cn.mesh.rotation.y += dt * 2;
        });

        particleManager.update(dt);
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
        return;
      }

      // If game is frozen (reading instructions/field manual, in menus, or paused), freeze all gameplay and render stationary scene
      if (isGameFrozenRef.current) {
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
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
      const moveSpeed = 8 * dt * (isSprinting && canSprint ? sprintSpeedMult : 1);

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

      player.position.x = Math.max(-23, Math.min(23, player.position.x + mx));
      player.position.z = Math.max(-23, Math.min(23, player.position.z + mz));

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
        jumpVelocity -= 35 * dt;
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
      let effectiveMagnetRadius = baseMagnetRadius;
      if (localMagnetTime > 0) effectiveMagnetRadius = 14.0;
      if (petInstance && petInstance.magnetReach > effectiveMagnetRadius) {
        effectiveMagnetRadius = petInstance.magnetReach;
      }

      // Collect Crystals
      crystals.forEach(c => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 2.5;

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

            const crystalColor = c.isRainbow ? 0xff00ff : 0x00ffff;
            particleManager.createBurst(c.mesh.position, crystalColor, 20, 8);

            if (c.isRainbow) {
              localFeverTime = 6;
              setFeverTime(6);
              soundEngine.playPowerup('fever');
              particleManager.createFloatingText(c.mesh.position, 'FEVER MODE! 🌈', '#ff00ff', 44);
              unlockAchievement('fever_master');
            } else {
              const pointsText = localCombo > 1 ? `+1 💎 (${localCombo}x)` : '+1 💎';
              particleManager.createFloatingText(c.mesh.position, pointsText, '#00ffff');
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
          cn.mesh.rotation.y += dt * 3;

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
            particleManager.createBurst(cn.mesh.position, 0xffd700, 12, 6);
            particleManager.createFloatingText(cn.mesh.position, '+1 🪙', '#ffd700');

            setCoins(prev => prev + 1);
            setSavedData(prev => {
              const nextTotal = prev.totalCoins + 1;
              if (nextTotal >= 100) unlockAchievement('coin_collector');
              return { ...prev, totalCoins: nextTotal };
            });
          }
        }
      });

      // Collect Hearts
      heartObjs.forEach(h => {
        if (!h.collected) {
          h.mesh.rotation.y += dt * 2;
          const distToPlayer = Math.hypot(h.mesh.position.x - player.position.x, h.mesh.position.z - player.position.z);
          const distY = Math.abs(h.mesh.position.y - (player.position.y + 1.0));
          if (distToPlayer < 1.6 && distY < 2.2) {
            h.collected = true;
            scene.remove(h.mesh);
            soundEngine.playPowerup('shield');
            particleManager.createBurst(h.mesh.position, 0xff0033, 16, 6);
            particleManager.createFloatingText(h.mesh.position, '+1 ❤️', '#ff0033');
            setHearts(prev => Math.min(currentSaved.upgrades?.maxHearts || 5, prev + 1));
          }
        }
      });

      // Collect Powerups (Shield, Magnet, Slow-Mo)
      powerupObjs.forEach(p => {
        if (!p.collected) {
          p.mesh.rotation.y += dt * 3;
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

      // Move Obstacles
      const slowMultiplier = localSlowMoTime > 0 ? 0.4 : 1.0;
      obstacles.forEach(o => {
        o.mesh.position.x += o.velocity.x * dt * slowMultiplier;
        o.mesh.position.z += o.velocity.z * dt * slowMultiplier;

        if (o.mesh.position.x > 23 || o.mesh.position.x < -23) o.velocity.x *= -1;
        if (o.mesh.position.z > 23 || o.mesh.position.z < -23) o.velocity.z *= -1;

        o.mesh.rotation.x += dt * 2 * slowMultiplier;
        o.mesh.rotation.y += dt * 2 * slowMultiplier;

        if (o.cooldown > 0) o.cooldown -= dt;

        const distToPlayer = Math.hypot(player.position.x - o.mesh.position.x, player.position.z - o.mesh.position.z);
        if (distToPlayer < 2.5 && o.cooldown <= 0 && player.position.y < 1.2) {
          if (spawnGraceRef.current > 0) {
            o.cooldown = 0.5;
            return; // 100% immune during spawn grace!
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
      });

      // Boss Logic on Level 10
      if (bossInstance) {
        // Check Pylon activation
        bossInstance.pylons.forEach(pylon => {
          if (!pylon.activated) {
            const d = Math.hypot(player.position.x - pylon.x, player.position.z - pylon.z);
            if (d < 2.6) {
              bossInstance.activatePylon(pylon.id, soundEngine, particleManager);
              setPylonsDeactivated(bossInstance.pylons.filter(p => p.activated).length);
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

      // Update Particle Systems
      particleManager.update(dt);

      // Update Holographic Radar Real-Time Detection
      radarDataRef.current.player.x = player.position.x;
      radarDataRef.current.player.z = player.position.z;
      radarDataRef.current.player.rot = mouseX;
      radarDataRef.current.crystals = crystals;
      radarDataRef.current.coins = coinObjs;
      radarDataRef.current.jumpPads = jumpPads;
      radarDataRef.current.hazards = hazardZones;
      radarDataRef.current.obstacles = obstacles;
      radarDataRef.current.boss = bossInstance;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
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
  }, [level, showComplete, gameOver, showLevelStart, currentScreen]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#05050f' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* --- HOME SCREEN --- */}
      {currentScreen === 'home' && (
        <HomeScreen
          savedData={savedData}
          onPlay={() => {
            setCurrentScreen('playing');
            setShowLevelStart(true);
          }}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenHowToPlay={() => setShowFieldManual(true)}
          onOpenSettings={() => setShowSettings(true)}
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
          bossState={{ pylonsDeactivated }}
          fps={fps}
          spawnGraceTime={spawnGraceTime}
          elapsedTime={levelElapsedTime}
          radarDataRef={radarDataRef}
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
              <div style={{ background: 'rgba(255,0,85,0.12)', border: '1px solid rgba(255,0,85,0.3)', padding: '16px', borderRadius: '14px', marginBottom: '25px', textAlign: 'left' }}>
                <p style={{ margin: '0 0 8px', color: '#ff66aa', fontWeight: 800 }}>⚠️ BOSS PROTOCOL:</p>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  1. Dodge rotating lasers & jump ground shockwaves.<br />
                  2. Sprint to all <strong>4 Power Pylons</strong> in the corners to collapse the forcefield.<br />
                  3. Collect the exposed <strong>Master Core Crystal</strong> to save the realm!
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '30px', color: '#ffd700' }}>🛒 ARCADE SHOP 2.0</h2>
              <div style={{ fontSize: '22px', color: '#ffd700', fontWeight: 'bold' }}>🪙 {savedData.totalCoins} Coins</div>
            </div>

            {/* Shop Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button className={`shop-tab-btn ${shopTab === 'colors' ? 'active' : ''}`} onClick={() => setShopTab('colors')}>🎨 Skins</button>
              <button className={`shop-tab-btn ${shopTab === 'hats' ? 'active' : ''}`} onClick={() => setShopTab('hats')}>🎩 3D Hats</button>
              <button className={`shop-tab-btn ${shopTab === 'pets' ? 'active' : ''}`} onClick={() => setShopTab('pets')}>🐾 Pets</button>
              <button className={`shop-tab-btn ${shopTab === 'trails' ? 'active' : ''}`} onClick={() => setShopTab('trails')}>✨ Trails</button>
              <button className={`shop-tab-btn ${shopTab === 'upgrades' ? 'active' : ''}`} onClick={() => setShopTab('upgrades')}>🏋️ Upgrades</button>
            </div>

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
                      <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '10px' }}>{owned ? 'OWNED' : `🪙 ${item.cost}`}</div>
                      {owned ? (
                        <button className="hud-btn" onClick={() => setSavedData(prev => ({ ...prev, currentPet: isEquipped ? null : item.id }))} style={{ background: isEquipped ? '#00f0ff' : '#00ff88', color: '#000', width: '100%', padding: '8px' }}>
                          {isEquipped ? 'DISMISS' : 'SUMMON'}
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
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>❤️ Vitality Boost (+1 Max Heart)</div>
                    <div style={{ color: '#aaa', fontSize: '13px' }}>Current: {savedData.upgrades?.maxHearts || 3} / 5 Hearts</div>
                  </div>
                  {(savedData.upgrades?.maxHearts || 3) < 5 ? (
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