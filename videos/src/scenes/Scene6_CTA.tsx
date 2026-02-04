import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { COLORS, FPS, FONTS } from '../constants/colors';

// CINEMATIC FINAL CTA
export const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Elegant finale animations - Scene 6 CTA
  const logoScale = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 18, stiffness: 100, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  const logoRotate = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 22, stiffness: 90, mass: 1.0 },
    from: -15,
    to: 0
  });
  
  // Tagline animation
  const taglineY = spring({
    frame: frame - 18,
    fps: FPS,
    config: { damping: 20, stiffness: 100, mass: 1.0 },
    from: 40,
    to: 0
  });
  
  // Poll animation
  const pollY = spring({
    frame: frame - 30,
    fps: FPS,
    config: { damping: 22, stiffness: 100, mass: 1.0 },
    from: 80,
    to: 0
  });
  
  const pollOpacity = spring({
    frame: frame - 30,
    fps: FPS,
    config: { damping: 20, stiffness: 110, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  // Buttons animation
  const buttonsY = spring({
    frame: frame - 45,
    fps: FPS,
    config: { damping: 20, stiffness: 105, mass: 1.0 },
    from: 60,
    to: 0
  });
  
  const buttonsOpacity = spring({
    frame: frame - 45,
    fps: FPS,
    config: { damping: 22, stiffness: 110, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  // URL animation
  const urlScale = spring({
    frame: frame - 55,
    fps: FPS,
    config: { damping: 18, stiffness: 100, mass: 1.0 },
    from: 0.8,
    to: 1
  });
  
  // Smoother poll progress bars
  const pollProgress = spring({
    frame: frame - 40,
    fps: FPS,
    config: { damping: 25, stiffness: 50, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  // Gentle pulse on logo
  const pulseScale = 1 + Math.sin(frame * 0.08) * 0.02;
  
  // Glow animation
  const glowIntensity = 0.25 + Math.sin(frame * 0.04) * 0.1;
  
  const pollItems = [
    { icon: '🔒', label: 'Lock Screen Widgets', percent: 85, color: COLORS.coral },
    { icon: '📓', label: 'Shared Journal', percent: 65, color: COLORS.lavender },
    { icon: '🎯', label: 'Couple Challenges', percent: 45, color: COLORS.mint }
  ];
  
  // Social proof badge
  const socialScale = spring({
    frame: frame - 25,
    fps: FPS,
    config: { damping: 20, stiffness: 100, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(145deg, #FFF9F5 0%, #FFF8F8 50%, #FAFFF8 100%)',
      overflow: 'hidden'
    }}>
      {/* GLOW BACKGROUNDS */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '450px',
        height: '450px',
        background: `radial-gradient(circle, rgba(255,183,178,${glowIntensity}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, rgba(181,234,215,${glowIntensity * 0.8}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      {/* FLOATING SPARKLES */}
      {['✨', '🌟', '💫'].map((emoji, i) => {
        const yOffset = Math.sin((frame + i * 35) * 0.04) * 20;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i * 35}%`,
            top: `${12 + i * 15}%`,
            fontSize: 24,
            opacity: 0.15,
            transform: `translateY(${yOffset}px)`,
            pointerEvents: 'none'
          }}>
            {emoji}
          </div>
        );
      })}

      {/* LOGO */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `scale(${logoScale * pulseScale}) rotate(${logoRotate}deg)`,
        zIndex: 20
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '16px'
        }}>
          <span style={{ 
            fontSize: '44px', 
            color: COLORS.coral,
            filter: 'drop-shadow(0 0 20px rgba(255,183,178,0.4))'
          }}>✦</span>
          <span style={{
            fontSize: '72px',
            fontWeight: 900,
            fontFamily: FONTS.heading,
            background: 'linear-gradient(135deg, #FFB7B2 0%, #FF9AA2 50%, #FFB7B2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
            textShadow: '0 4px 30px rgba(255,154,162,0.3)'
          }}>
            Hearth
          </span>
          <span style={{ 
            fontSize: '44px', 
            color: COLORS.coral,
            filter: 'drop-shadow(0 0 20px rgba(255,183,178,0.4))'
          }}>✦</span>
        </div>
      </div>

      {/* TAGLINE */}
      <div style={{
        position: 'absolute',
        top: '150px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${taglineY}px)`,
        zIndex: 15
      }}>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '26px',
          color: `${COLORS.charcoal}85`,
          fontWeight: 500,
          marginBottom: '16px'
        }}>
          Grow something beautiful together
        </p>
        
        {/* Social proof */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,183,178,0.2)',
          padding: '12px 24px',
          borderRadius: '28px',
          transform: `scale(${socialScale})`,
          border: '1px solid rgba(255,183,178,0.3)'
        }}>
          <span style={{
            fontSize: '26px'
          }}>
            🐻
          </span>
          <span style={{
            fontSize: '18px',
            fontWeight: 700,
            color: COLORS.coral,
            fontFamily: FONTS.body
          }}>
            10,247 couples growing
          </span>
        </div>
      </div>

      {/* FEATURE POLL */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${pollY}px)`,
        width: '720px',
        background: 'rgba(255,255,255,0.98)',
        borderRadius: '36px',
        padding: '36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.04)',
        opacity: pollOpacity
      }}>
        <p style={{
          fontFamily: FONTS.heading,
          fontSize: '24px',
          fontWeight: 700,
          color: COLORS.charcoal,
          marginBottom: '28px',
          textAlign: 'center',
          letterSpacing: '-0.3px'
        }}>
          What excites you most?
        </p>

        {pollItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: i < pollItems.length - 1 ? '18px' : 0
          }}>
            <span style={{ fontSize: '28px' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: COLORS.charcoal
                }}>{item.label}</span>
                <span style={{
                  fontSize: '16px',
                  color: item.color,
                  fontWeight: 700
                }}>
                  {Math.floor(item.percent * pollProgress)}%
                </span>
              </div>
              <div style={{
                height: '10px',
                background: `${COLORS.charcoal}8`,
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${item.percent * pollProgress}%`,
                  background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  borderRadius: '5px',
                  boxShadow: `0 2px 8px ${item.color}50`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* APP STORE BUTTONS */}
      <div style={{
        position: 'absolute',
        bottom: '160px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        transform: `translateY(${buttonsY}px)`,
        opacity: buttonsOpacity
      }}>
        <button style={{
          background: COLORS.charcoal,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px',
          padding: '18px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 28px rgba(45,45,58,0.35), 0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '34px', color: 'white' }}>🍎</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              Download on the
            </div>
            <div style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: FONTS.body,
              letterSpacing: '-0.3px'
            }}>
              App Store
            </div>
          </div>
        </button>

        <button style={{
          background: COLORS.charcoal,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px',
          padding: '18px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 28px rgba(45,45,58,0.35), 0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '34px', color: 'white' }}>▶</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              Get it on
            </div>
            <div style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: FONTS.body,
              letterSpacing: '-0.3px'
            }}>
              Google Play
            </div>
          </div>
        </button>
      </div>

      {/* URL */}
      <div style={{
        position: 'absolute',
        bottom: '70px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `scale(${urlScale})`
      }}>
        <p style={{
          fontSize: '36px',
          fontWeight: 800,
          color: COLORS.charcoal,
          fontFamily: FONTS.heading,
          letterSpacing: '2px',
          textShadow: '0 2px 20px rgba(255,255,255,0.8)'
        }}>
          hearth.app
        </p>
      </div>
    </AbsoluteFill>
  );
};
