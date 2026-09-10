import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

globalThis.localStorage = new LocalStorageMock();

const { loadGameState, saveGameState } = await import('../src/game/saveManager.js');

test('saveManager - loadGameState returns complete default state when empty', () => {
  localStorage.clear();
  const state = loadGameState();

  assert.equal(state.totalCoins, 0);
  assert.equal(state.highScore, 0);
  assert.equal(state.playerColor, '#00ff00');
  assert.ok(Array.isArray(state.ownedColors));
  assert.ok(state.ownedColors.includes('#00ff00'));
  assert.equal(state.currentHat, null);
  assert.ok(Array.isArray(state.ownedHats));
  assert.equal(state.currentPet, null);
  assert.ok(Array.isArray(state.ownedPets));
  assert.equal(state.currentTrail, null);
  assert.ok(Array.isArray(state.ownedTrails));

  // Upgrades
  assert.equal(typeof state.upgrades, 'object');
  assert.equal(state.upgrades.maxHearts, 3);
  assert.equal(state.upgrades.maxStamina, 100);
  assert.equal(state.upgrades.sprintMultiplier, 1.8);
  assert.equal(state.upgrades.magnetRadius, 0);

  // Settings & HUD
  assert.equal(state.soundEnabled, true);
  assert.equal(state.musicEnabled, true);
  assert.equal(state.unlockedLevels, 1);
  assert.equal(state.hasSeenFirstTimeGuide, false);
  assert.equal(state.showFPS, true);
  assert.equal(state.graphicsQuality, 'ultra');
  assert.equal(state.difficulty, 'hard');
});

test('saveManager - saveGameState and loadGameState persist round-trip', () => {
  localStorage.clear();
  const modified = {
    totalCoins: 350,
    difficulty: 'easy',
    playerColor: '#0080ff',
    ownedColors: ['#00ff00', '#0080ff'],
    currentPet: 'dog',
    ownedPets: ['dog'],
    unlockedLevels: 5,
    upgrades: {
      maxHearts: 4,
      maxStamina: 125,
      sprintMultiplier: 1.8,
      magnetRadius: 3
    },
    achievements: { first_crystal: true, trampoline_ace: true },
    levelBestTimes: { 1: 12.4, 2: 18.2 },
    graphicsQuality: 'high',
    showFPS: false
  };
  saveGameState(modified);
  const loaded = loadGameState();

  assert.equal(loaded.totalCoins, 350);
  assert.equal(loaded.difficulty, 'easy');
  assert.equal(loaded.playerColor, '#0080ff');
  assert.equal(loaded.currentPet, 'dog');
  assert.ok(loaded.ownedPets.includes('dog'));
  assert.equal(loaded.unlockedLevels, 5);
  assert.equal(loaded.upgrades.maxHearts, 4);
  assert.equal(loaded.upgrades.maxStamina, 125);
  assert.equal(loaded.upgrades.magnetRadius, 3);
  assert.equal(loaded.achievements.first_crystal, true);
  assert.equal(loaded.achievements.trampoline_ace, true);
  assert.equal(loaded.levelBestTimes[1], 12.4);
  assert.equal(loaded.showFPS, false);
  assert.equal(loaded.graphicsQuality, 'high');
});

test('saveManager - handles corrupted JSON gracefully without crashing', () => {
  localStorage.setItem('crystal_collector_2_save', '{invalid: json');
  const state = loadGameState();

  assert.ok(state);
  assert.equal(state.totalCoins, 0);
  assert.equal(state.unlockedLevels, 1);
});
