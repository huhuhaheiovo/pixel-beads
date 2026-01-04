import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkFrontmatter, remarkGfm],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default withNextIntl(withMDX(nextConfig));
