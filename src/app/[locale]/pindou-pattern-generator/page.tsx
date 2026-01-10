import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Image as ImageIcon, Sparkles, Sliders, Palette, Download, Grid, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { Patrick_Hand } from 'next/font/google'

const patrickHand = Patrick_Hand({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-patrick-hand',
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'ImageToPixel' })

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/pindou-pattern-generator' : `https://www.pixel-beads.com/${locale}/pindou-pattern-generator`,
            languages: {
                en: '/pindou-pattern-generator',
                zh: '/zh/pindou-pattern-generator',
                'x-default': 'https://www.pixel-beads.com/pindou-pattern-generator'
            }
        }
    }
}

export default async function ImageToPixelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations('ImageToPixel')

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
        <main className={`min-h-screen bg-[#fdfbf7] ${patrickHand.variable}`}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-20 right-10 w-32 h-32 border-4 border-black rounded-full opacity-10 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 border-4 border-black rotate-12 opacity-10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fced9a] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2">
                            <Sparkles className="w-4 h-4 text-black" />
                            <span className={`text-sm font-bold uppercase tracking-widest text-black ${patrickHand.className}`}>{t('heroBadge')}</span>
                        </div>

                        <h1 className={`text-6xl md:text-8xl font-black text-[#18181B] mb-8 leading-[0.9] ${patrickHand.className}`}>
                            {t('h1')}
                        </h1>

                        <p className={`text-2xl text-[#18181B] max-w-2xl mx-auto leading-relaxed font-bold mb-12 ${patrickHand.className}`}>
                            {t('heroDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/perler-bead-pattern-generator"
                                className={`inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#4ade80] text-black border-2 border-black rounded-xl font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${patrickHand.className} text-xl`}
                            >
                                <ImageIcon size={24} className="stroke-[3]" />
                                {t('ctaUpload')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-24">

                        {/* H2-1: What Are Perler Bead Patterns? */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-8 transform -rotate-1 inline-block border-b-4 border-[#f472b6] ${patrickHand.className}`}>
                                {t('h2WhatIs')}
                            </h2>
                            <p className="text-xl text-[#18181B] leading-relaxed mb-8 font-medium">
                                {t('whatIsContent')}
                            </p>
                            <div className="bg-white rounded-xl p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className={`text-3xl font-bold text-[#18181B] mb-6 ${patrickHand.className}`}>{t('whoCanUse')}</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[t('whoCanUse1'), t('whoCanUse2'), t('whoCanUse3'), t('whoCanUse4')].map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#f472b6] flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-[#18181B] font-bold text-lg">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* H2-2: How to Convert Images */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-12 transform rotate-1 inline-block border-b-4 border-[#4ade80] ${patrickHand.className}`}>
                                {t('h2HowToConvert')}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { title: t('step1Title'), desc: t('step1Desc'), color: 'bg-[#60a5fa]' },
                                    { title: t('step2Title'), desc: t('step2Desc'), color: 'bg-[#f472b6]' },
                                    { title: t('step3Title'), desc: t('step3Desc'), color: 'bg-[#fced9a]' },
                                    { title: t('step4Title'), desc: t('step4Desc'), color: 'bg-[#4ade80]' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className={`w-16 h-16 rounded-xl border-2 border-black ${step.color} text-black font-black text-3xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[-4px] transition-transform ${patrickHand.className}`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-bold text-[#18181B] mb-2 ${patrickHand.className}`}>{step.title}</h3>
                                            <p className="text-[#18181B] font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* H2-3: Custom Settings */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-12 transform -rotate-1 inline-block border-b-4 border-[#60a5fa] ${patrickHand.className}`}>
                                {t('h2CustomSettings')}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { icon: Grid, title: t('customGridTitle'), desc: t('customGridDesc'), color: 'bg-[#60a5fa]' },
                                    { icon: Palette, title: t('customColorTitle'), desc: t('customColorDesc'), color: 'bg-[#f472b6]' },
                                    { icon: ShoppingCart, title: t('customStatsTitle'), desc: t('customStatsDesc'), color: 'bg-[#fced9a]' }
                                ].map((item, i) => (
                                    <div key={i} className="p-8 rounded-xl bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all">
                                        <div className={`w-14 h-14 ${item.color} rounded-xl border-2 border-black flex items-center justify-center text-black mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                                            <item.icon size={28} className="stroke-[2.5]" />
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-3 text-[#18181B] ${patrickHand.className}`}>{item.title}</h3>
                                        <p className="text-[#18181B] font-medium">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* H2-4: Download Formats */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-12 transform rotate-1 inline-block border-b-4 border-[#fced9a] ${patrickHand.className}`}>
                                {t('h2DownloadFormats')}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-xl bg-[#e0f7fa] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Download size={100} />
                                    </div>
                                    <h3 className={`text-3xl font-bold mb-4 text-[#18181B] ${patrickHand.className}`}>{t('formatPdfTitle')}</h3>
                                    <p className="text-[#18181B] font-medium text-lg relative z-10">{t('formatPdfDesc')}</p>
                                </div>
                                <div className="p-8 rounded-xl bg-[#fff9c4] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ImageIcon size={100} />
                                    </div>
                                    <h3 className={`text-3xl font-bold mb-4 text-[#18181B] ${patrickHand.className}`}>{t('formatImageTitle')}</h3>
                                    <p className="text-[#18181B] font-medium text-lg relative z-10">{t('formatImageDesc')}</p>
                                </div>
                            </div>
                        </section>

                        {/* H2-5: Why Choose This Tool */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-12 transform -rotate-1 inline-block border-b-4 border-black ${patrickHand.className}`}>
                                {t('h2WhyChoose')}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { title: t('advantage1Title'), desc: t('advantage1Desc'), color: 'bg-white' },
                                    { title: t('advantage2Title'), desc: t('advantage2Desc'), color: 'bg-white' },
                                    { title: t('advantage3Title'), desc: t('advantage3Desc'), color: 'bg-white' },
                                    { title: t('advantage4Title'), desc: t('advantage4Desc'), color: 'bg-white' }
                                ].map((adv, i) => (
                                    <div key={i} className={`p-8 rounded-xl ${adv.color} border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                                        <h3 className={`text-2xl font-bold mb-3 text-[#18181B] ${patrickHand.className}`}>{adv.title}</h3>
                                        <p className="text-[#18181B] font-medium">{adv.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className={`text-5xl font-black text-[#18181B] mb-12 transform rotate-1 inline-block border-b-4 border-[#f472b6] ${patrickHand.className}`}>{t('faqTitle')}</h2>
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="border-2 border-black rounded-xl p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <h3 className={`text-xl font-bold text-[#18181B] mb-2 ${patrickHand.className}`}>{t(`faq${i}Question`)}</h3>
                                        <p className="text-[#18181B] font-medium">{t(`faq${i}Answer`)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Internal Linking */}
            <section className="py-20 border-t-2 border-black bg-[#f0f0f0]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className={`text-4xl font-black text-[#18181B] mb-12 ${patrickHand.className}`}>{t('moreToolsTitle')}</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/minecraft-pixel-art" className={`px-8 py-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#18181B] hover:bg-[#4ade80] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-lg ${patrickHand.className}`}>
                            {t('minecraftGuide')}
                        </Link>
                        <Link href="/pixel-art-maker" className={`px-8 py-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#18181B] hover:bg-[#f472b6] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-lg ${patrickHand.className}`}>
                            {t('pixelArtMaker')}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
