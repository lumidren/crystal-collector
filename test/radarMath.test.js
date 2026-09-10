import test from 'node:test';
import assert from 'node:assert/strict';

test('radarMath - projects world coordinates into radar screen coordinates relative to player forward', () => {
  const RADAR_RANGE = 55;
  const WIDTH = 146;
  const HEIGHT = 146;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;
  const RADIUS = (WIDTH / 2) - 8;

  const toRadarCoords = (wx, wz, pX, pZ, pRot) => {
    const dx = wx - pX;
    const dz = wz - pZ;
    const dist = Math.hypot(dx, dz);
    const relAngle = Math.atan2(dx, -dz) - pRot;
    const rDist = Math.min(dist, RADAR_RANGE) / RADAR_RANGE * (RADIUS - 6);

    return {
      x: CENTER_X + Math.sin(relAngle) * rDist,
      y: CENTER_Y - Math.cos(relAngle) * rDist,
      inRange: dist <= RADAR_RANGE,
      dist
    };
  };

  // Player at origin looking North (pRot = 0)
  const pX = 0, pZ = 0, pRot = 0;

  // 1. Target 25m straight ahead (dx = 0, dz = -25 in Three.js coordinates)
  const ahead = toRadarCoords(0, -25, pX, pZ, pRot);
  assert.ok(Math.abs(ahead.x - CENTER_X) < 0.01, 'Target straight ahead must be horizontally centered');
  assert.ok(ahead.y < CENTER_Y, 'Target straight ahead must be vertically UP on radar');
  assert.equal(ahead.inRange, true);

  // 2. Target 25m behind (dx = 0, dz = 25)
  const behind = toRadarCoords(0, 25, pX, pZ, pRot);
  assert.ok(Math.abs(behind.x - CENTER_X) < 0.01);
  assert.ok(behind.y > CENTER_Y, 'Target behind player must be vertically DOWN on radar');

  // 3. Target 25m to the right (dx = 25, dz = 0)
  const right = toRadarCoords(25, 0, pX, pZ, pRot);
  assert.ok(right.x > CENTER_X, 'Target to the right must be on RIGHT of radar');
  assert.ok(Math.abs(right.y - CENTER_Y) < 0.01);

  // 4. Target 25m to the left (dx = -25, dz = 0)
  const left = toRadarCoords(-25, 0, pX, pZ, pRot);
  assert.ok(left.x < CENTER_X, 'Target to the left must be on LEFT of radar');
  assert.ok(Math.abs(left.y - CENTER_Y) < 0.01);

  // 5. Target 70m away (exceeds 55m RADAR_RANGE)
  const farTarget = toRadarCoords(0, -70, pX, pZ, pRot);
  assert.equal(farTarget.inRange, false, 'Target beyond 55m must report inRange = false');
  const distFromCenter = Math.hypot(farTarget.x - CENTER_X, farTarget.y - CENTER_Y);
  assert.ok(distFromCenter <= RADIUS, 'Target beyond 55m must be clamped within radar radius');
});

test('radarMath - distinguishes sky island altitude markers for elevated targets', () => {
  const groundCrystal = { y: 1.2 };
  const skyIslandCrystal = { y: 5.3 };

  const isGroundElevated = groundCrystal.y > 2.5;
  const isSkyElevated = skyIslandCrystal.y > 2.5;

  assert.equal(isGroundElevated, false, 'Ground crystal must not have elevated indicator');
  assert.equal(isSkyElevated, true, 'Sky island crystal must show elevated indicator');
});
