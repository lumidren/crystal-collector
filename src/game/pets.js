import * as THREE from 'three';

// 3D Pet Companion System for Crystal Collector 2.0
export class PetCompanion {
  constructor(petId, scene) {
    this.petId = petId;
    this.scene = scene;
    this.group = new THREE.Group();
    this.propeller = null;
    this.wings = [];
    this.magnetReach = 6.0;

    this.buildPet();
    this.scene.add(this.group);
  }

  buildPet() {
    if (this.petId === 'drone') {
      this.magnetReach = 6.0;
      // Drone Body
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16),
        new THREE.MeshPhongMaterial({ color: 0x222222, metalness: 0.8 })
      );
      this.group.add(body);

      // Eye Lens
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff })
      );
      eye.position.set(0, 0, 0.3);
      this.group.add(eye);

      // Propeller
      this.propeller = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.04, 0.12),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
      );
      this.propeller.position.y = 0.22;
      this.group.add(this.propeller);
    } else if (this.petId === 'pixie') {
      this.magnetReach = 8.0;
      // Pixie Core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshPhongMaterial({
          color: 0xff69b4,
          emissive: 0xff1493,
          emissiveIntensity: 0.8
        })
      );
      this.group.add(core);

      // Dual Fluttering Wings
      [-0.25, 0.25].forEach(x => {
        const wing = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 0.6),
          new THREE.MeshBasicMaterial({
            color: 0xffb6c1,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
          })
        );
        wing.position.set(x, 0.1, -0.1);
        this.group.add(wing);
        this.wings.push({ mesh: wing, side: Math.sign(x) });
      });
    } else if (this.petId === 'sprite') {
      this.magnetReach = 10.0;
      // Fire Sprite Core
      const core = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.35),
        new THREE.MeshPhongMaterial({
          color: 0xff4500,
          emissive: 0xffa500,
          emissiveIntensity: 1.0
        })
      );
      this.group.add(core);

      // Orbiting Ember
      this.ember = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
      );
      this.group.add(this.ember);
    }
  }

  update(dt, t, playerPos) {
    // Target position: floating over player's right shoulder
    const targetX = playerPos.x + 1.1;
    const targetY = playerPos.y + 2.4 + Math.sin(t * 3) * 0.18;
    const targetZ = playerPos.z + 0.6;

    // Smooth lerp follow
    this.group.position.x += (targetX - this.group.position.x) * dt * 7;
    this.group.position.y += (targetY - this.group.position.y) * dt * 7;
    this.group.position.z += (targetZ - this.group.position.z) * dt * 7;

    // Custom idle animations
    if (this.propeller) {
      this.propeller.rotation.y += dt * 35;
    }

    if (this.wings.length > 0) {
      this.wings.forEach(w => {
        w.mesh.rotation.y = Math.sin(t * 25) * 0.6 * w.side;
      });
    }

    if (this.ember) {
      this.ember.position.set(
        Math.cos(t * 6) * 0.55,
        Math.sin(t * 5) * 0.3,
        Math.sin(t * 6) * 0.55
      );
    }
  }

  destroy() {
    this.scene.remove(this.group);
    this.group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
}
