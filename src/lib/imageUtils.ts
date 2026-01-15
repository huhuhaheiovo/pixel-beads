/**
 * 图片工具函数
 * 用于将本地图片路径转换为 CDN 路径并生成优化后的图片 URL
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://cdn.pixel-beads.com';

/**
 * 将本地图片路径转换为 CDN 路径
 * @param localPath 本地路径，如 /christmas/image.webp
 * @returns CDN 路径，如 https://cdn.pixel-beads.com/christmas/image.webp
 */
export function getCdnImageUrl(localPath: string): string {
  // 移除开头的斜杠（如果有）
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  return `${CDN_BASE_URL}/${cleanPath}`;
}

/**
 * 图片优化配置类型
 */
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * 使用 unpic 生成优化后的图片 URL
 * unpic 会自动检测图片服务并应用优化
 * @param src 图片源 URL（CDN 路径）
 * @param options 优化选项
 * @returns 优化后的图片 URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover'
  } = options;

  // 如果使用 unpic，它会自动处理优化
  // 这里我们直接返回 CDN URL，让 unpic 组件处理优化
  // 如果需要手动构建 URL，可以使用以下逻辑：
  
  // 对于 Cloudflare R2，我们可以使用 Cloudflare Images API
  // 或者使用第三方服务如 wsrv.nl
  
  // 暂时直接返回 CDN URL，优化由 unpic 组件处理
  return src;
}

/**
 * 根据使用场景获取图片优化参数
 */
export interface ImageUsageContext {
  type: 'lcp-critical' | 'above-fold' | 'lazy-load';
  deviceType?: 'mobile' | 'desktop';
}

export function getImageOptimizationParams(
  context: ImageUsageContext
): ImageOptimizationOptions {
  const { type, deviceType = 'desktop' } = context;

  switch (type) {
    case 'lcp-critical':
      // LCP 关键图片：高质量，优先加载
      return {
        width: deviceType === 'mobile' ? 400 : 800,
        quality: 90,
        format: 'webp',
        fit: 'cover'
      };

    case 'above-fold':
      // 首屏可见图片：中等质量
      return {
        width: deviceType === 'mobile' ? 200 : 400,
        quality: 85,
        format: 'webp',
        fit: 'cover'
      };

    case 'lazy-load':
      // 懒加载图片：较低质量，按需加载
      return {
        quality: 80,
        format: 'webp',
        fit: 'cover'
      };

    default:
      return {
        quality: 85,
        format: 'webp',
        fit: 'cover'
      };
  }
}

/**
 * 将本地路径转换为优化后的 CDN URL
 * @param localPath 本地路径
 * @param context 使用场景
 * @returns 优化后的 CDN URL
 */
export function getOptimizedCdnImageUrl(
  localPath: string,
  context: ImageUsageContext
): string {
  const cdnUrl = getCdnImageUrl(localPath);
  const options = getImageOptimizationParams(context);
  return getOptimizedImageUrl(cdnUrl, options);
}

/**
 * 检查是否为本地路径
 */
export function isLocalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('http');
}

/**
 * 统一处理图片路径：如果是本地路径则转换为 CDN，否则直接返回
 */
export function normalizeImagePath(path: string): string {
  if (isLocalPath(path)) {
    return getCdnImageUrl(path);
  }
  return path;
}
