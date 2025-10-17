# CSV Data Management Guide

This guide explains how to manage your artwork data using CSV files with complete flexibility.

## Quick Start

### 1. Create a CSV file
Create any `.csv` file in `src/data/` (e.g., `editorial.csv`, `comics.csv`, `my-art.csv`)

### 2. Add your artwork
Only `imagePath` is required. Everything else is optional!

```csv
imagePath,title,year,medium,description
my-image.jpg,My Artwork,2024,Digital,A beautiful piece
another.jpg,,,,
```

### 3. Done!
Your category appears automatically in the UI. No code changes needed!

## Features

### ✅ Zero Hardcoding
- No variables hardcoded anywhere
- Categories discovered automatically from CSV files
- Custom fields supported per category

### ✅ Flexible Data Entry
- **Required**: Only `imagePath`
- **Optional**: Everything else (title, year, medium, description, etc.)
- **Custom fields**: Add any fields you want (pageNumber, issueNumber, series, etc.)

### ✅ Multiple Approaches
- **Single category per CSV**: `editorial.csv` contains only editorial artwork
- **Multiple categories in one CSV**: Use a `category` column to separate
- **Mix and match**: Some CSVs single-category, some multi-category

## CSV Format Options

### Option 1: Single Category CSV (Simplest)

**File**: `editorial.csv`
```csv
imagePath,title,year,medium,description
giant.jpg,Giant,2024,Copic on illustration board,40 by 60 inches.
exodus.jpg,The Exodus,2023,Digital Painting,Narrative illustration.
sketch.jpg,,,,
```

- Category name = filename (`editorial`)
- All rows belong to this category
- Minimal data entry

### Option 2: Multi-Category CSV

**File**: `all-artwork.csv`
```csv
category,imagePath,title,year,medium,description
editorial,giant.jpg,Giant,2024,Copic on illustration board,40 by 60 inches.
concept-art,dragon.jpg,Dragon Concept,2023,Digital Painting,Concept art.
illustration,sketch.jpg,,,,
```

- `category` column determines which category each row belongs to
- One file for all artwork
- Easy to manage in spreadsheet software

### Option 3: Custom Fields (Comics Example)

**File**: `comics.csv`
```csv
imagePath,title,year,medium,description,pageNumber,issueNumber,series
page1.jpg,The Beginning,2024,Digital Comics,Opening page,1,1,My Comic Series
page2.jpg,The Journey,2024,Digital Comics,Second page,2,1,My Comic Series
cover.jpg,Issue 1 Cover,2024,Digital Comics,Cover art,0,1,My Comic Series
```

- Add any custom fields you need
- Fields are preserved in the Artwork object
- Access them in your components: `artwork.pageNumber`, `artwork.series`, etc.

## Configuration File (Optional)

Create `_config.csv` to set defaults per category:

```csv
category,folderPath,defaultMedium,defaultDescription
editorial,illustration/,Editorial Illustration,Editorial illustration work.
concept-art,illustration/,Digital Concept Art,Concept art and design work.
comics,comics/,Digital Comics,Comic book and sequential art.
```

**What it does:**
- `folderPath`: Prepends to all imagePaths (so you can just write `image.jpg` instead of `illustration/image.jpg`)
- `defaultMedium`: Default medium if not specified
- `defaultDescription`: Default description if not specified
- Add any other default fields you want!

**Without config file:**
- Smart defaults are used automatically
- `folderPath` defaults to `{category-name}/`
- `defaultMedium` defaults to `"Digital"`

## Field Behavior

### Required Fields
- `imagePath`: The only required field

### Optional Standard Fields
- `id`: Auto-generated from filename if not provided
- `title`: Auto-generated from filename if not provided
- `year`: Defaults to current year
- `medium`: Defaults from config or "Digital"
- `description`: Defaults from config or empty string

### Custom Fields
- Add ANY field you want: `pageNumber`, `issueNumber`, `series`, `character`, etc.
- They're automatically included in the Artwork object
- Access them in your templates: `{artwork.pageNumber}`

## Examples

### Minimal Entry
```csv
imagePath
sketch.jpg
```
Result:
```typescript
{
  id: 'sketch',
  title: 'Sketch',
  year: 2024,
  medium: 'Digital',
  description: '',
  imagePath: 'editorial/sketch.jpg'
}
```

### Full Entry
```csv
imagePath,title,year,medium,description
masterpiece.jpg,The Great Masterpiece,2023,Oil on Canvas,A stunning work of art.
```

### Custom Fields
```csv
imagePath,title,pageNumber,issueNumber
page1.jpg,The Beginning,1,1
page2.jpg,The Journey,2,1
```
Result:
```typescript
{
  id: 'page1',
  title: 'The Beginning',
  year: 2024,
  medium: 'Digital',
  description: '',
  imagePath: 'comics/page1.jpg',
  pageNumber: 1,
  issueNumber: 1
}
```

## Usage in Pages

### Show All Categories
```astro
const CATEGORIES = loadAllArtworkCollections();
```

### Show Specific Categories
```astro
const allCategories = loadAllArtworkCollections();
const CATEGORIES = allCategories.filter(cat => 
  ['editorial', 'concept-art'].includes(cat.key)
);
```

### Exclude Certain Categories
```astro
const allCategories = loadAllArtworkCollections();
const CATEGORIES = allCategories.filter(cat => 
  !['comics', 'test'].includes(cat.key)
);
```

## Workflow

### Adding New Category
1. Create `new-category.csv`
2. Add artwork entries
3. Done! Category appears automatically

### Adding Custom Fields
1. Add column to CSV: `pageNumber,issueNumber,series`
2. Fill in values
3. Access in templates: `{artwork.pageNumber}`

### Organizing Files
- Images go in `src/assets/{category}/`
- Or set custom `folderPath` in `_config.csv`
- Or use full paths in CSV: `custom/path/image.jpg`

## Tips

- Use Excel/Google Sheets for easy editing
- Copy/paste from other sources
- No syntax errors (unlike JSON/TypeScript)
- Version control friendly
- Supports quoted values with commas: `"Title, with comma",2024`

## File Naming Conventions

- Use lowercase with hyphens: `concept-art.csv`, `my-category.csv`
- Prefix with `_` to ignore: `_template.csv`, `_backup.csv`
- Category name = filename without `.csv`

