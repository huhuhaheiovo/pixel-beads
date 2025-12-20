import { useState, useCallback } from 'react'
import { BeadColor } from '@/lib/beadData'
import { findClosestColor } from '@/lib/colorUtils'

export function useImageProcessing () {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const processImage = useCallback((
    img: HTMLImageElement,
    gridWidth: number,
    activePalette: BeadColor[]
  ): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      try {
        setIsProcessing(true)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setIsProcessing(false)
          reject(new Error('Failed to get canvas context'))
          return
        }

        const aspectRatio = img.height / img.width
        const height = Math.round(gridWidth * aspectRatio)
        canvas.width = gridWidth
        canvas.height = height

        ctx.drawImage(img, 0, 0, gridWidth, height)
        const imageData = ctx.getImageData(0, 0, gridWidth, height).data

        const newMatrix: string[][] = []

        for (let y = 0; y < height; y++) {
          const row: string[] = []
          for (let x = 0; x < gridWidth; x++) {
            const i = (y * gridWidth + x) * 4
            const rgb = { r: imageData[i], g: imageData[i + 1], b: imageData[i + 2] }
            const closestId = findClosestColor(rgb, activePalette)
            row.push(closestId)
          }
          newMatrix.push(row)
        }

        setIsProcessing(false)
        resolve(newMatrix)
      } catch (error) {
        setIsProcessing(false)
        reject(error)
      }
    })
  }, [])

  return {
    image,
    setImage,
    isProcessing,
    processImage
  }
}

