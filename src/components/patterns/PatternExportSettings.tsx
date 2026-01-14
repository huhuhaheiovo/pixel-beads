'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
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
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBeadStyleChange = (style: BeadStyle) => {
    if (isProcessing) return
    setIsProcessing(true)
    onBeadStyleChange(style)
    setTimeout(() => {
      setIsProcessing(false)
    }, 400)
  }

  const handleGridSpacingChange = (spacing: GridSpacing) => {
    if (isProcessing) return
    setIsProcessing(true)
    onGridSpacingChange(spacing)
    setTimeout(() => {
      setIsProcessing(false)
    }, 400)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
      <h2 className="text-lg font-bold mb-4">{t('exportSettings') || 'Export Settings'}</h2>
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3E2A1E]"></span>
          {tg('beadStyle')}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {(['square', 'round', 'hollow'] as BeadStyle[]).map((style) => {
            const isActive = beadStyle === style
            return (
              <button
                key={style}
                onClick={() => handleBeadStyleChange(style)}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  isActive 
                    ? 'bg-[#3E2A1E] text-white border-[#3E2A1E]' 
                    : isProcessing
                    ? 'bg-[#F7F1E1]/50 text-[#8F7E6F] border-transparent cursor-wait opacity-75'
                    : 'bg-[#F7F1E1] text-[#8F7E6F] border-transparent hover:border-[#D8CBB9]'
                }`}
              >
                {isProcessing && !isActive ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{tg('processing')}</span>
                  </>
                ) : (
                  tg(`beadStyle${style.charAt(0).toUpperCase() + style.slice(1)}`)
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3E2A1E]"></span>
          {tg('gridSpacing')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'small', 'large'] as GridSpacing[]).map((spacing) => {
            const isActive = gridSpacing === spacing
            return (
              <button
                key={spacing}
                onClick={() => handleGridSpacingChange(spacing)}
                disabled={isProcessing}
                className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#3E2A1E] text-white border-[#3E2A1E]' 
                    : isProcessing
                    ? 'bg-[#F7F1E1]/50 text-[#8F7E6F] border-transparent cursor-wait opacity-75'
                    : 'bg-[#F7F1E1] text-[#8F7E6F] border-transparent hover:border-[#D8CBB9]'
                }`}
              >
                {isProcessing && !isActive ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span className="text-[9px]">{tg('processing')}</span>
                  </>
                ) : (
                  tg(`gridSpacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`)
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
