import test from 'node:test';
import assert from 'node:assert/strict';

export function getDifficultyObstacleConfig(levelConfig, difficulty, platforms = []) {
  const isEasy = difficulty === 'easy';

  const obsCount = isEasy ? Math.max(4, Math.round(levelConfig.obs * 0.45)) : levelConfig.obs;
  const speed = isEasy ? levelConfig.speed * 0.55 : levelConfig.speed;

  let seekerCount = 0;
  let roamingCount = 0;
  for (let i = 0; i < obsCount; i++) {
    const isSeeker = !isEasy && (i % 3 === 0);
    if (isSeeker) seekerCount++;
    else roamingCount++;
  }

  let skyMineCount = 0;
  if (!isEasy && platforms && platforms.length > 0) {
    platforms.forEach((p, idx) => {
      if (idx % 2 === 0 || p.width >= 12) {
        skyMineCount++;
      }
    });
  }

  return {
    obsCount,
    speed,
    seekerCount,
    roamingCount,
    skyMineCount,
    isEasy
  };
}

test('difficultyMath - Easy mode completely disables sky mines and seeker drones', () => {
  const mockLevelCfg = { crystals: 12, coins: 25, obs: 20, speed: 10 };
  const mockPlatforms = [
    { width: 14, depth: 8, topY: 3.8 },
    { width: 8, depth: 8, topY: 4.6 },
    { width: 16, depth: 6, topY: 5.8 }
  ];

  const easyConfig = getDifficultyObstacleConfig(mockLevelCfg, 'easy', mockPlatforms);

  assert.equal(easyConfig.isEasy, true);
  assert.equal(easyConfig.skyMineCount, 0, 'Easy mode must have zero sky mines');
  assert.equal(easyConfig.seekerCount, 0, 'Easy mode must have zero tracking hunter seekers');
  assert.equal(easyConfig.obsCount, 9, 'Easy mode scales down obstacle count (20 * 0.45 = 9)');
  assert.equal(easyConfig.speed, 5.5, 'Easy mode scales down obstacle speed (10 * 0.55 = 5.5)');
  assert.equal(easyConfig.roamingCount, 9, 'All spawned obstacles in Easy mode are basic roaming sentinels');
});

test('difficultyMath - Hard mode activates aerial sky mines, hunter seekers, and full arcade speed', () => {
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
  assert.ok(hardConfig.seekerCount > 0, 'Hard mode spawns tracking hunter seekers');
  assert.equal(hardConfig.obsCount, 20, 'Hard mode uses full obstacle count');
  assert.equal(hardConfig.speed, 10, 'Hard mode runs at full arcade speed');
  assert.equal(hardConfig.seekerCount, 7, '7 out of 20 obstacles are Hunter Seekers in Hard mode');
  assert.equal(hardConfig.roamingCount, 13);
});
