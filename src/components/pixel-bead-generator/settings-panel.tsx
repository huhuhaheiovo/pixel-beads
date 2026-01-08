import { MARD_CATEGORIES, PALETTE_LABELS, PALETTES } from '@/lib/beadData'
import { useTranslations } from 'next-intl'

type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom'

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
  exportShowCodes: boolean
  onExportShowCodesChange: (show: boolean) => void
  exportShowStats: boolean
  onExportShowStatsChange: (show: boolean) => void
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
  onMardCategoryChange,
  exportShowCodes,
  onExportShowCodesChange,
  exportShowStats,
  onExportShowStatsChange
}: SettingsPanelProps) {
  const t = useTranslations('Generator')

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-widest text-[#8F7E6F]">{t('settings')}</label>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#5A4738]">
            <span>{t('width')}</span>
            <span>{gridWidth} {t('units')}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={gridWidth}
            onChange={(e) => onGridWidthChange(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#F0EEE8] appearance-none cursor-pointer accent-[#3E2A1E]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#5A4738]">
            <span>{t('cellSize')}</span>
            <span>{cellSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="30"
            value={cellSize}
            onChange={(e) => onCellSizeChange(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#F0EEE8] appearance-none cursor-pointer accent-[#3E2A1E]"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#5A4738]">{t('difficulty')}</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${selectedDifficulty === 'easy'
                  ? 'bg-[#3E2A1E] text-white shadow-lg'
                  : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                }`}
            >
              {t('difficultyEasy')}
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${selectedDifficulty === 'medium'
                  ? 'bg-[#3E2A1E] text-white shadow-lg'
                  : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                }`}
            >
              {t('difficultyMedium')}
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${selectedDifficulty === 'hard'
                  ? 'bg-[#3E2A1E] text-white shadow-lg'
                  : 'bg-[#F7F1E1] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]'
                }`}
            >
              {t('difficultyHard')}
            </button>
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

        <div className='pt-6 space-y-4 border-t border-[#D8CBB9]'>
          <label className='text-xs font-bold uppercase tracking-widest text-[#8F7E6F]'>{t('exportSettings')}</label>
          <div className='space-y-3'>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowCodes}
                onChange={(e) => onExportShowCodesChange(e.target.checked)}
                className='w-4 h-4 rounded border-[#D8CBB9] text-[#3E2A1E] focus:ring-[#3E2A1E]'
              />
              <span className='text-[10px] font-bold uppercase text-[#5A4738] group-hover:text-[#3E2A1E] transition-colors'>
                {t('exportShowCodes')}
              </span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowStats}
                onChange={(e) => onExportShowStatsChange(e.target.checked)}
                className='w-4 h-4 rounded border-[#D8CBB9] text-[#3E2A1E] focus:ring-[#3E2A1E]'
              />
              <span className='text-[10px] font-bold uppercase text-[#5A4738] group-hover:text-[#3E2A1E] transition-colors'>
                {t('exportShowStats')}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

