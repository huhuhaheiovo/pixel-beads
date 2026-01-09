'use client'

import { forwardRef } from 'react'
import { BeadGrid } from '../pixel-bead-generator/bead-grid'
import { ExportColor, ExportStat, BeadStyle, GridSpacing } from '@/hooks/use-pattern-export'
import { BeadColor } from '@/lib/beadData'

interface ExportContainerProps {
    matrix: string[][]
    gridWidth: number
    colorById: Map<string, ExportColor> | Record<string, ExportColor>
    beadStyle: BeadStyle
    gridSpacing: GridSpacing
    exportShowCodes: boolean
    exportShowStats: boolean
    beadStats: ExportStat[]
    colorMap: Record<string, string>
    totalBeads: number
    translations: {
        statsTitle: string
        total: string
    }
}

export const ExportContainer = forwardRef<HTMLDivElement, ExportContainerProps>(
    ({
        matrix,
        gridWidth,
        colorById,
        beadStyle,
        gridSpacing,
        exportShowCodes,
        exportShowStats,
        beadStats,
        colorMap,
        totalBeads,
        translations
    }, ref) => {
        // Convert colorById to the format BeadGrid expects if necessary
        const internalColorById = new Map<string, BeadColor>()
        if (colorById instanceof Map) {
            colorById.forEach((v, k) => {
                internalColorById.set(k, {
                    id: v.id,
                    code: v.code || undefined,
                    name: v.name,
                    hex: v.hex,
                    brand: ''
                })
            })
        } else {
            Object.entries(colorById).forEach(([k, v]) => {
                internalColorById.set(k, {
                    id: v.id,
                    code: v.code || undefined,
                    name: v.name,
                    hex: v.hex,
                    brand: ''
                })
            })
        }

        return (
            <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                <div
                    ref={ref}
                    className='bg-white p-12 flex flex-row gap-16 items-start'
                    style={{ width: 'fit-content' }}
                >
                    {/* Left: Bead Grid */}
                    <div className='relative bg-white p-1 shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-[#E4E4E7]'>
                        <BeadGrid
                            matrix={matrix}
                            gridWidth={gridWidth}
                            cellSize={18} // Fixed larger size for export to ensure codes are legible
                            showGrid={true} // Always show grid in export
                            showBeadCodes={exportShowCodes}
                            colorById={internalColorById}
                            onCellClick={() => { }}
                            beadStyle={beadStyle}
                            gridSpacing={gridSpacing}
                        />
                        {/* Watermark Overlay */}
                        <div className="absolute bottom-3 left-3 opacity-50 pointer-events-none z-10">
                            <span className="text-lg font-bold text-[#18181B] tracking-tight">
                                https://www.pixel-beads.com/
                            </span>
                        </div>
                    </div>

                    {/* Right: Statistics Panel */}
                    {exportShowStats && (
                        <div className='w-[320px] flex flex-col pt-2 pr-4'>
                            <h2 className='text-[20px] font-black uppercase tracking-[0.1em] text-[#18181B] text-center mb-8 pb-4 border-b-2 border-[#F4F4F5]'>
                                {translations.statsTitle}
                            </h2>

                            <div className='space-y-4'>
                                {beadStats.map(color => (
                                    <div key={color.id} className='flex items-center justify-between group'>
                                        <div className='flex items-center gap-5'>
                                            <div
                                                className='w-8 h-8 rounded-full border border-zinc-200 shadow-sm flex items-center justify-center font-bold text-xs text-black'
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                <span className="drop-shadow-md mix-blend-hard-light">{colorMap[color.id] || ''}</span>
                                            </div>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-[14px] font-black text-[#18181B] uppercase tracking-wider w-12'>
                                                    {color.code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex items-baseline gap-1'>
                                            <span className='text-[16px] font-black text-[#18181B]'>
                                                {color.count}
                                            </span>
                                            <span className='text-[10px] font-bold text-[#A1A1AA] uppercase tracking-tighter'>
                                                beads
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-12 pt-8 border-t-2 border-[#F4F4F5] flex justify-between items-center px-2'>
                                <span className='text-[12px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]'>
                                    {translations.total}
                                </span>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-[24px] font-black text-[#18181B]'>
                                        {totalBeads}
                                    </span>
                                    <span className='text-[12px] font-black text-[#18181B] uppercase tracking-tighter'>
                                        beads
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
)

ExportContainer.displayName = 'ExportContainer'
