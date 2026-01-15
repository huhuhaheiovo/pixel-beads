import { transform as wsrvTransform } from "unpic/providers/wsrv";
import type { ImgHTMLAttributes } from "react";

/**
 * OptimizedImage 组件
 * 使用原生 img 标签 + wsrv.nl transformer 优化 R2 CDN 图片
 * 避免使用 Vercel 付费的 Image 组件
 */
export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  operations?: {
    wsrv?: {
      output?: "jpeg" | "png" | "webp" | "avif" | "gif" | "json" | "tiff";
      q?: number;
      fit?: "contain" | "cover" | "fill" | "inside" | "outside";
      w?: number;
      h?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export function OptimizedImage({ src, operations, ...restProps }: OptimizedImageProps) {
  // 默认优化参数（可以通过 operations.wsrv 覆盖）
  const wsrvOptions = {
    output: "webp" as const,
    q: 85,
    fit: "cover" as const,
    ...operations?.wsrv,
  };

  // 使用 wsrvTransform 构建优化后的 URL
  // wsrvTransform 的第二个参数直接是 WsrvOperations，不是包含 wsrv 键的对象
  const optimizedSrc = wsrvTransform(src, wsrvOptions as any);

  return (
    <img
      {...restProps}
      src={optimizedSrc}
    />
  );
}
