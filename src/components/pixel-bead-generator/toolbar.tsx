import { Undo, Redo, Eraser, Paintbrush, Pipette, Grid3X3, Hash } from 'lucide-react'

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

export function Toolbar ({
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
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Tools</h2>
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => onToolChange('brush')}
          className={`p-3 transition-colors ${activeTool === 'brush' ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'}`}
          title="Brush"
        >
          <Paintbrush size={18} />
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`p-3 transition-colors ${activeTool === 'eraser' ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'}`}
          title="Eraser"
        >
          <Eraser size={18} />
        </button>
        <button
          onClick={() => onToolChange('picker')}
          className={`p-3 transition-colors ${activeTool === 'picker' ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'}`}
          title="Eyedropper"
        >
          <Pipette size={18} />
        </button>
        <button
          onClick={onToggleGrid}
          className={`p-3 transition-colors ${showGrid ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'}`}
          title="Toggle Grid"
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={onToggleBeadCodes}
          className={`p-3 transition-colors ${showBeadCodes ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'}`}
          title="Toggle Bead Codes"
        >
          <Hash size={18} />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 p-2 bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5] disabled:opacity-30 transition-colors flex justify-center"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 p-2 bg-white border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5] disabled:opacity-30 transition-colors flex justify-center"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  )
}

