import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Ghost, ArrowLeft, Skull, Moon, CloudFog } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('halloween.title')} | Spooky Bead Ideas`,
        description: t('halloween.description'),
        alternates: {
            canonical: `/${locale}/showcase/halloween-perler-bead-patterns`,
            languages: {
                en: '/en/showcase/halloween-perler-bead-patterns',
                zh: '/zh/showcase/halloween-perler-bead-patterns',
            },
        },
    };
}

export default async function HalloweenShowcase() {
    const t = await getTranslations('Showcase');

    // Read images from public/halloween
    const halloweenDir = path.join(process.cwd(), 'public', 'halloween');
    const files = fs.readdirSync(halloweenDir);
    const images = files
        .filter(file => file.match(/\.(png|jpe?g|gif|webp)$/i))
        .map(file => ({
            name: file.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
            path: `/halloween/${file} `
        }));

    return (
        <main className="min-h-screen bg-[#18181B] text-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden border-b-8 border-orange-500/20">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <Link href="/showcase" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/50 mb-8 animate-fade-in shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Ghost size={14} className="text-purple-400 animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">Seasonal Collection</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 relative inline-block text-white drop-shadow-[0_4px_0_rgba(249,115,22,1)]">
                        {t('halloween.title')}
                        <Moon className="absolute -top-8 -right-12 text-yellow-200 opacity-80" size={48} />
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        {t('halloween.description')}
                    </p>
                </div>

                {/* Spooky Decorations */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
                    <Skull className="absolute top-1/4 left-10 text-gray-800 rotate-12 opacity-50" size={120} />
                    <CloudFog className="absolute bottom-1/4 right-10 text-gray-800 -rotate-12 opacity-50" size={160} />
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, i) => (
                        <div key={i} className="group aspect-square bg-[#27272A] rounded-[2rem] overflow-hidden relative border-4 border-transparent hover:border-orange-500 transition-all shadow-lg hover:shadow-orange-500/20">
                            <img
                                src={image.path}
                                alt={image.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-8 text-center">
                                <h4 className="text-orange-400 font-black uppercase tracking-tight text-lg mb-4 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">{image.name}</h4>
                                <Link
                                    href="/generator"
                                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-[4px_4px_0px_#7c2d12] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-orange-600"
                                >
                                    Create This
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {images.length === 0 && (
                    <div className="text-center py-20 bg-[#27272A] rounded-3xl border-4 border-dashed border-gray-700">
                        <Ghost className="mx-auto text-gray-600 mb-4 animate-pulse" size={48} />
                        <p className="text-gray-500 font-medium">No spooky patterns found yet...</p>
                    </div>
                )}
            </section>
        </main>
    );
}
