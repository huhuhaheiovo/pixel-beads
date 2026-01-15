import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ArrowRight, Ghost, Trees, Heart, Sparkles, Star } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import { OptimizedImage as Image } from '@/components/OptimizedImage';
import { normalizeImagePath } from '@/lib/imageUtils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('title')} | Bead Pattern Collection`,
        description: t('subtitle'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/showcase' : `https://www.pixel-beads.com/${locale}/showcase`,
            languages: {
                en: '/showcase',
                zh: '/zh/showcase',
                'x-default': 'https://www.pixel-beads.com/showcase',
            },
        },
    };
}

export default async function ShowcasePage() {
    const t = await getTranslations('Showcase');

    const themes = [
        {
            id: 'halloween',
            title: t('halloween.title'),
            description: t('halloween.description'),
            icon: <Ghost size={32} className="text-white" />,
            bg: 'bg-orange-500',
            borderColor: 'hover:border-orange-500',
            shadow: 'hover:shadow-orange-500/20',
            link: '/showcase/halloween-perler-bead-patterns'
        },
        {
            id: 'christmas',
            title: t('christmas.title'),
            description: t('christmas.description'),
            icon: <Trees size={32} className="text-white" />,
            bg: 'bg-green-500',
            borderColor: 'hover:border-green-600',
            shadow: 'hover:shadow-green-600/20',
            link: '/showcase/christmas-perler-bead-patterns'
        }
    ];

    // Read images from public/pallettes
    const pallettesDir = path.join(process.cwd(), 'public', 'pallettes');
    const files = fs.readdirSync(pallettesDir);
    const images = files
        .filter(file => file.match(/\.(png|jpe?g|gif|webp)$/i))
        .map(file => {
            const localPath = `/pallettes/${file}`;
            return {
                name: file.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
                path: normalizeImagePath(localPath)
            };
        });

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 overflow-hidden bg-white">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-8 animate-fade-in">
                        <Sparkles size={14} className="text-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Community Gallery</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 relative inline-block">
                        <span className="relative z-10 text-[#EF4444] drop-shadow-[4px_4px_0px_rgba(239,68,68,0.1)]">{t('title')}</span>
                        <div className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-400/40 -rotate-1 -z-0 rounded-full"></div>
                        <Star className="absolute -top-6 -right-8 text-yellow-400 fill-yellow-400 animate-spin-slow" size={40} />
                    </h1>

                    <p className="text-xl text-[#71717A] max-w-2xl mx-auto mb-8 font-medium leading-relaxed">{t('subtitle')}</p>
                </div>

                {/* Decorative Beads */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-50/60 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
                    <div className="absolute top-1/4 left-10 w-8 h-8 bg-red-400 rounded-full blur-[1px] opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute bottom-1/3 right-20 w-12 h-12 bg-green-400 rounded-full blur-[2px] opacity-20 animate-pulse"></div>
                </div>
            </section>

            {/* Themes Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {themes.map((theme) => (
                        <Link
                            key={theme.id}
                            href={theme.link}
                            className={`group p-10 border-4 border-[#F4F4F5] rounded-[2.5rem] ${theme.borderColor} transition-all hover:-translate-y-2 hover:shadow-2xl ${theme.shadow} bg-white relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -z-10 transition-colors group-hover:bg-current opacity-10"></div>

                            <div className="flex items-start justify-between mb-8">
                                <div className={`w-16 h-16 ${theme.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                                    {theme.icon}
                                </div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F4F5] rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-[#18181B] group-hover:text-white transition-colors">
                                    View Theme <ArrowRight size={12} />
                                </span>
                            </div>

                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-[#18181B]">{theme.title}</h3>
                            <p className="text-[#71717A] text-lg leading-relaxed font-medium">{theme.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* General Showcase Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-16 relative">
                    <Heart className="text-red-500 absolute -top-8 left-1/2 -translate-x-1/2 opacity-20 animate-pulse" size={40} />
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#18181B] mb-4 relative z-10">{t('featuredWorks')}</h2>
                    <div className="w-16 h-2 bg-red-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, i) => {
                        const isAboveFold = i < 4;
                        return (
                            <div key={i} className="group aspect-square bg-[#F4F4F5] rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-blue-400 transition-all shadow-lg hover:shadow-blue-400/20">
                                <Image
                                    src={image.path}
                                    alt={image.name}
                                    width={isAboveFold ? 400 : 200}
                                    height={isAboveFold ? 400 : 200}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading={isAboveFold ? 'eager' : 'lazy'}
                                    fetchPriority={isAboveFold ? 'high' : 'low'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center">
                                    <h4 className="text-white font-black uppercase tracking-tight text-lg mb-4 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.name}</h4>
                                    <Link
                                        href="/perler-bead-pattern-generator"
                                        className="px-6 py-3 bg-white text-[#18181B] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl hover:bg-blue-50"
                                    >
                                        {t('cta')}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
