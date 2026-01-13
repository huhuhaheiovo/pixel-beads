'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: string[]
}

export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload critical images
    images.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.setAttribute('fetchpriority', 'high')
      document.head.appendChild(link)
    })

    // Cleanup function
    return () => {
      images.forEach((src) => {
        const links = document.querySelectorAll(`link[href="${src}"]`)
        links.forEach((link) => link.remove())
      })
    }
  }, [images])

  return null
}
