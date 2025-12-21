'use client'

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Hammer, Globe } from 'lucide-react'

export function Header() {
    const t = useTranslations('Header')
    const pathname = usePathname()
    const locale = useLocale()
    const isGenerator = pathname === '/perler-bead-pattern-generator'

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#E4E4E7] bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#18181B] rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="bg-red-400 rounded-full"></div>
                            <div className="bg-blue-400 rounded-full"></div>
                            <div className="bg-yellow-400 rounded-full"></div>
                            <div className="bg-green-400 rounded-full"></div>
                        </div>
                    </div>
                    <span className="font-black text-sm uppercase tracking-tighter">PixelBeads</span>
                </Link>

                <nav className="flex items-center gap-4 md:gap-6">
                    <Link
                        href="/"
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${pathname === '/' ? 'text-[#18181B]' : 'text-[#71717A] hover:text-[#18181B]'}`}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        href="/showcase"
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${pathname.startsWith('/showcase') ? 'text-[#18181B]' : 'text-[#71717A] hover:text-[#18181B]'}`}
                    >
                        {t('showcase')}
                    </Link>
                    <Link
                        href="/perler-bead-pattern-generator"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isGenerator ? 'bg-[#18181B] text-white' : 'border border-[#E4E4E7] text-[#18181B] hover:border-[#18181B]'}`}
                    >
                        <Hammer size={12} />
                        <span className="hidden sm:inline">{t('generator')}</span>
                    </Link>

                    <div className="flex items-center border border-[#E4E4E7] rounded-full px-2 py-1 gap-1 bg-[#FAFAFA]">
                        <Globe size={10} className="text-[#A1A1AA] ml-1" />
                        <Link
                            href={pathname}
                            locale="en"
                            className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'en' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-white'}`}
                        >
                            EN
                        </Link>
                        <Link
                            href={pathname}
                            locale="zh"
                            className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'zh' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-white'}`}
                        >
                            ZH
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}
