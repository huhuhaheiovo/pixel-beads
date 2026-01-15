import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import BlogLayout from '../blog/BlogLayout';
import { Heart, Target, Sparkles, BookOpen, Quote } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'AboutUs' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/about' : `https://www.pixel-beads.com/${locale}/about`,
            languages: {
                en: '/about',
                zh: '/zh/about',
                ja: '/ja/about',
                'x-default': 'https://www.pixel-beads.com/about',
            },
        },
    };
}

export default async function AboutUsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'AboutUs' });

    const sections = [
        { title: t('storyTitle'), content: t('storyContent'), icon: BookOpen, color: 'bg-[#EF4444]' },
        { title: t('teamTitle'), content: t('teamContent'), icon: Heart, color: 'bg-[#3B82F6]' },
        { title: t('missionTitle'), content: t('missionContent'), icon: Target, color: 'bg-[#10B981]' },
        { title: t('visionTitle'), content: t('visionContent'), icon: Sparkles, color: 'bg-[#F59E0B]' },
        { title: t('whyTitle'), content: t('whyContent'), icon: Quote, color: 'bg-[#EC4899]' },
    ];

    return (
        <BlogLayout>
            {/* Header section */}
            <div className='relative mb-24 text-center'>
                <div className='absolute -top-12 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none'>
                    <Heart size={150} className='text-[#18181B]' />
                </div>

                <div className='relative inline-block mb-8'>
                    <div className='absolute -inset-2 bg-[#EF4444] rotate-1' />
                    <h1 className='relative px-10 py-4 text-4xl md:text-6xl font-black uppercase tracking-tighter text-white'>
                        {t('title')}
                    </h1>
                </div>

                <div className='max-w-3xl mx-auto'>
                    <div className='relative p-8 md:p-12 bg-white border-4 border-[#18181B] pixel-notched shadow-[8px_8px_0px_#18181B]'>
                        <Quote className='absolute top-4 left-4 text-[#EF4444] opacity-20' size={40} />
                        <p className='text-xl md:text-2xl text-[#18181B] leading-relaxed font-black italic relative z-10'>
                            "{t('intro')}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className='space-y-16'>
                {sections.map((section, index) => (
                    <section key={index} className="group relative">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Icon Box */}
                            <div className={`shrink-0 w-16 h-16 ${section.color} border-4 border-[#18181B] flex items-center justify-center -rotate-3 transition-transform group-hover:rotate-0`}>
                                <section.icon className="text-white" size={32} />
                            </div>

                            {/* Content Box */}
                            <div className="flex-grow">
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 text-[#18181B] inline-flex items-center gap-4">
                                    {section.title}
                                    <div className="h-1 w-12 bg-[#D4D4D8]" />
                                </h2>
                                <div className="p-8 bg-white border-[3px] border-[#18181B] relative transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_#18181B]">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-black/5 -mr-6 -mt-6 rotate-45 pointer-events-none" />
                                    <p className="text-[#52525B] text-lg leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer decoration */}
            <div className='mt-32 pt-16 border-t-4 border-dashed border-[#18181B]/10 text-center'>
                <div className='inline-flex items-center gap-3 px-6 py-3 bg-[#18181B] text-white font-black uppercase tracking-widest text-xs rounded-full'>
                    <Sparkles size={16} />
                    PixelBeads Workshop
                </div>
            </div>
        </BlogLayout>
    );
}
