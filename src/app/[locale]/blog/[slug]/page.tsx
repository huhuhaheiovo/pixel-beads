import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../utils';
import BlogLayout from '../BlogLayout';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const post = getBlogPost(locale, slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} - PixelBeads Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
    // This is tricky because generateStaticParams usually runs at build time where params might not be fully available for all locales
    // But for [locale], we usually know the locales.
    // However, since we are inside [locale], we might only need to return slugs.
    // Let's list all posts for all supported locales? 
    // Actually, Next.js generates static params for the current segment.
    // Since [locale] is a parent dynamic segment, we should arguably check all locales?
    // But typically generateStaticParams is used to populate [slug].
    // We can just iterate over our known locales 'en' and 'zh'.

    // For simplicity right now, let's not implement generating static params rigorously if not strictly required, 
    // or just fetch for 'en' and 'zh'.
    const locales = ['en', 'zh'];
    let paramsList: { locale: string; slug: string }[] = [];

    for (const locale of locales) {
        const posts = getBlogPosts(locale);
        for (const post of posts) {
            paramsList.push({ locale, slug: post.slug });
        }
    }

    // Since we are inside [locale] layout, normally we just return { slug: ... }.
    // But if we want to generate all paths at build time for [locale] + [slug], 
    // we need to return the combination if [locale] is also dynamic.
    // Let's just return slugs for the *current* locale context if possible? 
    // No, strictly generateStaticParams replaces getStaticPaths.

    return paramsList.map(({ slug }) => ({ slug }));
}


export default async function BlogPostPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const post = getBlogPost(locale, slug);

    if (!post) {
        notFound();
    }

    // Dynamic import of MDX content
    // Note: Webpack needs to be able to statically analyze the import path to some extent.
    let MDXContent;
    try {
        // We use relative path from this file: src/app/[locale]/blog/[slug]/page.tsx
        // to: src/app/[locale]/blog/content/{locale}/{slug}.mdx
        // Path: ../content/${locale}/${slug}.mdx
        // But we need to be careful. The prompt example was `../content/${slug}.mdx` presumably for a simpler structure.
        // Here we have `../../content/${locale}/${slug}.mdx`
        MDXContent = (await import(`../content/${locale}/${slug}.mdx`)).default;
    } catch (error) {
        console.error('Error loading MDX content:', error);
        notFound();
    }

    return (
        <BlogLayout>
            <div className="mb-12 border-b border-[#E4E4E7] pb-12">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#71717A] mb-6">
                    <Link href="/blog" className="hover:text-[#18181B] transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-[#18181B]">{post.title}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#18181B] mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>•</span>
                    <span className="text-[#18181B]">{post.author}</span>
                    {post.tags && post.tags.length > 0 && (
                        <>
                            <span>•</span>
                            <div className="flex gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-[#71717A]">#{tag}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-[#3F3F46] prose-p:text-lg prose-p:leading-relaxed prose-a:text-[#18181B] prose-a:no-underline prose-a:font-bold hover:prose-a:text-[#71717A] prose-strong:text-[#18181B] prose-code:text-[#18181B] prose-code:bg-[#F4F4F5] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                <MDXContent />
            </div>

            <div className="mt-20 pt-12 border-t border-[#E4E4E7]">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#18181B] hover:text-[#71717A] transition-colors">
                    <span>←</span>
                    {locale === 'zh' ? '返回博客列表' : 'Back to Blog'}
                </Link>
            </div>
        </BlogLayout>
    );
}
