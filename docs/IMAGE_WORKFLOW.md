# Image Workflow

## Simple 3-Step Process

### Step 1: Add Your Images

Put your high-res images in the appropriate folder:

```
src/assets/art/concept/giant.jpg
src/assets/art/character/alice.jpg
src/assets/projects/dust/card-design.jpg
```

**That's it!** You don't need to create multiple versions - Astro handles that.

### Step 2: Add Metadata (Optional)

Create data files to organize your work:

```typescript
// src/data/art/concept.ts
export const conceptArt = [
  {
    id: 'giant',
    title: 'Giant',
    description: '40 by 60 inches, copic on illustration board',
    imagePath: 'concept/giant.jpg',
    year: 2024
  }
];
```

### Step 3: Display in Gallery

```astro
---
import { Image } from 'astro:assets';
import giantImg from '../assets/art/concept/giant.jpg';
---

<!-- Astro automatically optimizes -->
<Image 
  src={giantImg} 
  alt="Giant" 
  width={600}
  loading="lazy"
/>
```

## What Astro Does Automatically

From your single high-res image, Astro generates:
- Thumbnail version (for grid galleries)
- Medium version (for page display)
- WebP version (for modern browsers)
- AVIF version (for cutting-edge browsers)
- Original is still accessible (for "view full size")

## Performance Benefits

- **Lazy loading** - Images load as you scroll
- **Smaller files** - 50-80% size reduction
- **Modern formats** - WebP/AVIF when supported
- **Responsive** - Right size for each screen
- **Fast builds** - Cached after first optimization

## Migration from Old Structure

Your old images are in `_archive/old-public/illustration/`

**Old way (3 files per image):**
```
giant.jpg          # medium
giant-lowres.jpg   # thumbnail ❌ Delete this
giant-full.jpg     # full ❌ Delete this
```

**New way (1 file per image):**
```
src/assets/art/concept/giant.jpg  # Astro generates all versions!
```

Just copy the best quality version you have to `src/assets/`, and delete the duplicates.
