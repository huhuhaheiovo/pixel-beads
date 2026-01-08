'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Upload, Download, Image as ImageIcon } from 'lucide-react'
import { BeadColor, MARD_CATEGORIES, PALETTES } from '@/lib/beadData'
import { jsPDF } from 'jspdf'
import { toPng } from 'html-to-image'
import { useImageProcessing } from '@/hooks/use-image-processing'
import { useHistory } from '@/hooks/use-history'
import { getContrastTextColor } from '@/utils/color-utils'
import { Toolbar } from './pixel-bead-generator/toolbar'
import { SettingsPanel, type Difficulty } from './pixel-bead-generator/settings-panel'
import { PaletteSidebar } from './pixel-bead-generator/palette-sidebar'
import { BeadGrid } from './pixel-bead-generator/bead-grid'
import { UploadArea } from './pixel-bead-generator/upload-area'
import { useTranslations } from 'next-intl'
import { Progress } from './ui/progress'

type Tool = 'brush' | 'eraser' | 'picker'
type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'

interface DifficultyConfig {
  gridWidth: number
  cellSize: number
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { gridWidth: 30, cellSize: 15 },
  medium: { gridWidth: 50, cellSize: 10 },
  hard: { gridWidth: 80, cellSize: 8 },
  custom: { gridWidth: 65, cellSize: 8 }
}

export function PixelBeadGenerator() {
  const t = useTranslations('Generator')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [gridWidth, setGridWidth] = useState(50)
  const [selectedPalette, setSelectedPalette] = useState<string>('MARD')
  const [selectedMardCategory, setSelectedMardCategory] = useState<MardCategory>('all')
  const [activeTool, setActiveTool] = useState<Tool>('brush')
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showBeadCodes, setShowBeadCodes] = useState(false)
  const [cellSize, setCellSize] = useState(10)
  const [isExportingImage, setIsExportingImage] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportShowCodes, setExportShowCodes] = useState(false)
  const [exportShowStats, setExportShowStats] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

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
  const exportRef = useRef<HTMLDivElement>(null)

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

  const beadStats = useMemo(() => {
    if (!matrix.length) return []
    const counts: Record<string, number> = {}
    matrix.flat().forEach(id => {
      if (id) counts[id] = (counts[id] || 0) + 1
    })

    return activePalette
      .filter(c => counts[c.id])
      .map(c => ({
        ...c,
        count: counts[c.id]
      }))
      .sort((a, b) => b.count - a.count)
  }, [matrix, activePalette])

  const totalBeads = useMemo(() => {
    return beadStats.reduce((acc, s) => acc + s.count, 0)
  }, [beadStats])

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

  // Auto-detect difficulty based on current gridWidth and cellSize
  useEffect(() => {
    const currentConfig = { gridWidth, cellSize }
    const matchedDifficulty = (['easy', 'medium', 'hard'] as Exclude<Difficulty, 'custom'>[]).find(
      diff => DIFFICULTY_CONFIGS[diff].gridWidth === currentConfig.gridWidth &&
              DIFFICULTY_CONFIGS[diff].cellSize === currentConfig.cellSize
    )

    if (matchedDifficulty && matchedDifficulty !== selectedDifficulty) {
      setSelectedDifficulty(matchedDifficulty)
    } else if (!matchedDifficulty && selectedDifficulty !== 'custom') {
      setSelectedDifficulty('custom')
    }
  }, [gridWidth, cellSize, selectedDifficulty])

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
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      // Convert cellSize from px to mm (96 DPI: 1px = 0.264583mm)
      const pdfCellSize = cellSize * 0.264583

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
          // const lineHeight = 4

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
  }, [matrix, gridWidth, selectedPalette, colorById, cellSize])

  const exportToImage = useCallback(async () => {
    if (!exportRef.current || !matrix.length) return

    setIsExportingImage(true)
    setExportProgress(10)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) return prev
        return prev + 5
      })
    }, 200)

    try {
      // Add a small delay to allow React to render the loading state
      await new Promise(resolve => setTimeout(resolve, 100))

      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3, // HD quality
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })

      clearInterval(progressInterval)
      setExportProgress(100)

      // Short delay to show 100%
      await new Promise(resolve => setTimeout(resolve, 300))

      const link = document.createElement('a')
      link.download = `pixel-bead-pattern-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to export image:', error)
      clearInterval(progressInterval)
    } finally {
      setIsExportingImage(false)
      setExportProgress(0)
    }
  }, [matrix.length])

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev)
  }, [])

  const handleToggleBeadCodes = useCallback(() => {
    setShowBeadCodes(prev => !prev)
  }, [])

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    const config = DIFFICULTY_CONFIGS[difficulty]
    setGridWidth(config.gridWidth)
    setCellSize(config.cellSize)
  }, [])

  const handleGridWidthChange = useCallback((width: number) => {
    setGridWidth(width)
    setSelectedDifficulty('custom')
  }, [])

  const handleCellSizeChange = useCallback((size: number) => {
    setCellSize(size)
    setSelectedDifficulty('custom')
  }, [])

  return (
    <div className='flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-64px)] bg-[#F4F4F5] text-[#18181B] font-sans selection:bg-[#18181B] selection:text-white'>
      {/* Sidebar - Tools */}
      <aside
        className='w-full lg:w-72 bg-white border-b lg:border-r border-[#E4E4E7] flex flex-col lg:h-full shrink-0 z-10'
        aria-label="Toolbar and settings"
      >
        <div className='flex-1 flex flex-col overflow-y-auto lg:hide-scrollbar p-4 lg:p-6 space-y-6 lg:space-y-8'>
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            showGrid={showGrid}
            onToggleGrid={handleToggleGrid}
            showBeadCodes={showBeadCodes}
            onToggleBeadCodes={handleToggleBeadCodes}
            canUndo={canUndo}
            onUndo={handleUndo}
            canRedo={canRedo}
            onRedo={handleRedo}
          />

        <SettingsPanel
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          gridWidth={gridWidth}
          onGridWidthChange={handleGridWidthChange}
          cellSize={cellSize}
          onCellSizeChange={handleCellSizeChange}
          selectedPalette={selectedPalette}
          onPaletteChange={setSelectedPalette}
          selectedMardCategory={selectedMardCategory}
          onMardCategoryChange={setSelectedMardCategory}
          exportShowCodes={exportShowCodes}
          onExportShowCodesChange={setExportShowCodes}
          exportShowStats={exportShowStats}
          onExportShowStatsChange={setExportShowStats}
        />
        </div>

        <div className='flex-shrink-0 space-y-4 p-4 lg:p-6 border-t border-[#E4E4E7] bg-white'>
          <input
            type='file'
            id='upload'
            hidden
            onChange={handleImageUpload}
            accept='image/*'
          />
          <button
            onClick={exportToPDF}
            disabled={!image || matrix.length === 0}
            aria-label={t('exportPdf')}
            className='flex items-center justify-center gap-2 w-full py-4 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2'
          >
            <Download size={14} aria-hidden="true" /> {t('exportPdf')}
          </button>
          <button
            onClick={exportToImage}
            disabled={!image || matrix.length === 0 || isExportingImage}
            aria-label={isExportingImage ? t('exporting') : t('exportImage')}
            aria-busy={isExportingImage}
            className='flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-[#18181B] text-[#18181B] text-[10px] font-bold uppercase tracking-widest hover:bg-[#F4F4F5] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2'
          >
            {isExportingImage ? (
              <div className='w-3 h-3 border-2 border-[#18181B] border-t-transparent animate-spin' aria-hidden="true" />
            ) : (
              <ImageIcon size={14} aria-hidden="true" />
            )}
            {isExportingImage ? t('exporting') : t('exportImage')}
          </button>
          <label
            htmlFor='upload'
            className='flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#E4E4E7] text-[#71717A] text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-[#18181B] hover:text-[#18181B] transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-[#18181B] focus-within:ring-offset-2'
          >
            <Upload size={14} aria-hidden="true" /> {t('replaceImage')}
          </label>
        </div>
      </aside>

      {/* Main Workspace */}
      <main
        className='flex-1 relative overflow-auto bg-[#FAFAFA] flex items-center justify-center p-4 lg:p-12 xl:p-20 min-h-[400px] lg:min-h-0'
        aria-label="Main workspace"
      >
        {!image ? (
          <UploadArea onUpload={handleImageUpload} />
        ) : (
          <div
            ref={gridRef}
            className='relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-px bg-[#E4E4E7] inline-block transition-transform duration-300'
          >
            {matrix.length > 0 && (
              <div className='bg-white p-1'>
                <BeadGrid
                  matrix={matrix}
                  gridWidth={gridWidth}
                  cellSize={cellSize}
                  showGrid={showGrid}
                  showBeadCodes={showBeadCodes}
                  colorById={colorById}
                  onCellClick={handleCellClick}
                />
              </div>
            )}
            {(isProcessing || isExportingImage) && (
              <div
                className='absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 transition-opacity'
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <div className='flex flex-col items-center gap-6 w-72 p-8 bg-white shadow-2xl rounded-2xl'>
                  {isProcessing ? (
                    <>
                      <div className='relative w-12 h-12' aria-hidden="true">
                        <div className='absolute inset-0 border-4 border-[#F4F4F5] rounded-full' />
                        <div className='absolute inset-0 border-4 border-t-[#18181B] rounded-full animate-spin' />
                      </div>
                      <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#18181B]'>{t('processing')}</span>
                    </>
                  ) : (
                    <>
                      <div className='w-full space-y-4'>
                        <div className='flex justify-between items-end'>
                          <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#18181B]'>{t('exporting')}</span>
                          <span className='text-sm font-black text-[#18181B]' aria-label={`${exportProgress} percent complete`}>
                            {exportProgress}%
                          </span>
                        </div>
                        <Progress value={exportProgress} className='h-2 bg-[#F4F4F5]' aria-label="Export progress" />
                      </div>
                    </>
                  )}
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

      {/* Off-screen Export Container */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div
          ref={exportRef}
          className='bg-white p-12 flex flex-row gap-16 items-start'
          style={{ width: 'fit-content' }}
        >
          {/* Left: Bead Grid */}
          <div className='bg-white p-1 shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-[#E4E4E7]'>
            <BeadGrid
              matrix={matrix}
              gridWidth={gridWidth}
              cellSize={18} // Fixed larger size for export to ensure codes are legible
              showGrid={true} // Always show grid in export
              showBeadCodes={exportShowCodes} // Conditional based on export setting
              colorById={colorById}
              onCellClick={() => { }}
            />
          </div>

          {/* Right: Statistics Panel */}
          {exportShowStats && (
            <div className='w-[320px] flex flex-col pt-2 pr-4'>
              <h2 className='text-[20px] font-black uppercase tracking-[0.1em] text-[#18181B] text-center mb-8 pb-4 border-b-2 border-[#F4F4F5]'>
                {t('statsTitle')}
              </h2>

              <div className='space-y-4'>
                {beadStats.map(color => (
                  <div key={color.id} className='flex items-center justify-between group'>
                    <div className='flex items-center gap-5'>
                      <div
                        className='w-8 h-8 rounded-sm shadow-sm border border-[#E4E4E7]'
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className='flex items-baseline gap-2'>
                        <span className='text-[14px] font-black text-[#18181B] uppercase tracking-wider w-12'>
                          {color.code}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-[16px] font-black text-[#18181B]'>
                        {color.count}
                      </span>
                      <span className='text-[10px] font-bold text-[#A1A1AA] uppercase tracking-tighter'>
                        beads
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-12 pt-8 border-t-2 border-[#F4F4F5] flex justify-between items-center px-2'>
                <span className='text-[12px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]'>
                  {t('total')}
                </span>
                <div className='flex items-baseline gap-1'>
                  <span className='text-[24px] font-black text-[#18181B]'>
                    {totalBeads}
                  </span>
                  <span className='text-[12px] font-black text-[#18181B] uppercase tracking-tighter'>
                    beads
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
