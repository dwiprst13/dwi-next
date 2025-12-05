import Link from 'next/link'
import { Locale } from '@/lib/constants'

interface HeaderProps {
    brand: string
    navLinks: { href: string; label: string }[]
    githubLabel: string
    githubUrl: string
    locales: { code: Locale; label: string }[]
    locale: Locale
    onLocaleChange: (code: Locale) => void
}

export default function Header({
    brand,
    navLinks,
    githubLabel,
    githubUrl,
    locales,
    locale,
    onLocaleChange,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
                <p className="font-display text-lg font-semibold tracking-[0.4em] text-white">
                    {brand}
                </p>
                <nav className="hidden gap-6 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="transition hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/20 px-1 py-0.5 text-xs font-semibold text-white/70">
                        {locales.map((option) => {
                            const active = option.code === locale
                            return (
                                <button
                                    key={option.code}
                                    type="button"
                                    onClick={() => onLocaleChange(option.code)}
                                    className={`rounded-full px-3 py-1 transition ${active
                                        ? 'bg-white text-black'
                                        : 'text-white/60 hover:text-white'
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
                        className="rounded-full border border-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
                    >
                        {githubLabel}
                    </a>
                </div>
            </div>
        </header>
    )
}
