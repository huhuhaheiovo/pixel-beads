import { PixelBeadGenerator } from '@/components/PixelBeadGenerator'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Generator' })

  const title = locale === 'zh'
    ? '免费拼豆图纸生成器 - 轻松下载图案'
    : 'Free Perler Bead Pattern Generator – Easy Pattern Download'

  const description = locale === 'zh'
    ? '几秒钟内将您的照片转换为精美的像素拼豆图纸。支持自定义网格、精准色彩匹配和高清 PDF/图片导出。'
    : 'Convert your photos into stunning pixel bead art patterns in seconds. Customizable grids, accurate color matching, and HD PDF/Image exports.'

  return {
    title,
    description,
    alternates: {
      canonical: locale === 'en'
        ? 'https://www.pixel-beads.com/perler-bead-pattern-generator'
        : `https://www.pixel-beads.com/${locale}/perler-bead-pattern-generator`,
      languages: {
        en: '/perler-bead-pattern-generator',
        zh: '/zh/perler-bead-pattern-generator',
        'x-default': 'https://www.pixel-beads.com/perler-bead-pattern-generator'
      }
    }
  }
}

function GeneratorFallback() {
  return (
    <div className="min-h-screen bg-[#F7F1E1] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#D8CBB9] rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#3E2A1E] rounded-full animate-spin" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1E]">
          Loading...
        </span>
      </div>
    </div>
  )
}

export default function GeneratorPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E1]" role="main" aria-label="Perler bead pattern generator">
      <Suspense fallback={<GeneratorFallback />}>
        <PixelBeadGenerator />
      </Suspense>
    </main>
  )
}
