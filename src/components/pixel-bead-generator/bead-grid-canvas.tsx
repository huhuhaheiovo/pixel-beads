'use client'

import { useRef, useEffect, useCallback, useMemo, useState, memo } from 'react'
import { BeadColor } from '@/lib/beadData'
import { getContrastTextColor } from '@/utils/color-utils'

interface BeadGridCanvasProps {
  matrix: string[][]
  gridWidth: number
  cellSize: number
  showGrid: boolean
  showBeadCodes: boolean
  colorById: Map<string, BeadColor>
  onCellClick: (x: number, y: number) => void
  zoom?: number
  beadStyle: 'square' | 'round' | 'hollow'
  gridSpacing: 'none' | 'small' | 'large'
}

interface VisibleRect {
  startRow: number
  endRow: number
  startCol: number
  endCol: number
}

function BeadGridCanvasComponent({
  matrix,
  gridWidth,
  cellSize,
  showGrid,
  showBeadCodes,
  colorById,
  onCellClick,
  zoom = 1,
  beadStyle = 'square',
  gridSpacing = 'small'
}: BeadGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastRenderRef = useRef<{
    visibleRect: VisibleRect
    zoom: number
    beadStyle: string
    gridSpacing: string
    showBeadCodes: boolean
  } | undefined>(undefined)
  // Canvas 缓存：存储已渲染的单元格
  const cellCacheRef = useRef<Map<string, ImageData>>(new Map())
  // 直接使用高质量渲染
  const renderQuality: 'high' = 'high'

  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null)

  const gridHeight = matrix.length
  const effectiveSize = cellSize * zoom
  const gapSize = gridSpacing === 'none' ? 0 : gridSpacing === 'small' ? 1 : 3
  const isRound = beadStyle === 'round' || beadStyle === 'hollow'
  const isHollow = beadStyle === 'hollow'

  // Calculate canvas dimensions
  const canvasWidth = gridWidth * effectiveSize + (gridWidth - 1) * gapSize
  const canvasHeight = gridHeight * effectiveSize + (gridHeight - 1) * gapSize

  // Calculate visible rectangle
  const calculateVisibleRect = useCallback((): VisibleRect => {
    if (!containerRef.current) {
      return {
        startRow: 0,
        endRow: gridHeight - 1,
        startCol: 0,
        endCol: gridWidth - 1
      }
    }

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const scrollLeft = container.scrollLeft
    const viewHeight = container.clientHeight
    const viewWidth = container.clientWidth

    const startRow = Math.max(0, Math.floor(scrollTop / (effectiveSize + gapSize)) - 1)
    const endRow = Math.min(
      gridHeight - 1,
      Math.ceil((scrollTop + viewHeight) / (effectiveSize + gapSize)) + 1
    )
    const startCol = Math.max(0, Math.floor(scrollLeft / (effectiveSize + gapSize)) - 1)
    const endCol = Math.min(
      gridWidth - 1,
      Math.ceil((scrollLeft + viewWidth) / (effectiveSize + gapSize)) + 1
    )

    return { startRow, endRow, startCol, endCol }
  }, [gridWidth, gridHeight, effectiveSize, gapSize])

  // 生成单元格缓存键
  const getCellCacheKey = useCallback((x: number, y: number, colorHex: string, codeText: string | null) => {
    return `${x}-${y}-${colorHex}-${codeText || ''}-${effectiveSize}-${beadStyle}-${gridSpacing}`
  }, [effectiveSize, beadStyle, gridSpacing])

  // Draw a single bead with caching support
  const drawBead = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: BeadColor | undefined,
    codeText: string | null,
    useCache: boolean = true
  ) => {
    const pixelX = x * (effectiveSize + gapSize)
    const pixelY = y * (effectiveSize + gapSize)

    if (!color || color.hex === 'transparent') {
      return
    }

    const hex = color.hex
    const cacheKey = useCache ? getCellCacheKey(x, y, hex, codeText) : null

    // 尝试从缓存获取
    if (useCache && cacheKey && cellCacheRef.current.has(cacheKey)) {
      const cached = cellCacheRef.current.get(cacheKey)
      if (cached) {
        ctx.putImageData(cached, pixelX, pixelY)
        return
      }
    }

    const isHollowStyle = isHollow
    const isRoundStyle = isRound

    // 始终使用高质量渲染：绘制文本和阴影效果
    const shouldDrawText = codeText && showBeadCodes && effectiveSize >= 8
    const shouldUseShadows = true

    ctx.save()

    // Draw background for grid spacing
    if (showGrid && gapSize > 0) {
      ctx.fillStyle = '#D8CBB9'
      ctx.fillRect(pixelX, pixelY, effectiveSize + gapSize, effectiveSize + gapSize)
    }

    // Draw bead
    if (isHollowStyle) {
      // Hollow style: draw border only
      ctx.strokeStyle = hex
      ctx.lineWidth = Math.max(2, effectiveSize * 0.25)
      if (isRoundStyle) {
        ctx.beginPath()
        ctx.arc(
          pixelX + effectiveSize / 2,
          pixelY + effectiveSize / 2,
          (effectiveSize - ctx.lineWidth) / 2,
          0,
          Math.PI * 2
        )
        ctx.stroke()
      } else {
        ctx.strokeRect(
          pixelX + ctx.lineWidth / 2,
          pixelY + ctx.lineWidth / 2,
          effectiveSize - ctx.lineWidth,
          effectiveSize - ctx.lineWidth
        )
      }
    } else {
      // Solid style: fill
      ctx.fillStyle = hex
      if (isRoundStyle) {
        ctx.beginPath()
        ctx.arc(
          pixelX + effectiveSize / 2,
          pixelY + effectiveSize / 2,
          effectiveSize / 2,
          0,
          Math.PI * 2
        )
        ctx.fill()
      } else {
        ctx.fillRect(pixelX, pixelY, effectiveSize, effectiveSize)
      }
    }

    // Draw code text if needed (only in medium/high quality)
    if (shouldDrawText) {
      const fontSize = effectiveSize < 12
        ? Math.max(6, Math.floor(effectiveSize * 0.5))
        : Math.max(8, Math.floor(effectiveSize * 0.45))

      ctx.fillStyle = getContrastTextColor(hex)
      ctx.font = `800 ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (shouldUseShadows) {
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.shadowBlur = 1
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1
      }

      ctx.fillText(
        codeText,
        pixelX + effectiveSize / 2,
        pixelY + effectiveSize / 2
      )
    }

    ctx.restore()

    // 缓存渲染结果
    if (useCache && cacheKey && canvasRef.current) {
      try {
        const imageData = ctx.getImageData(pixelX, pixelY, effectiveSize + gapSize, effectiveSize + gapSize)
        cellCacheRef.current.set(cacheKey, imageData)
        // 限制缓存大小，避免内存溢出
        if (cellCacheRef.current.size > 1000) {
          const firstKey = cellCacheRef.current.keys().next().value
          if (firstKey) {
            cellCacheRef.current.delete(firstKey)
          }
        }
      } catch (e) {
        // 忽略缓存错误
      }
    }
  }, [effectiveSize, gapSize, showGrid, isHollow, isRound, showBeadCodes, getCellCacheKey])

  // Render visible pixels
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const visibleRect = calculateVisibleRect()

    // Check if we need to re-render
    const lastRender = lastRenderRef.current
    if (
      lastRender &&
      lastRender.visibleRect.startRow === visibleRect.startRow &&
      lastRender.visibleRect.endRow === visibleRect.endRow &&
      lastRender.visibleRect.startCol === visibleRect.startCol &&
      lastRender.visibleRect.endCol === visibleRect.endCol &&
      lastRender.zoom === zoom &&
      lastRender.beadStyle === beadStyle &&
      lastRender.gridSpacing === gridSpacing &&
      lastRender.showBeadCodes === showBeadCodes
    ) {
      // Only need to update hover effect
      if (hoveredCell) {
        const { x, y } = hoveredCell
        if (
          x >= visibleRect.startCol &&
          x <= visibleRect.endCol &&
          y >= visibleRect.startRow &&
          y <= visibleRect.endRow
        ) {
          // Redraw hovered cell with scale effect
          const color = colorById.get(matrix[y]?.[x])
          const codeText = showBeadCodes && color && effectiveSize >= 8 ? (color.code ?? '') : null
          ctx.save()
          ctx.translate(
            x * (effectiveSize + gapSize) + effectiveSize / 2,
            y * (effectiveSize + gapSize) + effectiveSize / 2
          )
          ctx.scale(1.1, 1.1)
          drawBead(ctx, 0, 0, color, codeText)
          ctx.restore()
        }
      }
      return
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background if grid spacing is enabled
    if (showGrid && gapSize > 0) {
      ctx.fillStyle = '#D8CBB9'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw visible pixels
    for (let y = visibleRect.startRow; y <= visibleRect.endRow; y++) {
      const row = matrix[y]
      if (!row) continue

      for (let x = visibleRect.startCol; x <= visibleRect.endCol; x++) {
        const cellId = row[x]
        const color = colorById.get(cellId)
        const codeText = showBeadCodes && color && effectiveSize >= 8 ? (color.code ?? '') : null

        // Apply hover scale effect
        if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
          ctx.save()
          ctx.translate(
            x * (effectiveSize + gapSize) + effectiveSize / 2,
            y * (effectiveSize + gapSize) + effectiveSize / 2
          )
          ctx.scale(1.1, 1.1)
          drawBead(ctx, 0, 0, color, codeText, false) // 悬停时不使用缓存
          ctx.restore()
        } else {
          drawBead(ctx, x, y, color, codeText, true)
        }
      }
    }

    // Store last render state
    lastRenderRef.current = {
      visibleRect,
      zoom,
      beadStyle,
      gridSpacing,
      showBeadCodes
    }
  }, [
    matrix,
    gridWidth,
    gridHeight,
    colorById,
    effectiveSize,
    gapSize,
    showGrid,
    showBeadCodes,
    beadStyle,
    isHollow,
    isRound,
    zoom,
    calculateVisibleRect,
    drawBead,
    hoveredCell
  ])

  // Throttled render function
  const throttledRender = useCallback(() => {
    if (animationFrameRef.current) {
      return
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      render()
      animationFrameRef.current = undefined
    })
  }, [render])


  // Handle scroll and resize with throttling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        throttledRender()
      }, 16) // ~60fps throttling
    }

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // 调整大小时清除缓存并重新渲染
        cellCacheRef.current.clear()
        throttledRender()
      }, 100) // Throttle resize more aggressively
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initial render
    render()

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(scrollTimeout)
      clearTimeout(resizeTimeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [render, throttledRender])

  // Re-render when props change (with debouncing for rapid changes)
  useEffect(() => {
    // 属性变化时清除缓存
    cellCacheRef.current.clear()

    const timeoutId = setTimeout(() => {
      throttledRender()
    }, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [matrix, gridWidth, cellSize, showGrid, showBeadCodes, zoom, beadStyle, gridSpacing, colorById, throttledRender])

  // Handle mouse events for interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (effectiveSize + gapSize))
    const y = Math.floor((e.clientY - rect.top) / (effectiveSize + gapSize))

    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      const newHoveredCell = { x, y }
      // Only update if cell changed
      if (!hoveredCell || hoveredCell.x !== x || hoveredCell.y !== y) {
        setHoveredCell(newHoveredCell)
        throttledRender()
      }
    } else {
      if (hoveredCell) {
        setHoveredCell(null)
        throttledRender()
      }
    }
  }, [effectiveSize, gapSize, gridWidth, gridHeight, hoveredCell, throttledRender])

  const handleMouseLeave = useCallback(() => {
    if (hoveredCell) {
      setHoveredCell(null)
      throttledRender()
    }
  }, [hoveredCell, throttledRender])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (effectiveSize + gapSize))
    const y = Math.floor((e.clientY - rect.top) / (effectiveSize + gapSize))

    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      onCellClick(x, y)
    }
  }, [effectiveSize, gapSize, gridWidth, gridHeight, onCellClick])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hoveredCell) {
      setHoveredCell({ x: 0, y: 0 })
      return
    }

    let newX = hoveredCell.x
    let newY = hoveredCell.y

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        newY = Math.max(0, hoveredCell.y - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        newY = Math.min(gridHeight - 1, hoveredCell.y + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        newX = Math.max(0, hoveredCell.x - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        newX = Math.min(gridWidth - 1, hoveredCell.x + 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onCellClick(hoveredCell.x, hoveredCell.y)
        return
      default:
        return
    }

    setHoveredCell({ x: newX, y: newY })
    // Scroll to make cell visible
    if (containerRef.current) {
      const container = containerRef.current
      const cellTop = newY * (effectiveSize + gapSize)
      const cellLeft = newX * (effectiveSize + gapSize)
      const cellBottom = cellTop + effectiveSize
      const cellRight = cellLeft + effectiveSize

      if (cellTop < container.scrollTop) {
        container.scrollTop = cellTop
      } else if (cellBottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = cellBottom - container.clientHeight
      }

      if (cellLeft < container.scrollLeft) {
        container.scrollLeft = cellLeft
      } else if (cellRight > container.scrollLeft + container.clientWidth) {
        container.scrollLeft = cellRight - container.clientWidth
      }
    }

    throttledRender()
  }, [hoveredCell, gridWidth, gridHeight, effectiveSize, gapSize, onCellClick, throttledRender])

  // Generate aria labels for accessibility
  const ariaLabels = useMemo(() => {
    const labels: string[] = []
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const color = colorById.get(matrix[y]?.[x])
        const label = color
          ? `${color.name}${color.code ? ` (${color.code})` : ''} at position ${x + 1}, ${y + 1}`
          : `Empty cell at position ${x + 1}, ${y + 1}`
        labels.push(label)
      }
    }
    return labels
  }, [matrix, gridWidth, gridHeight, colorById])

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      role="grid"
      aria-label="Bead pattern grid"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: showGrid && gapSize > 0 ? '#D8CBB9' : 'transparent'
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-crosshair"
        style={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        }}
        aria-label="Bead pattern canvas"
      />
    </div>
  )
}

export const BeadGridCanvas = memo(BeadGridCanvasComponent, (prevProps, nextProps) => {
  // Return true if props are equal (no re-render needed), false if different (re-render needed)
  return (
    prevProps.matrix === nextProps.matrix &&
    prevProps.gridWidth === nextProps.gridWidth &&
    prevProps.cellSize === nextProps.cellSize &&
    prevProps.showGrid === nextProps.showGrid &&
    prevProps.showBeadCodes === nextProps.showBeadCodes &&
    prevProps.zoom === nextProps.zoom &&
    prevProps.beadStyle === nextProps.beadStyle &&
    prevProps.gridSpacing === nextProps.gridSpacing &&
    prevProps.colorById === nextProps.colorById
  )
})
