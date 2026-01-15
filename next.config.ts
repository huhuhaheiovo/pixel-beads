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
    compress: true,
    // 允许开发环境中的跨域请求
    allowedDevOrigins: ['192.168.31.221'],
    images: {
        remotePatterns: [
            {
                protocol: 'https' as const,
                hostname: 'img.buymeacoffee.com',
            },
        ],
    },
};

export default withNextIntl(withMDX(nextConfig));
