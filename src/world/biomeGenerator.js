import * as THREE from 'three';

// Procedural Biome, Scenery, Platforming Jump Pads & Hazard Zones Generator
export class BiomeGenerator {
  static getBiomeData(level) {
    if (level <= 2) {
      return {
        id: 'forest',
        name: 'Forest Valley',
        skyColor: 0x14213d,
        groundColor: 0x2d6a4f,
        wallColor: 0x8b5a2b,
        ambientColor: 0x404040,
        fog: null,
        friction: 1.0,
        jumpPadColor: 0xffd700,
        hasLava: false
      };
    } else if (level <= 4) {
      return {
        id: 'cavern',
        name: 'Crystal Cavern',
        skyColor: 0x0f0c29,
        groundColor: 0x24243e,
        wallColor: 0x302b63,
        ambientColor: 0x302050,
        fog: { color: 0x181030, near: 15, far: 45 },
        friction: 1.0,
        jumpPadColor: 0x00ffff,
        hasLava: false
      };
    } else if (level <= 6) {
      return {
        id: 'tundra',
        name: 'Frozen Tundra',
        skyColor: 0x0b132b,
        groundColor: 0xa8dadc,
        wallColor: 0x457b9d,
        ambientColor: 0x506080,
        fog: { color: 0x1c2541, near: 20, far: 50 },
        friction: 0.94, // slippery ice!
        jumpPadColor: 0x00e5ff,
        hasLava: false
      };
    } else if (level <= 8) {
      return {
        id: 'volcano',
        name: 'Volcanic Caldera',
        skyColor: 0x1f0000,
        groundColor: 0x2b1718,
        wallColor: 0x4a1215,
        ambientColor: 0x602020,
        fog: { color: 0x330808, near: 12, far: 40 },
        friction: 1.0,
        jumpPadColor: 0xff4500,
        hasLava: true
      };
    } else {
      return {
        id: 'void',
        name: level === 10 ? 'THE FINAL GAUNTLET' : 'Cosmic Void',
        skyColor: 0x050014,
        groundColor: 0x10052b,
        wallColor: 0x6b11ff,
        ambientColor: 0x402060,
        fog: { color: 0x08021a, near: 15, far: 45 },
        friction: 1.0,
        jumpPadColor: 0xbd00ff,
        hasLava: true
      };
    }
  }

  static buildBiome(level, scene) {
    const biome = this.getBiomeData(level);
    const decorations = [];
    const jumpPads = [];
    const hazardZones = [];

    // Jump pads (golden/cyan launch trampolines)
    const padCoords = [
      { x: -14, z: -14 },
      { x: 14, z: 14 },
      { x: -14, z: 14 },
      { x: 14, z: -14 }
    ].slice(0, level >= 5 ? 4 : 2);

    padCoords.forEach(pos => {
      const padGroup = new THREE.Group();

      // Outer rim
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.8, 0.25, 24),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
      );
      rim.position.y = 0.125;
      padGroup.add(rim);

      // Glowing launch surface
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 24),
        new THREE.MeshPhongMaterial({
          color: biome.jumpPadColor,
          emissive: biome.jumpPadColor,
          emissiveIntensity: 0.6
        })
      );
      pad.position.y = 0.16;
      padGroup.add(pad);

      // Launch Arrow Indicator
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 0.8, 4),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      arrow.position.y = 0.5;
      arrow.rotation.x = 0;
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

    // Biome-specific props
    if (biome.id === 'forest') {
      // Low-poly Pine Trees
      for (let i = 0; i < 8; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.4, 2, 8),
          new THREE.MeshPhongMaterial({ color: 0x5a3d28 })
        );
        trunk.position.y = 1;
        tree.add(trunk);

        for (let j = 0; j < 3; j++) {
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(1.8 - j * 0.4, 2, 7),
            new THREE.MeshPhongMaterial({ color: 0x1b4332 + j * 0x051505 })
          );
          foliage.position.y = 2 + j * 1.2;
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
          new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.6),
          new THREE.MeshPhongMaterial({ color: 0x495057 })
        );
        const angle = (i / 6) * Math.PI * 2 + 0.8;
        rock.position.set(Math.cos(angle) * 12, 0.6, Math.sin(angle) * 12);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        scene.add(rock);
        decorations.push(rock);
      }
    } else if (biome.id === 'cavern') {
      // Luminescent Stalagmites
      const colors = [0x00ffff, 0xff00ff, 0x7b2cbf];
      for (let i = 0; i < 10; i++) {
        const color = colors[i % colors.length];
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.8, 3.5 + (i % 3), 6),
          new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.5,
            shininess: 80
          })
        );
        const angle = (i / 10) * Math.PI * 2 + 0.2;
        const r = 16 + (i % 3) * 2;
        spike.position.set(Math.cos(angle) * r, 1.8, Math.sin(angle) * r);
        scene.add(spike);
        decorations.push(spike);
      }
    } else if (biome.id === 'tundra') {
      // Ice Crystal Pillars
      for (let i = 0; i < 10; i++) {
        const ice = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.5 + (i % 2) * 0.5),
          new THREE.MeshPhongMaterial({
            color: 0xe0fbfc,
            emissive: 0x00b4d8,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.85
          })
        );
        const angle = (i / 10) * Math.PI * 2 + 0.4;
        const r = 17 + (i % 2) * 3;
        ice.position.set(Math.cos(angle) * r, 1.5, Math.sin(angle) * r);
        ice.rotation.set(Math.random(), Math.random(), 0);
        scene.add(ice);
        decorations.push(ice);
      }
    } else if (biome.hasLava) {
      // Basalt rock pillars
      for (let i = 0; i < 8; i++) {
        const col = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 4 + (i % 2) * 2, 1.8),
          new THREE.MeshPhongMaterial({ color: 0x1f1816 })
        );
        const angle = (i / 8) * Math.PI * 2 + 0.1;
        col.position.set(Math.cos(angle) * 19, 2, Math.sin(angle) * 19);
        scene.add(col);
        decorations.push(col);
      }

      // Molten Lava Hazard Pools (Stepping into them damages player!)
      const lavaSpots = [
        { x: -8, z: 0, r: 2.6 },
        { x: 8, z: 0, r: 2.6 },
        { x: 0, z: -8, r: 2.6 }
      ];

      lavaSpots.forEach(s => {
        const pool = new THREE.Mesh(
          new THREE.CylinderGeometry(s.r, s.r, 0.05, 20),
          new THREE.MeshPhongMaterial({
            color: 0xff3700,
            emissive: 0xff2200,
            emissiveIntensity: 0.8
          })
        );
        pool.position.set(s.x, 0.03, s.z);
        scene.add(pool);
        decorations.push(pool);

        hazardZones.push({
          mesh: pool,
          x: s.x,
          z: s.z,
          radius: s.r
        });
      });
    }

    return { biome, decorations, jumpPads, hazardZones };
  }
}
