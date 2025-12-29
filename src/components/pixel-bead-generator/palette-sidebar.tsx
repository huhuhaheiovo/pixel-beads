import { BeadColor } from '@/lib/beadData'

interface PaletteSidebarProps {
  activePalette: BeadColor[]
  matrix: string[][]
  selectedColorId: string | null
  onColorSelect: (colorId: string) => void
}

export function PaletteSidebar({
  activePalette,
  matrix,
  selectedColorId,
  onColorSelect
}: PaletteSidebarProps) {
  return (
    <aside className='hidden xl:flex w-72 bg-white border-l border-[#E4E4E7] flex-col overflow-hidden shrink-0'>
      <div className='p-6 border-b border-[#E4E4E7] flex flex-col gap-1'>
        <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]'>Palette</h2>
        <div className='text-[10px] font-bold text-[#18181B]'>{activePalette.length} Colors Total</div>
      </div>
      <div className='flex-1 overflow-y-auto p-4 space-y-1 bg-[#FAFAFA]'>
        {activePalette.map(color => {
          const count = matrix.flat().filter(id => id === color.id).length
          const isActive = selectedColorId === color.id

          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color.id)}
              className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-[#18181B] text-white shadow-xl translate-x-[-4px]' : 'hover:bg-white hover:shadow-md text-[#71717A]'}`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-md border-2 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'border-white/20 shadow-inner' : 'border-[#E4E4E7]'}`}
                  style={{ backgroundColor: color.hex }}
                />
                <div className='text-left'>
                  <div className={`text-[10px] font-black uppercase leading-tight ${isActive ? 'text-white' : 'text-[#18181B]'}`}>
                    {color.name}
                  </div>
                  <div className={`text-[8px] font-bold tracking-widest mt-0.5 ${isActive ? 'text-white/60' : 'text-[#A1A1AA]'}`}>
                    CODE: {color.code}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <span className={`text-[12px] font-black tabular-nums ${isActive ? 'text-white' : 'text-[#18181B]'}`}>
                  {count}
                </span>
                <div className={`text-[7px] font-black uppercase tracking-tighter ${isActive ? 'text-white/40' : 'text-[#A1A1AA]'}`}>
                  beads
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

