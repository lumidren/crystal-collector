import React, { useEffect, useRef, useState } from 'react';

/**
 * HolographicRadar Component
 * 
 * High-tech circular sci-fi radar HUD widget:
 * - 55-meter omnidirectional detection radius across 76x76 arena
 * - Rotating sweep beam with phosphorus fading trail
 * - Real-time tracking of:
 *   - Player position & heading
 *   - Ground and Sky-Island Crystals (cyan/rainbow diamonds with elevation cues)
 *   - High-value Gold Coins
 *   - Super Jump Trampolines
 *   - Lava pools and dynamic roving hazard cubes
 *   - Level 10 Titan Boss & Shield Pylons
 */
export const HolographicRadar = ({
  radarDataRef,
  crystalsCount = 0,
  coinsCount = 0,
  isPaused = false
}) => {
  const canvasRef = useRef(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let sweepAngle = 0;

    const RADAR_RANGE = 55; // 55 meters max detection across 76x76 arena
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const CENTER_X = WIDTH / 2;
    const CENTER_Y = HEIGHT / 2;
    const RADIUS = (WIDTH / 2) - 8;

    const render = () => {
      // Advance sweep beam
      if (!isPaused) {
        sweepAngle = (sweepAngle + 0.04) % (Math.PI * 2);
      }

      // Clear radar background
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Radar base background circle
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 15, 28, 0.85)';
      ctx.fill();

      // Outer bezel ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tick marks on bezel
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const isMajor = i % 9 === 0;
        const tickLen = isMajor ? 6 : 3;
        const x1 = CENTER_X + Math.cos(angle) * (RADIUS - 1);
        const y1 = CENTER_Y + Math.sin(angle) * (RADIUS - 1);
        const x2 = CENTER_X + Math.cos(angle) * (RADIUS - 1 - tickLen);
        const y2 = CENTER_Y + Math.sin(angle) * (RADIUS - 1 - tickLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isMajor ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.stroke();
      }

      // Concentric range circles (18m, 36m, 55m)
      [0.33, 0.66, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, RADIUS * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CENTER_X - RADIUS, CENTER_Y);
      ctx.lineTo(CENTER_X + RADIUS, CENTER_Y);
      ctx.moveTo(CENTER_X, CENTER_Y - RADIUS);
      ctx.lineTo(CENTER_X, CENTER_Y + RADIUS);
      ctx.stroke();

      // Cardinal direction letters
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', CENTER_X, CENTER_Y - RADIUS + 10);
      ctx.fillText('S', CENTER_X, CENTER_Y + RADIUS - 10);
      ctx.fillText('E', CENTER_X + RADIUS - 10, CENTER_Y);
      ctx.fillText('W', CENTER_X - RADIUS + 10, CENTER_Y);

      // Rotating radar sweep beam with gradient trail
      const sweepTailAngle = 0.55;
      if (ctx.createConicGradient) {
        const trailGrad = ctx.createConicGradient(sweepAngle - sweepTailAngle, CENTER_X, CENTER_Y);
        trailGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        trailGrad.addColorStop(sweepTailAngle / (Math.PI * 2), 'rgba(0, 240, 255, 0.22)');
        trailGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, RADIUS - 1, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = trailGrad;
        ctx.fill();
        ctx.restore();
      }

      // Sweep leading edge line
      const sweepLineX = CENTER_X + Math.cos(sweepAngle) * (RADIUS - 2);
      const sweepLineY = CENTER_Y + Math.sin(sweepAngle) * (RADIUS - 2);
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);
      ctx.lineTo(sweepLineX, sweepLineY);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Get real-time game entity data
      const data = radarDataRef?.current;
      const pX = data?.player?.x ?? 0;
      const pZ = data?.player?.z ?? 0;
      const pRot = data?.player?.rot ?? 0;

      // Helper to transform world coords (wx, wz) to radar coords relative to player
      const toRadarCoords = (wx, wz) => {
        const dx = wx - pX;
        const dz = wz - pZ;
        const dist = Math.hypot(dx, dz);

        // In Three.js, -Z is forward, +X is right.
        // On 2D Canvas, -Y is UP, +X is right.
        // Player forward is oriented UP on radar screen.
        const relAngle = Math.atan2(dx, -dz) - pRot;
        const rDist = Math.min(dist, RADAR_RANGE) / RADAR_RANGE * (RADIUS - 6);

        return {
          x: CENTER_X + Math.sin(relAngle) * rDist,
          y: CENTER_Y - Math.cos(relAngle) * rDist,
          inRange: dist <= RADAR_RANGE,
          dist
        };
      };

      // 1. Draw Jump Pads (Yellow circles)
      if (data?.jumpPads) {
        data.jumpPads.forEach(pad => {
          const pt = toRadarCoords(pad.x, pad.z);
          if (pt.inRange) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 1.5;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // 2. Draw Lava Hazards (Red filled warning zones)
      if (data?.hazards) {
        data.hazards.forEach(h => {
          const pt = toRadarCoords(h.x, h.z);
          if (pt.inRange) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 51, 68, 0.4)';
            ctx.strokeStyle = '#ff3344';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // 3. Draw Moving Obstacles (Seekers, Aerial Sky Mines, and Roaming Cubes)
      if (data?.obstacles) {
        data.obstacles.forEach(o => {
          if (!o.mesh) return;
          const pt = toRadarCoords(o.mesh.position.x, o.mesh.position.z);
          if (pt.inRange) {
            if (o.type === 'skymine') {
              // Aerial Sky Mine: Amber hazard circle with elevation cue
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#ff9100';
              ctx.fill();
              ctx.strokeStyle = '#ffea00';
              ctx.lineWidth = 1;
              ctx.stroke();

              // High-altitude marker
              ctx.fillStyle = '#ffea00';
              ctx.font = '8px monospace';
              ctx.textAlign = 'center';
              ctx.fillText('^', pt.x, pt.y - 4);
            } else if (o.type === 'seeker') {
              // Hunter Seeker: Pulsing crimson diamond with target lock indicator
              ctx.save();
              ctx.translate(pt.x, pt.y);
              ctx.rotate(Math.PI / 4);
              ctx.fillStyle = o.isLocked ? '#ff0033' : '#ff3d00';
              ctx.fillRect(-3, -3, 6, 6);
              if (o.isLocked) {
                ctx.strokeStyle = '#ff0055';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(-5, -5, 10, 10);
              }
              ctx.restore();
            } else {
              // Roaming Hazard Cube
              ctx.fillStyle = '#ff1744';
              ctx.fillRect(pt.x - 2.5, pt.y - 2.5, 5, 5);
            }
          }
        });
      }

      // 4. Draw Coins (Gold dots)
      if (data?.coins) {
        data.coins.forEach(c => {
          if (c.collected) return;
          const pt = toRadarCoords(c.mesh.position.x, c.mesh.position.z);
          if (pt.inRange) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffea00';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // 5. Draw Crystals (Neon Cyan / Rainbow Magenta Diamonds)
      if (data?.crystals) {
        data.crystals.forEach(c => {
          if (c.collected) return;
          const pt = toRadarCoords(c.mesh.position.x, c.mesh.position.z);
          if (pt.inRange) {
            const isSkyIsland = c.mesh.position.y > 2.5;
            const isRainbow = c.isRainbow;
            const color = isRainbow ? '#ff00ff' : '#00f0ff';

            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.fillRect(-3, -3, 6, 6);
            ctx.restore();

            // High altitude marker
            if (isSkyIsland) {
              ctx.fillStyle = '#ffffff';
              ctx.font = '8px monospace';
              ctx.fillText('^', pt.x, pt.y - 5);
            }
          }
        });
      }

      // 6. Draw Boss Titan & Shield Pylons (Level 10)
      if (data?.boss) {
        const b = data.boss;
        if (b.group) {
          const pt = toRadarCoords(b.group.position.x, b.group.position.z);
          if (pt.inRange) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 85, 0.6)';
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '9px monospace';
            ctx.fillText('👑', pt.x, pt.y);
          }
        }

        // Pylons
        if (b.pylons) {
          b.pylons.forEach(p => {
            const pt = toRadarCoords(p.position.x, p.position.z);
            if (pt.inRange) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
              ctx.fillStyle = p.deactivated ? 'rgba(0, 255, 136, 0.7)' : 'rgba(255, 0, 85, 0.8)';
              ctx.fill();
            }
          });
        }
      }

      // 7. Player Icon at Center (Cyan directional chevron)
      ctx.save();
      ctx.translate(CENTER_X, CENTER_Y);
      // Direction forward is straight up (0 angle in canvas coordinates)
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(5, 5);
      ctx.lineTo(0, 3);
      ctx.lineTo(-5, 5);
      ctx.closePath();
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [radarDataRef, isPaused]);

  return (
    <div className="holographic-radar-widget">
      {/* Header bar with toggle */}
      <div className="radar-header" onClick={() => setMinimized(prev => !prev)}>
        <div className="radar-status-dot" />
        <span className="radar-title">RADAR // 45M</span>
        <span className="radar-collapse-btn">{minimized ? '+' : '−'}</span>
      </div>

      {/* Radar body */}
      {!minimized && (
        <div className="radar-body">
          <canvas
            ref={canvasRef}
            width={146}
            height={146}
            className="radar-canvas"
          />
          {/* Radar Legend / Metrics */}
          <div className="radar-legend">
            <span className="legend-item">
              <span className="dot dot-crystal" /> {crystalsCount}
            </span>
            <span className="legend-item">
              <span className="dot dot-coin" /> {coinsCount}
            </span>
            <span className="legend-item">
              <span className="dot dot-hazard" /> HAZ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
