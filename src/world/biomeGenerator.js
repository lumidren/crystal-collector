import * as THREE from 'three';

// Procedural Biome, Scenery, Jump Pads, Weather Particles & Celestial Starfield
export class BiomeGenerator {
  static getBiomeData(level) {
    if (level <= 2) {
      return {
        id: 'forest',
        name: 'Forest Valley',
        skyColor: 0x0a1424,
        groundColor: 0x1e4634,
        wallColor: 0x4a2e1b,
        ambientColor: 0x304535,
        neonColor: 0x00ff88,
        fog: { color: 0x0a1424, near: 20, far: 60 },
        friction: 1.0,
        jumpPadColor: 0xffd700,
        hasLava: false,
        weather: { count: 180, color: 0xa7c957, size: 0.22, speed: 1.5, type: 'fall' }
      };
    } else if (level <= 4) {
      return {
        id: 'cavern',
        name: 'Crystal Cavern',
        skyColor: 0x070415,
        groundColor: 0x18142e,
        wallColor: 0x271f4d,
        ambientColor: 0x301848,
        neonColor: 0x00f0ff,
        fog: { color: 0x0c0722, near: 18, far: 50 },
        friction: 1.0,
        jumpPadColor: 0x00ffff,
        hasLava: false,
        weather: { count: 220, color: 0xbd00ff, size: 0.25, speed: 0.8, type: 'float' }
      };
    } else if (level <= 6) {
      return {
        id: 'tundra',
        name: 'Frozen Tundra',
        skyColor: 0x060e1e,
        groundColor: 0x8ecae6,
        wallColor: 0x2b4c6f,
        ambientColor: 0x406085,
        neonColor: 0x00e5ff,
        fog: { color: 0x0a182e, near: 22, far: 55 },
        friction: 0.94, // slick ice physics!
        jumpPadColor: 0x00e5ff,
        hasLava: false,
        weather: { count: 300, color: 0xffffff, size: 0.2, speed: 3.5, type: 'snow' }
      };
    } else if (level <= 8) {
      return {
        id: 'volcano',
        name: 'Volcanic Caldera',
        skyColor: 0x180202,
        groundColor: 0x1f0f10,
        wallColor: 0x3d0b0e,
        ambientColor: 0x501515,
        neonColor: 0xff3300,
        fog: { color: 0x220505, near: 15, far: 45 },
        friction: 1.0,
        jumpPadColor: 0xff4500,
        hasLava: true,
        weather: { count: 240, color: 0xff6600, size: 0.28, speed: 2.2, type: 'rise' }
      };
    } else {
      return {
        id: 'void',
        name: level === 10 ? 'THE FINAL GAUNTLET' : 'Cosmic Void',
        skyColor: 0x03000a,
        groundColor: 0x0d0322,
        wallColor: 0x4b0ca6,
        ambientColor: 0x351050,
        neonColor: 0xff00aa,
        fog: { color: 0x050012, near: 18, far: 52 },
        friction: 1.0,
        jumpPadColor: 0xbd00ff,
        hasLava: true,
        weather: { count: 260, color: 0x00f0ff, size: 0.3, speed: 1.2, type: 'float' }
      };
    }
  }

  static buildBiome(level, scene) {
    const biome = this.getBiomeData(level);
    const decorations = [];
    const jumpPads = [];
    const hazardZones = [];

    // 1. Celestial Starfield Dome
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 70 + Math.random() * 20;

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5; // keep above ground
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Star tinting
      const tint = Math.random();
      if (tint < 0.3) {
        starColors[i * 3] = 0.5; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0; // Cyan
      } else if (tint < 0.5) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 0.4; // Amber
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0; // White
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    decorations.push(starField);

    // 2. Ambient Weather Particle System
    const wCfg = biome.weather;
    const weatherGeo = new THREE.BufferGeometry();
    const weatherPos = new Float32Array(wCfg.count * 3);
    const weatherVel = [];

    for (let i = 0; i < wCfg.count; i++) {
      weatherPos[i * 3] = (Math.random() - 0.5) * 50;
      weatherPos[i * 3 + 1] = Math.random() * 20;
      weatherPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      weatherVel.push({
        x: (Math.random() - 0.5) * 0.4,
        y: wCfg.type === 'rise' ? Math.random() * 1.5 + 0.5 : -(Math.random() * wCfg.speed + 0.5),
        z: (Math.random() - 0.5) * 0.4
      });
    }

    weatherGeo.setAttribute('position', new THREE.BufferAttribute(weatherPos, 3));
    const weatherMat = new THREE.PointsMaterial({
      color: wCfg.color,
      size: wCfg.size,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const weatherField = new THREE.Points(weatherGeo, weatherMat);
    scene.add(weatherField);
    decorations.push(weatherField);

    // 3. Glowing Perimeter Edge Rails (Top of Boundary Walls)
    [[0, 5.05, -25], [0, 5.05, 25], [-25, 5.05, 0], [25, 5.05, 0]].forEach((pos, i) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(50, 0.15, 0.2),
        new THREE.MeshBasicMaterial({
          color: biome.neonColor,
          transparent: true,
          opacity: 0.85
        })
      );
      rail.position.set(...pos);
      if (i > 1) rail.rotation.y = Math.PI / 2;
      scene.add(rail);
      decorations.push(rail);
    });

    // 4. Jump Pads (Golden / Cyan launch trampolines)
    const padCoords = [
      { x: -14, z: -14 },
      { x: 14, z: 14 },
      { x: -14, z: 14 },
      { x: 14, z: -14 }
    ].slice(0, level >= 5 ? 4 : 2);

    padCoords.forEach(pos => {
      const padGroup = new THREE.Group();

      // Outer rim with metallic finish
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.8, 0.25, 32),
        new THREE.MeshStandardMaterial({ color: 0x1e2430, metalness: 0.8, roughness: 0.3 })
      );
      rim.position.y = 0.125;
      rim.castShadow = true;
      rim.receiveShadow = true;
      padGroup.add(rim);

      // Glowing launch pad surface
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 32),
        new THREE.MeshStandardMaterial({
          color: biome.jumpPadColor,
          emissive: biome.jumpPadColor,
          emissiveIntensity: 0.7,
          metalness: 0.4,
          roughness: 0.2
        })
      );
      pad.position.y = 0.16;
      padGroup.add(pad);

      // Launch arrow indicator
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 0.8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      arrow.position.y = 0.55;
      padGroup.add(arrow);

      padGroup.position.set(pos.x, 0, pos.z);
      scene.add(padGroup);
      decorations.push(padGroup);

      jumpPads.push({
        group: padGroup,
        arrow,
        x: pos.x,
        z: pos.z,
        radius: 1.6
      });
    });

    // 5. Biome Props & Environments
    if (biome.id === 'forest') {
      // Low-poly pine trees with shadows
      for (let i = 0; i < 8; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.45, 2.2, 8),
          new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.8 })
        );
        trunk.position.y = 1.1;
        trunk.castShadow = true;
        tree.add(trunk);

        for (let j = 0; j < 3; j++) {
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(2.0 - j * 0.45, 2.2, 7),
            new THREE.MeshStandardMaterial({
              color: 0x1b4332 + j * 0x051505,
              roughness: 0.7
            })
          );
          foliage.position.y = 2.2 + j * 1.3;
          foliage.castShadow = true;
          tree.add(foliage);
        }

        const angle = (i / 8) * Math.PI * 2 + 0.3;
        const r = 18 + (i % 2) * 3;
        tree.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        scene.add(tree);
        decorations.push(tree);
      }

      // Mossy boulders
      for (let i = 0; i < 6; i++) {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.3 + Math.random() * 0.5),
          new THREE.MeshStandardMaterial({ color: 0x3d4349, roughness: 0.85 })
        );
        const angle = (i / 6) * Math.PI * 2 + 0.8;
        rock.position.set(Math.cos(angle) * 12, 0.6, Math.sin(angle) * 12);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
        decorations.push(rock);
      }
    } else if (biome.id === 'cavern') {
      // Luminescent crystalline stalagmites
      const colors = [0x00f0ff, 0xff00ea, 0x7b2cbf];
      for (let i = 0; i < 10; i++) {
        const color = colors[i % colors.length];
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.85, 3.8 + (i % 3), 6),
          new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.5
          })
        );
        const angle = (i / 10) * Math.PI * 2 + 0.2;
        const r = 16 + (i % 3) * 2;
        spike.position.set(Math.cos(angle) * r, 1.9, Math.sin(angle) * r);
        spike.castShadow = true;
        scene.add(spike);
        decorations.push(spike);
      }
    } else if (biome.id === 'tundra') {
      // Physical glass-like ice pillars
      for (let i = 0; i < 10; i++) {
        const ice = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.6 + (i % 2) * 0.5),
          new THREE.MeshPhysicalMaterial({
            color: 0xe0fbfc,
            emissive: 0x00b4d8,
            emissiveIntensity: 0.35,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.7,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1.0
          })
        );
        const angle = (i / 10) * Math.PI * 2 + 0.4;
        const r = 17 + (i % 2) * 3;
        ice.position.set(Math.cos(angle) * r, 1.6, Math.sin(angle) * r);
        ice.rotation.set(Math.random(), Math.random(), 0);
        ice.castShadow = true;
        scene.add(ice);
        decorations.push(ice);
      }
    } else if (biome.hasLava) {
      // Obsidian / basalt pillars
      for (let i = 0; i < 8; i++) {
        const col = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 4.5 + (i % 2) * 2, 1.8),
          new THREE.MeshStandardMaterial({ color: 0x141010, roughness: 0.7, metalness: 0.3 })
        );
        const angle = (i / 8) * Math.PI * 2 + 0.1;
        col.position.set(Math.cos(angle) * 19, 2.25, Math.sin(angle) * 19);
        col.castShadow = true;
        col.receiveShadow = true;
        scene.add(col);
        decorations.push(col);
      }

      // Molten Lava Hazard Pools
      const lavaSpots = [
        { x: -8, z: 0, r: 2.7 },
        { x: 8, z: 0, r: 2.7 },
        { x: 0, z: -8, r: 2.7 }
      ];

      lavaSpots.forEach(s => {
        const poolGroup = new THREE.Group();

        // Basalt border rim
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(s.r + 0.15, 0.2, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0x221815, roughness: 0.9 })
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.04;
        poolGroup.add(rim);

        // Pulsing molten magma core
        const magma = new THREE.Mesh(
          new THREE.CylinderGeometry(s.r, s.r, 0.06, 24),
          new THREE.MeshStandardMaterial({
            color: 0xff3700,
            emissive: 0xff2200,
            emissiveIntensity: 0.9,
            roughness: 0.3
          })
        );
        magma.position.y = 0.03;
        poolGroup.add(magma);

        poolGroup.position.set(s.x, 0, s.z);
        scene.add(poolGroup);
        decorations.push(poolGroup);

        hazardZones.push({
          mesh: magma,
          group: poolGroup,
          x: s.x,
          z: s.z,
          radius: s.r
        });
      });
    }

    // 6. Vertical Multi-Tiered Sky Islands & Floating Bridges
    const platforms = [];
    const platformConfigs = [
      // Island 1: West Sky Deck (Elevation: 3.8m)
      { id: 'island-west', x: -13, y: 3.8, z: -9, width: 8.5, depth: 8.5, height: 0.6, color: biome.neonColor },
      // Island 2: East Sky Deck (Elevation: 4.6m)
      { id: 'island-east', x: 13, y: 4.6, z: 9, width: 8.5, depth: 8.5, height: 0.6, color: biome.neonColor },
      // Sky Bridge: Central Connecting Span (Elevation: 5.8m)
      { id: 'bridge-mid', x: 0, y: 5.8, z: -5, width: 4.8, depth: 10, height: 0.4, color: 0x00f0ff },
      // Island 3: High-Altitude Apex Peak (Elevation: 7.5m)
      { id: 'island-apex', x: 0, y: 7.5, z: 12, width: 9.5, depth: 9.5, height: 0.8, color: 0xffd700 }
    ];

    platformConfigs.forEach(p => {
      const pGroup = new THREE.Group();

      // Platform Deck
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(p.width, p.height, p.depth),
        new THREE.MeshStandardMaterial({
          color: 0x141b29,
          roughness: 0.4,
          metalness: 0.82
        })
      );
      deck.castShadow = true;
      deck.receiveShadow = true;
      pGroup.add(deck);

      // Neon Underglow Edge Trim
      const edgeTrim = new THREE.Mesh(
        new THREE.BoxGeometry(p.width + 0.15, 0.1, p.depth + 0.15),
        new THREE.MeshBasicMaterial({ color: p.color })
      );
      edgeTrim.position.y = -p.height / 2;
      pGroup.add(edgeTrim);

      // Anti-Gravity Levitating Repulsor Crystal
      const repulsor = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.85),
        new THREE.MeshBasicMaterial({ color: p.color })
      );
      repulsor.position.y = -p.height / 2 - 0.7;
      pGroup.add(repulsor);

      // Soft under-platform repulsor light illuminating the ground beneath the island
      const underLight = new THREE.PointLight(p.color, 1.2, 16, 1.8);
      underLight.position.set(0, -p.height / 2 - 0.75, 0);
      pGroup.add(underLight);

      // Corner Holographic Landing Beacons
      [
        [-p.width / 2 + 0.3, p.depth / 2 - 0.3],
        [p.width / 2 - 0.3, p.depth / 2 - 0.3],
        [-p.width / 2 + 0.3, -p.depth / 2 + 0.3],
        [p.width / 2 - 0.3, -p.depth / 2 + 0.3]
      ].forEach(corner => {
        const beacon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8),
          new THREE.MeshBasicMaterial({ color: p.color })
        );
        beacon.position.set(corner[0], p.height / 2 + 0.25, corner[1]);
        pGroup.add(beacon);
      });

      pGroup.position.set(p.x, p.y, p.z);
      scene.add(pGroup);
      decorations.push(pGroup);

      platforms.push({
        id: p.id,
        group: pGroup,
        repulsor,
        x: p.x,
        y: p.y,
        z: p.z,
        width: p.width,
        depth: p.depth,
        height: p.height,
        topY: Math.round((p.y + p.height / 2) * 100) / 100,
        minX: Math.round((p.x - p.width / 2) * 100) / 100,
        maxX: Math.round((p.x + p.width / 2) * 100) / 100,
        minZ: Math.round((p.z - p.depth / 2) * 100) / 100,
        maxZ: Math.round((p.z + p.depth / 2) * 100) / 100
      });
    });

    return { biome, decorations, jumpPads, hazardZones, platforms, starField, weatherField, weatherPos, weatherVel, wCfg };
  }

  // Update weather particles and starfield in animation loop
  static updateEnvironment(dt, env) {
    if (!env) return;

    // Rotate starfield slowly
    if (env.starField) {
      env.starField.rotation.y += dt * 0.015;
    }

    // Animate anti-gravity repulsors on sky islands
    if (env.platforms) {
      env.platforms.forEach(p => {
        if (p.repulsor) {
          p.repulsor.rotation.y += dt * 2.2;
          p.repulsor.rotation.x += dt * 1.1;
        }
      });
    }

    // Animate weather particles
    if (env.weatherField && env.weatherPos && env.weatherVel) {
      const pos = env.weatherPos;
      const vel = env.weatherVel;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += vel[i].x * dt * 2;
        pos[i * 3 + 1] += vel[i].y * dt;
        pos[i * 3 + 2] += vel[i].z * dt * 2;

        // Wrap around boundaries
        if (env.wCfg.type === 'rise') {
          if (pos[i * 3 + 1] > 18) {
            pos[i * 3 + 1] = 0.1;
            pos[i * 3] = (Math.random() - 0.5) * 46;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 46;
          }
        } else {
          if (pos[i * 3 + 1] < 0.1) {
            pos[i * 3 + 1] = 18;
            pos[i * 3] = (Math.random() - 0.5) * 46;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 46;
          }
        }
      }
      env.weatherField.geometry.attributes.position.needsUpdate = true;
    }
  }
}
