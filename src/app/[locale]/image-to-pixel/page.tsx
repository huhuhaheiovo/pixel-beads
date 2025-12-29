import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Image as ImageIcon, Zap, Download, Sparkles, Sliders, Monitor, Palette } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Image to Pixel Converter | Turn Photos into Pixel Art Free",
        description: "Convert any image to pixel art instantly. Our free online tool helps you create fuse bead patterns, Minecraft art, and cross-stitch charts from your photos.",
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/image-to-pixel' : `https://www.pixel-beads.com/${locale}/image-to-pixel`,
            languages: {
                en: '/image-to-pixel',
                zh: '/zh/image-to-pixel',
                'x-default': 'https://www.pixel-beads.com/image-to-pixel',
            },
        },
    };
}

export default async function ImageToPixelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Schema for a SoftwareApp
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image to Pixel Converter",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Convert JPG/PNG to Pixel Art",
            "Custom Grid Sizes",
            "Palette Mapping (Perler, Hama, Artkal)",
            "Step-by-Step PDF Export"
        ]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-green-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 border border-green-200 mb-8">
                            <Sparkles className="w-4 h-4 text-green-600 fill-green-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-green-700">AI-Powered Conversion</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#18181B] mb-8 leading-tight">
                            Free Online <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">Image to Pixel Converter</span>
                        </h1>

                        <p className="text-xl text-[#71717A] max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            Transform any photo into a detailed pixel art masterpiece. Perfect for Fuse beads, Minecraft builds, Cross-stitch, and Sprite art.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/perler-bead-pattern-generator"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#18181B] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
                            >
                                <ImageIcon size={20} />
                                Upload Image
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Features Grid */}
                        <section className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Sliders size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Adjust Detail Level</h3>
                                <p className="text-[#71717A]">Control the pixel density. Go for a retro 8-bit look with chunky pixels or high-definition for intricate portraits.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                    <Palette size={24} width={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Color Matching</h3>
                                <p className="text-[#71717A]">Automatically match your image colors to real-world bead brands like Perler, Hama, and Artkal.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                                    <Download size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Export Blueprints</h3>
                                <p className="text-[#71717A]">Get a downloadable PDF with a numbered grid and color shopping list to build your project in real life.</p>
                            </div>
                        </section>

                        {/* How it Works / Best Practices */}
                        <section className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1">
                                <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6">
                                    Tips for Best Results
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">1</div>
                                        <div>
                                            <h4 className="font-bold text-[#18181B] mb-1">High Contrast Images</h4>
                                            <p className="text-[#71717A]">Images with clear separation between subject and background convert best. Busy backgrounds can become "noise" in pixel art.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">2</div>
                                        <div>
                                            <h4 className="font-bold text-[#18181B] mb-1">Simple Subjects</h4>
                                            <p className="text-[#71717A]">Logos, cartoons, and close-up portraits work better than landscapes or large group photos.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">3</div>
                                        <div>
                                            <h4 className="font-bold text-[#18181B] mb-1">Lighting Matters</h4>
                                            <p className="text-[#71717A]">Avoid photos with harsh shadows or extreme gradients, as these can create strange artifacts when reduced to a limited color palette.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-[#18181B] rounded-3xl p-8 text-center relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-6">Start Converting</h3>
                                    <p className="text-gray-400 mb-8">No login required. 100% Free.</p>
                                    <Link
                                        href="/perler-bead-pattern-generator"
                                        className="inline-block px-8 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-green-400 transition-colors"
                                    >
                                        Open Tool
                                    </Link>
                                </div>
                                <div className="absolute inset-0 bg-[url('https://www.pixel-beads.com/pallettes/pallette-3.png')] opacity-10 bg-cover bg-center"></div>
                            </div>
                        </section>

                        {/* FAQ/SEO Text */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-[#18181B] mb-2">Can I use this for Minecraft?</h3>
                                    <p className="text-[#71717A]">Absolutely! Our grid output is perfect for Minecraft block placement. Just upload your image, adjust the size to fit your build area, and follow the grid.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#18181B] mb-2">How do I print the pattern?</h3>
                                    <p className="text-[#71717A]">Once you are happy with the conversion in our generator, click the "Export PDF" button. This will generate a printable document containing the colored grid and a list of all required bead colors.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#18181B] mb-2">Is the tool privacy-friendly?</h3>
                                    <p className="text-[#71717A]">Yes. All image processing happens in your browser. Your photos are not uploaded to our servers.</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Internal Linking */}
            <section className="py-20 border-t border-slate-100 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-12">More Tools</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/minecraft-pixel-art" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-green-600 hover:shadow-md transition-all font-bold">
                            Minecraft Pixel Art Guide
                        </Link>
                        <Link href="/pixel-art-maker" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-purple-600 hover:shadow-md transition-all font-bold">
                            Pixel Art Maker
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
