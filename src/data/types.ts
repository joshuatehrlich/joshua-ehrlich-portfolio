// Shared types for all artwork across the site

export interface Artwork {
  id: string;              // Unique identifier (filename without extension)
  title: string;           // Display title
  year: number;            // Year created
  medium: string;          // Medium (e.g., "Copic on illustration board", "Digital", etc.)
  description: string;     // Description text
  imagePath: string;       // Relative path from src/assets/ (e.g., "index/Dragon_HQ.png")
  category?: string;       // Optional category (concept, character, academic, etc.)
}

export interface ArtworkCollection {
  name: string;
  works: Artwork[];
}

