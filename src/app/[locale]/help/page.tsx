'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ChevronDown, BookOpen, Wrench, HelpCircle } from 'lucide-react'
import { useState } from 'react'

function FAQItem({ question, answer, category }: { question: string; answer: string; category?: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="mb-4 border-4 border-[#F4F4F5] rounded-[1.5rem] overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
            >
                <span className="font-black text-lg uppercase tracking-tight text-[#18181B] pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-[#32B8A6] transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="px-6 pb-4 pt-2 border-t border-[#F4F4F5]">
                    <p className="text-[#3F3F46] leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    )
}

export default function HelpPage() {
    const t = useTranslations('FAQ')

    const faqCategories = [
        {
            id: 'general',
            title: t('categoryGeneral'),
            icon: HelpCircle,
            questions: [
                { q: 'q1', a: 'a1' },
                { q: 'q2', a: 'a2' },
                { q: 'q3', a: 'a3' },
            ]
        },
        {
            id: 'usage',
            title: t('categoryUsage'),
            icon: BookOpen,
            questions: [
                { q: 'q4', a: 'a4' },
                { q: 'q5', a: 'a5' },
                { q: 'q6', a: 'a6' },
                { q: 'q7', a: 'a7' },
            ]
        },
        {
            id: 'troubleshooting',
            title: t('categoryTroubleshooting'),
            icon: Wrench,
            questions: [
                { q: 'q8', a: 'a8' },
                { q: 'q9', a: 'a9' },
                { q: 'q10', a: 'a10' },
                { q: 'q11', a: 'a11' },
            ]
        },
        {
            id: 'export',
            title: t('categoryExport'),
            icon: BookOpen,
            questions: [
                { q: 'q12', a: 'a12' },
                { q: 'q13', a: 'a13' },
            ]
        }
    ]

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">{t('title')}</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-[#3F3F46] leading-relaxed mb-12">
                        {t('intro')}
                    </p>

                    {/* Tutorial Links */}
                    <section className="mb-12 p-6 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <BookOpen className="w-6 h-6 text-[#32B8A6] mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-[#18181B]">{t('tutorialTitle')}</h2>
                                <p className="text-[#3F3F46] leading-relaxed mb-4">{t('tutorialDescription')}</p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/perler-bead-pattern-generator"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#32B8A6] hover:bg-[#2AA38F] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                                    >
                                        {t('tutorialLink1')}
                                    </Link>
                                    <Link
                                        href="/image-to-pixel"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] hover:bg-[#2A2A2A] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                                    >
                                        {t('tutorialLink2')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Categories */}
                    {faqCategories.map((category) => {
                        const Icon = category.icon
                        return (
                            <section key={category.id} className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <Icon className="w-6 h-6 text-[#32B8A6]" />
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#18181B]">
                                        {category.title}
                                    </h2>
                                </div>
                                {category.questions.map((item, index) => (
                                    <FAQItem
                                        key={`${category.id}-${index}`}
                                        question={t(`${item.q}`)}
                                        answer={t(`${item.a}`)}
                                        category={category.id}
                                    />
                                ))}
                            </section>
                        )
                    })}

                    {/* Troubleshooting Guide */}
                    <section className="mb-12 p-6 bg-[#FAFAFA] border-4 border-[#F4F4F5] rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <Wrench className="w-6 h-6 text-[#32B8A6] mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-[#18181B]">{t('troubleshootingTitle')}</h2>
                                <p className="text-[#3F3F46] leading-relaxed mb-4">{t('troubleshootingDescription')}</p>
                                <ul className="list-disc list-inside text-[#3F3F46] space-y-2">
                                    <li>{t('troubleshootingTip1')}</li>
                                    <li>{t('troubleshootingTip2')}</li>
                                    <li>{t('troubleshootingTip3')}</li>
                                    <li>{t('troubleshootingTip4')}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('stillNeedHelp')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('contactDescription')}</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#32B8A6] hover:bg-[#2AA38F] text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                        >
                            {t('contactLink')}
                        </Link>
                    </section>
                </div>
            </div>
        </main>
    )
}
