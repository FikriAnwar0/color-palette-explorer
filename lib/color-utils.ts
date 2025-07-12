// Helper function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Helper function to convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

// Helper function to convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

// Helper function to convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, "0").toUpperCase()
}

// Helper function to convert Hex to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

// Helper function to calculate luminance
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

// Helper function to calculate contrast ratio
export function getContrastRatio(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number },
): number {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

// Helper function to get WCAG compliance
export function getWCAGCompliance(ratio: number): { AA: boolean; AAA: boolean } {
  return {
    AA: ratio >= 4.5, // 4.5:1 for normal text, 3:1 for large text (we'll use 4.5 for simplicity)
    AAA: ratio >= 7, // 7:1 for normal text, 4.5:1 for large text (we'll use 7 for simplicity)
  }
}

// Main function to generate color palette
export function generatePalette(
  baseHex: string,
  type: "analogous" | "complementary" | "triadic" | "monochromatic" | "tetradic" | "square",
  saturation: number,
  lightness: number,
  numColors = 5,
): string[] {
  const rgb = hexToRgb(baseHex)
  if (!rgb) return []

  const baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const generatedPalette: string[] = []

  // Apply user-defined saturation and lightness to the base color
  const adjustedBaseHsl = { h: baseHsl.h, s: saturation, l: lightness }

  // Always include the adjusted base color
  generatedPalette.push(
    rgbToHex(
      hslToRgb(adjustedBaseHsl.h, adjustedBaseHsl.s, adjustedBaseHsl.l).r,
      hslToRgb(adjustedBaseHsl.h, adjustedBaseHsl.s, adjustedBaseHsl.l).g,
      hslToRgb(adjustedBaseHsl.h, adjustedBaseHsl.s, adjustedBaseHsl.l).b,
    ),
  )

  const addColorToPalette = (h: number, s: number, l: number) => {
    generatedPalette.push(rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b))
  }

  switch (type) {
    case "analogous":
      // Analogous colors are next to each other on the color wheel (e.g., +/- 30 degrees)
      for (let i = 1; generatedPalette.length < numColors; i++) {
        const newHue1 = (adjustedBaseHsl.h + i * 30 + 360) % 360
        const newHue2 = (adjustedBaseHsl.h - i * 30 + 360) % 360
        addColorToPalette(newHue1, adjustedBaseHsl.s, adjustedBaseHsl.l)
        if (generatedPalette.length < numColors) {
          addColorToPalette(newHue2, adjustedBaseHsl.s, adjustedBaseHsl.l)
        }
      }
      break
    case "complementary":
      // Complementary colors are opposite on the color wheel (180 degrees apart)
      const complementaryHue = (adjustedBaseHsl.h + 180) % 360
      addColorToPalette(complementaryHue, adjustedBaseHsl.s, adjustedBaseHsl.l)

      // Add variations of lightness/saturation for more colors
      while (generatedPalette.length < numColors) {
        const lastColorHsl = hexToHsl(generatedPalette[generatedPalette.length - 1])!
        const newLightness = (lastColorHsl.l + 20) % 100
        const newSaturation = (lastColorHsl.s + 10) % 100
        addColorToPalette(lastColorHsl.h, newSaturation, newLightness)
      }
      break
    case "triadic":
      // Triadic colors are evenly spaced on the color wheel (120 degrees apart)
      const triadicHue1 = (adjustedBaseHsl.h + 120) % 360
      const triadicHue2 = (adjustedBaseHsl.h + 240) % 360
      addColorToPalette(triadicHue1, adjustedBaseHsl.s, adjustedBaseHsl.l)
      addColorToPalette(triadicHue2, adjustedBaseHsl.s, adjustedBaseHsl.l)

      // Add variations
      while (generatedPalette.length < numColors) {
        const lastColorHsl = hexToHsl(generatedPalette[generatedPalette.length - 1])!
        const newLightness = (lastColorHsl.l + 15) % 100
        const newSaturation = (lastColorHsl.s + 5) % 100
        addColorToPalette(lastColorHsl.h, newSaturation, newLightness)
      }
      break
    case "monochromatic":
      // Monochromatic colors vary in lightness and saturation
      for (let i = 1; generatedPalette.length < numColors; i++) {
        const newLightness1 = Math.max(0, Math.min(100, adjustedBaseHsl.l + i * 15))
        const newSaturation1 = Math.max(0, Math.min(100, adjustedBaseHsl.s + i * 5))
        addColorToPalette(adjustedBaseHsl.h, newSaturation1, newLightness1)

        if (generatedPalette.length < numColors) {
          const newLightness2 = Math.max(0, Math.min(100, adjustedBaseHsl.l - i * 15))
          const newSaturation2 = Math.max(0, Math.min(100, adjustedBaseHsl.s - i * 5))
          addColorToPalette(adjustedBaseHsl.h, newSaturation2, newLightness2)
        }
      }
      break
    case "tetradic":
      // Tetradic colors form a rectangle on the color wheel (e.g., 0, 90, 180, 270 degrees)
      const tetradicHue1 = (adjustedBaseHsl.h + 90) % 360
      const tetradicHue2 = (adjustedBaseHsl.h + 180) % 360
      const tetradicHue3 = (adjustedBaseHsl.h + 270) % 360
      addColorToPalette(tetradicHue1, adjustedBaseHsl.s, adjustedBaseHsl.l)
      addColorToPalette(tetradicHue2, adjustedBaseHsl.s, adjustedBaseHsl.l)
      addColorToPalette(tetradicHue3, adjustedBaseHsl.s, adjustedBaseHsl.l)

      // Add variations if more colors are needed
      while (generatedPalette.length < numColors) {
        const lastColorHsl = hexToHsl(generatedPalette[generatedPalette.length - 1])!
        const newLightness = (lastColorHsl.l + 10) % 100
        const newSaturation = (lastColorHsl.s + 5) % 100
        addColorToPalette(lastColorHsl.h, newSaturation, newLightness)
      }
      break
    case "square":
      // Square colors form a square on the color wheel (e.g., 0, 90, 180, 270 degrees, similar to tetradic but often with more balanced distribution)
      const squareHue1 = (adjustedBaseHsl.h + 90) % 360
      const squareHue2 = (adjustedBaseHsl.h + 180) % 360
      const squareHue3 = (adjustedBaseHsl.h + 270) % 360
      addColorToPalette(squareHue1, adjustedBaseHsl.s, adjustedBaseHsl.l)
      addColorToPalette(squareHue2, adjustedBaseHsl.s, adjustedBaseHsl.l)
      addColorToPalette(squareHue3, adjustedBaseHsl.s, adjustedBaseHsl.l)

      // Add variations if more colors are needed
      while (generatedPalette.length < numColors) {
        const lastColorHsl = hexToHsl(generatedPalette[generatedPalette.length - 1])!
        const newLightness = (lastColorHsl.l + 10) % 100
        const newSaturation = (lastColorHsl.s + 5) % 100
        addColorToPalette(lastColorHsl.h, newSaturation, newLightness)
      }
      break
    default:
      break
  }

  // Ensure unique colors and limit to numColors
  const uniquePalette = Array.from(new Set(generatedPalette)).slice(0, numColors)

  // If the base color was somehow filtered out, ensure it's the first
  if (!uniquePalette.includes(generatedPalette[0])) {
    uniquePalette.unshift(generatedPalette[0])
  }

  return uniquePalette.slice(0, numColors)
}

// Function to blend two colors
export function blendColors(color1Hex: string, color2Hex: string, ratio: number): string {
  const rgb1 = hexToRgb(color1Hex)
  const rgb2 = hexToRgb(color2Hex)

  if (!rgb1 || !rgb2) return "#000000" // Fallback for invalid colors

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)

  return rgbToHex(r, g, b)
}

// Function to generate shades (darker variations)
export function generateShades(baseHex: string, count: number): string[] {
  const baseHsl = hexToHsl(baseHex)
  if (!baseHsl) return []

  const shades: string[] = []
  for (let i = 1; i <= count; i++) {
    const newLightness = Math.max(0, baseHsl.l - (baseHsl.l / (count + 1)) * i)
    shades.push(
      rgbToHex(
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).r,
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).g,
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).b,
      ),
    )
  }
  return shades
}

// Function to generate tints (lighter variations)
export function generateTints(baseHex: string, count: number): string[] {
  const baseHsl = hexToHsl(baseHex)
  if (!baseHsl) return []

  const tints: string[] = []
  for (let i = 1; i <= count; i++) {
    const newLightness = Math.min(100, baseHsl.l + ((100 - baseHsl.l) / (count + 1)) * i)
    tints.push(
      rgbToHex(
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).r,
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).g,
        hslToRgb(baseHsl.h, baseHsl.s, newLightness).b,
      ),
    )
  }
  return tints
}
