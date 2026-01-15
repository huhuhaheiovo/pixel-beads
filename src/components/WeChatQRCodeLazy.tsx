'use client'

import dynamic from 'next/dynamic'

// 客户端组件包装器，用于在 Server Component 中使用 ssr: false 的动态导入
export const WeChatQRCodeLazy = dynamic(
    () => import('@/components/WeChatQRCode').then(mod => ({ default: mod.WeChatQRCode })),
    {
        ssr: false,
        loading: () => null
    }
)
