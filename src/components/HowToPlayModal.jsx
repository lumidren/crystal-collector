import React from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const HowToPlayModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow" style={{ padding: '30px', maxWidth: '680px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#00f0ff', letterSpacing: '1px' }}>
              📖 HOW TO PLAY & CONTROLS
            </h2>
            <div style={{ fontSize: '13px', color: '#8fa0b5', marginTop: '4px' }}>
              Master movement, aerial platforming, and guardian boss tactics
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

        {/* Controls Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#ffd700', fontSize: '16px', margin: '0 0 12px', letterSpacing: '0.5px' }}>
            🎮 CORE CONTROLS
          </h3>
          <div className="guide-row">
            <span>Move Character</span>
            <div>
              <kbd className="keycap">W</kbd>
              <kbd className="keycap">A</kbd>
              <kbd className="keycap">S</kbd>
              <kbd className="keycap">D</kbd>
            </div>
          </div>
          <div className="guide-row">
            <span>Sprint (Consumes Stamina ⚡)</span>
            <div><kbd className="keycap">Shift</kbd> (Hold)</div>
          </div>
          <div className="guide-row">
            <span>Jump</span>
            <div><kbd className="keycap">Space</kbd></div>
          </div>
          <div className="guide-row">
            <span>Mid-Air Double Jump 🪶</span>
            <div><kbd className="keycap">Space</kbd> (Tap while airborne)</div>
          </div>
          <div className="guide-row">
            <span>Look / Orbit Camera</span>
            <div><strong>Mouse Move</strong> (Click canvas to lock cursor)</div>
          </div>
          <div className="guide-row">
            <span>Zoom Camera Distance</span>
            <div><strong>Mouse Scroll Wheel</strong></div>
          </div>
          <div className="guide-row">
            <span>Pause Game & Settings</span>
            <div><kbd className="keycap">Esc</kbd> or <kbd className="keycap">P</kbd></div>
          </div>
        </div>

        {/* Mechanics Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#00f0ff', fontSize: '16px', margin: '0 0 12px', letterSpacing: '0.5px' }}>
            🚀 PLATFORMING MECHANICS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🟡 Trampoline Jump Pads</div>
              <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.4 }}>
                Step onto glowing golden pads to launch high into the sky and reach floating crystals and bonus coins!
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥 Hazards & Lava Pools</div>
              <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.4 }}>
                Avoid bubbling molten lava pools and spikes. Touching hazard surfaces inflicts damage and heart loss.
              </div>
            </div>
          </div>
        </div>

        {/* Boss Tactics Section */}
        <div style={{ background: 'rgba(255,51,68,0.1)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,51,68,0.3)' }}>
          <div style={{ color: '#ff4d6d', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
            👾 LEVEL 10 GUARDIAN BOSS STRATEGY
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
            1. <strong>Dodge Sweeping Lasers</strong>: Keep moving and time your jumps over the ground shockwave rings.<br />
            2. <strong>Deactivate 4 Power Pylons</strong>: Run to each corner pylon to shatter the Titan's forcefield.<br />
            3. <strong>Grab the Master Core Crystal</strong>: Once the shield collapses, collect the central core to claim victory!
          </div>
        </div>

        <button
          className="hud-btn btn-primary"
          onClick={() => { soundEngine.playUIClick(); onClose(); }}
          style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '16px' }}
        >
          READY TO PLAY! ▶️
        </button>
      </div>
    </div>
  );
};
