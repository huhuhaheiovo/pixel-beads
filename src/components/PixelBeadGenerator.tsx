'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Upload, Download } from 'lucide-react'
import { BeadColor, MARD_CATEGORIES, PALETTES } from '@/lib/beadData'
import { jsPDF } from 'jspdf'
import { useImageProcessing } from '@/hooks/use-image-processing'
import { useHistory } from '@/hooks/use-history'
import { getContrastTextColor } from '@/utils/color-utils'
import { Toolbar } from './pixel-bead-generator/toolbar'
import { SettingsPanel } from './pixel-bead-generator/settings-panel'
import { PaletteSidebar } from './pixel-bead-generator/palette-sidebar'
import { BeadGrid } from './pixel-bead-generator/bead-grid'
import { UploadArea } from './pixel-bead-generator/upload-area'

type Tool = 'brush' | 'eraser' | 'picker'
type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'

export function PixelBeadGenerator () {
  const [gridWidth, setGridWidth] = useState(50)
  const [selectedPalette, setSelectedPalette] = useState<string>('Perler')
  const [selectedMardCategory, setSelectedMardCategory] = useState<MardCategory>('all')
  const [activeTool, setActiveTool] = useState<Tool>('brush')
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showBeadCodes, setShowBeadCodes] = useState(true)
  const [cellSize, setCellSize] = useState(18)

  const { image, setImage, isProcessing, processImage } = useImageProcessing()
  const {
    history,
    historyIndex,
    currentMatrix,
    addToHistory,
    undo,
    redo,
    resetHistory,
    canUndo,
    canRedo
  } = useHistory()

  const [matrix, setMatrix] = useState<string[][]>([])

  const activePalette: BeadColor[] = useMemo(() => {
    const base = PALETTES[selectedPalette] ?? []
    if (selectedPalette !== 'MARD') return base
    const group = MARD_CATEGORIES[selectedMardCategory]
    if (!group) return base
    const allowed = new Set(group.keys)
    return base.filter(c => !!c.code && allowed.has(c.code))
  }, [selectedPalette, selectedMardCategory])

  const colorById = useMemo(() => {
    return new Map(activePalette.map(c => [c.id, c]))
  }, [activePalette])

  // Sync matrix with history
  useEffect(() => {
    if (currentMatrix.length > 0) {
      setMatrix(currentMatrix)
    }
  }, [currentMatrix])

  // Update matrix when history changes via undo/redo
  useEffect(() => {
    if (history.length > 0 && history[historyIndex]) {
      setMatrix(history[historyIndex])
    }
  }, [history, historyIndex])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => setImage(img)
      img.onerror = () => {
        console.error('Failed to load image')
      }
      if (event.target?.result) {
        img.src = event.target.result as string
      }
    }
    reader.onerror = () => {
      console.error('Failed to read file')
    }
    reader.readAsDataURL(file)
  }, [setImage])

  // Process image when it changes
  useEffect(() => {
    if (!image || activePalette.length === 0) return

    processImage(image, gridWidth, activePalette)
      .then((newMatrix) => {
        setMatrix(newMatrix)
        resetHistory(newMatrix)
        if ((!selectedColorId || !activePalette.some(c => c.id === selectedColorId)) && activePalette.length > 0) {
          setSelectedColorId(activePalette[0].id)
        }
      })
      .catch((error) => {
        console.error('Failed to process image:', error)
      })
  }, [image, gridWidth, activePalette, processImage, resetHistory, selectedColorId])

  const handleCellClick = useCallback((x: number, y: number) => {
    if (!matrix[y] || matrix[y][x] === undefined) return

    if (activeTool === 'picker') {
      setSelectedColorId(matrix[y][x])
      setActiveTool('brush')
      return
    }

    const newMatrix = matrix.map(row => [...row])
    if (activeTool === 'brush' && selectedColorId) {
      newMatrix[y][x] = selectedColorId
    } else if (activeTool === 'eraser') {
      newMatrix[y][x] = ''
    }

    setMatrix(newMatrix)
    addToHistory(newMatrix)
  }, [matrix, activeTool, selectedColorId, addToHistory])

  const handleUndo = useCallback(() => {
    undo()
  }, [undo])

  const handleRedo = useCallback(() => {
    redo()
  }, [redo])

  const exportToPDF = useCallback(() => {
    if (!matrix.length) return

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const availableWidth = pageWidth - margin * 2
      const pdfCellSize = availableWidth / gridWidth

      // Title
      doc.setFontSize(22)
      doc.text('Pixel Bead Pattern', margin, 20)
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Generated for ${selectedPalette} Beads | Grid size: ${gridWidth}x${matrix.length}`, margin, 26)

      // Draw Pattern
      const MIN_CELL_SIZE_FOR_TEXT = 2 // mm - reduced to allow text in smaller cells
      matrix.forEach((row, y) => {
        row.forEach((cellId, x) => {
          const color = colorById.get(cellId)
          const cellX = margin + x * pdfCellSize
          const cellY = 35 + y * pdfCellSize
          
          if (color) {
            doc.setFillColor(color.hex)
            doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'F')
            
            // Draw text if cell is large enough
            const textColor = getContrastTextColor(color.hex)
            const isWhite = textColor === '#FFFFFF'
            if (pdfCellSize >= MIN_CELL_SIZE_FOR_TEXT && color.code) {
              // Cell is large enough for text
              doc.setTextColor(isWhite ? 255 : 0)
              // Adjust font size based on cell size - smaller cells get proportionally smaller font
              const fontSize = pdfCellSize < 3
                ? Math.max(4, pdfCellSize * 0.35) // Smaller font for very small cells
                : Math.max(6, pdfCellSize * 0.4) // Normal scaling for larger cells
              doc.setFontSize(fontSize)
              const textX = cellX + pdfCellSize / 2
              const textY = cellY + pdfCellSize / 2 + pdfCellSize * 0.15
              doc.text(color.code, textX, textY, { align: 'center', baseline: 'middle' })
            }
          }
          doc.setDrawColor(230)
          doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'S')
        })
      })

      // Add Legend Page
      doc.addPage()
      doc.setTextColor(0)
      doc.setFontSize(18)
      doc.text('Color Shopping List', margin, 20)

      const counts: Record<string, number> = {}
      matrix.flat().forEach(id => {
        if (id) counts[id] = (counts[id] || 0) + 1
      })

      let yPos = 35
      Object.entries(counts).forEach(([id, count]) => {
        const color = colorById.get(id)
        if (color) {
          if (yPos > 260) {
            doc.addPage()
            yPos = 20
          }
          // Color swatch
          doc.setFillColor(color.hex)
          doc.rect(margin, yPos, 10, 10, 'F')
          doc.rect(margin, yPos, 10, 10, 'S')

          // Text information
          doc.setFontSize(10)
          doc.setTextColor(0)
          
          const textX = margin + 15
          const lineHeight = 4
          
          // Line 1: Name and Code
          const codeText = color.code ? ` (${color.code})` : ''
          doc.text(`${color.name}${codeText}`, textX, yPos + 3)
          
          // Line 2: Hex
          const hexText = `Hex: ${color.hex.toUpperCase()}`
          doc.setFontSize(9)
          doc.setTextColor(80)
          doc.text(hexText, textX, yPos + 7)
          
          // Count on the right
          doc.setFontSize(10)
          doc.setTextColor(0)
          doc.text(`${count} beads`, pageWidth - margin - 20, yPos + 5, { align: 'right' })

          yPos += 14
        }
      })

      doc.save(`pixel-bead-pattern-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    }
  }, [matrix, gridWidth, selectedPalette, colorById])

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F4F4F5] text-[#18181B] font-sans overflow-hidden">
      {/* Sidebar - Tools */}
      <aside className="w-full lg:w-72 bg-white border-b lg:border-r border-[#E4E4E7] flex flex-col p-6 space-y-8 overflow-y-auto">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          showBeadCodes={showBeadCodes}
          onToggleBeadCodes={() => setShowBeadCodes(!showBeadCodes)}
          canUndo={canUndo}
          onUndo={handleUndo}
          canRedo={canRedo}
          onRedo={handleRedo}
        />

        <SettingsPanel
          gridWidth={gridWidth}
          onGridWidthChange={setGridWidth}
          cellSize={cellSize}
          onCellSizeChange={setCellSize}
          selectedPalette={selectedPalette}
          onPaletteChange={setSelectedPalette}
          selectedMardCategory={selectedMardCategory}
          onMardCategoryChange={setSelectedMardCategory}
        />

        <div className="mt-auto space-y-4">
          <input
            type="file"
            id="upload"
            hidden
            onChange={handleImageUpload}
            accept="image/*"
          />
          <button
            onClick={exportToPDF}
            disabled={!image || matrix.length === 0}
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
          >
            <Download size={14} /> Export PDF
          </button>
          <label
            htmlFor="upload"
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#E4E4E7] text-[#71717A] text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-[#18181B] hover:text-[#18181B] transition-all"
          >
            <Upload size={14} /> Replace Image
          </label>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-auto bg-[#FAFAFA] flex items-center justify-center p-8 lg:p-16">
        {!image ? (
          <UploadArea onUpload={handleImageUpload} />
        ) : (
          <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.1)] p-1 bg-white inline-block">
            {matrix.length > 0 && (
              <BeadGrid
                matrix={matrix}
                gridWidth={gridWidth}
                cellSize={cellSize}
                showGrid={showGrid}
                showBeadCodes={showBeadCodes}
                colorById={colorById}
                onCellClick={handleCellClick}
              />
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-[#18181B] border-t-transparent animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right Sidebar - Palette Stats */}
      <PaletteSidebar
        activePalette={activePalette}
        matrix={matrix}
        selectedColorId={selectedColorId}
        onColorSelect={setSelectedColorId}
      />
    </div>
  )
}
