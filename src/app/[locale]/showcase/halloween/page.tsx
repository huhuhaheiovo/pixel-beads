import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ArrowLeft, Ghost } from 'lucide-react';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('halloween.title')} | Spooky Bead Ideas`,
        description: t('halloween.description'),
        alternates: {
            canonical: `/${locale}/showcase/halloween`,
            languages: {
                en: '/en/showcase/halloween',
                zh: '/zh/showcase/halloween',
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
            path: `/halloween/${file}`
        }));

    return (
        <main className="min-h-screen bg-white pb-24">
            {/* Header */}
            <section className="pt-20 pb-16 bg-orange-50 border-b border-orange-200">
                <div className="container mx-auto px-4">
                    <Link href="/showcase" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] mb-8 transition-colors">
                        <ArrowLeft size={14} /> Back to Gallery
                    </Link>
                    <div className="text-center">
                        <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
                            <Ghost size={32} className="text-orange-500" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-orange-950">{t('halloween.title')}</h1>
                        <p className="text-lg text-orange-900/70 max-w-2xl mx-auto">{t('halloween.description')}</p>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {images.map((image, i) => (
                        <div key={i} className="group bg-white border-2 border-[#F4F4F5] rounded-3xl overflow-hidden hover:border-orange-500 transition-all shadow-sm hover:shadow-xl relative aspect-square">
                            <Image
                                src={image.path}
                                alt={image.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                                <h4 className="text-white font-bold uppercase tracking-tighter text-sm mb-4 line-clamp-2">{image.name}</h4>
                                <Link
                                    href="/generator"
                                    className="px-6 py-2 bg-white text-[#18181B] rounded-lg font-bold text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                >
                                    {t('cta')}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
