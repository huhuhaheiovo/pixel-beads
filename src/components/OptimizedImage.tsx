import { Image } from "@unpic/react/base";
import { transform as wsrvTransform } from "unpic/providers/wsrv";
import type { ComponentProps } from "react";

/**
 * OptimizedImage 组件
 * 使用 unpic base Image + wsrv.nl transformer 优化 R2 CDN 图片
 * 
 * 保留 unpic 的所有响应式图片功能，同时通过 wsrv.nl 进行图片优化
 */
export function OptimizedImage(props: ComponentProps<typeof Image> & {
  operations?: {
    wsrv?: {
      output?: string;
      q?: number;
      fit?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}) {
  const { operations, ...restProps } = props;
  
  return (
    <Image
      {...restProps}
      transformer={wsrvTransform}
      // 默认优化参数（可以通过 operations.wsrv 覆盖）
      operations={{
        wsrv: {
          output: "webp",
          q: 85,
          fit: "cover",
          ...operations?.wsrv,
        },
        ...operations,
      } as any}
    />
  );
}
