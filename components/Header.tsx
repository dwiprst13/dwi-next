'use client'

import Link from 'next/link'
import { Locale } from '@/lib/constants'
import { useEffect, useState } from 'react'

interface HeaderProps {
    brand: string
    navLinks: { href: string; label: string }[]
    githubLabel: string
    githubUrl: string
    locales: { code: Locale; label: string }[]
    locale: Locale
    onLocaleChange: (code: Locale) => void
    activeSection: string
}

export default function Header({
    brand,
    navLinks,
    githubLabel,
    githubUrl,
    locales,
    locale,
    onLocaleChange,
    activeSection,
}: HeaderProps) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-white/[0.06] bg-black/80 backdrop-blur-xl shadow-lg shadow-black/20'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <p className="font-display text-lg font-bold tracking-[0.3em] text-white">
                    {brand}
                </p>

                <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-1 md:flex">
                    {navLinks.map((link) => {
                        const isActive = link.href === `#${activeSection}`
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-all ${
                                    isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-zinc-500 hover:text-zinc-200'
                                }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="flex rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5">
                        {locales.map((option) => {
                            const active = option.code === locale
                            return (
                                <button
                                    key={option.code}
                                    type="button"
                                    onClick={() => onLocaleChange(option.code)}
                                    className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold transition-all ${
                                        active
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-zinc-500 hover:text-white'
                                    }`}
                                    aria-pressed={active}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden rounded-full border border-white/20 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-white hover:bg-white hover:text-black sm:inline-flex"
                    >
                        {githubLabel}
                    </a>
                </div>
            </div>
        </header>
    )
}
