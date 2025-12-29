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
      <label className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">{t('settings')}</label>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#71717A]">
            <span>{t('width')}</span>
            <span>{gridWidth} {t('units')}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={gridWidth}
            onChange={(e) => onGridWidthChange(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#E4E4E7] appearance-none cursor-pointer accent-[#18181B]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#71717A]">
            <span>{t('cellSize')}</span>
            <span>{cellSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="30"
            value={cellSize}
            onChange={(e) => onCellSizeChange(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#E4E4E7] appearance-none cursor-pointer accent-[#18181B]"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#71717A]">{t('difficulty')}</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedDifficulty === 'easy'
                  ? 'bg-[#18181B] text-white shadow-lg'
                  : 'bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7] hover:text-[#18181B]'
              }`}
            >
              {t('difficultyEasy')}
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedDifficulty === 'medium'
                  ? 'bg-[#18181B] text-white shadow-lg'
                  : 'bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7] hover:text-[#18181B]'
              }`}
            >
              {t('difficultyMedium')}
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedDifficulty === 'hard'
                  ? 'bg-[#18181B] text-white shadow-lg'
                  : 'bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7] hover:text-[#18181B]'
              }`}
            >
              {t('difficultyHard')}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#71717A]">{t('beadBrand')}</span>
          <select
            value={selectedPalette}
            onChange={(e) => onPaletteChange(e.target.value)}
            className="w-full p-3 bg-[#F4F4F5] border-none text-sm focus:ring-1 focus:ring-[#18181B]"
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
            <span className="text-[10px] font-bold uppercase text-[#71717A]">{t('mardCategory')}</span>
            <select
              value={selectedMardCategory}
              onChange={(e) => onMardCategoryChange(e.target.value as MardCategory)}
              className="w-full p-3 bg-[#F4F4F5] border-none text-sm focus:ring-1 focus:ring-[#18181B]"
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

        <div className='pt-6 space-y-4 border-t border-[#E4E4E7]'>
          <label className='text-xs font-bold uppercase tracking-widest text-[#A1A1AA]'>{t('exportSettings')}</label>
          <div className='space-y-3'>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowCodes}
                onChange={(e) => onExportShowCodesChange(e.target.checked)}
                className='w-4 h-4 rounded border-[#E4E4E7] text-[#18181B] focus:ring-[#18181B]'
              />
              <span className='text-[10px] font-bold uppercase text-[#71717A] group-hover:text-[#18181B] transition-colors'>
                {t('exportShowCodes')}
              </span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={exportShowStats}
                onChange={(e) => onExportShowStatsChange(e.target.checked)}
                className='w-4 h-4 rounded border-[#E4E4E7] text-[#18181B] focus:ring-[#18181B]'
              />
              <span className='text-[10px] font-bold uppercase text-[#71717A] group-hover:text-[#18181B] transition-colors'>
                {t('exportShowStats')}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

