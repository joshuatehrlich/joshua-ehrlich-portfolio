# Dynamic CSV-Based Artwork Data System

## 🎯 Zero Configuration Required

This system automatically discovers and loads artwork from CSV files. **No code changes needed** when adding new categories!

## Quick Start

### 1. Create a CSV file
Just create `your-category.csv` in this directory:

```csv
imagePath,title,year,medium,description
my-image.jpg,My Artwork,2024,Digital,A beautiful piece
another.jpg,,,,
```

### 2. That's it!
Your new category automatically appears in the UI. No imports, no configuration, nothing!

## How It Works

### Automatic Discovery
- Uses Vite's `import.meta.glob()` to find all `.csv` files
- Category name = filename (e.g., `comics.csv` → "Comics")
- Folder path defaults to `{category-name}/`

### Smart Defaults
If you don't specify a field, it gets intelligent defaults:
- `id`: Generated from filename
- `title`: Generated from filename (pretty formatted)
- `year`: Current year
- `medium`: "Digital" (or category-specific default)
- `description`: Empty string (or category-specific default)

### Ignored Files
Files starting with `_` or named `config`, `data`, or `example-*` are automatically ignored.

## CSV Format

### Minimal (Only imagePath required)
```csv
imagePath
sketch.jpg
painting.jpg
```

### Full Details
```csv
imagePath,title,year,medium,description
masterpiece.jpg,The Great Work,2023,Oil on Canvas,"A stunning piece, with commas!"
```

### Custom Fields (e.g., for Comics)
```csv
imagePath,title,pageNumber,issueNumber,series
page1.jpg,The Beginning,1,1,My Series
page2.jpg,The Journey,2,1,My Series
```

## Category Configuration (Optional)

You can add category-specific defaults in `loader.ts` under `DEFAULT_CATEGORY_CONFIGS`:

```typescript
'my-category': {
  folderPath: 'custom-folder/',
  defaults: {
    medium: 'Custom Medium',
    description: 'Default description'
  }
}
```

But this is **completely optional**! Categories work fine without it.

## Examples

### Example 1: New Category Without Config
**File**: `photography.csv`
```csv
imagePath,title,year
photo1.jpg,Sunset,2024
photo2.jpg,Portrait,2024
```

**Result**:
- Category: "Photography"
- Folder: `photography/`
- Medium: "Digital" (default)
- Works immediately!

### Example 2: Comics with Custom Fields
**File**: `comics.csv`
```csv
imagePath,title,pageNumber,issueNumber
page1.jpg,Issue 1 Page 1,1,1
page2.jpg,Issue 1 Page 2,2,1
```

**Result**:
- Category: "Comics"
- Custom fields preserved: `artwork.pageNumber`, `artwork.issueNumber`
- Access in templates: `{artwork.pageNumber}`

### Example 3: Multi-Category CSV
**File**: `all-art.csv`
```csv
category,imagePath,title
editorial,piece1.jpg,Editorial Work
comics,page1.jpg,Comic Page
concept,design1.jpg,Concept Art
```

**Result**:
- Three separate categories from one file
- Each row goes to its specified category

## Workflow

### Adding New Category
1. Create `new-category.csv`
2. Add artwork entries
3. **Done!** Category appears automatically in UI

### Adding Artwork
1. Open existing CSV in Excel/Google Sheets
2. Add new row with imagePath
3. Save
4. **Done!** Artwork appears automatically

### Custom Fields
1. Add column to CSV: `customField`
2. Fill in values
3. Access in code: `artwork.customField`

## File Organization

You can organize CSV files in folders or keep them flat:

### Flat Structure
```
src/data/
├── editorial.csv
├── concept-art.csv
├── illustration.csv
└── comics.csv
```

### Folder Structure (Recommended for Organization)
```
src/data/
├── comics/
│   ├── exile.csv          ← Category: "exile"
│   ├── series-1.csv       ← Category: "series-1"
│   └── series-2.csv       ← Category: "series-2"
├── illustration/
│   ├── editorial.csv      ← Category: "editorial"
│   └── concept-art.csv    ← Category: "concept-art"
├── _config.csv            ← Optional config (ignored)
├── loader.ts              ← Auto-discovery logic
└── types.ts               ← Type definitions
```

**Note**: Category name comes from the **filename**, not the folder name!
- `comics/exile.csv` → Category: "Exile"
- `my-folder/my-art.csv` → Category: "My Art"

## Tips

- **Use hyphens in filenames**: `concept-art.csv` → "Concept Art"
- **Prefix with `_` to ignore**: `_backup.csv` won't load
- **Edit in spreadsheet software**: Excel, Google Sheets, etc.
- **Quoted values for commas**: `"Title, with comma",2024`
- **Leave fields empty**: They'll get smart defaults

## Advanced: Category-Specific Defaults

Edit `DEFAULT_CATEGORY_CONFIGS` in `loader.ts` to customize:

```typescript
'comics': {
  folderPath: 'comics/',           // Where images are stored
  defaults: {
    medium: 'Digital Comics',      // Default medium
    description: 'Comic artwork',  // Default description
    pageNumber: 0                  // Custom default field
  }
}
```

But remember: **This is optional!** Categories work great without it.
