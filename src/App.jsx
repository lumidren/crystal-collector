import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CrystalCollectorGame = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [stamina, setStamina] = useState(100);
  const staminaRef = useRef(100);
  const [showComplete, setShowComplete] = useState(false);
  const [showLevelStart, setShowLevelStart] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [playerColor, setPlayerColor] = useState('#00ff00');
  const [ownedColors, setOwnedColors] = useState(['#00ff00']);
  const [currentHat, setCurrentHat] = useState(null);
  const [ownedHats, setOwnedHats] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [showAchievements, setShowAchievements] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTime, setShieldTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const shopColors = [
    { name: 'Green', color: '#00ff00', cost: 0 },
    { name: 'Blue', color: '#0080ff', cost: 50 },
    { name: 'Red', color: '#ff0000', cost: 50 },
    { name: 'Purple', color: '#ff00ff', cost: 100 },
    { name: 'Gold', color: '#ffd700', cost: 150 }
  ];

  const shopHats = [
    { name: 'Baseball Cap', id: 'cap', cost: 0 },
    { name: 'Top Hat', id: 'tophat', cost: 100 },
    { name: 'Crown', id: 'crown', cost: 150 },
    { name: 'Santa Hat', id: 'santa', cost: 200 }
  ];

  const achievementsList = [
    { id: 'first_crystal', name: 'First Steps', desc: 'Collect your first crystal', icon: '💎' },
    { id: 'level_1', name: 'Beginner', desc: 'Complete Level 1', icon: '🏆' },
    { id: 'level_5', name: 'Halfway There', desc: 'Complete Level 5', icon: '⭐' },
    { id: 'level_10', name: 'Champion', desc: 'Complete Level 10', icon: '👑' },
    { id: 'coin_collector', name: 'Coin Collector', desc: 'Collect 100 coins', icon: '💰' }
  ];

  const playSound = (type) => {
    if (!soundEnabledRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'collect') {
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'coin') {
        osc.frequency.value = 1200;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      console.log('Audio not supported');
    }
  };

  const unlockAchievement = (id) => {
    if (!achievements[id]) {
      setAchievements(prev => ({...prev, [id]: true}));
      playSound('collect');
    }
  };

  const buyColor = (c, cost) => {
    if (totalCoins >= cost && !ownedColors.includes(c)) {
      setTotalCoins(prev => prev - cost);
      setOwnedColors([...ownedColors, c]);
      setPlayerColor(c);
      playSound('coin');
    }
  };

  const buyHat = (id, cost) => {
    if (totalCoins >= cost && !ownedHats.includes(id)) {
      setTotalCoins(prev => prev - cost);
      setOwnedHats([...ownedHats, id]);
      setCurrentHat(id);
      playSound('coin');
    }
  };

  const nextLevel = () => {
    playSound('collect');
    setShowComplete(false);
    setShowLevelStart(true);
    setLevel(prev => prev + 1);
    setScore(0);
    setCoins(0);
  };

  const retryCurrentLevel = () => {
    setGameOver(false);
    setShowLevelStart(true);
    setScore(0);
    setCoins(0);
    setHearts(3);
    setStamina(100);
    staminaRef.current = 100;
  };

  const restartGame = () => {
    setGameOver(false);
    setShowComplete(false);
    setShowLevelStart(true);
    setLevel(1);
    setScore(0);
    setCoins(0);
    setHearts(3);
    setStamina(100);
    staminaRef.current = 100;
    setShieldActive(false);
    setShieldTime(0);
  };

  useEffect(() => {
    if (!mountRef.current || showComplete || gameOver || showLevelStart) return;

    const mountNode = mountRef.current;
    let scene, camera, renderer, player;
    let crystals = [], coinObjs = [], obstacles = [], heartObjs = [], powerups = [];
    let animId;
    let mounted = true;
    let jumpVelocity = 0;
    let isGrounded = true;
    let damageThisLevel = false;
    let localShieldActive = false;
    let localShieldTime = 0;

    const levelConfigs = [
      { crystals: 8, coins: 15, obs: 5, speed: 4, hearts: 2, name: "Tutorial Valley" },
      { crystals: 10, coins: 20, obs: 8, speed: 5, hearts: 2, name: "Crystal Cavern" },
      { crystals: 12, coins: 25, obs: 10, speed: 6, hearts: 3, name: "Mystic Peaks" },
      { crystals: 15, coins: 30, obs: 12, speed: 7, hearts: 3, name: "Thunder Plains" },
      { crystals: 18, coins: 35, obs: 14, speed: 8, hearts: 3, name: "Frozen Tundra" },
      { crystals: 20, coins: 40, obs: 16, speed: 9, hearts: 4, name: "Lava Fields" },
      { crystals: 22, coins: 45, obs: 18, speed: 10, hearts: 4, name: "Sky Gardens" },
      { crystals: 25, coins: 50, obs: 20, speed: 11, hearts: 4, name: "Shadow Realm" },
      { crystals: 28, coins: 55, obs: 22, speed: 12, hearts: 5, name: "Cosmic Void" },
      { crystals: 30, coins: 60, obs: 25, speed: 13, hearts: 5, name: "FINAL GAUNTLET" }
    ];
    
    window.levelConfigs = levelConfigs;

    const cfg = levelConfigs[level - 1] || levelConfigs[0];

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountNode.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404040, 0.8));
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshPhongMaterial({ color: 0x3a5a40 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(50, 25, 0x555555, 0x333333);
    scene.add(grid);

    [[0,2.5,-25], [0,2.5,25], [-25,2.5,0], [25,2.5,0]].forEach((pos, i) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(50, 5, 1),
        new THREE.MeshPhongMaterial({ color: 0x8b4513 })
      );
      wall.position.set(...pos);
      if (i > 1) wall.rotation.y = Math.PI / 2;
      scene.add(wall);
    });

    for (let i = 0; i < cfg.crystals; i++) {
      const angle = (i / cfg.crystals) * Math.PI * 2;
      const r = 8 + Math.random() * 10;
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8),
        new THREE.MeshPhongMaterial({ color: 0x00ffff, emissive: 0x00aaaa })
      );
      crystal.position.set(Math.cos(angle) * r, 1, Math.sin(angle) * r);
      scene.add(crystal);
      crystals.push({ mesh: crystal, collected: false });
    }

    for (let i = 0; i < cfg.coins; i++) {
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16),
        new THREE.MeshPhongMaterial({ color: 0xffd700 })
      );
      coin.position.set((Math.random() - 0.5) * 40, 1, (Math.random() - 0.5) * 40);
      coin.rotation.x = Math.PI / 2;
      scene.add(coin);
      coinObjs.push({ mesh: coin, collected: false });
    }

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

    // Shield powerups - shield emoji style
    for (let i = 0; i < 2; i++) {
      const shieldGroup = new THREE.Group();
      
      // Shield shape - like 🛡️
      const shieldBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.7, 0.2, 6),
        new THREE.MeshPhongMaterial({ 
          color: 0x00ddff, 
          emissive: 0x0088ff,
          metalness: 0.8
        })
      );
      shieldBody.rotation.z = Math.PI;
      
      // Shield top point
      const shieldTop = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 0.4, 6),
        new THREE.MeshPhongMaterial({ 
          color: 0x00ddff, 
          emissive: 0x0088ff
        })
      );
      shieldTop.position.y = 0.3;
      
      // Shield bottom point
      const shieldBottom = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.5, 6),
        new THREE.MeshPhongMaterial({ 
          color: 0x00ddff, 
          emissive: 0x0088ff
        })
      );
      shieldBottom.position.y = -0.35;
      shieldBottom.rotation.z = Math.PI;
      
      // Center emblem
      const emblem = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        new THREE.MeshPhongMaterial({ 
          color: 0xffffff, 
          emissive: 0x00ffff
        })
      );
      emblem.position.z = 0.15;
      
      shieldGroup.add(shieldBody);
      shieldGroup.add(shieldTop);
      shieldGroup.add(shieldBottom);
      shieldGroup.add(emblem);
      
      const angle = (i / 2) * Math.PI * 2;
      const r = 10 + Math.random() * 10;
      shieldGroup.position.set(Math.cos(angle) * r, 1.5, Math.sin(angle) * r);
      shieldGroup.rotation.y = Math.PI / 4;
      scene.add(shieldGroup);
      powerups.push({ mesh: shieldGroup, collected: false });
    }

    for (let i = 0; i < cfg.obs; i++) {
      const obs = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x440000 })
      );
      const angle = (i / cfg.obs) * Math.PI * 2;
      obs.position.set(Math.cos(angle) * 5, 1.5, Math.sin(angle) * 5);
      scene.add(obs);
      obstacles.push({
        mesh: obs,
        velocity: { x: (Math.random() - 0.5) * cfg.speed, z: (Math.random() - 0.5) * cfg.speed },
        cooldown: 0
      });
    }

    player = new THREE.Group();
    const pCol = parseInt(playerColor.replace('#', '0x'));
    const mat = new THREE.MeshPhongMaterial({ color: pCol });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16), mat);
    body.position.y = 1.5;
    player.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mat);
    head.position.y = 2.8;
    player.add(head);

    const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 8), mat);
    lArm.position.set(-0.7, 1.5, 0);
    player.add(lArm);
    
    const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 8), mat);
    rArm.position.set(0.7, 1.5, 0);
    player.add(rArm);

    const lLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.2, 8), mat);
    lLeg.position.set(-0.25, 0.3, 0);
    player.add(lLeg);
    
    const rLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.2, 8), mat);
    rLeg.position.set(0.25, 0.3, 0);
    player.add(rLeg);

    // Add hat with animations
    let hatGroup = null;
    if (currentHat === 'cap') {
      hatGroup = new THREE.Group();
      hatGroup.position.y = 3.1;
      hatGroup.rotation.x = -0.1;
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.05, 0.6), 
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      visor.position.set(0, -0.05, 0.3);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5), 
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      dome.position.y = 0.05;
      const button = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      button.position.y = 0.35;
      hatGroup.add(visor);
      hatGroup.add(dome);
      hatGroup.add(button);
      player.add(hatGroup);
    } else if (currentHat === 'tophat') {
      hatGroup = new THREE.Group();
      hatGroup.position.y = 3.2;
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.08, 32), 
        new THREE.MeshPhongMaterial({ color: 0x000000 })
      );
      brim.position.y = 0;
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.9, 32), 
        new THREE.MeshPhongMaterial({ color: 0x000000 })
      );
      cylinder.position.y = 0.45;
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.05, 32), 
        new THREE.MeshPhongMaterial({ color: 0x000000 })
      );
      top.position.y = 0.92;
      const ribbon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), 
        new THREE.MeshPhongMaterial({ color: 0x8b0000 })
      );
      ribbon.position.y = 0.1;
      hatGroup.add(brim);
      hatGroup.add(cylinder);
      hatGroup.add(top);
      hatGroup.add(ribbon);
      player.add(hatGroup);
    } else if (currentHat === 'crown') {
      hatGroup = new THREE.Group();
      hatGroup.position.y = 3.25;
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.55, 0.25, 8), 
        new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0x443300 })
      );
      hatGroup.add(base);
      for (let i = 0; i < 8; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.45, 8), 
          new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0x443300 })
        );
        const angle = (i / 8) * Math.PI * 2;
        spike.position.set(Math.cos(angle) * 0.45, 0.35, Math.sin(angle) * 0.45);
        hatGroup.add(spike);
        
        const jewel = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshPhongMaterial({ color: i % 2 === 0 ? 0xff0000 : 0x0000ff, emissive: i % 2 === 0 ? 0x660000 : 0x000066 })
        );
        jewel.position.set(Math.cos(angle) * 0.45, 0.05, Math.sin(angle) * 0.45);
        hatGroup.add(jewel);
      }
      player.add(hatGroup);
    } else if (currentHat === 'santa') {
      hatGroup = new THREE.Group();
      hatGroup.position.y = 3.2;
      hatGroup.rotation.z = 0.15;
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 0.95, 16), 
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      cone.position.y = 0.35;
      const whiteRim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.52, 0.15, 16), 
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      whiteRim.position.y = -0.05;
      const pompom = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16), 
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      pompom.position.y = 0.85;
      pompom.position.x = 0.15;
      hatGroup.add(cone);
      hatGroup.add(whiteRim);
      hatGroup.add(pompom);
      player.add(hatGroup);
    }

    const shieldMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
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

    const keys = {};
    let mouseX = 0, camDist = 8;
    let pointerLocked = false;

    const onCanvasClick = () => {
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
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && isGrounded) {
        jumpVelocity = 12;
        isGrounded = false;
      }
    };
    const onKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    const onMouse = (e) => { 
      if (pointerLocked) {
        mouseX -= e.movementX * 0.003; 
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

    const clock = new THREE.Clock();

    const animate = () => {
      if (!mounted) return;
      
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      if (localShieldActive) {
        localShieldTime = Math.max(0, localShieldTime - dt);
        if (localShieldTime <= 0) {
          localShieldActive = false;
          setShieldActive(false);
          if (shieldMesh) shieldMesh.visible = false;
        } else {
          setShieldTime(localShieldTime);
        }
        
        if (shieldMesh && localShieldActive) {
          shieldMesh.visible = true;
          shieldMesh.rotation.y += dt * 2;
          shieldMesh.rotation.x += dt * 0.5;
          const pulse = 0.25 + Math.sin(t * 5) * 0.1;
          shieldMesh.material.opacity = pulse;
          shieldMesh.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
        }
      }

      setStamina(prev => {
        const isSprinting = keys['shift'] && (keys['w'] || keys['s'] || keys['a'] || keys['d']);
        let newStamina;
        if (isSprinting) {
          newStamina = Math.max(0, prev - dt * 25);
        } else {
          newStamina = Math.min(100, prev + dt * 15);
        }
        staminaRef.current = newStamina;
        return newStamina;
      });

      const canSprint = staminaRef.current > 5;
      const spd = 8 * dt * (keys['shift'] && canSprint ? 1.8 : 1);
      let mx = 0, mz = 0, moving = false;

      if (keys['w']) { mx -= Math.sin(mouseX) * spd; mz -= Math.cos(mouseX) * spd; moving = true; }
      if (keys['s']) { mx += Math.sin(mouseX) * spd; mz += Math.cos(mouseX) * spd; moving = true; }
      if (keys['a']) { mx -= Math.cos(mouseX) * spd; mz += Math.sin(mouseX) * spd; moving = true; }
      if (keys['d']) { mx += Math.cos(mouseX) * spd; mz += Math.sin(mouseX) * spd; moving = true; }

      player.position.x = Math.max(-23, Math.min(23, player.position.x + mx));
      player.position.z = Math.max(-23, Math.min(23, player.position.z + mz));

      if (!isGrounded) {
        jumpVelocity -= 35 * dt;
        player.position.y += jumpVelocity * dt;
        if (player.position.y <= 0) {
          player.position.y = 0;
          jumpVelocity = 0;
          isGrounded = true;
        }
      }

      if (moving) {
        player.rotation.y = Math.atan2(mx, mz);
        const rs = t * 12;
        body.position.y = 1.5 + Math.sin(rs) * 0.1;
        lArm.rotation.x = Math.sin(rs) * 0.6;
        rArm.rotation.x = -Math.sin(rs) * 0.6;
        lLeg.rotation.x = Math.sin(rs) * 1.2;
        rLeg.rotation.x = -Math.sin(rs) * 1.2;
        
        // Animate hat when moving
        if (hatGroup) {
          hatGroup.rotation.z = Math.sin(rs) * 0.08;
          hatGroup.position.y = 3.1 + Math.sin(rs) * 0.05;
        }
      } else {
        // Reset hat position when idle
        if (hatGroup) {
          hatGroup.rotation.z = 0;
          if (currentHat === 'cap') hatGroup.position.y = 3.1;
          else if (currentHat === 'tophat') hatGroup.position.y = 3.2;
          else if (currentHat === 'crown') hatGroup.position.y = 3.25;
          else if (currentHat === 'santa') hatGroup.position.y = 3.2;
        }
      }

      camera.position.x = player.position.x + Math.sin(mouseX) * camDist;
      camera.position.z = player.position.z + Math.cos(mouseX) * camDist;
      camera.position.y = player.position.y + 6;
      camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

      crystals.forEach((c, i) => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 2;
          c.mesh.position.y = 1 + Math.sin(t * 2 + i) * 0.3;
          if (player.position.distanceTo(new THREE.Vector3(c.mesh.position.x, 0, c.mesh.position.z)) < 2) {
            c.collected = true;
            scene.remove(c.mesh);
            playSound('collect');
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore === 1) unlockAchievement('first_crystal');
              if (newScore === cfg.crystals) {
                setTimeout(() => {
                  setShowComplete(true);
                  if (!damageThisLevel) unlockAchievement('no_damage');
                  if (level === 1) unlockAchievement('level_1');
                  if (level === 5) unlockAchievement('level_5');
                  if (level === 10) unlockAchievement('level_10');
                }, 100);
              }
              return newScore;
            });
          }
        }
      });

      coinObjs.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 3;
          if (player.position.distanceTo(new THREE.Vector3(c.mesh.position.x, 0, c.mesh.position.z)) < 1.5) {
            c.collected = true;
            scene.remove(c.mesh);
            playSound('coin');
            setCoins(prev => prev + 1);
            setTotalCoins(prev => {
              const newTotal = prev + 1;
              if (newTotal >= 100) unlockAchievement('coin_collector');
              return newTotal;
            });
          }
        }
      });

      heartObjs.forEach((h) => {
        if (!h.collected) {
          h.mesh.rotation.y += dt * 2;
          if (player.position.distanceTo(new THREE.Vector3(h.mesh.position.x, 0, h.mesh.position.z)) < 1.5) {
            h.collected = true;
            scene.remove(h.mesh);
            playSound('collect');
            setHearts(prev => prev + 1);
          }
        }
      });

      powerups.forEach((p) => {
        if (!p.collected) {
          // Rotate the shield
          p.mesh.rotation.y += dt * 2;
          // Float up and down
          p.mesh.position.y = 1.5 + Math.sin(t * 2) * 0.3;
          // Tilt slightly for dynamic look
          p.mesh.rotation.x = Math.sin(t * 1.5) * 0.2;
          
          // Make shield glow
          p.mesh.children.forEach(child => {
            if (child.material && child.material.emissive) {
              const glowIntensity = Math.sin(t * 5) * 0.3;
              child.material.emissive.setRGB(0, 0.5 + glowIntensity, 1);
            }
          });
          
          if (player.position.distanceTo(new THREE.Vector3(p.mesh.position.x, 0, p.mesh.position.z)) < 1.5) {
            p.collected = true;
            scene.remove(p.mesh);
            playSound('collect');
            localShieldActive = true;
            localShieldTime = 10;
            setShieldActive(true);
            setShieldTime(10);
          }
        }
      });

      obstacles.forEach((o) => {
        o.mesh.position.x += o.velocity.x * dt;
        o.mesh.position.z += o.velocity.z * dt;
        
        if (o.mesh.position.x > 23 || o.mesh.position.x < -23) o.velocity.x *= -1;
        if (o.mesh.position.z > 23 || o.mesh.position.z < -23) o.velocity.z *= -1;
        
        o.mesh.rotation.x += dt * 2;
        o.mesh.rotation.y += dt * 2;

        if (o.cooldown > 0) o.cooldown -= dt;
        
        if (player.position.distanceTo(new THREE.Vector3(o.mesh.position.x, 0, o.mesh.position.z)) < 2.5 && o.cooldown <= 0) {
          if (!localShieldActive) {
            o.cooldown = 2;
            damageThisLevel = true;
            setHearts(prev => {
              const newHearts = prev - 1;
              if (newHearts <= 0) {
                setTimeout(() => setGameOver(true), 100);
              }
              return newHearts;
            });
          } else {
            o.cooldown = 0.5;
          }
        }
      });

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
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', onCanvasClick);
      }
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }
      
      if (scene) {
        scene.traverse((obj) => {
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
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, [level, showComplete, gameOver, showLevelStart, playerColor, currentHat]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {showLevelStart && !gameOver && !showComplete && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.9)', padding: '40px', borderRadius: '20px',
            textAlign: 'center', maxWidth: '500px', border: '3px solid #0ff'
          }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px', color: '#00ffff' }}>
              💎 LEVEL {level} 💎
            </h1>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>❤️ Hearts: {hearts}</div>
            <div style={{ fontSize: '18px', marginBottom: '20px', color: '#ffd700' }}>💰 Coins: {totalCoins}</div>
            <button onClick={() => setShowLevelStart(false)} style={{
              padding: '20px 50px', fontSize: '24px', 
              background: '#00ff00',
              border: 'none', borderRadius: '15px', cursor: 'pointer', 
              fontWeight: 'bold', color: 'black', width: '100%'
            }}>▶️ START</button>
          </div>
        </div>
      )}
      
      {!showComplete && !gameOver && !showLevelStart && (
        <>
          <div style={{
            position: 'absolute', top: 20, left: 20, color: 'white',
            fontSize: '18px', textShadow: '2px 2px 4px black', background: 'rgba(0,0,0,0.8)',
            padding: '20px', borderRadius: '15px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Level {level}</div>
            <div>💎 {score}</div>
            <div style={{ color: '#ffd700' }}>🪙 {coins}</div>
            <div style={{ fontSize: '24px', marginTop: '5px' }}>
              {[...Array(hearts)].map((_, i) => <span key={i}>❤️</span>)}
            </div>
            {shieldActive && (
              <div style={{ marginTop: '10px', color: '#00ffff', fontWeight: 'bold' }}>
                🛡️ {Math.ceil(shieldTime)}s
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>⚡ Stamina</div>
              <div style={{ width: '150px', height: '12px', background: '#333', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${stamina}%`, height: '100%', background: stamina > 30 ? '#00ff00' : '#ff4444', transition: 'width 0.1s' }}></div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button onClick={() => setShowShop(true)} style={{
              padding: '15px 25px', fontSize: '20px', background: '#ffd700', border: 'none', 
              borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
            }}>🛒 SHOP</button>
            
            <button onClick={() => setShowAchievements(true)} style={{
              padding: '15px 25px', fontSize: '20px', background: '#9d4edd', border: 'none', 
              borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white'
            }}>🏆 BADGES</button>

            <button onClick={() => setSoundEnabled(!soundEnabled)} style={{
              padding: '12px 20px', fontSize: '18px',
              background: soundEnabled ? '#4CAF50' : '#f44336',
              border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white'
            }}>{soundEnabled ? '🔊' : '🔇'}</button>
          </div>

          <div style={{
            position: 'absolute', bottom: 20, left: 20, color: 'white',
            fontSize: '14px', textShadow: '2px 2px 4px black', background: 'rgba(0,0,0,0.7)',
            padding: '15px', borderRadius: '10px'
          }}>
            <div><strong>WASD</strong> - Move</div>
            <div><strong>Shift</strong> - Sprint</div>
            <div><strong>Space</strong> - Jump</div>
            <div><strong>Click screen</strong> - Enable mouse look</div>
            <div><strong>Esc</strong> - Release mouse</div>
          </div>
        </>
      )}

      {showShop && !showComplete && !gameOver && !showLevelStart && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '30px', borderRadius: '20px',
            maxWidth: '700px', width: '90%', maxHeight: '85vh', overflowY: 'auto',
            color: 'white', border: '3px solid #ffd700', boxShadow: '0 0 30px rgba(255,215,0,0.3)'
          }}>
            <h2 style={{ textAlign: 'center', marginTop: 0, fontSize: '32px', color: '#ffd700' }}>🛒 SHOP</h2>
            <p style={{ textAlign: 'center', color: '#ffd700', fontSize: '28px', marginBottom: '30px', background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px' }}>
              💰 {totalCoins} Coins
            </p>

            <h3 style={{ color: '#00ffff', marginBottom: '15px', fontSize: '24px' }}>🎨 Character Colors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              {shopColors.map((item) => {
                const owned = ownedColors.includes(item.color);
                const isEquipped = playerColor === item.color;
                const canBuy = totalCoins >= item.cost && !owned;
                return (
                  <div key={item.color} style={{
                    background: isEquipped ? 'linear-gradient(135deg, #2a4a2a, #1a3a1a)' : '#2a2a2a',
                    padding: '15px', borderRadius: '12px',
                    textAlign: 'center', 
                    border: isEquipped ? '3px solid #00ff00' : owned ? '2px solid #555' : '1px solid #444',
                    transition: 'transform 0.2s',
                    cursor: owned ? 'pointer' : 'default',
                    boxShadow: isEquipped ? '0 0 15px rgba(0,255,0,0.3)' : 'none'
                  }}
                  onClick={() => owned && setPlayerColor(item.color)}
                  onMouseEnter={(e) => owned && (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => owned && (e.currentTarget.style.transform = 'scale(1)')}>
                    <div style={{
                      width: '70px', height: '70px', background: item.color,
                      margin: '0 auto 10px', borderRadius: '50%', border: '4px solid white',
                      boxShadow: `0 0 20px ${item.color}`
                    }}></div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{item.name}</div>
                    <div style={{ color: owned ? '#00ff00' : '#ffd700', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                      {owned ? '✓ OWNED' : `🪙 ${item.cost}`}
                    </div>
                    {!owned && (
                      <button onClick={(e) => {e.stopPropagation(); buyColor(item.color, item.cost);}} disabled={!canBuy} style={{
                        padding: '8px 15px', width: '100%',
                        background: canBuy ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : '#555',
                        border: 'none', borderRadius: '8px',
                        cursor: canBuy ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold', color: 'black',
                        opacity: canBuy ? 1 : 0.5,
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => canBuy && (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => canBuy && (e.target.style.transform = 'scale(1)')}>
                        BUY NOW
                      </button>
                    )}
                    {owned && !isEquipped && (
                      <div style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>Click to equip</div>
                    )}
                    {isEquipped && (
                      <div style={{ color: '#00ff00', fontSize: '14px', marginTop: '5px', fontWeight: 'bold' }}>✓ EQUIPPED</div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 style={{ color: '#ff69b4', marginBottom: '15px', fontSize: '24px' }}>🎩 Hats Collection</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              {shopHats.map((item) => {
                const owned = ownedHats.includes(item.id) || item.cost === 0;
                const isEquipped = currentHat === item.id;
                const canBuy = totalCoins >= item.cost && !owned;
                return (
                  <div key={item.id} style={{
                    background: isEquipped ? 'linear-gradient(135deg, #4a2a4a, #3a1a3a)' : '#2a2a2a',
                    padding: '15px', borderRadius: '12px',
                    textAlign: 'center', 
                    border: isEquipped ? '3px solid #ff69b4' : owned ? '2px solid #555' : '1px solid #444',
                    transition: 'transform 0.2s',
                    cursor: owned ? 'pointer' : 'default',
                    boxShadow: isEquipped ? '0 0 15px rgba(255,105,180,0.3)' : 'none'
                  }}
                  onClick={() => owned && setCurrentHat(item.id)}
                  onMouseEnter={(e) => owned && (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => owned && (e.currentTarget.style.transform = 'scale(1)')}>
                    <div style={{ fontSize: '50px', marginBottom: '10px', filter: owned ? 'none' : 'grayscale(100%)' }}>
                      {item.id === 'cap' ? '🧢' : item.id === 'tophat' ? '🎩' : item.id === 'crown' ? '👑' : '🎅'}
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{item.name}</div>
                    <div style={{ color: owned ? '#00ff00' : item.cost === 0 ? '#00ff00' : '#ffd700', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                      {owned ? '✓ OWNED' : item.cost === 0 ? 'FREE!' : `🪙 ${item.cost}`}
                    </div>
                    {!owned && item.cost > 0 && (
                      <button onClick={(e) => {e.stopPropagation(); buyHat(item.id, item.cost);}} disabled={!canBuy} style={{
                        padding: '8px 15px', width: '100%',
                        background: canBuy ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : '#555',
                        border: 'none', borderRadius: '8px',
                        cursor: canBuy ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold', color: 'black',
                        opacity: canBuy ? 1 : 0.5,
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => canBuy && (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => canBuy && (e.target.style.transform = 'scale(1)')}>
                        BUY NOW
                      </button>
                    )}
                    {owned && !isEquipped && (
                      <div style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>Click to equip</div>
                    )}
                    {isEquipped && (
                      <div style={{ color: '#ff69b4', fontSize: '14px', marginTop: '5px', fontWeight: 'bold' }}>✓ EQUIPPED</div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowShop(false)} style={{
              width: '100%', padding: '15px', fontSize: '20px',
              background: 'linear-gradient(135deg, #ff0000, #cc0000)', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: 'bold', color: 'white',
              transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(255,0,0,0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              ✖ CLOSE SHOP
            </button>
          </div>
        </div>
      )}

      {showAchievements && !showComplete && !gameOver && !showLevelStart && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            background: '#1a1a1a', padding: '30px', borderRadius: '20px',
            maxWidth: '500px', width: '90%', color: 'white', border: '3px solid #9d4edd'
          }}>
            <h2 style={{ textAlign: 'center', marginTop: 0 }}>🏆 ACHIEVEMENTS</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {achievementsList.map((ach) => (
                <div key={ach.id} style={{
                  background: achievements[ach.id] ? '#2d4a2b' : '#2a2a2a',
                  padding: '15px', marginBottom: '10px', borderRadius: '10px',
                  border: achievements[ach.id] ? '2px solid #00ff00' : '1px solid #444'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '5px' }}>{ach.icon}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{ach.name}</div>
                  <div style={{ fontSize: '14px', color: '#aaa' }}>{ach.desc}</div>
                  {achievements[ach.id] && (
                    <div style={{ color: '#00ff00', marginTop: '5px', fontSize: '12px' }}>✓ UNLOCKED</div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setShowAchievements(false)} style={{
              width: '100%', padding: '15px', fontSize: '18px', marginTop: '20px',
              background: '#ff0000', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontWeight: 'bold', color: 'white'
            }}>✖ CLOSE</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 1000
        }}>
          <h1 style={{ fontSize: '60px', marginBottom: '20px', color: '#ff0000' }}>💔 GAME OVER</h1>
          <p style={{ fontSize: '24px' }}>Level {level}</p>
          <p style={{ fontSize: '20px', color: '#ffd700' }}>Total Coins: {totalCoins}</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button onClick={retryCurrentLevel} style={{
              padding: '20px 40px', fontSize: '20px', background: '#ff9900',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
            }}>🔄 RETRY</button>
            <button onClick={restartGame} style={{
              padding: '20px 40px', fontSize: '20px', background: '#00ff00',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
            }}>🔁 RESTART</button>
          </div>
        </div>
      )}

      {showComplete && !gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 1000
        }}>
          <h1 style={{ fontSize: '60px', marginBottom: '20px' }}>🎉 COMPLETE!</h1>
          <p style={{ fontSize: '28px' }}>Crystals: {score}</p>
          <p style={{ fontSize: '24px', color: '#ffd700' }}>Coins: {coins}</p>
          {level < 10 ? (
            <button onClick={nextLevel} style={{
              marginTop: '30px', padding: '20px 40px', fontSize: '24px', background: '#00ff00',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
            }}>NEXT LEVEL ➡️</button>
          ) : (
            <>
              <h2 style={{ fontSize: '40px', marginTop: '30px', color: '#ffd700' }}>🏆 YOU WIN! 🏆</h2>
              <button onClick={restartGame} style={{
                marginTop: '30px', padding: '20px 40px', fontSize: '24px', background: '#00ff00',
                border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
              }}>PLAY AGAIN</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CrystalCollectorGame;