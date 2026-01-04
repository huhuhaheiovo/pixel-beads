import type { MDXComponents } from 'mdx/types'
import React from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-black uppercase tracking-tight mb-8 mt-12 text-[#18181B]">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 mt-10 text-[#18181B] border-b border-[#E4E4E7] pb-2">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 mt-8 text-[#18181B]">
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="text-[#3F3F46] leading-relaxed mb-6 text-lg">
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-6 space-y-2 text-[#3F3F46]">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-6 space-y-2 text-[#3F3F46]">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-lg leading-relaxed">
                {children}
            </li>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#18181B] pl-6 py-2 mb-8 italic text-[#71717A] bg-[#FAFAFA] rounded-r-lg">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-[#F4F4F5] text-[#18181B] px-1.5 py-0.5 rounded font-mono text-sm font-bold">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-[#18181B] text-[#F4F4F5] p-6 rounded-xl overflow-x-auto mb-8 font-mono text-sm leading-relaxed shadow-xl">
                {children}
            </pre>
        ),
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-[#18181B] underline decoration-2 underline-offset-4 hover:text-[#71717A] transition-colors font-bold"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
                {children}
            </a>
        ),
        img: ({ src, alt }) => (
            <span className="block mb-10 mt-6 box-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className="rounded-2xl border border-[#E4E4E7] shadow-lg w-full max-h-[600px] object-cover"
                />
                {alt && <span className="block text-center text-sm text-[#71717A] mt-4 font-bold uppercase tracking-widest">{alt}</span>}
            </span>
        ),
        ...components,
    }
}
