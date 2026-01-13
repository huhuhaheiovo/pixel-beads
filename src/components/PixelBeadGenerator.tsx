'use client'

import { useState, useMemo, useEffect, useCallback, useRef, useTransition } from 'react'
import { Upload, Download, Image as ImageIcon, Minus, Plus } from 'lucide-react'
import { BeadColor, MARD_CATEGORIES, PALETTES } from '@/lib/beadData'
import { jsPDF } from 'jspdf'
import { toPng } from 'html-to-image'
import { useImageProcessing } from '@/hooks/use-image-processing'
import { useHistory } from '@/hooks/use-history'
import { getContrastTextColor } from '@/utils/color-utils'
import { generateColorMap } from '@/lib/color-map'
import { Toolbar } from './pixel-bead-generator/toolbar'
import { SettingsPanel, type Difficulty } from './pixel-bead-generator/settings-panel'
import { PaletteSidebar } from './pixel-bead-generator/palette-sidebar'
import { BeadGrid } from './pixel-bead-generator/bead-grid'
import { UploadArea } from './pixel-bead-generator/upload-area'
import { GeneratorConfiguration } from './pixel-bead-generator/generator-configuration'
import { MobileNav } from './pixel-bead-generator/mobile-nav'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import { Progress } from './ui/progress'
import { savePatternAction } from '@/app/actions/patterns'
import { toast } from 'sonner'
import { ExportDialog } from './pixel-bead-generator/export-dialog'
import { usePatternExport, type BeadStyle, type GridSpacing } from '@/hooks/use-pattern-export'
import { ExportContainer } from './patterns/ExportContainer'
import type { Pattern } from '@/lib/pattern-service'

type Tool = 'brush' | 'eraser' | 'picker'
type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'

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
  const [exportShowCodes, setExportShowCodes] = useState(false)
  const [exportShowStats, setExportShowStats] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [pendingExportType, setPendingExportType] = useState<'pdf' | 'image' | null>(null)

  // Mobile State
  const [activeMobileTab, setActiveMobileTab] = useState<'settings' | 'palette' | 'export' | null>(null)

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
        name: c.name.replace(/[\u4e00-\u9fa5]/g, '').trim() || c.id.split(':').pop() || c.id,
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
    setActiveMobileTab(null) // Close mobile sheet if open
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input value to allow selecting the same file again
    e.target.value = ''

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

  // Export Translations
  const exportTranslations = useMemo(() => ({
    patternTitle: 'Pixel Bead Pattern',
    generatedFor: 'Generated for',
    gridSize: 'Grid Size',
    colorShoppingList: 'Color Shopping List',
    beadsCount: 'beads',
    total: 'Total',
    savingPattern: t('savingPattern'),
    generatingImage: t('generatingImage'),
    downloading: t('downloading'),
    statsTitle: 'Bead Count Statistics'
  }), [t])

  const {
    exportToPDF: executeExportPDF,
    exportToImage: executeExportImage,
    isExportingImage,
    setIsExportingImage,
    exportProgress,
    setExportProgress
  } = usePatternExport({
    matrix,
    gridWidth,
    selectedPalette,
    colorById: colorById as any,
    beadStats: beadStats as any,
    totalBeads,
    beadStyle,
    gridSpacing,
    exportRef,
    translations: exportTranslations
  })

  const handleUndo = useCallback(() => {
    undo()
  }, [undo])

  const handleRedo = useCallback(() => {
    redo()
  }, [redo])


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
    if (exportType === 'pdf') {
      executeExportPDF()
    } else {
      executeExportImage({ skipSaveProgress: true })
    }
  }, [pendingExportType, matrix.length, convertToPattern, t, executeExportPDF, executeExportImage, setIsExportingImage, setExportProgress])

  const handleSkipExport = useCallback(() => {
    if (!pendingExportType) return
    setShowExportDialog(false)
    const exportType = pendingExportType
    setPendingExportType(null)
    if (exportType === 'pdf') {
      executeExportPDF()
    } else {
      executeExportImage()
    }
  }, [pendingExportType, executeExportPDF, executeExportImage])

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

  // Close mobile sheets when clicking outside or selecting something that should close it
  const handleMobileTabChange = useCallback((tab: 'settings' | 'palette' | 'export' | null) => {
    if (tab === 'export') {
      // For export, we open the dialog directly if we had a default, but here we probably want to show a sheet or just use the existing dialog logic?
      // Actually, the user flow for export on mobile might surely be 'click export -> show options'.
      // But we have 'ExportDialog' which is a Dialog.
      // Let's make the 'Export' tab just open the Palette sidebar's export section? Or open a specific sheet?
      // Re-reading plan: "Export: Opens Export Sheet/Dialog".
      // Let's use a Sheet for Export or reuse the logic.
      // Current export logic is on the right sidebar.
      // Let's open the Palette sheet but scroll to bottom? Or just open the 'palette' tab?
      // Alternatively, we can have a dedicated Export Sheet.
      // However, the existing 'handleSaveAndExport' relies on 'pendingExportType'.
      // For now, let's treat 'export' tab as opening the export options.
      // We will render the export buttons in a sheet.
      setActiveMobileTab(prev => prev === 'export' ? null : 'export')
    } else {
      setActiveMobileTab(prev => prev === tab ? null : tab)
    }
  }, [])

  return (
    <div className='flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#F7F1E1] text-[#3E2A1E] font-sans selection:bg-[#3E2A1E] selection:text-white pb-16 lg:pb-0'>
      {/* Mobile Configuration Sheet */}
      <Sheet open={activeMobileTab === 'settings'} onOpenChange={(open) => !open && setActiveMobileTab(null)}>
        <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 bg-white" aria-describedby='settings-description'>
          <SheetTitle className="sr-only">Settings</SheetTitle>
          <div id='settings-description' className="sr-only">Configuration settings for generator</div>
          <GeneratorConfiguration
            handleImageUpload={handleImageUpload}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            showGrid={showGrid}
            onToggleGrid={handleToggleGrid}
            showBeadCodes={showBeadCodes}
            onToggleBeadCodes={handleToggleBeadCodes}
            canUndo={canUndo}
            onUndo={handleUndo}
            canRedo={canRedo}
            onRedo={handleRedo}
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
            inputId="mobile-upload"
          />
        </SheetContent>
      </Sheet>

      {/* Mobile Palette Sheet */}
      <Sheet open={activeMobileTab === 'palette'} onOpenChange={(open) => !open && setActiveMobileTab(null)}>
        <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0 bg-white" aria-describedby='palette-description'>
          <SheetTitle className="sr-only">Palette</SheetTitle>
          <div id='palette-description' className="sr-only">Color palette selection</div>
          <PaletteSidebar
            activePalette={activePalette}
            matrix={matrix}
            selectedColorId={selectedColorId}
            onColorSelect={(id) => {
              setSelectedColorId(id)
              setActiveMobileTab(null) // Close on select for better UX? Or keep open? Maybe keep open for multiple picks.
            }}
            className="flex w-full"
          >
            {/* Replicate Export Settings here or keep them in Export tab? */}
            {/* Current PaletteSidebar renders children (Export Settings) at top. */}
            {/* usage in desktop: */}
          </PaletteSidebar>
        </SheetContent>
      </Sheet>

      {/* Mobile Export Sheet */}
      <Sheet open={activeMobileTab === 'export'} onOpenChange={(open) => !open && setActiveMobileTab(null)}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] p-6 bg-white rounded-t-[20px]" aria-describedby='export-description'>
          <SheetTitle className="text-center font-black uppercase tracking-widest text-[#3E2A1E] mb-6">Export & Save</SheetTitle>
          <div id='export-description' className="sr-only">Export options</div>

          {/* We need to render the Export Settings UI here.
                 Since it's passed as children to PaletteSidebar in desktop, we should extract it or duplicate it.
                 For now, duplicating the export UI structure for the mobile sheet.
             */}
          <div className="space-y-6">
            {/* Export Settings Toggles */}
            <div className="space-y-4">
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

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('beadStyle')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['square', 'round', 'hollow'] as BeadStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => handleBeadStyleChange(style)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${beadStyle === style
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
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${gridSpacing === spacing
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

            {/* Export Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setActiveMobileTab(null)
                  exportToPDF()
                }}
                disabled={!image || matrix.length === 0}
                className='flex flex-col items-center justify-center gap-2 py-4 bg-[#32B8A6] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2AA38F] hover:shadow-lg active:scale-[0.98] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  setActiveMobileTab(null)
                  exportToImage()
                }}
                disabled={!image || matrix.length === 0 || isExportingImage}
                className='flex flex-col items-center justify-center gap-2 py-4 bg-white border-2 border-[#3E2A1E] text-[#3E2A1E] text-[10px] font-bold uppercase tracking-widest hover:bg-[#F0EEE8] hover:shadow-md active:scale-[0.98] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isExportingImage ? (
                  <div className='w-4 h-4 border-2 border-[#18181B] border-t-transparent animate-spin' />
                ) : (
                  <ImageIcon size={16} />
                )}
                <span>Download IMG</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>


      {/* Left Sidebar - Configuration (Input) - Desktop Only */}
      <aside
        className='hidden lg:flex w-80 bg-white border-r border-[#D8CBB9] flex-col shrink-0 z-30 shadow-[1px_0_20px_rgba(62,42,30,0.05)]'
        aria-label="Configuration"
      >
        <GeneratorConfiguration
          handleImageUpload={handleImageUpload}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          showGrid={showGrid}
          onToggleGrid={handleToggleGrid}
          showBeadCodes={showBeadCodes}
          onToggleBeadCodes={handleToggleBeadCodes}
          canUndo={canUndo}
          onUndo={handleUndo}
          canRedo={canRedo}
          onRedo={handleRedo}
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
          inputId="desktop-upload"
        />
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
      <ExportContainer
        ref={exportRef}
        matrix={matrix}
        gridWidth={gridWidth}
        colorById={colorById}
        beadStyle={beadStyle}
        gridSpacing={gridSpacing}
        exportShowCodes={exportShowCodes}
        exportShowStats={exportShowStats}
        beadStats={beadStats}
        colorMap={colorMap}
        totalBeads={totalBeads}
        translations={{
          statsTitle: t('statsTitle'),
          total: t('total')
        }}
      />

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
      {/* Mobile Navigation */}
      <MobileNav activeTab={activeMobileTab} onTabChange={handleMobileTabChange} />
    </div>
  )
}
