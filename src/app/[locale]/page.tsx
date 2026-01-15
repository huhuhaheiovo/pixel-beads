import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowRight, ImageIcon, LayoutGrid, Download, Zap, Hammer, Heart, Star, Sparkles, HelpCircle, AlertCircle, Info, Printer, Box, Layers, Target, Frame } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { StartButton } from '@/components/StartButton'
import { OptimizedImage as Image } from '@/components/OptimizedImage'
import { normalizeImagePath } from '@/lib/imageUtils'
import { ALL_CHRISTMAS_IMAGES, ALL_HALLOWEEN_IMAGES, ALL_PALLETTES_IMAGES } from '@/lib/imagePaths'
import { HeroFloatingGalleryLazy } from '@/components/HeroFloatingGalleryLazy'


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

    // Sample images from all theme directories
    // Use static constants instead of file system operations
    const getSampledImages = () => {
        const sampledImages: { name: string, path: string }[] = []

        // 从每个主题取前 2 张图片
        const themes = [
            { images: ALL_PALLETTES_IMAGES, prefix: 'pallettes' },
            { images: ALL_HALLOWEEN_IMAGES, prefix: 'halloween' },
            { images: ALL_CHRISTMAS_IMAGES, prefix: 'christmas' }
        ]

        themes.forEach(({ images }) => {
            images.slice(0, 2).forEach(imagePath => {
                const fileName = imagePath.split('/').pop() || ''
                const name = fileName.replace(/-/g, ' ').replace(/\.[^/.]+$/, '')
                sampledImages.push({
                    name,
                    path: normalizeImagePath(`/${imagePath}`)
                })
            })
        })

        return sampledImages
    }

    const sampledImages = getSampledImages()

    return (
        <main className='min-h-screen'>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Section */}
            <section className='relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-white'>
                {/* New Floating Gallery */}
                <HeroFloatingGalleryLazy />

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-8 animate-fade-in'>
                            <span className='w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' />
                            <span className='text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700'>{t('badge')}</span>
                        </div>

                        <h1 className='text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8'>
                            <span className='text-[#18181B]'>{t('titlePrefix')}</span> <br />
                            <span className='relative inline-block mt-2'>
                                <span className='text-[#EF4444] drop-shadow-[4px_4px_0px_rgba(239,68,68,0.1)]'>{t('titleAccent')}</span>
                                <Sparkles className='absolute -top-6 -right-8 text-yellow-400 animate-pulse' size={32} />
                                <div className='absolute -bottom-2 left-0 w-full h-3 bg-yellow-400/30 -rotate-1 -z-10 rounded-full' />
                            </span> <br />
                            <span className='text-2xl md:text-3xl font-bold tracking-tight text-[#71717A] mt-6 block max-w-2xl mx-auto normal-case leading-snug'>
                                {t('titleSuffix')}
                            </span>
                        </h1>

                        <p className='text-lg md:text-xl text-[#71717A] mb-12 max-w-2xl mx-auto leading-relaxed font-medium'>
                            {t('description')}
                        </p>

                        <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
                            <StartButton href='/perler-bead-pattern-generator'>
                                {t('ctaStart')}
                            </StartButton>
                            <Link
                                href='#tutorial'
                                className='inline-flex items-center gap-3 px-8 py-4 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-[4px_4px_0px_#EF4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                            >
                                <Hammer size={20} />
                                {t('ctaTutorial')}
                            </Link>
                        </div>
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
                        {sampledImages.map((image, i) => {
                            const isLcpCritical = i < 2
                            const isAboveFold = i < 4

                            return (
                                <div key={i} className='group aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-yellow-400 transition-all shadow-sm hover:shadow-xl'>
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
                                        <Link
                                            href='/perler-bead-pattern-generator'
                                            className='px-6 py-3 bg-white text-[#18181B] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform shadow-lg'
                                        >
                                            Try Creative Design
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className='text-center'>
                        <Link
                            href='/showcase'
                            className='inline-flex items-center gap-3 px-10 py-5 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-[8px_8px_0px_#EF4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group'
                        >
                            Explore All Patterns <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Proof Section */}
            <section className='py-20 border-y-8 border-yellow-400/10 bg-yellow-50/30'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-12 text-center'>
                        {[
                            { label: t('stats.brands'), value: '4+', color: 'text-red-500' },
                            { label: t('stats.export'), value: '300DPI', color: 'text-blue-500' },
                            { label: t('stats.free'), value: '0$', color: 'text-green-500' },
                            { label: t('stats.speed'), value: '<1s', color: 'text-yellow-600' }
                        ].map((stat, i) => (
                            <div key={stat.label} className='group'>
                                <div className={`text-4xl font-black mb-2 tracking-tighter ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</div>
                                <div className='text-[12px] font-black uppercase tracking-[0.2em] text-[#71717A]'>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tutorial Workflow - Pixel Style */}
            <section id='tutorial' className='py-32 bg-[#F7F1E1] border-t-8 border-[#3E2A1E]/10'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-24'>
                        <div className='inline-block p-4 border-4 border-[#18181B] bg-white shadow-[8px_8px_0px_#18181B] mb-8'>
                            <h2 className='text-3xl md:text-5xl font-black tracking-widest uppercase text-[#18181B]'>{t('tutorial.title')}</h2>
                        </div>
                        <p className='text-xl text-[#71717A] max-w-2xl mx-auto font-medium'>{t('description')}</p>
                    </div>

                    <div className='space-y-32'>
                        {/* 1. Selection */}
                        <div className='relative'>
                            <div className='absolute -left-4 top-0 w-1 bg-[#18181B] h-full hidden lg:block opacity-10' />
                            <div className='grid lg:grid-cols-2 gap-16 items-start'>
                                <div className='space-y-8'>
                                    <div className='inline-flex items-center gap-4 px-6 py-3 border-4 border-[#18181B] bg-[#EF4444] text-white shadow-[6px_6px_0px_#18181B]'>
                                        <Target size={24} />
                                        <span className='font-black uppercase tracking-widest'>{t('tutorial.selection.title')}</span>
                                    </div>
                                    <div className='space-y-6'>
                                        <div className='p-8 bg-white border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'>
                                            <div className='flex items-start gap-4 mb-4'>
                                                <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                                                    <Sparkles size={20} className='text-green-600' />
                                                </div>
                                                <div>
                                                    <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>核心价值</h4>
                                                    <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.selection.problem')}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-start gap-4 mb-4'>
                                                <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                                    <Info size={20} className='text-blue-600' />
                                                </div>
                                                <div>
                                                    <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>参数原理</h4>
                                                    <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.selection.principles')}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-start gap-4'>
                                                <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                                                    <AlertCircle size={20} className='text-red-600' />
                                                </div>
                                                <div>
                                                    <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>常见错误</h4>
                                                    <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.selection.mistakes')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='lg:sticky lg:top-24 space-y-6'>
                                    <div className='p-8 bg-white border-4 border-[#18181B] rounded-none'>
                                        <h4 className='flex items-center gap-2 font-black uppercase text-lg tracking-widest text-[#18181B] mb-6'>
                                            <HelpCircle className='text-[#EF4444]' /> FAQ
                                        </h4>
                                        <div className='space-y-6'>
                                            <div className='pb-6 border-b-2 border-dashed border-[#D8CBB9]'>
                                                <p className='font-bold text-[#18181B] mb-2'>Q: Perler 和 Hama 豆子能混用吗？</p>
                                                <p className='text-[#71717A] text-sm leading-relaxed'>A: 建议不混用。不同品牌的收缩率和熔点略有差异，混用可能导致作品不平整。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Coloring */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-16 items-start'>
                                <div className='order-2 lg:order-1 lg:sticky lg:top-24 space-y-6'>
                                    <div className='p-8 bg-white border-4 border-[#18181B]'>
                                        <h4 className='flex items-center gap-2 font-black uppercase text-lg tracking-widest text-[#18181B] mb-6'>
                                            <HelpCircle className='text-[#3B82F6]' /> FAQ
                                        </h4>
                                        <div className='space-y-6'>
                                            <div className='pb-6 border-b-2 border-dashed border-[#D8CBB9]'>
                                                <p className='font-bold text-[#18181B] mb-2'>Q: 如何选出最省钱的配色方案？</p>
                                                <p className='text-[#71717A] text-sm leading-relaxed'>A: 在生成器中勾选‘减少颜色数量’，系统会用最少的色号还原最多的细节。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='order-1 lg:order-2 space-y-8'>
                                    <div className='inline-flex items-center gap-4 px-6 py-3 border-4 border-[#18181B] bg-[#3B82F6] text-white shadow-[6px_6px_0px_#18181B]'>
                                        <Layers size={24} />
                                        <span className='font-black uppercase tracking-widest'>{t('tutorial.coloring.title')}</span>
                                    </div>
                                    <div className='p-8 bg-white border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                                                <Sparkles size={20} className='text-green-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>核心价值</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.coloring.problem')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                                <Info size={20} className='text-blue-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>参数原理</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.coloring.principles')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                                                <AlertCircle size={20} className='text-red-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>常见错误</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.coloring.mistakes')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Printing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-16 items-start'>
                                <div className='space-y-8'>
                                    <div className='inline-flex items-center gap-4 px-6 py-3 border-4 border-[#18181B] bg-[#F59E0B] text-white shadow-[6px_6px_0px_#18181B]'>
                                        <Printer size={24} />
                                        <span className='font-black uppercase tracking-widest'>{t('tutorial.printing.title')}</span>
                                    </div>
                                    <div className='p-8 bg-white border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                                                <Sparkles size={20} className='text-green-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>核心价值</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.printing.problem')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                                <Info size={20} className='text-blue-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>参数原理</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.printing.principles')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                                                <AlertCircle size={20} className='text-red-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>常见错误</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.printing.mistakes')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='lg:sticky lg:top-24 space-y-6'>
                                    <div className='p-8 bg-white border-4 border-[#18181B]'>
                                        <h4 className='flex items-center gap-2 font-black uppercase text-lg tracking-widest text-[#18181B] mb-6'>
                                            <HelpCircle className='text-[#F59E0B]' /> FAQ
                                        </h4>
                                        <div className='space-y-6'>
                                            <div className='pb-6 border-b-2 border-dashed border-[#D8CBB9]'>
                                                <p className='font-bold text-[#18181B] mb-2'>Q: 打印出来的图纸比模板大怎么办？</p>
                                                <p className='text-[#71717A] text-sm leading-relaxed'>A: 请在打印设置中选择‘实际大小’或 100% 比例，不要选择‘适合页面’。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Ironing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-16 items-start'>
                                <div className='order-2 lg:order-1 lg:sticky lg:top-24 space-y-6'>
                                    <div className='p-8 bg-white border-4 border-[#18181B]'>
                                        <h4 className='flex items-center gap-2 font-black uppercase text-lg tracking-widest text-[#18181B] mb-6'>
                                            <HelpCircle className='text-[#10B981]' /> FAQ
                                        </h4>
                                        <div className='space-y-6'>
                                            <div className='pb-6 border-b-2 border-dashed border-[#D8CBB9]'>
                                                <p className='font-bold text-[#18181B] mb-2'>Q: 为什么烫出来的豆子洞很大？</p>
                                                <p className='text-[#71717A] text-sm leading-relaxed'>A: 可能是熨斗压力过大或温度过高，建议采用中小火，画圆手势均匀加热。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='order-1 lg:order-2 space-y-8'>
                                    <div className='inline-flex items-center gap-4 px-6 py-3 border-4 border-[#18181B] bg-[#10B981] text-white shadow-[6px_6px_0px_#18181B]'>
                                        <Zap size={24} />
                                        <span className='font-black uppercase tracking-widest'>{t('tutorial.ironing.title')}</span>
                                    </div>
                                    <div className='p-8 bg-white border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                                                <Sparkles size={20} className='text-green-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>核心价值</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.ironing.problem')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                                <Info size={20} className='text-blue-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>参数原理</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.ironing.principles')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                                                <AlertCircle size={20} className='text-red-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>常见错误</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.ironing.mistakes')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Framing */}
                        <div className='relative'>
                            <div className='grid lg:grid-cols-2 gap-16 items-start'>
                                <div className='space-y-8'>
                                    <div className='inline-flex items-center gap-4 px-6 py-3 border-4 border-[#18181B] bg-purple-500 text-white shadow-[6px_6px_0px_#18181B]'>
                                        <Frame size={24} />
                                        <span className='font-black uppercase tracking-widest'>{t('tutorial.framing.title')}</span>
                                    </div>
                                    <div className='p-8 bg-white border-4 border-[#18181B] shadow-[8px_8px_0px_#18181B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0'>
                                                <Sparkles size={20} className='text-green-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>核心价值</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.framing.problem')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                                <Info size={20} className='text-blue-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>参数原理</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.framing.principles')}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-4'>
                                            <div className='w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                                                <AlertCircle size={20} className='text-red-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-black uppercase text-sm tracking-widest text-[#18181B] mb-2'>常见错误</h4>
                                                <p className='text-[#5A4738] leading-relaxed'>{t('tutorial.framing.mistakes')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='lg:sticky lg:top-24 space-y-6'>
                                    <div className='p-8 bg-white border-4 border-[#18181B]'>
                                        <h4 className='flex items-center gap-2 font-black uppercase text-lg tracking-widest text-[#18181B] mb-6'>
                                            <HelpCircle className='text-purple-500' /> FAQ
                                        </h4>
                                        <div className='space-y-6'>
                                            <div className='pb-6 border-b-2 border-dashed border-[#D8CBB9]'>
                                                <p className='font-bold text-[#18181B] mb-2'>Q: 大幅作品需要特殊的框吗？</p>
                                                <p className='text-[#71717A] text-sm leading-relaxed'>A: 建议选择立体中空框，并使用发泡胶或纳诺胶固定背板。</p>
                                            </div>
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
