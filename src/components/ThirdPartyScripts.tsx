'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function ThirdPartyScripts () {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    let interactionTimer: NodeJS.Timeout | null = null
    let idleCallback: number | null = null

    // 监听用户交互事件
    const handleInteraction = () => {
      if (shouldLoad) return

      // 延迟 2-3 秒后加载
      interactionTimer = setTimeout(() => {
        setShouldLoad(true)
      }, 2000)
    }

    // 使用 requestIdleCallback 在浏览器空闲时加载
    const scheduleIdleLoad = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const callback = (window as any).requestIdleCallback(
          () => {
            setIsIdle(true)
            // 如果用户已经交互过，立即加载；否则等待交互
            if (shouldLoad) {
              setShouldLoad(true)
            }
          },
          { timeout: 5000 }
        )
        idleCallback = callback
      } else {
        // 降级方案：延迟加载
        setTimeout(() => {
          setIsIdle(true)
        }, 3000)
      }
    }

    // 监听多种交互事件
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll', 'click']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    // 启动空闲回调
    scheduleIdleLoad()

    // 清理函数
    return () => {
      if (interactionTimer) {
        clearTimeout(interactionTimer)
      }
      if (idleCallback && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallback)
      }
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [shouldLoad])

  // 如果用户交互过或浏览器空闲，则加载脚本
  const loadScripts = shouldLoad || isIdle

  if (!loadScripts) {
    return null
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PHKBP63X2W"
        strategy="lazyOnload"
      />
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2409588554709380"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PHKBP63X2W');
        `}
      </Script>
    </>
  )
}
