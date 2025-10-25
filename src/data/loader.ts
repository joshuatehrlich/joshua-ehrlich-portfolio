import { createArtwork, type Artwork, type ArtworkCollection } from './types';

// Dynamically import ALL CSV files using Vite's glob import (including subfolders)
const csvFiles = import.meta.glob('./**/*.csv', { as: 'raw', eager: true });

// Import config file if it exists
const configFiles = import.meta.glob('./_config.csv', { as: 'raw', eager: true });
const configCSV = configFiles['./_config.csv'] as string | undefined;

export interface CategoryConfig {
  folderPath: string;
  label?: string;
  defaults?: Record<string, any>;
}

// Parse config CSV into a map of category configs
const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {};

if (configCSV) {
  const lines = configCSV.split('\n').filter(line => line.trim());
  if (lines.length > 1) {
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const categoryIndex = headers.indexOf('category');
      
      if (categoryIndex >= 0 && values[categoryIndex]) {
        const categoryKey = values[categoryIndex];
        const config: CategoryConfig = {
          folderPath: '',
          defaults: {}
        };
        
        headers.forEach((header, index) => {
          const value = values[index];
          if (value) {
            if (header === 'folderPath') {
              config.folderPath = value;
            } else if (header === 'label') {
              config.label = value;
            } else if (header === 'defaultMedium') {
              config.defaults!.medium = value;
            } else if (header === 'defaultDescription') {
              config.defaults!.description = value;
            } else if (header !== 'category') {
              // Any other column becomes a default field
              config.defaults![header] = value;
            }
          }
        });
        
        CATEGORY_CONFIGS[categoryKey] = config;
      }
    }
  }
}

/**
 * Parse CSV line handling quoted values with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Get configuration for a category
 */
function getCategoryConfig(categoryKey: string): CategoryConfig {
  // Check if there's a config from _config.csv
  if (CATEGORY_CONFIGS[categoryKey]) {
    return CATEGORY_CONFIGS[categoryKey];
  }
  
  // Smart defaults based on category name
  return {
    folderPath: `${categoryKey}/`,
    defaults: {
      medium: 'Digital',
      description: ''
    }
  };
}

/**
 * Parse CSV content into artwork array
 */
function parseCSV(csvContent: string, categoryKey: string): Artwork[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const config = getCategoryConfig(categoryKey);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const input: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      if (value) {
        // Handle numeric fields
        if (header === 'year' || header === 'pageNumber' || header === 'issueNumber') {
          input[header] = parseInt(value);
        } else {
          input[header] = value;
        }
      }
    });
    
    // Add folder prefix if it doesn't already have one
    // Skip URLs (http://, https://) as they don't need folder prefixes
    const isUrl = input.imagePath && (input.imagePath.startsWith('http://') || input.imagePath.startsWith('https://'));
    if (input.imagePath && config.folderPath && !isUrl) {
      if (!input.imagePath.startsWith(config.folderPath)) {
        input.imagePath = config.folderPath + input.imagePath;
      }
    }
    
    if (!input.imagePath) {
      throw new Error(`Missing imagePath in CSV line: ${line}`);
    }
    
    return createArtwork(input as any, config.defaults || {});
  });
}

/**
 * Extract category key from file path
 */
function getCategoryKeyFromPath(filePath: string): string {
  // Extract filename without extension from paths like:
  // "./editorial.csv" → "editorial"
  // "./comics/exile.csv" → "exile"
  // "./my-folder/my-category.csv" → "my-category"
  const match = filePath.match(/\/([^/]+)\.csv$/);
  return match ? match[1] : 'unknown';
}

/**
 * Generate label from category key
 */
function generateLabel(categoryKey: string): string {
  return categoryKey
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Load all artwork collections dynamically from CSV files
 */
export function loadAllArtworkCollections(): ArtworkCollection[] {
  const collections: ArtworkCollection[] = [];
  
  // Iterate through all discovered CSV files
  Object.entries(csvFiles).forEach(([filePath, csvContent]) => {
    const categoryKey = getCategoryKeyFromPath(filePath);
    
    // Skip special files
    if (categoryKey.startsWith('_') || 
        categoryKey === 'config' || 
        categoryKey === 'data' ||
        categoryKey.startsWith('example-')) {
      return;
    }
    
    try {
      const artwork = parseCSV(csvContent as string, categoryKey);
      
      if (artwork.length > 0) {
        // Use label from config if available, otherwise generate from key
        const config = CATEGORY_CONFIGS[categoryKey];
        const label = config?.label || generateLabel(categoryKey);
        
        collections.push({
          key: categoryKey,
          label: label,
          artwork
        });
      }
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
    }
  });
  
  return collections;
}

/**
 * Load specific categories by keys
 */
export function loadArtworkCollections(categoryKeys: string[]): ArtworkCollection[] {
  const allCollections = loadAllArtworkCollections();
  return allCollections.filter(col => categoryKeys.includes(col.key));
}

/**
 * Load a single category by key
 */
export function loadArtworkCollection(categoryKey: string): ArtworkCollection | null {
  const allCollections = loadAllArtworkCollections();
  return allCollections.find(col => col.key === categoryKey) || null;
}
