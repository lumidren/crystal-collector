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
            <div className="home-crystal-badge">💎</div>
            <h1 className="home-title">CRYSTAL COLLECTOR</h1>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#7e95b3', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase' }}>
              NEO-ARCADE 3D PLATFORMER · PROCEDURAL BIOMES
            </div>
          </div>

          {/* Active Hero Capsule / Shortcut to Character Shop */}
          <div
            className="home-hero-capsule"
            title="Click to customize & switch Hero in the Arcade Shop"
            onClick={() => handleClick(onOpenShop)}
            onMouseEnter={handleHover}
          >
            <div className="home-hero-info">
              <span className="home-hero-icon">{activeHero.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div className="home-hero-name">
                  {activeHero.name} <span style={{ color: '#7e93ab', fontSize: '11px', fontWeight: 600 }}>({activeHero.title})</span>
                </div>
                <div className="home-hero-perk">{activeHero.perk}</div>
              </div>
            </div>
            <div className="home-hero-action">
              HEROES ➔
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
                🟢 EASY (MEDIUM)
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
                ? '🛡️ Balanced Challenge · Medium Speed · Tuned Predators & Sky Mines'
                : '🔥 Arcade Rush · Maximum Speed · Aggressive Predators & Dense Sky Mines'}
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
