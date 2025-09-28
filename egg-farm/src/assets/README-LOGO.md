# Logo Conversion Instructions

## Current Logo Files

- `logo.svg` - Original detailed logo
- `logo-simple.svg` - Simplified version (currently used)

## Converting SVG to PNG

### Method 1: Online Converter
1. Go to https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
2. Upload the `logo-simple.svg` file
3. Set output size to 48x48 pixels (or higher for better quality)
4. Download the PNG file
5. Replace the import in components with the PNG file

### Method 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
magick logo-simple.svg -resize 48x48 logo.png
```

### Method 3: Using Inkscape (Free Software)
1. Open Inkscape
2. Open `logo-simple.svg`
3. Go to File > Export PNG Image
4. Set size to 48x48 pixels
5. Export as `logo.png`

### Method 4: Using Browser Developer Tools
1. Open the SVG file in a browser
2. Right-click and "Save image as"
3. Choose PNG format

## Logo Design

The logo features:
- Blue circular background (#1E40AF)
- Yellow chicken with red comb
- White egg
- White "A" initial for Abeyrathne
- Farm/agriculture theme

## Usage in Components

Currently used in:
- Navigation.jsx
- SignIn.jsx  
- Register.jsx

To switch to PNG:
1. Convert SVG to PNG using any method above
2. Update imports from `logo-simple.svg` to `logo.png`
3. Test the logo displays correctly

