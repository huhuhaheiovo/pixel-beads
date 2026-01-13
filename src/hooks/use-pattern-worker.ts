import { useEffect, useRef, useState, useCallback } from 'react'

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

interface WorkerError {
  type: 'ERROR'
  error: string
}

type WorkerResponse = ProcessPatternResponse | WorkerError

export function usePatternWorker() {
  const workerRef = useRef<Worker | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize worker - Note: Worker is optional and may not be needed for detail page
    // For now, we'll make it optional and handle gracefully if it fails
    const initWorker = () => {
      try {
        // Try to create worker with URL constructor (works in most modern browsers)
        if (typeof Worker !== 'undefined') {
          const worker = new Worker(
            new URL('../workers/pattern-processor.worker.ts', import.meta.url),
            { type: 'module' }
          )

          worker.onerror = (e) => {
            console.warn('Worker error (non-critical):', e)
            // Don't set error state - worker is optional
          }

          workerRef.current = worker
        }
      } catch (err) {
        // Worker is optional - don't fail if it can't be created
        console.warn('Worker not available (non-critical):', err)
      }
    }

    initWorker()

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const processPattern = useCallback(
    (
      pixels: string[][],
      width: number,
      height: number,
      colorMap?: Map<string, { hex: string; code?: string; name?: string }>
    ): Promise<ProcessPatternResponse> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          // Fallback to synchronous processing if worker is not available
          // This is acceptable for detail page where data is already processed
          try {
            const flatPixels = pixels.flat()
            const colorCounts = new Map<string, number>()

            flatPixels.forEach((colorId) => {
              if (colorId !== '#00000000' && colorId !== 'transparent') {
                colorCounts.set(colorId, (colorCounts.get(colorId) || 0) + 1)
              }
            })

            const uniqueColors = Array.from(new Set(flatPixels)).filter(
              (c) => c !== '#00000000' && c !== 'transparent'
            )
            const legendMap: Record<string, string> = {}
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            uniqueColors.forEach((color, index) => {
              legendMap[color] = chars[index % chars.length]
            })

            const stats = Array.from(colorCounts.entries())
              .map(([colorId, count]) => {
                const colorInfo = colorMap?.get(colorId)
                return {
                  colorId,
                  hex: colorInfo?.hex || colorId,
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

            resolve({
              type: 'PATTERN_PROCESSED',
              colorMap: legendMap,
              stats,
              totalBeads
            })
          } catch (err) {
            reject(err)
          }
          return
        }

        setIsProcessing(true)
        setError(null)

        const handleMessage = (e: MessageEvent<WorkerResponse>) => {
          if (e.data.type === 'PATTERN_PROCESSED') {
            workerRef.current?.removeEventListener('message', handleMessage)
            setIsProcessing(false)
            resolve(e.data)
          } else if (e.data.type === 'ERROR') {
            workerRef.current?.removeEventListener('message', handleMessage)
            setIsProcessing(false)
            setError(e.data.error)
            reject(new Error(e.data.error))
          }
        }

        workerRef.current.addEventListener('message', handleMessage)

        const message: ProcessPatternMessage = {
          type: 'PROCESS_PATTERN',
          pixels,
          width,
          height,
          colorMap
        }

        workerRef.current.postMessage(message)
      })
    },
    []
  )

  return {
    processPattern,
    isProcessing,
    error
  }
}
