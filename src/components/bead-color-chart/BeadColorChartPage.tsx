import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Pipette, Hash } from 'lucide-react'

interface BeadColor {
  id: string
  name: string
  hex: string
  code?: string
  brand?: string
}

interface BeadColorChartPageProps {
  colors: BeadColor[]
  namespace: string
  locale: string
  brandName: string
  urlPath: string
  keywords: string[]
}

export async function BeadColorChartPage ({ colors, namespace, locale, brandName, urlPath, keywords }: BeadColorChartPageProps) {
  const t = await getTranslations({ locale, namespace })
  const colorNames = (t.raw('colorNames') as Record<string, string>) || {}

  // Categorization for stats
  const pearlCount = colors.filter(c => c.name.toLowerCase().includes('pearl')).length
  const neonCount = colors.filter(c => c.name.toLowerCase().includes('neon')).length
  const standardCount = colors.length - pearlCount - neonCount

  return (
    <div className='min-h-screen bg-[#F1ECE1] py-16 px-4 relative overflow-hidden font-sans'>
      {/* Pegboard Overlay */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #18181B 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />

      <div className='container mx-auto max-w-7xl relative z-10'>
        {/* Back Button */}
        <Link
          href="/"
          className='inline-flex items-center gap-2 mb-12 px-6 py-3 bg-white border-4 border-[#18181B] shadow-[4px_4px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase text-xs tracking-widest'
        >
          <ArrowLeft size={16} /> {t('backToHome')}
        </Link>

        {/* Header */}
        <header className='text-center mb-16 relative'>
          <div className='inline-block bg-[#EF4444] text-white px-8 py-4 border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] mb-6'>
            <h1 className='text-3xl md:text-6xl font-black uppercase tracking-tighter m-0'>
              {t('title')}
            </h1>
          </div>
          <p className='text-[#5A4738] text-lg md:text-xl font-bold max-w-2xl mx-auto'>
            {t('description')}
          </p>
        </header>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16'>
          {[
            { count: colors.length, label: t('stats.total'), color: 'text-[#EF4444]' },
            { count: standardCount, label: t('stats.standard'), color: 'text-[#3B82F6]' },
            { count: pearlCount, label: t('stats.pearl'), color: 'text-[#EC4899]' },
            { count: neonCount, label: t('stats.neon'), color: 'text-[#F59E0B]' },
          ].map((stat, i) => (
            <div key={i} className='bg-white border-4 border-[#18181B] p-6 text-center relative after:content-[""] after:absolute after:-bottom-2 after:-right-2 after:w-full after:h-full after:bg-[#18181B] after:-z-10'>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.count}</div>
              <div className='text-[10px] font-black uppercase tracking-widest text-[#71717A] mt-1'>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Color Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative'>
          {colors.map((color) => (
            <div key={color.id} className='bg-white border-4 border-[#18181B] p-4 group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#18181B] transition-all cursor-default'>
              <div
                className='w-full aspect-square border-4 border-[#18181B] mb-4 relative'
                style={{ backgroundColor: color.hex }}
              >
                <div className='absolute inset-0 opacity-10 pointer-events-none'
                  style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
              </div>
              <div className='space-y-1'>
                {color.code && (
                  <div className='text-[10px] font-black text-[#EF4444] uppercase tracking-widest'>#{color.code}</div>
                )}
                <div className='font-black text-[#18181B] text-sm leading-tight h-10 overflow-hidden line-clamp-2'>{colorNames[color.id] || color.name}</div>
                <div className='flex items-center gap-1 font-mono text-[10px] text-[#71717A] bg-[#F4F4F5] px-2 py-1 inline-block'>
                  <Hash size={10} />
                  {color.hex.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content Section */}
        <section className='mt-24 p-8 md:p-12 bg-white border-4 border-[#18181B] shadow-[12px_12px_0px_#18181B] relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/5 -mr-16 -mt-16 rotate-45' />

          <h2 className='text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10'>
            <Pipette className='text-[#EF4444]' /> {t('subtitle')}
          </h2>
          <div className='prose prose-slate max-w-none text-[#5A4738] font-bold relative z-10'>
            <p className='text-lg leading-relaxed'>
              {t('seoContent.intro')}
            </p>
            <div className='mt-8 grid md:grid-cols-2 gap-8'>
              <div className='p-6 bg-[#F1ECE1] border-2 border-[#18181B]/10'>
                <h3 className='text-lg font-black uppercase mb-4'>{t('seoContent.whyTitle')}</h3>
                <p className='text-sm'>
                  {t('seoContent.whyContent')}
                </p>
              </div>
              <div className='p-6 bg-[#F1ECE1] border-2 border-[#18181B]/10'>
                <h3 className='text-lg font-black uppercase mb-4'>{t('seoContent.masteringTitle')}</h3>
                <p className='text-sm'>
                  {t('seoContent.masteringContent')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: `Official ${brandName} Bead Color Chart`,
            description: `Comprehensive index of ${brandName} Bead colors, codes, and HEX values for pixel art.`,
            url: `https://www.pixel-beads.com/${locale}${urlPath}`,
            keywords: keywords,
            creator: {
              '@type': 'Organization',
              name: 'PixelBeads'
            }
          })
        }}
      />
    </div>
  )
}
