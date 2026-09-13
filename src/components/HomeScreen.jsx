import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine.js';
import { CHARACTER_ROSTER } from '../game/character.js';

export const HomeScreen = ({
  savedData,
  setSavedData,
  onToggleDifficulty,
  onResetProgress,
  onPlay,
  onOpenLevelSelect,
  onOpenShop,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenAbout,
  shopHats,
  shopPets
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetTimer, setResetTimer] = useState(null);

  const activeHero = CHARACTER_ROSTER.find(c => c.id === savedData.currentCharacter) || CHARACTER_ROSTER[0];
  const currentHatObj = shopHats?.find(h => h.id === savedData.currentHat);
  const currentPetObj = shopPets?.find(p => p.id === savedData.currentPet);
  const unlockedAchievementsCount = Object.keys(savedData.achievements || {}).filter(k => savedData.achievements[k]).length;
  const highestLevel = savedData.unlockedLevels || 1;

  const handleHover = () => {
    soundEngine.playUIHover();
  };

  const handleClick = (action) => {
    soundEngine.playUIClick();
    if (action) action();
  };

  const handleResetClick = () => {
    soundEngine.playUIClick();
    if (!confirmReset) {
      setConfirmReset(true);
      const timer = setTimeout(() => {
        setConfirmReset(false);
      }, 4000);
      setResetTimer(timer);
    } else {
      if (resetTimer) clearTimeout(resetTimer);
      setConfirmReset(false);
      if (onResetProgress) {
        onResetProgress();
      }
    }
  };

  const handleQuit = () => {
    soundEngine.playUIClick();
    if (window.close) {
      window.close();
    }
  };

  return (
    <div className="home-overlay">
      {/* Top Bar: Player Loadout & Currency Profile */}
      <div className="home-top-bar">
        <div className="player-profile-card">
          <div
            className="player-avatar-circle"
            style={{
              background: savedData.playerColor || '#00ff00',
              boxShadow: `0 0 14px ${savedData.playerColor || '#00ff00'}`
            }}
          >
            {currentHatObj ? currentHatObj.icon : activeHero.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>
              Level {highestLevel} Explorer
            </div>
            <div style={{ fontSize: '12px', color: '#8da2be' }}>
              Hero: <strong style={{ color: '#00f0ff' }}>{activeHero.name}</strong> · Pet: {currentPetObj ? `${currentPetObj.icon} ${currentPetObj.name}` : 'None'}
            </div>
          </div>
        </div>

        {/* Currency & Trophies */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="stat-pill">
            <span>🪙</span>
            <span>{savedData.totalCoins}</span>
          </div>
          <div
            className="stat-pill"
            style={{ color: '#00f0ff' }}
          >
            <span>🏆</span>
            <span>{unlockedAchievementsCount} Badges</span>
          </div>
        </div>
      </div>

      {/* Center Content: Translucent Frosted Glass Card */}
      <div className="home-center-content">
        <div className="home-center-card">
          <div className="home-logo-container">
            <div className="home-crystal-badge">
              {(savedData.activeTheme || 'default') === 'girls' ? '🌸' : '💎'}
            </div>
            <h1 className={`home-title ${(savedData.activeTheme || 'default') === 'girls' ? 'game-title-glow' : ''}`}>
              {(savedData.activeTheme || 'default') === 'girls' ? 'MAGICAL STAR · DREAM' : 'CRYSTAL COLLECTOR'}
            </h1>
            <div style={{ fontSize: '12px', fontWeight: 700, color: (savedData.activeTheme || 'default') === 'girls' ? '#ffb7eb' : '#7e95b3', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase' }}>
              {(savedData.activeTheme || 'default') === 'girls' ? '✨ ENCHANTED CELESTIAL REALM · FAIRY ADVENTURE 💖' : 'NEO-ARCADE 3D PLATFORMER · PROCEDURAL BIOMES'}
            </div>
          </div>

          {/* Girls Theme / Cyberpunk Switcher (Unlocked via 'iloverue') */}
          {savedData.unlockedGirlsTheme && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div
                className="theme-toggle-pill"
                onClick={() => {
                  soundEngine.playUIClick();
                  const nextTheme = (savedData.activeTheme || 'default') === 'girls' ? 'default' : 'girls';
                  if (setSavedData) setSavedData(prev => ({ ...prev, activeTheme: nextTheme }));
                }}
              >
                <div className={`theme-toggle-option ${(savedData.activeTheme || 'default') !== 'girls' ? 'active-cyber' : ''}`}>
                  ⚡ CYBERPUNK
                </div>
                <div className={`theme-toggle-option ${(savedData.activeTheme || 'default') === 'girls' ? 'active-girls' : ''}`}>
                  🌸 GIRLS THEME
                </div>
              </div>
            </div>
          )}

          {/* Difficulty Quick Toggle */}
          {/* 3-Tier Difficulty Switch */}
          <div className="home-difficulty-container">
            <div className="home-diff-switch">
              <button
                className={`home-diff-btn ${(savedData.difficulty || 'medium') === 'easy' ? 'active-easy' : ''}`}
                onMouseEnter={handleHover}
                onClick={() => {
                  soundEngine.playUIClick();
                  if (onToggleDifficulty) onToggleDifficulty('easy');
                  else if (setSavedData) setSavedData(prev => ({ ...prev, difficulty: 'easy' }));
                }}
              >
                🟢 EASY
              </button>
              <button
                className={`home-diff-btn ${(savedData.difficulty || 'medium') === 'medium' ? 'active-medium' : ''}`}
                onMouseEnter={handleHover}
                onClick={() => {
                  soundEngine.playUIClick();
                  if (onToggleDifficulty) onToggleDifficulty('medium');
                  else if (setSavedData) setSavedData(prev => ({ ...prev, difficulty: 'medium' }));
                }}
              >
                🟡 MEDIUM
              </button>
              <button
                className={`home-diff-btn ${(savedData.difficulty || 'medium') === 'hard' ? 'active-hard' : ''}`}
                onMouseEnter={handleHover}
                onClick={() => {
                  soundEngine.playUIClick();
                  if (onToggleDifficulty) onToggleDifficulty('hard');
                  else if (setSavedData) setSavedData(prev => ({ ...prev, difficulty: 'hard' }));
                }}
              >
                ⚡ HARD
              </button>
            </div>
            <span
              className="home-diff-hint"
              style={{
                color: (savedData.difficulty || 'medium') === 'easy'
                  ? '#00ff88'
                  : ((savedData.difficulty || 'medium') === 'medium' ? '#ffd700' : '#ff4d6d')
              }}
            >
              {(savedData.difficulty || 'medium') === 'easy' && '🛡️ No Spiders · More Sentinel Cubes · Relaxed Patrol Speed'}
              {(savedData.difficulty || 'medium') === 'medium' && '⚖️ Few Spiders · More Sentinel Cubes · Balanced Speed'}
              {(savedData.difficulty || 'medium') === 'hard' && '🔥 Maximum Arcade Rush · Aggressive Predators & Dense Sky Mines'}
            </span>
          </div>

          {/* Action Hub - Semi-Transparent Glass Buttons */}
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

            <div className="home-btn-grid-4">
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
              <button
                className="home-btn-solid"
                onMouseEnter={handleHover}
                onClick={() => handleClick(onOpenAbout)}
              >
                ℹ️ ABOUT
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                className="home-btn-solid"
                style={{
                  flex: 1,
                  background: confirmReset ? 'rgba(56, 10, 20, 0.75)' : 'rgba(20, 18, 26, 0.65)',
                  borderColor: confirmReset ? '#ff0055' : 'rgba(255, 255, 255, 0.12)',
                  color: confirmReset ? '#ff4d6d' : '#a78bfa',
                  fontSize: '13px',
                  padding: '10px 12px'
                }}
                onMouseEnter={handleHover}
                onClick={handleResetClick}
              >
                {confirmReset ? '⚠️ SURE? CLICK TO RESET' : '🔄 RESET PROGRESS'}
              </button>
              <button
                className="home-btn-solid exit-btn"
                style={{ flex: 1 }}
                onMouseEnter={handleHover}
                onClick={handleQuit}
              >
                ❌ EXIT GAME
              </button>
            </div>
          </div>
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
