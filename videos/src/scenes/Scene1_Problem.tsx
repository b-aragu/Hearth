import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, DESIGN } from '../constants/colors';

// Scene 1: Quick Hook (0-5s)
export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [120, 150], [1, 0], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{
      background: DESIGN.gradients.hero,
      opacity: exitOpacity
    }}>
      {/* Blur orbs like landing page */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: COLORS.coral,
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: 0.25,
        mixBlendMode: 'multiply'
      }} />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        zIndex: 10
      }}>
        {/* Social proof badge - exact landing page style */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.4)',
          padding: '8px 16px',
          borderRadius: '9999px',
          marginBottom: '24px',
          opacity: titleOpacity
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22C55E',
            boxShadow: '0 0 8px rgba(34,197,94,0.4)'
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: COLORS.charcoal,
            fontFamily: FONTS.body
          }}>
            10,247 couples growing together
          </span>
        </div>
        
        {/* Main headline - exact landing page text */}
        <h1 style={{
          fontFamily: FONTS.heading,
          fontSize: '52px',
          fontWeight: 800,
          color: COLORS.charcoal,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`
        }}>
          Grow Something
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #FFB7B2 0%, #C7CEEA 50%, #B5EAD7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Beautiful Together
          </span>
        </h1>
        
        {/* Subheadline */}
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '18px',
          color: `${COLORS.charcoal}B3`,
          textAlign: 'center',
          marginTop: '16px',
          opacity: titleOpacity
        }}>
          Raise a digital pet with your partner
        </p>
      </div>
    </AbsoluteFill>
  );
};
