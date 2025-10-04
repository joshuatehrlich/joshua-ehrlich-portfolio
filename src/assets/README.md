# Assets Directory

**Put all your images here.** Astro handles the rest automatically.

## What Astro Does For You

When you add images to this folder, Astro automatically:
- ✅ Creates optimized thumbnails
- ✅ Converts to WebP/AVIF for modern browsers
- ✅ Generates multiple sizes for responsive design
- ✅ Enables lazy loading
- ✅ Reduces file sizes by 50-80%
- ✅ Preserves your original for full-size viewing

## Structure

```
assets/
├── art/
│   ├── concept/      # Concept art & illustrations
│   ├── character/    # Character designs
│   ├── academic/     # Studies & academic work
│   └── sketchbook/   # Sketchbook pages
├── projects/
│   ├── dust/         # Dust card game assets
│   ├── earthen/      # Earthen video game assets
│   └── game-jams/    # Game jam screenshots
└── about/            # About page images
```

## Usage

### Import and use:
```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/art/concept/giant.jpg';
---

<!-- Gallery view (auto-optimized) -->
<Image src={myImage} alt="Description" width={600} />

<!-- Full-size link (same image!) -->
<a href={myImage.src}>View Full Size</a>
```

### Dynamic imports for galleries:
```astro
---
const images = import.meta.glob('../assets/art/concept/*.{jpg,png}');
---
```

## That's It!

Just drop your high-res images in the appropriate folder, and Astro does all the optimization work for you. No need to manually create thumbnails or different versions.
