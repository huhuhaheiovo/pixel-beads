import { BeadColor } from '@/lib/beadData'

interface PaletteSidebarProps {
  activePalette: BeadColor[]
  matrix: string[][]
  selectedColorId: string | null
  onColorSelect: (colorId: string) => void
}

export function PaletteSidebar ({
  activePalette,
  matrix,
  selectedColorId,
  onColorSelect
}: PaletteSidebarProps) {
  return (
    <aside className="hidden xl:flex w-80 bg-white border-l border-[#E4E4E7] flex-col overflow-hidden">
      <div className="p-6 border-b border-[#E4E4E7]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Active Palette</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {activePalette.map(color => {
          const count = matrix.flat().filter(id => id === color.id).length
          const isActive = selectedColorId === color.id

          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color.id)}
              className={`flex items-center justify-between w-full p-3 transition-all ${isActive ? 'bg-[#18181B] text-white shadow-lg' : 'hover:bg-[#F4F4F5] text-[#71717A]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 border ${isActive ? 'border-white/20' : 'border-[#E4E4E7]'}`} style={{ backgroundColor: color.hex }} />
                <div className="text-left">
                  <div className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-[#18181B]'}`}>{color.name}</div>
                  <div className="text-[8px] font-medium opacity-60">Code: {color.code}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#18181B]'}`}>{count}</span>
                <div className="text-[8px] font-medium opacity-40">beads</div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

