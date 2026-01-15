'use client'

import React, { useEffect, useState } from 'react'
import { OptimizedImage as Image } from '@/components/OptimizedImage'
import { normalizeImagePath } from '@/lib/imageUtils'
import { CHRISTMAS_IMAGES, HALLOWEEN_IMAGES, PALLETTES_IMAGES } from '@/lib/imagePaths'

const FLOATING_IMAGES = [
    {
        src: normalizeImagePath(`/${CHRISTMAS_IMAGES.SANTA_CLAUS_ALT}`),
        alt: 'Santa Claus Pixel Art',
        className: 'top-[10%] left-[5%] rotate-[-12deg] w-24 md:w-32 hover:scale-110 active:scale-95',
        animation: 'animate-float-slow',
        isLcpCritical: true
    },
    {
        src: normalizeImagePath(`/${HALLOWEEN_IMAGES.GHOST}`),
        alt: 'Ghost Pixel Art',
        className: 'top-[20%] right-[8%] rotate-[8deg] w-20 md:w-28 hover:scale-110 active:scale-95',
        animation: 'animate-float-medium',
        isLcpCritical: true
    },
    {
        src: normalizeImagePath(`/${PALLETTES_IMAGES.SPONGEBOB_SQUAREPANTS}`),
        alt: 'Spongebob Pixel Art',
        className: 'bottom-[25%] left-[8%] rotate-[5deg] w-28 md:w-36 hover:scale-110 active:scale-95',
        animation: 'animate-float-fast',
        isLcpCritical: false
    },
    {
        src: normalizeImagePath(`/${PALLETTES_IMAGES.PATRICK_STAR}`),
        alt: 'Patrick Star Pixel Art',
        className: 'bottom-[30%] right-[5%] rotate-[-8deg] w-24 md:w-32 hover:scale-110 active:scale-95',
        animation: 'animate-float-slow',
        isLcpCritical: false
    },
    {
        src: normalizeImagePath(`/${CHRISTMAS_IMAGES.TREE}`),
        alt: 'Christmas Tree Pixel Art',
        className: 'top-[45%] left-[15%] rotate-[-5deg] w-16 md:w-24 opacity-60 blur-[1px] -z-10 hover:opacity-100 hover:blur-0',
        animation: 'animate-float-medium',
        isLcpCritical: false
    },
    {
        src: normalizeImagePath(`/${HALLOWEEN_IMAGES.JACK_O_LANTERN}`),
        alt: 'Pumpkin Pixel Art',
        className: 'top-[50%] right-[18%] rotate-[12deg] w-18 md:w-24 opacity-60 blur-[1px] -z-10 hover:opacity-100 hover:blur-0',
        animation: 'animate-float-fast',
        isLcpCritical: false
    }
]

export function HeroFloatingGallery() {
    const [mounted, setMounted] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    if (!mounted) return null

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Desktop Floating Gallery - Hidden on mobile, visible on lg screens */}
            <div className="hidden lg:block absolute inset-0">
                {FLOATING_IMAGES.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute transition-transform duration-1000 ease-out pointer-events-auto cursor-pointer ${img.className} ${img.animation}`}
                        style={{
                            transform: `translate(${mousePosition.x * (index % 2 === 0 ? 1 : -1)}px, ${mousePosition.y * (index % 2 === 0 ? 1 : -1)}px) rotate(${img.className.match(/rotate-\[(.*?)\]/)?.[1] || '0deg'})`
                        }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.isLcpCritical ? 400 : 200}
                            height={img.isLcpCritical ? 400 : 200}
                            className="w-full h-full object-contain drop-shadow-xl"
                            draggable={false}
                            loading={img.isLcpCritical ? 'eager' : 'lazy'}
                            fetchPriority={img.isLcpCritical ? 'high' : 'low'}
                        />
                    </div>
                ))}
            </div>

            {/* Mobile Static Gallery - Visible only on small screens at the bottom of hero */}
            {/* Mobile Floating Gallery - Scattered positions for "surround" effect */}
            <div className="lg:hidden absolute inset-0 overflow-hidden">
                {FLOATING_IMAGES.slice(0, 4).map((img, index) => {
                    // Custom mobile positions to frame the text without blocking it
                    const mobilePositions = [
                        'top-[15%] -left-4',      // Top Left (Santa)
                        'top-[10%] -right-4',     // Top Right (Ghost)
                        'bottom-[25%] -left-2',   // Bottom Left (Spongebob)
                        'bottom-[30%] -right-4'   // Bottom Right (Patrick)
                    ]

                    return (
                        <div
                            key={index}
                            className={`absolute ${mobilePositions[index]} ${index % 2 === 0 ? 'animate-float-slow' : 'animate-float-medium'}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={160}
                                height={160}
                                className={`w-20 h-20 object-contain drop-shadow-lg opacity-90 ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}
                                loading={img.isLcpCritical ? 'eager' : 'lazy'}
                                fetchPriority={img.isLcpCritical ? 'high' : 'low'}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
