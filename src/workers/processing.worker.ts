import { BeadColor } from '@/lib/beadData'
import { findClosestColorLab, hexToRgb, rgbToLab, LabColor, RGB } from '@/lib/colorUtils'

self.onmessage = (e: MessageEvent) => {
    const { imageData, gridWidth, height, activePalette } = e.data

    try {
        // 1. Pre-calculate LAB values for the palette
        const labPalette: LabColor[] = activePalette.map((c: BeadColor) => {
            const rgb = hexToRgb(c.hex)
            const lab = rgbToLab(rgb)
            return {
                id: c.id,
                ...lab
            }
        })

        const newMatrix: string[][] = []

        // 2. Process pixels
        // Note: We receive raw ImageData array (Uint8ClampedArray)
        for (let y = 0; y < height; y++) {
            const row: string[] = []
            for (let x = 0; x < gridWidth; x++) {
                const i = (y * gridWidth + x) * 4
                // Extract RGB from ImageData
                const rgb: RGB = {
                    r: imageData[i],
                    g: imageData[i + 1],
                    b: imageData[i + 2]
                }

                // Convert target pixel to LAB
                const targetLab = rgbToLab(rgb)

                // Find closest color using optimized function
                const closestId = findClosestColorLab(targetLab, labPalette)
                row.push(closestId)
            }
            newMatrix.push(row)
        }

        // 3. Send result back
        self.postMessage({ matrix: newMatrix })

    } catch (error) {
        self.postMessage({ error: error instanceof Error ? error.message : 'Unknown error in worker' })
    }
}
