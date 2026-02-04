import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion';
import { COLORS, FPS } from '../constants/colors';

const FONTS = {
  heading: "'Outfit', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif"
};

// CINEMATIC HERO - Apple Pro-Level Production
export const Scene1_Hero: React.FC = () => {
  const frame = useCurrentFrame();
  
  // CINEMATIC SMOOTH spring animations - Scene 1 Hero
  const badgeScale = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 20, stiffness: 100, mass: 1.0 },
    from: 0,
    to: 1
  });
  
  const titleY = spring({
    frame: frame - 12,
    fps: FPS,
    config: { damping: 18, stiffness: 100, mass: 1.0 },
    from: -60,
    to: 0
  });
  
  // Phone main scale - starts smaller and grows
  const phoneScale = spring({
    frame: frame - 20,
    fps: FPS,
    config: { damping: 22, stiffness: 90, mass: 1.0 },
    from: 0.6,
    to: 1
  });
  
  const phoneRotateY = spring({
    frame: frame - 20,
    fps: FPS,
    config: { damping: 20, stiffness: 90, mass: 1.0 },
    from: 20,
    to: 0
  });
  
  // Phone elongation animation - stretches the ENTIRE phone vertically
  const phoneElongate = spring({
    frame: frame - 30,
    fps: FPS,
    config: { damping: 25, stiffness: 80, mass: 1.0 },
    from: 1,
    to: 1.35
  });
  
  const ctaY = spring({
    frame: frame - 45,
    fps: FPS,
    config: { damping: 20, stiffness: 100, mass: 1.0 },
    from: 100,
    to: 0
  });
  
  // SMOOTH floating animation
  const floatY = Math.sin(frame * 0.05) * 10;
  const breatheScale = 1 + Math.sin(frame * 0.04) * 0.02;
  
  // GLOW animations
  const glowPulse = 0.7 + Math.sin(frame * 0.04) * 0.25;
  const shadowScale = 0.9 + Math.sin(frame * 0.05) * 0.05;
  
  // TEXT SHIMMER effect
  const shimmerX = interpolate(frame % 60, [0, 30, 60], [-100, 100, -100], {
    extrapolateRight: 'clamp'
  });
  
  // PARTICLE SYSTEM - 15 particles with different behaviors
  const particles = Array.from({ length: 15 }, (_, i) => {
    const baseX = 80 + (i % 5) * 220;
    const baseY = 150 + Math.floor(i / 5) * 500;
    const delay = i * 8;
    const speed = 0.03 + (i % 3) * 0.01;
    const size = 4 + (i % 4) * 4;
    
    return {
      x: baseX,
      y: baseY,
      delay,
      speed,
      size,
      color: i % 2 === 0 ? COLORS.coral : COLORS.lavender
    };
  });
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(160deg, #FFF5F8 0%, #FFF0F5 25%, #FFE8F0 50%, #FFF5F0 75%, #FFFAF5 100%)',
      overflow: 'hidden'
    }}>
      {/* MULTI-LAYER GLOW BACKGROUND */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1000px',
        height: '1000px',
        background: `radial-gradient(circle, rgba(255,183,178,${glowPulse * 0.5}) 0%, rgba(199,206,234,${glowPulse * 0.3}) 40%, transparent 70%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none',
        mixBlendMode: 'soft-light'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '5%',
        width: '700px',
        height: '700px',
        background: `radial-gradient(circle, rgba(181,234,215,${glowPulse * 0.4}) 0%, transparent 65%)`,
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      {/* ADVANCED PARTICLE SYSTEM */}
      {particles.map((p, i) => {
        const particleY = Math.sin((frame + p.delay) * p.speed) * 40;
        const particleX = Math.cos((frame + p.delay) * p.speed * 0.7) * 20;
        const opacity = 0.2 + Math.sin((frame + p.delay) * 0.02) * 0.15;
        const scale = 1 + Math.sin((frame + p.delay) * 0.03) * 0.3;
        
        return (
          <div key={i} style={{
            position: 'absolute',
            left: p.x + particleX,
            top: p.y + particleY,
            width: p.size * scale,
            height: p.size * scale,
            borderRadius: '50%',
            background: p.color,
            opacity,
            filter: 'blur(1px)',
            pointerEvents: 'none',
            boxShadow: `0 0 ${p.size * 2}px ${p.color}40`
          }} />
        );
      })}
      
      {/* FLOATING PETALS */}
      {['🌸', '✨', '💫', '🌟'].map((emoji, i) => {
        const yOffset = Math.sin((frame + i * 40) * 0.03) * 50;
        const rotation = (frame + i * 30) * 0.5;
        const opacity = 0.15 + Math.sin((frame + i * 20) * 0.02) * 0.1;
        
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i * 25}%`,
            top: `${20 + i * 15}%`,
            fontSize: 24 + i * 8,
            opacity,
            transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 4px 12px rgba(255,183,178,0.3))',
            pointerEvents: 'none'
          }}>
            {emoji}
          </div>
        );
      })}
      
      {/* BADGE - Glass morphism */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '50%',
        transform: `translateX(-50%) scale(${badgeScale})`,
        zIndex: 30
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.7)',
          padding: '10px 20px',
          borderRadius: '9999px',
          boxShadow: '0 4px 24px rgba(255,154,162,0.25)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22C55E',
            boxShadow: '0 0 8px #22C55E',
            animation: 'pulse 2s infinite'
          }}>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
            `}</style>
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: COLORS.charcoal,
            fontFamily: FONTS.body,
            letterSpacing: '0.3px'
          }}>
            10,247 couples growing together
          </span>
        </div>
      </div>
      
      {/* TITLE - With shimmer effect */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${titleY}px)`,
        zIndex: 20
      }}>
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '48px',
          fontWeight: 800,
          color: COLORS.charcoal,
          lineHeight: 1.05,
          letterSpacing: '-0.5px',
          position: 'relative',
          display: 'inline-block',
          textShadow: '0 2px 30px rgba(255,255,255,0.9)'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFB7B2 0%, #C7CEEA 50%, #B5EAD7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative'
          }}>
            Beautiful Together
            {/* SHIMMER OVERLAY */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
              transform: `translateX(${shimmerX}%)`,
              pointerEvents: 'none'
            }} />
          </span>
        </h1>
        
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '18px',
          color: `${COLORS.charcoal}90`,
          margin: '10px auto 0',
          maxWidth: '380px',
          lineHeight: 1.4,
          fontWeight: 500
        }}>
          Your shared companion awaits
        </p>
      </div>
      
      {/* MASSIVE PHONE WITH ELONGATION - EVERYTHING SCALES */}
      <div style={{
        position: 'absolute',
        top: '54%',
        left: '50%',
        transform: `translate(-50%, -50%) perspective(1200px) rotateY(${phoneRotateY}deg) scale(${phoneScale}) scaleY(${phoneElongate})`,
        zIndex: 15,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      }}>
        {/* DYNAMIC SHADOW with breathing effect */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: `translateX(-50%) scaleX(${shadowScale})`,
          width: '80%',
          height: '100px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        
        {/* MASSIVE PHONE FRAME */}
        <div style={{
          width: '600px',
          background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderRadius: '65px',
          padding: '16px',
          boxShadow: `
            0 60px 120px rgba(0,0,0,0.45),
            0 40px 80px rgba(255,154,162,0.25),
            inset 0 1px 1px rgba(255,255,255,0.15),
            inset 0 -1px 1px rgba(0,0,0,0.3)
          `,
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative'
        }}>
          {/* REFLECTION overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
            borderRadius: '65px 65px 0 0',
            pointerEvents: 'none',
            zIndex: 5
          }} />
          
          {/* SCREEN */}
          <div style={{
            background: '#FFF5F5',
            borderRadius: '55px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '800px'
          }}>
            {/* SCREEN REFLECTION */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '30%',
              background: 'linear-gradient(225deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 3
            }} />
            
            {/* DYNAMIC ISLAND - Larger */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '32px',
              background: '#000',
              borderRadius: '18px',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 15px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22C55E',
                boxShadow: '0 0 8px #22C55E'
              }} />
            </div>
            
            {/* STATUS BAR - Larger */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 32px',
              marginTop: '10px'
            }}>
              <span style={{
                fontSize: '17px',
                fontWeight: '700',
                color: COLORS.charcoal
              }}>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '18px', height: '11px', border: '2px solid #2D2D3A', borderRadius: '2px' }} />
              </div>
            </div>
            
            {/* APP HEADER - Larger */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 32px',
              marginBottom: '24px'
            }}>
              <span style={{
                fontFamily: FONTS.heading,
                fontSize: '24px',
                fontWeight: 'bold',
                color: COLORS.charcoal
              }}>OurHaven</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.95)',
                padding: '10px 18px',
                borderRadius: '24px',
                boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,183,178,0.2)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: COLORS.coral
                }} />
                <span style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: COLORS.coral
                }}>Level 5</span>
              </div>
            </div>
            
            {/* HERO CREATURE - 100px bear with spacing */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 0 60px'
            }}>
              <div style={{
                position: 'relative',
                transform: `scale(${breatheScale})`,
                marginTop: '20px'
              }}>
                <span style={{
                  fontSize: '100px',
                  transform: `translateY(${floatY}px)`,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                  display: 'block'
                }}>
                  🐻
                </span>
                
                {/* CREATURE AURA */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80px',
                  height: '80px',
                  background: `radial-gradient(circle, rgba(255,183,178,${glowPulse * 0.5}) 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                  zIndex: -1
                }} />
              </div>
              
              {/* GROUND SHADOW */}
              <div style={{
                width: '60px',
                height: '12px',
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '50%',
                filter: 'blur(6px)',
                marginTop: '20px',
                transform: `scaleX(${shadowScale})`
              }} />
              
              <h2 style={{
                fontFamily: FONTS.heading,
                fontSize: '42px',
                fontWeight: 'bold',
                color: COLORS.charcoal,
                marginTop: '40px',
                marginBottom: '16px',
                letterSpacing: '-0.3px'
              }}>
                Barnaby
              </h2>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.95)',
                padding: '12px 22px',
                borderRadius: '28px',
                boxShadow: '0 3px 16px rgba(0,0,0,0.05)',
                border: '1px solid rgba(34,197,94,0.15)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 6px #22C55E'
                }} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: COLORS.charcoal
                }}>
                  Growing Strong
                </span>
              </div>
            </div>
            
            {/* STATS CARD - Larger with spacing */}
            <div style={{
              background: 'rgba(255,255,255,0.98)',
              borderRadius: '28px',
              padding: '32px',
              margin: '40px 32px 40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: `${COLORS.charcoal}60`,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}>Day</div>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    color: COLORS.coral,
                    fontFamily: FONTS.heading,
                    lineHeight: 1
                  }}>42</div>
                </div>
                
                <div style={{
                  width: '1px',
                  height: '60px',
                  background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08), transparent)'
                }} />
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: `${COLORS.charcoal}60`,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}>Streak</div>
                  <div style={{
                    fontSize: '36px',
                    letterSpacing: '3px'
                  }}>
                    🔥🔥🔥🔥🔥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA BUTTON - Premium gradient */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${ctaY}px)`,
        zIndex: 25
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FF9AA2 0%, #FFB7B2 50%, #FFC4C2 100%)',
          borderRadius: '9999px',
          padding: '20px 48px',
          display: 'inline-block',
          boxShadow: '0 12px 40px rgba(255,154,162,0.5), 0 4px 12px rgba(255,154,162,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Button shine */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: -100,
            width: '50px',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: `translateX(${interpolate(frame % 90, [0, 45, 90], [0, 400, 0], { extrapolateRight: 'clamp' })}px)`,
            pointerEvents: 'none'
          }} />
          
          <span style={{
            fontFamily: FONTS.body,
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.3px',
            position: 'relative',
            zIndex: 1
          }}>
            Start Growing Together
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
