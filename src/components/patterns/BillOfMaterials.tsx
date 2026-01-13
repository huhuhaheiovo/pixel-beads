'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { resolveBeadColor } from '@/lib/beadData';
import { ChevronDown, ChevronUp } from 'lucide-react';


interface BillOfMaterialsProps {
    pixels: string[][];
    colorMap: Record<string, string>;
}

export function BillOfMaterials({ pixels, colorMap }: BillOfMaterialsProps) {
    const t = useTranslations('Patterns');
    const [isExpanded, setIsExpanded] = useState(false);

    const materials = useMemo(() => {
        const counts: Record<string, number> = {};
        pixels.flat().forEach((color) => {
            if (color !== '#00000000' && color !== 'transparent') {
                counts[color] = (counts[color] || 0) + 1;
            }
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [pixels]);

    const totalBeads = materials.reduce((acc, [, count]) => acc + count, 0);

    return (
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
            >
                <h3 className="text-xl font-bold">{t('materials')}</h3>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
            </button>
            {isExpanded && (
                <>
                    <div className="space-y-3">
                        {materials.map(([color, count]) => (
                            <div key={color} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm flex items-center justify-center font-bold text-xs text-black"
                                        style={{ backgroundColor: resolveBeadColor(color) }}
                                    >
                                        <span className="drop-shadow-md mix-blend-hard-light">{colorMap[color]}</span>
                                    </div>
                                    <span className="font-mono text-sm uppercase text-zinc-500">{color}</span>
                                </div>
                                <div className="font-bold text-lg">{count}</div>
                            </div>
                        ))}
                        {materials.length === 0 && (
                            <p className="text-zinc-500 italic">No materials found.</p>
                        )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between font-bold">
                        <span>{t('totalBeads')}</span>
                        <span>{totalBeads}</span>
                    </div>
                </>
            )}
        </div>
    );
}
