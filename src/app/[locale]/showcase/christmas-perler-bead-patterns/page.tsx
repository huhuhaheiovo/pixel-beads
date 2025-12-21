import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Trees, ArrowLeft, Snowflake, Gift, Star, Bell } from 'lucide-react';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('christmas.title')} | Festive Bead Ideas`,
        description: t('christmas.description'),
        alternates: {
            canonical: `/${locale}/showcase/christmas`,
            languages: {
                en: '/en/showcase/christmas',
                zh: '/zh/showcase/christmas',
            },
        },
    };
}

export default async function ChristmasShowcase() {
    const t = await getTranslations('Showcase');

    // Read images from public/christmas
    const christmasDir = path.join(process.cwd(), 'public', 'christmas');
    const files = fs.readdirSync(christmasDir);
    const images = files
        .filter(file => file.match(/\.(png|jpe?g|gif|webp)$/i))
        .map(file => ({
            name: file.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
            path: `/christmas/${file}`
        }));

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden bg-red-600 border-b-8 border-green-600 text-white">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <Link href="/showcase" className="inline-flex items-center gap-2 text-red-100 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-700/50 border border-green-400/30 mb-8 animate-fade-in shadow-lg backdrop-blur-sm">
                        <Bell size={14} className="text-yellow-300 animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-100">Holiday Collection</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 relative inline-block drop-shadow-[0_4px_0_rgba(185,28,28,1)]">
                        {t('christmas.title')}
                        <Star className="absolute -top-8 -right-12 text-yellow-400 fill-yellow-400 animate-spin-slow" size={48} />
                    </h1>

                    <p className="text-xl text-red-100 max-w-2xl mx-auto mb-12 font-medium leading-relaxed drop-shadow-sm">
                        {t('christmas.description')}
                    </p>
                </div>

                {/* Festive Decorations */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-600/30 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>
                    <Snowflake className="absolute top-10 left-10 text-white opacity-20 animate-pulse" size={64} />
                    <Snowflake className="absolute bottom-20 right-20 text-white opacity-20 animate-pulse" size={48} style={{ animationDelay: '1s' }} />
                    <Trees className="absolute bottom-0 left-[-20px] text-green-800 opacity-20" size={200} />
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, i) => (
                        <div key={i} className="group aspect-square bg-white rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-green-500 transition-all shadow-lg hover:shadow-green-500/20">
                            <Image
                                src={image.path}
                                alt={image.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center">
                                <h4 className="text-white font-black uppercase tracking-tight text-lg mb-4 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">{image.name}</h4>
                                <Link
                                    href="/generator"
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-[4px_4px_0px_#991b1b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-red-700"
                                >
                                    Start Crafting
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {images.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-red-200">
                        <Gift className="mx-auto text-red-300 mb-4" size={48} />
                        <p className="text-red-400 font-medium">No holiday patterns yet...</p>
                    </div>
                )}
            </section>
        </main>
    );
}
