import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Mail, MessageSquare, Clock, ExternalLink } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/contact' : `https://www.pixel-beads.com/${locale}/contact`,
            languages: {
                en: '/contact',
                zh: '/zh/contact',
                ja: '/ja/contact',
                'x-default': 'https://www.pixel-beads.com/contact',
            },
        },
    };
}

export default async function ContactPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || t('defaultEmail');

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">{t('title')}</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-[#3F3F46] leading-relaxed mb-12">
                        {t('intro')}
                    </p>

                    {/* Contact Email Section */}
                    <section className="mb-12 p-6 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-[#32B8A6] mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-[#18181B]">{t('emailTitle')}</h2>
                                <a 
                                    href={`mailto:${contactEmail}`}
                                    className="text-[#32B8A6] hover:text-[#2AA38F] font-bold text-lg break-all"
                                >
                                    {contactEmail}
                                </a>
                                <p className="text-[#71717A] text-sm mt-2">{t('emailDescription')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Response Time Section */}
                    <section className="mb-12 p-6 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <Clock className="w-6 h-6 text-[#32B8A6] mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-[#18181B]">{t('responseTimeTitle')}</h2>
                                <p className="text-[#3F3F46] leading-relaxed">{t('responseTimeContent')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Social Media Links */}
                    {t.raw('socialMedia') && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('socialMediaTitle')}</h2>
                            <p className="text-[#3F3F46] leading-relaxed mb-4">{t('socialMediaDescription')}</p>
                            <div className="flex flex-wrap gap-4">
                                {Object.entries(t.raw('socialMedia') as Record<string, { label: string; url: string }>).map(([key, value]) => (
                                    <a
                                        key={key}
                                        href={value.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#32B8A6] hover:bg-[#2AA38F] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                                    >
                                        {value.label}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Contact Form Section (Optional) */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('formTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-6">{t('formDescription')}</p>
                        <div className="p-6 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[2rem]">
                            <p className="text-[#71717A] text-sm mb-4">{t('formNote')}</p>
                            <a
                                href={`mailto:${contactEmail}?subject=${encodeURIComponent(t('formSubject'))}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#32B8A6] hover:bg-[#2AA38F] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {t('formButton')}
                            </a>
                        </div>
                    </section>

                    {/* Additional Help */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('helpTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('helpContent')}</p>
                        <Link
                            href="/help"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] hover:bg-[#2A2A2A] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                        >
                            {t('helpLink')}
                        </Link>
                    </section>
                </div>
            </div>
        </main>
    );
}
