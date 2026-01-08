'use client'

import React from 'react'
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
        { href: '/patterns', label: t('patterns') },
        { href: '/showcase', label: t('showcase') },
        { href: '/perler-bead-pattern-generator', label: t('generator'), icon: Hammer }
    ]

    const toolItems = [
        { href: '/pixel-art-maker', title: t('pixelArtMaker') },
        { href: '/image-to-pixel', title: t('imageToPixel') },
        { href: '/minecraft-pixel-art', title: t('minecraftGuide') },
        { href: '/perler-bead-pattern-generator', title: t('fusePatternTool') },
        { href: '/wplace', title: t('rplaceTool') }
    ]

    const guideItems = [
        { href: '/fuse-beads', title: t('fuseBeadsGuide') },
        { href: '/hama-beads', title: t('hamaBeads') }
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 border-b border-[#E4E4E7]">
                    <SheetTitle className="text-left flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#18181B] rounded flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full grid grid-cols-2 gap-0.5 p-0.5">
                                <div className="bg-red-400 rounded-full"></div>
                                <div className="bg-blue-400 rounded-full"></div>
                                <div className="bg-yellow-400 rounded-full"></div>
                                <div className="bg-green-400 rounded-full"></div>
                            </div>
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">PixelBeads</span>
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
                                        pathname === item.href ? 'text-[#18181B]' : 'text-[#71717A]'
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
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                                {t('tools')}
                            </h3>
                            <div className="grid gap-2">
                                {toolItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col p-3 rounded-lg hover:bg-[#F4F4F5] transition-colors border border-[#F4F4F5]"
                                    >
                                        <span className="text-[12px] font-bold text-[#18181B]">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Guides */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                                {t('guides')}
                            </h3>
                            <div className="grid gap-2">
                                {guideItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col p-3 rounded-lg hover:bg-[#F4F4F5] transition-colors border border-[#F4F4F5]"
                                    >
                                        <span className="text-[12px] font-bold text-[#18181B]">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer with Language Switcher */}
                    <div className="mt-auto p-6 bg-[#FAFAFA] border-t border-[#E4E4E7]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Language</span>
                            <div className="flex items-center border border-[#E4E4E7] rounded-full px-2 py-1 gap-1 bg-white">
                                <Globe size={10} className="text-[#A1A1AA] ml-1" />
                                <Link
                                    href={pathname}
                                    locale="en"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all',
                                        locale === 'en' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-[#F4F4F5]'
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
                                        locale === 'zh' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-[#F4F4F5]'
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
