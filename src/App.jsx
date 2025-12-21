import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CrystalCollectorGame = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [stamina, setStamina] = useState(100);
  const [isJumping, setIsJumping] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showLevelStart, setShowLevelStart] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [retryLevel, setRetryLevel] = useState(null);

  const nextLevel = () => {
    setShowComplete(false);
    setShowLevelStart(true);
    setLevel(prev => prev + 1);
    setScore(0);
    setCoins(0);
    setGameOver(false);
  };

  const retryCurrentLevel = () => {
    setGameOver(false);
    setRetryLevel(null);
    setShowLevelStart(true);
    setScore(0);
    setCoins(0);
    setHearts(3);
    setStamina(100);
    setIsJumping(false);
  };

  const startLevel = () => {
    setShowLevelStart(false);
  };

  useEffect(() => {
    if (!mountRef.current || showComplete || gameOver || showLevelStart) return;

    let scene, camera, renderer, player;
    let crystals = [], coinObjs = [], obstacles = [], heartObjs = [];
    let animId;
    let mounted = true;
    let jumpVelocity = 0;
    let isGrounded = true;

    const cfg = {
      1: { crystals: 8, coins: 15, obs: 7, speed: 5, hearts: 2, name: "Tutorial Valley" },
      2: { crystals: 12, coins: 25, obs: 12, speed: 7, hearts: 3, name: "Crystal Cavern" },
      3: { crystals: 16, coins: 35, obs: 16, speed: 9, hearts: 3, name: "Mystic Peaks" },
      4: { crystals: 25, coins: 50, obs: 20, speed: 12, hearts: 4, name: "HELL'S GAUNTLET" }
    }[level];

    scene = new THREE.Scene();
    scene.background = new THREE.Color(level === 4 ? 0x1a0000 : 0x1a1a2e);
    
    if (level === 4) {
      scene.fog = new THREE.Fog(0x330000, 10, 40);
    }

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404040, 0.8));
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshPhongMaterial({ color: level === 4 ? 0x330000 : 0x3a5a40 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(50, 25, level === 4 ? 0xff0000 : 0x555555, level === 4 ? 0x880000 : 0x333333);
    grid.position.y = 0.01;
    scene.add(grid);

    [[0,2.5,-25], [0,2.5,25], [-25,2.5,0], [25,2.5,0]].forEach((pos, i) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(50, 5, 1),
        new THREE.MeshPhongMaterial({ color: 0x8b4513 })
      );
      wall.position.set(...pos);
      if (i > 1) wall.rotation.y = Math.PI / 2;
      wall.castShadow = true;
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
      crystal.castShadow = true;
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
      coin.castShadow = true;
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
      heart.castShadow = true;
      scene.add(heart);
      heartObjs.push({ mesh: heart, collected: false });
    }

    for (let i = 0; i < cfg.obs; i++) {
      const obs = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x440000 })
      );
      const angle = (i / cfg.obs) * Math.PI * 2;
      obs.position.set(Math.cos(angle) * 5, 1.5, Math.sin(angle) * 5);
      obs.castShadow = true;
      scene.add(obs);
      
      obstacles.push({
        mesh: obs,
        velocity: { x: (Math.random() - 0.5) * cfg.speed, z: (Math.random() - 0.5) * cfg.speed },
        cooldown: 0,
        changeDirectionTimer: Math.random() * 3
      });
    }

    player = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), mat);
    body.position.y = 1;
    body.castShadow = true;
    body.receiveShadow = true;
    player.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat);
    head.position.y = 2.5;
    head.castShadow = true;
    head.receiveShadow = true;
    player.add(head);

    player.position.set(0, 0, 8);
    scene.add(player);

    const keys = {};
    let mouseX = 0, camDist = 8;

    const onKeyDown = (e) => {
      e.preventDefault(); // Prevent default browser actions
      const key = e.key.toLowerCase();
      keys[key] = true;
      
      if (e.key === ' ' && isGrounded && !isJumping) {
        jumpVelocity = 12;
        isGrounded = false;
        setIsJumping(true);
      }
    };
    
    const onKeyUp = (e) => {
      e.preventDefault();
      const key = e.key.toLowerCase();
      keys[key] = false;
    };
    
    const onMouse = (e) => { mouseX -= e.movementX * 0.003; };
    
    const onWheel = (e) => {
      e.preventDefault();
      camDist = Math.max(3, Math.min(15, camDist + e.deltaY * 0.01));
    };

    // Use window instead of document for more reliable capture
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('mousemove', onMouse);
    document.addEventListener('wheel', onWheel, { passive: false });

    const clock = new THREE.Clock();

    let staminaValue = 100;

    const animate = () => {
      if (!mounted) return;
      
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // Stamina system - track locally for performance
      const isSprinting = keys['shift'] && (keys['w'] || keys['s'] || keys['a'] || keys['d']);
      if (isSprinting && staminaValue > 5) {
        staminaValue = Math.max(0, staminaValue - dt * 25);
      } else {
        staminaValue = Math.min(100, staminaValue + dt * 15);
      }
      setStamina(staminaValue);

      const canSprint = staminaValue > 5;
      const spd = 8 * dt * (keys['shift'] && canSprint ? 1.8 : 1);
      let mx = 0, mz = 0, moving = false;

      if (keys['w']) { mx -= Math.sin(mouseX) * spd; mz -= Math.cos(mouseX) * spd; moving = true; }
      if (keys['s']) { mx += Math.sin(mouseX) * spd; mz += Math.cos(mouseX) * spd; moving = true; }
      if (keys['a']) { mx -= Math.cos(mouseX) * spd; mz += Math.sin(mouseX) * spd; moving = true; }
      if (keys['d']) { mx += Math.cos(mouseX) * spd; mz -= Math.sin(mouseX) * spd; moving = true; }

      player.position.x = Math.max(-23, Math.min(23, player.position.x + mx));
      player.position.z = Math.max(-23, Math.min(23, player.position.z + mz));

      if (!isGrounded) {
        jumpVelocity -= 35 * dt;
        player.position.y += jumpVelocity * dt;
        
        if (player.position.y <= 0) {
          player.position.y = 0;
          jumpVelocity = 0;
          isGrounded = true;
          setIsJumping(false);
        }
      }

      if (moving) {
        player.rotation.y = Math.atan2(mx, mz);
        const bobSpeed = keys['shift'] && canSprint ? 20 : 12;
        body.position.y = 1 + Math.sin(t * bobSpeed) * 0.1;
        head.position.y = 2.5 + Math.sin(t * bobSpeed) * 0.08;
      } else {
        body.position.y = 1;
        head.position.y = 2.5;
      }

      camera.position.x = player.position.x + Math.sin(mouseX) * camDist;
      camera.position.z = player.position.z + Math.cos(mouseX) * camDist;
      camera.position.y = player.position.y + 5;
      camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);

      crystals.forEach((c, i) => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 2;
          c.mesh.position.y = 1 + Math.sin(t * 2 + i) * 0.3;
          if (player.position.distanceTo(new THREE.Vector3(c.mesh.position.x, player.position.y, c.mesh.position.z)) < 2) {
            c.collected = true;
            scene.remove(c.mesh);
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore === cfg.crystals) {
                setTimeout(() => setShowComplete(true), 100);
              }
              return newScore;
            });
          }
        }
      });

      coinObjs.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 3;
          if (player.position.distanceTo(new THREE.Vector3(c.mesh.position.x, player.position.y, c.mesh.position.z)) < 1.5) {
            c.collected = true;
            scene.remove(c.mesh);
            setCoins(prev => prev + 1);
          }
        }
      });

      heartObjs.forEach((h, i) => {
        if (!h.collected) {
          h.mesh.rotation.y += dt * 2;
          h.mesh.position.y = 1 + Math.sin(t * 2 + i * 0.5) * 0.2;
          const scale = 1 + Math.sin(t * 3 + i) * 0.15;
          h.mesh.scale.set(scale, scale, scale);
          
          if (player.position.distanceTo(new THREE.Vector3(h.mesh.position.x, player.position.y, h.mesh.position.z)) < 1.5) {
            h.collected = true;
            scene.remove(h.mesh);
            setHearts(prev => prev + 1);
          }
        }
      });

      obstacles.forEach((o) => {
        o.mesh.position.x += o.velocity.x * dt;
        o.mesh.position.z += o.velocity.z * dt;
        
        if (o.mesh.position.x > 23 || o.mesh.position.x < -23) {
          o.velocity.x *= -1;
          o.mesh.position.x = Math.max(-23, Math.min(23, o.mesh.position.x));
        }
        if (o.mesh.position.z > 23 || o.mesh.position.z < -23) {
          o.velocity.z *= -1;
          o.mesh.position.z = Math.max(-23, Math.min(23, o.mesh.position.z));
        }
        
        o.changeDirectionTimer -= dt;
        if (o.changeDirectionTimer <= 0) {
          o.velocity.x = (Math.random() - 0.5) * cfg.speed * 2;
          o.velocity.z = (Math.random() - 0.5) * cfg.speed * 2;
          o.changeDirectionTimer = 2 + Math.random() * 3;
        }
        
        o.mesh.rotation.x += dt * 2;
        o.mesh.rotation.y += dt * 2;

        if (o.cooldown > 0) o.cooldown -= dt;
        const playerGroundPos = new THREE.Vector3(player.position.x, 0, player.position.z);
        const obstacleGroundPos = new THREE.Vector3(o.mesh.position.x, 0, o.mesh.position.z);
        
        if (playerGroundPos.distanceTo(obstacleGroundPos) < 2.5 && o.cooldown <= 0 && player.position.y < 1) {
          o.cooldown = 2;
          o.mesh.material.emissive.setHex(0xff0000);
          
          setHearts(prev => {
            const newHearts = prev - 1;
            if (newHearts <= 0) {
              setTimeout(() => {
                setGameOver(true);
                setRetryLevel(level);
              }, 100);
            }
            return newHearts;
          });
          
          setTimeout(() => { 
            if (o.mesh) o.mesh.material.emissive.setHex(0x440000); 
          }, 300);
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
      
      // Remove event listeners with same options
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      
      if (scene) {
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
          }
        });
      }
      
      if (renderer && mountRef.current) {
        try {
          mountRef.current.removeChild(renderer.domElement);
          renderer.dispose();
        } catch (e) {}
      }
    };
  }, [level, showComplete, gameOver, showLevelStart]);

  const getTotalCrys = () => level === 1 ? 8 : level === 2 ? 12 : level === 3 ? 16 : 25;
  const getLevelName = () => level === 1 ? 'Tutorial Valley' : level === 2 ? 'Crystal Cavern' : level === 3 ? 'Mystic Peaks' : "HELL'S GAUNTLET";

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {showLevelStart && !gameOver && !showComplete && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: level === 4 ? 'linear-gradient(135deg, #1a0000, #660000)' : 'linear-gradient(135deg, #1a1a2e, #0f3460)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          fontFamily: 'Arial', zIndex: 1000, overflow: 'auto', padding: '20px'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.8)', padding: '30px', borderRadius: '20px',
            textAlign: 'center', maxWidth: '500px', width: '100%', border: level === 4 ? '3px solid #ff0000' : '3px solid #0ff',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h1 style={{ fontSize: '48px', marginBottom: '15px', color: level === 4 ? '#ff0000' : '#00ffff' }}>
              {level === 4 ? '🔥' : '💎'} LEVEL {level} {level === 4 ? '🔥' : '💎'}
            </h1>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>{getLevelName()}</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 'bold' }}>📊 Level Stats:</div>
              <div style={{ fontSize: '16px', marginBottom: '5px' }}>💎 Crystals: {getTotalCrys()}</div>
              <div style={{ fontSize: '16px', marginBottom: '5px', color: '#ffd700' }}>🪙 Coins: {level === 1 ? 15 : level === 2 ? 25 : level === 3 ? 35 : 50}</div>
              <div style={{ fontSize: '16px', marginBottom: '5px', color: '#ff6666' }}>❤️ Hearts: {level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 3 : 4}</div>
              <div style={{ fontSize: '16px', color: '#ff5555' }}>⚠️ Obstacles: {level === 1 ? 7 : level === 2 ? 12 : level === 3 ? 16 : 20}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 'bold' }}>💪 Your Status:</div>
              <div style={{ fontSize: '18px' }}>❤️ Hearts: {hearts}</div>
            </div>

            <button onClick={startLevel} style={{
              padding: '20px 50px', fontSize: '24px', 
              background: level === 4 ? '#ff0000' : '#00ff00',
              border: 'none', borderRadius: '15px', cursor: 'pointer', 
              fontWeight: 'bold', color: level === 4 ? 'white' : 'black', width: '100%'
            }}>
              {level === 4 ? '🔥 ENTER HELL' : '▶️ START'}
            </button>
          </div>
        </div>
      )}
      
      {!showComplete && !gameOver && !showLevelStart && (
        <>
          <div style={{
            position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'Arial',
            fontSize: '20px', textShadow: '2px 2px 4px black', background: 'rgba(0,0,0,0.7)',
            padding: '15px', borderRadius: '10px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Level {level}: {getLevelName()}</div>
            <div>💎 {score} / {getTotalCrys()}</div>
            <div style={{ color: '#ffd700' }}>🪙 {coins}</div>
            <div style={{ fontSize: '24px', marginTop: '5px' }}>
              {[...Array(hearts)].map((_, i) => <span key={i}>❤️</span>)}
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>⚡ Stamina</div>
              <div style={{ 
                width: '150px', height: '12px', background: '#333', borderRadius: '6px',
                overflow: 'hidden', border: '2px solid #666'
              }}>
                <div style={{ 
                  width: `${stamina}%`, height: '100%', 
                  background: stamina > 30 ? 'linear-gradient(90deg, #00ff00, #88ff00)' : '#ff4444',
                  transition: 'width 0.1s'
                }}></div>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 20, left: 20, color: 'white', fontFamily: 'Arial',
            fontSize: '14px', textShadow: '2px 2px 4px black', background: 'rgba(0,0,0,0.6)',
            padding: '10px', borderRadius: '5px'
          }}>
            <div>🎮 WASD - Move</div>
            <div>⚡ Hold Shift - Sprint</div>
            <div>🚀 Space - Jump</div>
            <div>🖱️ Mouse - Camera</div>
            <div>🔍 Wheel - Zoom</div>
          </div>

          <div style={{
            position: 'absolute', bottom: 20, right: 20, color: 'white', fontFamily: 'Arial',
            fontSize: '14px', textShadow: '2px 2px 4px black', background: 'rgba(0,0,0,0.6)',
            padding: '8px 12px', borderRadius: '5px'
          }}>
            Made by Lumidren ✨
          </div>
        </>
      )}

      {gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', color: 'white',
          fontFamily: 'Arial', zIndex: 1000
        }}>
          <h1 style={{ fontSize: '60px', marginBottom: '20px', color: '#ff0000' }}>💔 GAME OVER</h1>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>Level {retryLevel}: {getLevelName()}</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={retryCurrentLevel} style={{
              padding: '20px 40px', fontSize: '20px', background: '#ff9900',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'white'
            }}>🔄 RETRY LEVEL</button>
            <button onClick={() => window.location.reload()} style={{
              padding: '20px 40px', fontSize: '20px', background: '#00ff00',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
            }}>🔁 START OVER</button>
          </div>
        </div>
      )}

      {showComplete && !gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', color: 'white',
          fontFamily: 'Arial', zIndex: 1000
        }}>
          <h1 style={{ fontSize: '60px', marginBottom: '20px' }}>🎉 LEVEL COMPLETE!</h1>
          <p style={{ fontSize: '28px' }}>Crystals: {score}</p>
          <p style={{ fontSize: '24px', color: '#ffd700', marginTop: '10px' }}>Coins: {coins}</p>
          <p style={{ fontSize: '20px', marginTop: '10px' }}>Hearts: {hearts} ❤️</p>
          {level < 4 ? (
            <button onClick={nextLevel} style={{
              marginTop: '30px', padding: '20px 40px', fontSize: '24px', background: '#00ff00',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'black'
            }}>NEXT LEVEL ➡️</button>
          ) : (
            <>
              <h2 style={{ fontSize: '40px', marginTop: '30px', color: '#ffd700' }}>🏆 YOU WIN! 🏆</h2>
              <p style={{ fontSize: '24px', marginTop: '10px' }}>You beat all levels!</p>
              <button onClick={() => window.location.reload()} style={{
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