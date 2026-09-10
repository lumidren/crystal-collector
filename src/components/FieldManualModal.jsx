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
            💎 Collectibles
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'skyislands' ? 'active' : ''}`}
            onClick={() => handleTab('skyislands')}
          >
            🏝️ Sky Islands & 3D
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => handleTab('radar')}
          >
            📡 Holographic Radar
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
            onClick={() => handleTab('pets')}
          >
            🐕 Cyber Pets
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'powerups' ? 'active' : ''}`}
            onClick={() => handleTab('powerups')}
          >
            ⚡ Power-Ups
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'hazards' ? 'active' : ''}`}
            onClick={() => handleTab('hazards')}
          >
            ⚠️ Hazards
          </button>
          <button
            className={`shop-tab-btn ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => handleTab('controls')}
          >
            🎮 Controls
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

          {activeTab === 'skyislands' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>🗺️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00f0ff' }}>Expanded 76×76 World & 5 Unique Biome Layouts</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    The world has expanded by <strong>2.3x (5,776 m²)</strong>! Every biome now features a completely custom, handcrafted architectural layout:
                    <br />• <strong>🌿 Forest Valley</strong>: Redwood canopy treehouses (3.7m & 5.5m), wooden suspension bridges, and bouncy mushroom pads.
                    <br />• <strong>🔮 Crystal Cavern</strong>: Subterranean canyon catwalks (4.3m & 5.7m), glowing arch bridges, and luminescent stalactite decks.
                    <br />• <strong>❄️ Frozen Tundra</strong>: A massive 3-tier stepped <strong>Glacier Summit (up to 9.0m)</strong> and corner ice shelf outposts.
                    <br />• <strong>🌋 Volcanic Caldera</strong>: A concentric ring of fire with a central fortress island (5.0m), perimeter ramparts, and basalt stepping stones crossing a lava moat.
                    <br />• <strong>🌌 Cosmic Void & Titan Colosseum</strong>: Shattered orbital docks (up to 10.9m) and elevated defense towers housing the Boss Shield Pylons!
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700' }}>🚀</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffd700' }}>Trampoline Super-Launch</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Step onto ground trampolines to trigger a super-boost high into the sky! Combine with your <strong>Spacebar Double Jump</strong> to cross high skyways and reach apex peaks.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00ff88' }}>🛡️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00ff88' }}>High-Altitude Hazard Immunity</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Elevated islands provide tactical high ground. While stationed on sky platforms, you are completely safe above ground lava pools and roaming red hazard cubes!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'radar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>📡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00f0ff' }}>55m Holographic Scanner</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Mounted in the bottom-left HUD. The radar sweeps 360° every 2.5s with phosphorus fade trails, tracking all items and threats across the expanded 76x76 arena within 55 meters. Orienting dynamically so your character forward is always <strong>UP</strong>.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 255, 0.15)', color: '#ff00ff' }}>▲</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff00ff' }}>Elevation Altitude Markers</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Crystals situated atop high sky islands display an elevated <strong>(^)</strong> marker on the radar screen, indicating they are above ground level.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 51, 68, 0.15)', color: '#ff3344' }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff3344' }}>Target Blip Legend</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    • <strong style={{ color: '#00f0ff' }}>Cyan Diamond</strong>: Crystal objective<br />
                    • <strong style={{ color: '#ffd700' }}>Gold Dot</strong>: Bankable Gold Coin<br />
                    • <strong style={{ color: '#ffe600' }}>Yellow Ring</strong>: Trampoline Launch Pad<br />
                    • <strong style={{ color: '#ff3344' }}>Red Diamond/Zone</strong>: Moving Hazard Cube or Lava Pool<br />
                    • <strong style={{ color: '#ff0055' }}>Crimson Skull & Nodes</strong>: Titan Boss & Corner Shield Pylons
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00' }}>🐕</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffaa00' }}>Cyber Dog (Robo-Pup Companion)</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    A loyal 4-legged robotic companion! Follows right beside you with animated running legs, a wagging antenna tail, glowing visor, and an industry-leading <strong>11-meter fetch reach</strong> that pulls crystals and coins directly to you!
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>🦅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00f0ff' }}>Cyber Falcon</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Aerodynamic mechanical avian scout with animated flapping wings, banking aerial turns, and a <strong>9-meter magnetic suction radius</strong>.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 102, 0.15)', color: '#ff0066' }}>🛸</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff0066' }}>Drones, Pixies & Sprites</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Equip Cyber Drone (6m), Magic Pixie (8m), or Fire Sprite (10m) from the Arcade Shop to suit your playstyle.
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
                <div className="manual-card-icon" style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00ff88' }}>🎮</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#00ff88' }}>Difficulty Modes (Easy vs Hard)</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Toggle anytime from the <strong>Home Screen</strong> or <strong>Settings</strong>:
                    <br />• <strong style={{ color: '#00ff88' }}>🟢 Easy Mode</strong>: Disables all aerial sky mines, disables hunter seeker homing, lowers obstacle count and reduces speed for relaxed exploration.
                    <br />• <strong style={{ color: '#ff4d6d' }}>⚡ Hard Mode</strong>: Full arcade intensity with Hunter Seekers tracking your ground location, Sky Mines patrolling bridges, and high-speed swarms!
                  </div>
                </div>
              </div>

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
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 51, 0.15)', color: '#ff0033' }}>🎯</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff0033' }}>Hunter Interceptor Drones</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Sleek stealth drones with forward laser target sights and dual plasma afterburners! In Hard mode, entering their <strong>24m detection radius</strong> causes them to lock on and pursue aggressively. Jump onto elevated sky platforms to break their lock!
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00' }}>🛸</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffaa00' }}>Anti-Grav Quantum Sky Mines</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Naval magnetic dread-mines equipped with 6 detonation spires, dual counter-rotating gyro rings, and a flashing warning beacon. Patrols elevated sky bridges in Hard mode.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 0, 68, 0.15)', color: '#ff0044' }}>🟥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff0044' }}>Quantum Sentinel Cubes</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Segmented obsidian armor exoskeleton encasing a spinning, pulsing magma plasma core with glowing warning chevrons. Bounces off perimeter boundaries.
                  </div>
                </div>
              </div>

              <div className="manual-card">
                <div className="manual-card-icon" style={{ background: 'rgba(255, 68, 0, 0.15)', color: '#ff4400' }}>🔥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ff4400' }}>Molten Lava Pools</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Glowing hazard zones on the arena floor. Stepping inside deals rapid burn damage. Elevated players on sky islands or basalt stepping stones are immune.
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
