import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Box, Layers, Grid, Hammer, Cpu } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Minecraft Pixel Art Guide | Templates & Block Converter",
        description: "Master the art of Minecraft building. Learn how to convert images to blocks, use schematics, and create massive pixel art murals in your world.",
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/minecraft-pixel-art' : `https://www.pixel-beads.com/${locale}/minecraft-pixel-art`,
            languages: {
                en: '/minecraft-pixel-art',
                zh: '/zh/minecraft-pixel-art',
                'x-default': 'https://www.pixel-beads.com/minecraft-pixel-art',
            },
        },
    };
}

export default async function MinecraftPixelArtPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Minecraft Pixel Art Guide: From Image to Blocks",
        "image": [
            "https://www.pixel-beads.com/pallettes/pallette-4.png"
        ],
        "datePublished": "2024-01-01T08:00:00+08:00",
        "dateModified": new Date().toISOString(),
        "author": [{
            "@type": "Organization",
            "name": "PixelBeads Pattern Generator",
            "url": "https://www.pixel-beads.com"
        }]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#1e1e1e] overflow-hidden">
                {/* Pixelated Background Effect */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-[#3c3c3c] border-2 border-[#5c5c5c] mb-8">
                            <Box className="w-4 h-4 text-[#56ac58]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Creative Mode Essential</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-tight font-mono">
                            Minecraft <br />
                            <span className="text-[#56ac58]">Pixel Art Guide</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            Transform your world with massive block murals. Learn the techniques, tools, and blocks needed to build impressive pixel art.
                        </p>

                        <Link
                            href="/perler-bead-pattern-generator"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#56ac58] text-white rounded-none border-b-4 border-[#2f6e30] font-black uppercase tracking-widest hover:bg-[#4a9c4b] transition-all transform hover:-translate-y-1"
                        >
                            <Grid size={20} />
                            Generate Block Template
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Concept */}
                        <section className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex-1">
                                <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6 flex items-center gap-3">
                                    <Hammer className="text-[#18181B]" /> Building in 2D
                                </h2>
                                <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                    <p className="mb-4">
                                        Pixel art in Minecraft is the act of treating blocks as individual pixels. By placing colored blocks (like concrete, wool, or terracotta) on a vertical grid, you can recreate icons, sprites from retro games, or even photographs on a massive scale.
                                    </p>
                                    <p>
                                        Since every block in Minecraft is a perfect cube, it's the ideal canvas for digital art translation. One pixel in your image equals one block in the game.
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-100 p-8">
                                <h3 className="text-xl font-bold mb-4 font-mono">Best Blocks for Colors</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-bold text-[#71717A]">
                                        <div className="w-6 h-6 bg-red-500 border border-black/10"></div> Red Concrete (Vibrant)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-[#71717A]">
                                        <div className="w-6 h-6 bg-blue-500 border border-black/10"></div> Blue Wool (Textured)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-[#71717A]">
                                        <div className="w-6 h-6 bg-yellow-600 border border-black/10"></div> Yellow Terracotta (Muted)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-[#71717A]">
                                        <div className="w-6 h-6 bg-black border border-black/10"></div> Black Concrete (Outlines)
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Steps */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">How to Plan Your Build</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="border border-slate-200 p-6">
                                    <div className="text-4xl font-black text-[#56ac58] mb-4">01</div>
                                    <h3 className="text-lg font-bold mb-2">Scale It Right</h3>
                                    <p className="text-[#71717A]">Don't go too big. Remember the Minecraft build height limit (320 blocks). A 100x100 pixel image is surprisingly huge in-game.</p>
                                </div>
                                <div className="border border-slate-200 p-6">
                                    <div className="text-4xl font-black text-[#56ac58] mb-4">02</div>
                                    <h3 className="text-lg font-bold mb-2">Use a Guide</h3>
                                    <p className="text-[#71717A]">Use our generator to create a "blueprint". It helps to have a grid view so you can count exactly how many black blocks you need for an outline.</p>
                                </div>
                                <div className="border border-slate-200 p-6">
                                    <div className="text-4xl font-black text-[#56ac58] mb-4">03</div>
                                    <h3 className="text-lg font-bold mb-2">Flat World</h3>
                                    <p className="text-[#71717A]">Always build in a creative "Superflat" world. You don't want mountains or trees getting in the way of your canvas.</p>
                                </div>
                            </div>
                        </section>

                        {/* Tools */}
                        <section className="bg-slate-50 rounded-3xl p-10">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6">Helpful Tools</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                                        <Cpu size={20} /> WorldEdit / Litematica
                                    </h3>
                                    <p className="text-[#71717A]">
                                        If you are on Java Edition, mods like Litematica can project a "hologram" of your pixel art into the world, allowing you to simply place blocks where the ghost blocks are. WorldEdit allows you to fill large aeras quickly.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                                        <Layers size={20} /> Our Generator
                                    </h3>
                                    <p className="text-[#71717A]">
                                        Our tool serves as the perfect starting point. By uploading an image and selecting "show grid", you get a perfect schematic to follow block-by-block.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Internal Linking */}
            <section className="py-20 border-t border-slate-100 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-12">Related Guides</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/image-to-pixel" className="px-6 py-3 bg-slate-50 text-[#18181B] border-2 border-[#18181B] font-bold hover:bg-[#18181B] hover:text-white transition-all">
                            Convert Image to Pixel Art
                        </Link>
                        <Link href="/pixel-art-maker" className="px-6 py-3 bg-slate-50 text-[#18181B] border-2 border-[#18181B] font-bold hover:bg-[#18181B] hover:text-white transition-all">
                            Use Pixel Editor
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
