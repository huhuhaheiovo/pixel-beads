'use client'

import React from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, Hammer, Globe } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MobileNav() {
    const t = useTranslations('Header')
    const pathname = usePathname()
    const locale = useLocale()

    const [open, setOpen] = React.useState(false)

    const navItems = [
        { href: '/', label: t('home') },
        { href: '/perler-bead-pattern-generator', label: t('generator'), icon: Hammer },
        { href: '/patterns', label: t('patterns') },
        { href: '/showcase', label: t('showcase') }

    ]

    const toolItems = [
        { href: '/perler-bead-pattern-generator', title: t('fusePatternTool') },
        { href: '/pixel-art-maker', title: t('pixelArtMaker') },
        { href: '/image-to-pixel', title: t('imageToPixel') },
        { href: '/minecraft-pixel-art', title: t('minecraftGuide') },
        { href: '/wplace', title: t('rplaceTool') }
    ]

    const guideItems = [
        { href: '/fuse-beads', title: t('fuseBeadsGuide') },
        { href: '/hama-beads', title: t('hamaBeads') }
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-[#F7F1E1] hover:bg-white/10 hover:text-[#32B8A6]">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-[#3E2A1E] border-none text-[#F7F1E1]">
                <SheetHeader className="p-6 border-b border-[#543A2A]">
                    <SheetTitle className="text-left flex items-center gap-2 text-[#F7F1E1]">
                        <Image
                            src='/web-app-manifest-192x192.png'
                            alt='拼豆艺术'
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded'
                        />
                        <span className="font-black text-sm uppercase tracking-tighter text-[#F7F1E1]">拼豆艺术</span>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Main Nav */}
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'text-sm font-bold uppercase tracking-widest py-2 transition-colors',
                                        pathname === item.href ? 'text-[#32B8A6]' : 'text-[#F7F1E1] hover:text-[#32B8A6]'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon size={14} />}
                                        {item.label}
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        {/* Tools */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F7F1E1]/50">
                                {t('tools')}
                            </h3>
                            <div className="grid gap-2">
                                {toolItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-[#32B8A6]/20"
                                    >
                                        <span className="text-[12px] font-bold text-[#F7F1E1] group-hover:text-[#32B8A6]">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Guides */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F7F1E1]/50">
                                {t('guides')}
                            </h3>
                            <div className="grid gap-2">
                                {guideItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-[#32B8A6]/20"
                                    >
                                        <span className="text-[12px] font-bold text-[#F7F1E1] group-hover:text-[#32B8A6]">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer with Language Switcher */}
                    <div className="mt-auto p-6 bg-[#3E2A1E] border-t border-[#543A2A]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1]/50">Language</span>
                            <div className="flex items-center border border-[#F7F1E1]/20 rounded-full px-2 py-1 gap-1 bg-white/5">
                                <Globe size={10} className="text-[#F7F1E1]/70 ml-1" />
                                <Link
                                    href={pathname}
                                    locale="en"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all',
                                        locale === 'en' ? 'bg-[#32B8A6] text-[#3E2A1E] shadow-sm' : 'text-[#F7F1E1]/70 hover:bg-white/10 hover:text-[#F7F1E1]'
                                    )}
                                >
                                    EN
                                </Link>
                                <Link
                                    href={pathname}
                                    locale="zh"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all',
                                        locale === 'zh' ? 'bg-[#32B8A6] text-[#3E2A1E] shadow-sm' : 'text-[#F7F1E1]/70 hover:bg-white/10 hover:text-[#F7F1E1]'
                                    )}
                                >
                                    ZH
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
