import React from 'react';
import { BiomeGenerator } from '../world/biomeGenerator.js';
import { soundEngine } from '../audio/soundEngine.js';

export const LevelSelectModal = ({
  unlockedLevels = 1,
  onSelectLevel,
  onClose
}) => {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleHover = () => soundEngine.playUIHover();

  const handleSelect = (lvl) => {
    if (lvl <= unlockedLevels) {
      soundEngine.playUIClick();
      onSelectLevel(lvl);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow" style={{ padding: '30px', maxWidth: '780px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#00f0ff', letterSpacing: '1px' }}>
              🗺️ CAMPAIGN LEVEL SELECT
            </h2>
            <div style={{ fontSize: '13px', color: '#8fa0b5', marginTop: '4px' }}>
              Select an unlocked biome realm to jump into action
            </div>
          </div>
          <button
            className="hud-btn btn-secondary"
            onClick={() => { soundEngine.playUIClick(); onClose(); }}
            style={{ padding: '8px 16px', borderRadius: '10px' }}
          >
            ✖ CLOSE
          </button>
        </div>

        {/* Level Grid */}
        <div className="level-grid">
          {levels.map((lvl) => {
            const isUnlocked = lvl <= unlockedLevels;
            const isBoss = lvl === 10;
            const biomeData = BiomeGenerator.getBiomeData(lvl);

            return (
              <div
                key={lvl}
                className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isBoss ? 'boss' : ''}`}
                onMouseEnter={isUnlocked ? handleHover : undefined}
                onClick={() => handleSelect(lvl)}
                style={{ position: 'relative' }}
              >
                {isBoss && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '16px' }}>
                    👑
                  </div>
                )}

                <div style={{ fontSize: '28px', marginBottom: '6px' }}>
                  {isBoss ? '👾' : isUnlocked ? (lvl % 2 === 0 ? '🌲' : '💎') : '🔒'}
                </div>

                <div style={{ fontWeight: 800, fontSize: '16px', color: isUnlocked ? '#00f0ff' : '#64748b' }}>
                  LEVEL {lvl}
                </div>

                <div style={{ fontSize: '12px', color: '#ffd700', margin: '4px 0', fontWeight: 600 }}>
                  {isBoss ? 'THE TITAN' : biomeData.name}
                </div>

                <div style={{ fontSize: '11px', color: '#8fa0b5' }}>
                  {isBoss ? 'BOSS FIGHT' : `${8 + lvl * 2} 💎 Goal`}
                </div>

                <div style={{ marginTop: '10px' }}>
                  {isUnlocked ? (
                    <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 700, padding: '2px 8px', background: 'rgba(0,255,136,0.1)', borderRadius: '10px' }}>
                      {lvl < unlockedLevels ? '✓ CLEARED' : '▶ PLAY'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', color: '#8fa0b5', fontSize: '13px' }}>
          💡 Complete levels sequentially to unlock higher biomes and reach the Level 10 Guardian Boss!
        </div>
      </div>
    </div>
  );
};
