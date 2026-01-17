'use client'

import React from 'react'
import { OptimizedImage } from './OptimizedImage'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from './ui/dialog'
import { cn } from '@/lib/utils'

interface TutorialImageProps {
    src: string
    alt: string
    className?: string
}

export function TutorialImage({ src, alt, className }: TutorialImageProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={cn(
                    "relative cursor-zoom-in group overflow-hidden border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] bg-[#F1ECE1] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#18181B]",
                    className
                )}>
                    <OptimizedImage
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300"
                        operations={{ wsrv: { w: 400, h: 400, fit: 'cover' } }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#18181B] text-white text-[10px] font-black uppercase tracking-tighter py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to expand +
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent shadow-none overflow-hidden sm:rounded-none">
                <DialogTitle className="sr-only">Image Preview: {alt}</DialogTitle>
                <DialogDescription className="sr-only">
                    Full screen preview of {alt}
                </DialogDescription>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                    <OptimizedImage
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-[90vh] object-contain border-[10px] border-[#18181B] shadow-[20px_20px_0px_rgba(0,0,0,0.5)] bg-white"
                        operations={{ wsrv: { w: 1200, q: 90 } }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
