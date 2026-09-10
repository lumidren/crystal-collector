import test from 'node:test';
import assert from 'node:assert/strict';

const parTimes = [35, 40, 48, 55, 65, 72, 80, 88, 95, 120];

const calculateRank = ({ level, damageTaken, elapsedTime, maxCombo, heartsRemaining }) => {
  const par = parTimes[level - 1] || 60;
  let rank = 'C';

  if (damageTaken === 0 && (elapsedTime <= par || maxCombo >= 4)) {
    rank = 'S';
  } else if (damageTaken <= 1 && (elapsedTime <= par * 1.3 || maxCombo >= 3)) {
    rank = 'A';
  } else if (damageTaken <= 2 || heartsRemaining >= 2) {
    rank = 'B';
  }
  return rank;
};

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '00:00.0';
  const totalSecs = Math.floor(secs);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  const ms = Math.round((secs - totalSecs) * 10) % 10;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
};

test('scoreboardMath - calculates S, A, B, C ranks under various performance criteria', () => {
  // S-Rank: 0 damage taken + under par time
  assert.equal(calculateRank({ level: 1, damageTaken: 0, elapsedTime: 28, maxCombo: 2, heartsRemaining: 3 }), 'S');

  // S-Rank: 0 damage taken + high combo (>=4) even if slightly over par time
  assert.equal(calculateRank({ level: 1, damageTaken: 0, elapsedTime: 42, maxCombo: 5, heartsRemaining: 3 }), 'S');

  // A-Rank: 1 hit taken + swift pace
  assert.equal(calculateRank({ level: 1, damageTaken: 1, elapsedTime: 30, maxCombo: 3, heartsRemaining: 2 }), 'A');

  // B-Rank: 2 hits taken or moderate survival
  assert.equal(calculateRank({ level: 1, damageTaken: 2, elapsedTime: 50, maxCombo: 2, heartsRemaining: 2 }), 'B');

  // C-Rank: heavy damage taken + 1 heart remaining
  assert.equal(calculateRank({ level: 1, damageTaken: 4, elapsedTime: 75, maxCombo: 1, heartsRemaining: 1 }), 'C');
});

test('scoreboardMath - formatTime formats seconds accurately with mm:ss.ms', () => {
  assert.equal(formatTime(0), '00:00.0');
  assert.equal(formatTime(null), '00:00.0');
  assert.equal(formatTime(NaN), '00:00.0');
  assert.equal(formatTime(9.4), '00:09.4');
  assert.equal(formatTime(59.9), '00:59.9');
  assert.equal(formatTime(60.0), '01:00.0');
  assert.equal(formatTime(125.7), '02:05.7');
});
