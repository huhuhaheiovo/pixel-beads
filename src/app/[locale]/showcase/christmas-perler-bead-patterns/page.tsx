import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Trees, ArrowLeft, Snowflake, Gift, Star, Bell } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import { OptimizedImage as Image } from '@/components/OptimizedImage';
import { normalizeImagePath } from '@/lib/imageUtils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('christmas.title')} | Festive Bead Ideas`,
        description: t('christmas.description'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/showcase/christmas-perler-bead-patterns' : `https://www.pixel-beads.com/${locale}/showcase/christmas-perler-bead-patterns`,
            languages: {
                en: '/showcase/christmas-perler-bead-patterns',
                zh: '/zh/showcase/christmas-perler-bead-patterns',
                'x-default': 'https://www.pixel-beads.com/showcase/christmas-perler-bead-patterns',
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
        .map(file => {
            const localPath = `/christmas/${file}`;
            return {
                name: file.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
                path: normalizeImagePath(localPath)
            };
        });

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <Link href="/showcase" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 mb-8 animate-fade-in">
                        <Bell size={14} className="text-red-500 animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Holiday Collection</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 relative inline-block text-slate-900">
                        {t('christmas.title')}
                        <Star className="absolute -top-6 -right-10 text-yellow-400 fill-yellow-400 animate-spin-slow" size={40} />
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        {t('christmas.description')}
                    </p>
                </div>

                {/* Winter Decorations */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>
                    <Snowflake className="absolute top-10 left-10 text-blue-200 opacity-60 animate-pulse" size={48} />
                    <Snowflake className="absolute bottom-20 right-20 text-blue-200 opacity-60 animate-pulse" size={32} style={{ animationDelay: '1s' }} />
                    <Trees className="absolute bottom-[-20px] left-[-20px] text-green-800/5" size={180} />
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, i) => {
                        const isAboveFold = i < 4;
                        return (
                            <div key={i} className="group aspect-square bg-white rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-red-100 transition-all shadow-sm hover:shadow-xl">
                                <img
                                    src={image.path}
                                    alt={image.name}
                                    width={isAboveFold ? 400 : 200}
                                    height={isAboveFold ? 400 : 200}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading={isAboveFold ? 'eager' : 'lazy'}
                                    fetchPriority={isAboveFold ? 'high' : 'low'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center backdrop-blur-[2px]">
                                    <h4 className="text-slate-900 font-black uppercase tracking-tight text-lg mb-4 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.name}</h4>
                                    <Link
                                        href="/perler-bead-pattern-generator"
                                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-md hover:bg-red-700"
                                    >
                                        Start Crafting
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {images.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-slate-200">
                        <Gift className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-400 font-medium">No holiday patterns yet...</p>
                    </div>
                )}
            </section>
        </main>
    );
}
