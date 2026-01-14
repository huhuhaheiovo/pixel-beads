/**
 * Utility for color space conversion and perceptual color distance.
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface LAB {
  l: number
  a: number
  b: number
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

export function rgbToLab(rgb: RGB): LAB {
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  r *= 100
  g *= 100
  b *= 100

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505

  let xn = x / 95.047
  let yn = y / 100.000
  let zn = z / 108.883

  xn = xn > 0.008856 ? Math.pow(xn, 1 / 3) : (7.787 * xn) + (16 / 116)
  yn = yn > 0.008856 ? Math.pow(yn, 1 / 3) : (7.787 * yn) + (16 / 116)
  zn = zn > 0.008856 ? Math.pow(zn, 1 / 3) : (7.787 * zn) + (16 / 116)

  return {
    l: (116 * yn) - 16,
    a: 500 * (xn - yn),
    b: 200 * (yn - zn)
  }
}

export function deltaE(labA: LAB, labB: LAB): number {
  const deltaL = labA.l - labB.l
  const deltaA = labA.a - labB.a
  const deltaB = labA.b - labB.b
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}

export interface LabColor {
  id: string
  l: number
  a: number
  b: number
}

export function findClosestColor(targetRgb: RGB, palette: { hex: string, id: string }[]): string {
  if (palette.length === 0) {
    throw new Error('Palette cannot be empty')
  }

  const targetLab = rgbToLab(targetRgb)
  let minDistance = Infinity
  let closestId = palette[0].id

  palette.forEach(color => {
    const colorRgb = hexToRgb(color.hex)
    const colorLab = rgbToLab(colorRgb)
    const distance = deltaE(targetLab, colorLab)
    if (distance < minDistance) {
      minDistance = distance
      closestId = color.id
    }
  })

  return closestId
}

export function findClosestColorLab(targetLab: LAB, labPalette: LabColor[]): string {
  if (labPalette.length === 0) {
    throw new Error('Palette cannot be empty')
  }

  let minDistance = Infinity
  let closestId = labPalette[0].id

  // Unrolling or simple loop optimization could be done here if needed,
  // but just removing the repeated rgbToLab calls is the biggest win.
  for (let i = 0; i < labPalette.length; i++) {
    const color = labPalette[i]
    const deltaL = targetLab.l - color.l
    const deltaA = targetLab.a - color.a
    const deltaB = targetLab.b - color.b
    // Squared distance is enough for comparison, avoiding sqrt,
    // BUT we need standard deltaE behavior if specific threshold logic was used.
    // Standard deltaE uses sqrt. Optimization: compare squared distance if strictly finding min.
    const distanceSq = deltaL * deltaL + deltaA * deltaA + deltaB * deltaB

    if (distanceSq < minDistance) {
      minDistance = distanceSq
      closestId = color.id
    }
  }

  return closestId
}
