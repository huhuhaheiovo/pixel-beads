import { MARD_CATEGORIES, PALETTE_LABELS, PALETTES } from '@/lib/beadData'

type MardCategory = '72' | '96' | '120' | '144' | '168' | 'all'

interface SettingsPanelProps {
  gridWidth: number
  onGridWidthChange: (width: number) => void
  cellSize: number
  onCellSizeChange: (size: number) => void
  selectedPalette: string
  onPaletteChange: (palette: string) => void
  selectedMardCategory: MardCategory
  onMardCategoryChange: (category: MardCategory) => void
}

export function SettingsPanel ({
  gridWidth,
  onGridWidthChange,
  cellSize,
  onCellSizeChange,
  selectedPalette,
  onPaletteChange,
  selectedMardCategory,
  onMardCategoryChange
}: SettingsPanelProps) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Settings</label>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-[#71717A]">
            <span>Width</span>
            <span>{gridWidth} Units</span>
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
            <span>Cell Size</span>
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
          <span className="text-[10px] font-bold uppercase text-[#71717A]">Bead Brand</span>
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
            <span className="text-[10px] font-bold uppercase text-[#71717A]">MARD Category</span>
            <select
              value={selectedMardCategory}
              onChange={(e) => onMardCategoryChange(e.target.value as MardCategory)}
              className="w-full p-3 bg-[#F4F4F5] border-none text-sm focus:ring-1 focus:ring-[#18181B]"
            >
              <option value="72">72 MARD Colors</option>
              <option value="96">96 MARD Colors</option>
              <option value="120">120 MARD Colors</option>
              <option value="144">144 MARD Colors</option>
              <option value="168">168 MARD Colors</option>
              <option value="all">All MARD Colors (291)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

