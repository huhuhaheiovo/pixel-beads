import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ARTKAL_S_PALETTE } from '@/lib/beadData'
import { BeadColorChartPage } from '@/components/bead-color-chart/BeadColorChartPage'

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artkalColorPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['Artkal beads', 'Artkal-S', 'color chart', 'bead codes', 'pixel art colors', 'artkal hex codes'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    }
  }
}

export default async function ArtkalColorChartPage ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const colors = [...ARTKAL_S_PALETTE]

  return (
    <BeadColorChartPage
      colors={colors}
      namespace="artkalColorPage"
      locale={locale}
      brandName="Artkal"
      urlPath="/artkal-bead-color-chart"
      keywords={['Artkal Beads', 'Artkal-S', 'Color Chart', 'Pixel Art', 'Bead Codes']}
    />
  )
}
