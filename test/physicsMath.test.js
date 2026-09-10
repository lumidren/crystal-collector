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
  assert.equal(resolveFloorY(0, 0, 10), 0);

  // 2. On Treehouse North (topY = 3.7)
  assert.equal(resolveFloorY(-16, 3.7, -16), 3.7);

  // 3. On Treehouse South (topY = 5.5)
  assert.equal(resolveFloorY(16, 5.5, 16), 5.5);

  // 4. On Central Canopy Bridge (topY = 4.5)
  assert.equal(resolveFloorY(0, 4.5, 0), 4.5);

  // 5. On Apex Terrace Lookout (topY = 7.55)
  assert.equal(resolveFloorY(0, 7.55, -24), 7.55);

  // 6. Walking directly under Treehouse North at ground level (py = 0)
  // Player is under the platform, so floor is ground 0
  assert.equal(resolveFloorY(-16, 0, -16), 0);
});

test('physicsMath - edge walking initiates falling when leaving platform ledge', () => {
  const scene = new THREE.Scene();
  const { platforms } = BiomeGenerator.buildBiome(1, scene);
  const treehouse = platforms.find(p => p.id === 'treehouse-north');

  // Player stands near the edge of Treehouse North
  let px = treehouse.maxX - 0.2;
  let py = treehouse.topY;
  let pz = treehouse.z;
  let isGrounded = true;
  let jumpVelocity = 0;

  // Step beyond platform boundary into open air
  px = treehouse.maxX + 0.5;

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
  const crystalTopY = 3.7 + 1.2; // 4.9m altitude on Treehouse North
  const crystalPos = { x: -16, y: crystalTopY, z: -16 };

  // Ground player at Y = 0 directly beneath the platform
  const groundPlayer = { x: -16, y: 0, z: -16 };
  const distGroundH = Math.hypot(crystalPos.x - groundPlayer.x, crystalPos.z - groundPlayer.z);
  const distGroundY = Math.abs(crystalPos.y - (groundPlayer.y + 1.2));
  const groundCanCollect = distGroundH < 2.0 && distGroundY < 2.5;

  assert.equal(distGroundH, 0);
  assert.equal(distGroundY, 3.7);
  assert.equal(groundCanCollect, false, 'Ground player must NOT collect crystal high in the sky');

  // Elevated player on the platform at Y = 3.7
  const platformPlayer = { x: -16, y: 3.7, z: -16 };
  const distPlatH = Math.hypot(crystalPos.x - platformPlayer.x, crystalPos.z - platformPlayer.z);
  const distPlatY = Math.abs(crystalPos.y - (platformPlayer.y + 1.2));
  const platCanCollect = distPlatH < 2.0 && distPlatY < 2.5;

  assert.equal(distPlatH, 0);
  assert.equal(distPlatY, 0);
  assert.equal(platCanCollect, true, 'Elevated player on platform must successfully collect crystal');
});

test('physicsMath - jump pad boost velocity (V=28) is sufficient to reach Apex Island (7.55m - 9.0m)', () => {
  const jumpVelocity = 28;
  const gravity = 35;
  // Physics formula: max height = v^2 / (2 * g)
  const maxLaunchHeight = (jumpVelocity * jumpVelocity) / (2 * gravity);

  assert.ok(maxLaunchHeight >= 11.0, `Launch height (${maxLaunchHeight}m) must easily reach highest apex peaks`);
});

test('physicsMath - 76x76 arena clamping confines player safely within boundary walls', () => {
  const CLAMP_BOUND = 36;
  const clampPos = (x, z) => ({
    x: Math.max(-CLAMP_BOUND, Math.min(CLAMP_BOUND, x)),
    z: Math.max(-CLAMP_BOUND, Math.min(CLAMP_BOUND, z))
  });

  assert.deepEqual(clampPos(50, 0), { x: 36, z: 0 });
  assert.deepEqual(clampPos(-50, -20), { x: -36, z: -20 });
  assert.deepEqual(clampPos(20, 25), { x: 20, z: 25 });
});

test('physicsMath - elevated players are immune to ground lava damage', () => {
  const lavaPool = { x: 0, z: 0, radius: 4.5 };
  const damageCheck = (px, py, pz, isGrounded) => {
    const d = Math.hypot(px - lavaPool.x, pz - lavaPool.z);
    return d < lavaPool.radius && isGrounded && py < 1.0;
  };

  // Player on ground in lava pool
  assert.equal(damageCheck(0, 0, 0, true), true, 'Ground player in pool takes damage');

  // Player on elevated platform at Y = 4.5 directly above the pool
  assert.equal(damageCheck(0, 4.5, 0, true), false, 'Elevated player above pool takes NO damage');
});
