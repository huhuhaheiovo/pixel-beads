import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowRight, ImageIcon, LayoutGrid, Download, Zap, Hammer, Heart, Star, Sparkles, HelpCircle, AlertCircle, Info, Printer, Box, Layers, Target, Frame } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { StartButton } from '@/components/StartButton'
import { OptimizedImage as Image } from '@/components/OptimizedImage'
import { normalizeImagePath } from '@/lib/imageUtils'
import { FEATURED_IMAGES, getFeaturedImageLink } from '@/lib/featured-images'
import { HeroFloatingGalleryLazy } from '@/components/HeroFloatingGalleryLazy'
import React from 'react'


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'HomePage' })

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/' : `https://www.pixel-beads.com/${locale}`,
            languages: {
                en: '/',
                zh: '/zh',
                'x-default': 'https://www.pixel-beads.com/'
            }
        }
    }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations('HomePage')

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'PixelBeads Pattern Generator',
                applicationCategory: 'DesignApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                }
            },
            {
                '@type': 'HowTo',
                name: t('howItWorks.step1Title'),
                step: [
                    {
                        '@type': 'HowToStep',
                        name: t('howItWorks.step1Title'),
                        text: t('howItWorks.step1Desc')
                    },
                    {
                        '@type': 'HowToStep',
                        name: t('howItWorks.step2Title'),
                        text: t('howItWorks.step2Desc')
                    },
                    {
                        '@type': 'HowToStep',
                        name: t('howItWorks.step3Title'),
                        text: t('howItWorks.step3Desc')
                    },
                    {
                        '@type': 'HowToStep',
                        name: t('howItWorks.step4Title'),
                        text: t('howItWorks.step4Desc')
                    }
                ]
            }
        ]
    }

    // 使用固定的首页展示图片
    const featuredImages = FEATURED_IMAGES.map(image => ({
        name: image.name,
        path: normalizeImagePath(`/${image.path}`),
        link: getFeaturedImageLink(image)
    }))

    return (
        <main className='min-h-screen'>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Section - The Pattern Manifest Redesign */}
            <section className='relative min-h-[90vh] flex items-center overflow-hidden bg-[#FDFCFB] border-b-2 border-[#18181B]'>
                {/* Architectural Grid Background */}
                <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
                    style={{ backgroundImage: 'linear-gradient(#18181B 1px, transparent 1px), linear-gradient(90deg, #18181B 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className='container mx-auto px-6 relative z-10'>
                    <div className='grid grid-cols-12 gap-y-12 lg:gap-12 items-end'>

                        {/* Left Column: Semantic/SEO Sidebar (Editorial Feel) */}
                        <div className='col-span-12 lg:col-span-4 order-2 lg:order-1'>
                            <div className='border-l-2 border-[#18181B] pl-8 py-2'>
                                <div className='text-[10px] font-black uppercase tracking-[0.4em] text-[#EF4444] mb-8 flex items-center gap-2'>
                                    <span className='w-4 h-[2px] bg-current' />
                                    {t('badge')}
                                </div>

                                <p className='text-sm md:text-base text-[#52525B] font-medium leading-relaxed max-w-sm mb-10'>
                                    {t('description')}
                                </p>

                                <div className='flex flex-wrap gap-4'>
                                    <StartButton href='/perler-bead-pattern-generator'>
                                        {t('ctaStart')}
                                    </StartButton>
                                    <Link
                                        href='#tutorial'
                                        className='group relative inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-[#18181B] text-[#18181B] font-black uppercase tracking-widest text-xs hover:bg-[#18181B] hover:text-white transition-colors'
                                    >
                                        {t('ctaTutorial')}
                                        <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
                                    </Link>
                                </div>

                                <div className='mt-16 pt-8 border-t border-[#E4E4E7] grid grid-cols-2 gap-8'>
                                    <div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-1'>Tooling_Type</div>
                                        <div className='text-xs font-bold text-[#18181B]'>{locale === 'zh' ? '免费拼豆图案创建器' : 'Free Pattern Maker'}</div>
                                    </div>
                                    <div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-1'>Version</div>
                                        <div className='text-xs font-bold text-[#18181B]'>2026.1.16</div>
                                    </div>
                                    <div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-1'>Status</div>
                                        <div className='text-xs font-bold text-[#18181B]'>OPEN_ACCESS</div>
                                    </div>
                                    <div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-1'>Origin</div>
                                        <div className='text-xs font-bold text-[#18181B]'>WORKSHOP_01</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Typographic Powerhouse */}
                        <div className='col-span-12 lg:col-span-8 order-1 lg:order-2 lg:text-right'>
                            <div className='relative inline-block'>
                                {/* Large SEO Keyword Vertical/Offset Decor */}
                                <div className='absolute -top-20 -left-10 text-[120px] font-black leading-none text-[#18181B] opacity-[0.02] select-none pointer-events-none hidden lg:block uppercase'>
                                    {locale === 'zh' ? '免费拼豆图案' : 'FREE TOOL'}
                                </div>

                                <h1 className='relative text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.85] text-[#18181B] mb-2 uppercase break-words'>
                                    {t('titlePrefix')} <br />
                                    <span className='text-[#EF4444]'>{t('titleAccent')}</span>
                                </h1>

                                <div className='lg:ml-auto lg:max-w-xl'>
                                    <div className='h-2 bg-[#18181B] mb-6 w-full lg:w-3/4 lg:ml-auto' />
                                    <span className='text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#71717A] block leading-tight'>
                                        {t('titleSuffix')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar Decor (Print Influence) */}
                <div className='absolute bottom-0 left-0 w-full h-12 bg-[#F4F4F5] border-t border-b border-[#18181B] px-6 hidden lg:flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]'>
                    <div className='flex items-center gap-6'>
                        <span>[ BLUEPRINT_MODE ]</span>
                        <span>[ NO_GENERIC_PATTERNS ]</span>
                    </div>
                    <div className='flex items-center gap-6'>
                        <span>PIXELBEADS.STATIONERY_SYSTEM</span>
                        <span>© 2026</span>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className='py-32 bg-white border-t-8 border-yellow-400/10'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-16 relative'>
                        <Heart className='text-red-500 absolute -top-12 left-1/2 -translate-x-1/2 opacity-20' size={48} />
                        <h2 className='text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#18181B]'>{t('showcaseTitle')}</h2>
                        <p className='text-xl text-[#71717A] max-w-2xl mx-auto mb-8 font-medium'>{t('showcaseSubtitle')}</p>
                        <div className='w-24 h-2 bg-red-500 mx-auto rounded-full' />
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-20 animate-fade-in'>
                        {featuredImages.map((image, i) => {
                            const isLcpCritical = i < 2
                            const isAboveFold = i < 4

                            return (
                                <Link
                                    key={i}
                                    href={image.link}
                                    className='group aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-yellow-400 transition-all shadow-sm hover:shadow-xl block'
                                >
                                    <img
                                        src={image.path}
                                        alt={image.name}
                                        width={isLcpCritical ? 800 : isAboveFold ? 400 : 200}
                                        height={isLcpCritical ? 800 : isAboveFold ? 400 : 200}
                                        loading={isLcpCritical ? 'eager' : isAboveFold ? 'eager' : 'lazy'}
                                        fetchPriority={isLcpCritical ? 'high' : 'low'}
                                        decoding='async'
                                        sizes='(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw'
                                        className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center'>
                                        <div className='px-6 py-3 bg-white text-[#18181B] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform shadow-lg'>
                                            {t('viewPattern')}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className='text-center'>
                        <Link
                            href='/showcase'
                            className='inline-flex items-center gap-3 px-10 py-5 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-[8px_8px_0px_#EF4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group'
                        >
                            {t('exploreAllPatterns')} <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Proof Section */}
            {/*<section className='py-20 border-y-8 border-yellow-400/10 bg-yellow-50/30'>*/}
            {/*    <div className='container mx-auto px-4'>*/}
            {/*        <div className='grid grid-cols-2 md:grid-cols-4 gap-12 text-center'>*/}
            {/*            {[*/}
            {/*                { label: t('stats.brands'), value: '4+', color: 'text-red-500' },*/}
            {/*                { label: t('stats.export'), value: '300DPI', color: 'text-blue-500' },*/}
            {/*                { label: t('stats.free'), value: '0$', color: 'text-green-500' },*/}
            {/*                { label: t('stats.speed'), value: '<1s', color: 'text-yellow-600' }*/}
            {/*            ].map((stat, i) => (*/}
            {/*                <div key={stat.label} className='group'>*/}
            {/*                    <div className={`text-4xl font-black mb-2 tracking-tighter ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</div>*/}
            {/*                    <div className='text-[12px] font-black uppercase tracking-[0.2em] text-[#71717A]'>{stat.label}</div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Tutorial Workflow - Pixel Style */}
            <section id='tutorial' className='py-32 bg-[#F1ECE1] border-t-8 border-[#3E2A1E]/10 relative overflow-hidden'>
                {/* Decorative background elements */}
                <div className='absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none pegboard-bg' />

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='text-center mb-24'>
                        <div className='inline-block p-6 bg-white pixel-notched pixel-shadow mb-8 border-4 border-[#18181B]'>
                            <h2 className='text-3xl md:text-5xl font-black tracking-widest uppercase text-[#18181B]'>{t('tutorial.title')}</h2>
                        </div>
                        <p className='text-lg md:text-xl text-[#5A4738] max-w-2xl mx-auto font-bold leading-relaxed'>
                            {t('description')}
                        </p>
                    </div>

                    <div className='space-y-32'>
                        {/* 1. Selection */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-12 items-start'>
                                <div className='space-y-10'>
                                    <div className='inline-flex items-center gap-4 px-8 py-4 bg-[#EF4444] text-white pixel-notched pixel-shadow border-4 border-[#18181B]'>
                                        <Target size={28} />
                                        <h3 className='font-black text-xl uppercase tracking-[0.2em] m-0'>{t('tutorial.selection.title')}</h3>
                                    </div>

                                    <div className='p-10 bg-white pixel-notched border-4 border-[#18181B] pixel-shadow space-y-10'>
                                        {/* Brands */}
                                        <div>
                                            <h4 className='font-black uppercase text-sm tracking-[0.3em] text-[#18181B] mb-6 flex items-center gap-3'>
                                                <Box size={20} className='text-[#3B82F6]' /> {t('tutorial.selection.brands.title')}
                                            </h4>
                                            <div className='grid sm:grid-cols-2 gap-6'>
                                                {(t.raw('tutorial.selection.brands.items') as any[]).map((brand, i) => {
                                                    // Brand to URL mapping
                                                    const brandUrlMap: Record<string, string> = {
                                                        'Perler': '/perler-bead-color-chart',
                                                        'Hama / Hama Midi': '/hama-bead-color-chart',
                                                        'Artkal': '/artkal-bead-color-chart',
                                                        'MARD': '/mard-bead-color-chart',
                                                        'Nabbi / Ikea': '/nabbi-bead-color-chart'
                                                    }

                                                    // Special handling for "Nabbi / Ikea" - split into two cards
                                                    if (brand.name === 'Nabbi / Ikea') {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                {/* Nabbi Card */}
                                                                <Link href="/nabbi-bead-color-chart" className='block h-full'>
                                                                    <div className='p-5 bg-blue-50/50 border-4 border-[#18181B]/10 rounded-none relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors h-full'>
                                                                        <div className='absolute top-0 right-0 w-8 h-8 bg-[#3B82F6]/5 -mr-4 -mt-4 rotate-45 group-hover:bg-[#3B82F6]/10 transition-colors' />
                                                                        <div className='font-black text-[#18181B] mb-2 uppercase tracking-tight text-sm flex items-center gap-2'>
                                                                            Nabbi
                                                                            <ArrowRight size={14} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                                                        </div>
                                                                        <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{brand.desc}</div>
                                                                    </div>
                                                                </Link>
                                                                {/* Ikea Pyssla Card */}
                                                                <Link href="/ikea-pyssla-bead-color-chart" className='block h-full'>
                                                                    <div className='p-5 bg-blue-50/50 border-4 border-[#18181B]/10 rounded-none relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors h-full'>
                                                                        <div className='absolute top-0 right-0 w-8 h-8 bg-[#3B82F6]/5 -mr-4 -mt-4 rotate-45 group-hover:bg-[#3B82F6]/10 transition-colors' />
                                                                        <div className='font-black text-[#18181B] mb-2 uppercase tracking-tight text-sm flex items-center gap-2'>
                                                                            Ikea Pyssla
                                                                            <ArrowRight size={14} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                                                        </div>
                                                                        <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{brand.desc}</div>
                                                                    </div>
                                                                </Link>
                                                            </React.Fragment>
                                                        )
                                                    }

                                                    const brandUrl = brandUrlMap[brand.name]
                                                    const hasColorChart = !!brandUrl

                                                    const BrandContent = (
                                                        <div className='p-5 bg-blue-50/50 border-4 border-[#18181B]/10 rounded-none relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors h-full'>
                                                            <div className='absolute top-0 right-0 w-8 h-8 bg-[#3B82F6]/5 -mr-4 -mt-4 rotate-45 group-hover:bg-[#3B82F6]/10 transition-colors' />
                                                            <div className='font-black text-[#18181B] mb-2 uppercase tracking-tight text-sm flex items-center gap-2'>
                                                                {brand.name}
                                                                {hasColorChart && <ArrowRight size={14} className='opacity-0 group-hover:opacity-100 transition-opacity' />}
                                                            </div>
                                                            <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{brand.desc}</div>
                                                        </div>
                                                    )

                                                    if (hasColorChart) {
                                                        return (
                                                            <Link key={i} href={brandUrl} className='block h-full'>
                                                                {BrandContent}
                                                            </Link>
                                                        )
                                                    }

                                                    return <div key={i}>{BrandContent}</div>
                                                })}
                                            </div>
                                        </div>

                                        {/* Sizes & Colors - Grid */}
                                        <div className='grid md:grid-cols-2 gap-10'>
                                            {/* Sizes */}
                                            <div>
                                                <h4 className='font-black uppercase text-xs tracking-[0.3em] text-[#18181B] mb-5 flex items-center gap-2'>
                                                    <Target size={18} className='text-[#EF4444]' /> {t('tutorial.selection.sizes.title')}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {(t.raw('tutorial.selection.sizes.items') as any[]).map((size, i) => (
                                                        <div key={i} className='p-4 bg-white border-4 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex flex-col'>
                                                            <div className='font-black text-[#18181B] text-sm'>{size.name}</div>
                                                            <div className='text-[10px] font-black text-[#EF4444] uppercase tracking-wider my-1'>{size.target}</div>
                                                            <div className='text-[11px] text-[#5A4738] leading-tight'>{size.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Colors */}
                                            <div>
                                                <h4 className='font-black uppercase text-xs tracking-[0.3em] text-[#18181B] mb-5 flex items-center gap-2'>
                                                    <Layers size={18} className='text-[#F59E0B]' /> {t('tutorial.selection.colors.title')}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {(t.raw('tutorial.selection.colors.items') as any[]).map((opt, i) => (
                                                        <div key={i} className='p-4 bg-[#FFFBEB] border-4 border-[#F59E0B]/20 flex flex-col relative overflow-hidden'>
                                                            <div className='absolute -right-2 -bottom-2 opacity-5'><Layers size={40} /></div>
                                                            <div className='font-black text-[#18181B] text-sm'>{opt.name}</div>
                                                            <div className='text-[11px] text-[#5A4738] leading-tight mt-1'>{opt.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Advice */}
                                        <div className='pt-6 border-t-4 border-dashed border-[#18181B]/10'>
                                            <h4 className='font-black uppercase text-xs tracking-[0.3em] text-[#18181B] mb-5 flex items-center gap-2'>
                                                <Heart size={18} className='text-[#EC4899]' /> {t('tutorial.selection.advice.title')}
                                            </h4>
                                            <div className='bg-[#FDF2F8] border-4 border-[#EC4899]/20 p-6 space-y-4'>
                                                {(t.raw('tutorial.selection.advice.items') as any[]).map((item, i) => (
                                                    <div key={i} className='flex items-center justify-between gap-4'>
                                                        <div className='text-xs font-bold text-[#18181B]'>{item.target}</div>
                                                        <div className='h-px flex-1 bg-pink-200 border-t-2 border-dotted border-pink-400 opacity-30'></div>
                                                        <div className='px-4 py-1.5 bg-white border-2 border-[#18181B] text-[10px] font-black uppercase text-[#EC4899] shadow-[2px_2px_0px_#18181B]'>{item.rec}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selection FAQ Sidebar */}
                                <div className='lg:sticky lg:top-24 space-y-8'>
                                    <div className='bg-white pixel-notched border-4 border-[#18181B] pixel-shadow p-8 relative'>
                                        {/* Decorative Tape */}
                                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-400/80 border-2 border-[#18181B] -rotate-1 shadow-sm flex items-center justify-center font-black text-[10px] tracking-widest uppercase'>Help Desk</div>

                                        <h3 className='flex items-center gap-3 font-black uppercase text-xl tracking-widest text-[#18181B] mt-4 mb-8'>
                                            <HelpCircle className='text-[#EF4444]' size={24} /> {t('tutorial.selection.faqTitle')}
                                        </h3>
                                        <div className='space-y-8'>
                                            {(t.raw('tutorial.selection.faq') as any[]).map((item, idx) => (
                                                <div key={idx} className='group'>
                                                    <div className='flex gap-3 mb-2'>
                                                        <span className='font-black text-[#EF4444] text-lg'>Q:</span>
                                                        <p className='font-black text-[#18181B] text-sm leading-snug'>{item.q}</p>
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <span className='font-black text-[#71717A] text-lg opacity-20'>A:</span>
                                                        <p className='text-[#5A4738] text-xs font-medium leading-relaxed bg-[#F8F9FA] p-4 border-l-4 border-[#EF4444]/20 rounded-none'>{item.a}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Coloring */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-12 items-start'>
                                <div className='space-y-10 lg:order-1'>
                                    <div className='inline-flex items-center gap-4 px-8 py-4 bg-[#3B82F6] text-white pixel-notched pixel-shadow border-4 border-[#18181B]'>
                                        <ImageIcon size={28} />
                                        <h3 className='font-black text-xl uppercase tracking-[0.2em] m-0'>{t('tutorial.coloring.title')}</h3>
                                    </div>

                                    <div className='p-10 bg-white pixel-notched border-4 border-[#18181B] pixel-shadow space-y-12'>
                                        {(t.raw('tutorial.coloring.sections') as any[]).map((section, idx) => (
                                            <div key={idx} className='relative'>
                                                <h4 className='font-black uppercase text-sm tracking-[0.3em] text-[#18181B] mb-6 flex items-center gap-3'>
                                                    {idx === 0 ? <Sparkles size={20} className='text-[#3B82F6]' /> :
                                                        idx === 1 ? <Target size={20} className='text-[#EF4444]' /> :
                                                            <Box size={20} className='text-[#10B981]' />}
                                                    {section.title}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {section.points ? (
                                                        section.points.map((point: any, pIdx: number) => (
                                                            <div key={pIdx} className='p-5 bg-slate-50 border-4 border-[#18181B]/10 rounded-none flex gap-4 items-start group hover:border-[#3B82F6]/30 transition-colors'>
                                                                <div className='mt-1 p-1 bg-white border-2 border-[#18181B] text-[10px] font-black w-6 h-6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors'>{pIdx + 1}</div>
                                                                <div className='space-y-1'>
                                                                    <div className='font-black text-[#18181B] text-sm uppercase tracking-tight'>{point.label || point}</div>
                                                                    {point.desc && <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{point.desc}</div>}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : section.tools ? (
                                                        section.tools.map((tool: any, i: number) => (
                                                            <div key={i} className='p-4 bg-[#EFF6FF] border-4 border-[#18181B]/10 flex flex-col'>
                                                                <div className='font-black text-[#18181B] text-sm'>{tool.name}</div>
                                                                <div className='text-xs text-[#5A4738] leading-tight my-1'>{tool.desc}</div>
                                                                {tool.tip && <div className='text-[10px] text-[#3B82F6] font-black uppercase italic'>{tool.tip}</div>}
                                                            </div>
                                                        ))
                                                    ) : section.tips ? (
                                                        <div className='bg-[#FFFBEB] border-4 border-[#F59E0B]/10 p-5 space-y-3'>
                                                            {section.tips.map((tip: string, i: number) => (
                                                                <div key={i} className='flex gap-3 text-xs text-[#5A4738] font-medium'>
                                                                    <span className='text-[#F59E0B] font-black'>•</span>
                                                                    <span>{tip}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className='text-xs text-[#5A4738] leading-relaxed p-4 bg-slate-50 border-l-4 border-[#18181B]/10'>{section.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coloring FAQ Sidebar */}
                                <div className='lg:order-2 lg:sticky lg:top-24 space-y-8'>
                                    <div className='bg-white pixel-notched border-4 border-[#18181B] pixel-shadow p-8 relative'>
                                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-blue-400 text-white border-2 border-[#18181B] rotate-1 shadow-sm flex items-center justify-center font-black text-[10px] tracking-widest uppercase'>Color Master Tips</div>

                                        <h3 className='flex items-center gap-3 font-black uppercase text-xl tracking-widest text-[#18181B] mt-4 mb-8'>
                                            <HelpCircle className='text-[#3B82F6]' size={24} /> {t('tutorial.coloring.faqTitle')}
                                        </h3>
                                        <div className='space-y-8'>
                                            {(t.raw('tutorial.coloring.faq') as any[]).map((item, idx) => (
                                                <div key={idx} className='group'>
                                                    <div className='flex gap-3 mb-2'>
                                                        <span className='font-black text-[#3B82F6] text-lg'>Q:</span>
                                                        <p className='font-black text-[#18181B] text-sm leading-snug'>{item.q}</p>
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <span className='font-black text-[#71717A] text-lg opacity-20'>A:</span>
                                                        <p className='text-[#5A4738] text-xs font-medium leading-relaxed bg-[#F8F9FA] p-4 border-l-4 border-[#3B82F6]/20 rounded-none'>{item.a}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Printing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-12 items-start'>
                                <div className='space-y-10 lg:col-start-2'>
                                    <div className='inline-flex items-center gap-4 px-8 py-4 bg-[#F59E0B] text-white pixel-notched pixel-shadow border-4 border-[#18181B]'>
                                        <Printer size={28} />
                                        <h3 className='font-black text-xl uppercase tracking-[0.2em] m-0'>{t('tutorial.printing.title')}</h3>
                                    </div>

                                    <div className='p-10 bg-white pixel-notched border-4 border-[#18181B] pixel-shadow space-y-12'>
                                        {(t.raw('tutorial.printing.sections') as any[]).map((section, idx) => (
                                            <div key={idx} className='relative'>
                                                <h4 className='font-black uppercase text-sm tracking-[0.3em] text-[#18181B] mb-6 flex items-center gap-3'>
                                                    <Zap size={20} className='text-[#F59E0B]' />
                                                    {section.title}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {section.points?.map((point: string, pIdx: number) => (
                                                        <div key={pIdx} className='p-6 bg-[#FEF3C7]/30 border-4 border-dashed border-[#F59E0B]/20 rounded-none flex gap-5 items-start relative overflow-hidden group hover:bg-[#FEF3C7]/50 transition-all'>
                                                            <div className='absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity'><Printer size={48} /></div>
                                                            <div className='mt-1 p-1 bg-[#F59E0B] text-white border-2 border-[#18181B] text-[10px] font-black w-6 h-6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#18181B] transition-colors'>{pIdx + 1}</div>
                                                            <div className='space-y-1 relative z-10'>
                                                                <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{point}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Printing FAQ Sidebar */}
                                <div className='lg:sticky lg:top-24 space-y-8 lg:col-start-1 lg:row-start-1'>
                                    <div className='bg-white pixel-notched border-4 border-[#18181B] pixel-shadow p-8 relative'>
                                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#F59E0B] text-white border-2 border-[#18181B] -rotate-1 shadow-sm flex items-center justify-center font-black text-[10px] tracking-widest uppercase'>Blueprint Standard</div>

                                        <h3 className='flex items-center gap-3 font-black uppercase text-xl tracking-widest text-[#18181B] mt-4 mb-8'>
                                            <HelpCircle className='text-[#F59E0B]' size={24} /> {t('tutorial.printing.faqTitle')}
                                        </h3>
                                        <div className='space-y-8'>
                                            {(t.raw('tutorial.printing.faq') as any[]).map((item, idx) => (
                                                <div key={idx} className='group'>
                                                    <div className='flex gap-3 mb-2'>
                                                        <span className='font-black text-[#F59E0B] text-lg'>Q:</span>
                                                        <p className='font-black text-[#18181B] text-sm leading-snug'>{item.q}</p>
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <span className='font-black text-[#71717A] text-lg opacity-20'>A:</span>
                                                        <p className='text-[#5A4738] text-xs font-medium leading-relaxed bg-[#FFFBEB] p-4 border-l-4 border-[#F59E0B]/20 rounded-none'>{item.a}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Ironing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-12 items-start'>
                                <div className='space-y-10 lg:order-1'>
                                    <div className='inline-flex items-center gap-4 px-8 py-4 bg-[#10B981] text-white pixel-notched pixel-shadow border-4 border-[#18181B]'>
                                        <Zap size={28} />
                                        <h3 className='font-black text-xl uppercase tracking-[0.2em] m-0'>{t('tutorial.ironing.title')}</h3>
                                    </div>

                                    <div className='p-10 bg-white pixel-notched border-4 border-[#18181B] pixel-shadow space-y-12'>
                                        {(t.raw('tutorial.ironing.sections') as any[]).map((section, idx) => (
                                            <div key={idx} className='relative'>
                                                <h4 className='font-black uppercase text-sm tracking-[0.3em] text-[#18181B] mb-6 flex items-center gap-3'>
                                                    {idx === 0 ? <Zap size={20} className='text-[#10B981]' /> :
                                                        idx === 1 ? <Info size={20} className='text-[#3B82F6]' /> :
                                                            idx === 3 ? <Star size={20} className='text-[#EC4899]' /> :
                                                                <Hammer size={20} className='text-[#F59E0B]' />}
                                                    {section.title}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {section.points?.map((point: string, pIdx: number) => (
                                                        <div key={pIdx} className='p-5 bg-slate-50 border-4 border-[#18181B]/10 rounded-none flex gap-4 items-start group hover:border-[#10B981]/30 transition-colors'>
                                                            <div className='mt-1 p-1 bg-white border-2 border-[#18181B] text-[10px] font-black w-6 h-6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors'>{pIdx + 1}</div>
                                                            <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{point}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ironing FAQ Sidebar */}
                                <div className='lg:order-2 lg:sticky lg:top-24 space-y-8'>
                                    <div className='bg-white pixel-notched border-4 border-[#18181B] pixel-shadow p-8 relative'>
                                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-44 h-8 bg-[#10B981] text-white border-2 border-[#18181B] rotate-1 shadow-sm flex items-center justify-center font-black text-[10px] tracking-widest uppercase'>Thermostat Master</div>

                                        <h3 className='flex items-center gap-3 font-black uppercase text-xl tracking-widest text-[#18181B] mt-4 mb-8'>
                                            <HelpCircle className='text-[#10B981]' size={24} /> {t('tutorial.ironing.faqTitle')}
                                        </h3>
                                        <div className='pr-4 space-y-8 custom-scrollbar'>
                                            {(t.raw('tutorial.ironing.faq') as any[]).map((item, idx) => (
                                                <div key={idx} className='group'>
                                                    <div className='flex gap-3 mb-2'>
                                                        <span className='font-black text-[#10B981] text-lg'>Q:</span>
                                                        <p className='font-black text-[#18181B] text-sm leading-snug'>{item.q}</p>
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <span className='font-black text-[#71717A] text-lg opacity-20'>A:</span>
                                                        <p className='text-[#5A4738] text-xs font-medium leading-relaxed bg-[#F0FDF4] p-4 border-l-4 border-[#10B981]/20 rounded-none'>{item.a}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Framing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-12 items-start'>
                                <div className='space-y-10 lg:col-start-2'>
                                    <div className='inline-flex items-center gap-4 px-8 py-4 bg-[#EC4899] text-white pixel-notched pixel-shadow border-4 border-[#18181B]'>
                                        <Frame size={28} />
                                        <h3 className='font-black text-xl uppercase tracking-[0.2em] m-0'>{t('tutorial.framing.title')}</h3>
                                    </div>

                                    <div className='p-10 bg-white pixel-notched border-4 border-[#18181B] pixel-shadow space-y-12'>
                                        {(t.raw('tutorial.framing.sections') as any[]).map((section, idx) => (
                                            <div key={idx} className='relative'>
                                                <h4 className='font-black uppercase text-sm tracking-[0.3em] text-[#18181B] mb-6 flex items-center gap-3'>
                                                    <Box size={20} className='text-[#EC4899]' />
                                                    {section.title}
                                                </h4>
                                                <div className='space-y-4'>
                                                    {section.points?.map((point: string, pIdx: number) => (
                                                        <div key={pIdx} className='p-5 bg-slate-50 border-4 border-[#18181B]/10 rounded-none flex gap-4 items-start group hover:border-[#EC4899]/30 transition-colors'>
                                                            <div className='mt-1 p-1 bg-white border-2 border-[#18181B] text-[10px] font-black w-6 h-6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#EC4899] group-hover:text-white transition-colors'>{pIdx + 1}</div>
                                                            <div className='text-xs text-[#5A4738] leading-relaxed font-medium'>{point}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Framing FAQ Sidebar */}
                                <div className='lg:sticky lg:top-24 space-y-8 lg:col-start-1 lg:row-start-1'>
                                    <div className='bg-white pixel-notched border-4 border-[#18181B] pixel-shadow p-8 relative'>
                                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#EC4899] text-white border-2 border-[#18181B] -rotate-1 shadow-sm flex items-center justify-center font-black text-[10px] tracking-widest uppercase'>The Collector</div>

                                        <h3 className='flex items-center gap-3 font-black uppercase text-xl tracking-widest text-[#18181B] mt-4 mb-8'>
                                            <HelpCircle className='text-[#EC4899]' size={24} /> {t('tutorial.framing.faqTitle')}
                                        </h3>
                                        <div className='space-y-8'>
                                            {(t.raw('tutorial.framing.faq') as any[]).map((item, idx) => (
                                                <div key={idx} className='group'>
                                                    <div className='flex gap-3 mb-2'>
                                                        <span className='font-black text-[#EC4899] text-lg'>Q:</span>
                                                        <p className='font-black text-[#18181B] text-sm leading-snug'>{item.q}</p>
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        <span className='font-black text-[#71717A] text-lg opacity-20'>A:</span>
                                                        <p className='text-[#5A4738] text-xs font-medium leading-relaxed bg-[#FDF2F8] p-4 border-l-4 border-[#EC4899]/20 rounded-none'>{item.a}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className='py-32 bg-[#18181B] text-white relative overflow-hidden'>
                <div className='container mx-auto px-4 text-center relative z-10'>
                    <h2 className='text-5xl md:text-8xl font-black tracking-tighter uppercase mb-16 leading-none'>
                        {t('finalCta.title')}
                    </h2>
                    <StartButton href='/perler-bead-pattern-generator' variant="dark">
                        {t('finalCta.button')}
                    </StartButton>
                    <p className='mt-12 text-[#A1A1AA] text-sm font-black uppercase tracking-[0.3em]'>{t('finalCta.footer')}</p>
                </div>

                {/* Final CTA Decorations */}
                <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
                    <div className='absolute top-1/4 left-1/4 w-32 h-32 border-8 border-red-500 rounded-full' />
                    <div className='absolute bottom-1/4 right-1/4 w-24 h-24 border-8 border-yellow-500 rotate-45' />
                    <div className='absolute top-1/2 right-1/3 w-16 h-16 bg-blue-500 rounded-full animate-pulse' />
                </div>
            </section>

            {/* Footer */}
            <footer className='py-16 border-t-8 border-[#18181B] bg-white text-center'>
                <div className='container mx-auto px-4'>
                    <p className='text-xs font-black uppercase tracking-[0.4em] text-[#18181B]'>
                        &copy; {new Date().getFullYear()} PixelBeads • Made for Creative Makers
                    </p>
                    <div className='mt-6 flex justify-center gap-4'>
                        <div className='w-3 h-3 rounded-full bg-red-400' />
                        <div className='w-3 h-3 rounded-full bg-blue-400' />
                        <div className='w-3 h-3 rounded-full bg-yellow-400' />
                        <div className='w-3 h-3 rounded-full bg-green-400' />
                    </div>
                </div>
            </footer>
        </main>
    )
}
