import { hexToRgb } from '@/lib/colorUtils'

export function getContrastTextColor (hex?: string): string {
  if (!hex) return '#18181B'
  const { r, g, b } = hexToRgb(hex)
  // Relative luminance (sRGB)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance < 0.5 ? '#FFFFFF' : '#18181B'
}

