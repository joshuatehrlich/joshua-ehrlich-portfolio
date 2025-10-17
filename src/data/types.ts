// Shared types for all artwork across the site

// Base artwork with only required field
export interface ArtworkInput {
  imagePath: string;        // Only required field
  [key: string]: any;       // Allow any additional fields dynamically
}

// Standard artwork fields (all optional except imagePath)
export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  description: string;
  imagePath: string;
  [key: string]: any;       // Allow custom fields like pageNumber, etc.
}

export interface ArtworkCollection {
  key: string;
  label: string;
  artwork: Artwork[];
}

// Factory function with dynamic field support
export function createArtwork(
  input: ArtworkInput, 
  defaults: Partial<Artwork> = {}
): Artwork {
  const filename = input.imagePath.split('/').pop()?.split('.')[0] || 'untitled';
  
  // Start with base fields
  const artwork: Artwork = {
    id: input.id || filename,
    title: input.title || filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    year: input.year || defaults.year || new Date().getFullYear(),
    medium: input.medium || defaults.medium || 'Digital',
    description: input.description || defaults.description || '',
    imagePath: input.imagePath,
  };
  
  // Add any additional custom fields from input
  Object.keys(input).forEach(key => {
    if (!['id', 'title', 'year', 'medium', 'description', 'imagePath'].includes(key)) {
      artwork[key] = input[key];
    }
  });
  
  // Add any additional custom fields from defaults
  Object.keys(defaults).forEach(key => {
    if (!artwork[key] && !['id', 'title', 'year', 'medium', 'description', 'imagePath'].includes(key)) {
      artwork[key] = defaults[key];
    }
  });
  
  return artwork;
}

