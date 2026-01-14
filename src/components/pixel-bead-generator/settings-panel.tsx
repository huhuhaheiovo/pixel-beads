import { useState } from 'react'
import { MARD_CATEGORIES, PALETTE_LABELS, PALETTES } from '@/lib/beadData'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom'
export type BeadStyle = 'square' | 'round' | 'hollow'
export type GridSpacing = 'none' | 'small' | 'large'
export type CellSizeUnit = 'px' | '5mm' | '2.6mm'

// 转换函数：支持不同 DPI
const DISPLAY_DPI = 96 // 页面显示使用 96 DPI
const EXPORT_DPI = 300 // 导出使用 300 DPI
const MM_TO_INCH = 25.4

export function mmToPx(mm: number, dpi: number = DISPLAY_DPI): number {
  return (mm * dpi) / MM_TO_INCH
}

export function pxToMm(px: number, dpi: number = DISPLAY_DPI): number {
  return (px * MM_TO_INCH) / dpi
}

// 导出专用转换函数（使用 300 DPI）
export function mmToPxForExport(mm: number): number {
  return mmToPx(mm, EXPORT_DPI)
}

export function pxToMmForExport(px: number): number {
  return pxToMm(px, EXPORT_DPI)
}

// 获取指定单位下的显示值和范围
export function getCellSizeDisplayValue(px: number, unit: CellSizeUnit): number {
  if (unit === 'px') return px
  if (unit === '5mm') {
    // 5mm 拼豆的实际尺寸
    const mm = pxToMm(px, DISPLAY_DPI)
    return mm / 5
  }
  // 2.6mm 拼豆的实际尺寸
  const mm = pxToMm(px, DISPLAY_DPI)
  return mm / 2.6
}

export function getCellSizeFromDisplayValue(displayValue: number, unit: CellSizeUnit): number {
  if (unit === 'px') return displayValue
  if (unit === '5mm') {
    // displayValue 是 5mm 的倍数
    const mm = displayValue * 5
    return mmToPx(mm, DISPLAY_DPI)
  }
  // displayValue 是 2.6mm 的倍数
  const mm = displayValue * 2.6
  return mmToPx(mm, DISPLAY_DPI)
}

// 获取固定尺寸的像素值（用于 5mm 和 2.6mm）
export function getFixedSizePx(unit: '5mm' | '2.6mm'): number {
  if (unit === '5mm') {
    // 1×5mm = 5mm，使用 96 DPI 转换
    return mmToPx(5, DISPLAY_DPI)
  }
  // 1×2.6mm = 2.6mm，使用 96 DPI 转换
  return mmToPx(2.6, DISPLAY_DPI)
}

export function getCellSizeRange(unit: CellSizeUnit): { min: number; max: number; step: number } {
  if (unit === 'px') {
    return { min: 8, max: 30, step: 1 }
  }
  if (unit === '5mm') {
    // 8px ≈ 0.42, 30px ≈ 1.59
    return { min: 0.4, max: 1.6, step: 0.1 }
  }
  // 2.6mm: 8px ≈ 0.81, 30px ≈ 3.05
  return { min: 0.8, max: 3.1, step: 0.1 }
}

interface SettingsPanelProps {
  selectedDifficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  gridWidth: number
  onGridWidthChange: (width: number) => void
  cellSize: number
  onCellSizeChange: (size: number) => void
  cellSizeUnit: CellSizeUnit
  onCellSizeUnitChange: (unit: CellSizeUnit) => void
  selectedPalette: string
  onPaletteChange: (palette: string) => void
  selectedMardCategory: MardCategory
  onMardCategoryChange: (category: MardCategory) => void
}

export function SettingsPanel({
  selectedDifficulty,
  onDifficultyChange,
  gridWidth,
  onGridWidthChange,
  cellSize,
  onCellSizeChange,
  cellSizeUnit,
  onCellSizeUnitChange,
  selectedPalette,
  onPaletteChange,
  selectedMardCategory,
  onMardCategoryChange
}: SettingsPanelProps) {
  const t = useTranslations('Generator')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDifficultyChange = (difficulty: Difficulty) => {
    if (isProcessing) return
    setIsProcessing(true)
    onDifficultyChange(difficulty)
    setTimeout(() => {
      setIsProcessing(false)
    }, 400)
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-widest text-[#8F7E6F]">{t('settings')}</label>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#5A4738]">
            <span>{t('width')}</span>
            <span>{gridWidth} {t('units')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGridWidthChange(Math.max(10, gridWidth - 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
              aria-label="Decrease width"
            >
              −
            </button>
            <input
              type="range"
              min="10"
              max="100"
              value={gridWidth}
              onChange={(e) => onGridWidthChange(parseInt(e.target.value, 10))}
              className="flex-1 h-1 bg-[#F0EEE8] appearance-none cursor-pointer accent-[#3E2A1E]"
            />
            <button
              onClick={() => onGridWidthChange(Math.min(100, gridWidth + 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
              aria-label="Increase width"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#5A4738]">
            <span>{t('cellSize')} ({cellSizeUnit === 'px' ? t('cellSizeUnitPx') : cellSizeUnit === '5mm' ? t('cellSizeUnit5mm') : t('cellSizeUnit26mm')})</span>
            <span>
              {cellSizeUnit === 'px' 
                ? `${cellSize}px` 
                : cellSizeUnit === '5mm'
                ? '5mm'
                : '2.6mm'}
            </span>
          </div>
          {cellSizeUnit === 'px' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const range = getCellSizeRange(cellSizeUnit)
                  const currentDisplay = getCellSizeDisplayValue(cellSize, cellSizeUnit)
                  const newDisplay = Math.max(range.min, currentDisplay - range.step)
                  const newPx = getCellSizeFromDisplayValue(newDisplay, cellSizeUnit)
                  onCellSizeChange(Math.round(newPx))
                }}
                className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
                aria-label="Decrease cell size"
              >
                −
              </button>
              <input
                type="range"
                min={getCellSizeRange(cellSizeUnit).min}
                max={getCellSizeRange(cellSizeUnit).max}
                step={getCellSizeRange(cellSizeUnit).step}
                value={getCellSizeDisplayValue(cellSize, cellSizeUnit)}
                onChange={(e) => {
                  const newDisplay = parseFloat(e.target.value)
                  const newPx = getCellSizeFromDisplayValue(newDisplay, cellSizeUnit)
                  onCellSizeChange(Math.round(newPx))
                }}
                className="flex-1 h-1 bg-[#F0EEE8] appearance-none cursor-pointer accent-[#3E2A1E]"
              />
              <button
                onClick={() => {
                  const range = getCellSizeRange(cellSizeUnit)
                  const currentDisplay = getCellSizeDisplayValue(cellSize, cellSizeUnit)
                  const newDisplay = Math.min(range.max, currentDisplay + range.step)
                  const newPx = getCellSizeFromDisplayValue(newDisplay, cellSizeUnit)
                  onCellSizeChange(Math.round(newPx))
                }}
                className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
                aria-label="Increase cell size"
              >
                +
              </button>
            </div>
          ) : (
            <div className="py-2 px-3 bg-[#F7F1E1] rounded-lg text-[10px] text-[#5A4738] text-center">
              {cellSizeUnit === '5mm' ? '5mm' : '2.6mm'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('cellSizeUnit')}</span>
          <div className="grid grid-cols-3 gap-2">
            {(['px', '5mm', '2.6mm'] as CellSizeUnit[]).map((unit) => {
              const isActive = cellSizeUnit === unit
              return (
                <button
                  key={unit}
                  onClick={() => onCellSizeUnitChange(unit)}
                  className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-[#3E2A1E] text-white shadow-lg' 
                      : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                  }`}
                >
                  {unit === 'px' ? t('cellSizeUnitPx') : unit === '5mm' ? t('cellSizeUnit5mm') : t('cellSizeUnit26mm')}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('difficulty')}</span>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => {
              const isActive = selectedDifficulty === difficulty
              return (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyChange(difficulty)}
                  disabled={isProcessing}
                  className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#3E2A1E] text-white shadow-lg' 
                      : isProcessing
                      ? 'bg-[#F7F1E1]/50 text-[#5A4738] cursor-wait opacity-75'
                      : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                  }`}
                >
                  {isProcessing && !isActive ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-[9px]">{t('processing')}</span>
                    </>
                  ) : (
                    t(`difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`)
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('beadBrand')}</span>
          <select
            value={selectedPalette}
            onChange={(e) => onPaletteChange(e.target.value)}
            className="w-full p-3 bg-[#F7F1E1] border-none text-sm text-[#3E2A1E] focus:ring-1 focus:ring-[#3E2A1E]"
          >
            {Object.keys(PALETTE_LABELS).map((key) => (
              <option key={key} value={key}>
                {PALETTE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {selectedPalette === 'MARD' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('mardCategory')}</span>
            <select
              value={selectedMardCategory}
              onChange={(e) => onMardCategoryChange(e.target.value as MardCategory)}
              className="w-full p-3 bg-[#F7F1E1] border-none text-sm text-[#3E2A1E] focus:ring-1 focus:ring-[#3E2A1E]"
            >
              <option value="72">72 {t('colors')}</option>
              <option value="96">96 {t('colors')}</option>
              <option value="120">120 {t('colors')}</option>
              <option value="144">144 {t('colors')}</option>
              <option value="168">168 {t('colors')}</option>
              <option value="all">{t('allColors')} (291)</option>
            </select>
          </div>
        )}

        {/*导出设置*/}

      </div>
    </div>
  )
}

