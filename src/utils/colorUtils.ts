/**
 * RGB değerlerini HEX formatına dönüştürür.
 * @param r Kırmızı değeri (0-255)
 * @param g Yeşil değeri (0-255)
 * @param b Mavi değeri (0-255)
 * @returns HEX formatında renk kodu (#RRGGBB)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Rastgele bir RGB rengi oluşturur.
 * @returns { r: number, g: number, b: number } formatında renk nesnesi
 */
export function generateRandomColor(): { r: number; g: number; b: number } {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

/**
 * İki renk arasındaki Euclidean mesafesini hesaplar.
 * @param color1 İlk renk { r, g, b }
 * @param color2 İkinci renk { r, g, b }
 * @returns Renkler arasındaki mesafe (0-441.67 arası)
 */
export function calculateColorDistance(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  
  // Euclidean mesafesi
  return Math.sqrt(dr * dr + dg * dg + db * db);
}