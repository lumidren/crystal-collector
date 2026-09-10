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

test('biomeGenerator - buildBiome instantiates 4 multi-tier sky platforms with correct elevations', () => {
  const scene = new THREE.Scene();
  const env = BiomeGenerator.buildBiome(1, scene);

  assert.ok(Array.isArray(env.platforms));
  assert.equal(env.platforms.length, 4);

  const [westDeck, eastDeck, midBridge, apexPeak] = env.platforms;

  // West Sky Deck (y = 3.8, height = 0.6 => topY = 4.1)
  assert.equal(westDeck.id, 'island-west');
  assert.equal(westDeck.y, 3.8);
  assert.equal(westDeck.topY, 4.1);
  assert.ok(westDeck.minX < westDeck.maxX);
  assert.ok(westDeck.minZ < westDeck.maxZ);

  // East Sky Deck (y = 4.6, height = 0.6 => topY = 4.9)
  assert.equal(eastDeck.id, 'island-east');
  assert.equal(eastDeck.y, 4.6);
  assert.equal(eastDeck.topY, 4.9);

  // Mid Bridge (y = 5.8, height = 0.4 => topY = 6.0)
  assert.equal(midBridge.id, 'bridge-mid');
  assert.equal(midBridge.y, 5.8);
  assert.equal(midBridge.topY, 6.0);

  // High Apex Peak (y = 7.5, height = 0.8 => topY = 7.9)
  assert.equal(apexPeak.id, 'island-apex');
  assert.equal(apexPeak.y, 7.5);
  assert.equal(apexPeak.topY, 7.9);
});

test('biomeGenerator - buildBiome correctly sets jump pads and hazard zones', () => {
  const scene1 = new THREE.Scene();
  const env1 = BiomeGenerator.buildBiome(1, scene1);
  // Levels < 5 have 2 jump pads, 0 lava pools
  assert.equal(env1.jumpPads.length, 2);
  assert.equal(env1.hazardZones.length, 0);

  const scene8 = new THREE.Scene();
  const env8 = BiomeGenerator.buildBiome(8, scene8);
  // Level 8 has 4 jump pads and 3 lava hazard zones
  assert.equal(env8.jumpPads.length, 4);
  assert.equal(env8.hazardZones.length, 3);
  env8.hazardZones.forEach(h => {
    assert.equal(h.radius, 2.7);
    assert.equal(typeof h.x, 'number');
    assert.equal(typeof h.z, 'number');
  });
});
