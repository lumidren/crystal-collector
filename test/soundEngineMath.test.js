import test from 'node:test';
import assert from 'node:assert/strict';

const midiToFreq = (midi) => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

const clampVolume = (vol) => {
  return Math.max(0, Math.min(1, vol));
};

const chords = [
  { root: 33, notes: [45, 48, 52, 57] }, // Am
  { root: 29, notes: [41, 45, 48, 53] }, // F
  { root: 36, notes: [48, 52, 55, 60] }, // C
  { root: 31, notes: [43, 47, 50, 55] }  // G
];

test('soundEngineMath - midiToFreq converts standard MIDI notes to exact Hertz frequencies', () => {
  assert.equal(Math.round(midiToFreq(69)), 440); // Concert A4
  assert.equal(Math.round(midiToFreq(57)), 220); // A3
  assert.equal(Math.round(midiToFreq(81)), 880); // A5
  assert.ok(Math.abs(midiToFreq(60) - 261.63) < 0.05); // Middle C
});

test('soundEngineMath - volume settings clamp cleanly within [0, 1] range', () => {
  assert.equal(clampVolume(-0.5), 0);
  assert.equal(clampVolume(1.8), 1);
  assert.equal(clampVolume(0.4), 0.4);
  assert.equal(clampVolume(0), 0);
  assert.equal(clampVolume(1), 1);
});

test('soundEngineMath - chord progression structure conforms to harmonic synthwave progression', () => {
  assert.equal(chords.length, 4);
  chords.forEach(c => {
    assert.ok(c.root > 0);
    assert.equal(c.notes.length, 4);
    c.notes.forEach(n => assert.ok(n > c.root, 'Note must be higher frequency than bass root'));
  });
});
