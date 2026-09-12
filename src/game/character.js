import * as THREE from 'three';

export const CHARACTER_ROSTER = [
  {
    id: 'cyber_runner',
    name: 'Cyber Runner',
    title: 'Acrobatic Scout',
    icon: '🏃',
    cost: 0,
    desc: 'Streamlined aerodynamic sprinter engineered for agility, twin jetpack propulsion, and rapid traversal.',
    perk: '⚡ +15% Sprint Efficiency & Balanced Agility',
    stats: { speedMultiplier: 1.15, jumpBonus: 0, extraHearts: 0, magnetBonus: 0, airGlide: false }
  },
  {
    id: 'shadow_shinobi',
    name: 'Shadow Shinobi',
    title: 'Cybernetic Ninja',
    icon: '🥷',
    cost: 150,
    desc: 'Stealth infiltrator equipped with dual photonic katanas, fluttering scarf, and high-altitude leap coils.',
    perk: '🗡️ +20% Higher Jump Boost & Silent Step',
    stats: { speedMultiplier: 1.08, jumpBonus: 4.5, extraHearts: 0, magnetBonus: 0, airGlide: false }
  },
  {
    id: 'titan_mech',
    name: 'Titan Juggernaut',
    title: 'Heavy Enforcer',
    icon: '🤖',
    cost: 250,
    desc: 'Armored industrial mech with molten blast-furnace core, smoking exhaust stacks, and hydraulic stompers.',
    perk: '🛡️ +1 Free Armor Heart & Heavy Exoskeleton',
    stats: { speedMultiplier: 0.98, jumpBonus: -0.5, extraHearts: 1, magnetBonus: 0, airGlide: false }
  },
  {
    id: 'void_sorcerer',
    name: 'Void Sorcerer',
    title: 'Astral Mystic',
    icon: '🔮',
    cost: 350,
    desc: 'Levitating techno-mage surrounded by orbiting celestial rune rings and an astral power catalyst orb.',
    perk: '🔮 +5m Natural Crystal Magnetism & Astral Aura',
    stats: { speedMultiplier: 1.05, jumpBonus: 1.5, extraHearts: 0, magnetBonus: 5.0, airGlide: false }
  },
  {
    id: 'neon_valkyrie',
    name: 'Neon Valkyrie',
    title: 'Photonic Sky Warrior',
    icon: '🪽',
    cost: 500,
    desc: 'Airborne warrior equipped with swept-back photonic energy wings and high-altitude thruster flight heels.',
    perk: '🪽 Extended Air Glide & Wing Thruster Lift',
    stats: { speedMultiplier: 1.12, jumpBonus: 3.0, extraHearts: 0, magnetBonus: 2.0, airGlide: true }
  },
  {
    id: 'magical_rue',
    name: 'Magical Rue',
    title: 'Starlight Dreamer',
    icon: '✨',
    cost: 0,
    isSecret: true,
    desc: 'Magical maiden with iridescent fairy wings, starlight crown, flowing twin ribbons, and an enchanted star wand.',
    perk: '💖 Fairy Wings Glide, +1 Extra Heart & 4m Starlight Magnet',
    stats: { speedMultiplier: 1.16, jumpBonus: 3.5, extraHearts: 1, magnetBonus: 4.0, airGlide: true }
  }
];

export class CyberRunner {
  constructor(savedData, scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.characterType = savedData.currentCharacter || 'cyber_runner';
    this.colorHex = savedData.playerColor || '#00ff00';
    this.currentHat = savedData.currentHat || null;

    this.walkCycle = 0;
    this.animatedParts = {};
    this.createModel();
    this.scene.add(this.group);
  }

  createModel() {
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
    }
    this.animatedParts = {};

    const pCol = parseInt(this.colorHex.replace('#', '0x'));
    const isGirls = this.characterType === 'magical_rue';

    this.undersuitMat = new THREE.MeshStandardMaterial({
      color: this.characterType === 'shadow_shinobi' ? 0x0a0b12 : isGirls ? 0xfff0f6 : 0x12131c,
      roughness: isGirls ? 0.4 : 0.7,
      metalness: isGirls ? 0.1 : 0.2
    });

    this.armorMat = new THREE.MeshStandardMaterial({
      color: isGirls ? 0xff69b4 : pCol,
      roughness: this.characterType === 'titan_mech' ? 0.45 : isGirls ? 0.25 : 0.28,
      metalness: this.characterType === 'titan_mech' ? 0.85 : isGirls ? 0.35 : 0.65
    });

    this.trimMat = new THREE.MeshStandardMaterial({
      color: isGirls ? 0xffd700 : 0x222533,
      roughness: isGirls ? 0.2 : 0.35,
      metalness: isGirls ? 0.9 : 0.8
    });

    this.visorMat = new THREE.MeshPhysicalMaterial({
      color: this.characterType === 'shadow_shinobi' ? 0xff0044 : this.characterType === 'void_sorcerer' ? 0xaa00ff : isGirls ? 0xff80bf : 0x00e1ff,
      emissive: this.characterType === 'shadow_shinobi' ? 0xaa0022 : this.characterType === 'void_sorcerer' ? 0x6600aa : isGirls ? 0xff3399 : 0x004466,
      emissiveIntensity: isGirls ? 0.85 : 0.6,
      roughness: 0.05,
      metalness: isGirls ? 0.2 : 0.9,
      transmission: isGirls ? 0.65 : 0.35,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    this.coreMat = new THREE.MeshPhysicalMaterial({
      color: this.characterType === 'titan_mech' ? 0xff4400 : this.characterType === 'void_sorcerer' ? 0xcc00ff : isGirls ? 0xff1493 : 0x00ffff,
      emissive: this.characterType === 'titan_mech' ? 0xff2200 : this.characterType === 'void_sorcerer' ? 0x9900ff : isGirls ? 0xff007f : 0x00d4ff,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6
    });

    this.thrusterMat = new THREE.MeshStandardMaterial({
      color: isGirls ? 0xffe4e6 : 0x2a2a35,
      roughness: 0.3,
      metalness: 0.85
    });

    this.exhaustGlowMat = new THREE.MeshBasicMaterial({
      color: this.characterType === 'titan_mech' ? 0xff5500 : this.characterType === 'void_sorcerer' ? 0xaa00ff : isGirls ? 0xff69b4 : 0x00f0ff
    });

    this.pivotGroup = new THREE.Group();
    this.group.add(this.pivotGroup);

    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.35;
    this.pivotGroup.add(this.torsoGroup);

    if (this.characterType === 'shadow_shinobi') {
      this.buildShadowShinobi();
    } else if (this.characterType === 'titan_mech') {
      this.buildTitanMech();
    } else if (this.characterType === 'void_sorcerer') {
      this.buildVoidSorcerer();
    } else if (this.characterType === 'neon_valkyrie') {
      this.buildNeonValkyrie();
    } else if (this.characterType === 'magical_rue') {
      this.buildMagicalRue();
    } else {
      this.buildCyberRunner();
    }

    this.leftArmGroup = this.createArm(-1);
    this.leftArmGroup.position.set(this.characterType === 'titan_mech' ? -0.66 : isGirls ? -0.44 : -0.52, 0.42, 0);
    this.torsoGroup.add(this.leftArmGroup);

    this.rightArmGroup = this.createArm(1);
    this.rightArmGroup.position.set(this.characterType === 'titan_mech' ? 0.66 : isGirls ? 0.44 : 0.52, 0.42, 0);
    this.torsoGroup.add(this.rightArmGroup);

    this.leftLegGroup = this.createLeg(-1);
    this.leftLegGroup.position.set(this.characterType === 'titan_mech' ? -0.28 : isGirls ? -0.18 : -0.22, -0.45, 0);
    this.torsoGroup.add(this.leftLegGroup);

    this.rightLegGroup = this.createLeg(1);
    this.rightLegGroup.position.set(this.characterType === 'titan_mech' ? 0.28 : isGirls ? 0.18 : 0.22, -0.45, 0);
    this.torsoGroup.add(this.rightLegGroup);
  }

  buildCyberRunner() {
    const torsoGeom = new THREE.CylinderGeometry(0.38, 0.32, 1.05, 16);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torso.castShadow = true;
    this.torsoGroup.add(this.torso);

    const chestGeom = new THREE.BoxGeometry(0.72, 0.62, 0.42);
    this.chest = new THREE.Mesh(chestGeom, this.armorMat);
    this.chest.position.set(0, 0.15, 0.1);
    this.chest.castShadow = true;
    this.torsoGroup.add(this.chest);

    const coreGeom = new THREE.OctahedronGeometry(0.14);
    this.arcReactor = new THREE.Mesh(coreGeom, this.coreMat);
    this.arcReactor.position.set(0, 0.22, 0.33);
    this.arcReactor.rotation.x = Math.PI / 4;
    this.torsoGroup.add(this.arcReactor);

    const beltGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.14, 16);
    const belt = new THREE.Mesh(beltGeom, this.trimMat);
    belt.position.set(0, -0.4, 0);
    this.torsoGroup.add(belt);

    this.jetpackGroup = new THREE.Group();
    this.jetpackGroup.position.set(0, 0.15, -0.32);

    const packBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.18), this.trimMat);
    this.jetpackGroup.add(packBase);

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

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.82, 0);
    this.torsoGroup.add(this.headGroup);

    const helmGeom = new THREE.SphereGeometry(0.38, 20, 20);
    this.helmet = new THREE.Mesh(helmGeom, this.armorMat);
    this.helmet.castShadow = true;
    this.headGroup.add(this.helmet);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.5), this.trimMat);
    crest.position.set(0, 0.35, 0);
    this.headGroup.add(crest);

    const visorGeom = new THREE.SphereGeometry(0.34, 16, 16, 0, Math.PI, 0, Math.PI);
    this.visor = new THREE.Mesh(visorGeom, this.visorMat);
    this.visor.position.set(0, 0.02, 0.12);
    this.visor.rotation.x = -Math.PI / 2;
    this.visor.rotation.z = Math.PI;
    this.headGroup.add(this.visor);

    this.setupHatMount();
  }

  buildShadowShinobi() {
    const torsoGeom = new THREE.CylinderGeometry(0.34, 0.28, 1.05, 16);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torsoGroup.add(this.torso);

    const chestGeom = new THREE.BoxGeometry(0.66, 0.58, 0.38);
    this.chest = new THREE.Mesh(chestGeom, this.armorMat);
    this.chest.position.set(0, 0.14, 0.08);
    this.torsoGroup.add(this.chest);

    const seal = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), this.coreMat);
    seal.position.set(0, 0.2, 0.29);
    this.arcReactor = seal;
    this.torsoGroup.add(seal);

    const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0xff0044, roughness: 0.5 }));
    sash.position.set(0, -0.38, 0);
    this.torsoGroup.add(sash);

    const backMount = new THREE.Group();
    backMount.position.set(0, 0.2, -0.25);

    [-1, 1].forEach(dir => {
      const katanaGroup = new THREE.Group();
      katanaGroup.rotation.z = dir * 0.55;

      const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.06), this.trimMat);
      scabbard.position.set(dir * 0.1, 0, 0);

      const bladeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.9, 0.02), new THREE.MeshBasicMaterial({ color: 0xff0055 }));
      bladeGlow.position.set(dir * 0.1, 0, 0.035);

      const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 8), this.armorMat);
      tsuba.position.set(dir * 0.1, 0.5, 0);

      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.32, 8), this.undersuitMat);
      hilt.position.set(dir * 0.1, 0.68, 0);

      katanaGroup.add(scabbard, bladeGlow, tsuba, hilt);
      backMount.add(katanaGroup);
    });
    this.torsoGroup.add(backMount);

    const scarfBase = new THREE.Group();
    scarfBase.position.set(0, 0.62, -0.22);

    const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xff0044, roughness: 0.5 }));
    ribbon1.position.set(-0.06, -0.15, -0.06);
    ribbon1.rotation.x = -0.3;

    const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.04), new THREE.MeshStandardMaterial({ color: 0xff0044, roughness: 0.5 }));
    ribbon2.position.set(0.08, -0.2, -0.08);
    ribbon2.rotation.x = -0.45;

    scarfBase.add(ribbon1, ribbon2);
    this.torsoGroup.add(scarfBase);
    this.animatedParts.scarf = scarfBase;

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.82, 0);
    this.torsoGroup.add(this.headGroup);

    const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 18), this.armorMat);
    this.headGroup.add(cowl);

    const slitVisor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.18), this.visorMat);
    slitVisor.position.set(0, 0.04, 0.28);
    this.headGroup.add(slitVisor);

    this.setupHatMount();
  }

  buildTitanMech() {
    const torsoGeom = new THREE.BoxGeometry(0.95, 1.1, 0.65);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torsoGroup.add(this.torso);

    const chestGeom = new THREE.BoxGeometry(1.05, 0.72, 0.5);
    this.chest = new THREE.Mesh(chestGeom, this.armorMat);
    this.chest.position.set(0, 0.16, 0.14);
    this.torsoGroup.add(this.chest);

    const furnaceFrame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.12), this.trimMat);
    furnaceFrame.position.set(0, 0.18, 0.4);
    const furnaceCore = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.14), this.coreMat);
    furnaceCore.position.set(0, 0.18, 0.41);
    this.arcReactor = furnaceCore;
    this.torsoGroup.add(furnaceFrame, furnaceCore);

    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, 0.45, -0.28);

    [-0.32, 0.32].forEach(xOff => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.75, 12), this.thrusterMat);
      pipe.position.set(xOff, 0.2, 0);
      pipe.rotation.z = xOff > 0 ? -0.1 : 0.1;

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.15, 12), this.trimMat);
      rim.position.set(xOff, 0.58, 0);

      const interiorGlow = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), this.exhaustGlowMat);
      interiorGlow.position.set(xOff, 0.65, 0);
      interiorGlow.rotation.x = -Math.PI / 2;

      exhaustGroup.add(pipe, rim, interiorGlow);
    });
    this.torsoGroup.add(exhaustGroup);
    this.animatedParts.exhaust = exhaustGroup;

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.85, 0);
    this.torsoGroup.add(this.headGroup);

    const helmGeom = new THREE.BoxGeometry(0.62, 0.54, 0.58);
    this.helmet = new THREE.Mesh(helmGeom, this.armorMat);
    this.headGroup.add(this.helmet);

    [-0.08, 0.08].forEach(yOff => {
      const eyeSlit = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.12), this.visorMat);
      eyeSlit.position.set(0, yOff, 0.3);
      this.headGroup.add(eyeSlit);
    });

    this.setupHatMount();
  }

  buildVoidSorcerer() {
    const torsoGeom = new THREE.CylinderGeometry(0.36, 0.44, 1.15, 16);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torsoGroup.add(this.torso);

    const mantle = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.65, 16), this.armorMat);
    mantle.position.set(0, 0.22, 0);
    this.torsoGroup.add(mantle);

    const starCore = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15), this.coreMat);
    starCore.position.set(0, 0.22, 0.3);
    this.arcReactor = starCore;
    this.torsoGroup.add(starCore);

    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0.1, 0);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xaa00ff,
      emissive: 0x6600cc,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.025, 8, 24), ringMat);
    ring1.rotation.x = Math.PI / 3;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.02, 8, 24), ringMat);
    ring2.rotation.y = Math.PI / 4;

    ringGroup.add(ring1, ring2);
    this.torsoGroup.add(ringGroup);
    this.animatedParts.runeRings = ringGroup;

    const catalystGroup = new THREE.Group();
    catalystGroup.position.set(0.75, 0.15, 0.35);

    const orbMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.14, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0xff00cc,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.5,
        transmission: 0.7,
        roughness: 0.1
      })
    );
    const orbRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 8, 20), ringMat);
    orbRing.rotation.x = Math.PI / 2;

    catalystGroup.add(orbMesh, orbRing);
    this.torsoGroup.add(catalystGroup);
    this.animatedParts.catalyst = catalystGroup;

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.85, 0);
    this.torsoGroup.add(this.headGroup);

    const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), this.armorMat);
    this.headGroup.add(cowl);

    [-1, 1].forEach(side => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 8), this.trimMat);
      horn.position.set(side * 0.28, 0.28, 0);
      horn.rotation.z = side * -0.55;
      horn.rotation.x = -0.2;
      this.headGroup.add(horn);
    });

    const voidFace = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), this.visorMat);
    voidFace.position.set(0, 0.02, 0.14);
    this.headGroup.add(voidFace);

    this.setupHatMount();
  }

  buildNeonValkyrie() {
    const torsoGeom = new THREE.CylinderGeometry(0.35, 0.3, 1.05, 16);
    this.torso = new THREE.Mesh(torsoGeom, this.undersuitMat);
    this.torsoGroup.add(this.torso);

    const chestGeom = new THREE.BoxGeometry(0.7, 0.6, 0.4);
    this.chest = new THREE.Mesh(chestGeom, this.armorMat);
    this.chest.position.set(0, 0.15, 0.08);
    this.torsoGroup.add(this.chest);

    const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), this.coreMat);
    prism.position.set(0, 0.22, 0.3);
    this.arcReactor = prism;
    this.torsoGroup.add(prism);

    const wingMount = new THREE.Group();
    wingMount.position.set(0, 0.35, -0.25);

    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      emissive: 0x0088ff,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      transmission: 0.5,
      transparent: true,
      opacity: 0.85
    });

    const makeWing = (side) => {
      const wingGroup = new THREE.Group();
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.06), this.armorMat);
      strut.position.set(side * 0.3, 0.25, 0);
      strut.rotation.z = side * -0.7;
      wingGroup.add(strut);

      [0, 1, 2].forEach(f => {
        const feather = new THREE.Mesh(new THREE.ConeGeometry(0.08 - f * 0.015, 0.7 - f * 0.12, 6), wingMat);
        feather.position.set(side * (0.45 + f * 0.25), 0.35 - f * 0.18, 0);
        feather.rotation.z = side * (-1.1 - f * 0.15);
        wingGroup.add(feather);
      });
      return wingGroup;
    };

    const leftWing = makeWing(-1);
    const rightWing = makeWing(1);
    wingMount.add(leftWing, rightWing);
    this.torsoGroup.add(wingMount);
    this.animatedParts.leftWing = leftWing;
    this.animatedParts.rightWing = rightWing;

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.82, 0);
    this.torsoGroup.add(this.headGroup);

    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 18), this.armorMat);
    this.headGroup.add(helm);

    [-1, 1].forEach(side => {
      const earWing = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 6), this.trimMat);
      earWing.position.set(side * 0.38, 0.2, 0);
      earWing.rotation.z = side * -0.8;
      earWing.rotation.x = -0.3;
      this.headGroup.add(earWing);
    });

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI, 0, Math.PI), this.visorMat);
    visor.position.set(0, 0.02, 0.1);
    visor.rotation.x = -Math.PI / 2;
    visor.rotation.z = Math.PI;
    this.headGroup.add(visor);

    this.setupHatMount();
  }

  buildMagicalRue() {
    // 1. Bodice & Peplum Layered Skirt
    const bodiceGeom = new THREE.CylinderGeometry(0.3, 0.24, 0.9, 16);
    this.torso = new THREE.Mesh(bodiceGeom, this.undersuitMat);
    this.torso.castShadow = true;
    this.torsoGroup.add(this.torso);

    const corsetGeom = new THREE.BoxGeometry(0.56, 0.52, 0.32);
    this.chest = new THREE.Mesh(corsetGeom, this.armorMat);
    this.chest.position.set(0, 0.14, 0.06);
    this.chest.castShadow = true;
    this.torsoGroup.add(this.chest);

    // Glowing Heart Core
    const heartCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), this.coreMat);
    heartCore.position.set(0, 0.18, 0.24);
    heartCore.rotation.x = Math.PI / 4;
    this.arcReactor = heartCore;
    this.torsoGroup.add(heartCore);

    // Golden waist belt
    const beltGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16);
    const belt = new THREE.Mesh(beltGeom, this.trimMat);
    belt.position.set(0, -0.32, 0);
    this.torsoGroup.add(belt);

    // Flared Peplum Skirt (Cute layered fairy skirt)
    const skirtMat = new THREE.MeshStandardMaterial({
      color: 0xff70a6,
      roughness: 0.35,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const skirtGeom = new THREE.ConeGeometry(0.56, 0.38, 18, 1, true);
    const skirt = new THREE.Mesh(skirtGeom, skirtMat);
    skirt.position.set(0, -0.38, 0);
    skirt.rotation.x = Math.PI;
    this.torsoGroup.add(skirt);

    // Petticoat lace frill underneath
    const frillMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const frillGeom = new THREE.ConeGeometry(0.62, 0.2, 18, 1, true);
    const frill = new THREE.Mesh(frillGeom, frillMat);
    frill.position.set(0, -0.46, 0);
    frill.rotation.x = Math.PI;
    this.torsoGroup.add(frill);

    // Waist ribbon bow at back
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, -0.32, -0.28);
    [-0.1, 0.1].forEach(bx => {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.03, 8, 16), this.trimMat);
      loop.position.x = bx;
      loop.rotation.y = Math.PI / 2;
      bowGroup.add(loop);
    });
    [-0.06, 0.06].forEach(tx => {
      const ribbonTail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.02), this.trimMat);
      ribbonTail.position.set(tx, -0.18, 0.02);
      ribbonTail.rotation.z = Math.sign(tx) * 0.2;
      bowGroup.add(ribbonTail);
    });
    this.torsoGroup.add(bowGroup);

    // 2. Iridescent Fairy Wings
    const wingMount = new THREE.Group();
    wingMount.position.set(0, 0.22, -0.2);

    const fairyWingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffb7eb,
      emissive: 0xff69b4,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });

    const createFairyWing = (side) => {
      const wingGroup = new THREE.Group();

      // Upper primary wing
      const upperWing = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.85, 8), fairyWingMat);
      upperWing.scale.set(1.5, 1, 0.2);
      upperWing.position.set(side * 0.45, 0.38, 0);
      upperWing.rotation.z = side * -0.95;
      upperWing.rotation.x = -0.15;
      wingGroup.add(upperWing);

      // Lower secondary wing
      const lowerWing = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 8), fairyWingMat);
      lowerWing.scale.set(1.4, 1, 0.2);
      lowerWing.position.set(side * 0.35, -0.05, 0);
      lowerWing.rotation.z = side * -1.55;
      lowerWing.rotation.x = -0.1;
      wingGroup.add(lowerWing);

      // Wing vein filament
      const vein = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.01, 0.9, 8), this.trimMat);
      vein.position.set(side * 0.42, 0.36, 0.02);
      vein.rotation.z = side * -0.95;
      wingGroup.add(vein);

      return wingGroup;
    };

    const fairyLeftWing = createFairyWing(-1);
    const fairyRightWing = createFairyWing(1);
    wingMount.add(fairyLeftWing, fairyRightWing);
    this.torsoGroup.add(wingMount);
    this.animatedParts.fairyLeftWing = fairyLeftWing;
    this.animatedParts.fairyRightWing = fairyRightWing;

    // 3. Head & Magical Hair with Twin Ribbons & Crown
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.82, 0);
    this.torsoGroup.add(this.headGroup);

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f6,
      roughness: 0.5,
      metalness: 0.05
    });
    const headGeom = new THREE.SphereGeometry(0.33, 20, 20);
    this.helmet = new THREE.Mesh(headGeom, headMat);
    this.helmet.castShadow = true;
    this.headGroup.add(this.helmet);

    // Starlight Hair (Soft Lavender-Pink)
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xff99c8,
      roughness: 0.4,
      metalness: 0.15
    });
    const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 18), hairMat);
    hairBase.position.set(0, 0.03, -0.05);
    this.headGroup.add(hairBase);

    // Front Bangs / Fringe
    [-0.14, 0, 0.14].forEach(fx => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 6), hairMat);
      bang.position.set(fx, 0.18, 0.28);
      bang.rotation.x = 0.4;
      bang.rotation.z = fx * 0.3;
      this.headGroup.add(bang);
    });

    // Twin Pigtails with Golden Ribbon Bows
    const pigtailLeft = new THREE.Group();
    pigtailLeft.position.set(-0.35, 0.15, -0.08);
    const pigtailRight = new THREE.Group();
    pigtailRight.position.set(0.35, 0.15, -0.08);

    [pigtailLeft, pigtailRight].forEach((pg, idx) => {
      const s = idx === 0 ? -1 : 1;
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 16), this.trimMat);
      bow.rotation.y = Math.PI / 2;
      pg.add(bow);

      const ribbonTail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.015), this.trimMat);
      ribbonTail.position.set(s * 0.04, -0.22, 0.04);
      ribbonTail.rotation.z = s * 0.25;
      pg.add(ribbonTail);

      const hairStrand = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.72, 8), hairMat);
      hairStrand.position.set(s * 0.05, -0.38, 0);
      hairStrand.rotation.z = s * 0.15;
      pg.add(hairStrand);
    });

    this.headGroup.add(pigtailLeft, pigtailRight);
    this.animatedParts.pigtailLeft = pigtailLeft;
    this.animatedParts.pigtailRight = pigtailRight;

    // Starlight Tiara / Crown
    const tiaraArch = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 16, Math.PI), this.trimMat);
    tiaraArch.position.set(0, 0.26, 0.08);
    tiaraArch.rotation.x = -Math.PI / 2;
    this.headGroup.add(tiaraArch);

    const crownGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), this.coreMat);
    crownGem.position.set(0, 0.38, 0.22);
    crownGem.rotation.x = Math.PI / 4;
    this.headGroup.add(crownGem);

    // Sparkly Magical Mask / Visor
    const maskGeom = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI, 0, Math.PI * 0.42);
    this.visor = new THREE.Mesh(maskGeom, this.visorMat);
    this.visor.position.set(0, 0.02, 0.08);
    this.visor.rotation.x = -Math.PI / 2;
    this.visor.rotation.z = Math.PI;
    this.headGroup.add(this.visor);

    this.setupHatMount();
  }

  setupHatMount() {
    this.hatMount = new THREE.Group();
    this.hatMount.position.set(0, 0.38, 0);
    this.headGroup.add(this.hatMount);
    this.applyHat(this.currentHat);
  }

  createArm(side) {
    const armGroup = new THREE.Group();
    const scaleFactor = this.characterType === 'titan_mech' ? 1.35 : this.characterType === 'magical_rue' ? 0.85 : 1.0;

    const pRadius = this.characterType === 'titan_mech' ? 0.26 : this.characterType === 'magical_rue' ? 0.14 : 0.18;
    const pauldronGeom = new THREE.SphereGeometry(pRadius, 12, 12, 0, Math.PI);
    const pauldron = new THREE.Mesh(pauldronGeom, this.armorMat);
    pauldron.position.set(0, 0.04, 0);
    pauldron.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;
    armGroup.add(pauldron);

    const upperGeom = new THREE.CylinderGeometry(0.1 * scaleFactor, 0.09 * scaleFactor, 0.45, 12);
    const upper = new THREE.Mesh(upperGeom, this.undersuitMat);
    upper.position.set(0, -0.2, 0);
    upper.castShadow = true;
    armGroup.add(upper);

    const forearmGeom = new THREE.CylinderGeometry(0.11 * scaleFactor, 0.13 * scaleFactor, 0.45, 12);
    const forearm = new THREE.Mesh(forearmGeom, this.armorMat);
    forearm.position.set(0, -0.55, 0);
    forearm.castShadow = true;
    armGroup.add(forearm);

    const gloveGeom = new THREE.SphereGeometry(0.12 * scaleFactor, 12, 12);
    const glove = new THREE.Mesh(gloveGeom, this.trimMat);
    glove.position.set(0, -0.78, 0);
    armGroup.add(glove);

    if (this.characterType === 'magical_rue' && side === 1) {
      const wand = new THREE.Group();
      wand.position.set(0, -0.72, 0.12);
      wand.rotation.x = Math.PI / 4;

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.75, 12),
        this.trimMat
      );
      wand.add(shaft);

      const wandTop = new THREE.Group();
      wandTop.position.set(0, 0.42, 0);

      const ringMount = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.03, 8, 16),
        this.trimMat
      );
      wandTop.add(ringMount);

      const starGem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.11),
        this.coreMat
      );
      wandTop.add(starGem);
      this.animatedParts.starWandGem = starGem;

      [-0.14, 0.14].forEach(sx => {
        const winglet = new THREE.Mesh(
          new THREE.ConeGeometry(0.05, 0.18, 4),
          this.trimMat
        );
        winglet.position.set(sx, 0, 0);
        winglet.rotation.z = -Math.sign(sx) * (Math.PI / 3);
        wandTop.add(winglet);
      });

      wand.add(wandTop);
      armGroup.add(wand);
    }

    return armGroup;
  }

  createLeg(side) {
    const legGroup = new THREE.Group();
    const scaleFactor = this.characterType === 'titan_mech' ? 1.35 : this.characterType === 'magical_rue' ? 0.88 : 1.0;

    const thighGeom = new THREE.CylinderGeometry(0.14 * scaleFactor, 0.12 * scaleFactor, 0.46, 12);
    const thigh = new THREE.Mesh(thighGeom, this.undersuitMat);
    thigh.position.set(0, -0.22, 0);
    thigh.castShadow = true;
    legGroup.add(thigh);

    const kneeGeom = new THREE.BoxGeometry(0.2 * scaleFactor, 0.14 * scaleFactor, 0.14 * scaleFactor);
    const knee = new THREE.Mesh(kneeGeom, this.armorMat);
    knee.position.set(0, -0.42, 0.08);
    legGroup.add(knee);

    const calfGeom = new THREE.CylinderGeometry(0.13 * scaleFactor, 0.15 * scaleFactor, 0.44, 12);
    const calf = new THREE.Mesh(calfGeom, this.armorMat);
    calf.position.set(0, -0.66, 0);
    calf.castShadow = true;
    legGroup.add(calf);

    const footGeom = new THREE.BoxGeometry(0.22 * scaleFactor, 0.14, 0.38 * scaleFactor);
    const foot = new THREE.Mesh(footGeom, this.trimMat);
    foot.position.set(0, -0.84, 0.08);
    foot.castShadow = true;
    legGroup.add(foot);

    return legGroup;
  }

  applyHat(hatId) {
    if (!this.hatMount) return;
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
    if (this.armorMat) this.armorMat.color.setHex(pCol);
  }

  setCharacterType(typeId) {
    if (this.characterType === typeId) return;
    this.characterType = typeId;
    this.createModel();
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

    if (this.arcReactor) {
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
    }

    if (this.animatedParts.scarf) {
      this.animatedParts.scarf.rotation.z = Math.sin(t * 8) * 0.12;
      this.animatedParts.scarf.rotation.x = (isMoving ? -0.4 : -0.1) + Math.sin(t * 10) * 0.1;
    }

    if (this.animatedParts.runeRings) {
      this.animatedParts.runeRings.children[0].rotation.y += dt * 2.2;
      this.animatedParts.runeRings.children[1].rotation.x += dt * 1.8;
    }

    if (this.animatedParts.catalyst) {
      this.animatedParts.catalyst.position.y = 0.15 + Math.sin(t * 3.5) * 0.1;
      this.animatedParts.catalyst.children[0].rotation.y += dt * 2.5;
      this.animatedParts.catalyst.children[1].rotation.x += dt * 3.0;
    }

    if (this.animatedParts.leftWing && this.animatedParts.rightWing) {
      const wingFlap = isGrounded ? Math.sin(t * 4) * 0.12 : Math.sin(t * 9) * 0.28;
      this.animatedParts.leftWing.rotation.y = wingFlap;
      this.animatedParts.rightWing.rotation.y = -wingFlap;
    }

    if (this.animatedParts.fairyLeftWing && this.animatedParts.fairyRightWing) {
      const flapSpeed = isGrounded ? (isMoving ? 14 : 7) : 24;
      const flapAmp = isGrounded ? (isMoving ? 0.25 : 0.12) : 0.48;
      const flutter = Math.sin(t * flapSpeed) * flapAmp;
      this.animatedParts.fairyLeftWing.rotation.y = flutter;
      this.animatedParts.fairyRightWing.rotation.y = -flutter;
      this.animatedParts.fairyLeftWing.rotation.z = -0.18 - (isGrounded ? 0 : 0.12);
      this.animatedParts.fairyRightWing.rotation.z = 0.18 + (isGrounded ? 0 : 0.12);
    }

    if (this.animatedParts.pigtailLeft && this.animatedParts.pigtailRight) {
      const pigtailSway = Math.sin(t * 6) * 0.08 + (isMoving ? 0.1 : 0);
      this.animatedParts.pigtailLeft.rotation.z = -pigtailSway;
      this.animatedParts.pigtailRight.rotation.z = pigtailSway;
    }

    if (this.animatedParts.starWandGem) {
      this.animatedParts.starWandGem.rotation.y += dt * 3.5;
      this.animatedParts.starWandGem.rotation.z += dt * 2.0;
    }

    const targetLean = isMoving ? (isSprinting ? 0.28 : 0.12) : 0;
    this.pivotGroup.rotation.x += (targetLean - this.pivotGroup.rotation.x) * Math.min(1, dt * 10);

    if (isMoving && isGrounded) {
      const animRate = isSprinting ? 18 : 11;
      this.walkCycle += dt * animRate;

      const swing = Math.sin(this.walkCycle);
      const legAngle = isSprinting ? 0.95 : 0.65;
      const armAngle = isSprinting ? 0.85 : 0.5;

      this.leftLegGroup.rotation.x = -swing * legAngle;
      this.rightLegGroup.rotation.x = swing * legAngle;

      this.leftArmGroup.rotation.x = swing * armAngle;
      this.rightArmGroup.rotation.x = -swing * armAngle;

      this.leftArmGroup.rotation.z = 0.08;
      this.rightArmGroup.rotation.z = -0.08;

      this.torsoGroup.position.y = 1.35 + Math.abs(Math.sin(this.walkCycle)) * 0.1;

      if (mx !== 0 || mz !== 0) {
        this.group.rotation.y = Math.atan2(mx, mz);
      }

      if (isSprinting && particleManager && Math.random() < 0.35) {
        const thrustColor = feverTime > 0 ? 0xff00ff : this.characterType === 'magical_rue' ? 0xff69b4 : this.characterType === 'titan_mech' ? 0xff4400 : 0x00f0ff;
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
      this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, -0.35, dt * 10);
      this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, 0.25, dt * 10);
      this.leftArmGroup.rotation.x = THREE.MathUtils.lerp(this.leftArmGroup.rotation.x, -0.5, dt * 10);
      this.rightArmGroup.rotation.x = THREE.MathUtils.lerp(this.rightArmGroup.rotation.x, -0.5, dt * 10);
      this.leftArmGroup.rotation.z = THREE.MathUtils.lerp(this.leftArmGroup.rotation.z, 0.45, dt * 10);
      this.rightArmGroup.rotation.z = THREE.MathUtils.lerp(this.rightArmGroup.rotation.z, -0.45, dt * 10);
      this.torsoGroup.position.y = 1.35;

      if (particleManager && Math.random() < 0.4) {
        const thrustColor = feverTime > 0 ? 0xff00ff : this.characterType === 'magical_rue' ? 0xff69b4 : this.characterType === 'titan_mech' ? 0xff4400 : 0x00f0ff;
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
