'use client';

import { Link } from '@/i18n/routing';
import { Pattern } from '@/lib/pattern-service';
import { useTranslations } from 'next-intl';
import { resolveBeadColor } from '@/lib/beadData';

interface PatternGridProps {
    patterns: Pattern[];
}

export function PatternGrid({ patterns }: PatternGridProps) {
    const t = useTranslations('Patterns');

    const getPatternAltText = (pattern: Pattern) => {
        const patternName = pattern.name || `Pattern ${pattern.id}`
        const sanitizedName = patternName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
        return `perler bead pattern pixel art ${sanitizedName}`
    }

    const getPatternTitle = (pattern: Pattern) => {
        const patternName = pattern.name || `Pattern ${pattern.id}`
        return `Perler Bead Pixel Art – ${patternName}`
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {patterns.map((pattern) => {
                const patternName = pattern.name || `Pattern ${pattern.id}`
                const altText = getPatternAltText(pattern)
                const titleText = getPatternTitle(pattern)

                return (
                    <Link
                        key={pattern.id}
                        href={`/patterns/${pattern.id}`}
                        className="group block border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white"
                        aria-label={`View ${patternName} perler bead pattern`}
                    >
                        <div 
                            className="aspect-square w-full bg-zinc-100 relative p-4 flex items-center justify-center"
                            aria-label={altText}
                            title={titleText}
                        >
                            {/* Simple preview renderer */}
                            <div
                                className="grid"
                                style={{
                                    gridTemplateColumns: `repeat(${pattern.gridSize.width}, 1fr)`,
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '200px',
                                    maxWidth: '200px'
                                }}
                                role="img"
                                aria-label={altText}
                            >
                                {pattern.pixels?.flat().map((color, idx) => (
                                    <div key={idx} style={{ backgroundColor: resolveBeadColor(color) }} />
                                ))}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                {patternName}
                            </h3>
                            {pattern.message && (
                                <p className="text-sm text-zinc-500 line-clamp-2">
                                    {pattern.message}
                                </p>
                            )}
                            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                                <span>{pattern.gridSize.width}x{pattern.gridSize.height}</span>
                                <span className="font-medium text-zinc-900 border border-zinc-200 px-2 py-1 rounded">
                                    {t('viewDetails')}
                                </span>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
