// LocalStorage persistence for Crystal Collector 2.0
const SAVE_KEY = 'crystal_collector_2_save';

const defaultState = {
  totalCoins: 0,
  highScore: 0,
  playerColor: '#00ff00',
  ownedColors: ['#00ff00'],
  currentHat: null,
  ownedHats: ['cap'],
  currentPet: null,
  ownedPets: [],
  currentTrail: null,
  ownedTrails: [],
  upgrades: {
    maxHearts: 3,
    maxStamina: 100,
    sprintMultiplier: 1.8,
    magnetRadius: 0
  },
  achievements: {},
  soundEnabled: true,
  musicEnabled: true,
  musicVolume: 0.25,
  sfxVolume: 0.5,
  sensitivity: 0.003,
  unlockedLevels: 1,
  hasSeenFirstTimeGuide: false,
  levelBestTimes: {},
  graphicsQuality: 'ultra',
  showFps: true
};

export const loadGameState = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      upgrades: {
        ...defaultState.upgrades,
        ...(parsed.upgrades || {})
      },
      achievements: {
        ...(parsed.achievements || {})
      },
      levelBestTimes: {
        ...(parsed.levelBestTimes || {})
      }
    };
  } catch (e) {
    console.warn('Failed to load save state:', e);
    return { ...defaultState };
  }
};

export const saveGameState = (state) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
};
