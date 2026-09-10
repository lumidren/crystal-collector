import React from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const HomeScreen = ({
  savedData,
  setSavedData,
  onToggleDifficulty,
  onPlay,
  onOpenLevelSelect,
  onOpenShop,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenSettings,
  shopHats,
  shopPets
}) => {
  const currentHatObj = shopHats.find(h => h.id === savedData.currentHat);
  const currentPetObj = shopPets.find(p => p.id === savedData.currentPet);
  const unlockedAchievementsCount = Object.keys(savedData.achievements || {}).filter(k => savedData.achievements[k]).length;
  const highestLevel = savedData.unlockedLevels || 1;

  const handleHover = () => {
    soundEngine.playUIHover();
  };

  const handleClick = (action) => {
    soundEngine.playUIClick();
    if (action) action();
  };

  const handleQuit = () => {
    soundEngine.playUIClick();
    if (window.close) {
      window.close();
    }
  };

  return (
    <div className="home-overlay">
      {/* Top Bar: Player Loadout & Coins Profile */}
      <div className="home-top-bar">
        <div className="player-profile-card">
          <div
            className="player-avatar-circle"
            style={{
              background: savedData.playerColor || '#00ff00',
              boxShadow: `0 0 12px ${savedData.playerColor || '#00ff00'}`
            }}
          >
            {currentHatObj ? currentHatObj.icon : '🧢'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>
              Level {highestLevel} Explorer
            </div>
            <div style={{ fontSize: '12px', color: '#7e93ab' }}>
              Pet: {currentPetObj ? `${currentPetObj.icon} ${currentPetObj.name}` : 'None'}
            </div>
          </div>
        </div>

        {/* Creator Brand Tag */}
        <div className="home-brand-tag">
          ⚡ MADE BY LUMIDREN ⚡
        </div>

        {/* Currency & Trophies */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="stat-pill">
            <span>🪙</span>
            <span>{savedData.totalCoins}</span>
          </div>
          <div
            className="stat-pill"
            style={{ color: '#00f0ff', background: '#0e1828', borderColor: '#1c2d47' }}
          >
            <span>🏆</span>
            <span>{unlockedAchievementsCount} Badges</span>
          </div>
        </div>
      </div>

      {/* Center Hero: Title & Action Menu */}
      <div className="home-center-content">
        <div className="home-logo-container">
          <div className="home-crystal-badge">💎</div>
          <h1 className="home-title">CRYSTAL COLLECTOR</h1>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687f9d', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase' }}>
            ARCADE 3D PLATFORMER · PROCEDURAL BIOMES
          </div>
        </div>

        {/* Difficulty Quick Toggle */}
        <div className="home-difficulty-container">
          <div className="home-diff-switch">
            <button
              className={`home-diff-btn ${(savedData.difficulty || 'hard') === 'easy' ? 'active-easy' : ''}`}
              onMouseEnter={handleHover}
              onClick={() => {
                soundEngine.playUIClick();
                if (onToggleDifficulty) onToggleDifficulty('easy');
                else if (setSavedData) setSavedData(prev => ({ ...prev, difficulty: 'easy' }));
              }}
            >
              🟢 EASY (NO MINES)
            </button>
            <button
              className={`home-diff-btn ${(savedData.difficulty || 'hard') === 'hard' ? 'active-hard' : ''}`}
              onMouseEnter={handleHover}
              onClick={() => {
                soundEngine.playUIClick();
                if (onToggleDifficulty) onToggleDifficulty('hard');
                else if (setSavedData) setSavedData(prev => ({ ...prev, difficulty: 'hard' }));
              }}
            >
              ⚡ HARD (ARCADE)
            </button>
          </div>
          <span
            className="home-diff-hint"
            style={{ color: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : '#ff4d6d' }}
          >
            {(savedData.difficulty || 'hard') === 'easy'
              ? '🌿 Relaxed Biomes · Calm Speeds · No Sky Mines'
              : '🔥 Arcade Rush · High Speed · Sky Mines Active'}
          </span>
        </div>

        {/* Action Hub - Uncrowded, Solid 2-tier Grid */}
        <div className="home-action-deck">
          <button
            className="home-btn-play-solid"
            onMouseEnter={handleHover}
            onClick={() => handleClick(onPlay)}
          >
            ▶ PLAY CAMPAIGN
          </button>

          <div className="home-btn-grid">
            <button
              className="home-btn-solid"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenLevelSelect)}
            >
              🗺️ LEVELS ({highestLevel}/10)
            </button>
            <button
              className="home-btn-solid"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenShop)}
            >
              🛒 ARCADE SHOP
            </button>
          </div>

          <div className="home-btn-grid-3">
            <button
              className="home-btn-solid"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenAchievements)}
            >
              🏆 BADGES
            </button>
            <button
              className="home-btn-solid"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenSettings)}
            >
              ⚙️ SETTINGS
            </button>
            <button
              className="home-btn-solid"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenHowToPlay)}
            >
              📖 GUIDE
            </button>
          </div>

          <button
            className="home-btn-solid exit-btn"
            onMouseEnter={handleHover}
            onClick={handleQuit}
          >
            ❌ EXIT GAME
          </button>
        </div>
      </div>

      {/* Bottom Bar: Platform Controls Hint & Version */}
      <div className="home-bottom-bar">
        <span>WASD: Move · Space: Jump & Double Jump · Shift: Sprint · Mouse: Look</span>
        <span>Crystal Collector 2.0 • Made by <strong style={{ color: '#00f0ff' }}>lumidren</strong></span>
      </div>
    </div>
  );
};
