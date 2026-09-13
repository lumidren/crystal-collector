import * as THREE from 'three';

// Procedural Biome, Scenery, Jump Pads, Weather Particles & Celestial Starfield
export class BiomeGenerator {
  static getBiomeData(level, isGirlsTheme = false) {
    if (isGirlsTheme) {
      return {
        id: 'sakura_dream',
        name: level === 10 ? 'THE STARLIGHT SANCTUARY' : 'Sakura Dreamland',
        skyColor: 0x16132b,
        groundColor: 0xede8f2,
        wallColor: 0x3d3245,
        ambientColor: 0xf5eefa,
        neonColor: 0xff6699,
        fog: { color: 0x241e38, near: 35, far: 110 },
        friction: 1.0,
        jumpPadColor: 0x2dd4bf,
        hasLava: false,
        isGirlsTheme: true,
        weather: { count: 180, color: 0xffb7c5, size: 0.32, speed: 0.75, type: 'sakura' }
      };
    }
    if (level <= 2) {
      return {
        id: 'forest',
        name: 'Forest Valley',
        skyColor: 0x0a1424,
        groundColor: 0x1e4634,
        wallColor: 0x4a2e1b,
        ambientColor: 0x304535,
        neonColor: 0x00ff88,
        fog: { color: 0x0a1424, near: 28, far: 95 },
        friction: 1.0,
        jumpPadColor: 0xffd700,
        hasLava: false,
        weather: { count: 240, color: 0xa7c957, size: 0.25, speed: 1.5, type: 'fall' }
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
        fog: { color: 0x0c0722, near: 26, far: 85 },
        friction: 1.0,
        jumpPadColor: 0x00ffff,
        hasLava: false,
        weather: { count: 280, color: 0xbd00ff, size: 0.28, speed: 0.8, type: 'float' }
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
        fog: { color: 0x0a182e, near: 30, far: 90 },
        friction: 0.94, // slick ice physics!
        jumpPadColor: 0x00e5ff,
        hasLava: false,
        weather: { count: 360, color: 0xffffff, size: 0.22, speed: 3.5, type: 'snow' }
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
        fog: { color: 0x220505, near: 24, far: 82 },
        friction: 1.0,
        jumpPadColor: 0xff4500,
        hasLava: true,
        weather: { count: 300, color: 0xff6600, size: 0.3, speed: 2.2, type: 'rise' }
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
        fog: { color: 0x050012, near: 26, far: 88 },
        friction: 1.0,
        jumpPadColor: 0xbd00ff,
        hasLava: true,
        weather: { count: 320, color: 0x00f0ff, size: 0.32, speed: 1.2, type: 'float' }
      };
    }
  }

  // Generate distinct platform layouts customized for each biome archetype
  static getPlatformConfigs(level, biome) {
    if (level <= 2) {
      // Biome 1: Forest Valley - Redwood Canopy Treehouses & Wooden Skywalks
      return [
        { id: 'treehouse-north', x: -16, y: 3.4, z: -16, width: 11, depth: 11, height: 0.6, color: 0x00ff88 },
        { id: 'treehouse-south', x: 16, y: 5.2, z: 16, width: 11, depth: 11, height: 0.6, color: 0x00ff88 },
        { id: 'bridge-canopy', x: 0, y: 4.3, z: 0, width: 6, depth: 16, height: 0.4, color: 0xa7c957 },
        { id: 'terrace-lookout', x: 0, y: 7.2, z: -24, width: 14, depth: 9, height: 0.7, color: 0xffd700 }
      ];
    } else if (level <= 4) {
      // Biome 2: Crystal Cavern - Ravine Catwalks & Luminescent Stalactite Deck
      return [
        { id: 'catwalk-west', x: -18, y: 4.0, z: 0, width: 8, depth: 22, height: 0.6, color: 0x00f0ff },
        { id: 'catwalk-east', x: 18, y: 5.4, z: 0, width: 8, depth: 22, height: 0.6, color: 0xbd00ff },
        { id: 'crystal-arch', x: 0, y: 6.6, z: 16, width: 16, depth: 7, height: 0.5, color: 0x00ffff },
        { id: 'stalactite-perch', x: 0, y: 8.5, z: -18, width: 12, depth: 12, height: 0.8, color: 0xff00ea }
      ];
    } else if (level <= 6) {
      // Biome 3: Frozen Tundra - Stepped Central Glacier Mountain Peak & Perimeter Ice Shelves
      return [
        { id: 'glacier-base', x: 0, y: 3.2, z: 0, width: 24, depth: 24, height: 0.7, color: 0x8ecae6 },
        { id: 'glacier-mid', x: 0, y: 5.8, z: 0, width: 15, depth: 15, height: 0.7, color: 0x00e5ff },
        { id: 'glacier-peak', x: 0, y: 8.6, z: 0, width: 8, depth: 8, height: 0.8, color: 0xffffff },
        { id: 'ice-shelf-north', x: -22, y: 4.4, z: -22, width: 10, depth: 10, height: 0.5, color: 0x00e5ff },
        { id: 'ice-shelf-south', x: 22, y: 4.4, z: 22, width: 10, depth: 10, height: 0.5, color: 0x00e5ff }
      ];
    } else if (level <= 8) {
      // Biome 4: Volcanic Caldera - Concentric Ring of Fire, Central Citadel & Basalt Stepping Stones
      return [
        { id: 'caldera-citadel', x: 0, y: 4.6, z: 0, width: 15, depth: 15, height: 0.8, color: 0xff3300 },
        { id: 'rampart-north', x: 0, y: 3.8, z: -26, width: 28, depth: 7, height: 0.6, color: 0xff6600 },
        { id: 'rampart-south', x: 0, y: 3.8, z: 26, width: 28, depth: 7, height: 0.6, color: 0xff6600 },
        { id: 'stepping-stone-west', x: -16, y: 2.2, z: 0, width: 6.5, depth: 6.5, height: 0.6, color: 0xff4500 },
        { id: 'stepping-stone-east', x: 16, y: 2.2, z: 0, width: 6.5, depth: 6.5, height: 0.6, color: 0xff4500 }
      ];
    } else if (level === 9) {
      // Biome 5A: Cosmic Void (Level 9) - Shattered Orbital Docks & Cyber Light Spans
      return [
        { id: 'orbit-dock-alpha', x: -20, y: 4.0, z: -20, width: 11, depth: 11, height: 0.6, color: 0xff00aa },
        { id: 'orbit-dock-beta', x: 20, y: 5.5, z: -20, width: 11, depth: 11, height: 0.6, color: 0x00f0ff },
        { id: 'orbit-dock-gamma', x: 20, y: 7.0, z: 20, width: 11, depth: 11, height: 0.6, color: 0xbd00ff },
        { id: 'orbit-dock-delta', x: -20, y: 8.5, z: 20, width: 11, depth: 11, height: 0.6, color: 0x00ffcc },
        { id: 'bridge-void', x: 0, y: 6.2, z: 0, width: 7, depth: 20, height: 0.5, color: 0xff00aa },
        { id: 'apex-station', x: 0, y: 10.5, z: -8, width: 13, depth: 13, height: 0.8, color: 0xffd700 }
      ];
    } else {
      // Biome 5B: The Titan Gauntlet (Level 10) - Colosseum Throne & 4 Elevated Shield Pylon Towers
      return [
        { id: 'titan-colosseum', x: 0, y: 3.5, z: 0, width: 18, depth: 18, height: 0.8, color: 0xff0055 },
        { id: 'pylon-tower-nw', x: -24, y: 5.4, z: -24, width: 9, depth: 9, height: 0.8, color: 0x00ffff },
        { id: 'pylon-tower-ne', x: 24, y: 5.4, z: -24, width: 9, depth: 9, height: 0.8, color: 0x00ffff },
        { id: 'pylon-tower-sw', x: -24, y: 5.4, z: 24, width: 9, depth: 9, height: 0.8, color: 0x00ffff },
        { id: 'pylon-tower-se', x: 24, y: 5.4, z: 24, width: 9, depth: 9, height: 0.8, color: 0x00ffff }
      ];
    }
  }

  // Custom Jump Pad Coordinates tailored to each biome's platform topology
  static getJumpPadCoordinates(level) {
    if (level <= 2) {
      // Forest: 3 Bouncy Mushroom Launchers
      return [
        { x: -22, z: -12 },
        { x: 22, z: 12 },
        { x: 0, z: -12 }
      ];
    } else if (level <= 4) {
      // Cavern: 4 Subterranean Geode Launchers
      return [
        { x: -20, z: -16 },
        { x: 20, z: 16 },
        { x: 0, z: 0 },
        { x: 0, z: -8 }
      ];
    } else if (level <= 6) {
      // Tundra: 4 Blizzard Geysers launching inward toward the Glacier Peak
      return [
        { x: -26, z: 0 },
        { x: 26, z: 0 },
        { x: 0, z: -26 },
        { x: 0, z: 26 }
      ];
    } else if (level <= 8) {
      // Volcano: 4 Basalt Launch Trampolines
      return [
        { x: -26, z: -16 },
        { x: 26, z: 16 },
        { x: -26, z: 16 },
        { x: 26, z: -16 }
      ];
    } else {
      // Void / Level 10 Colosseum: 4 Super-Charged Quantum Jump Pads
      return [
        { x: -14, z: -14 },
        { x: 14, z: -14 },
        { x: -14, z: 14 },
        { x: 14, z: 14 }
      ];
    }
  }

  // Custom Molten Lava / Cosmic Void Hazard Zones
  static getHazardZones(level) {
    if (level >= 7 && level <= 8) {
      // Volcano: Sinuous lava moat surrounding the central caldera fortress
      return [
        { x: -11, z: -11, r: 4.5 },
        { x: 11, z: 11, r: 4.5 },
        { x: -11, z: 11, r: 4.5 },
        { x: 11, z: -11, r: 4.5 }
      ];
    } else if (level >= 9) {
      // Cosmic Void & Level 10: Cosmic void rifts
      return [
        { x: -16, z: 0, r: 3.5 },
        { x: 16, z: 0, r: 3.5 },
        { x: 0, z: -16, r: 3.5 },
        { x: 0, z: 16, r: 3.5 }
      ];
    }
    return [];
  }

  static buildBiome(level, scene, isGirlsTheme = false) {
    const biome = this.getBiomeData(level, isGirlsTheme);
    const decorations = [];
    const jumpPads = [];
    const hazardZones = [];

    // 1. Celestial Starfield Dome (Enlarged for 76x76 Arena)
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 95 + Math.random() * 30;

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 6; // keep above ground
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Star tinting
      const tint = Math.random();
      if (isGirlsTheme) {
        if (tint < 0.35) {
          starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.6; starColors[i * 3 + 2] = 0.78; // Sakura pink
        } else if (tint < 0.6) {
          starColors[i * 3] = 0.89; starColors[i * 3 + 1] = 0.76; starColors[i * 3 + 2] = 0.98; // Lilac lavender
        } else if (tint < 0.8) {
          starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.6; // Starlight gold
        } else {
          starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0; // Diamond white
        }
      } else {
        if (tint < 0.3) {
          starColors[i * 3] = 0.5; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0; // Cyan
        } else if (tint < 0.5) {
          starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 0.4; // Amber
        } else {
          starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0; // White
        }
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: isGirlsTheme ? 0.75 : 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    decorations.push(starField);

    // 2. Ambient Weather Particle System (Scaled to 76x76 arena)
    const wCfg = biome.weather;
    const weatherGeo = new THREE.BufferGeometry();
    const weatherPos = new Float32Array(wCfg.count * 3);
    const weatherVel = [];

    for (let i = 0; i < wCfg.count; i++) {
      weatherPos[i * 3] = (Math.random() - 0.5) * 76;
      weatherPos[i * 3 + 1] = Math.random() * 22;
      weatherPos[i * 3 + 2] = (Math.random() - 0.5) * 76;
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
      opacity: isGirlsTheme ? 0.85 : 0.65,
      blending: THREE.AdditiveBlending
    });
    const weatherField = new THREE.Points(weatherGeo, weatherMat);
    scene.add(weatherField);
    decorations.push(weatherField);

    // 3. Glowing Perimeter Edge Rails (Top of Boundary Walls at +/- 38m)
    [[0, 5.05, -38], [0, 5.05, 38], [-38, 5.05, 0], [38, 5.05, 0]].forEach((pos, i) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(76, 0.15, 0.2),
        new THREE.MeshBasicMaterial({
          color: biome.neonColor,
          transparent: true,
          opacity: 0.9
        })
      );
      rail.position.set(...pos);
      if (i > 1) rail.rotation.y = Math.PI / 2;
      scene.add(rail);
      decorations.push(rail);
    });

    // 4. Biome Jump Pads (Custom layouts per level)
    const padCoords = this.getJumpPadCoordinates(level);
    padCoords.forEach(pos => {
      const padGroup = new THREE.Group();

      // Outer rim with metallic finish (Dark bronze-amethyst in Girls Theme)
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.8, 0.25, 32),
        new THREE.MeshStandardMaterial({
          color: isGirlsTheme ? 0x362838 : 0x1e2430,
          metalness: 0.8,
          roughness: 0.25
        })
      );
      rim.position.y = 0.125;
      rim.castShadow = true;
      rim.receiveShadow = true;
      padGroup.add(rim);

      // Glowing launch pad surface (High-contrast luminous mint-cyan in Girls Theme)
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 32),
        new THREE.MeshStandardMaterial({
          color: isGirlsTheme ? 0x2dd4bf : biome.jumpPadColor,
          emissive: isGirlsTheme ? 0x14b8a6 : biome.jumpPadColor,
          emissiveIntensity: 0.8,
          metalness: 0.3,
          roughness: 0.15
        })
      );
      pad.position.y = 0.16;
      padGroup.add(pad);

      // Launch indicator: Floating glowing golden 3D Star in Girls Theme, Arrow in standard
      let arrow;
      if (isGirlsTheme) {
        arrow = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.42),
          new THREE.MeshStandardMaterial({
            color: 0xffe066,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.15
          })
        );
        arrow.position.y = 0.6;
      } else {
        arrow = new THREE.Mesh(
          new THREE.ConeGeometry(0.5, 0.8, 6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        arrow.position.y = 0.55;
      }
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

    // 5. Biome Props & Environments (Expanded layout) with Physical Solid Colliders
    const solidColliders = [];
    if (isGirlsTheme) {
      // Girls Theme: Sakura Dreamland Props
      // 1. Cherry Blossom Sakura Trees with organic cherry-wood bark & blush canopies
      for (let i = 0; i < 14; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.55, 2.8, 8),
          new THREE.MeshStandardMaterial({ color: 0x42271d, roughness: 0.85 })
        );
        trunk.position.y = 1.4;
        trunk.castShadow = true;
        tree.add(trunk);

        // Layered Cloud Clusters of Sakura Blossom with fresh green leaf accents
        const pinkColors = [0xffb7c5, 0xff9ebb, 0xfce4ec];
        const cloudConfigs = [
          { y: 2.8, r: 1.85, c: pinkColors[0], x: 0, z: 0 },
          { y: 4.1, r: 1.4, c: pinkColors[1], x: 0, z: 0 },
          { y: 2.6, r: 1.1, c: pinkColors[2], x: 0.6, z: 0.4 },
          { y: 2.5, r: 1.05, c: 0x7da876, x: -0.6, z: -0.3 } // Organic spring leaf accent
        ];
        cloudConfigs.forEach(cfg => {
          const foliage = new THREE.Mesh(
            new THREE.DodecahedronGeometry(cfg.r),
            new THREE.MeshStandardMaterial({
              color: cfg.c,
              roughness: 0.65
            })
          );
          foliage.position.set(cfg.x, cfg.y, cfg.z);
          foliage.castShadow = true;
          tree.add(foliage);
        });

        const angle = (i / 14) * Math.PI * 2 + 0.2;
        const r = 26 + (i % 3) * 3.5;
        const tx = Math.cos(angle) * r;
        const tz = Math.sin(angle) * r;
        tree.position.set(tx, 0, tz);
        scene.add(tree);
        decorations.push(tree);
        solidColliders.push({ type: 'tree', x: tx, z: tz, radius: 1.25, height: 6.8 });
      }

      // 2. Translucent Rose Quartz Crystal Geodes & Refined Gem Formations
      for (let i = 0; i < 8; i++) {
        const rockRadius = 1.4 + (i % 3) * 0.25;
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(rockRadius),
          new THREE.MeshPhysicalMaterial({
            color: 0xf3d2e6,
            emissive: 0xb388eb,
            emissiveIntensity: 0.25,
            roughness: 0.18,
            metalness: 0.12,
            transmission: 0.65,
            transparent: true,
            opacity: 0.90,
            clearcoat: 1.0
          })
        );
        const angle = (i / 8) * Math.PI * 2 + 0.6;
        const rx = Math.cos(angle) * 18;
        const rz = Math.sin(angle) * 18;
        rock.position.set(rx, 0.8, rz);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
        decorations.push(rock);
        solidColliders.push({ type: 'rock', x: rx, z: rz, radius: rockRadius + 0.25, height: 2.4 });
      }

      // 3. Magical Glowing Fairy Toadstools (Ivory Stalks & Coral Caps)
      for (let i = 0; i < 6; i++) {
        const shroom = new THREE.Group();
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.42, 1.8, 12),
          new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.6 })
        );
        stem.position.y = 0.9;
        shroom.add(stem);

        const cap = new THREE.Mesh(
          new THREE.ConeGeometry(1.35, 1.1, 16),
          new THREE.MeshStandardMaterial({
            color: 0xe63973,
            emissive: 0x991b42,
            emissiveIntensity: 0.35,
            roughness: 0.35
          })
        );
        cap.position.y = 1.8;
        shroom.add(cap);

        // 4 White Polka Dots on cap
        [
          [0.6, 1.6, 0.4],
          [-0.6, 1.6, -0.4],
          [0.3, 1.85, -0.5],
          [-0.4, 1.85, 0.5]
        ].forEach(dotPos => {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          dot.position.set(...dotPos);
          shroom.add(dot);
        });

        const angle = (i / 6) * Math.PI * 2 + 1.1;
        const mx = Math.cos(angle) * 22;
        const mz = Math.sin(angle) * 22;
        shroom.position.set(mx, 0, mz);
        shroom.castShadow = true;
        scene.add(shroom);
        decorations.push(shroom);
        solidColliders.push({ type: 'mushroom', x: mx, z: mz, radius: 1.1, height: 2.6 });
      }
    } else if (biome.id === 'forest') {
      // Low-poly pine trees with shadows
      for (let i = 0; i < 12; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.5, 2.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.8 })
        );
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        tree.add(trunk);

        for (let j = 0; j < 3; j++) {
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(2.2 - j * 0.45, 2.4, 7),
            new THREE.MeshStandardMaterial({
              color: 0x1b4332 + j * 0x051505,
              roughness: 0.7
            })
          );
          foliage.position.y = 2.4 + j * 1.4;
          foliage.castShadow = true;
          tree.add(foliage);
        }

        const angle = (i / 12) * Math.PI * 2 + 0.2;
        const r = 26 + (i % 3) * 3.5;
        const tx = Math.cos(angle) * r;
        const tz = Math.sin(angle) * r;
        tree.position.set(tx, 0, tz);
        scene.add(tree);
        decorations.push(tree);
        solidColliders.push({ type: 'tree', x: tx, z: tz, radius: 1.15, height: 6.5 });
      }

      // Mossy boulders
      for (let i = 0; i < 8; i++) {
        const rockRadius = 1.4 + (i % 3) * 0.25;
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(rockRadius),
          new THREE.MeshStandardMaterial({ color: 0x3d4349, roughness: 0.85 })
        );
        const angle = (i / 8) * Math.PI * 2 + 0.6;
        const rx = Math.cos(angle) * 18;
        const rz = Math.sin(angle) * 18;
        rock.position.set(rx, 0.7, rz);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
        decorations.push(rock);
        solidColliders.push({ type: 'rock', x: rx, z: rz, radius: rockRadius + 0.25, height: 2.2 });
      }
    } else if (biome.id === 'cavern') {
      // Luminescent crystalline stalagmites
      const colors = [0x00f0ff, 0xff00ea, 0x7b2cbf];
      for (let i = 0; i < 14; i++) {
        const color = colors[i % colors.length];
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.9, 4.2 + (i % 3), 6),
          new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.5
          })
        );
        const angle = (i / 14) * Math.PI * 2 + 0.2;
        const r = 25 + (i % 3) * 3;
        const sx = Math.cos(angle) * r;
        const sz = Math.sin(angle) * r;
        spike.position.set(sx, 2.1, sz);
        spike.castShadow = true;
        scene.add(spike);
        decorations.push(spike);
        solidColliders.push({ type: 'stalagmite', x: sx, z: sz, radius: 1.1, height: 4.5 });
      }
    } else if (biome.id === 'tundra') {
      // Physical glass-like ice pillars
      for (let i = 0; i < 12; i++) {
        const ice = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.8 + (i % 2) * 0.5),
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
        const angle = (i / 12) * Math.PI * 2 + 0.3;
        const r = 27 + (i % 3) * 3;
        const ix = Math.cos(angle) * r;
        const iz = Math.sin(angle) * r;
        ice.position.set(ix, 1.8, iz);
        ice.rotation.set(Math.random(), Math.random(), 0);
        ice.castShadow = true;
        scene.add(ice);
        decorations.push(ice);
        solidColliders.push({ type: 'ice_pillar', x: ix, z: iz, radius: 1.4, height: 3.8 });
      }
    } else if (biome.hasLava) {
      // Obsidian / basalt pillars
      for (let i = 0; i < 10; i++) {
        const col = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 5.0 + (i % 2) * 2, 2.0),
          new THREE.MeshStandardMaterial({ color: 0x141010, roughness: 0.7, metalness: 0.3 })
        );
        const angle = (i / 10) * Math.PI * 2 + 0.1;
        const cx = Math.cos(angle) * 29;
        const cz = Math.sin(angle) * 29;
        col.position.set(cx, 2.5, cz);
        col.castShadow = true;
        col.receiveShadow = true;
        scene.add(col);
        decorations.push(col);
        solidColliders.push({ type: 'column', x: cx, z: cz, radius: 1.45, height: 5.5 });
      }
    }

    // 6. Molten Lava Hazard Pools / Void Rifts
    const rawHazards = this.getHazardZones(level);
    rawHazards.forEach(s => {
      const poolGroup = new THREE.Group();

      // Basalt border rim (Dark obsidian-amethyst in Girls Theme)
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(s.r + 0.15, 0.25, 8, 28),
        new THREE.MeshStandardMaterial({ color: isGirlsTheme ? 0x261a2e : 0x221815, roughness: 0.7 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.04;
      poolGroup.add(rim);

      // Pulsing molten magma / void core / cursed abyss in Girls Theme
      const magmaColor = isGirlsTheme ? 0x42104f : (biome.id === 'void' ? 0xbd00ff : 0xff3700);
      const magmaEmissive = isGirlsTheme ? 0x260530 : (biome.id === 'void' ? 0x8800cc : 0xff2200);
      const magma = new THREE.Mesh(
        new THREE.CylinderGeometry(s.r, s.r, 0.06, 28),
        new THREE.MeshStandardMaterial({
          color: magmaColor,
          emissive: magmaEmissive,
          emissiveIntensity: 0.95,
          roughness: 0.2
        })
      );
      magma.position.y = 0.03;
      poolGroup.add(magma);

      if (isGirlsTheme) {
        // Mystical violet bubbles on the surface
        [-1.2, 0, 1.2].forEach((offset, idx) => {
          const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xba68c8, transparent: true, opacity: 0.6 })
          );
          bubble.position.set(offset * 0.8, 0.1, (idx % 2 === 0 ? 0.6 : -0.6));
          poolGroup.add(bubble);
        });
      }

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

    // 7. Distinct Vertical Sky Islands per Biome Archetype
    const platforms = [];
    const platformConfigs = this.getPlatformConfigs(level, biome);

    platformConfigs.forEach(p => {
      const pGroup = new THREE.Group();

      // Platform Deck (Polished Porcelain Alabaster in Girls Theme for maximum readability)
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(p.width, p.height, p.depth),
        new THREE.MeshStandardMaterial({
          color: isGirlsTheme ? 0xeae3f0 : 0x141b29,
          roughness: isGirlsTheme ? 0.35 : 0.4,
          metalness: isGirlsTheme ? 0.15 : 0.82
        })
      );
      deck.castShadow = true;
      deck.receiveShadow = true;
      pGroup.add(deck);

      // Neon Underglow Edge Trim
      const edgeTrim = new THREE.Mesh(
        new THREE.BoxGeometry(p.width + 0.15, 0.1, p.depth + 0.15),
        new THREE.MeshBasicMaterial({ color: isGirlsTheme ? 0xff6699 : p.color })
      );
      edgeTrim.position.y = -p.height / 2;
      pGroup.add(edgeTrim);

      // Anti-Gravity Levitating Repulsor Crystal
      const repulsor = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.95),
        new THREE.MeshStandardMaterial({
          color: isGirlsTheme ? 0xff70a6 : p.color,
          emissive: isGirlsTheme ? 0xff3377 : p.color,
          emissiveIntensity: 0.8,
          metalness: 0.4,
          roughness: 0.1
        })
      );
      repulsor.position.y = -p.height / 2 - 0.7;
      pGroup.add(repulsor);

      // Soft under-platform repulsor light illuminating the ground beneath the island
      const underLight = new THREE.PointLight(isGirlsTheme ? 0xff70a6 : p.color, 1.4, 18, 1.8);
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
          new THREE.MeshBasicMaterial({ color: isGirlsTheme ? 0xffd700 : p.color })
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

    return { biome, decorations, solidColliders, jumpPads, hazardZones, platforms, starField, weatherField, weatherPos, weatherVel, wCfg };
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

    // Animate weather particles across expanded 76x76 arena
    if (env.weatherField && env.weatherPos && env.weatherVel) {
      const pos = env.weatherPos;
      const vel = env.weatherVel;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += vel[i].x * dt * 2;
        pos[i * 3 + 1] += vel[i].y * dt;
        pos[i * 3 + 2] += vel[i].z * dt * 2;

        if (env.wCfg.type === 'sakura') {
          // Graceful lateral petal fluttering sway
          pos[i * 3] += Math.sin(pos[i * 3 + 1] * 0.6 + i) * dt * 1.8;
          pos[i * 3 + 2] += Math.cos(pos[i * 3 + 1] * 0.6 + i) * dt * 1.8;
        }

        // Wrap around boundaries (76x76)
        if (env.wCfg.type === 'rise') {
          if (pos[i * 3 + 1] > 22) {
            pos[i * 3 + 1] = 0.1;
            pos[i * 3] = (Math.random() - 0.5) * 72;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 72;
          }
        } else {
          if (pos[i * 3 + 1] < 0.1) {
            pos[i * 3 + 1] = 22;
            pos[i * 3] = (Math.random() - 0.5) * 72;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 72;
          }
        }
      }
      env.weatherField.geometry.attributes.position.needsUpdate = true;
    }
  }
}
