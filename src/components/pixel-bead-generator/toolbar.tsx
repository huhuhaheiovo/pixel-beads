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
        <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]'>{t('tools')}</h2>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <button
          onClick={() => onToolChange('brush')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'brush' ? 'bg-[#18181B] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105 z-10' : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] hover:bg-white hover:border-[#18181B] hover:text-[#18181B]'}`}
          title={t('brush')}
        >
          <Paintbrush size={18} className='mb-1 transition-transform group-hover:rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('brush')}</span>
        </button>

        <button
          onClick={() => onToolChange('eraser')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'eraser' ? 'bg-[#18181B] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105 z-10' : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] hover:bg-white hover:border-[#18181B] hover:text-[#18181B]'}`}
          title={t('eraser')}
        >
          <Eraser size={18} className='mb-1 transition-transform group-hover:-rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('eraser')}</span>
        </button>

        <button
          onClick={() => onToolChange('picker')}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${activeTool === 'picker' ? 'bg-[#18181B] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105 z-10' : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] hover:bg-white hover:border-[#18181B] hover:text-[#18181B]'}`}
          title={t('eyedropper')}
        >
          <Pipette size={18} className='mb-1 transition-transform group-hover:scale-110' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('eyedropper')}</span>
        </button>

        <button
          onClick={onToggleGrid}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${showGrid ? 'bg-[#18181B] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105 z-10' : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] hover:bg-white hover:border-[#18181B] hover:text-[#18181B]'}`}
          title={t('toggleGrid')}
        >
          <Grid3X3 size={18} className='mb-1 transition-transform group-hover:scale-110' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('toggleGrid')}</span>
        </button>

        <button
          onClick={onToggleBeadCodes}
          className={`group relative flex flex-col items-center justify-center pt-3 pb-2 rounded-xl transition-all duration-300 ${showBeadCodes ? 'bg-[#18181B] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105 z-10' : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] hover:bg-white hover:border-[#18181B] hover:text-[#18181B]'}`}
          title={t('toggleBeadCodes')}
        >
          <Hash size={18} className='mb-1 transition-transform group-hover:rotate-12' />
          <span className='text-[7px] font-black uppercase tracking-widest'>{t('toggleBeadCodes')}</span>
        </button>
      </div>

      <div className='flex gap-2 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7]'>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className='flex-1 py-3 px-2 bg-white rounded-lg shadow-sm border border-[#E4E4E7] text-[#18181B] hover:bg-[#18181B] hover:text-white disabled:bg-transparent disabled:border-transparent disabled:text-[#A1A1AA] disabled:shadow-none transition-all duration-200 flex flex-col items-center gap-1 group'
          title={t('undo')}
        >
          <Undo size={14} className='transition-transform group-hover:-translate-x-0.5 group-active:-translate-x-1' />
          <span className='text-[6px] font-black uppercase tracking-[0.2em]'>{t('undo')}</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className='flex-1 py-3 px-2 bg-white rounded-lg shadow-sm border border-[#E4E4E7] text-[#18181B] hover:bg-[#18181B] hover:text-white disabled:bg-transparent disabled:border-transparent disabled:text-[#A1A1AA] disabled:shadow-none transition-all duration-200 flex flex-col items-center gap-1 group'
          title={t('redo')}
        >
          <Redo size={14} className='transition-transform group-hover:translate-x-0.5 group-active:translate-x-1' />
          <span className='text-[6px] font-black uppercase tracking-[0.2em]'>{t('redo')}</span>
        </button>
      </div>
    </div>
  )
}

