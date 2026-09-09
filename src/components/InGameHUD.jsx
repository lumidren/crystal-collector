import React from 'react';
import { BiomeGenerator } from '../world/biomeGenerator.js';
import { soundEngine } from '../audio/soundEngine.js';

export const InGameHUD = ({
  level,
  score,
  targetCrystals,
  coins,
  savedData,
  hearts,
  stamina,
  combo,
  shieldTime,
  magnetTime,
  slowMoTime,
  feverTime,
  bossState,
  onPause,
  onOpenShop,
  onOpenAchievements
}) => {
  const maxHearts = savedData.upgrades?.maxHearts || 3;
  const maxStamina = savedData.upgrades?.maxStamina || 100;
  const biomeData = BiomeGenerator.getBiomeData(level);
  const progressPercent = Math.min(100, Math.round((score / targetCrystals) * 100));

  const handleHover = () => soundEngine.playUIHover();
  const handleClick = (action) => {
    soundEngine.playUIClick();
    if (action) action();
  };

  return (
    <div className="hud-container">
      {/* Aiming Reticle in Center */}
      <div className="aim-reticle" />

      {/* Top Bar */}
      <div className="hud-top-bar hud-interactive">
        {/* Top-Left: Level info, Hearts, Stamina */}
        <div className="hud-panel" style={{ padding: '14px 18px', minWidth: '220px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#00f0ff', marginBottom: '4px' }}>
            {level === 10 ? '👑 LEVEL 10: CRYSTAL TITAN' : `LEVEL ${level}: ${biomeData.name.toUpperCase()}`}
          </div>

          {/* Hearts Display */}
          <div style={{ fontSize: '22px', margin: '4px 0' }}>
            {[...Array(maxHearts)].map((_, i) => (
              <span key={i} style={{ opacity: i < hearts ? 1 : 0.25, filter: i < hearts ? 'drop-shadow(0 0 6px #ff3366)' : 'none', marginRight: '4px' }}>
                ❤️
              </span>
            ))}
          </div>

          {/* Stamina Bar */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8fa0b5', marginBottom: '2px', fontWeight: 700 }}>
              <span>⚡ STAMINA</span>
              <span>{Math.round(stamina)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(stamina / maxStamina) * 100}%`,
                  height: '100%',
                  background: feverTime > 0 ? 'linear-gradient(90deg, #ff00ff, #00ffff)' : stamina > 30 ? 'linear-gradient(90deg, #00ff88, #00f0ff)' : '#ff3344',
                  boxShadow: stamina > 30 ? '0 0 8px #00ff88' : '0 0 8px #ff3344',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
          </div>
        </div>

        {/* Top-Center: Goal Progress Bar */}
        <div className="hud-progress-meter">
          {level === 10 ? (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ff4d6d' }}>
                🛡️ TITAN SHIELD PYLONS: {bossState?.pylonsDeactivated || 0} / 4
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((bossState?.pylonsDeactivated || 0) / 4) * 100}%`,
                    background: 'linear-gradient(90deg, #ff0055, #ffd700)'
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#ffd700', marginTop: '4px' }}>
                {(bossState?.pylonsDeactivated || 0) >= 4 ? '🔥 SHIELD DOWN! GRAB THE MASTER CRYSTAL!' : 'Deactivate 4 corner pylons!'}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#e0e6ed', display: 'flex', justifyContent: 'space-between' }}>
                <span>💎 CRYSTALS GOAL</span>
                <span style={{ color: '#00f0ff' }}>{score} / {targetCrystals}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Top-Right: Coins, Combo, Quick Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {combo > 1 && (
              <div className="combo-badge">
                🔥 {combo}x COMBO!
              </div>
            )}
            <div className="stat-pill" style={{ fontSize: '16px', padding: '6px 14px' }}>
              <span>🪙</span>
              <span>{savedData.totalCoins}</span>
              {coins > 0 && <span style={{ color: '#00ff88', fontSize: '12px' }}>+{coins}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="hud-btn btn-accent"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenShop)}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              🛒 SHOP
            </button>
            <button
              className="hud-btn btn-secondary"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onOpenAchievements)}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              🏆
            </button>
            <button
              className="hud-btn btn-secondary"
              onMouseEnter={handleHover}
              onClick={() => handleClick(onPause)}
              style={{ padding: '8px 14px', fontSize: '13px', borderColor: 'rgba(0, 240, 255, 0.3)' }}
            >
              ⏸️ PAUSE
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Left: Power-up Timers */}
      <div className="hud-interactive" style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {shieldTime > 0 && (
          <div className="powerup-pill" style={{ background: 'rgba(0, 240, 255, 0.2)', border: '1px solid #00f0ff', color: '#00f0ff' }}>
            🛡️ SHIELD {Math.ceil(shieldTime)}s
          </div>
        )}
        {magnetTime > 0 && (
          <div className="powerup-pill" style={{ background: 'rgba(255, 0, 102, 0.2)', border: '1px solid #ff0066', color: '#ff66aa' }}>
            🧲 MAGNET {Math.ceil(magnetTime)}s
          </div>
        )}
        {slowMoTime > 0 && (
          <div className="powerup-pill" style={{ background: 'rgba(255, 215, 0, 0.2)', border: '1px solid #ffd700', color: '#ffd700' }}>
            ⏳ SLOW-MO {Math.ceil(slowMoTime)}s
          </div>
        )}
        {feverTime > 0 && (
          <div className="powerup-pill fever-active" style={{ background: 'rgba(255, 0, 255, 0.25)', border: '1px solid #ff00ff', color: '#fff' }}>
            🌈 FEVER MODE {Math.ceil(feverTime)}s
          </div>
        )}
      </div>

      {/* Bottom-Right: Key Hints */}
      <div
        className="hud-panel"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '8px 14px',
          fontSize: '12px',
          color: '#8fa0b5',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <span><kbd className="keycap">WASD</kbd> Move</span>
        <span><kbd className="keycap">Space</kbd> Double Jump 🪶</span>
        <span><kbd className="keycap">Shift</kbd> Sprint</span>
        <span><kbd className="keycap">Esc</kbd> Pause</span>
      </div>
    </div>
  );
};
