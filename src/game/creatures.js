import * as THREE from 'three';

/**
 * Procedural 3D Cyber Stalker Creature (Xenomorph Bio-Mecha)
 * High-poly procedural creature with segmented carapace, predatory jaws,
 * 4 crawling jointed legs, and a whipping scorpion stinger tail.
 */
export function createCyberCreature() {
  const creature = new THREE.Group();

  const chitinMat = new THREE.MeshStandardMaterial({
    color: 0x12151e,
    roughness: 0.25,
    metalness: 0.85
  });

  const armorPlateMat = new THREE.MeshStandardMaterial({
    color: 0x1c2230,
    emissive: 0x330011,
    roughness: 0.3,
    metalness: 0.8
  });

  const bioGlowMat = new THREE.MeshBasicMaterial({
    color: 0xff0044
  });

  const eyeMat = new THREE.MeshBasicMaterial({
    color: 0xff0022
  });

  // 1. Central Armored Thorax
  const thorax = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.65, 1.3),
    chitinMat
  );
  thorax.position.set(0, 0.6, 0);
  thorax.castShadow = true;
  creature.add(thorax);

  // Dorsal Carapace Spine Ridge
  const dorsalShell = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.2, 4),
    armorPlateMat
  );
  dorsalShell.position.set(0, 0.95, -0.1);
  dorsalShell.rotation.x = -Math.PI / 3;
  creature.add(dorsalShell);

  // 3 Bio-Spines along the back
  [-0.3, 0.0, 0.3].forEach((zOffset, idx) => {
    const spine = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.45, 4),
      bioGlowMat
    );
    spine.position.set(0, 0.95 + idx * 0.06, zOffset);
    spine.rotation.x = -0.4;
    creature.add(spine);
  });

  // Inner pulsing Plasma Bio-Heart
  const heartCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.28),
    new THREE.MeshStandardMaterial({
      color: 0xff0033,
      emissive: 0xff1100,
      emissiveIntensity: 2.0,
      roughness: 0.1
    })
  );
  heartCore.position.set(0, 0.55, 0);
  creature.add(heartCore);

  // 2. Predatory Alien Head & Jaws
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.65, 0.75);

  // Tapered Cranium
  const cranium = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.9, 5),
    chitinMat
  );
  cranium.rotation.x = Math.PI / 2;
  headGroup.add(cranium);

  // Dual Bioluminescent Compound Eyes
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), eyeMat);
  eyeLeft.position.set(-0.24, 0.16, 0.28);
  const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), eyeMat);
  eyeRight.position.set(0.24, 0.16, 0.28);
  headGroup.add(eyeLeft);
  headGroup.add(eyeRight);

  // Articulated Razor Mandibles
  const mandibleMat = new THREE.MeshStandardMaterial({
    color: 0x30050e,
    emissive: 0xff0022,
    emissiveIntensity: 0.5,
    metalness: 0.9
  });
  const leftMandible = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.4, 4), mandibleMat);
  leftMandible.position.set(-0.2, -0.15, 0.45);
  leftMandible.rotation.z = -0.5;
  leftMandible.rotation.x = Math.PI / 2;

  const rightMandible = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.4, 4), mandibleMat);
  rightMandible.position.set(0.2, -0.15, 0.45);
  rightMandible.rotation.z = 0.5;
  rightMandible.rotation.x = Math.PI / 2;

  headGroup.add(leftMandible);
  headGroup.add(rightMandible);
  creature.add(headGroup);

  // 3. 4 Jointed Crawling Cyber Legs
  const legs = [];
  const legPositions = [
    { x: -0.5, z: 0.35, signX: -1, phase: 0 },
    { x: 0.5, z: 0.35, signX: 1, phase: Math.PI },
    { x: -0.55, z: -0.35, signX: -1, phase: Math.PI },
    { x: 0.55, z: -0.35, signX: 1, phase: 0 }
  ];

  legPositions.forEach((lp, idx) => {
    const legRoot = new THREE.Group();
    legRoot.position.set(lp.x, 0.5, lp.z);

    // Upper Leg (Femur)
    const femur = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.6, 6),
      chitinMat
    );
    femur.position.set(lp.signX * 0.25, 0.15, 0);
    femur.rotation.z = lp.signX * 0.8;
    legRoot.add(femur);

    // Knee Joint Sphere
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bioGlowMat);
    knee.position.set(lp.signX * 0.48, 0.3, 0);
    legRoot.add(knee);

    // Lower Leg (Tibia)
    const tibia = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.03, 0.7, 6),
      chitinMat
    );
    tibia.position.set(lp.signX * 0.65, -0.1, 0);
    tibia.rotation.z = lp.signX * -0.4;
    legRoot.add(tibia);

    creature.add(legRoot);
    legs.push({ root: legRoot, signX: lp.signX, phase: lp.phase, idx });
  });

  // 4. Bio-Mechanical Whipping Stinger Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.65, -0.65);

  const tailSegments = [];
  let currentParent = tailGroup;

  for (let s = 0; s < 4; s++) {
    const segGroup = new THREE.Group();
    segGroup.position.set(0, 0.16, -0.22);
    segGroup.rotation.x = 0.35; // Arches up over the back

    const segMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24 - s * 0.035, 0.2 - s * 0.03, 0.3),
      chitinMat
    );
    segMesh.position.set(0, 0, -0.12);
    segGroup.add(segMesh);

    currentParent.add(segGroup);
    tailSegments.push(segGroup);
    currentParent = segGroup;
  }

  // Energy Detonation Stinger Needle at tail tip
  const stinger = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.45, 4),
    new THREE.MeshStandardMaterial({
      color: 0xff0033,
      emissive: 0xff0044,
      emissiveIntensity: 2.2,
      metalness: 0.9
    })
  );
  stinger.position.set(0, 0.05, -0.32);
  stinger.rotation.x = -Math.PI / 2;
  currentParent.add(stinger);

  creature.add(tailGroup);

  // Store interactive animated parts in userData
  creature.userData = {
    type: 'creature',
    headGroup,
    leftMandible,
    rightMandible,
    eyeLeft,
    eyeRight,
    legs,
    tailSegments,
    tailGroup,
    heartCore,
    stinger,
    stalkTimer: 0,
    lungeCooldown: 0,
    isLunging: false,
    isWindup: false
  };

  return creature;
}
