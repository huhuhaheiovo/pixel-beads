import { BeadColor } from '@/lib/beadData'
interface PaletteSidebarProps {
  activePalette: BeadColor[]
  matrix: string[][]
  selectedColorId: string | null
  onColorSelect: (colorId: string) => void
  children?: React.ReactNode
  className?: string
}

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export function PaletteSidebar({
  activePalette,
  matrix,
  selectedColorId,
  onColorSelect,
  children,
  className
}: PaletteSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const groupedPalette = useMemo(() => {
    const groups: Record<string, BeadColor[]> = {}
    activePalette.forEach(color => {
      const char = color.code ? color.code.charAt(0).toUpperCase() : '?'
      if (!groups[char]) groups[char] = []
      groups[char].push(color)
    })

    // Sort beads within groups by code number if possible, or just string sort
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const codeA = a.code || ''
        const codeB = b.code || ''
        return codeA.localeCompare(codeB, undefined, { numeric: true })
      })
    })

    return groups
  }, [activePalette])

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedPalette).sort()
  }, [groupedPalette])

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <aside className={`w-80 bg-white border-l border-[#D8CBB9] flex-col overflow-hidden shrink-0 h-full relative z-20 shadow-[-1px_0_20px_rgba(62,42,30,0.05)] ${className || 'hidden xl:flex'}`}>
      {/* Top Action Area */}
      {children && (
        <div className="p-4 border-b border-[#D8CBB9] bg-white space-y-3 z-10 sticky top-0">
          {children}
        </div>
      )}

      <div className='p-6 border-b border-[#D8CBB9] flex flex-col gap-1 bg-white'>
        <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F]'>Palette</h2>
        <div className='text-[10px] font-bold text-[#3E2A1E]'>{activePalette.length} Colors Total</div>
      </div>

      <div className='flex-1 overflow-y-auto bg-[#FBF9F6]'>
        {sortedGroupKeys.map(groupKey => {
          const beads = groupedPalette[groupKey]
          const isExpanded = expandedGroups[groupKey]
          const groupCount = beads.reduce((acc, color) => {
            return acc + matrix.flat().filter(id => id === color.id).length
          }, 0)

          return (
            <div key={groupKey} className="border-b border-[#F0EEE8] last:border-0">
              <button
                onClick={() => toggleGroup(groupKey)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#F7F1E1] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={14} className="text-[#8F7E6F]" /> : <ChevronRight size={14} className="text-[#8F7E6F]" />}
                  <span className="text-xs font-bold text-[#3E2A1E]">Series {groupKey}</span>
                  <span className="text-[10px] font-medium text-[#8F7E6F] bg-[#F7F1E1] px-1.5 py-0.5 rounded-full">{beads.length}</span>
                </div>
                {groupCount > 0 && (
                  <span className="text-[10px] font-black text-[#3E2A1E] bg-[#F7F1E1] px-2 py-0.5 rounded-full">
                    {groupCount} used
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="p-2 space-y-1 bg-[#F7F1E1]/30">
                  {beads.map(color => {
                    const count = matrix.flat().filter(id => id === color.id).length
                    const isActive = selectedColorId === color.id

                    return (
                      <button
                        key={color.id}
                        onClick={() => onColorSelect(color.id)}
                        className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-[#32B8A6] text-white shadow-lg translate-x-[-2px]' : 'hover:bg-white hover:shadow-sm text-[#5A4738]'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-8 h-8 rounded-md border-2 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'border-white/30 shadow-inner' : 'border-[#D8CBB9]'}`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className='text-left'>
                            <div className={`text-[10px] font-black uppercase leading-tight ${isActive ? 'text-white' : 'text-[#3E2A1E]'}`}>
                              {color.name}
                            </div>
                            <div className={`text-[8px] font-bold tracking-widest mt-0.5 ${isActive ? 'text-white/80' : 'text-[#8F7E6F]'}`}>
                              {color.code}
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col items-end'>
                          {count > 0 && (
                            <>
                              <span className={`text-[12px] font-black tabular-nums ${isActive ? 'text-white' : 'text-[#3E2A1E]'}`}>
                                {count}
                              </span>
                              <div className={`text-[7px] font-black uppercase tracking-tighter ${isActive ? 'text-white/60' : 'text-[#8F7E6F]'}`}>
                                beads
                              </div>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

