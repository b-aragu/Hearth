// Landing Page Video - Exact Mobile Layout
// 6 Scenes, 42 seconds, exact components from hearth-web

export const COLORS = {
  cream: '#FFF9F0',
  coral: '#FFB7B2',
  peach: '#FFDAC1',
  mint: '#B5EAD7',
  lavender: '#C7CEEA',
  charcoal: '#2D2D3A',
  white: '#FFFFFF',
  darkBg: '#0B0B11',
  lightBg: '#FCF8F5',
  softPink: '#FFE5E5',
  gold: '#FFD700',
};

export const FPS = 30;

// 6 scenes, 42 seconds total
export const SCENES = {
  scene1_hero: { start: 0, duration: 6 * FPS },           // 0-6s: Hero
  scene2_creatures: { start: 6 * FPS, duration: 6 * FPS }, // 6-12s: Creature Selector
  scene3_howitworks: { start: 12 * FPS, duration: 6 * FPS }, // 12-18s: How It Works
  scene4_features: { start: 18 * FPS, duration: 8 * FPS },   // 18-26s: Features
  scene5_widgets: { start: 26 * FPS, duration: 10 * FPS },   // 26-36s: Widget Showcase (emphasized)
  scene6_cta: { start: 36 * FPS, duration: 6 * FPS },        // 36-42s: Final CTA
};

export const FONTS = {
  heading: "'Outfit', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
};

export const DESIGN = {
  phone: {
    width: '300px',
    height: '620px',
    borderRadius: '42px',
    border: '6px solid #2D2D3A',
    shadow: '0 20px 40px rgba(0,0,0,0.15), 0 40px 80px rgba(255,154,162,0.2)',
  },
  gradients: {
    coral: 'linear-gradient(135deg, #FFB7B2 0%, #FF9AA2 100%)',
    hero: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F5 50%, #F0FFF4 100%)',
  },
  borderRadius: {
    card: '24px',
    button: '9999px',
  }
};
