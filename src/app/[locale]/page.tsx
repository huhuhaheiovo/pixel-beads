import { Link } from '@/i18n/routing'
import { ArrowRight, ImageIcon, LayoutGrid, Download, Zap, Hammer } from 'lucide-react'
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export default async function Home() {
    const t = await getTranslations('HomePage');

    // Sample images from all theme directories
    const themeDirs = ['pallettes', 'halloween', 'christmas'];
    const sampledImages: { name: string; path: string }[] = [];

    themeDirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), 'public', dir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath)
                .filter(file => file.match(/\.(png|jpe?g|gif|webp)$/i))
                .slice(0, 2); // Take 2 from each dir

            files.forEach(file => {
                sampledImages.push({
                    name: file.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
                    path: `/${dir}/${file}`
                });
            });
        }
    });

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] mb-8 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">{t('badge')}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                            {t('titlePrefix')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {t('titleAccent')}
                            </span> <br />
                            {/*{t('titleSuffix')}*/}
                        </h1>
                        <p className="text-lg md:text-xl text-[#71717A] mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/generator"
                                className="w-full sm:w-auto px-10 py-5 bg-[#18181B] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                {t('ctaStart')} <ArrowRight size={18} />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-[#E4E4E7] text-[#18181B] rounded-2xl font-bold uppercase tracking-widest hover:border-[#18181B] transition-all flex items-center justify-center"
                            >
                                {t('ctaLearn')}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Showcase Section */}
            <section className="py-24 bg-white border-t border-[#E4E4E7]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">{t('showcaseTitle')}</h2>
                        <p className="text-lg text-[#71717A] max-w-2xl mx-auto mb-8">{t('showcaseSubtitle')}</p>
                        <div className="w-20 h-1.5 bg-[#18181B] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-16">
                        {sampledImages.map((image, i) => (
                            <div key={i} className="group aspect-square bg-[#F4F4F5] rounded-2xl overflow-hidden relative border border-[#E4E4E7]">
                                <Image
                                    src={image.path}
                                    alt={image.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <Link
                                        href="/generator"
                                        className="px-4 py-2 bg-white text-[#18181B] rounded-lg font-bold text-[8px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                    >
                                        Try This
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/showcase"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#18181B] text-[#18181B] rounded-xl font-bold uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-sm group"
                        >
                            View Entire Gallery <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Proof Section */}
            <section className="py-12 border-y border-[#E4E4E7] bg-[#FAFAFA]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: t('stats.brands'), value: '4+' },
                            { label: t('stats.export'), value: '300DPI' },
                            { label: t('stats.free'), value: '0$' },
                            { label: t('stats.speed'), value: '<1s' }
                        ].map((stat, i) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl font-black text-[#18181B]">{stat.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">{t('features.title')}</h2>
                        <div className="w-20 h-1.5 bg-[#18181B] mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ImageIcon className="text-blue-500" />,
                                title: t('features.upload.title'),
                                desc: t('features.upload.desc')
                            },
                            {
                                icon: <LayoutGrid className="text-purple-500" />,
                                title: t('features.grid.title'),
                                desc: t('features.grid.desc')
                            },
                            {
                                icon: <Zap className="text-yellow-500" />,
                                title: t('features.palette.title'),
                                desc: t('features.palette.desc')
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 border-2 border-[#F4F4F5] rounded-3xl hover:border-[#18181B] transition-all">
                                <div className="w-14 h-14 bg-[#FAFAFA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-[#71717A] leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* How it Works */}
            <section id="how-it-works" className="py-24 bg-[#FAFAFA]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="space-y-12">
                                {[
                                    { step: '01', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
                                    { step: '02', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
                                    { step: '03', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
                                    { step: '04', title: t('howItWorks.step4Title'), desc: t('howItWorks.step4Desc') }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <span className="text-4xl font-black text-[#E4E4E7] tracking-tighter">{item.step}</span>
                                        <div>
                                            <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{item.title}</h4>
                                            <p className="text-[#71717A]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 order-1 md:order-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 -z-10 opacity-10"></div>
                                <Link
                                    href="/generator"
                                    className="block group bg-white p-4 rounded-3xl shadow-2xl border border-[#E4E4E7] transition-all hover:scale-[1.02] hover:shadow-blue-600/5"
                                >
                                    <div className="aspect-square bg-[#FAFAFA] rounded-2xl flex items-center justify-center p-8 overflow-hidden relative">
                                        <div className="grid grid-cols-10 gap-1 w-full opacity-40">
                                            {Array.from({ length: 100 }).map((_, i) => (
                                                <div key={i} className="aspect-square rounded-full bg-[#18181B]" style={{ opacity: Math.random() }}></div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center">
                                            <Download size={64} className="text-[#18181B] animate-bounce" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#18181B] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 leading-none">
                        {t('finalCta.title')}
                    </h2>
                    <Link
                        href="/generator"
                        className="inline-flex px-12 py-6 bg-white text-[#18181B] rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all transform hover:scale-105"
                    >
                        {t('finalCta.button')}
                    </Link>
                    <p className="mt-8 text-[#A1A1AA] text-xs font-bold uppercase tracking-widest">{t('finalCta.footer')}</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[#E4E4E7] bg-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A1A1AA]">
                        &copy; {new Date().getFullYear()} PixelBeads - {t('titleAccent')} {t('titleSuffix')}
                    </p>
                </div>
            </footer>
        </main>
    )
}
