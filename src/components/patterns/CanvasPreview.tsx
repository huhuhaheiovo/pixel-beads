'use client'

import { useEffect, useRef, useMemo } from 'react'
import { resolveBeadColor } from '@/lib/beadData'

interface CanvasPreviewProps {
  pixels: string[][]
  width: number
  height: number
  maxSize?: number
}

export function CanvasPreview({ pixels, width, height, maxSize = 200 }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const flatPixels = useMemo(() => pixels?.flat() || [], [pixels])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !flatPixels.length) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate cell size to fit within maxSize
    const cellSize = Math.min(
      Math.floor(maxSize / width),
      Math.floor(maxSize / height),
      8 // Maximum cell size for better quality
    )

    const canvasWidth = width * cellSize
    const canvasHeight = height * cellSize

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw pixels
    flatPixels.forEach((color, idx) => {
      const row = Math.floor(idx / width)
      const col = idx % width
      const x = col * cellSize
      const y = row * cellSize

      ctx.fillStyle = resolveBeadColor(color)
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }, [flatPixels, width, height, maxSize])

  if (!flatPixels.length) {
    return (
      <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
        <span className="text-zinc-400 text-xs">No preview</span>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxWidth: `${maxSize}px`, maxHeight: `${maxSize}px` }}
      aria-hidden="true"
    />
  )
}
