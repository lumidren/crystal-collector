import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BiomeGenerator } from '../src/world/biomeGenerator.js';

test('biomeGenerator - getBiomeData returns valid configurations for all 10 levels', () => {
  for (let lvl = 1; lvl <= 10; lvl++) {
    const biome = BiomeGenerator.getBiomeData(lvl);

    assert.ok(biome.id, `Level ${lvl} missing id`);
    assert.ok(biome.name, `Level ${lvl} missing name`);
    assert.equal(typeof biome.skyColor, 'number', `Level ${lvl} skyColor must be hex number`);
    assert.equal(typeof biome.groundColor, 'number', `Level ${lvl} groundColor must be hex number`);
    assert.equal(typeof biome.wallColor, 'number', `Level ${lvl} wallColor must be hex number`);
    assert.equal(typeof biome.neonColor, 'number', `Level ${lvl} neonColor must be hex number`);
    assert.equal(typeof biome.jumpPadColor, 'number', `Level ${lvl} jumpPadColor must be hex number`);
    assert.equal(typeof biome.friction, 'number', `Level ${lvl} friction must be number`);
    assert.ok(biome.weather, `Level ${lvl} missing weather`);
    assert.ok(biome.weather.count > 0, `Level ${lvl} weather count must be > 0`);
    assert.ok(biome.fog.far >= 80, `Level ${lvl} fog distance should cover 76x76 arena`);
  }

  // Level 1-2: Forest
  assert.equal(BiomeGenerator.getBiomeData(1).id, 'forest');
  assert.equal(BiomeGenerator.getBiomeData(1).hasLava, false);

  // Level 3-4: Cavern
  assert.equal(BiomeGenerator.getBiomeData(3).id, 'cavern');
  assert.equal(BiomeGenerator.getBiomeData(3).hasLava, false);

  // Level 5-6: Tundra with ice physics
  assert.equal(BiomeGenerator.getBiomeData(5).id, 'tundra');
  assert.equal(BiomeGenerator.getBiomeData(5).friction, 0.94);
  assert.equal(BiomeGenerator.getBiomeData(5).hasLava, false);

  // Level 7-8: Volcano
  assert.equal(BiomeGenerator.getBiomeData(7).id, 'volcano');
  assert.equal(BiomeGenerator.getBiomeData(7).hasLava, true);

  // Level 9-10: Cosmic Void & Titan Final Gauntlet
  assert.equal(BiomeGenerator.getBiomeData(9).id, 'void');
  assert.equal(BiomeGenerator.getBiomeData(10).id, 'void');
  assert.equal(BiomeGenerator.getBiomeData(10).name, 'THE FINAL GAUNTLET');
  assert.equal(BiomeGenerator.getBiomeData(10).hasLava, true);
});

test('biomeGenerator - generates distinct platform topologies across all 5 biomes', () => {
  // Biome 1: Forest Valley (Level 1)
  const sceneForest = new THREE.Scene();
  const envForest = BiomeGenerator.buildBiome(1, sceneForest);
  assert.equal(envForest.platforms.length, 4);
  const forestIds = envForest.platforms.map(p => p.id);
  assert.ok(forestIds.includes('treehouse-north'));
  assert.ok(forestIds.includes('treehouse-south'));
  assert.ok(forestIds.includes('bridge-canopy'));
  assert.ok(forestIds.includes('terrace-lookout'));

  // Biome 2: Crystal Cavern (Level 3)
  const sceneCavern = new THREE.Scene();
  const envCavern = BiomeGenerator.buildBiome(3, sceneCavern);
  assert.equal(envCavern.platforms.length, 4);
  const cavernIds = envCavern.platforms.map(p => p.id);
  assert.ok(cavernIds.includes('catwalk-west'));
  assert.ok(cavernIds.includes('crystal-arch'));
  assert.ok(cavernIds.includes('stalactite-perch'));

  // Biome 3: Frozen Tundra (Level 5 - 3-tier stepped glacier peak + ice shelves)
  const sceneTundra = new THREE.Scene();
  const envTundra = BiomeGenerator.buildBiome(5, sceneTundra);
  assert.equal(envTundra.platforms.length, 5);
  const tundraIds = envTundra.platforms.map(p => p.id);
  assert.ok(tundraIds.includes('glacier-base'));
  assert.ok(tundraIds.includes('glacier-mid'));
  assert.ok(tundraIds.includes('glacier-peak'));
  const glacierPeak = envTundra.platforms.find(p => p.id === 'glacier-peak');
  assert.equal(glacierPeak.topY, 9.0);

  // Biome 4: Volcanic Caldera (Level 7 - Central citadel, ramparts, basalt stones)
  const sceneVolcano = new THREE.Scene();
  const envVolcano = BiomeGenerator.buildBiome(7, sceneVolcano);
  assert.equal(envVolcano.platforms.length, 5);
  const volcanoIds = envVolcano.platforms.map(p => p.id);
  assert.ok(volcanoIds.includes('caldera-citadel'));
  assert.ok(volcanoIds.includes('rampart-north'));
  assert.ok(volcanoIds.includes('stepping-stone-west'));

  // Biome 5A: Cosmic Void (Level 9 - 6 orbital docks)
  const sceneVoid = new THREE.Scene();
  const envVoid = BiomeGenerator.buildBiome(9, sceneVoid);
  assert.equal(envVoid.platforms.length, 6);
  const voidIds = envVoid.platforms.map(p => p.id);
  assert.ok(voidIds.includes('orbit-dock-alpha'));
  assert.ok(voidIds.includes('apex-station'));

  // Biome 5B: The Titan Gauntlet (Level 10 - Colosseum & 4 Pylon Towers)
  const sceneBoss = new THREE.Scene();
  const envBoss = BiomeGenerator.buildBiome(10, sceneBoss);
  assert.equal(envBoss.platforms.length, 5);
  const bossIds = envBoss.platforms.map(p => p.id);
  assert.ok(bossIds.includes('titan-colosseum'));
  assert.ok(bossIds.includes('pylon-tower-nw'));
  assert.ok(bossIds.includes('pylon-tower-ne'));
});

test('biomeGenerator - buildBiome sets custom jump pads and hazard zones per biome', () => {
  // Forest has 3 jump pads, 0 lava pools
  const scene1 = new THREE.Scene();
  const env1 = BiomeGenerator.buildBiome(1, scene1);
  assert.equal(env1.jumpPads.length, 3);
  assert.equal(env1.hazardZones.length, 0);

  // Cavern has 4 geode jump pads
  const scene3 = new THREE.Scene();
  const env3 = BiomeGenerator.buildBiome(3, scene3);
  assert.equal(env3.jumpPads.length, 4);
  assert.equal(env3.hazardZones.length, 0);

  // Volcano has 4 jump pads and 4 lava moat hazard zones
  const scene8 = new THREE.Scene();
  const env8 = BiomeGenerator.buildBiome(8, scene8);
  assert.equal(env8.jumpPads.length, 4);
  assert.equal(env8.hazardZones.length, 4);
  env8.hazardZones.forEach(h => {
    assert.equal(h.radius, 4.5);
    assert.equal(typeof h.x, 'number');
    assert.equal(typeof h.z, 'number');
  });

  // Level 10 has 4 quantum jump pads and 4 void rifts
  const scene10 = new THREE.Scene();
  const env10 = BiomeGenerator.buildBiome(10, scene10);
  assert.equal(env10.jumpPads.length, 4);
  assert.equal(env10.hazardZones.length, 4);
});

test('biomeGenerator - generates solid colliders for trees, rocks, and biome pillars', () => {
  const scene1 = new THREE.Scene();
  const env1 = BiomeGenerator.buildBiome(1, scene1);
  assert.ok(Array.isArray(env1.solidColliders), 'solidColliders must be an array');
  assert.equal(env1.solidColliders.length, 20, 'Forest should have 12 trees + 8 rocks = 20 solid colliders');

  const trees = env1.solidColliders.filter(c => c.type === 'tree');
  const rocks = env1.solidColliders.filter(c => c.type === 'rock');
  assert.equal(trees.length, 12);
  assert.equal(rocks.length, 8);
  trees.forEach(t => {
    assert.ok(t.radius > 1.0);
    assert.ok(t.height > 5.0);
  });
  rocks.forEach(r => {
    assert.ok(r.radius > 1.0);
    assert.ok(r.height > 1.5);
  });
});
