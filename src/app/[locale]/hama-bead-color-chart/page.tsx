import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { JSON_PALETTE_REGISTRY } from '@/lib/generatedJsonPalettes'
import { BeadColorChartPage } from '@/components/bead-color-chart/BeadColorChartPage'

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hamaColorPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['Hama beads', 'Hama Midi', 'color chart', 'bead codes', 'pixel art colors', 'hama hex codes'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    }
  }
}

export default async function HamaColorChartPage ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const colors = [...(JSON_PALETTE_REGISTRY['Hama-Midi'] || [])]

  return (
    <BeadColorChartPage
      colors={colors}
      namespace="hamaColorPage"
      locale={locale}
      brandName="Hama"
      urlPath="/hama-bead-color-chart"
      keywords={['Hama Beads', 'Hama Midi', 'Color Chart', 'Pixel Art', 'Bead Codes']}
    />
  )
}
