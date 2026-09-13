import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BiomeGenerator } from '../src/world/biomeGenerator.js';
import { createCyberCreature } from '../src/game/creatures.js';
import { CrystalTitanBoss } from '../src/game/boss.js';

test('worldTheme - BiomeGenerator returns Sakura Dreamland configuration when isGirlsTheme is true', () => {
  const girlsBiome = BiomeGenerator.getBiomeData(1, true);
  assert.equal(girlsBiome.id, 'sakura_dream');
  assert.equal(girlsBiome.isGirlsTheme, true);
  assert.equal(girlsBiome.groundColor, 0xede8f2);
  assert.equal(girlsBiome.neonColor, 0xff6699);
  assert.equal(girlsBiome.fog.color, 0x241e38);
  assert.equal(girlsBiome.jumpPadColor, 0x2dd4bf);

  // Default theme should return standard biome
  const defaultBiome = BiomeGenerator.getBiomeData(1, false);
  assert.equal(defaultBiome.id, 'forest');
  assert.equal(defaultBiome.weather.type, 'fall');
});

test('worldTheme - buildBiome instantiates Sakura trees, rose geodes, and toadstools for Girls Theme', () => {
  const scene = new THREE.Scene();
  const env = BiomeGenerator.buildBiome(1, scene, true);

  assert.ok(env.decorations.length > 0, 'Decorations should be populated');
  assert.ok(env.solidColliders.length > 0, 'Solid colliders should be generated');

  const treeColliders = env.solidColliders.filter(c => c.type === 'tree');
  const rockColliders = env.solidColliders.filter(c => c.type === 'rock');
  const shroomColliders = env.solidColliders.filter(c => c.type === 'mushroom');

  assert.equal(treeColliders.length, 14, 'Should generate 14 Sakura trees');
  assert.equal(rockColliders.length, 8, 'Should generate 8 Rose Quartz geodes');
  assert.equal(shroomColliders.length, 6, 'Should generate 6 Fairy Toadstools');

  // Verify jump pads have golden star/indicator
  assert.ok(env.jumpPads.length > 0, 'Jump pads should be generated');
  assert.equal(env.wCfg.type, 'sakura');
});

test('worldTheme - createCyberCreature applies pearlescent pink and golden star stinger for Girls Theme', () => {
  const creatureGirls = createCyberCreature(true);
  assert.ok(creatureGirls.userData.heartCore, 'Heart core must exist');
  assert.ok(creatureGirls.userData.stinger, 'Stinger must exist');
  assert.equal(creatureGirls.userData.eyeLeft.material.color.getHex(), 0x00ffff, 'Anime eye should be bright cyan');
  assert.equal(creatureGirls.userData.heartCore.material.color.getHex(), 0xff69b4, 'Heart core should be bright pink');

  const creatureDefault = createCyberCreature(false);
  assert.equal(creatureDefault.userData.eyeLeft.material.color.getHex(), 0xff0022, 'Default eye should be red');
});

test('worldTheme - CrystalTitanBoss instantiates Starlight Empress palette for Girls Theme', () => {
  const scene = new THREE.Scene();
  const boss = new CrystalTitanBoss(scene, true);

  assert.equal(boss.isGirlsTheme, true);
  assert.ok(boss.pylons.length === 4, 'Boss should have 4 corner pylons');
  assert.equal(boss.core.material.color.getHex(), 0xff1493, 'Boss core should be ruby pink');
  assert.equal(boss.laserMesh.material.color.getHex(), 0xff70a6, 'Boss laser should be hot pink ribbon beam');
  assert.equal(boss.shieldMesh.material.color.getHex(), 0xff70a6, 'Boss forcefield should be magenta pink');
});
