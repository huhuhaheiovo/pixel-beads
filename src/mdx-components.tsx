import type { MDXComponents } from 'mdx/types'
import React from 'react'
import { TutorialImage } from './components/TutorialImage'

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
        Toolkit: ({ items }: { items: { name: string; desc: string }[] }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 my-12 bg-[#F1ECE1]/30 p-8 border-l-8 border-[#18181B] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none -mr-8 -mt-8 rotate-45 bg-[#18181B]" />
                {items.map((item, i) => (
                    <div key={i} className="flex gap-5 items-start">
                        <div className="w-10 h-10 shrink-0 bg-[#18181B] flex items-center justify-center text-white font-black text-sm rotate-3 group-hover:rotate-0 transition-transform">
                            {i + 1}
                        </div>
                        <div>
                            <div className="font-black uppercase text-sm tracking-widest text-[#18181B] mb-1">{item.name}</div>
                            <div className="text-xs text-[#71717A] leading-normal font-medium">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        ),
        Callout: ({ type = 'pro-tip', title, children }: { type?: 'safety' | 'pro-tip'; title?: string; children: React.ReactNode }) => {
            const isSafety = type === 'safety';
            return (
                <div className={`my-12 p-8 border-[4px] border-[#18181B] relative pixel-notched ${isSafety ? 'bg-[#FEF2F2]' : 'bg-[#EFF6FF]'}`}>
                    <div className={`absolute -top-5 left-8 px-4 py-1.5 font-black uppercase text-xs tracking-[0.2em] border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] ${isSafety ? 'bg-[#EF4444] text-white' : 'bg-[#3B82F6] text-white'}`}>
                        {title || (isSafety ? 'Safety Advisory' : 'Workshop Tip')}
                    </div>
                    <div className="pt-4 text-[#3F3F46] font-medium leading-relaxed">{children}</div>
                </div>
            );
        },
        QuizItem: ({ question, children }: { question: string; children: React.ReactNode }) => (
            <div className="my-10 group">
                <div className="bg-white border-[4px] border-[#18181B] p-8 shadow-[12px_12px_0px_#18181B] transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[16px_16px_0px_#18181B]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <span className="inline-block px-3 py-1 bg-[#18181B] text-white text-[10px] font-black uppercase tracking-[0.3em] self-start">Question</span>
                        <h4 className="font-black uppercase text-xl md:text-2xl tracking-tight m-0 text-[#18181B]">{question}</h4>
                    </div>
                    <div className="pl-8 border-l-4 border-[#F1ECE1] text-[#52525B] text-lg leading-relaxed font-medium">
                        {children}
                    </div>
                </div>
            </div>
        ),
        Step: ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
            <div className="relative pl-20 mb-16 last:mb-0 group/step">
                <div className="absolute left-0 top-0 w-14 h-14 bg-white border-[4px] border-[#18181B] flex items-center justify-center font-black text-2xl text-[#EF4444] shadow-[6px_6px_0px_#18181B] group-hover/step:scale-110 transition-transform">
                    {number}
                </div>
                {/* Decorative Line */}
                <div className="absolute left-[27px] top-14 bottom-[-64px] w-1 bg-[#18181B]/10 group-last/step:hidden" />
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 mt-0 text-[#18181B]">{title}</h3>
                <div className="text-lg text-[#3F3F46] leading-relaxed font-medium">
                    {children}
                </div>
            </div>
        ),
        TutorialImage: (props: any) => <TutorialImage {...props} />,
        ...components,
    }
}
