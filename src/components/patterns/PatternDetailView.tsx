'use client';

import { useRef, useCallback, useState, useMemo } from 'react';
import { Pattern } from '@/lib/pattern-service';
import { BillOfMaterials } from './BillOfMaterials';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import { generateColorMap } from '@/lib/color-map';
import { usePatternExport, type BeadStyle, type GridSpacing } from '@/hooks/use-pattern-export';
import { ExportContainer } from './ExportContainer';
import { Progress } from '../ui/progress';
import { BeadGrid } from '../pixel-bead-generator/bead-grid';
import { BeadColor, resolveBeadColor } from '@/lib/beadData';

interface PatternDetailViewProps {
    pattern: Pattern;
}


export function PatternDetailView({ pattern }: PatternDetailViewProps) {
    const t = useTranslations('Patterns');
    const tg = useTranslations('Generator');
    const locale = useLocale();
    const canvasRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(0.5);

    // Export settings state
    const [beadStyle, setBeadStyle] = useState<BeadStyle>('round');
    const [gridSpacing, setGridSpacing] = useState<GridSpacing>('small');
    const [exportShowCodes, setExportShowCodes] = useState(false);
    const [exportShowStats, setExportShowStats] = useState(true);

    const colorMap = useMemo(() => generateColorMap(pattern.pixels), [pattern.pixels]);

    const patternName = pattern.name || `Pattern ${pattern.id}`

    // Prepare color data for export and display
    const colorById = useMemo(() => {
        const map = new Map<string, BeadColor>();
        const uniqueIds = Array.from(new Set(pattern.pixels.flat())).filter(
            id => id && id !== '#00000000' && id !== 'transparent'
        );

        uniqueIds.forEach(id => {
            const hex = resolveBeadColor(id);
            const detail = pattern.materials?.colors.find(c => c.hex.toLowerCase() === hex.toLowerCase());

            // Sanitize names and codes for PDF export (remove Chinese/non-ASCII)
            const sanitize = (str: string) => str.replace(/[\u4e00-\u9fa5]/g, '').trim();

            map.set(id, {
                id: id,
                code: sanitize(detail?.colorCode || id.split(':').pop() || id) || id,
                name: sanitize(detail?.colorName || id) || id,
                hex: hex,
                brand: pattern.materials?.brand || ''
            });
        });
        return map;
    }, [pattern.pixels, pattern.materials]);

    const internalColorById = colorById;

    const beadStats = useMemo(() => {
        return Array.from(colorById.values()).map(color => {
            const detail = pattern.materials?.colors.find(c => c.hex.toLowerCase() === color.hex.toLowerCase());
            return {
                ...color,
                count: detail?.count || 0
            };
        }).sort((a, b) => b.count - a.count);
    }, [colorById, pattern.materials?.colors]);

    const totalBeads = pattern.materials?.totalBeads || 0;

    const {
        exportToPDF: executeExportPDF,
        exportToImage: executeExportImage,
        isExportingImage,
        exportProgress
    } = usePatternExport({
        matrix: pattern.pixels,
        gridWidth: pattern.gridSize.width,
        selectedPalette: pattern.materials?.brand || 'Perler',
        colorById,
        beadStats,
        totalBeads,
        beadStyle,
        gridSpacing,
        exportRef,
        translations: {
            patternTitle: patternName.replace(/[\u4e00-\u9fa5]/g, '').trim() || 'Pattern',
            generatedFor: 'Generated for',
            gridSize: 'Grid Size',
            colorShoppingList: 'Color Shopping List',
            beadsCount: 'beads',
            total: 'Total',
            statsTitle: 'Bead Count Statistics',
            savingPattern: tg('savingPattern'),
            generatingImage: tg('generatingImage'),
            downloading: tg('downloading')
        }
    });

    const handleExportImage = useCallback(async () => {
        executeExportImage();
    }, [executeExportImage]);

    const handleExportPDF = useCallback(async () => {
        executeExportPDF();
    }, [executeExportPDF]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/perler-bead-pattern" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('backToLibrary')}
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Content */}
                <div className="flex-1 w-full">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black mb-4">{patternName}</h1>
                        
                        {/* Pattern Metadata */}
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-600 mb-4">
                            {pattern.createdAt && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{t('createdAt')}:</span>
                                    <time dateTime={pattern.createdAt}>
                                        {new Date(pattern.createdAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                            )}
                            {pattern.author && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{t('patternAuthor')}:</span>
                                    <span>{pattern.author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{t('patternSize')}:</span>
                                <span>
                                    {pattern.gridSize.width} × {pattern.gridSize.height} {t('beads')}
                                </span>
                            </div>
                        </div>

                        {/* Pattern Description */}
                        {pattern.description && (
                            <div className="mb-4">
                                <h2 className="text-lg font-bold mb-2">{t('patternDescription')}</h2>
                                <p className="text-zinc-600 leading-relaxed">{pattern.description}</p>
                            </div>
                        )}

                        {/* Author Message */}
                        {pattern.message && (
                            <p className="text-zinc-500 italic">{pattern.message}</p>
                        )}
                    </div>

                    {/* Pattern Preview */}
                    <div className="flex justify-center bg-zinc-50 rounded-xl p-8 border border-zinc-100 overflow-auto relative">
                        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-sm border border-zinc-200 flex items-center gap-3 z-10">
                            <span className="text-xs font-medium text-zinc-500">{t('zoom')}:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setZoom(prev => Math.max(0.2, Math.round((prev - 0.1) * 10) / 10))}
                                    className="p-1 hover:bg-zinc-100 rounded-md transition-colors text-zinc-600"
                                    title="Decrease Zoom"
                                >
                                    <Minus size={14} />
                                </button>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="2"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-24 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                                />
                                <button
                                    onClick={() => setZoom(prev => Math.min(2, Math.round((prev + 0.1) * 10) / 10))}
                                    className="p-1 hover:bg-zinc-100 rounded-md transition-colors text-zinc-600"
                                    title="Increase Zoom"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <span className="text-xs w-8 text-right font-mono">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div ref={canvasRef} className="bg-white p-1 shadow-sm">
                            <BeadGrid
                                matrix={pattern.pixels}
                                gridWidth={pattern.gridSize.width}
                                cellSize={18}
                                showGrid={true}
                                showBeadCodes={zoom >= 0.8}
                                colorById={internalColorById}
                                onCellClick={() => { }}
                                zoom={zoom}
                                beadStyle={beadStyle}
                                gridSpacing={gridSpacing}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    {/* Export Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F7E6F] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3E2A1E]"></span>
                                {tg('beadStyle')}
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {(['square', 'round', 'hollow'] as BeadStyle[]).map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setBeadStyle(style)}
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
                                        onClick={() => setGridSpacing(spacing)}
                                        className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${gridSpacing === spacing ? 'bg-[#3E2A1E] text-white border-[#3E2A1E]' : 'bg-[#F7F1E1] text-[#8F7E6F] border-transparent hover:border-[#D8CBB9]'}`}
                                    >
                                        {tg(`gridSpacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-4">
                        <button
                            onClick={handleExportImage}
                            disabled={isExportingImage}
                            className="w-full flex items-center justify-center gap-3 bg-[#3E2A1E] hover:bg-[#5A3E2B] disabled:bg-zinc-300 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_4px_12px_rgba(62,42,30,0.15)] hover:shadow-[0_6px_20px_rgba(62,42,30,0.25)] active:scale-[0.98]"
                        >
                            <ImageIcon size={18} />
                            {t('exportImage')}
                        </button>

                        <button
                            onClick={handleExportPDF}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F7F1E1] text-[#3E2A1E] border-2 border-[#3E2A1E] py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98]"
                        >
                            <Download size={18} />
                            {t('exportPdf')}
                        </button>
                    </div>

                    <BillOfMaterials pixels={pattern.pixels} colorMap={colorMap} />
                </div>
            </div>

            <ExportContainer
                ref={exportRef}
                matrix={pattern.pixels}
                gridWidth={pattern.gridSize.width}
                colorById={colorById}
                beadStyle={beadStyle}
                gridSpacing={gridSpacing}
                exportShowCodes={exportShowCodes}
                exportShowStats={exportShowStats}
                beadStats={beadStats}
                colorMap={colorMap}
                totalBeads={totalBeads}
                translations={{
                    statsTitle: tg('statsTitle'),
                    total: tg('total')
                }}
            />

            {isExportingImage && (
                <div className='fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50'>
                    <div className='flex flex-col items-center gap-6 w-72 p-8 bg-white shadow-2xl rounded-2xl border border-[#D8CBB9]  '>
                        <div className='w-full space-y-4'>
                            <div className='flex justify-between items-end'>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1E]'>
                                    {exportProgress < 90 ? tg('generatingImage') : tg('downloading')}
                                </span>
                                <span className='text-sm font-black text-[#3E2A1E]'>
                                    {exportProgress}%
                                </span>
                            </div>
                            <Progress value={exportProgress} className='h-2 bg-[#F7F1E1]' />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
