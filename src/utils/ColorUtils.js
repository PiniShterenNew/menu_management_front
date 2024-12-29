// ColorUtils.js

// פונקציה להמרת HEX לRGB
export const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  // פונקציה לבדיקה האם צבע הוא כהה
  export const isColorDark = (hex) => {
    const { r, g, b } = hexToRGB(hex);
    // נוסחה לחישוב בהירות הצבע
    return (r * 0.299 + g * 0.587 + b * 0.114) < 160;
  };
  
  // פונקציה ליצירת גרסה שקופה של הצבע
  export const getAlphaColor = (hex, alpha = 0.15) => {
    const { r, g, b } = hexToRGB(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };