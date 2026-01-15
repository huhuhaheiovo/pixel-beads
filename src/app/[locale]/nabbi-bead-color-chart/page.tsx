import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { JSON_PALETTE_REGISTRY } from '@/lib/generatedJsonPalettes'
import { BeadColorChartPage } from '@/components/bead-color-chart/BeadColorChartPage'

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nabbiColorPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['Nabbi beads', 'color chart', 'bead codes', 'pixel art colors', 'nabbi hex codes'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    }
  }
}

export default async function NabbiColorChartPage ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const colors = [...(JSON_PALETTE_REGISTRY['Nabbi'] || [])]

  return (
    <BeadColorChartPage
      colors={colors}
      namespace="nabbiColorPage"
      locale={locale}
      brandName="Nabbi"
      urlPath="/nabbi-bead-color-chart"
      keywords={['Nabbi Beads', 'Color Chart', 'Pixel Art', 'Bead Codes']}
    />
  )
}
