'use client';

import { useRef, useCallback, useState } from 'react';
import { Pattern } from '@/lib/pattern-service';
import { PatternCanvas } from './PatternCanvas';
import { BillOfMaterials } from './BillOfMaterials';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface PatternDetailViewProps {
    pattern: Pattern;
}


import { useMemo } from 'react';
import { generateColorMap } from '@/lib/color-map';

export function PatternDetailView({ pattern }: PatternDetailViewProps) {
    const t = useTranslations('Patterns');
    const canvasRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(0.5);

    const colorMap = useMemo(() => generateColorMap(pattern.pixels), [pattern.pixels]);

    const handleExportImage = useCallback(async () => {
        if (!canvasRef.current) return;
        try {
            const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
            const link = document.createElement('a');
            link.download = `${pattern.title.replace(/\s+/g, '_')}_pattern.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
        }
    }, [pattern.title]);

    const handleExportPDF = useCallback(async () => {
        if (!canvasRef.current) return;
        try {
            const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
            const pdf = new jsPDF({
                orientation: pattern.width > pattern.height ? 'landscape' : 'portrait',
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.setFontSize(20);
            pdf.text(pattern.title, 10, 15);

            pdf.addImage(dataUrl, 'PNG', 0, 25, pdfWidth, pdfHeight);

            // TODO: Add BOM to PDF if needed, simplified for now

            pdf.save(`${pattern.title.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('Failed to export PDF', err);
        }
    }, [pattern.width, pattern.height, pattern.title]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/patterns" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('backToLibrary')}
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Content */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black">{pattern.title}</h1>
                            <p className="text-zinc-500 mt-1">{pattern.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleExportImage}>
                                <Download className="w-4 h-4 mr-2" />
                                {t('exportImage')}
                            </Button>
                            <Button onClick={handleExportPDF}>
                                <Download className="w-4 h-4 mr-2" />
                                {t('exportPdf')}
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center bg-zinc-50 rounded-xl p-8 border border-zinc-100 overflow-auto relative">
                        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-sm border border-zinc-200 flex items-center gap-2 z-10">
                            <span className="text-xs font-medium text-zinc-500">{t('zoom')}:</span>
                            <input
                                type="range"
                                min="0.2"
                                max="2"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-24 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                            />
                            <span className="text-xs w-8 text-right font-mono">{Math.round(zoom * 100)}%</span>
                        </div>
                        <PatternCanvas
                            ref={canvasRef}
                            pixels={pattern.pixels}
                            width={pattern.width}
                            height={pattern.height}
                            colorMap={colorMap}
                            zoom={zoom}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0">
                    <BillOfMaterials pixels={pattern.pixels} colorMap={colorMap} />
                </div>
            </div>
        </div>
    );
}
