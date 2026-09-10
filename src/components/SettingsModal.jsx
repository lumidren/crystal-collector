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

          {/* Graphics Quality Preset */}
          <div>
            <div style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>✨ Graphics & Shadows Quality</span>
              <span style={{ color: '#00f0ff', fontWeight: 700 }}>{(savedData.graphicsQuality || 'ultra').toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ultra', 'high', 'performance'].map(q => (
                <button
                  key={q}
                  className={`graphics-preset-btn ${(savedData.graphicsQuality || 'ultra') === q ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playUIClick();
                    setSavedData(prev => ({ ...prev, graphicsQuality: q }));
                  }}
                >
                  {q === 'ultra' ? '🔥 ULTRA (60+ FPS)' : q === 'high' ? '⚡ HIGH' : '🚀 FAST'}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Mode Selector */}
          <div>
            <div style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>🎮 Game Difficulty</span>
              <span style={{ color: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : '#ff0055', fontWeight: 800 }}>
                {(savedData.difficulty || 'hard') === 'easy' ? '🟢 EASY (CHILL)' : '⚡ HARD (ARCADE)'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`graphics-preset-btn ${(savedData.difficulty || 'hard') === 'easy' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  borderColor: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : 'rgba(255,255,255,0.15)',
                  color: (savedData.difficulty || 'hard') === 'easy' ? '#00ff88' : '#8fa0b5'
                }}
                onClick={() => {
                  soundEngine.playUIClick();
                  setSavedData(prev => ({ ...prev, difficulty: 'easy' }));
                }}
              >
                🟢 EASY (NO MINES / RELAXED)
              </button>
              <button
                className={`graphics-preset-btn ${(savedData.difficulty || 'hard') === 'hard' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  borderColor: (savedData.difficulty || 'hard') === 'hard' ? '#ff0055' : 'rgba(255,255,255,0.15)',
                  color: (savedData.difficulty || 'hard') === 'hard' ? '#ff4d6d' : '#8fa0b5'
                }}
                onClick={() => {
                  soundEngine.playUIClick();
                  setSavedData(prev => ({ ...prev, difficulty: 'hard' }));
                }}
              >
                ⚡ HARD (FAST & SKY MINES)
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#8fa0b5', marginTop: '6px' }}>
              {(savedData.difficulty || 'hard') === 'easy'
                ? '✨ Easy Mode: Disables all aerial sky mines, lowers obstacle speed & density for relaxed exploration.'
                : '🔥 Hard Mode: Full arcade challenge with Sky Mines on bridges, higher obstacle counts, and max speeds.'}
            </div>
          </div>

          {/* Show FPS Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>📊 Show Real-Time FPS Counter</span>
            <button
              className={`graphics-preset-btn ${savedData.showFPS !== false ? 'active' : ''}`}
              style={{ flex: 'none', width: '90px' }}
              onClick={() => {
                soundEngine.playUIClick();
                setSavedData(prev => ({ ...prev, showFPS: prev.showFPS === false ? true : false }));
              }}
            >
              {savedData.showFPS !== false ? 'ON (60 FPS)' : 'OFF'}
            </button>
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
