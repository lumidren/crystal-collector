import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BiomeGenerator } from '../src/world/biomeGenerator.js';

test('physicsMath - resolves currentFloorY accurately across all multi-tier sky platforms', () => {
  const scene = new THREE.Scene();
  const { platforms } = BiomeGenerator.buildBiome(1, scene);

  // Helper matching App.jsx platform detection logic
  const resolveFloorY = (px, py, pz) => {
    let currentFloorY = 0;
    for (const p of platforms) {
      if (px >= p.minX && px <= p.maxX && pz >= p.minZ && pz <= p.maxZ) {
        if (py >= p.topY - 0.6) {
          if (p.topY > currentFloorY) {
            currentFloorY = p.topY;
          }
        }
      }
    }
    return currentFloorY;
  };

  // 1. Center of arena on ground
  assert.equal(resolveFloorY(0, 0, 0), 0);

  // 2. On West Sky Deck (topY = 4.1)
  assert.equal(resolveFloorY(-13, 4.1, -9), 4.1);

  // 3. On East Sky Deck (topY = 4.9)
  assert.equal(resolveFloorY(13, 4.9, 9), 4.9);

  // 4. On Central Mid Bridge (topY = 6.0)
  assert.equal(resolveFloorY(0, 6.0, -5), 6.0);

  // 5. On High Apex Peak (topY = 7.9)
  assert.equal(resolveFloorY(0, 7.9, 12), 7.9);

  // 6. Walking directly under West Sky Deck at ground level (py = 0)
  // Player is under the platform, so floor is ground 0
  assert.equal(resolveFloorY(-13, 0, -9), 0);
});

test('physicsMath - edge walking initiates falling when leaving platform ledge', () => {
  const scene = new THREE.Scene();
  const { platforms } = BiomeGenerator.buildBiome(1, scene);
  const westDeck = platforms.find(p => p.id === 'island-west');

  // Player stands near the edge of West Sky Deck
  let px = westDeck.maxX - 0.2;
  let py = westDeck.topY;
  let pz = westDeck.z;
  let isGrounded = true;
  let jumpVelocity = 0;

  // Step beyond platform boundary into open air
  px = westDeck.maxX + 0.5;

  let currentFloorY = 0;
  for (const p of platforms) {
    if (px >= p.minX && px <= p.maxX && pz >= p.minZ && pz <= p.maxZ) {
      if (py >= p.topY - 0.6 && p.topY > currentFloorY) currentFloorY = p.topY;
    }
  }

  // Check fall trigger logic from App.jsx
  if (isGrounded && py > currentFloorY + 0.15) {
    isGrounded = false;
    jumpVelocity = 0;
  }

  assert.equal(isGrounded, false, 'Player must lose grounded state when stepping off ledge');
  assert.equal(currentFloorY, 0, 'Floor under player must revert to ground');
});

test('physicsMath - vertical distance checks prevent ground players from looting sky crystals', () => {
  const crystalTopY = 4.1 + 1.2; // 5.3m altitude on West Sky Deck
  const crystalPos = { x: -13, y: crystalTopY, z: -9 };

  // Ground player at Y = 0 directly beneath the platform
  const groundPlayer = { x: -13, y: 0, z: -9 };
  const distGroundH = Math.hypot(crystalPos.x - groundPlayer.x, crystalPos.z - groundPlayer.z);
  const distGroundY = Math.abs(crystalPos.y - (groundPlayer.y + 1.2));
  const groundCanCollect = distGroundH < 2.0 && distGroundY < 2.5;

  assert.equal(distGroundH, 0);
  assert.equal(distGroundY, 4.1);
  assert.equal(groundCanCollect, false, 'Ground player must NOT collect crystal high in the sky');

  // Elevated player on the platform at Y = 4.1
  const platformPlayer = { x: -13, y: 4.1, z: -9 };
  const distPlatH = Math.hypot(crystalPos.x - platformPlayer.x, crystalPos.z - platformPlayer.z);
  const distPlatY = Math.abs(crystalPos.y - (platformPlayer.y + 1.2));
  const platCanCollect = distPlatH < 2.0 && distPlatY < 2.5;

  assert.equal(distPlatH, 0);
  assert.equal(distPlatY, 0);
  assert.equal(platCanCollect, true, 'Elevated player on platform must successfully collect crystal');
});

test('physicsMath - jump pad boost velocity (V=28) is sufficient to reach Apex Island (7.9m)', () => {
  const jumpVelocity = 28;
  const gravity = 35;
  // Physics formula: max height = v^2 / (2 * g)
  const maxLaunchHeight = (jumpVelocity * jumpVelocity) / (2 * gravity);

  assert.ok(maxLaunchHeight >= 11.0, `Launch height (${maxLaunchHeight}m) must easily exceed 7.9m`);
});

test('physicsMath - elevated players are immune to ground lava damage', () => {
  const lavaPool = { x: 0, z: 0, radius: 2.7 };
  const damageCheck = (px, py, pz, isGrounded) => {
    const d = Math.hypot(px - lavaPool.x, pz - lavaPool.z);
    // App.jsx: if (hazardZones.length > 0 && isGrounded && player.position.y < 1.0)
    return d < lavaPool.radius && isGrounded && py < 1.0;
  };

  // Player on ground in lava pool
  assert.equal(damageCheck(0, 0, 0, true), true, 'Ground player in pool takes damage');

  // Player on Mid Bridge at Y = 6.0 directly above the pool
  assert.equal(damageCheck(0, 6.0, 0, true), false, 'Elevated player on bridge above pool takes NO damage');
});
