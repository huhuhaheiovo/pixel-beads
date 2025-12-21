import { Link } from '@/i18n/routing'
import { ArrowRight, ImageIcon, LayoutGrid, Download, Zap, Hammer, Heart, Star, Sparkles } from 'lucide-react'
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
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-8 animate-fade-in">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700">{t('badge')}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                            <span className="text-[#18181B]">{t('titlePrefix')}</span> <br />
                            <span className="relative inline-block mt-2">
                                <span className="text-[#EF4444] drop-shadow-[4px_4px_0px_rgba(239,68,68,0.1)]">{t('titleAccent')}</span>
                                <Sparkles className="absolute -top-6 -right-8 text-yellow-400 animate-pulse" size={32} />
                                <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400/30 -rotate-1 -z-10 rounded-full"></div>
                            </span> <br />
                            <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#71717A] mt-6 block max-w-2xl mx-auto normal-case leading-snug">
                                {t('titleSuffix')}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#71717A] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t('description')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="/perler-bead-pattern-generator"
                                className="group w-full sm:w-auto px-12 py-6 bg-[#EF4444] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 shadow-[0_10px_20px_-10px_rgba(239,68,68,0.5)] flex items-center justify-center gap-3"
                            >
                                {t('ctaStart')} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto px-12 py-6 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-50 transition-all flex items-center justify-center"
                            >
                                {t('ctaLearn')}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Beads */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    {/* Large Colorful Blurs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50/60 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-50/60 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                    {/* Floating Bead Elements */}
                    <div className="absolute top-1/4 left-10 w-12 h-12 bg-blue-400 rounded-full blur-[2px] opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute top-1/3 right-20 w-8 h-8 bg-green-400 rounded-full blur-[1px] opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-red-400 rounded-full blur-[3px] opacity-10 animate-bounce" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-30 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse"></div>

                    {/* Small Bead Dots Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="py-32 bg-white border-t-8 border-yellow-400/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 relative">
                        <Heart className="text-red-500 absolute -top-12 left-1/2 -translate-x-1/2 opacity-20" size={48} />
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#18181B]">{t('showcaseTitle')}</h2>
                        <p className="text-xl text-[#71717A] max-w-2xl mx-auto mb-8 font-medium">{t('showcaseSubtitle')}</p>
                        <div className="w-24 h-2 bg-red-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-20 animate-fade-in">
                        {sampledImages.map((image, i) => (
                            <div key={i} className="group aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-yellow-400 transition-all shadow-sm hover:shadow-xl">
                                <img
                                    src={image.path}
                                    alt={image.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center">
                                    <Link
                                        href="/perler-bead-pattern-generator"
                                        className="px-6 py-3 bg-white text-[#18181B] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform shadow-lg"
                                    >
                                        Try Creative Design
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/showcase"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-[8px_8px_0px_#EF4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group"
                        >
                            Explore All Patterns <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Proof Section */}
            <section className="py-20 border-y-8 border-yellow-400/10 bg-yellow-50/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: t('stats.brands'), value: '4+', color: 'text-red-500' },
                            { label: t('stats.export'), value: '300DPI', color: 'text-blue-500' },
                            { label: t('stats.free'), value: '0$', color: 'text-green-500' },
                            { label: t('stats.speed'), value: '<1s', color: 'text-yellow-600' }
                        ].map((stat, i) => (
                            <div key={stat.label} className="group">
                                <div className={`text-4xl font-black mb-2 tracking-tighter ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</div>
                                <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#71717A]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#18181B]">{t('features.title')}</h2>
                        <div className="w-24 h-2 bg-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <ImageIcon className="text-white" />,
                                bg: 'bg-blue-500',
                                title: t('features.upload.title'),
                                desc: t('features.upload.desc')
                            },
                            {
                                icon: <LayoutGrid className="text-white" />,
                                bg: 'bg-red-500',
                                title: t('features.grid.title'),
                                desc: t('features.grid.desc')
                            },
                            {
                                icon: <Zap className="text-white" />,
                                bg: 'bg-yellow-500',
                                title: t('features.palette.title'),
                                desc: t('features.palette.desc')
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[3rem] hover:border-[#18181B] transition-all hover:-translate-y-2 shadow-sm hover:shadow-xl">
                                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-[#18181B]">{feature.title}</h3>
                                <p className="text-[#71717A] leading-relaxed text-lg font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-[80px] -z-10 opacity-50 translate-x-1/2"></div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-32 bg-[#FAFAFA] border-t-8 border-yellow-400/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="space-y-16">
                                {[
                                    { step: '01', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc'), color: 'text-red-500' },
                                    { step: '02', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc'), color: 'text-blue-500' },
                                    { step: '03', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc'), color: 'text-yellow-500' },
                                    { step: '04', title: t('howItWorks.step4Title'), desc: t('howItWorks.step4Desc'), color: 'text-green-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className={`text-6xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity ${item.color}`}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black uppercase tracking-tight mb-3 text-[#18181B]">{item.title}</h4>
                                            <p className="text-[#71717A] text-lg leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 order-1 md:order-2">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-yellow-400 rounded-[4rem] rotate-3 -z-10 opacity-20 group-hover:rotate-6 transition-transform"></div>
                                <Link
                                    href="/perler-bead-pattern-generator"
                                    className="block bg-white p-6 rounded-[4rem] shadow-2xl border-4 border-[#18181B] transition-all hover:scale-[1.02]"
                                >
                                    <div className="aspect-square bg-yellow-50 rounded-[3rem] flex items-center justify-center p-12 overflow-hidden relative border-4 border-dashed border-yellow-200">
                                        <div className="grid grid-cols-12 gap-1.5 w-full opacity-60">
                                            {Array.from({ length: 144 }).map((_, i) => (
                                                <div key={i} className="aspect-square rounded-full shadow-inner" style={{
                                                    backgroundColor: ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#18181B'][Math.floor(Math.random() * 5)],
                                                    opacity: 0.5 + Math.random() * 0.5
                                                }}></div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors flex flex-col items-center justify-center gap-6">
                                            <Download size={80} className="text-[#18181B] animate-bounce shrink-0" />
                                            <span className="font-black uppercase tracking-[0.2em] text-[#18181B]">Free DIY Pattern Download</span>
                                        </div>
                                    </div>
                                </Link>
                                <Star className="absolute -top-10 -left-10 text-yellow-500 fill-yellow-500 animate-spin" style={{ animationDuration: '8s' }} size={60} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-[#18181B] text-white relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-16 leading-none">
                        {t('finalCta.title')}
                    </h2>
                    <Link
                        href="/perler-bead-pattern-generator"
                        className="inline-flex px-16 py-8 bg-white text-[#18181B] rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-yellow-400 transition-all transform hover:scale-110 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        {t('finalCta.button')}
                    </Link>
                    <p className="mt-12 text-[#A1A1AA] text-sm font-black uppercase tracking-[0.3em]">{t('finalCta.footer')}</p>
                </div>

                {/* Final CTA Decorations */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 border-8 border-red-500 rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-8 border-yellow-500 rotate-45"></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t-8 border-[#18181B] bg-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-[#18181B]">
                        &copy; {new Date().getFullYear()} PixelBeads • Made for Creative Makers
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
            </footer>
        </main>
    )
}
