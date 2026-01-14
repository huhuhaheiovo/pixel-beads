import { useState, useCallback } from 'react'
import { BeadColor } from '@/lib/beadData'
import { findClosestColor } from '@/lib/colorUtils'

export function useImageProcessing() {
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

        // prepare efficient image data extraction on main thread
        // (Canvas operations must be on main thread unless using OffscreenCanvas, 
        // but simple extraction is fast enough)
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
        const imageData = ctx.getImageData(0, 0, gridWidth, height)
        // We only pass the data buffer to worker to avoid cloning issues if any,
        // though modern browsers handle ImageData cloning well.
        // Actually passing the TypedArray (data) is efficient.

        // Initialize Worker
        const worker = new Worker(new URL('../workers/processing.worker.ts', import.meta.url))

        worker.onmessage = (e) => {
          setIsProcessing(false)
          if (e.data.error) {
            reject(new Error(e.data.error))
          } else {
            resolve(e.data.matrix)
          }
          worker.terminate()
        }

        worker.onerror = (err) => {
          setIsProcessing(false)
          reject(err)
          worker.terminate()
        }

        // Send data to worker
        worker.postMessage({
          imageData: imageData.data, // Uint8ClampedArray
          gridWidth,
          height,
          activePalette
        })

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

