import test from 'node:test';
import assert from 'node:assert/strict';

export function getDifficultyObstacleConfig(levelConfig, difficulty, platforms = []) {
  const isEasy = difficulty === 'easy';

  // Easy mode is tuned as "Medium": 75% obstacle density, 75% speed
  // Hard mode is "Hard": 100% density, 100% speed
  const obsCount = isEasy ? Math.max(5, Math.round(levelConfig.obs * 0.75)) : levelConfig.obs;
  const speed = isEasy ? levelConfig.speed * 0.75 : levelConfig.speed;

  let creatureCount = 0;
  let roamingCount = 0;
  for (let i = 0; i < obsCount; i++) {
    // 25% creatures in Easy (Medium), ~35% in Hard
    const isCreature = isEasy ? (i % 4 === 0) : (i % 3 === 0);
    if (isCreature) creatureCount++;
    else roamingCount++;
  }

  let skyMineCount = 0;
  if (platforms && platforms.length > 0) {
    platforms.forEach((p, idx) => {
      const shouldSpawnMine = isEasy
        ? (p.width >= 13 || idx % 3 === 0)
        : (idx % 2 === 0 || p.width >= 12);
      if (shouldSpawnMine) {
        skyMineCount++;
      }
    });
  }

  return {
    obsCount,
    speed,
    creatureCount,
    roamingCount,
    skyMineCount,
    isEasy,
    lungeMultiplier: isEasy ? 1.45 : 1.85,
    windupDuration: isEasy ? 0.48 : 0.38,
    recoveryCooldown: isEasy ? 2.0 : 1.4
  };
}

test('difficultyMath - Easy mode is tuned as balanced Medium challenge with moderate speed, stalkers & select sky mines', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const easyConfig = getDifficultyObstacleConfig(mockLevelCfg, 'easy', mockPlatforms);

  assert.equal(easyConfig.isEasy, true);
  assert.equal(easyConfig.obsCount, 15, 'Easy (Medium) scales obstacle count to 75% (20 * 0.75 = 15)');
  assert.equal(easyConfig.speed, 7.5, 'Easy (Medium) scales obstacle speed to 75% (10 * 0.75 = 7.5)');
  assert.ok(easyConfig.creatureCount > 0, 'Easy (Medium) includes balanced Cyber Stalker creatures');
  assert.equal(easyConfig.creatureCount, 4, '4 out of 15 obstacles are Cyber Stalkers (25%)');
  assert.equal(easyConfig.roamingCount, 11);
  assert.ok(easyConfig.skyMineCount > 0, 'Easy (Medium) spawns select sky mines on wide platforms');
  assert.equal(easyConfig.lungeMultiplier, 1.45, 'Gentler lunge speed in Medium');
  assert.equal(easyConfig.windupDuration, 0.48, 'Longer telegraphed reaction window in Medium');
  assert.equal(easyConfig.recoveryCooldown, 2.0, 'Longer recovery breather in Medium');
});

test('difficultyMath - Hard mode activates intense arcade challenge with max speed, fierce lunges & dense sky mines', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const hardConfig = getDifficultyObstacleConfig(mockLevelCfg, 'hard', mockPlatforms);

  assert.equal(hardConfig.isEasy, false);
  assert.ok(hardConfig.skyMineCount > 0, 'Hard mode spawns aerial sky mines on platforms');
  assert.equal(hardConfig.skyMineCount, 2, 'Platforms 0 and 2 qualify for sky mines');
  assert.ok(hardConfig.creatureCount > 0, 'Hard mode spawns tracking cyber stalker beasts');
  assert.equal(hardConfig.obsCount, 20, 'Hard mode uses full 100% obstacle count');
  assert.equal(hardConfig.speed, 10, 'Hard mode runs at full arcade speed');
  assert.equal(hardConfig.creatureCount, 7, '7 out of 20 obstacles are Cyber Stalkers in Hard mode (~35%)');
  assert.equal(hardConfig.roamingCount, 13);
  assert.equal(hardConfig.lungeMultiplier, 1.85, 'Aggressive high-speed lunge in Hard mode');
  assert.equal(hardConfig.windupDuration, 0.38, 'Fast windup telegraph in Hard mode');
  assert.equal(hardConfig.recoveryCooldown, 1.4, 'Brief recovery breather in Hard mode');
});
