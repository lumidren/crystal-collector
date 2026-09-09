import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const FieldManualModal = ({ onClose, isFirstTime = false }) => {
  const [activeTab, setActiveTab] = useState('objectives');

  const handleTab = (tab) => {
    soundEngine.playUIHover();
    setActiveTab(tab);
  };

  const handleClose = () => {
    soundEngine.playUIClick();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow field-manual-modal">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#00f0ff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            {isFirstTime ? '🔰 CADET ORIENTATION PROTOCOL' : '📖 EXPLORER FIELD MANUAL'}
          </div>
          <h1 style={{ margin: '6px 0 8px', fontSize: '32px', color: '#ffd700' }}>
            {isFirstTime ? 'WELCOME TO CRYSTAL COLLECTOR!' : 'COLLECTIBLES & TACTICS CODEX'}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
            Essential intel on collectibles, power-ups, survival tech, and high-score multipliers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className={`shop-tab-btn ${activeTab === 'objectives' ? 'active' : ''}`}
            onClick={() => handleTab('objectives')}
          >
            💎 Collectibles & Goals
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'powerups' ? 'active' : ''}`}
            onClick={() => handleTab('powerups')}
          >
            ⚡ Power-Up Orbs
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'hazards' ? 'active' : ''}`}
            onClick={() => handleTab('hazards')}
          >
            ⚠️ Hazards & Defense
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => handleTab('controls')}
          >
            🎮 Controls & Scoring
          </button>
        </div>

        {/* Tab Content */}
        <div className="manual-content-scroll">
          {activeTab === 'objectives' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>💎</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00f0ff' }}>Crystals (Primary Objective)</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Collect all required crystals to open the realm gate. Collecting crystals within <strong>2.5 seconds</strong> of each other builds a <strong>Combo Multiplier (up to 8x!)</strong>.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700' }}>🪙</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffd700' }}>Gold Coins (Arcade Currency)</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Permanent currency saved across runs. Spend banked coins in the <strong>Arcade Shop 2.0</strong> to unlock cyber skins, 3D hats, companion pets, and permanent stat upgrades.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 51, 102, 0.15)', color: '#ff3366' }}>❤️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff3366' }}>Floating Recovery Hearts</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Restores 1 lost heart when collected. Keep your health high to achieve prestigious <strong>S-Rank Flawless</strong> ratings on the final scoreboard!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'powerups' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="manual-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <div className="manual-card-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', margin: '0 auto 8px' }}>🛡️</div>
                <div style={{ fontWeight: 800, color: '#00ffff' }}>Energy Shield (10s)</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                  Complete damage immunity! Deflects bouncing obstacle cubes on contact.
                </div>
              </div>

              <div className="manual-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 85, 0.15)', margin: '0 auto 8px' }}>🧲</div>
                <div style={{ fontWeight: 800, color: '#ff0055' }}>Super Magnet (8s)</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                  Vacuums all crystals and coins within a 14-meter radius straight into your inventory.
                </div>
              </div>

              <div className="manual-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <div className="manual-card-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', margin: '0 auto 8px' }}>⏳</div>
                <div style={{ fontWeight: 800, color: '#ffd700' }}>Slow-Mo Orb (7s)</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                  Dilates time, slowing all hazards and bouncing cubes down by 60%.
                </div>
              </div>

              <div className="manual-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <div className="manual-card-icon" style={{ background: 'rgba(189, 0, 255, 0.15)', margin: '0 auto 8px' }}>🌈</div>
                <div style={{ fontWeight: 800, color: '#bd00ff' }}>Prism Fever Mode (6s)</div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                  Triggered by rainbow crystals: gives infinite sprint stamina, rainbow trails, and instant points!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hazards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00ff88' }}>🛡️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00ff88' }}>3-Second Spawn Grace Period</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Whenever you enter a level or retry, you gain <strong>3 seconds of 100% damage immunity</strong>. Use this window to orient yourself safely!
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 68, 0.15)', color: '#ff0044' }}>🟥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff0044' }}>Hazard Cubes</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Kinetic cubes that bounce off walls and accelerate each level. Jump over them or deflect them using your Energy Shield!
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 68, 0, 0.15)', color: '#ff4400' }}>🔥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff4400' }}>Molten Lava Pools</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Glowing hazard zones on the arena floor. Stepping inside deals rapid burn damage.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700' }}>🚀</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffd700' }}>Trampoline Jump Pads</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Step onto glowing gold launch pads to propel yourself sky-high toward elevated crystals and floating bonus hearts!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div className="manual-card" style={{ padding: '12px' }}>
                  <kbd className="keycap">W</kbd><kbd className="keycap">A</kbd><kbd className="keycap">S</kbd><kbd className="keycap">D</kbd>
                  <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 600 }}>Move Character</span>
                </div>
                <div className="manual-card" style={{ padding: '12px' }}>
                  <kbd className="keycap">Mouse</kbd>
                  <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 600 }}>Look / Rotate View</span>
                </div>
                <div className="manual-card" style={{ padding: '12px' }}>
                  <kbd className="keycap">Shift</kbd>
                  <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 600 }}>Sprint (Jetpack Thrusters)</span>
                </div>
                <div className="manual-card" style={{ padding: '12px' }}>
                  <kbd className="keycap">Space</kbd>
                  <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 600 }}>Jump + Double Jump</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffd700', marginBottom: '6px' }}>
                  🏆 How S-Rank Scoring Works:
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                  • <strong>S Rank (Legendary)</strong>: Complete the level in record time with 0 damage taken or high combo streaks.<br />
                  • <strong>A Rank (Master)</strong>: Swift completion with ≤ 1 hit taken.<br />
                  • <strong>B Rank (Adept)</strong>: Completed with moderate damage.<br />
                  • <strong>C Rank (Survivor)</strong>: Cleared with 1 heart remaining or slow pace.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
          <button
            className="hud-btn btn-primary"
            onClick={handleClose}
            style={{ padding: '15px 40px', fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}
          >
            {isFirstTime ? '🚀 READY TO PLAY! LAUNCH MISSION' : '✖ CLOSE FIELD MANUAL'}
          </button>
        </div>
      </div>
    </div>
  );
};
