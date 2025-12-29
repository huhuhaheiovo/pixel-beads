import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // 只匹配带语言前缀的路径
    matcher: ['/(zh|en)/:path*'],
};
