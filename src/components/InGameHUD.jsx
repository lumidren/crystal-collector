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
  fps = 60,
  spawnGraceTime = 0,
  elapsedTime = 0,
  isPaused = false,
  onPause,
  onOpenShop,
  onOpenAchievements,
  onOpenGuide
}) => {
  const baseMaxHearts = savedData?.upgrades?.maxHearts || 3;
  const totalDisplaySlots = Math.max(baseMaxHearts, hearts);
  const maxStamina = savedData?.upgrades?.maxStamina || 100;
  const biomeData = BiomeGenerator.getBiomeData(level);
  const progressPercent = Math.min(100, Math.round((score / targetCrystals) * 100));

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00.0';
    const totalSecs = Math.floor(secs);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const ms = Math.round((secs - totalSecs) * 10) % 10;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#00f0ff' }}>
              {level === 10 ? '👑 LEVEL 10: CRYSTAL TITAN' : `LEVEL ${level}: ${biomeData.name.toUpperCase()}`}
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                letterSpacing: '0.5px',
                background: (savedData?.difficulty || 'medium') === 'easy'
                  ? 'rgba(0, 255, 136, 0.18)'
                  : ((savedData?.difficulty || 'medium') === 'medium' ? 'rgba(255, 215, 0, 0.18)' : 'rgba(255, 0, 85, 0.18)'),
                color: (savedData?.difficulty || 'medium') === 'easy'
                  ? '#00ff88'
                  : ((savedData?.difficulty || 'medium') === 'medium' ? '#ffd700' : '#ff4d6d'),
                border: (savedData?.difficulty || 'medium') === 'easy'
                  ? '1px solid #00ff88'
                  : ((savedData?.difficulty || 'medium') === 'medium' ? '1px solid #ffd700' : '1px solid #ff0055')
              }}
            >
              {(savedData?.difficulty || 'medium') === 'easy' && '🟢 EASY'}
              {(savedData?.difficulty || 'medium') === 'medium' && '🟡 MEDIUM'}
              {(savedData?.difficulty || 'medium') === 'hard' && '⚡ HARD'}
            </span>
          </div>

          {/* Hearts Display */}
          <div style={{ fontSize: '20px', margin: '4px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px' }}>
            {totalDisplaySlots <= 8 ? (
              [...Array(totalDisplaySlots)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    opacity: i < hearts ? 1 : 0.22,
                    filter: i < hearts ? 'drop-shadow(0 0 6px #ff3366)' : 'none',
                    marginRight: '2px',
                    lineHeight: '1'
                  }}
                  title={i >= baseMaxHearts ? 'Bonus Heart' : 'Vital Heart'}
                >
                  ❤️
                </span>
              ))
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ filter: 'drop-shadow(0 0 8px #ff3366)', fontSize: '22px' }}>❤️</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#ff4d6d', textShadow: '0 0 8px rgba(255, 51, 102, 0.6)' }}>
                  × {hearts}
                </span>
              </div>
            )}
            {hearts > baseMaxHearts && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#ff4d6d',
                  background: 'rgba(255, 51, 102, 0.18)',
                  border: '1px solid rgba(255, 51, 102, 0.4)',
                  borderRadius: '8px',
                  padding: '1px 6px',
                  marginLeft: '4px',
                  letterSpacing: '0.5px',
                  textShadow: '0 0 6px rgba(255, 51, 102, 0.5)'
                }}
              >
                +{hearts - baseMaxHearts} EXTRA
              </span>
            )}
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

        {/* Top-Center: Goal Progress Bar or Level 10 Titan Gauntlet Tracker */}
        <div className={`hud-progress-meter ${level === 10 ? 'boss-progress-meter' : ''}`}>
          {level === 10 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#ff4d6d', letterSpacing: '0.5px' }}>
                  👑 BOSS PROTOCOL: THE CRYSTAL TITAN
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: (bossState?.pylonsDeactivated || 0) >= 4 ? '#00ff88' : '#ffd700' }}>
                  {(bossState?.pylonsDeactivated || 0) >= 4 ? 'SHIELD DESTROYED 💥' : `${bossState?.pylonsDeactivated || 0} / 4 BEACONS SHUT DOWN`}
                </span>
              </div>

              <div className="progress-track" style={{ height: '10px', marginBottom: '8px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${((bossState?.pylonsDeactivated || 0) / 4) * 100}%`,
                    background: (bossState?.pylonsDeactivated || 0) >= 4 ? 'linear-gradient(90deg, #00ff88, #00f0ff)' : 'linear-gradient(90deg, #ff0055, #ffd700)'
                  }}
                />
              </div>

              {/* 4 Corner Pylon Beacon Cards */}
              {(bossState?.pylonsDeactivated || 0) < 4 ? (
                <div className="boss-pylons-grid">
                  {[
                    { id: 0, label: '↖️ NW Beacon' },
                    { id: 1, label: '↘️ SE Beacon' },
                    { id: 2, label: '↙️ SW Beacon' },
                    { id: 3, label: '↗️ NE Beacon' }
                  ].map(p => {
                    const isSecured = bossState?.pylons ? bossState.pylons[p.id]?.activated : p.id < (bossState?.pylonsDeactivated || 0);
                    return (
                      <div
                        key={p.id}
                        className={`boss-pylon-pill ${isSecured ? 'pylon-secured' : 'pylon-pending'}`}
                      >
                        <span className="pylon-name">{p.label}</span>
                        <span className="pylon-status">{isSecured ? '✓ SECURED' : '⚡ STEP ON PAD'}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="boss-victory-prompt">
                  🌟 SHIELD DOWN! SPRINT TO THE CENTER & TOUCH THE GOLDEN MASTER CRYSTAL! 🏆
                </div>
              )}

              {/* Step-by-Step Instructions Bar */}
              <div className="boss-hint-bar">
                {(bossState?.pylonsDeactivated || 0) < 4 ? (
                  <span>
                    💡 <strong>HOW TO WIN:</strong> Look for the <strong>tall blue light beams</strong> in the 4 corners. Run to each corner and <strong>step inside the glowing floor circle</strong>! Jump (<kbd className="keycap">Space</kbd>) over expanding shockwaves!
                  </span>
                ) : (
                  <span style={{ color: '#00ff88', fontWeight: 800 }}>
                    🎉 <strong>FINAL STEP:</strong> Run to the giant golden beam in the center to collect the crystal and beat the game!
                  </span>
                )}
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

        {/* Top-Right: Coins, Combo, Timer, Quick Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {spawnGraceTime > 0 && (
              <div className="spawn-shield-badge">
                🛡️ SPAWN SHIELD {spawnGraceTime.toFixed(1)}s
              </div>
            )}
            <div className="timer-badge">
              <span>⏱️</span>
              <span>{formatTime(elapsedTime)}</span>
            </div>
            {savedData.showFPS !== false && (
              <div className={`fps-badge ${fps < 45 ? 'warning' : ''}`}>
                <span>{fps >= 58 ? '🟢' : '🟡'}</span>
                <span>{fps} FPS</span>
              </div>
            )}
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
              onClick={() => handleClick(onOpenGuide)}
              style={{ padding: '8px 12px', fontSize: '13px' }}
              title="Field Manual & Codex"
            >
              📖
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
      <div
        className="hud-interactive"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          zIndex: 85
        }}
      >
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
