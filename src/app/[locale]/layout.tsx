import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {Header} from '@/components/Header'
import {WeChatQRCode} from '@/components/WeChatQRCode'
import {ThirdPartyScripts} from '@/components/ThirdPartyScripts'
import '../globals.css'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing, Link} from '@/i18n/routing';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import React from "react";
import Image from "next/image";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap'
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap'
})

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Obtaining messages for client components
    const messages = await getMessages();
    const t = await getTranslations({locale, namespace: 'Footer'});

    return (
        <html lang={locale}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
        <ThirdPartyScripts/>
        <NextIntlClientProvider messages={messages}>
            <Header/>
            {children}
            <footer className="mt-auto border-t border-[#543A2A] py-12 bg-[#3E2A1E] text-[#F7F1E1]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Image
                                src='/web-app-manifest-192x192.png'
                                alt='拼豆艺术'
                                width={32}
                                height={32}
                                className='w-8 h-8 rounded'
                            />
                            <span
                                className='font-black text-sm uppercase tracking-tighter text-[#F7F1E1]'>拼豆艺术</span>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            <Link href="/"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('home')}</Link>
                            <Link href="/showcase"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('showcase')}</Link>
                            <Link href="/cool-perler-bead-designs"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('coolDesigns')}</Link>
                            <Link href="/perler-bead-pattern-generator"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('generator')}</Link>
                            <Link href="/blog"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('blog')}</Link>
                            <Link href="/privacy-policy"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('privacyPolicy')}</Link>
                            <Link href="/terms-of-service"
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/70 hover:text-[#32B8A6] transition-colors">{t('termsOfService')}</Link>
                        </nav>
                    </div>
                    <div
                        className="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 pt-8 border-t border-[#543A2A]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/40">© 2025 • PixelBeads</p>
                        <div className="flex items-center gap-4">
                            {/* Buy Me a Coffee 按钮 */}
                            <a
                                href="https://www.buymeacoffee.com/bai_ju_yi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block hover:opacity-80 transition-opacity"
                            >
                                <img
                                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=bai_ju_yi&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                                    alt="Buy me a coffee"
                                    className="h-8 w-auto"
                                />
                            </a>
                            {/* 微信赞赏 */}
                            <WeChatQRCode/>
                        </div>
                    </div>
                </div>
            </footer>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}
