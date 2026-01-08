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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {patterns.map((pattern) => (
                <Link
                    key={pattern.id}
                    href={`/patterns/${pattern.id}`}
                    className="group block border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white"
                >
                    <div className="aspect-square w-full bg-zinc-100 relative p-4 flex items-center justify-center">
                        {/* Simple preview renderer */}
                        <div
                            className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${pattern.width}, 1fr)`,
                                width: '100%',
                                height: '100%',
                                maxHeight: '200px',
                                maxWidth: '200px'
                            }}
                        >
                            {pattern.pixels.flat().map((color, idx) => (
                                <div key={idx} style={{ backgroundColor: resolveBeadColor(color) }} />
                            ))}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {pattern.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2">
                            {pattern.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                            <span>{pattern.width}x{pattern.height}</span>
                            <span className="font-medium text-zinc-900 border border-zinc-200 px-2 py-1 rounded">
                                {t('viewDetails')}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
