import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine.js';

export const AboutModal = ({ onClose, onUnlockRoot, unlockedLevels = 1 }) => {
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState(null); // null | 'success' | 'error'
  const isAllUnlocked = unlockedLevels >= 10;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const cleanPass = password.trim().toLowerCase();
    if (cleanPass === 'lumidren') {
      setAuthStatus('success');
      soundEngine.playPowerup('shield');
      if (onUnlockRoot) {
        onUnlockRoot();
      }
    } else {
      setAuthStatus('error');
      soundEngine.playHazard?.();
    }
  };

  const openExternalLink = (url) => {
    soundEngine.playUIClick?.();
    if (window.open) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="hud-panel glass-card-glow about-modal-panel">
        {/* Header */}
        <div className="about-modal-header">
          <div>
            <h2 className="about-modal-title">
              ℹ️ ABOUT THE CREATOR & GAME
            </h2>
            <div className="about-modal-subtitle">
              Developer Profile · Social Links · Root Access Console
            </div>
          </div>
          <button
            className="shop-close-x-btn"
            title="Close"
            onClick={() => {
              soundEngine.playUIClick?.();
              onClose();
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Developer Bio Card */}
        <div className="about-card">
          <div className="about-creator-header">
            <div className="about-creator-avatar">
              ⚡
            </div>
            <div>
              <div className="about-creator-name">lumidren</div>
              <div className="about-creator-role">Lead Creator & Full-Stack Game Developer</div>
            </div>
          </div>
          <p className="about-description">
            Creator of <strong>Crystal Collector 2.0</strong>. Passionate about 3D web graphics, procedural world generation, responsive physics, and arcade game mechanics.
          </p>

          {/* Social Links */}
          <div className="about-social-row">
            <button
              className="about-social-btn github-btn"
              onClick={() => openExternalLink('https://github.com/lumidren')}
              title="Visit lumidren on GitHub"
            >
              <span style={{ fontSize: '18px' }}>🐙</span>
              <span>GitHub: @lumidren</span>
            </button>
            <button
              className="about-social-btn linkedin-btn"
              onClick={() => openExternalLink('https://www.linkedin.com/in/lumidren')}
              title="Visit lumidren on LinkedIn"
            >
              <span style={{ fontSize: '18px' }}>💼</span>
              <span>LinkedIn Profile</span>
            </button>
          </div>
        </div>

        {/* Game Info Card */}
        <div className="about-card" style={{ marginTop: '14px' }}>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#00f0ff', marginBottom: '6px' }}>
            🎮 CRYSTAL COLLECTOR 2.0
          </div>
          <p className="about-description" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
            An adrenaline-infused neo-arcade 3D platformer engineered with <strong>Three.js</strong>, <strong>React</strong>, and custom procedural audio. Features 10 multi-tier biome realms, anti-gravity Sentinel Cubes, Cyber Stalker Predators, 5 distinct playable heroes with unique stats, customizable pet companions, and epic boss titan battles.
          </p>
        </div>

        {/* Root Version Access Console */}
        <div className="about-card root-console-card" style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔐</span>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffd700', letterSpacing: '0.5px' }}>
              DEVELOPER ROOT CONSOLE
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>
            Enter the developer master password to unlock instant root access to all 10 campaign levels.
          </p>

          {isAllUnlocked || authStatus === 'success' ? (
            <div className="root-success-banner">
              🚀 ROOT ACCESS ACTIVE: ALL 10 LEVELS UNLOCKED!
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="root-form-row">
              <input
                type="password"
                className="root-password-input"
                placeholder="Enter root password (lumidren)..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authStatus) setAuthStatus(null);
                }}
              />
              <button
                type="submit"
                className="root-submit-btn"
              >
                ⚡ UNLOCK
              </button>
            </form>
          )}

          {authStatus === 'error' && (
            <div className="root-error-banner">
              ❌ ACCESS DENIED: Invalid root password. Try again!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
