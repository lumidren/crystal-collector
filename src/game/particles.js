import * as THREE from 'three';

// High-performance particle manager and 3D floating text popup system
export class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.floatingTexts = [];
    this.trauma = 0;
    this.maxShakeOffset = 0.4;
    this.maxShakeAngle = 0.05;
  }

  // Camera screen shake
  addTrauma(amount) {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  getShakeOffset(dt) {
    if (this.trauma <= 0) return { x: 0, y: 0, z: 0, rotZ: 0 };
    const shake = this.trauma * this.trauma;
    const yaw = (Math.random() - 0.5) * 2 * this.maxShakeOffset * shake;
    const pitch = (Math.random() - 0.5) * 2 * this.maxShakeOffset * shake;
    const rot = (Math.random() - 0.5) * 2 * this.maxShakeAngle * shake;
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    return { x: yaw, y: pitch, z: 0, rotZ: rot };
  }

  // Sparkle bursts for pickups
  createBurst(pos, colorHex, count = 16, speed = 6) {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const spd = (0.5 + Math.random() * 0.8) * speed;

      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * spd,
        y: Math.cos(phi) * spd + 1.5,
        z: Math.sin(phi) * Math.sin(theta) * spd
      });
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.35,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geom, mat);
    this.scene.add(points);

    this.particles.push({
      mesh: points,
      velocities,
      positions,
      count,
      life: 0.6,
      maxLife: 0.6
    });
  }

  // Footstep / sprint dust puff
  createDust(pos, colorHex = 0xcccccc) {
    const geom = new THREE.SphereGeometry(0.2, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.6
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(pos.x, 0.1, pos.z);
    this.scene.add(mesh);

    this.particles.push({
      customMesh: mesh,
      life: 0.3,
      maxLife: 0.3,
      update: (dt, p) => {
        p.customMesh.scale.multiplyScalar(1 + dt * 3);
        p.customMesh.material.opacity = (p.life / p.maxLife) * 0.6;
        p.customMesh.position.y += dt * 0.3;
      }
    });
  }

  // 3D Floating text popup (e.g. "+1 💎", "COMBO x3!", "MAGNET!")
  createFloatingText(pos, text, color = '#ffff00', fontSize = 48) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = color;
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(pos.x, pos.y + 1.2, pos.z);
    sprite.scale.set(3, 1.5, 1);
    this.scene.add(sprite);

    this.floatingTexts.push({
      sprite,
      texture,
      life: 1.0,
      maxLife: 1.0,
      vy: 1.8
    });
  }

  update(dt) {
    // Update particle bursts & dust
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        if (p.mesh) {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
        }
        if (p.customMesh) {
          this.scene.remove(p.customMesh);
          p.customMesh.geometry.dispose();
          p.customMesh.material.dispose();
        }
        this.particles.splice(i, 1);
        continue;
      }

      if (p.update) {
        p.update(dt, p);
      } else if (p.mesh && p.velocities) {
        const positions = p.mesh.geometry.attributes.position.array;
        for (let j = 0; j < p.count; j++) {
          p.velocities[j].y -= 9.8 * dt; // gravity
          positions[j * 3] += p.velocities[j].x * dt;
          positions[j * 3 + 1] += p.velocities[j].y * dt;
          positions[j * 3 + 2] += p.velocities[j].z * dt;
        }
        p.mesh.geometry.attributes.position.needsUpdate = true;
        p.mesh.material.opacity = p.life / p.maxLife;
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;

      if (ft.life <= 0) {
        this.scene.remove(ft.sprite);
        ft.texture.dispose();
        ft.sprite.material.dispose();
        this.floatingTexts.splice(i, 1);
        continue;
      }

      ft.sprite.position.y += ft.vy * dt;
      ft.sprite.material.opacity = Math.min(1.0, ft.life / 0.4);
    }
  }

  clear() {
    this.particles.forEach(p => {
      if (p.mesh) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      }
      if (p.customMesh) {
        this.scene.remove(p.customMesh);
        p.customMesh.geometry.dispose();
        p.customMesh.material.dispose();
      }
    });
    this.floatingTexts.forEach(ft => {
      this.scene.remove(ft.sprite);
      ft.texture.dispose();
      ft.sprite.material.dispose();
    });
    this.particles = [];
    this.floatingTexts = [];
    this.trauma = 0;
  }
}
