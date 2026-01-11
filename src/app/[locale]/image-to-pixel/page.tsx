import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Image as ImageIcon, Sparkles, Sliders, Palette, Download } from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-space-grotesk',
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'ImageToPixelConverter' })

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/image-to-pixel' : `https://www.pixel-beads.com/${locale}/image-to-pixel`,
            languages: {
                en: '/image-to-pixel',
                zh: '/zh/image-to-pixel',
                'x-default': 'https://www.pixel-beads.com/image-to-pixel'
            }
        }
    }
}

export default async function ImageToPixelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations('ImageToPixelConverter')

    // Structured data with translations
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: t('structuredDataName'),
        description: t('structuredDataDescription'),
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        featureList: [
            t('structuredDataFeature1'),
            t('structuredDataFeature2'),
            t('structuredDataFeature3'),
            t('structuredDataFeature4')
        ]
    }

    return (
        <main className={`min-h-screen bg-slate-950 text-white selection:bg-orange-500 overflow-x-hidden ${spaceGrotesk.variable}`}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

            {/* Background Geometric Primitives (Fixed/Parallax-ish) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Big Orange Circle */}
                <div className="absolute top-[5%] right-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
                {/* Cyan Block */}
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[800px] bg-cyan-900/30 -rotate-12 transform-gpu"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-32">
                <div className="container mx-auto px-6">
                    <div className="relative">
                        {/* Decorative 'Art' elements */}
                        <div className="absolute -top-20 -left-10 w-32 h-32 border-[1px] border-cyan-500/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
                        <div className="absolute top-40 right-10 w-48 h-48 border-[1px] border-orange-500/50 rotate-45"></div>

                        <div className="max-w-5xl mx-auto">
                            <span className={`block text-cyan-400 font-bold tracking-[0.3em] uppercase mb-6 ${spaceGrotesk.className} animate-pulse`}>
                                {t('heroBadge')}
                            </span>

                            <h1 className={`text-7xl md:text-9xl font-black tracking-tighter text-white mb-12 leading-[0.85] mix-blend-difference ${spaceGrotesk.className}`}>
                                {t('h1Line1')} <br />
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 ml-10 italic md:translate-x-20">
                                    {t('h1Line2')}
                                </span>
                            </h1>

                            <div className="flex flex-col md:flex-row items-end gap-12 mt-20">
                                <p className="text-xl md:text-2xl text-slate-300 max-w-md font-light leading-relaxed border-l-4 border-cyan-500 pl-6">
                                    {t('heroDescription')}
                                </p>

                                <Link
                                    href="/perler-bead-pattern-generator"
                                    className="group relative inline-flex items-center justify-center px-16 py-8 bg-white text-black text-xl font-bold uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                    <span className="relative z-10 flex items-center gap-4">
                                        {t('ctaUpload')}
                                        <ImageIcon className="w-6 h-6" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features: The "Gallery" Layout (Broken Grid) */}
            <section className="relative z-10 py-32">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col gap-32">

                        {/* Feature 1: Left Aligned, Cyan Block */}
                        <div className="group relative w-full md:w-2/3 mr-auto p-12 bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-500">
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400 rounded-full group-hover:scale-150 transition-transform duration-500 mix-blend-overlay"></div>
                            <div className="relative z-10 text-cyan-50">
                                <Sliders size={48} className="mb-8 text-cyan-400" />
                                <h3 className={`text-5xl font-bold mb-6 ${spaceGrotesk.className}`}>{t('feature1Title')}</h3>
                                <p className="text-xl font-light opacity-80 max-w-lg">{t('feature1Desc')}</p>
                            </div>
                        </div>

                        {/* Feature 2: Right Aligned, Orange/Red Block, Circle Shape */}
                        <div className="group relative w-full md:w-2/3 ml-auto aspect-square md:aspect-[2/1] flex items-center p-12 bg-gradient-to-bl from-orange-600 to-red-700 rounded-[5rem] md:rounded-full transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="relative z-10 text-white w-full text-center md:text-left md:pl-20">
                                <Palette size={48} className="mb-8 mx-auto md:mx-0 text-white/90" />
                                <h3 className={`text-5xl font-bold mb-6 ${spaceGrotesk.className}`}>{t('feature2Title')}</h3>
                                <p className="text-xl font-medium opacity-90 max-w-lg">{t('feature2Desc')}</p>
                            </div>
                        </div>

                        {/* Feature 3: Center, Minimalist, Big Text */}
                        <div className="group relative w-full p-12 border-y border-white/20 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="text-center md:text-left">
                                    <h3 className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-white group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all ${spaceGrotesk.className}`}>
                                        {t('feature3Title')}
                                    </h3>
                                </div>
                                <div className="max-w-sm text-right">
                                    <Download size={32} className="ml-auto mb-4 text-emerald-400" />
                                    <p className="text-xl text-slate-400">{t('feature3Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works: Steps as "Cards" */}
            <section className="relative z-10 py-32 bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <h2 className={`text-6xl font-black text-white mb-24 text-center ${spaceGrotesk.className}`}>
                        {t('tipsTitle')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {[
                            { num: '01', title: t('tip1Title'), desc: t('tip1Desc'), color: 'bg-cyan-500' },
                            { num: '02', title: t('tip2Title'), desc: t('tip2Desc'), color: 'bg-orange-500' },
                            { num: '03', title: t('tip3Title'), desc: t('tip3Desc'), color: 'bg-emerald-500' }
                        ].map((tip, i) => (
                            <div key={i} className="group relative h-[400px] border-r border-white/10 p-10 flex flex-col justify-between hover:bg-white/5 transition-colors">
                                <div className="text-8xl font-black text-white/5 group-hover:text-white/20 transition-colors">{tip.num}</div>
                                <div>
                                    <div className={`w-12 h-2 ${tip.color} mb-6`}></div>
                                    <h4 className={`text-3xl font-bold text-white mb-4 ${spaceGrotesk.className}`}>{tip.title}</h4>
                                    <p className="text-slate-400 font-light">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA + FAQ mixed: Asymmetric Footer */}
            <section className="relative z-10 py-32">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-20">
                        <div className="w-full md:w-1/2">
                            <h2 className={`text-5xl font-bold tracking-tight text-white mb-12 ${spaceGrotesk.className}`}>{t('faqTitle')}</h2>
                            <div className="space-y-12">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <h3 className={`text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-4 ${spaceGrotesk.className}`}>
                                            <span className="inline-block w-8 h-8 bg-white/10 text-center text-sm leading-8 rounded-full mr-4 group-hover:bg-cyan-400 group-hover:text-black transition-colors">{i}</span>
                                            {t(`faq${i}Question`)}
                                        </h3>
                                        <p className="text-slate-400 pl-12 font-light">{t(`faq${i}Answer`)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative">
                            <div className="sticky top-10">
                                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-12 border border-white/10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://www.pixel-beads.com/pallettes/pallette-3.png')] opacity-10 grayscale mix-blend-overlay"></div>
                                    <div className="relative z-10">
                                        <h3 className={`text-5xl font-black text-white mb-8 leading-tight ${spaceGrotesk.className}`}>
                                            {t('ctaTitle')}
                                        </h3>
                                        <p className="text-xl text-indigo-200 mb-12">{t('ctaSubtitle')}</p>
                                        <Link href="/perler-bead-pattern-generator" className="block w-full py-6 bg-white text-black text-center text-xl font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors">
                                            {t('ctaButton')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Links */}
            <section className="py-20 border-t border-white/10 bg-black/40 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className={`text-2xl font-bold tracking-widest text-white mb-12 uppercase ${spaceGrotesk.className}`}>{t('moreToolsTitle')}</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/minecraft-pixel-art" className="px-8 py-4 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all font-light tracking-wide uppercase">
                            {t('minecraftGuide')}
                        </Link>
                        <Link href="/pixel-art-maker" className="px-8 py-4 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all font-light tracking-wide uppercase">
                            {t('pixelArtMaker')}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
