import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - /_vercel (Vercel internals)
    // - Static files (containing a dot, e.g. .png, .jpg, .svg, .ico)
    matcher: ['/((?!api|_next|_static|_vercel|.*\\..*).*)']
};
