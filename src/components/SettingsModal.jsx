import React from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const SettingsModal = ({ savedData, setSavedData, onClose }) => {
  const handleHover = () => soundEngine.playUIHover();
  const handleClick = (action) => {
    soundEngine.playUIClick();
    if (action) action();
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all saved coins, hats, pets, and unlocked levels? This cannot be undone.')) {
      soundEngine.playUIClick();
      localStorage.removeItem('crystal_collector_2_save');
      window.location.reload();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow" style={{ padding: '35px', maxWidth: '480px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#00f0ff', letterSpacing: '1px' }}>
            ⚙️ SETTINGS & AUDIO
          </h2>
          <button
            className="hud-btn btn-secondary"
            onClick={() => handleClick(onClose)}
            style={{ padding: '6px 14px', borderRadius: '10px' }}
          >
            ✖ CLOSE
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
          {/* Music Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span>🎵 Synthwave BGM Volume</span>
              <span style={{ color: '#00f0ff', fontWeight: 700 }}>{Math.round(savedData.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={savedData.musicVolume}
              onChange={e => setSavedData(prev => ({ ...prev, musicVolume: parseFloat(e.target.value) }))}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span>🔊 Sound FX Volume</span>
              <span style={{ color: '#00f0ff', fontWeight: 700 }}>{Math.round(savedData.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={savedData.sfxVolume}
              onChange={e => {
                setSavedData(prev => ({ ...prev, sfxVolume: parseFloat(e.target.value) }));
                soundEngine.playCollect();
              }}
            />
          </div>

          {/* Mouse Sensitivity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span>🖱️ Mouse Sensitivity</span>
              <span style={{ color: '#ffd700', fontWeight: 700 }}>
                {Math.round(((savedData.sensitivity || 0.003) / 0.003) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.008"
              step="0.0005"
              value={savedData.sensitivity || 0.003}
              onChange={e => setSavedData(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="hud-btn btn-secondary"
            style={{ color: '#ff4d6d', borderColor: 'rgba(255, 77, 109, 0.3)', width: '100%', padding: '10px' }}
            onMouseEnter={handleHover}
            onClick={handleResetData}
          >
            ⚠️ RESET PROGRESS DATA
          </button>

          <button
            className="hud-btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            onMouseEnter={handleHover}
            onClick={() => handleClick(onClose)}
          >
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
