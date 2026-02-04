import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import { COLORS, FPS, FONTS } from '../constants/colors';

// MINIMAL CREATURE SELECTOR with DOTS transition
export const Scene2_Creatures: React.FC = () => {
  const frame = useCurrentFrame();
  
  const creatures = [
    { name: 'Bear', color: COLORS.coral, gradient: 'linear-gradient(145deg, #FFE5E5 0%, #FFF0F0 100%)', emoji: '🐻' },
    { name: 'Bunny', color: COLORS.mint, gradient: 'linear-gradient(145deg, #E5F5F0 0%, #F0FFF5 100%)', emoji: '🐰' },
    { name: 'Puppy', color: COLORS.peach, gradient: 'linear-gradient(145deg, #FFF0E5 0%, #FFF5F0 100%)', emoji: '🐶' },
    { name: 'Cat', color: COLORS.lavender, gradient: 'linear-gradient(145deg, #F0F0FF 0%, #F5F5FF 100%)', emoji: '🐱' },
    { name: 'Hamster', color: '#FFD93D', gradient: 'linear-gradient(145deg, #FFF9E5 0%, #FFFAF0 100%)', emoji: '🐹' },
    { name: 'Penguin', color: '#6B7280', gradient: 'linear-gradient(145deg, #F5F5F5 0%, #FAFAFA 100%)', emoji: '🐧' },
  ];
  
  // Title animation - Scene 2 Creatures
  const titleScale = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 22, stiffness: 115, mass: 1.0 },
    from: 0.8,
    to: 1
  });
  
  const titleOpacity = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 20, stiffness: 110, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  // Glow animation
  const glowIntensity = 0.6 + Math.sin(frame * 0.03) * 0.2;
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(145deg, #FFF8F5 0%, #FFF5F8 50%, #F8FFF5 100%)',
      overflow: 'hidden'
    }}>
      {/* AMBIENT GLOWS */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, rgba(255,183,178,${glowIntensity * 0.3}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, rgba(181,234,215,${glowIntensity * 0.25}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      {/* TITLE */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `scale(${titleScale})`,
        opacity: titleOpacity,
        zIndex: 20
      }}>
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '56px',
          fontWeight: 800,
          color: COLORS.charcoal,
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          Choose Your Companion
        </h1>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: `${COLORS.charcoal}75`,
          fontWeight: 500
        }}>
          Something magical is about to appear...
        </p>
      </div>

      {/* CREATURE GRID */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '28px',
        width: '880px'
      }}>
        {creatures.map((creature, index) => {
          // Staggered spring animations - Scene 2 Creatures (smooth with longer delays)
          const creatureScale = spring({
            frame: frame - 18 - (index * 8),
            fps: FPS,
            config: { damping: 22, stiffness: 115, mass: 1.0 },
            from: 0,
            to: 1
          });
          
          const creatureY = spring({
            frame: frame - 18 - (index * 8),
            fps: FPS,
            config: { damping: 20, stiffness: 120, mass: 1.0 },
            from: 100,
            to: 0
          });
          
          const creatureRotate = spring({
            frame: frame - 18 - (index * 8),
            fps: FPS,
            config: { damping: 25, stiffness: 110, mass: 1.0 },
            from: -10,
            to: 0
          });
          
          // Individual float
          const floatY = Math.sin((frame + index * 30) * 0.06) * 8;
          
          // Transition from dots to emoji - smooth transition with spring
          const revealFrame = 30 + (index * 10);
          const dotsOpacity = interpolate(frame, [revealFrame - 8, revealFrame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const emojiOpacity = interpolate(frame, [revealFrame - 8, revealFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const emojiScale = spring({
            frame: frame - revealFrame,
            fps: FPS,
            config: { damping: 25, stiffness: 100, mass: 1.0 },
            from: 0.5,
            to: 1
          });
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateY(${creatureY + floatY}px) scale(${creatureScale}) rotate(${creatureRotate}deg)`,
                opacity: creatureScale,
                cursor: 'pointer'
              }}
            >
              {/* Card */}
              <div style={{
                width: '260px',
                height: '260px',
                borderRadius: '40px',
                background: creature.gradient,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  0 20px 40px ${creature.color}35,
                  0 8px 20px rgba(0,0,0,0.08),
                  inset 0 1px 1px rgba(255,255,255,0.8)
                `,
                border: `3px solid ${creature.color}50`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Card reflection */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50%',
                  height: '50%',
                  background: 'linear-gradient(225deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
                  pointerEvents: 'none'
                }} />
                
                {/* DOTS (fades out) */}
                <div style={{
                  position: 'absolute',
                  opacity: dotsOpacity,
                  transition: 'opacity 0.3s ease'
                }}>
                  <span style={{
                    fontSize: '32px',
                    color: creature.color,
                    opacity: 0.6
                  }}>
                    •••
                  </span>
                </div>
                
                {/* EMOJI (fades in and scales) */}
                <div style={{
                  opacity: emojiOpacity,
                  transform: `scale(${emojiScale})`,
                  transition: 'opacity 0.3s ease, transform 0.3s ease'
                }}>
                  <span style={{
                    fontSize: '80px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                  }}>
                    {creature.emoji}
                  </span>
                </div>
              </div>
              
              {/* Name */}
              <span style={{
                fontFamily: FONTS.heading,
                fontSize: '28px',
                fontWeight: 700,
                color: COLORS.charcoal,
                marginTop: '18px',
                textShadow: '0 2px 10px rgba(255,255,255,0.8)'
              }}>
                {creature.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* BOTTOM BADGE */}
      <div style={{
        position: 'absolute',
        bottom: '70px',
        left: 0,
        right: 0,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          padding: '14px 28px',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.6)'
        }}>
          <span style={{
            fontFamily: FONTS.body,
            fontSize: '18px',
            fontWeight: 600,
            color: COLORS.charcoal
          }}>
            6 magical companions waiting to meet you
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
