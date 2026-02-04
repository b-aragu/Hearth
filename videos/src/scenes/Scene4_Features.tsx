import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { COLORS, FPS, FONTS } from '../constants/colors';

// CINEMATIC FEATURES
export const Scene4_Features: React.FC = () => {
  const frame = useCurrentFrame();
  
  const features = [
    {
      icon: '🔥',
      title: 'Feed Pet',
      description: 'Daily check-ins keep your pet happy',
      color: COLORS.coral,
      gradient: 'linear-gradient(145deg, #FFF0F0 0%, #FFE8E8 100%)'
    },
    {
      icon: '💝',
      title: 'Daily Care',
      description: 'Answer meaningful questions together',
      color: COLORS.mint,
      gradient: 'linear-gradient(145deg, #F0FFF8 0%, #E8FFF5 100%)'
    },
    {
      icon: '📸',
      title: 'Pet Memories',
      description: 'Capture and relive special moments',
      color: COLORS.lavender,
      gradient: 'linear-gradient(145deg, #F8F8FF 0%, #F0F0FF 100%)'
    },
    {
      icon: '🔒',
      title: 'Lock Screen',
      description: 'Your pet always just a glance away',
      color: '#6366F1',
      gradient: 'linear-gradient(145deg, #F0F0FF 0%, #E8E8FF 100%)'
    }
  ];
  
  // Title animation - Scene 4 Features
  const titleY = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 22, stiffness: 100, mass: 1.0 },
    from: -60,
    to: 0
  });
  
  // Glow animation
  const glowIntensity = 0.4 + Math.sin(frame * 0.03) * 0.15;
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(145deg, #FAFAFA 0%, #F8F8FA 50%, #FAF8FA 100%)',
      overflow: 'hidden'
    }}>
      {/* AMBIENT GLOWS */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, rgba(255,218,193,${glowIntensity}) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '-5%',
        width: '450px',
        height: '450px',
        background: `radial-gradient(circle, rgba(181,234,215,${glowIntensity * 0.8}) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      {/* FLOATING DECORATIONS */}
      {['🎯', '⭐', '✨'].map((emoji, i) => {
        const yOffset = Math.sin((frame + i * 45) * 0.04) * 20;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`,
            fontSize: 28,
            opacity: 0.12,
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
        top: '60px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${titleY}px)`,
        zIndex: 20
      }}>
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '54px',
          fontWeight: 800,
          color: COLORS.charcoal,
          marginBottom: '10px',
          letterSpacing: '-0.5px'
        }}>
          More Than Just an App
        </h1>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: `${COLORS.charcoal}70`,
          fontWeight: 500
        }}>
          Everything you need to grow together
        </p>
      </div>

      {/* 2x2 GRID */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -42%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '28px',
        width: '900px'
      }}>
        {features.map((feature, index) => {
          const isLeft = index % 2 === 0;
          
          // Smooth card animations
          const cardX = spring({
            frame: frame - 15 - (index * 10),
            fps: FPS,
            config: { damping: 22, stiffness: 100, mass: 1.0 },
            from: isLeft ? -250 : 250,
            to: 0
          });
          
          const cardScale = spring({
            frame: frame - 15 - (index * 10),
            fps: FPS,
            config: { damping: 20, stiffness: 110, mass: 1.0 },
            from: 0.85,
            to: 1
          });
          
          const cardOpacity = spring({
            frame: frame - 15 - (index * 10),
            fps: FPS,
            config: { damping: 25, stiffness: 90, mass: 1.0 },
            from: 0,
            to: 1
          });
          
          return (
            <div
              key={index}
              style={{
                background: feature.gradient,
                borderRadius: '36px',
                padding: '40px',
                boxShadow: `
                  0 20px 50px ${feature.color}20,
                  0 6px 16px rgba(0,0,0,0.05),
                  inset 0 1px 1px rgba(255,255,255,0.8)
                `,
                border: `2px solid ${feature.color}35`,
                transform: `translateX(${cardX}px) scale(${cardScale})`,
                opacity: cardOpacity,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Card reflection */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '35%',
                background: 'linear-gradient(225deg, rgba(255,255,255,0.5) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />
              
              {/* Icon container */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '22px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: `
                  0 4px 16px ${feature.color}30,
                  inset 0 1px 1px rgba(255,255,255,0.6)
                `,
                border: `1px solid ${feature.color}30`
              }}>
                <span style={{
                  fontSize: '40px',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
                }}>
                  {feature.icon}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: FONTS.heading,
                fontSize: '32px',
                fontWeight: 700,
                color: feature.color,
                marginBottom: '10px',
                letterSpacing: '-0.3px'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '18px',
                color: `${COLORS.charcoal}75`,
                lineHeight: 1.5,
                fontWeight: 500
              }}>
                {feature.description}
              </p>
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
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          padding: '14px 28px',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <span style={{ fontSize: '22px' }}>💡</span>
          <span style={{
            fontFamily: FONTS.body,
            fontSize: '18px',
            fontWeight: 600,
            color: COLORS.charcoal
          }}>
            Designed for couples who want to grow
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
