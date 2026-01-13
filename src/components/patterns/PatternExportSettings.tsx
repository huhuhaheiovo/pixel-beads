'use client'

import { useTranslations } from 'next-intl'
import type { BeadStyle, GridSpacing } from '@/hooks/use-pattern-export'

interface PatternExportSettingsProps {
  beadStyle: BeadStyle
  gridSpacing: GridSpacing
  onBeadStyleChange: (style: BeadStyle) => void
  onGridSpacingChange: (spacing: GridSpacing) => void
}

export function PatternExportSettings ({
  beadStyle,
  gridSpacing,
  onBeadStyleChange,
  onGridSpacingChange
}: PatternExportSettingsProps) {
  const t = useTranslations('Patterns')
  const tg = useTranslations('Generator')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
      <h2 className="text-lg font-bold mb-4">{t('exportSettings') || 'Export Settings'}</h2>
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3E2A1E]"></span>
          {tg('beadStyle')}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {(['square', 'round', 'hollow'] as BeadStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => onBeadStyleChange(style)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${beadStyle === style ? 'bg-[#3E2A1E] text-white border-[#3E2A1E]' : 'bg-[#F7F1E1] text-[#8F7E6F] border-transparent hover:border-[#D8CBB9]'}`}
            >
              {tg(`beadStyle${style.charAt(0).toUpperCase() + style.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3E2A1E]"></span>
          {tg('gridSpacing')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'small', 'large'] as GridSpacing[]).map((spacing) => (
            <button
              key={spacing}
              onClick={() => onGridSpacingChange(spacing)}
              className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${gridSpacing === spacing ? 'bg-[#3E2A1E] text-white border-[#3E2A1E]' : 'bg-[#F7F1E1] text-[#8F7E6F] border-transparent hover:border-[#D8CBB9]'}`}
            >
              {tg(`gridSpacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
