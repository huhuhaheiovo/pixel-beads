'use client'

import dynamic from 'next/dynamic'

// 客户端组件包装器，用于在 Server Component 中使用 ssr: false 的动态导入
export const HeroFloatingGalleryLazy = dynamic(
    () => import('@/components/HeroFloatingGallery').then(mod => ({ default: mod.HeroFloatingGallery })),
    {
        ssr: false,
        loading: () => null // 不显示加载状态，避免布局偏移
    }
)
