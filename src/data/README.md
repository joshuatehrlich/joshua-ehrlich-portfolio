# Data Directory

Centralized data storage for all artwork metadata across the site.

## Structure

```
data/
├── types.ts         # Shared TypeScript interfaces
├── index.ts         # Homepage gallery artwork
├── art/
│   ├── concept.ts   # Concept art collection
│   ├── character.ts # Character design collection
│   ├── academic.ts  # Studies collection
│   └── sketchbook.ts # Sketchbook collection
└── projects/
    ├── dust.ts      # Dust card game
    ├── earthen.ts   # Earthen video game
    └── game-jams.ts # Game jam projects
```

## Artwork Interface

Every artwork entry includes:

```typescript
{
  id: string;         // Unique identifier (usually filename without extension)
  title: string;      // Display title
  year: number;       // Year created
  medium: string;     // Medium used (e.g., "Digital", "Copic on board")
  description: string; // Description text
  imagePath: string;  // Path from src/assets/ (e.g., "art/concept/giant.jpg")
  category?: string;  // Optional category tag
}
```

## Usage Example

```typescript
// src/data/art/concept.ts
import type { Artwork } from '../types';

export const conceptArt: Artwork[] = [
  {
    id: 'giant',
    title: 'Giant',
    year: 2024,
    medium: 'Copic on illustration board',
    description: '40 by 60 inches. Winner of Silver award.',
    imagePath: 'art/concept/giant.jpg'
  }
];
```

Then use in pages:

```astro
---
import { conceptArt } from '../data/art/concept';
---

{conceptArt.map(art => (
  <div>
    <h2>{art.title}</h2>
    <p>{art.year} • {art.medium}</p>
  </div>
))}
```

## Benefits

- ✅ Single source of truth for metadata
- ✅ Type-safe with TypeScript
- ✅ Easy to update without touching components
- ✅ Consistent data structure across all pages
- ✅ Can add new fields without breaking existing code

