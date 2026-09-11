import test from 'node:test';
import assert from 'node:assert/strict';

export function getDifficultyObstacleConfig(levelConfig, difficulty = 'medium', platforms = []) {
  const isEasy = difficulty === 'easy';
  const isMedium = difficulty === 'medium';
  const isHard = difficulty === 'hard';

  // Easy: No spiders, more cubes (+25% cubes, 70% speed)
  // Medium: A little bit of spiders (~16% spiders) and more cubes (+15% cubes, 85% speed)
  // Hard: Challenging density (~33% spiders, 100% cubes, 105% speed)
  const obsCount = isEasy
    ? Math.max(6, Math.round(levelConfig.obs * 1.25))
    : (isMedium ? Math.max(5, Math.round(levelConfig.obs * 1.15)) : levelConfig.obs);
  const speed = isEasy
    ? levelConfig.speed * 0.70
    : (isMedium ? levelConfig.speed * 0.85 : levelConfig.speed * 1.05);

  let creatureCount = 0;
  let roamingCount = 0;
  for (let i = 0; i < obsCount; i++) {
    // Easy: 0 creatures (100% cubes)
    // Medium: a little bit of spiders (i % 6 === 0)
    // Hard: ~35% spiders (i % 3 === 0)
    const isCreature = isEasy ? false : (isMedium ? (i % 6 === 0) : (i % 3 === 0));
    if (isCreature) creatureCount++;
    else roamingCount++;
  }

  let skyMineCount = 0;
  if (platforms && platforms.length > 0) {
    platforms.forEach((p, idx) => {
      const shouldSpawnMine = isEasy
        ? false
        : (isMedium ? (p.width >= 14 || idx % 4 === 0) : (idx % 2 === 0 || p.width >= 12));
      if (shouldSpawnMine) {
        skyMineCount++;
      }
    });
  }

  return {
    difficulty,
    obsCount,
    speed,
    creatureCount,
    roamingCount,
    skyMineCount,
    isEasy,
    isMedium,
    isHard,
    lungeMultiplier: isMedium ? 1.45 : 1.85,
    windupDuration: isMedium ? 0.48 : 0.38,
    recoveryCooldown: isMedium ? 2.0 : 1.4
  };
}

export function verifyRootPassword(inputPassword) {
  return typeof inputPassword === 'string' && inputPassword.trim().toLowerCase() === 'lumidren';
}

test('difficultyMath - Easy mode: 0 spiders, more Sentinel Cubes (+25%), relaxed speed', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const easyConfig = getDifficultyObstacleConfig(mockLevelCfg, 'easy', mockPlatforms);

  assert.equal(easyConfig.isEasy, true);
  assert.equal(easyConfig.obsCount, 25, 'Easy gives +25% obstacle cubes (20 * 1.25 = 25)');
  assert.equal(easyConfig.speed, 7.0, 'Easy scales obstacle speed to 70% (10 * 0.70 = 7.0)');
  assert.equal(easyConfig.creatureCount, 0, 'Easy mode has absolutely ZERO spiders/creatures');
  assert.equal(easyConfig.roamingCount, 25, 'All 25 obstacles are Sentinel Cubes');
  assert.equal(easyConfig.skyMineCount, 0, 'Easy mode has 0 sky mines on platforms');
});

test('difficultyMath - Medium mode: small fraction of spiders, more cubes (+15%), balanced speed', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const medConfig = getDifficultyObstacleConfig(mockLevelCfg, 'medium', mockPlatforms);

  assert.equal(medConfig.isMedium, true);
  assert.equal(medConfig.obsCount, 23, 'Medium scales obstacle count to +15% (20 * 1.15 = 23)');
  assert.equal(medConfig.speed, 8.5, 'Medium scales obstacle speed to 85% (10 * 0.85 = 8.5)');
  assert.ok(medConfig.creatureCount > 0, 'Medium spawns a small fraction of Cyber Stalkers');
  assert.equal(medConfig.creatureCount, 4, '4 out of 23 obstacles are Cyber Stalkers (i % 6 === 0 -> i=0, 6, 12, 18)');
  assert.equal(medConfig.roamingCount, 19, '19 Sentinel Cubes');
  assert.ok(medConfig.skyMineCount > 0, 'Medium spawns select sky mines on wide platforms');
  assert.equal(medConfig.lungeMultiplier, 1.45, 'Moderate lunge multiplier in Medium');
  assert.equal(medConfig.windupDuration, 0.48, 'Generous windup reaction telegraph in Medium');
  assert.equal(medConfig.recoveryCooldown, 2.0, 'Safe recovery window in Medium');
});

test('difficultyMath - Hard mode: intense arcade challenge with aggressive spiders & dense sky mines', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const hardConfig = getDifficultyObstacleConfig(mockLevelCfg, 'hard', mockPlatforms);

  assert.equal(hardConfig.isHard, true);
  assert.equal(hardConfig.obsCount, 20, 'Hard mode uses baseline obstacle density');
  assert.equal(hardConfig.speed, 10.5, 'Hard mode has swift speed (10 * 1.05 = 10.5)');
  assert.equal(hardConfig.creatureCount, 7, '7 out of 20 are Cyber Stalkers in Hard mode (i % 3 === 0)');
  assert.equal(hardConfig.roamingCount, 13);
  assert.equal(hardConfig.skyMineCount, 2, 'Platforms 0 and 2 qualify for sky mines in Hard');
  assert.equal(hardConfig.lungeMultiplier, 1.85, 'Fierce lunge velocity in Hard mode');
  assert.equal(hardConfig.windupDuration, 0.38, 'Short windup telegraph in Hard mode');
  assert.equal(hardConfig.recoveryCooldown, 1.4, 'Fast recovery in Hard mode');
});

test('rootPassword - developer master password unlock logic', () => {
  assert.equal(verifyRootPassword('lumidren'), true, 'Password lumidren unlocks root version');
  assert.equal(verifyRootPassword('LUMIDREN'), true, 'Case-insensitive LUMIDREN unlocks root version');
  assert.equal(verifyRootPassword(' lumidren  '), true, 'Trims whitespace correctly');
  assert.equal(verifyRootPassword('wrongpassword'), false, 'Rejects invalid password');
  assert.equal(verifyRootPassword(''), false, 'Rejects empty password');
  assert.equal(verifyRootPassword(null), false, 'Handles null safely');
});
