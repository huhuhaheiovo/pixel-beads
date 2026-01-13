// Web Worker for processing pattern data
// Handles color mapping, pixel statistics, and color resolution

interface ProcessPatternMessage {
  type: 'PROCESS_PATTERN'
  pixels: string[][]
  width: number
  height: number
  colorMap?: Map<string, { hex: string; code?: string; name?: string }>
}

interface ProcessPatternResponse {
  type: 'PATTERN_PROCESSED'
  colorMap: Record<string, string>
  stats: Array<{
    colorId: string
    hex: string
    code?: string
    name?: string
    count: number
  }>
  totalBeads: number
}

interface ResolveColorMessage {
  type: 'RESOLVE_COLOR'
  colorId: string
  colorMap?: Map<string, string>
}

interface ResolveColorResponse {
  type: 'COLOR_RESOLVED'
  hex: string
}

type WorkerMessage = ProcessPatternMessage | ResolveColorMessage
type WorkerResponse = ProcessPatternResponse | ResolveColorResponse

// Generate color map from pixels
function generateColorMap(pixels: string[][]): Record<string, string> {
  const uniqueColors = Array.from(new Set(pixels.flat())).filter(
    (c) => c !== '#00000000' && c !== 'transparent'
  )

  const map: Record<string, string> = {}
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  uniqueColors.forEach((color, index) => {
    map[color] = chars[index % chars.length]
  })

  return map
}

// Resolve bead color ID to hex color
function resolveBeadColor(
  beadId: string,
  colorMap?: Map<string, string>
): string {
  if (beadId === '#00000000' || beadId === 'transparent') {
    return 'transparent'
  }
  // If the ID is a hex color, return it as is
  if (beadId.startsWith('#')) {
    return beadId
  }

  // Use provided color map if available
  if (colorMap) {
    return colorMap.get(beadId) || beadId
  }

  // Fallback: return as-is (should not happen if colorMap is provided)
  return beadId
}

// Process pattern and generate statistics
function processPattern(
  pixels: string[][],
  width: number,
  height: number,
  colorMap?: Map<string, { hex: string; code?: string; name?: string }>
): ProcessPatternResponse {
  const flatPixels = pixels.flat()
  const colorCounts = new Map<string, number>()

  // Count pixels by color
  flatPixels.forEach((colorId) => {
    if (colorId !== '#00000000' && colorId !== 'transparent') {
      colorCounts.set(colorId, (colorCounts.get(colorId) || 0) + 1)
    }
  })

  // Generate color map for legend
  const legendColorMap = generateColorMap(pixels)

  // Build statistics
  const stats = Array.from(colorCounts.entries())
    .map(([colorId, count]) => {
      const colorInfo = colorMap?.get(colorId)
      return {
        colorId,
        hex: colorInfo?.hex || resolveBeadColor(colorId, colorMap ? new Map(Array.from(colorMap.entries()).map(([k, v]) => [k, v.hex])) : undefined),
        code: colorInfo?.code,
        name: colorInfo?.name,
        count
      }
    })
    .sort((a, b) => b.count - a.count)

  const totalBeads = Array.from(colorCounts.values()).reduce(
    (sum, count) => sum + count,
    0
  )

  return {
    type: 'PATTERN_PROCESSED',
    colorMap: legendColorMap,
    stats,
    totalBeads
  }
}

// Handle messages from main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const message = event.data

  try {
    switch (message.type) {
      case 'PROCESS_PATTERN': {
        const response = processPattern(
          message.pixels,
          message.width,
          message.height,
          message.colorMap
        )
        self.postMessage(response)
        break
      }

      case 'RESOLVE_COLOR': {
        const hex = resolveBeadColor(
          message.colorId,
          message.colorMap
        )
        const response: ResolveColorResponse = {
          type: 'COLOR_RESOLVED',
          hex
        }
        self.postMessage(response)
        break
      }

      default:
        console.warn('Unknown message type:', (message as any).type)
    }
  } catch (error) {
    console.error('Worker error:', error)
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as any)
  }
})
