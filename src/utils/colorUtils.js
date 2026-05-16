import { colornames } from 'color-name-list';

/**
 * Create a map of color names to hex codes
 * Includes colors from color-name-list library + custom colors
 */
const createColorMap = () => {
  const map = {};
  
  // Map all colors from the colornames library
  colornames.forEach(color => {
    map[color.name.toLowerCase()] = color.hex;
  });
  
  // Add custom colors that might not be in the library
  const customColors = {
    'lion': '#C19A6B',
    'pickled bean': '#6B4423',
    'tumbleweed': '#DEAA88',
    'bullet shell': '#8B8680',
    'rangoon green': '#1C1C13',
    'iridium': '#3D3C3A',
    'faded green': '#4F7942',
  };
  
  return { ...map, ...customColors };
};

// Create color map once and export it
export const colorMap = createColorMap();

/**
 * Convert a color name to its hex code
 * @param {string} colorName - The name of the color
 * @returns {string} Hex code of the color, or '#cccccc' if not found
 */
export const getColorHex = (colorName) => {
  if (!colorName) return '#cccccc';
  
  const normalized = colorName.toLowerCase().trim();
  
  // Try exact match
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }
  
  // Try partial match
  const matchingKey = Object.keys(colorMap).find(key => 
    key.includes(normalized) || normalized.includes(key)
  );
  
  if (matchingKey) {
    return colorMap[matchingKey];
  }
  
  // Default fallback
  return '#cccccc';
};

/**
 * Check if a color (hex code) is light or dark
 * Uses brightness calculation based on RGB values
 * @param {string} hex - Hex color code
 * @returns {boolean} True if color is light, false if dark
 */
export const isLightColor = (hex) => {
  if (!hex || hex === '#cccccc') return false;
  
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200;
  } catch (error) {
    return false;
  }
};

/**
 * Get border style based on color brightness
 * Light colors get a darker border, dark colors get a subtle border
 * @param {string} hex - Hex color code
 * @returns {string} CSS border style
 */
export const getBorderStyle = (hex) => {
  return isLightColor(hex) ? '1px solid #ddd' : '1px solid #ddd';
};
