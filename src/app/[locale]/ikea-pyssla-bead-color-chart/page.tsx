import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { JSON_PALETTE_REGISTRY } from '@/lib/generatedJsonPalettes'
import { BeadColorChartPage } from '@/components/bead-color-chart/BeadColorChartPage'

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ikeaPysslaColorPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['Ikea Pyssla beads', 'color chart', 'bead codes', 'pixel art colors', 'ikea pyssla hex codes'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    }
  }
}

export default async function IkeaPysslaColorChartPage ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const colors = [...(JSON_PALETTE_REGISTRY['Ikea-Pyssla'] || [])]

  return (
    <BeadColorChartPage
      colors={colors}
      namespace="ikeaPysslaColorPage"
      locale={locale}
      brandName="Ikea Pyssla"
      urlPath="/ikea-pyssla-bead-color-chart"
      keywords={['Ikea Pyssla Beads', 'Color Chart', 'Pixel Art', 'Bead Codes']}
    />
  )
}
