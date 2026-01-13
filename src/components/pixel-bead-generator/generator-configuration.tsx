import { Upload } from 'lucide-react'
import { Toolbar } from './toolbar'
import { SettingsPanel, type Difficulty } from './settings-panel'
import { useTranslations } from 'next-intl'

interface GeneratorConfigurationProps {
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    activeTool: 'brush' | 'eraser' | 'picker'
    setActiveTool: (tool: 'brush' | 'eraser' | 'picker') => void
    showGrid: boolean
    onToggleGrid: () => void
    showBeadCodes: boolean
    onToggleBeadCodes: () => void
    canUndo: boolean
    onUndo: () => void
    canRedo: boolean
    onRedo: () => void
    selectedDifficulty: Difficulty
    onDifficultyChange: (diff: Difficulty) => void
    gridWidth: number
    onGridWidthChange: (width: number) => void
    cellSize: number
    onCellSizeChange: (size: number) => void
    selectedPalette: string
    onPaletteChange: (palette: string) => void
    selectedMardCategory: '72' | '96' | '120' | '144' | '168' | 'all'
    onMardCategoryChange: (cat: '72' | '96' | '120' | '144' | '168' | 'all') => void
    inputId: string
}

export function GeneratorConfiguration({
    handleImageUpload,
    activeTool,
    setActiveTool,
    showGrid,
    onToggleGrid,
    showBeadCodes,
    onToggleBeadCodes,
    canUndo,
    onUndo,
    canRedo,
    onRedo,
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
    inputId
}: GeneratorConfigurationProps) {
    const t = useTranslations('Generator')

    return (
        <div className='flex flex-col p-6 space-y-8 h-full overflow-y-auto'>
            {/* Section 1: Image Source */}
            <section className='space-y-4'>
                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-[#3E2A1E]'></span>
                    {t('imageSource')}
                </label>

                <input
                    type='file'
                    id={inputId}
                    hidden
                    onChange={handleImageUpload}
                    accept='image/*'
                />
                <label
                    htmlFor={inputId}
                    className='flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-[#D8CBB9] rounded-xl text-[#8F7E6F] text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-[#3E2A1E] hover:text-[#3E2A1E] hover:bg-[#F7F1E1]/50 transition-all group'
                >
                    <Upload size={16} className='group-hover:scale-110 transition-transform' aria-hidden="true" />
                    {t('replaceImage')}
                </label>
            </section>

            <div className='w-full h-px bg-[#F7F1E1]' />

            {/* Section 2: Drawing Tools */}
            <section className='space-y-4'>
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    showGrid={showGrid}
                    onToggleGrid={onToggleGrid}
                    showBeadCodes={showBeadCodes}
                    onToggleBeadCodes={onToggleBeadCodes}
                    canUndo={canUndo}
                    onUndo={onUndo}
                    canRedo={canRedo}
                    onRedo={onRedo}
                />
            </section>

            <div className='w-full h-px bg-[#F7F1E1]' />

            {/* Section 3: Canvas Setup */}
            <section className='space-y-4 pb-8'>
                <SettingsPanel
                    selectedDifficulty={selectedDifficulty}
                    onDifficultyChange={onDifficultyChange}
                    gridWidth={gridWidth}
                    onGridWidthChange={onGridWidthChange}
                    cellSize={cellSize}
                    onCellSizeChange={onCellSizeChange}
                    selectedPalette={selectedPalette}
                    onPaletteChange={onPaletteChange}
                    selectedMardCategory={selectedMardCategory}
                    onMardCategoryChange={onMardCategoryChange}
                />
            </section>
        </div>
    )
}
