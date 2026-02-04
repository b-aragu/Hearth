import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { COLORS, FPS, FONTS } from '../constants/colors';

// CINEMATIC HOW IT WORKS
export const Scene3_HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  
  const steps = [
    {
      number: '01',
      icon: '🐻',
      title: 'Choose Your Pet',
      description: 'Pick your perfect companion',
      color: COLORS.coral,
      gradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)'
    },
    {
      number: '02',
      icon: '💝',
      title: 'Care Every Day',
      description: 'Answer daily questions together',
      color: COLORS.mint,
      gradient: 'linear-gradient(135deg, #E5F5F0 0%, #F0FFF5 100%)'
    },
    {
      number: '03',
      icon: '📈',
      title: 'Watch It Grow',
      description: 'See your bond strengthen',
      color: COLORS.lavender,
      gradient: 'linear-gradient(135deg, #F0F0FF 0%, #F5F5FF 100%)'
    }
  ];
  
  // Title animation - Scene 3 How It Works
  const titleY = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 22, stiffness: 110, mass: 1.0 },
    from: -60,
    to: 0
  });
  
  // Glow animation
  const glowPulse = 0.5 + Math.sin(frame * 0.03) * 0.15;
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(145deg, #FFFAF8 0%, #FFF8FA 100%)',
      overflow: 'hidden'
    }}>
      {/* SOFT GLOWS */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '-5%',
        width: '450px',
        height: '450px',
        background: `radial-gradient(circle, rgba(255,183,178,${glowPulse * 0.25}) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      {/* FLOATING ELEMENTS */}
      {['✨', '🌟', '💫'].map((emoji, i) => {
        const yOffset = Math.sin((frame + i * 40) * 0.04) * 25;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i * 35}%`,
            top: `${10 + i * 25}%`,
            fontSize: 28,
            opacity: 0.15,
            transform: `translateY(${yOffset}px)`,
            pointerEvents: 'none'
          }}>
            {emoji}
          </div>
        );
      })}
      
      {/* TITLE */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${titleY}px)`,
        zIndex: 20
      }}>
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '58px',
          fontWeight: 800,
          color: COLORS.charcoal,
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          How It Works
        </h1>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: `${COLORS.charcoal}70`,
          fontWeight: 500
        }}>
          Three simple steps to grow together
        </p>
      </div>

      {/* STEPS */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -42%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '780px'
      }}>
        {steps.map((step, index) => {
          // Longer delays between steps - flowing animation
          const stepX = spring({
            frame: frame - 20 - (index * 18),
            fps: FPS,
            config: { damping: 22, stiffness: 110, mass: 1.0 },
            from: 200,
            to: 0
          });
          
          const stepOpacity = spring({
            frame: frame - 20 - (index * 18),
            fps: FPS,
            config: { damping: 20, stiffness: 115, mass: 1.0 },
            from: 0,
            to: 1
          });
          
          const stepScale = spring({
            frame: frame - 20 - (index * 18),
            fps: FPS,
            config: { damping: 18, stiffness: 120, mass: 1.0 },
            from: 0.9,
            to: 1
          });
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                background: step.gradient,
                borderRadius: '32px',
                padding: '32px 40px',
                boxShadow: `
                  0 16px 48px ${step.color}25,
                  0 4px 12px rgba(0,0,0,0.04),
                  inset 0 1px 1px rgba(255,255,255,0.8)
                `,
                border: `2px solid ${step.color}40`,
                transform: `translateX(${stepX}px) scale(${stepScale})`,
                opacity: stepOpacity
              }}
            >
              {/* Step number */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: step.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  0 8px 24px ${step.color}50,
                  inset 0 1px 1px rgba(255,255,255,0.3)
                `,
                flexShrink: 0
              }}>
                <span style={{
                  fontFamily: FONTS.heading,
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'white'
                }}>
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <span style={{
                fontSize: '56px',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))'
              }}>
                {step.icon}
              </span>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: FONTS.heading,
                  fontSize: '36px',
                  fontWeight: 700,
                  color: COLORS.charcoal,
                  marginBottom: '6px',
                  letterSpacing: '-0.3px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: FONTS.body,
                  fontSize: '20px',
                  color: `${COLORS.charcoal}75`,
                  fontWeight: 500
                }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROGRESS DOTS */}
      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        {steps.map((step, i) => {
          const dotScale = spring({
            frame: frame - 20 - (i * 18),
            fps: FPS,
            config: { damping: 25, stiffness: 100, mass: 1.0 },
            from: 0,
            to: 1
          });
          
          return (
            <div
              key={i}
              style={{
                width: dotScale > 0.5 ? '44px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: dotScale > 0.5 ? step.color : `${COLORS.charcoal}20`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: dotScale > 0.5 ? `0 4px 12px ${step.color}50` : 'none'
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
