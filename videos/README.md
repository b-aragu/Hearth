# Hearth Promo Video v3.0
## Mobile-Optimized | Exact Landing Page Components | 8 Fast Scenes

### 🚀 Major Improvements

**1. Shorter, Snappier Scenes (45 seconds total)**
- Scene 1: Hook (5s) - "Grow Something Beautiful Together"
- Scene 2: Problem (5s) - "We were losing each other"
- Scene 3: Solution (6s) - "Then we found Hearth" + Creature
- Scene 4: How It Works (6s) - Daily Check-in + Send Love cards
- Scene 5: Phone Demo (6s) - Live app with day counter
- Scene 6: More Features (6s) - Widgets showcase
- Scene 7: Celebration (5s) - "100 Days! Still going strong"
- Scene 8: CTA (6s) - App Store buttons + hearth.app

**Total: 8 scenes in 45 seconds = 5-6 seconds per scene (fast & engaging)**

---

### 📱 Exact Landing Page Components Used

#### 1. **Creature Component** (`app/components/ui/Creature.tsx`)
**Used in Scenes 3, 5, 7**

```typescript
// Exact float animation from landing page
const floatY = Math.sin(frame * 0.08) * 12;
const shadowScale = 1 + Math.sin(frame * 0.08) * 0.08;

// Exact shadow styling
<div style={{
  width: '70px',
  height: '12px',
  background: 'rgba(0,0,0,0.1)',
  borderRadius: '50%',
  filter: 'blur(6px)',
  transform: `scale(${shadowScale})`
}} />
```

**Features:**
- 6s ease-in-out floating animation
- Shadow scales with float
- `drop-shadow-2xl` filter
- Bounce on entrance (spring animation)

#### 2. **Phone Mockup** (`app/sections/Hero.tsx`)
**Used in Scene 5 (full screen demo)**

```typescript
// Exact mobile dimensions
width: '340px',
height: '700px',
borderRadius: '48px',
border: '8px solid #2D2D3A',

// Exact shadow
boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 40px 80px rgba(255,154,162,0.2)'

// Dynamic Island
width: '100px',
height: '28px',
background: '#000',
borderRadius: '16px'
```

**Features:**
- Status bar (9:41 time)
- App header "OurHaven"
- Level 5 badge with coral dot
- Live day counter (animates 1-100)
- Creature floating with shadow

#### 3. **Feature Cards** (`app/sections/Features.tsx`)
**Used in Scenes 4, 6**

```typescript
// Card styling
background: 'white',
borderRadius: '24px',
padding: '20px',
boxShadow: '0 8px 24px rgba(0,0,0,0.06)',

// Icon containers
width: '48px',
height: '48px',
borderRadius: '16px',
background: 'linear-gradient(135deg, ${color} 0%, white 100%)',
boxShadow: '0 4px 12px ${color}40'
```

**Features:**
- Coral gradient for "Feed Your Pet"
- Mint gradient for "Send Love"
- Lavender for "Lock Screen"
- 3-column widget grid

#### 4. **Button Component** (`app/components/ui/Button.tsx`)
**Used in Scene 8**

```typescript
// Primary button style
background: 'linear-gradient(135deg, #FFB7B2 0%, #FF9AA2 100%)',
borderRadius: '9999px', // rounded-full
boxShadow: '0 12px 32px rgba(255,154,162,0.4)'

// App Store buttons
background: COLORS.charcoal,
borderRadius: '14px',
padding: '14px 22px'
```

#### 5. **Social Proof Badge** (`app/sections/Hero.tsx`)
**Used in Scenes 1, 8**

```typescript
background: 'rgba(255,255,255,0.6)',
backdropFilter: 'blur(12px)',
border: '1px solid rgba(255,255,255,0.4)',
borderRadius: '9999px',
padding: '8px 16px'

// Green pulse indicator
width: '8px',
height: '8px',
background: '#22C55E',
boxShadow: '0 0 8px rgba(34,197,94,0.4)'
```

#### 6. **Background Elements** (`app/sections/Hero.tsx`)
**Used in ALL scenes**

```typescript
// Blur orbs
top: '-10%',
right: '-5%',
width: '600px',
height: '600px',
background: 'bg-coral/20', // coral with 20% opacity
filter: 'blur(100px)',
mixBlendMode: 'multiply'

// Mesh gradient
background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F5 50%, #F0FFF4 100%)'
```

---

### 🎨 Design System (Exact Landing Page)

**Colors:**
```typescript
cream: '#FFF9F0'      // Background
coral: '#FFB7B2'      // Primary accent
peach: '#FFDAC1'      // Secondary
mint: '#B5EAD7'       // Success/positive
lavender: '#C7CEEA'   // Tertiary
charcoal: '#2D2D3A'   // Text
```

**Typography:**
```typescript
heading: "'Outfit', system-ui, sans-serif"  // All titles
body: "'DM Sans', system-ui, sans-serif"    // All body text
```

**Border Radius:**
```typescript
phone: '48px'       // 3rem
widgets: '20px'     // rounded-3xl
cards: '24px'       // rounded-[2rem]
buttons: '9999px'   // rounded-full
```

**Shadows:**
```typescript
phone: '0 20px 40px rgba(0,0,0,0.15), 0 40px 80px rgba(255,154,162,0.2)'
cards: '0 8px 24px rgba(0,0,0,0.06)'
buttons: '0 12px 32px rgba(255,154,162,0.4)'
```

---

### ⚡ Animation System

**Spring Physics (matching Framer Motion):**
```typescript
spring({
  frame,
  fps: 30,
  config: { damping: 12-20, stiffness: 80-200 },
  from: startValue,
  to: endValue
})
```

**Float Animation (exact Creature component):**
```typescript
const floatY = Math.sin(frame * 0.08) * 12;  // 6s cycle
const shadowScale = 1 + Math.sin(frame * 0.08) * 0.08;
```

**Fade/Slide:**
```typescript
interpolate(frame, [0, 20], [0, 1])   // Fade in
interpolate(frame, [0, 20], [20, 0])  // Slide up
```

---

### 📊 Scene Breakdown

| Scene | Duration | Content | Components Used |
|-------|----------|---------|-----------------|
| 1 | 5s | Hook | Social Proof Badge, Gradient Hero |
| 2 | 5s | Problem | Sad Creature, Float Animation |
| 3 | 6s | Solution | Happy Creature (bounce), Shadow |
| 4 | 6s | How It Works | Feature Cards (2), Icon Gradients |
| 5 | 6s | Phone Demo | Full Phone Mockup, Dynamic Island, Day Counter |
| 6 | 6s | More Features | Widget Grid (3 columns), Stats |
| 7 | 5s | Celebration | Confetti, Sparkles, Milestone Badge |
| 8 | 6s | CTA | Logo, App Store Buttons, URL |

---

### 🎯 Key Features

✅ **Exact mobile layout** (<1024px) - single column, full width
✅ **No external images** - pure CSS gradients + emojis
✅ **Fast cuts** - 5-6 seconds per scene, keeps attention
✅ **Component reuse** - Creature, Phone, Cards match landing page exactly
✅ **Mobile-optimized** - 1080×1920 (9:16 aspect ratio)
✅ **Bright & engaging** - No dark overlays, warm pastel colors
✅ **Spring animations** - Smooth, natural motion like Framer Motion
✅ **$10M/second quality** - Premium production value

---

### 🚀 How to Run

```bash
cd videos
npm run dev      # Preview in Remotion Studio
npm run build    # Export to out/video.mp4
```

---

### 📝 Notes

- **8 scenes in 45 seconds** = Super engaging, no boredom
- **Exact landing page components** = Brand consistency
- **Mobile-first design** = Perfect for Instagram/TikTok
- **Spring animations** = Premium feel
- **No images needed** = Fast load, no broken URLs

**The video IS a scrolling session through your landing page, brought to life in 45 seconds.** 🐻✨
