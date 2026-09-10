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
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#00f0ff', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}>
            ⚡ MADE BY LUMIDREN ⚡
          </div>
        </div>

        {/* Difficulty Quick Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <div
            className="difficulty-toggle-pill"
            style={{
              display: 'inline-flex',
              background: 'rgba(10, 20, 35, 0.75)',
              padding: '4px',
              borderRadius: '24px',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)',
              gap: '4px'
            }}
          >
            <button
              style={{
                background: (savedData.difficulty || 'hard') === 'easy' ? 'rgba(0, 255, 136, 0.25)' : 'transparent',
                border: (savedData.difficulty || 'hard') === 'easy' ? '1px solid #00ff88' : '1px solid transparent',
                color: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : '#64748b',
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px'
              }}
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
              style={{
                background: (savedData.difficulty || 'hard') === 'hard' ? 'rgba(255, 0, 85, 0.25)' : 'transparent',
                border: (savedData.difficulty || 'hard') === 'hard' ? '1px solid #ff0055' : '1px solid transparent',
                color: (savedData.difficulty || 'hard') === 'hard' ? '#ff4d6d' : '#64748b',
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px'
              }}
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
          <span style={{ fontSize: '11px', color: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : '#ff758f', fontWeight: 600 }}>
            {(savedData.difficulty || 'hard') === 'easy' ? '🌿 Relaxed Biomes · No Sky Mines · No Seeker Tracking' : '🔥 Arcade Rush · Hunter Seekers · Aerial Sky Mines Active'}
          </span>
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

      {/* Bottom Bar: Platform & Controls Hint & Credits */}
      <div className="home-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 36px', color: '#64748b', fontSize: '13px' }}>
        <span>WASD: Move · Space: Jump & Double Jump · Mouse: Look · Shift: Sprint</span>
        <span style={{ color: '#00f0ff', fontWeight: 700, letterSpacing: '0.5px' }}>
          Made with 💎 by <strong style={{ color: '#fff' }}>lumidren</strong>
        </span>
      </div>
    </div>
  );
};
