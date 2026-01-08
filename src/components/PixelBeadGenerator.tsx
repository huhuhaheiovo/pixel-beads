'use client'

import { useState, useMemo, useEffect, useCallback, useRef, useTransition } from 'react'
import { Upload, Download, Image as ImageIcon, Minus, Plus } from 'lucide-react'
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
import { savePatternAction } from '@/app/actions/patterns'
import { generateColorMap } from '@/lib/color-map'
import { toast } from 'sonner'
import { ExportDialog } from './pixel-bead-generator/export-dialog'
import type { Pattern } from '@/lib/pattern-service'

type Tool = 'brush' | 'eraser' | 'picker'
type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'
export type BeadStyle = 'square' | 'round' | 'hollow'
export type GridSpacing = 'none' | 'small' | 'large'

interface DifficultyConfig {
  gridWidth: number
  cellSize: number
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { gridWidth: 30, cellSize: 15 },
  medium: { gridWidth: 50, cellSize: 17 },
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
  const [cellSize, setCellSize] = useState(17)
  const [isExportingImage, setIsExportingImage] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportShowCodes, setExportShowCodes] = useState(false)
  const [exportShowStats, setExportShowStats] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [pendingExportType, setPendingExportType] = useState<'pdf' | 'image' | null>(null)

  const [beadStyle, setBeadStyle] = useState<BeadStyle>('round')
  const [gridSpacing, setGridSpacing] = useState<GridSpacing>('small')
  const [isStyleChanging, setIsStyleChanging] = useState(false)
  const [isPending, startTransition] = useTransition()

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

  const colorMap = useMemo(() => generateColorMap(matrix), [matrix])

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

  // Brand mapping
  const PALETTE_TO_BRAND: Record<string, string> = {
    Perler: 'Perler',
    Hama: 'Hama',
    'Artkal-S': 'Artkal',
    MARD: 'MARD',
    'Hama-Midi': 'Hama',
    'Artkal-Midi': 'Artkal',
    'Perler-Midi': 'Perler',
    'Ikea-Pyssla': 'Ikea',
    'Nabbi': 'Nabbi'
  }

  const getBrandFromPalette = (palette: string): string => {
    return PALETTE_TO_BRAND[palette] || palette
  }

  // Convert to new Pattern format
  const convertToPattern = useCallback((format: 'pdf' | 'image', formData?: {
    name?: string
    author?: string
    public?: boolean
    message?: string
  }): Pattern => {
    const patternFormat: 'pdf' | 'png' = format === 'image' ? 'png' : 'pdf'
    const timestamp = Date.now()
    const id = `pt_${timestamp}`

    const colors = beadStats.map(stat => ({
      colorCode: stat.code || '',
      colorName: stat.name,
      hex: stat.hex,
      count: stat.count
    }))

    return {
      id,
      name: formData?.name,
      author: formData?.author,
      public: formData?.public ?? true,
      message: formData?.message,
      createdAt: new Date().toISOString(),
      format: patternFormat,
      gridSize: {
        width: gridWidth,
        height: matrix.length
      },
      pixels: matrix,
      materials: {
        brand: getBrandFromPalette(selectedPalette),
        totalBeads,
        colors
      },
      source: 'pattern-generator'
    }
  }, [matrix, gridWidth, selectedPalette, beadStats, totalBeads])

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

  // Execute actual export
  const executeExport = useCallback(async (type: 'pdf' | 'image') => {
    if (!matrix.length) return

    if (type === 'pdf') {
      try {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        })

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20
        const headerHeight = 35
        const availableWidth = pageWidth - margin * 2
        const availableHeight = pageHeight - headerHeight - margin
        const pdfCellSize = cellSize * 0.264583

        const colsPerPage = Math.max(1, Math.floor(availableWidth / pdfCellSize))
        const rowsPerPage = Math.max(1, Math.floor(availableHeight / pdfCellSize))
        const colChunks = Math.max(1, Math.ceil(gridWidth / colsPerPage))
        const rowChunks = Math.max(1, Math.ceil(matrix.length / rowsPerPage))
        const totalMainPages = colChunks * rowChunks

        const counts: Record<string, number> = {}
        matrix.flat().forEach(id => {
          if (id) counts[id] = (counts[id] || 0) + 1
        })

        const statsStartY = 35
        const statsLineHeight = 14
        const statsAvailableHeight = pageHeight - statsStartY - margin
        const statsItemsPerPage = Math.max(1, Math.floor(statsAvailableHeight / statsLineHeight))
        const statsEntries = Object.keys(counts).length
        const statsPages = Math.max(1, Math.ceil(statsEntries / statsItemsPerPage))

        const totalPages = totalMainPages + statsPages
        let currentPage = 1

        const drawPageNumber = () => {
          doc.setFontSize(9)
          doc.setTextColor(80)
          doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - margin / 2, { align: 'right' })
        }

        doc.setFontSize(22)
        doc.text('Pixel Bead Pattern', margin, 20)
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated for ${selectedPalette} Beads | Grid size: ${gridWidth}x${matrix.length}`, margin, 26)

        const MIN_CELL_SIZE_FOR_TEXT = 2

        for (let rowChunk = 0; rowChunk < rowChunks; rowChunk++) {
          for (let colChunk = 0; colChunk < colChunks; colChunk++) {
            const rowStart = rowChunk * rowsPerPage
            const colStart = colChunk * colsPerPage
            const rowEnd = Math.min(rowStart + rowsPerPage, matrix.length)
            const colEnd = Math.min(colStart + colsPerPage, gridWidth)

            for (let y = rowStart; y < rowEnd; y++) {
              const row = matrix[y]
              for (let x = colStart; x < colEnd; x++) {
                const cellId = row?.[x]
                const color = colorById.get(cellId)
                const cellX = margin + (x - colStart) * pdfCellSize
                const cellY = headerHeight + (y - rowStart) * pdfCellSize

                if (color) {
                  doc.setFillColor(color.hex)
                  doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'F')

                  const textColor = getContrastTextColor(color.hex)
                  const isWhite = textColor === '#FFFFFF'
                  if (pdfCellSize >= MIN_CELL_SIZE_FOR_TEXT && color.code) {
                    doc.setTextColor(isWhite ? 255 : 0)
                    const fontSize = pdfCellSize < 3
                      ? Math.max(4, pdfCellSize * 0.35)
                      : Math.max(6, pdfCellSize * 0.4)
                    doc.setFontSize(fontSize)
                    const textX = cellX + pdfCellSize / 2
                    const textY = cellY + pdfCellSize / 2 + pdfCellSize * 0.15
                    doc.text(color.code, textX, textY, { align: 'center', baseline: 'middle' })
                  }
                }
                doc.setDrawColor(230)
                doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'S')
              }
            }

            drawPageNumber()
            if (rowChunk !== rowChunks - 1 || colChunk !== colChunks - 1) {
              doc.addPage()
              currentPage += 1
            }
          }
        }

        if (statsPages > 0) {
          doc.addPage()
          currentPage += 1
          doc.setTextColor(0)
          doc.setFontSize(18)
          doc.text('Color Shopping List', margin, 20)

          let yPos = statsStartY
          Object.entries(counts).forEach(([id, count], index) => {
            const color = colorById.get(id)
            if (!color) return

            if (index > 0 && yPos + statsLineHeight > pageHeight - margin) {
              drawPageNumber()
              doc.addPage()
              currentPage += 1
              doc.setTextColor(0)
              doc.setFontSize(18)
              doc.text('Color Shopping List', margin, 20)
              yPos = statsStartY
            }

            doc.setFillColor(color.hex)
            doc.rect(margin, yPos, 10, 10, 'F')
            doc.rect(margin, yPos, 10, 10, 'S')

            doc.setFontSize(10)
            doc.setTextColor(0)
            const textX = margin + 15
            const codeText = color.code ? ` (${color.code})` : ''
            doc.text(`${color.name}${codeText}`, textX, yPos + 3)

            const hexText = `Hex: ${color.hex.toUpperCase()}`
            doc.setFontSize(9)
            doc.setTextColor(80)
            doc.text(hexText, textX, yPos + 7)

            doc.setFontSize(10)
            doc.setTextColor(0)
            doc.text(`${count} beads`, pageWidth - margin - 20, yPos + 5, { align: 'right' })

            yPos += statsLineHeight
          })
        }

        drawPageNumber()
        doc.save(`pixel-bead-pattern-${Date.now()}.pdf`)
      } catch (error) {
        console.error('Failed to export PDF:', error)
      }
    } else {
      // Image export
      if (!exportRef.current) return

      setIsExportingImage(true)
      setExportProgress(10)

      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          // Start from 30% if coming from save flow, otherwise from 10%
          if (prev >= 90) return prev
          return prev + 5
        })
      }, 200)

      toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })
        .then((dataUrl) => {
          clearInterval(progressInterval)
          setExportProgress(100)

          setTimeout(() => {
            const link = document.createElement('a')
            link.download = `pixel-bead-pattern-${Date.now()}.png`
            link.href = dataUrl
            link.click()
            setIsExportingImage(false)
            setExportProgress(0)
          }, 300)
        })
        .catch((error) => {
          console.error('Failed to export image:', error)
          clearInterval(progressInterval)
          setIsExportingImage(false)
          setExportProgress(0)
        })
    }
  }, [matrix, gridWidth, selectedPalette, colorById, cellSize, exportRef])

  const handleSaveAndExport = useCallback(async (formData: {
    name?: string
    author?: string
    public?: boolean
    message?: string
  }) => {
    if (!pendingExportType || !matrix.length) return

    const exportType = pendingExportType

    // Step 1: Immediately close dialog and reset state
    setShowExportDialog(false)
    setPendingExportType(null)

    // Step 2: Show loading state immediately
    if (exportType === 'image') {
      setIsExportingImage(true)
      setExportProgress(5)
    }

    // Step 3: Save to database
    setIsSaving(true)
    try {
      if (exportType === 'image') {
        setExportProgress(15)
      }

      const pattern = convertToPattern(exportType, formData)
      const success = await savePatternAction(pattern)

      if (exportType === 'image') {
        setExportProgress(30)
      }

      if (success) {
        toast.success(t('savedToLibrary'))
      } else {
        toast.error(t('failedToSave'))
      }
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error(t('failedToSave'))

      // Reset states on error
      setIsSaving(false)
      if (exportType === 'image') {
        setIsExportingImage(false)
        setExportProgress(0)
      }
      return
    }

    setIsSaving(false)

    // Step 4: Execute export (this will continue the progress)
    // For image export, progress continues from 30% to 100%
    // For PDF export, it executes immediately
    executeExport(exportType)
  }, [pendingExportType, matrix.length, convertToPattern, t, executeExport])

  const handleSkipExport = useCallback(() => {
    if (!pendingExportType) return
    setShowExportDialog(false)
    const exportType = pendingExportType
    setPendingExportType(null)
    executeExport(exportType)
  }, [pendingExportType, executeExport])

  const exportToPDF = useCallback(() => {
    if (!matrix.length) return
    setPendingExportType('pdf')
    setShowExportDialog(true)
  }, [matrix.length])

  const exportToImage = useCallback(() => {
    if (!matrix.length) return
    setPendingExportType('image')
    setShowExportDialog(true)
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

  const handleBeadStyleChange = useCallback((style: BeadStyle) => {
    setIsStyleChanging(true)
    startTransition(() => {
      setBeadStyle(style)
      setTimeout(() => setIsStyleChanging(false), 300)
    })
  }, [])

  const handleGridSpacingChange = useCallback((spacing: GridSpacing) => {
    setIsStyleChanging(true)
    startTransition(() => {
      setGridSpacing(spacing)
      setTimeout(() => setIsStyleChanging(false), 300)
    })
  }, [])

  return (
    <div className='flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#F7F1E1] text-[#3E2A1E] font-sans selection:bg-[#3E2A1E] selection:text-white'>
      {/* Left Sidebar - Configuration (Input) */}
      <aside
        className='w-full lg:w-80 bg-white border-b lg:border-r border-[#D8CBB9] flex flex-col shrink-0 z-30 shadow-[1px_0_20px_rgba(62,42,30,0.05)]'
        aria-label="Configuration"
      >
        <div className='flex-1 flex flex-col p-6 space-y-8'>

          {/* Section 1: Image Source */}
          <section className='space-y-4'>
            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#3E2A1E]'></span>
              {t('imageSource')}
            </label>

            <input
              type='file'
              id='upload'
              hidden
              onChange={handleImageUpload}
              accept='image/*'
            />
            <label
              htmlFor='upload'
              className='flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-[#D8CBB9] rounded-xl text-[#8F7E6F] text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-[#3E2A1E] hover:text-[#3E2A1E] hover:bg-[#F7F1E1]/50 transition-all group'
            >
              <Upload size={16} className='group-hover:scale-110 transition-transform' aria-hidden="true" />
              {t('replaceImage')}
            </label>
          </section>

          <div className='w-full h-px bg-[#F7F1E1]' />

          {/* Section 2: Drawing Tools */}
          <section className='space-y-4'>
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
          </section>


          <div className='w-full h-px bg-[#F7F1E1]' />

          {/* Section 3: Canvas Setup */}
          <section className='space-y-4 pb-8'>
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
            />
          </section>
        </div>
      </aside>

      {/* Center - Workspace (Process) */}
      <main
        className='flex-1 sticky top-0 h-screen overflow-hidden bg-[#F7F1E1] flex flex-col relative'
        aria-label="Main workspace"
      >
        {/* Zoom Control Overlay - Fixed Position */}
        {matrix.length > 0 && (
          <div className="absolute top-6 right-8 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-[#D8CBB9]/50 flex items-center gap-2 z-50">
            <span className="text-xs font-medium text-[#8F7E6F]">{t('zoom')}:</span>
            <button
              onClick={() => setZoom(prev => Math.max(0.2, parseFloat((prev - 0.1).toFixed(1))))}
              className="p-1 hover:bg-[#F7F1E1] rounded text-[#8F7E6F] hover:text-[#3E2A1E] transition-colors"
              aria-label="Zoom out"
            >
              <Minus size={14} />
            </button>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 h-2 bg-[#F0EEE8] rounded-lg appearance-none cursor-pointer accent-[#3E2A1E]"
            />
            <button
              onClick={() => setZoom(prev => Math.min(2, parseFloat((prev + 0.1).toFixed(1))))}
              className="p-1 hover:bg-[#F7F1E1] rounded text-[#8F7E6F] hover:text-[#3E2A1E] transition-colors"
              aria-label="Zoom in"
            >
              <Plus size={14} />
            </button>
            <span className="text-xs w-9 text-right font-mono">{Math.round(zoom * 100)}%</span>
          </div>
        )}

        <div className='flex-1 overflow-auto flex items-center justify-center p-8 lg:p-12'>
          {!image ? (
            <UploadArea onUpload={handleImageUpload} />
          ) : (
            <div
              ref={gridRef}
              className='relative shadow-2xl p-px bg-[#D8CBB9] inline-block transition-transform duration-300'
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
                    zoom={zoom}
                    beadStyle={beadStyle}
                    gridSpacing={gridSpacing}
                  />
                </div>
              )}
              {(isProcessing || isExportingImage || isStyleChanging) && (
                <div
                  className='absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 transition-opacity'
                  role="status"
                >
                  <div className='flex flex-col items-center gap-6 w-72 p-8 bg-white shadow-2xl rounded-2xl border border-[#D8CBB9]'>
                    {isProcessing ? (
                      <>
                        <div className='relative w-12 h-12' aria-hidden="true">
                          <div className='absolute inset-0 border-4 border-[#F7F1E1] rounded-full' />
                          <div className='absolute inset-0 border-4 border-t-[#3E2A1E] rounded-full animate-spin' />
                        </div>
                        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1E]'>{t('processing')}</span>
                      </>
                    ) : (
                      <>
                        <div className='w-full space-y-4'>
                          <div className='flex justify-between items-end'>
                            <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1E]'>
                              {exportProgress < 30 ? t('savingPattern') : exportProgress < 90 ? t('generatingImage') : t('downloading')}
                            </span>
                            <span className='text-sm font-black text-[#3E2A1E]'>
                              {exportProgress}%
                            </span>
                          </div>
                          <Progress value={exportProgress} className='h-2 bg-[#F7F1E1]' />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Style Change Loading Indicator */}
              {isStyleChanging && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#3E2A1E]/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {t('styleChanging')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Output (Result) */}
      <PaletteSidebar
        activePalette={activePalette}
        matrix={matrix}
        selectedColorId={selectedColorId}
        onColorSelect={setSelectedColorId}
      >
        {/* Primary Actions moved here */}
        <div className="space-y-4 mb-6">
          <label className='text-xs font-bold uppercase tracking-widest text-[#8F7E6F] border-b border-[#D8CBB9] pb-2 block'>{t('exportSettings')}</label>

          <div className='flex gap-4'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowCodes}
                onChange={(e) => setExportShowCodes(e.target.checked)}
                className='w-3.5 h-3.5 rounded border-[#D8CBB9] text-[#3E2A1E] focus:ring-[#3E2A1E]'
              />
              <span className='text-[10px] font-bold uppercase text-[#5A4738] group-hover:text-[#3E2A1E] transition-colors'>
                {t('exportShowCodes')}
              </span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowStats}
                onChange={(e) => setExportShowStats(e.target.checked)}
                className='w-3.5 h-3.5 rounded border-[#D8CBB9] text-[#3E2A1E] focus:ring-[#3E2A1E]'
              />
              <span className='text-[10px] font-bold uppercase text-[#5A4738] group-hover:text-[#3E2A1E] transition-colors'>
                {t('exportShowStats')}
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('beadStyle')}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['square', 'round', 'hollow'] as BeadStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => handleBeadStyleChange(style)}
                    className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${beadStyle === style
                      ? 'bg-[#3E2A1E] text-white shadow-lg'
                      : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                      }`}
                  >
                    {t(`beadStyle${style.charAt(0).toUpperCase() + style.slice(1)}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('gridSpacing')}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'small', 'large'] as GridSpacing[]).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => handleGridSpacingChange(spacing)}
                    className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${gridSpacing === spacing
                      ? 'bg-[#3E2A1E] text-white shadow-lg'
                      : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                      }`}
                  >
                    {t(`gridSpacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportToPDF}
              disabled={!image || matrix.length === 0}
              className='flex flex-col items-center justify-center gap-1.5 py-3 bg-[#32B8A6] text-white text-[9px] font-bold uppercase tracking-widest hover:bg-[#2AA38F] hover:shadow-lg active:scale-[0.98] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
            <button
              onClick={exportToImage}
              disabled={!image || matrix.length === 0 || isExportingImage}
              className='flex flex-col items-center justify-center gap-1.5 py-3 bg-white border border-[#3E2A1E] text-[#3E2A1E] text-[9px] font-bold uppercase tracking-widest hover:bg-[#F0EEE8] hover:shadow-md active:scale-[0.98] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isExportingImage ? (
                <div className='w-3 h-3 border-2 border-[#18181B] border-t-transparent animate-spin' />
              ) : (
                <ImageIcon size={14} />
              )}
              <span>IMG</span>
            </button>
          </div>
        </div>
      </PaletteSidebar>

      {/* Off-screen Export Container */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div
          ref={exportRef}
          className='bg-white p-12 flex flex-row gap-16 items-start'
          style={{ width: 'fit-content' }}
        >
          {/* Left: Bead Grid */}
          <div className='relative bg-white p-1 shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-[#E4E4E7]'>
            <BeadGrid
              matrix={matrix}
              gridWidth={gridWidth}
              cellSize={18} // Fixed larger size for export to ensure codes are legible
              showGrid={true} // Always show grid in export
              showBeadCodes={exportShowCodes} // Conditional based on export setting
              colorById={colorById}
              onCellClick={() => { }}
              beadStyle={beadStyle}
              gridSpacing={gridSpacing}
            />
            {/* Watermark Overlay */}
            <div className="absolute bottom-3 right-3 opacity-50 pointer-events-none z-10">
              <span className="text-lg font-bold text-[#18181B] tracking-tight">
                https://www.pixel-beads.com/
              </span>
            </div>
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
                        className='w-8 h-8 rounded-full border border-zinc-200 shadow-sm flex items-center justify-center font-bold text-xs text-black'
                        style={{ backgroundColor: color.hex }}
                      >
                        <span className="drop-shadow-md mix-blend-hard-light">{colorMap[color.id] || ''}</span>
                      </div>
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

      {/* Export Dialog */}
      {pendingExportType && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          onSkip={handleSkipExport}
          onSaveAndExport={handleSaveAndExport}
          exportType={pendingExportType}
        />
      )}
    </div>
  )
}
