import * as THREE from 'three';

// 3D Pet Companion System for Crystal Collector 2.0
export class PetCompanion {
  constructor(petId, scene) {
    this.petId = petId;
    this.scene = scene;
    this.group = new THREE.Group();
    this.propeller = null;
    this.wings = [];
    this.legs = [];
    this.tail = null;
    this.isGroundFollower = false;
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
        new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 })
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
    } else if (this.petId === 'dog') {
      // 🐕 CYBER DOG (ROBO-PUP) COMPANION
      this.isGroundFollower = true;
      this.magnetReach = 11.0;

      const dogGroup = new THREE.Group();

      // Main Torso (Metallic Cyber Coat with Neon Trim)
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.42, 0.8),
        new THREE.MeshStandardMaterial({
          color: 0x242d3d,
          metalness: 0.75,
          roughness: 0.35
        })
      );
      torso.position.y = 0.42;
      torso.castShadow = true;
      dogGroup.add(torso);

      // Neon Cyber Stripe on Back
      const spineStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.04, 0.68),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      spineStripe.position.set(0, 0.64, 0);
      dogGroup.add(spineStripe);

      // Dog Head
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.34, 0.4),
        new THREE.MeshStandardMaterial({
          color: 0x2c3749,
          metalness: 0.8,
          roughness: 0.3
        })
      );
      head.position.set(0, 0.65, 0.48);
      head.castShadow = true;
      dogGroup.add(head);

      // Cute Dog Snout
      const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.16, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x1d2430, roughness: 0.5 })
      );
      snout.position.set(0, 0.58, 0.72);
      dogGroup.add(snout);

      // Nose Tip
      const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x050505 })
      );
      nose.position.set(0, 0.62, 0.85);
      dogGroup.add(nose);

      // Glowing Cyan Cyber Eyes / Visor
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.08, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      visor.position.set(0, 0.72, 0.68);
      dogGroup.add(visor);

      // Floppy Cyber Ears
      [-0.2, 0.2].forEach((x, i) => {
        const ear = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.25, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x18202d, roughness: 0.4 })
        );
        ear.position.set(x, 0.72, 0.44);
        ear.rotation.z = (i === 0 ? 0.35 : -0.35);
        dogGroup.add(ear);
      });

      // Golden Cyber Collar
      const collar = new THREE.Mesh(
        new THREE.BoxGeometry(0.39, 0.08, 0.42),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 })
      );
      collar.position.set(0, 0.55, 0.38);
      dogGroup.add(collar);

      // Hologram Collar Tag
      const tag = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.06),
        new THREE.MeshBasicMaterial({ color: 0x00ff88 })
      );
      tag.position.set(0, 0.48, 0.6);
      dogGroup.add(tag);

      // 4 Articulated Running Legs (Front-L, Front-R, Back-L, Back-R)
      const legPositions = [
        [-0.18, 0.18, 0.26],  // FL
        [0.18, 0.18, 0.26],   // FR
        [-0.18, 0.18, -0.26], // BL
        [0.18, 0.18, -0.26]   // BR
      ];

      this.legs = legPositions.map(pos => {
        const legPivot = new THREE.Group();
        legPivot.position.set(pos[0], pos[1] + 0.18, pos[2]);

        const legMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.36, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x1a222f, metalness: 0.7, roughness: 0.4 })
        );
        legMesh.position.y = -0.18;
        legMesh.castShadow = true;
        legPivot.add(legMesh);

        // Cyber Paw Tip
        const paw = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.08, 0.15),
          new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2 })
        );
        paw.position.set(0, -0.34, 0.02);
        legPivot.add(paw);

        dogGroup.add(legPivot);
        return legPivot;
      });

      // Animated Wagging Cyber Tail
      const tailPivot = new THREE.Group();
      tailPivot.position.set(0, 0.55, -0.38);

      const tailMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.055, 0.38, 8),
        new THREE.MeshStandardMaterial({ color: 0x242d3d, roughness: 0.4 })
      );
      tailMesh.position.set(0, 0.15, -0.12);
      tailMesh.rotation.x = -0.7;
      tailPivot.add(tailMesh);

      // Tail Glowing Energy Tip
      const tailTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      tailTip.position.set(0, 0.3, -0.25);
      tailPivot.add(tailTip);

      dogGroup.add(tailPivot);
      this.tail = tailPivot;

      this.group.add(dogGroup);
    } else if (this.petId === 'falcon') {
      // 🦅 CYBER FALCON (SKY SCOUT)
      this.magnetReach = 9.0;

      const falconGroup = new THREE.Group();

      // Fuselage / Bird Body
      const body = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.85, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e2430, metalness: 0.85, roughness: 0.2 })
      );
      body.rotation.x = Math.PI / 2;
      falconGroup.add(body);

      // Sharp Golden Beak
      const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.25, 4),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 })
      );
      beak.position.set(0, -0.05, 0.52);
      beak.rotation.x = Math.PI / 2;
      falconGroup.add(beak);

      // Glowing Eyes
      [-0.12, 0.12].forEach(x => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0x00ff88 })
        );
        eye.position.set(x, 0.08, 0.38);
        falconGroup.add(eye);
      });

      // Twin Mechanical Flapping Wings
      [-1, 1].forEach(side => {
        const wingPivot = new THREE.Group();
        wingPivot.position.set(side * 0.22, 0.05, 0.05);

        const wingMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.04, 0.32),
          new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x0088cc,
            emissiveIntensity: 0.6,
            metalness: 0.5
          })
        );
        wingMesh.position.x = side * 0.4;
        wingPivot.add(wingMesh);

        falconGroup.add(wingPivot);
        this.wings.push({ mesh: wingPivot, side });
      });

      this.group.add(falconGroup);
    } else if (this.petId === 'sugar_bunny') {
      // 🐰 SUGAR BUNNY (MAGICAL FAIRY COMPANION)
      this.magnetReach = 12.0;

      const bunnyGroup = new THREE.Group();

      const bunnyMat = new THREE.MeshStandardMaterial({
        color: 0xfff0f6,
        roughness: 0.55,
        metalness: 0.1
      });

      const pinkMat = new THREE.MeshStandardMaterial({
        color: 0xffb6c1,
        roughness: 0.5,
        metalness: 0.1
      });

      // Body (Round fluffy ball)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), bunnyMat);
      bunnyGroup.add(body);

      // Belly Patch
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), pinkMat);
      belly.position.set(0, -0.04, 0.14);
      bunnyGroup.add(belly);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 16), bunnyMat);
      head.position.set(0, 0.28, 0.08);
      bunnyGroup.add(head);

      // Blush Cheeks
      [-0.15, 0.15].forEach(cx => {
        const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff69b4 }));
        cheek.position.set(cx, 0.24, 0.28);
        bunnyGroup.add(cheek);
      });

      // Glossy Cute Eyes
      [-0.09, 0.09].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1f0b18 }));
        eye.position.set(ex, 0.3, 0.31);
        bunnyGroup.add(eye);

        const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        highlight.position.set(ex + 0.012, 0.32, 0.34);
        bunnyGroup.add(highlight);
      });

      // Cute Button Nose
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.05, 4), new THREE.MeshBasicMaterial({ color: 0xff1493 }));
      nose.position.set(0, 0.25, 0.34);
      nose.rotation.x = Math.PI / 2;
      bunnyGroup.add(nose);

      // Long Floppy Ears with Bouncing Pivots
      this.bunnyEars = [];
      [-1, 1].forEach(side => {
        const earPivot = new THREE.Group();
        earPivot.position.set(side * 0.14, 0.48, 0.06);
        earPivot.rotation.z = side * 0.35;
        earPivot.rotation.x = -0.15;

        const earMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.035, 0.45, 10), bunnyMat);
        earMesh.position.y = 0.2;
        earPivot.add(earMesh);

        const innerEar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.38, 8), pinkMat);
        innerEar.position.set(0, 0.2, 0.02);
        earPivot.add(innerEar);

        bunnyGroup.add(earPivot);
        this.bunnyEars.push(earPivot);
      });

      // Tiny Fluttering Wings
      const wingMat = new THREE.MeshPhysicalMaterial({
        color: 0xffb7eb,
        emissive: 0xff69b4,
        emissiveIntensity: 0.75,
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
        side: THREE.DoubleSide
      });

      [-1, 1].forEach(side => {
        const wingPivot = new THREE.Group();
        wingPivot.position.set(side * 0.16, 0.12, -0.2);

        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 6), wingMat);
        wing.scale.set(1.5, 1, 0.2);
        wing.position.set(side * 0.15, 0.12, 0);
        wing.rotation.z = side * -1.1;
        wingPivot.add(wing);

        bunnyGroup.add(wingPivot);
        this.wings.push({ mesh: wingPivot, side });
      });

      // Round Fluffy Cotton Tail
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
      tail.position.set(0, -0.08, -0.3);
      bunnyGroup.add(tail);

      // Tiny Paws
      [-0.1, 0.1].forEach(px => {
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), pinkMat);
        paw.position.set(px, -0.02, 0.24);
        bunnyGroup.add(paw);
      });

      // Floating Magic Heart above head
      const heartGeom = new THREE.OctahedronGeometry(0.08);
      this.sugarHeart = new THREE.Mesh(
        heartGeom,
        new THREE.MeshPhysicalMaterial({
          color: 0xff1493,
          emissive: 0xff69b4,
          emissiveIntensity: 1.2
        })
      );
      this.sugarHeart.position.set(0, 0.68, 0.08);
      bunnyGroup.add(this.sugarHeart);

      this.group.add(bunnyGroup);
    }
  }

  update(dt, t, playerPos) {
    if (this.isGroundFollower) {
      // 🐕 Ground-level follower (trots alongside player on the floor)
      const targetX = playerPos.x - 1.25;
      const targetY = playerPos.y;
      const targetZ = playerPos.z - 0.25;

      const dx = targetX - this.group.position.x;
      const dz = targetZ - this.group.position.z;
      const dist = Math.hypot(dx, dz);

      // Smooth follow
      this.group.position.x += dx * dt * 8.5;
      this.group.position.y += (targetY - this.group.position.y) * dt * 10;
      this.group.position.z += dz * dt * 8.5;

      // Face travel direction
      if (dist > 0.1) {
        const targetAngle = Math.atan2(dx, dz);
        this.group.rotation.y += (targetAngle - this.group.rotation.y) * dt * 10;
      }

      // Animate 4 running paws when moving
      if (this.legs && this.legs.length === 4) {
        if (dist > 0.05) {
          const runSpeed = 16;
          const legSwing = 0.65;
          this.legs[0].rotation.x = Math.sin(t * runSpeed) * legSwing;       // Front-Left
          this.legs[1].rotation.x = -Math.sin(t * runSpeed) * legSwing;      // Front-Right
          this.legs[2].rotation.x = -Math.sin(t * runSpeed) * legSwing;      // Back-Left
          this.legs[3].rotation.x = Math.sin(t * runSpeed) * legSwing;       // Back-Right
        } else {
          // Smoothly return to stand
          this.legs.forEach(l => {
            l.rotation.x *= 0.8;
          });
        }
      }

      // Happy wagging cyber tail
      if (this.tail) {
        this.tail.rotation.y = Math.sin(t * 14) * 0.45;
        this.tail.rotation.z = Math.sin(t * 7) * 0.18;
      }
    } else {
      // 🛸 Flying shoulder follower
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
          w.mesh.rotation.z = Math.sin(t * 18) * 0.55 * w.side;
        });
      }

      if (this.ember) {
        this.ember.position.set(
          Math.cos(t * 6) * 0.55,
          Math.sin(t * 5) * 0.3,
          Math.sin(t * 6) * 0.55
        );
      }

      if (this.bunnyEars && this.bunnyEars.length === 2) {
        const earBounce = Math.sin(t * 8) * 0.12;
        this.bunnyEars[0].rotation.z = -0.35 + earBounce;
        this.bunnyEars[1].rotation.z = 0.35 - earBounce;
        this.bunnyEars[0].rotation.x = -0.15 + Math.sin(t * 6) * 0.08;
        this.bunnyEars[1].rotation.x = -0.15 + Math.sin(t * 6 + 0.4) * 0.08;
      }

      if (this.sugarHeart) {
        this.sugarHeart.rotation.y += dt * 3.0;
        this.sugarHeart.position.y = 0.68 + Math.sin(t * 4) * 0.04;
      }
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
