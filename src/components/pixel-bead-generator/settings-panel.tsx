import { useState } from 'react'
import { MARD_CATEGORIES, PALETTE_LABELS, PALETTES } from '@/lib/beadData'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom'
export type BeadStyle = 'square' | 'round' | 'hollow'
export type GridSpacing = 'none' | 'small' | 'large'

interface SettingsPanelProps {
  selectedDifficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  gridWidth: number
  onGridWidthChange: (width: number) => void
  cellSize: number
  onCellSizeChange: (size: number) => void
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
            <span>{t('cellSize')}</span>
            <span>{cellSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCellSizeChange(Math.max(8, cellSize - 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
              aria-label="Decrease cell size"
            >
              −
            </button>
            <input
              type="range"
              min="8"
              max="30"
              value={cellSize}
              onChange={(e) => onCellSizeChange(parseInt(e.target.value, 10))}
              className="flex-1 h-1 bg-[#F0EEE8] appearance-none cursor-pointer accent-[#3E2A1E]"
            />
            <button
              onClick={() => onCellSizeChange(Math.min(30, cellSize + 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#F7F1E1] hover:bg-[#F0EEE8] text-[#3E2A1E] rounded-lg font-bold text-sm transition-colors"
              aria-label="Increase cell size"
            >
              +
            </button>
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

