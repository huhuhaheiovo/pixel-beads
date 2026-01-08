'use client';

import { forwardRef } from 'react';
import { resolveBeadColor } from '@/lib/beadData';


interface PatternCanvasProps {
    pixels: string[][];
    width: number;
    height: number;
    colorMap: Record<string, string>;
    zoom?: number;
}

export const PatternCanvas = forwardRef<HTMLDivElement, PatternCanvasProps>(
    ({ pixels, width, height, colorMap, zoom = 0.5 }, ref) => {
        return (
            <div
                ref={ref}
                className="inline-block border border-zinc-200 bg-white p-4 shadow-sm"
            >
                <div
                    className="grid gap-px border-l border-t border-zinc-200 bg-zinc-200"
                    style={{
                        gridTemplateColumns: `repeat(${width}, 1fr)`,
                        width: 'fit-content',
                    }}
                >
                    {pixels.map((row, y) =>
                        row.map((color, x) => (
                            <div
                                key={`${y}-${x}`}
                                className="bg-white border-r border-b border-zinc-200 flex items-center justify-center"
                                style={{ width: `${20 * zoom}px`, height: `${20 * zoom}px` }}
                                title={`x:${x}, y:${y}, color:${color}`}
                            >
                                {color !== '#00000000' && color !== 'transparent' && (
                                    <div
                                        className="w-[85%] h-[85%] rounded-full flex items-center justify-center font-bold text-black border border-black/10 shadow-sm"
                                        style={{
                                            backgroundColor: resolveBeadColor(color),
                                            fontSize: `${10 * zoom}px`
                                        }}
                                    >
                                        {zoom >= 0.8 && (
                                            <span className="drop-shadow-md mix-blend-hard-light text-black">
                                                {colorMap[color]}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }
);

PatternCanvas.displayName = 'PatternCanvas';
