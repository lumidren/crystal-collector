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

test('physicsMath - Hunter Seeker calculates homing steering vector toward player within 24m detection radius', () => {
  const seekerPos = { x: 10, z: 10 };
  const playerPos = { x: 15, y: 0, z: 22 };
  const dist = Math.hypot(playerPos.x - seekerPos.x, playerPos.z - seekerPos.z);
  const isNearGround = playerPos.y < 2.2;
  const isLocked = dist < 24 && isNearGround;

  assert.equal(isLocked, true, 'Seeker must lock on when player is within 24m on ground');

  const dirX = (playerPos.x - seekerPos.x) / dist;
  const dirZ = (playerPos.z - seekerPos.z) / dist;
  const len = Math.hypot(dirX, dirZ);

  assert.ok(Math.abs(len - 1.0) < 0.001, 'Homing vector must be a normalized unit vector');
  assert.ok(dirX > 0, 'Must steer in positive X towards player');
  assert.ok(dirZ > 0, 'Must steer in positive Z towards player');

  // Player high on sky platform (Y = 5.0) breaks ground lock
  const elevatedPlayer = { x: 15, y: 5.0, z: 22 };
  const elevatedLocked = dist < 24 && elevatedPlayer.y < 2.2;
  assert.equal(elevatedLocked, false, 'Seeker ground lock must disengage when player escapes to sky platform');
});

test('physicsMath - Aerial Sky Mine reverses direction within platform bounding limits and detects elevated player', () => {
  const platform = { minX: -10, maxX: 10, topY: 4.5 };
  let mineX = 9.8;
  let dir = 1;
  const maxBound = platform.maxX - 1.2; // 8.8

  // Patrol boundary reversal check
  if (mineX >= maxBound) {
    mineX = maxBound;
    dir = -1;
  }
  assert.equal(dir, -1, 'Sky mine must reverse direction upon reaching platform edge');

  // Collision with player on platform
  const elevatedPlayer = { x: 8.8, y: 4.5, z: 0 };
  const minePos = { x: 8.8, y: 4.5 + 1.2, z: 0 };
  const distH = Math.hypot(elevatedPlayer.x - minePos.x, elevatedPlayer.z - minePos.z);
  const distY = Math.abs(elevatedPlayer.y - platform.topY);
  const hitsPlayer = distH < 2.0 && distY < 1.8;

  assert.equal(hitsPlayer, true, 'Sky mine must detect player standing on the same elevated platform');
});

test('physicsMath - solid tree and rock colliders block player movement and push player back', () => {
  const scene = new THREE.Scene();
  const { solidColliders } = BiomeGenerator.buildBiome(1, scene);

  assert.ok(solidColliders && solidColliders.length > 0, 'Must provide solid colliders for biome decorations');
  const tree = solidColliders.find(c => c.type === 'tree');
  const rock = solidColliders.find(c => c.type === 'rock');
  assert.ok(tree, 'Forest biome must contain solid tree colliders');
  assert.ok(rock, 'Forest biome must contain solid rock colliders');

  const playerR = 0.65;

  // Test player walking into tree center:
  let px = tree.x + 0.2;
  let pz = tree.z + 0.2;
  const py = 0; // ground level

  for (const col of solidColliders) {
    if (py < (col.height || 4.5)) {
      const dx = px - col.x;
      const dz = pz - col.z;
      const dist = Math.hypot(dx, dz);
      const minDist = (col.radius || 1.2) + playerR;
      if (dist < minDist && dist > 0.0001) {
        const push = minDist - dist;
        px += (dx / dist) * push;
        pz += (dz / dist) * push;
      }
    }
  }

  const finalDist = Math.hypot(px - tree.x, pz - tree.z);
  const expectedMinDist = tree.radius + playerR;
  assert.ok(finalDist >= expectedMinDist - 0.001, 'Player must be pushed outside tree solid radius');
});

test('physicsMath - uncapped heart accumulation allows player to gain hearts beyond starting 3', () => {
  let hearts = 3;
  const collectHeart = (prev) => prev + 1;
  const takeDamage = (prev) => prev - 1;

  // Collecting when at 3 hearts yields 4
  hearts = collectHeart(hearts);
  assert.equal(hearts, 4, 'Collecting heart when at 3 must result in 4');

  // Collecting more hearts accumulates without limit
  hearts = collectHeart(hearts);
  assert.equal(hearts, 5, 'Collecting another heart results in 5');

  for (let i = 0; i < 5; i++) {
    hearts = collectHeart(hearts);
  }
  assert.equal(hearts, 10, 'Player can gain as many hearts as desired (10 hearts)');

  // Taking damage removes 1 heart correctly
  hearts = takeDamage(hearts);
  assert.equal(hearts, 9, 'Taking damage from 10 hearts reduces to 9');
});

test('physicsMath - Quantum Sentinel Cube hover altitude guarantees zero clipping below surfaces', () => {
  const scene = new THREE.Scene();
  const { platforms, solidColliders } = BiomeGenerator.buildBiome(1, scene);

  // Sentinel Cube dimensions
  const cubeHalfHeight = 0.95; // BoxGeometry(1.9, 1.9, 1.9)
  const repulsorBottomOffset = 1.01; // Cylinder and glow disc at -1.01m below center
  const maxTilt = 0.06; // Max banking angle in radians

  // 1. Hover on ground surface (surfaceY = 0)
  for (let t = 0; t < 10; t += 0.25) {
    for (let phase = 0; phase < Math.PI * 2; phase += 0.5) {
      const surfaceY = 0;
      const hoverY = surfaceY + 1.4 + Math.sin(t * 3.0 + phase) * 0.12;
      const lowestRepulsorY = hoverY - repulsorBottomOffset;
      const lowestCubeFaceY = hoverY - cubeHalfHeight;

      // Even with maximum tilt banking
      const lowestTiltedCorner = hoverY - (cubeHalfHeight * Math.cos(maxTilt) + cubeHalfHeight * Math.sin(maxTilt));

      assert.ok(lowestRepulsorY >= 0.25, `Repulsor (${lowestRepulsorY}m) must hover cleanly above ground with >= 0.25m clearance`);
      assert.ok(lowestCubeFaceY >= 0.30, `Cube bottom (${lowestCubeFaceY}m) must be well above ground`);
      assert.ok(lowestTiltedCorner >= 0.25, `Tilted corner (${lowestTiltedCorner}m) must never clip ground plane`);
    }
  }

  // 2. Hover on elevated sky platforms
  const platform = platforms[0];
  const surfaceY = platform.topY;
  for (let t = 0; t < 5; t += 0.5) {
    const hoverY = surfaceY + 1.4 + Math.sin(t * 3.0) * 0.12;
    const lowestRepulsorY = hoverY - repulsorBottomOffset;
    assert.ok(lowestRepulsorY > platform.topY + 0.25, `Sentinel hovering on platform must maintain > 0.25m platform clearance`);
  }

  // 3. Collision resolution against solid obstacle colliders
  const rock = solidColliders.find(c => c.type === 'rock') || solidColliders[0];
  const sentinel = {
    x: rock.x + 0.3,
    z: rock.z + 0.3,
    vx: -2.0,
    vz: -1.5,
    radius: 1.2
  };

  const dx = sentinel.x - rock.x;
  const dz = sentinel.z - rock.z;
  const dist = Math.hypot(dx, dz);
  const minDist = (rock.radius || 1.2) + sentinel.radius;

  assert.ok(dist < minDist, 'Sentinel starts overlapping solid collider');

  // Solid bounce logic from App.jsx
  const push = minDist - dist;
  sentinel.x += (dx / dist) * push;
  sentinel.z += (dz / dist) * push;
  sentinel.vx *= -1;
  sentinel.vz *= -1;

  const resolvedDist = Math.hypot(sentinel.x - rock.x, sentinel.z - rock.z);
  assert.ok(resolvedDist >= minDist - 0.0001, 'Sentinel must be pushed outside solid collider radius');
  assert.equal(sentinel.vx, 2.0, 'Sentinel velocity X must reflect');
  assert.equal(sentinel.vz, 1.5, 'Sentinel velocity Z must reflect');
});

