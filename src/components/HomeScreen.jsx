import React from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const HomeScreen = ({
  savedData,
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
      <div className="home-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="player-profile-card">
          <div
            className="player-avatar-circle"
            style={{
              background: savedData.playerColor || '#00ff00',
              boxShadow: `0 0 15px ${savedData.playerColor || '#00ff00'}`
            }}
          >
            {currentHatObj ? currentHatObj.icon : '🧢'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>
              Level {highestLevel} Explorer
            </div>
            <div style={{ fontSize: '12px', color: '#8fa0b5' }}>
              Pet: {currentPetObj ? `${currentPetObj.icon} ${currentPetObj.name}` : 'None'}
            </div>
          </div>
        </div>

        {/* Currency & Trophies */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="stat-pill">
            <span>🪙</span>
            <span>{savedData.totalCoins}</span>
          </div>
          <div
            className="stat-pill"
            style={{ color: '#00f0ff', background: 'rgba(0, 240, 255, 0.12)', borderColor: 'rgba(0, 240, 255, 0.25)' }}
          >
            <span>🏆</span>
            <span>{unlockedAchievementsCount} Badges</span>
          </div>
        </div>
      </div>

      {/* Center Hero: Title & Action Menu */}
      <div className="home-center-content">
        <div className="home-logo-container">
          <div className="home-crystal-icon">💎</div>
          <h1 className="home-title">CRYSTAL COLLECTOR</h1>
          <div className="home-version-badge">2.0 DEFINITIVE EDITION</div>
          <p className="home-subtitle">
            ARCADE 3D PLATFORMER · PROCEDURAL BIOMES · GUARDIAN TITAN
          </p>
        </div>

        <div className="home-menu-list">
          <button
            className="btn-primary home-btn-play"
            onMouseEnter={handleHover}
            onClick={() => handleClick(onPlay)}
          >
            ▶️ PLAY CAMPAIGN
          </button>

          <button
            className="btn-secondary home-btn-item"
            onMouseEnter={handleHover}
            onClick={() => handleClick(onOpenLevelSelect)}
          >
            🗺️ SELECT LEVEL ({highestLevel}/10)
          </button>

          <button
            className="btn-secondary home-btn-item"
            onMouseEnter={handleHover}
            onClick={() => handleClick(onOpenShop)}
          >
            🛒 ARCADE SHOP
          </button>

          <button
            className="btn-secondary home-btn-item"
            onMouseEnter={handleHover}
            onClick={() => handleClick(onOpenAchievements)}
          >
            🏆 ACHIEVEMENTS & BADGES
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-secondary home-btn-item"
              style={{ flex: 1 }}
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenHowToPlay)}
            >
              📖 HOW TO PLAY
            </button>
            <button
              className="btn-secondary home-btn-item"
              style={{ flex: 1 }}
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenSettings)}
            >
              ⚙️ SETTINGS
            </button>
          </div>

          <button
            className="btn-secondary home-btn-item"
            style={{ color: '#ff6b81', borderColor: 'rgba(255, 107, 129, 0.25)' }}
            onMouseEnter={handleHover}
            onClick={handleQuit}
          >
            ❌ EXIT GAME
          </button>
        </div>
      </div>

      {/* Bottom Bar: Platform & Controls Hint */}
      <div className="home-bottom-bar" style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <span>WASD: Move · Space: Jump & Double Jump · Mouse: Look · Shift: Sprint</span>
      </div>
    </div>
  );
};
