import { ARTKAL_S_PALETTE_FULL, PERLER_PALETTE_FULL } from '@/lib/generatedPalettes'
import { MARD_GROUPS, MARD_PALETTE_FULL } from '@/lib/generatedMard'
import { JSON_PALETTE_LABELS, JSON_PALETTE_REGISTRY } from '@/lib/generatedJsonPalettes'

export interface BeadColor {
  id: string
  name: string
  hex: string
  brand: string
  code?: string
  /**
   * Optional series/prefix extracted from code/productCode, e.g. "P", "S", "C", "H", "D", "M".
   * This enables mixing multiple series in one effective palette in the future.
   */
  series?: string
  /**
   * Raw product code from source files (often equals `code`).
   */
  productCode?: string
  /**
   * @deprecated Legend symbol feature has been removed. This field is kept for backwards compatibility only.
   */
  legendSymbol?: string
}

export const PERLER_PALETTE: BeadColor[] = PERLER_PALETTE_FULL.map(c => ({
  id: c.id,
  name: c.name,
  hex: c.hex,
  brand: c.brand,
  code: c.code, // e.g. "P01"
  productCode: c.productCode,
  series: c.series
}))

export const HAMA_PALETTE: BeadColor[] = [
  // Kept for backwards compatibility in code; actual Hama Midi palette is provided as a separate selectable palette key.
  // (See JSON_PALETTE_REGISTRY["Hama-Midi"])
  { id: 'Hama:H01', name: 'White', hex: '#FFFFFF', brand: 'Hama', code: 'H01', productCode: 'H01', series: 'H' }
]

export const ARTKAL_S_PALETTE: BeadColor[] = ARTKAL_S_PALETTE_FULL.map(c => ({
  id: c.id,
  name: c.name,
  hex: c.hex,
  brand: c.brand, // "Artkal-S"
  code: c.code, // e.g. "S92"
  productCode: c.productCode,
  series: c.series // "S"
}))

export const MARD_PALETTE: BeadColor[] = MARD_PALETTE_FULL.map(c => ({
  id: c.id,
  name: c.name,
  hex: c.hex,
  brand: c.brand, // "MARD"
  code: c.code, // e.g. "C16"
  productCode: c.productCode,
  series: c.series // e.g. "C"
}))

export const MARD_CATEGORIES = MARD_GROUPS

export const PALETTES: Record<string, BeadColor[]> = {
  Perler: PERLER_PALETTE,
  Hama: HAMA_PALETTE,
  'Artkal-S': ARTKAL_S_PALETTE,
  MARD: MARD_PALETTE,
  ...(JSON_PALETTE_REGISTRY as unknown as Record<string, BeadColor[]>)
}

export const PALETTE_LABELS: Record<string, string> = {
  Perler: 'Perler (Pxx)',
  'Artkal-S': 'Artkal S (Sxx)',
  MARD: 'MARD (C/H/D/M...)',
  // Legacy single-color minimal palette
  Hama: 'Hama (Legacy)',
  ...JSON_PALETTE_LABELS
}
