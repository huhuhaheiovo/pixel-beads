import { Undo, Redo, Eraser, Paintbrush, Pipette, Grid3X3, Hash } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Tool = 'brush' | 'eraser' | 'picker'

interface ToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  showGrid: boolean
  onToggleGrid: () => void
  showBeadCodes: boolean
  onToggleBeadCodes: () => void
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
}

export function Toolbar({
  activeTool,
  onToolChange,
  showGrid,
  onToggleGrid,
  showBeadCodes,
  onToggleBeadCodes,
  canUndo,
  onUndo,
  canRedo,
  onRedo
}: ToolbarProps) {
  const t = useTranslations('Generator')

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F]'>{t('tools')}</h2>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <button
          onClick={() => onToolChange('brush')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'brush' ? 'bg-[#32B8A6] text-white shadow-[0_10px_20px_rgba(50,184,166,0.2)] scale-105 z-10' : 'bg-[#FBF9F6] border border-[#D8CBB9] text-[#5A4738] hover:bg-white hover:border-[#3E2A1E] hover:text-[#3E2A1E]'}`}
          title={`${t('brush')}: ${t('brushTooltip')}`}
        >
          <Paintbrush size={18} className='mb-1 transition-transform group-hover:rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('brush')}</span>
        </button>

        <button
          onClick={() => onToolChange('eraser')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'eraser' ? 'bg-[#32B8A6] text-white shadow-[0_10px_20px_rgba(50,184,166,0.2)] scale-105 z-10' : 'bg-[#FBF9F6] border border-[#D8CBB9] text-[#5A4738] hover:bg-white hover:border-[#3E2A1E] hover:text-[#3E2A1E]'}`}
          title={`${t('eraser')}: ${t('eraserTooltip')}`}
        >
          <Eraser size={18} className='mb-1 transition-transform group-hover:-rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('eraser')}</span>
        </button>

        <button
          onClick={() => onToolChange('picker')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'picker' ? 'bg-[#32B8A6] text-white shadow-[0_10px_20px_rgba(50,184,166,0.2)] scale-105 z-10' : 'bg-[#FBF9F6] border border-[#D8CBB9] text-[#5A4738] hover:bg-white hover:border-[#3E2A1E] hover:text-[#3E2A1E]'}`}
          title={`${t('eyedropper')}: ${t('eyedropperTooltip')}`}
        >
          <Pipette size={18} className='mb-1 transition-transform group-hover:scale-110' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('eyedropper')}</span>
        </button>

        <button
          onClick={onToggleGrid}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${showGrid ? 'bg-[#3E2A1E] text-white shadow-[0_10px_20px_rgba(62,42,30,0.2)] scale-105 z-10' : 'bg-[#FBF9F6] border border-[#D8CBB9] text-[#5A4738] hover:bg-white hover:border-[#3E2A1E] hover:text-[#3E2A1E]'}`}
          title={t('toggleGrid')}
        >
          <Grid3X3 size={18} className='mb-1 transition-transform group-hover:scale-110' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('toggleGrid')}</span>
        </button>

        <button
          onClick={onToggleBeadCodes}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${showBeadCodes ? 'bg-[#3E2A1E] text-white shadow-[0_10px_20px_rgba(62,42,30,0.2)] scale-105 z-10' : 'bg-[#FBF9F6] border border-[#D8CBB9] text-[#5A4738] hover:bg-white hover:border-[#3E2A1E] hover:text-[#3E2A1E]'}`}
          title={t('toggleBeadCodes')}
        >
          <Hash size={18} className='mb-1 transition-transform group-hover:rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('toggleBeadCodes')}</span>
        </button>
      </div>

      <div className='flex gap-2 bg-[#F7F1E1] p-1 rounded-xl border border-[#D8CBB9]'>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className='flex-1 py-3 px-2 bg-white rounded-lg shadow-sm border border-[#D8CBB9] text-[#3E2A1E] hover:bg-[#3E2A1E] hover:text-white disabled:bg-transparent disabled:border-transparent disabled:text-[#8F7E6F] disabled:shadow-none transition-all duration-200 flex flex-col items-center gap-1 group'
          title={t('undo')}
        >
          <Undo size={14} className='transition-transform group-hover:-translate-x-0.5 group-active:-translate-x-1' />
          <span className='text-[6px] font-black uppercase tracking-[0.2em]'>{t('undo')}</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className='flex-1 py-3 px-2 bg-white rounded-lg shadow-sm border border-[#D8CBB9] text-[#3E2A1E] hover:bg-[#3E2A1E] hover:text-white disabled:bg-transparent disabled:border-transparent disabled:text-[#8F7E6F] disabled:shadow-none transition-all duration-200 flex flex-col items-center gap-1 group'
          title={t('redo')}
        >
          <Redo size={14} className='transition-transform group-hover:translate-x-0.5 group-active:translate-x-1' />
          <span className='text-[6px] font-black uppercase tracking-[0.2em]'>{t('redo')}</span>
        </button>
      </div>
    </div>
  )
}

