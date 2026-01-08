import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing, Link } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Obtaining messages for client components
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: 'Footer' });

    return (
        <html lang={locale}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-PHKBP63X2W"
                    strategy="afterInteractive"
                />
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2409588554709380"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-PHKBP63X2W');
                    `}
                </Script>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    {children}
                    <footer className="mt-auto border-t border-[#E4E4E7] py-12 bg-[#FAFAFA]">
                        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#18181B] rounded flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full grid grid-cols-2 gap-0.5 p-0.5">
                                        <div className="bg-red-400 rounded-full"></div>
                                        <div className="bg-blue-400 rounded-full"></div>
                                        <div className="bg-yellow-400 rounded-full"></div>
                                        <div className="bg-green-400 rounded-full"></div>
                                    </div>
                                </div>
                                <span className="font-black text-xs uppercase tracking-tighter italic">PixelBeads.Art</span>
                            </div>
                            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                                <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('home')}</Link>
                                <Link href="/showcase" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('showcase')}</Link>
                                <Link href="/cool-perler-bead-designs" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('coolDesigns')}</Link>
                                <Link href="/perler-bead-pattern-generator" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('generator')}</Link>
                                <Link href="/blog" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('blog')}</Link>
                                <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('privacyPolicy')}</Link>
                                <Link href="/terms-of-service" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] transition-colors">{t('termsOfService')}</Link>
                            </nav>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">© 2025 • PixelBeads</p>
                        </div>
                    </footer>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
