import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { COLORS, FPS, FONTS } from '../constants/colors';

// ULTRA PREMIUM LOCK SCREEN - Apple-level production
// EXPANDED VERSION - Much larger phone display (25-35 seconds)
export const Scene5_Widgets: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Premium smooth animations - Scene 5 Lock Screen
  const titleScale = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 20, stiffness: 105, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  const phoneScale = spring({
    frame: frame - 20,
    fps: FPS,
    config: { damping: 22, stiffness: 100, mass: 1.2 },
    from: 0.75,
    to: 1
  });
  
  const widgetSlide = spring({
    frame: frame - 35,
    fps: FPS,
    config: { damping: 20, stiffness: 110, mass: 1.0 },
    from: -100,
    to: 0
  });
  
  const notifSlide = spring({
    frame: frame - 50,
    fps: FPS,
    config: { damping: 18, stiffness: 105, mass: 1.0 },
    from: 100,
    to: 0
  });
  
  // Glow animation
  const glowPulse = 0.6 + Math.sin(frame * 0.04) * 0.3;
  
  // Floating emojis
  const floatEmojis = [
    { emoji: '✨', x: 15, y: 25, delay: 0, size: 32 },
    { emoji: '🌙', x: 85, y: 30, delay: 15, size: 40 },
    { emoji: '⭐', x: 10, y: 60, delay: 30, size: 28 },
    { emoji: '💫', x: 90, y: 65, delay: 45, size: 36 },
    { emoji: '🌟', x: 20, y: 85, delay: 60, size: 30 },
  ];
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #16213e 100%)'
    }}>
      {/* PURPLE AMBIENT GLOW - Behind phone */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1100px',
        height: '1100px',
        background: `radial-gradient(circle, rgba(139, 92, 246, ${glowPulse * 0.45}) 0%, transparent 65%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '65%',
        left: '25%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, rgba(99, 102, 241, ${glowPulse * 0.35}) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      {/* FLOATING EMOJIS */}
      {floatEmojis.map((item, i) => {
        const yOffset = Math.sin((frame + item.delay) * 0.04) * 25;
        const opacity = 0.4 + Math.sin((frame + item.delay) * 0.03) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: item.size,
              opacity,
              transform: `translateY(${yOffset}px)`,
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
              pointerEvents: 'none'
            }}
          >
            {item.emoji}
          </div>
        );
      })}

      {/* TITLE - Top (moved up to make room) */}
      <div style={{
        position: 'absolute',
        top: '35px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `scale(${titleScale})`,
        zIndex: 20
      }}>
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '56px',
          fontWeight: 800,
          color: 'white',
          marginBottom: '10px',
          textShadow: '0 4px 30px rgba(255,183,178,0.4)',
          letterSpacing: '-1px'
        }}>
          Always With You
        </h1>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '20px',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 500
        }}>
          Your pet lives on your lock screen
        </p>
      </div>

      {/* MASSIVE LOCK SCREEN PHONE - EXPANDED */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${phoneScale})`,
        zIndex: 10
      }}>
        {/* Phone Glow */}
        <div style={{
          position: 'absolute',
          inset: '-40px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        
        {/* Phone Body - EXPANDED from 540px to 660px */}
        <div style={{
          width: '660px',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '65px',
          padding: '60px 48px',
          boxShadow: '0 70px 140px rgba(0,0,0,0.65), 0 0 100px rgba(139, 92, 246, 0.25)',
          border: '2px solid rgba(255,255,255,0.18)',
          position: 'relative'
        }}>
          {/* Dynamic Island - Larger */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '135px',
            height: '38px',
            background: '#000',
            borderRadius: '20px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 10px #22C55E'
            }} />
          </div>
          
          {/* Lock Screen Time - Larger */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
            marginTop: '25px'
          }}>
            <div style={{
              fontFamily: FONTS.heading,
              fontSize: '115px',
              fontWeight: 200,
              color: 'white',
              marginBottom: '10px',
              letterSpacing: '-2px'
            }}>
              9:41
            </div>
            <div style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500
            }}>
              Monday, June 12
            </div>
            <div style={{
              fontSize: '24px',
              color: COLORS.coral,
              marginTop: '8px',
              fontWeight: 600
            }}>
              ☀️ 72°
            </div>
          </div>

          {/* Hearth Widget - EXPANDED */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '32px',
            padding: '34px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.22)',
            transform: `translateX(${widgetSlide}px)`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.35)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}>
              <span style={{
                fontSize: '82px',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
              }}>
                🐻
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}>Barnaby</div>
                <div style={{
                  fontSize: '22px',
                  color: COLORS.coral,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 600
                }}>
                  <span>Day 42</span>
                  <span>🔥🔥🔥</span>
                </div>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(34, 197, 94, 0.4)'
              }}>
                <span style={{ fontSize: '32px', color: '#22C55E' }}>✓</span>
              </div>
            </div>
          </div>

          {/* Live Activity Notification - EXPANDED */}
          <div style={{
            background: 'rgba(255,183,178,0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '28px',
            border: '1px solid rgba(255,183,178,0.28)',
            transform: `translateX(${notifSlide}px)`,
            boxShadow: '0 4px 24px rgba(255,183,178,0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <span style={{ fontSize: '44px' }}>💝</span>
              <div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: COLORS.coral,
                  marginBottom: '6px'
                }}>New Love Received!</div>
                <div style={{
                  fontSize: '17px',
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 500
                }}>Sarah sent you a message</div>
              </div>
            </div>
          </div>

          {/* Bottom stats - EXPANDED */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '28px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '26px',
              padding: '26px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              <div style={{
                fontSize: '46px',
                fontWeight: 700,
                color: COLORS.coral,
                marginBottom: '6px',
                fontFamily: FONTS.heading
              }}>42</div>
              <div style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500
              }}>Day Streak</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '26px',
              padding: '26px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              <div style={{
                fontSize: '46px',
                fontWeight: 700,
                color: COLORS.mint,
                marginBottom: '6px',
                fontFamily: FONTS.heading
              }}>5</div>
              <div style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500
              }}>Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature badges - Bottom (moved down) */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        zIndex: 20
      }}>
        {['Lock Screen Widget', 'Live Activity', 'Notifications'].map((badge, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)',
              padding: '14px 26px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{
              fontFamily: FONTS.body,
              fontSize: '17px',
              fontWeight: 600,
              color: 'white'
            }}>
              {badge}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
