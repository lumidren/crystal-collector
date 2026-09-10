import React from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const ScoreboardModal = ({
  level,
  score,
  targetCrystals,
  coins,
  totalCoins,
  elapsedTime = 0,
  maxCombo = 1,
  damageTaken = 0,
  heartsRemaining = 1,
  isBestTime = false,
  bestTime = null,
  onNextLevel,
  onRetry,
  onMainMenu
}) => {
  // Par times per level (in seconds)
  const parTimes = [35, 40, 48, 55, 65, 72, 80, 88, 95, 120];
  const par = parTimes[level - 1] || 60;

  // Grade calculation
  let rank = 'C';
  let rankTitle = '🛡️ SURVIVOR C-RANK';
  let rankDesc = 'You made it through, but the hazards took a toll. Aim for fewer hits!';

  if (damageTaken === 0 && (elapsedTime <= par || maxCombo >= 4)) {
    rank = 'S';
    rankTitle = '🌟 LEGENDARY S-RANK!';
    rankDesc = 'Flawless precision! Incredible speed, zero damage, and supreme combo mastery!';
  } else if (damageTaken <= 1 && (elapsedTime <= par * 1.3 || maxCombo >= 3)) {
    rank = 'A';
    rankTitle = '💎 MASTER A-RANK';
    rankDesc = 'High-velocity performance with sharp reflexes across the biome!';
  } else if (damageTaken <= 2 || heartsRemaining >= 2) {
    rank = 'B';
    rankTitle = '⚡ ADEPT B-RANK';
    rankDesc = 'Good run! Shave off a few seconds and dodge hazards to unlock S-Rank.';
  }

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00.0';
    const totalSecs = Math.floor(secs);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const ms = Math.round((secs - totalSecs) * 10) % 10;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handleNext = () => {
    soundEngine.playUIClick();
    if (onNextLevel) onNextLevel();
  };

  const handleRetry = () => {
    soundEngine.playUIClick();
    if (onRetry) onRetry();
  };

  const handleMenu = () => {
    soundEngine.playUIClick();
    if (onMainMenu) onMainMenu();
  };

  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow scoreboard-modal">
        <div style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
          {level === 10 ? '👑 APEX CONQUEST COMPLETE' : `LEVEL ${level} MISSION DEBRIEF`}
        </div>

        {/* Big Animated Rank Letter */}
        <div className="rank-badge-container">
          <div className={`rank-badge rank-${rank.toLowerCase()}`}>
            {rank}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: rank === 'S' ? '#ffd700' : rank === 'A' ? '#00f0ff' : '#ffffff' }}>
            {rankTitle}
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', maxWidth: '420px', lineHeight: 1.4 }}>
            {rankDesc}
          </div>
        </div>

        {/* 4-Card Performance Stats Grid */}
        <div className="scoreboard-grid">
          <div className="stat-grid-card">
            <div className="stat-label">⏱️ Clear Time</div>
            <div className="stat-val">
              {formatTime(elapsedTime)}
              {isBestTime && <span className="new-record-pill">NEW RECORD!</span>}
            </div>
            {bestTime && (
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                Personal Best: {formatTime(bestTime)}
              </div>
            )}
          </div>

          <div className="stat-grid-card">
            <div className="stat-label">🔥 Max Combo Streak</div>
            <div className="stat-val" style={{ color: maxCombo > 1 ? '#ff8800' : '#ffffff' }}>
              {maxCombo}x Streak
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
              Multiplier Bonus
            </div>
          </div>

          <div className="stat-grid-card">
            <div className="stat-label">💖 Damage Sustained</div>
            <div className="stat-val" style={{ color: damageTaken === 0 ? '#00ff88' : '#ff4466' }}>
              {damageTaken === 0 ? 'Flawless (0 Hits)' : `${damageTaken} Hit${damageTaken > 1 ? 's' : ''}`}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
              {heartsRemaining} Heart{heartsRemaining > 1 ? 's' : ''} Remaining
            </div>
          </div>

          <div className="stat-grid-card">
            <div className="stat-label">🪙 Spoils & Bounty</div>
            <div className="stat-val" style={{ color: '#ffd700' }}>
              +{coins} Coins
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
              Total Bank: {totalCoins} 🪙
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {level < 10 ? (
            <button
              className="hud-btn btn-primary"
              onClick={handleNext}
              style={{ padding: '16px', fontSize: '19px', fontWeight: 800, letterSpacing: '1px' }}
            >
              PROCEED TO LEVEL {level + 1} ➡️
            </button>
          ) : (
            <div style={{ color: '#ffd700', fontWeight: 900, fontSize: '18px', padding: '10px 0' }}>
              🎉 SUPREME CHAMPION! YOU CLEARED ALL 10 LEVELS!
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="hud-btn btn-accent"
              onClick={handleRetry}
              style={{ flex: 1, padding: '12px', fontSize: '15px' }}
            >
              🔁 RETRY FOR S-RANK
            </button>
            <button
              className="hud-btn btn-secondary"
              onClick={handleMenu}
              style={{ flex: 1, padding: '12px', fontSize: '15px' }}
            >
              🏠 MAIN MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
