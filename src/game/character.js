import * as THREE from 'three';

export class CyberRunner {
  constructor(savedData, scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.colorHex = savedData.playerColor || '#00ff00';
    this.currentHat = savedData.currentHat || null;

    this.walkCycle = 0;
    this.createModel();
    this.scene.add(this.group);
  }

  createModel() {
    const pCol = parseInt(this.colorHex.replace('#', '0x'));

    // Materials
    this.undersuitMat = new THREE.MeshStandardMaterial({
      color: 0x12131c,
      roughness: 0.65,
      metalness: 0.2
    });

    this.armorMat = new THREE.MeshStandardMaterial({
      color: pCol,
      roughness: 0.28,
      metalness: 0.65
    });

    this.trimMat = new THREE.MeshStandardMaterial({
      color: 0x222533,
      roughness: 0.35,
      metalness: 0.8
    });

    this.visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x00e1ff,
      emissive: 0x004466,
      emissiveIntensity: 0.45,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.35,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    this.coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      emissive: 0x00d4ff,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6
    });

    this.thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a35,
      roughness: 0.3,
      metalness: 0.85
    });

    this.exhaustGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    // Root Pivot (for sprint forward leaning)
    this.pivotGroup = new THREE.Group();
    this.group.add(this.pivotGroup);

    // Torso Group
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.35;
    this.pivotGroup.add(this.torsoGroup);

    // Undersuit Body (Tapered)
    const torsoGeom = new THREE.CylinderGeometry(0.38, 0.32, 1.05, 16);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torso.castShadow = true;
    this.torsoGroup.add(this.torso);

    // Chestplate Armor
    const chestGeom = new THREE.BoxGeometry(0.72, 0.62, 0.42);
    this.chest = new THREE.Mesh(chestGeom, this.armorMat);
    this.chest.position.set(0, 0.15, 0.1);
    this.chest.castShadow = true;
    this.torsoGroup.add(this.chest);

    // Arc Reactor / Power Gem on Chest
    const coreGeom = new THREE.OctahedronGeometry(0.14);
    this.arcReactor = new THREE.Mesh(coreGeom, this.coreMat);
    this.arcReactor.position.set(0, 0.22, 0.33);
    this.arcReactor.rotation.x = Math.PI / 4;
    this.torsoGroup.add(this.arcReactor);

    // Belt & Buckle
    const beltGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.14, 16);
    const belt = new THREE.Mesh(beltGeom, this.trimMat);
    belt.position.set(0, -0.4, 0);
    this.torsoGroup.add(belt);

    // Twin Jetpack Thrusters
    this.jetpackGroup = new THREE.Group();
    this.jetpackGroup.position.set(0, 0.15, -0.32);

    const packBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.18), this.trimMat);
    this.jetpackGroup.add(packBase);

    // Left & Right Rocket Pods
    [-0.2, 0.2].forEach(xOff => {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 12), this.thrusterMat);
      pod.position.set(xOff, 0.05, 0);
      this.jetpackGroup.add(pod);

      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.18, 12), this.trimMat);
      nozzle.position.set(xOff, -0.36, 0);
      this.jetpackGroup.add(nozzle);

      const glowRing = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), this.exhaustGlowMat);
      glowRing.position.set(xOff, -0.46, 0);
      glowRing.rotation.x = Math.PI / 2;
      this.jetpackGroup.add(glowRing);
    });
    this.torsoGroup.add(this.jetpackGroup);

    // Head & Helmet Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.82, 0);
    this.torsoGroup.add(this.headGroup);

    // Helmet Base
    const helmGeom = new THREE.SphereGeometry(0.38, 20, 20);
    this.helmet = new THREE.Mesh(helmGeom, this.armorMat);
    this.helmet.castShadow = true;
    this.headGroup.add(this.helmet);

    // Top Aerofoil Crest
    const crestGeom = new THREE.BoxGeometry(0.08, 0.12, 0.5);
    const crest = new THREE.Mesh(crestGeom, this.trimMat);
    crest.position.set(0, 0.35, 0);
    this.headGroup.add(crest);

    // Curved Gloss Visor
    const visorGeom = new THREE.SphereGeometry(0.34, 16, 16, 0, Math.PI, 0, Math.PI);
    this.visor = new THREE.Mesh(visorGeom, this.visorMat);
    this.visor.position.set(0, 0.02, 0.12);
    this.visor.rotation.x = -Math.PI / 2;
    this.visor.rotation.z = Math.PI;
    this.headGroup.add(this.visor);

    // Side Comms Pods
    [-0.39, 0.39].forEach(xOff => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), this.trimMat);
      ear.position.set(xOff, 0, 0);
      ear.rotation.z = Math.PI / 2;
      this.headGroup.add(ear);
    });

    // Hat Anchor Point atop helmet
    this.hatMount = new THREE.Group();
    this.hatMount.position.set(0, 0.38, 0);
    this.headGroup.add(this.hatMount);
    this.applyHat(this.currentHat);

    // Arm Groups
    this.leftArmGroup = this.createArm(-1);
    this.leftArmGroup.position.set(-0.52, 0.42, 0);
    this.torsoGroup.add(this.leftArmGroup);

    this.rightArmGroup = this.createArm(1);
    this.rightArmGroup.position.set(0.52, 0.42, 0);
    this.torsoGroup.add(this.rightArmGroup);

    // Leg Groups
    this.leftLegGroup = this.createLeg(-1);
    this.leftLegGroup.position.set(-0.22, -0.45, 0);
    this.torsoGroup.add(this.leftLegGroup);

    this.rightLegGroup = this.createLeg(1);
    this.rightLegGroup.position.set(0.22, -0.45, 0);
    this.torsoGroup.add(this.rightLegGroup);
  }

  createArm(side) {
    const armGroup = new THREE.Group();

    // Shoulder Pauldron
    const pauldronGeom = new THREE.SphereGeometry(0.18, 12, 12, 0, Math.PI);
    const pauldron = new THREE.Mesh(pauldronGeom, this.armorMat);
    pauldron.position.set(0, 0.04, 0);
    pauldron.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;
    armGroup.add(pauldron);

    // Upper Arm
    const upperGeom = new THREE.CylinderGeometry(0.1, 0.09, 0.45, 12);
    const upper = new THREE.Mesh(upperGeom, this.undersuitMat);
    upper.position.set(0, -0.2, 0);
    upper.castShadow = true;
    armGroup.add(upper);

    // Forearm Gauntlet & Glove
    const forearmGeom = new THREE.CylinderGeometry(0.11, 0.13, 0.45, 12);
    const forearm = new THREE.Mesh(forearmGeom, this.armorMat);
    forearm.position.set(0, -0.55, 0);
    forearm.castShadow = true;
    armGroup.add(forearm);

    const gloveGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const glove = new THREE.Mesh(gloveGeom, this.trimMat);
    glove.position.set(0, -0.78, 0);
    armGroup.add(glove);

    return armGroup;
  }

  createLeg(side) {
    const legGroup = new THREE.Group();

    // Thigh (Undersuit)
    const thighGeom = new THREE.CylinderGeometry(0.14, 0.12, 0.46, 12);
    const thigh = new THREE.Mesh(thighGeom, this.undersuitMat);
    thigh.position.set(0, -0.22, 0);
    thigh.castShadow = true;
    legGroup.add(thigh);

    // Knee Guard
    const kneeGeom = new THREE.BoxGeometry(0.2, 0.14, 0.14);
    const knee = new THREE.Mesh(kneeGeom, this.armorMat);
    knee.position.set(0, -0.42, 0.08);
    legGroup.add(knee);

    // Lower Leg & Boot
    const calfGeom = new THREE.CylinderGeometry(0.13, 0.15, 0.44, 12);
    const calf = new THREE.Mesh(calfGeom, this.armorMat);
    calf.position.set(0, -0.66, 0);
    calf.castShadow = true;
    legGroup.add(calf);

    // Tech Boot Foot
    const footGeom = new THREE.BoxGeometry(0.22, 0.14, 0.38);
    const foot = new THREE.Mesh(footGeom, this.trimMat);
    foot.position.set(0, -0.84, 0.08);
    foot.castShadow = true;
    legGroup.add(foot);

    return legGroup;
  }

  applyHat(hatId) {
    // Clear previous hat
    while (this.hatMount.children.length > 0) {
      this.hatMount.remove(this.hatMount.children[0]);
    }

    if (!hatId) return;

    if (hatId === 'cap') {
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.05, 0.52),
        new THREE.MeshStandardMaterial({ color: 0xff1133, roughness: 0.4 })
      );
      visor.position.set(0, -0.04, 0.28);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5),
        new THREE.MeshStandardMaterial({ color: 0xff1133, roughness: 0.4 })
      );
      dome.position.y = 0.04;
      this.hatMount.add(visor, dome);
    } else if (hatId === 'tophat') {
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24),
        new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.2 })
      );
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.85, 24),
        new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.2 })
      );
      cyl.position.y = 0.42;
      const ribbon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.385, 0.385, 0.14, 24),
        new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.3 })
      );
      ribbon.position.y = 0.12;
      this.hatMount.add(brim, cyl, ribbon);
    } else if (hatId === 'crown') {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.52, 0.24, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x664400, metalness: 0.85, roughness: 0.18 })
      );
      this.hatMount.add(base);
    } else if (hatId === 'santa') {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.46, 0.95, 16),
        new THREE.MeshStandardMaterial({ color: 0xee1122, roughness: 0.6 })
      );
      cone.position.y = 0.38;
      cone.rotation.z = -0.15;
      const trim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      const pom = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      pom.position.set(-0.2, 0.85, 0);
      this.hatMount.add(cone, trim, pom);
    }
  }

  setSkinColor(colorHex) {
    this.colorHex = colorHex;
    const pCol = parseInt(colorHex.replace('#', '0x'));
    this.armorMat.color.setHex(pCol);
  }

  update(dt, t, options = {}) {
    const {
      isMoving = false,
      isSprinting = false,
      isGrounded = true,
      mx = 0,
      mz = 0,
      feverTime = 0,
      particleManager = null
    } = options;

    // Pulse Arc Reactor & Visor in Fever Mode
    if (feverTime > 0) {
      const hue = (t * 2.5) % 1;
      this.coreMat.color.setHSL(hue, 1, 0.6);
      this.coreMat.emissive.setHSL(hue, 1, 0.5);
      this.exhaustGlowMat.color.setHSL(hue, 1, 0.5);
      this.arcReactor.rotation.y += dt * 8;
    } else {
      const pulse = 0.85 + Math.sin(t * 3) * 0.25;
      this.coreMat.emissiveIntensity = pulse;
      this.arcReactor.rotation.y += dt * 2;
    }

    // Sprint Forward Lean (Smooth Spring Lerp)
    const targetLean = isMoving ? (isSprinting ? 0.28 : 0.12) : 0;
    this.pivotGroup.rotation.x += (targetLean - this.pivotGroup.rotation.x) * Math.min(1, dt * 10);

    // Natural Striding walk-cycle
    if (isMoving && isGrounded) {
      const animRate = isSprinting ? 18 : 11;
      this.walkCycle += dt * animRate;

      const swing = Math.sin(this.walkCycle);
      const legAngle = isSprinting ? 0.95 : 0.65;
      const armAngle = isSprinting ? 0.85 : 0.5;

      // Legs swing in opposition
      this.leftLegGroup.rotation.x = -swing * legAngle;
      this.rightLegGroup.rotation.x = swing * legAngle;

      // Arms swing opposite to legs
      this.leftArmGroup.rotation.x = swing * armAngle;
      this.rightArmGroup.rotation.x = -swing * armAngle;

      // Slight natural arm flare
      this.leftArmGroup.rotation.z = 0.08;
      this.rightArmGroup.rotation.z = -0.08;

      // Torso rhythmic bounce
      this.torsoGroup.position.y = 1.35 + Math.abs(Math.sin(this.walkCycle)) * 0.1;

      // Facing Direction
      if (mx !== 0 || mz !== 0) {
        this.group.rotation.y = Math.atan2(mx, mz);
      }

      // Jetpack Thruster Exhaust Particles when Sprinting
      if (isSprinting && particleManager && Math.random() < 0.35) {
        const thrustColor = feverTime > 0 ? 0xff00ff : 0x00f0ff;
        particleManager.createBurst(
          {
            x: this.group.position.x,
            y: this.group.position.y + 1.2,
            z: this.group.position.z
          },
          thrustColor,
          4,
          3
        );
      }
    } else if (!isGrounded) {
      // In-Air Aerodynamic Pose
      this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, -0.35, dt * 10);
      this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, 0.25, dt * 10);
      this.leftArmGroup.rotation.x = THREE.MathUtils.lerp(this.leftArmGroup.rotation.x, -0.5, dt * 10);
      this.rightArmGroup.rotation.x = THREE.MathUtils.lerp(this.rightArmGroup.rotation.x, -0.5, dt * 10);
      this.leftArmGroup.rotation.z = THREE.MathUtils.lerp(this.leftArmGroup.rotation.z, 0.45, dt * 10);
      this.rightArmGroup.rotation.z = THREE.MathUtils.lerp(this.rightArmGroup.rotation.z, -0.45, dt * 10);
      this.torsoGroup.position.y = 1.35;

      // In-air jetpack plume
      if (particleManager && Math.random() < 0.4) {
        const thrustColor = feverTime > 0 ? 0xff00ff : 0x00f0ff;
        particleManager.createDust(
          {
            x: this.group.position.x,
            y: this.group.position.y + 1.2,
            z: this.group.position.z
          },
          thrustColor
        );
      }
    } else {
      // Idle Breathing Stance
      this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, 0, dt * 8);
      this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, 0, dt * 8);
      this.leftArmGroup.rotation.x = THREE.MathUtils.lerp(this.leftArmGroup.rotation.x, 0, dt * 8);
      this.rightArmGroup.rotation.x = THREE.MathUtils.lerp(this.rightArmGroup.rotation.x, 0, dt * 8);
      this.leftArmGroup.rotation.z = THREE.MathUtils.lerp(this.leftArmGroup.rotation.z, 0.05, dt * 8);
      this.rightArmGroup.rotation.z = THREE.MathUtils.lerp(this.rightArmGroup.rotation.z, -0.05, dt * 8);

      const breathe = Math.sin(t * 2.2) * 0.04;
      this.torsoGroup.position.y = 1.35 + breathe;
    }
  }

  destroy() {
    if (this.group && this.scene) {
      this.scene.remove(this.group);
      this.group.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
    }
  }
}
