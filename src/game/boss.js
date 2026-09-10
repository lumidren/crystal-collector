import * as THREE from 'three';

// Level 10 Guardian Boss: The Crystal Titan
export class CrystalTitanBoss {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.pylons = [];
    this.pylonsActivated = 0;
    this.shieldBroken = false;
    this.shockwaves = [];
    this.shockwaveTimer = 3.0;
    this.laserAngle = 0;
    this.laserSpeed = 1.2;
    this.laserMesh = null;
    this.coreCrystal = null;
    this.isDefeated = false;

    this.buildBoss();
    this.buildPylons();
  }

  buildBoss() {
    // Central Hovering Torso
    const torsoMat = new THREE.MeshPhongMaterial({ color: 0x2b0938, emissive: 0x4a0e4e });
    const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5), torsoMat);
    torso.position.y = 4.5;
    this.group.add(torso);

    // Glowing Power Core
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xff0055,
      emissive: 0xff0055,
      emissiveIntensity: 0.9
    });
    this.core = new THREE.Mesh(new THREE.OctahedronGeometry(1.4), coreMat);
    this.core.position.y = 4.5;
    this.group.add(this.core);

    // Floating Head & Glowing Eye
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 1.6),
      new THREE.MeshPhongMaterial({ color: 0x1f002b })
    );
    head.position.y = 7;
    this.group.add(head);

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff0033 })
    );
    eye.position.set(0, 7, 0.85);
    this.group.add(eye);

    // Rotating Laser Beam
    const laserGeom = new THREE.CylinderGeometry(0.12, 0.12, 22, 8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff0033,
      transparent: true,
      opacity: 0.8
    });
    this.laserMesh = new THREE.Mesh(laserGeom, laserMat);
    this.laserMesh.rotation.z = Math.PI / 2;
    this.laserMesh.position.set(11, 1.2, 0); // sweeps outward from center
    this.laserAnchor = new THREE.Group();
    this.laserAnchor.add(this.laserMesh);
    this.group.add(this.laserAnchor);

    // Force Field Shield
    const shieldGeom = new THREE.SphereGeometry(4.5, 24, 24);
    this.shieldMat = new THREE.MeshPhongMaterial({
      color: 0x9d4edd,
      emissive: 0x7b2cbf,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.shieldMesh = new THREE.Mesh(shieldGeom, this.shieldMat);
    this.shieldMesh.position.y = 4.5;
    this.group.add(this.shieldMesh);

    this.scene.add(this.group);
  }

  buildPylons() {
    const coords = [
      { x: -16, z: -16 },
      { x: 16, z: 16 },
      { x: -16, z: 16 },
      { x: 16, z: -16 }
    ];

    coords.forEach((c, idx) => {
      const pylonGroup = new THREE.Group();

      // Pillar base
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.2, 3.5, 8),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      pillar.position.y = 1.75;
      pylonGroup.add(pillar);

      // Pylon crystal on top
      const crystalMat = new THREE.MeshPhongMaterial({
        color: 0x555555,
        emissive: 0x222222,
        emissiveIntensity: 0.2
      });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), crystalMat);
      crystal.position.y = 4.0;
      pylonGroup.add(crystal);

      pylonGroup.position.set(c.x, 0, c.z);
      this.scene.add(pylonGroup);

      this.pylons.push({
        id: idx,
        group: pylonGroup,
        crystal,
        mat: crystalMat,
        x: c.x,
        z: c.z,
        activated: false
      });
    });
  }

  spawnShockwave() {
    const geom = new THREE.RingGeometry(0.5, 1.2, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(geom, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.2, 0);
    this.scene.add(ring);

    this.shockwaves.push({
      mesh: ring,
      radius: 1,
      speed: 10,
      maxRadius: 24,
      damageDealt: false
    });
  }

  activatePylon(idx, soundEngine, particleManager) {
    const p = this.pylons[idx];
    if (!p || p.activated) return false;

    p.activated = true;
    this.pylonsActivated++;
    p.mat.color.setHex(0x00ffff);
    p.mat.emissive.setHex(0x00ffff);
    p.mat.emissiveIntensity = 0.9;

    soundEngine.playPowerup('shield');
    particleManager.createBurst({ x: p.x, y: 4, z: p.z }, 0x00ffff, 25, 8);
    particleManager.createFloatingText({ x: p.x, y: 4, z: p.z }, `PYLON ${this.pylonsActivated}/4!`, '#00ffff');

    if (this.pylonsActivated === 4) {
      this.breakShield(soundEngine, particleManager);
    }
    return true;
  }

  breakShield(soundEngine, particleManager) {
    this.shieldBroken = true;
    this.shieldMesh.visible = false;
    this.laserMesh.visible = false;
    soundEngine?.playFever?.();
    particleManager.addTrauma(0.6);
    particleManager.createBurst({ x: 0, y: 4.5, z: 0 }, 0xff00ff, 40, 12);
    particleManager.createFloatingText({ x: 0, y: 5, z: 0 }, 'SHIELD SHATTERED! GRAB THE CORE!', '#ff00ff', 44);

    // Spawn Grand Core Crystal in center
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      emissive: 0xffa500,
      emissiveIntensity: 0.9
    });
    this.coreCrystal = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5), coreMat);
    this.coreCrystal.position.set(0, 1.8, 0);
    this.scene.add(this.coreCrystal);
  }

  update(dt, t, playerPos, isGrounded, soundEngine, onPlayerHurt) {
    if (this.isDefeated) return;

    // Bobbing & Rotation
    this.group.position.y = Math.sin(t * 1.5) * 0.4;
    this.core.rotation.y += dt * 3;
    this.core.rotation.x += dt * 1.5;

    // Pylon animations
    this.pylons.forEach(p => {
      p.crystal.rotation.y += dt * (p.activated ? 4 : 1.5);
      p.crystal.position.y = 4.0 + Math.sin(t * 3 + p.id) * 0.2;
    });

    if (!this.shieldBroken) {
      // Sweeping Laser
      this.laserAngle += this.laserSpeed * dt;
      this.laserAnchor.rotation.y = this.laserAngle;

      // Laser collision check
      // Player ground distance to center
      const pDist = Math.hypot(playerPos.x, playerPos.z);
      if (pDist < 22 && playerPos.y < 2.0) {
        // Angle comparison
        let pAngle = Math.atan2(-playerPos.z, playerPos.x);
        let curLaserAngle = (this.laserAngle) % (Math.PI * 2);
        if (curLaserAngle < 0) curLaserAngle += Math.PI * 2;
        if (pAngle < 0) pAngle += Math.PI * 2;

        const angleDiff = Math.abs(curLaserAngle - pAngle);
        if (angleDiff < 0.12 || angleDiff > Math.PI * 2 - 0.12) {
          onPlayerHurt();
        }
      }

      // Shockwave rings
      this.shockwaveTimer -= dt;
      if (this.shockwaveTimer <= 0) {
        this.shockwaveTimer = 5.0;
        this.spawnShockwave();
        soundEngine.playBossShockwave();
      }

      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += sw.speed * dt;
        sw.mesh.scale.set(sw.radius, sw.radius, 1);
        sw.mesh.material.opacity = Math.max(0, 1 - sw.radius / sw.maxRadius);

        // Check player collision
        if (!sw.damageDealt) {
          const distToPlayer = Math.hypot(playerPos.x, playerPos.z);
          if (Math.abs(distToPlayer - sw.radius) < 1.2 && isGrounded) {
            sw.damageDealt = true;
            onPlayerHurt();
          }
        }

        if (sw.radius >= sw.maxRadius) {
          this.scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          this.shockwaves.splice(i, 1);
        }
      }
    } else if (this.coreCrystal) {
      // Animate Grand Core Crystal
      this.coreCrystal.rotation.y += dt * 3;
      this.coreCrystal.rotation.z += dt * 1.5;
      this.coreCrystal.position.y = 1.8 + Math.sin(t * 3) * 0.3;
    }
  }

  destroy() {
    this.shockwaves.forEach(sw => {
      this.scene.remove(sw.mesh);
      sw.mesh.geometry.dispose();
      sw.mesh.material.dispose();
    });
    this.shockwaves = [];

    this.pylons.forEach(p => {
      this.scene.remove(p.group);
      p.group.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    });
    this.pylons = [];

    if (this.coreCrystal) {
      this.scene.remove(this.coreCrystal);
      this.coreCrystal.geometry.dispose();
      this.coreCrystal.material.dispose();
    }

    this.scene.remove(this.group);
    this.group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
}
