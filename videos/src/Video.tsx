import React from 'react';
import { Composition, Sequence } from 'remotion';
import { FPS, SCENES } from './constants/colors';
import { Scene1_Hero } from './scenes/Scene1_Hero';
import { Scene2_Creatures } from './scenes/Scene2_Creatures';
import { Scene3_HowItWorks } from './scenes/Scene3_HowItWorks';
import { Scene4_Features } from './scenes/Scene4_Features';
import { Scene5_Widgets } from './scenes/Scene5_Widgets';
import { Scene6_CTA } from './scenes/Scene6_CTA';

// Main video - 6 scenes, 42 seconds total
const HearthVideo: React.FC = () => {
  return (
    <>
      {/* Scene 1: Hero - 0 to 6 seconds */}
      <Sequence
        from={SCENES.scene1_hero.start}
        durationInFrames={SCENES.scene1_hero.duration}
      >
        <Scene1_Hero />
      </Sequence>

      {/* Scene 2: Creature Selector - 6 to 12 seconds */}
      <Sequence
        from={SCENES.scene2_creatures.start}
        durationInFrames={SCENES.scene2_creatures.duration}
      >
        <Scene2_Creatures />
      </Sequence>

      {/* Scene 3: How It Works - 12 to 18 seconds */}
      <Sequence
        from={SCENES.scene3_howitworks.start}
        durationInFrames={SCENES.scene3_howitworks.duration}
      >
        <Scene3_HowItWorks />
      </Sequence>

      {/* Scene 4: Features - 18 to 26 seconds */}
      <Sequence
        from={SCENES.scene4_features.start}
        durationInFrames={SCENES.scene4_features.duration}
      >
        <Scene4_Features />
      </Sequence>

      {/* Scene 5: Widget Showcase - 26 to 36 seconds */}
      <Sequence
        from={SCENES.scene5_widgets.start}
        durationInFrames={SCENES.scene5_widgets.duration}
      >
        <Scene5_Widgets />
      </Sequence>

      {/* Scene 6: Final CTA - 36 to 42 seconds */}
      <Sequence
        from={SCENES.scene6_cta.start}
        durationInFrames={SCENES.scene6_cta.duration}
      >
        <Scene6_CTA />
      </Sequence>
    </>
  );
};

// Root component
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HearthPromoVideo"
        component={HearthVideo}
        durationInFrames={42 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
