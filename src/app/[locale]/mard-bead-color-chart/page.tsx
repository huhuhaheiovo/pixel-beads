import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { MARD_PALETTE } from '@/lib/beadData'
import { BeadColorChartPage } from '@/components/bead-color-chart/BeadColorChartPage'

export async function generateMetadata ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'mardColorPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['MARD beads', 'color chart', 'bead codes', 'pixel art colors', 'mard hex codes', '168 colors'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    }
  }
}

export default async function MardColorChartPage ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const colors = [...MARD_PALETTE]

  return (
    <BeadColorChartPage
      colors={colors}
      namespace="mardColorPage"
      locale={locale}
      brandName="MARD"
      urlPath="/mard-bead-color-chart"
      keywords={['MARD Beads', 'Color Chart', 'Pixel Art', 'Bead Codes', '168 Colors']}
    />
  )
}
