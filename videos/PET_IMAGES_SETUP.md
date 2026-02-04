# Pet Images Setup

## Required Image Files

Add these 6 pet images to:
```
/home/baragu/Documents/Hearth/videos/public/assets/pets/
```

### File Names (must match exactly):
1. **bear.png** - Baby/young bear (cute, cartoon style preferred)
2. **bunny.png** - Baby/young bunny/rabbit
3. **puppy.png** - Baby/young puppy/dog
4. **cat.png** - Baby/young kitten/cat
5. **hamster.png** - Baby/young hamster
6. **penguin.png** - Baby/young penguin

### Image Specifications:
- **Format**: PNG (with transparency if possible)
- **Size**: 300×300px or larger (will be scaled down)
- **Style**: Cute, cartoon/illustrated style (like the original emojis)
- **Position**: Centered, full body visible
- **Background**: Transparent or white

### Where Images Appear:

**Scene 1 (Hero)** - `bear.png` (220×220px display)
- Main character on phone screen

**Scene 2 (Creatures)** - All 6 pets (130×130px display each)
- Grid showing all available companions

**Scene 5 (Lock Screen)** - `bear.png` (82×82px display)
- Lock screen widget preview

**Scene 6 (CTA)** - `bear.png` (26×26px display)
- Social proof badge

### Quick Setup:
```bash
# Place your images in this folder:
videos/public/assets/pets/

# Required files:
- bear.png
- bunny.png
- puppy.png
- cat.png
- hamster.png
- penguin.png
```

### Tips for Best Results:
- Use consistent art style across all 6 pets
- Make them look cute and appealing (like the emojis were)
- Ensure they have some "personality"
- Animated GIFs won't work in Remotion (use static PNGs)
- If you can't find perfect images, placeholder images will show "Image not found" but the video will still work

### Alternative:
If you don't have images ready, the video will show broken image icons but will still function. You can add images later and just rebuild.
