'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import MobileMenu from '@/components/MobileMenu'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Portfolio from '@/components/Portfolio'
import Certificates from '@/components/Certificates'
import Contact from '@/components/Contact'
import AvatarModal from '@/components/AvatarModal'
import { Locale, locales } from '@/lib/constants'
import { fetchSiteContent, fetchProjects, fetchContacts, fetchCertificates, transformData } from '@/lib/api'
import avatarIcon from '@/public/avatar.png'

const AVATAR_SRC = avatarIcon
const GITHUB_URL = 'https://github.com/dwiprst13'
const GITHUB_REPOS_URL = 'https://github.com/dwiprst13?tab=repositories'

const maskEmail = (email: string) => {
    const [username, domain] = email.split('@')
    if (!username || !domain || username.length <= 4) return email
    const visible = `${username.slice(0, 3)}…${username.slice(-1)}`
    return `${visible}@${domain}`
}

export default function Home() {
    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window === 'undefined') return 'id'
        return (localStorage.getItem('preferred-locale') as Locale) || 'id'
    })
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [avatarModalOpen, setAvatarModalOpen] = useState(false)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred-locale', locale)
        }
    }, [locale])

    useEffect(() => {
        const loadData = async () => {
            const [siteContent, projects, contacts, certificates] = await Promise.all([
                fetchSiteContent(),
                fetchProjects(),
                fetchContacts(),
                fetchCertificates(),
            ])

            if (siteContent && projects && contacts && certificates) {
                setData({ siteContent, projects, contacts, certificates })
            }
            setLoading(false)
        }
        loadData()
    }, [])

    const transformedData = useMemo(() => {
        if (!data) return null
        return transformData(data.siteContent, data.projects, data.contacts, data.certificates, locale)
    }, [data, locale])

    if (loading || !transformedData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">Loading</p>
                </div>
            </div>
        )
    }

    const t = transformedData.translations
    const navLinks = t.nav || []

    return (
        <div className="min-h-screen bg-neutral-950 text-zinc-100 font-sans">
            <Header
                brand={t.brand}
                navLinks={navLinks}
                githubLabel={t.mobileMenu?.github || 'GitHub'}
                githubUrl={GITHUB_URL}
                locales={locales}
                locale={locale}
                activeSection=""
                onLocaleChange={setLocale}
            />

            {/* Mobile menu toggle */}
            <button
                type="button"
                aria-label={t.mobileMenu?.toggleLabel}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="fixed right-4 top-20 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-neutral-950/90 text-white shadow-lg backdrop-blur-sm transition hover:border-white/40 md:hidden"
            >
                <span className="sr-only">{t.mobileMenu?.toggleLabel}</span>
                <span className="relative flex h-4 w-5 flex-col items-center justify-center">
                    <span
                        className={`block h-0.5 w-full rounded-full bg-white transition duration-300 ${
                            mobileMenuOpen ? 'translate-y-[3px] rotate-45' : '-translate-y-1'
                        }`}
                    />
                    <span
                        className={`block h-0.5 w-full rounded-full bg-white transition duration-300 ${
                            mobileMenuOpen ? '-translate-y-[3px] -rotate-45' : 'translate-y-1'
                        }`}
                    />
                </span>
            </button>

            <MobileMenu
                open={mobileMenuOpen}
                navLinks={navLinks}
                githubLabel={t.mobileMenu?.github || 'GitHub'}
                githubUrl={GITHUB_URL}
                menuTitle={t.mobileMenu?.title || 'Menu'}
                onClose={() => setMobileMenuOpen(false)}
            />

            <main>
                {t.hero && (
                    <Hero
                        copy={{ ...t.hero }}
                        onAvatarClick={() => setAvatarModalOpen(true)}
                        avatarSrc={AVATAR_SRC}
                    />
                )}
                {t.about && <About copy={t.about} />}
                {t.portfolio && (
                    <Portfolio
                        copy={t.portfolio}
                        projects={transformedData.projects}
                        locale={locale}
                        dropdownOpen={dropdownOpen}
                        onToggleDropdown={() => setDropdownOpen((prev) => !prev)}
                        reposUrl={GITHUB_REPOS_URL}
                    />
                )}
                {transformedData.certificates && (
                    <Certificates
                        copy={t.certificates || { eyebrow: 'Credentials', heading: 'Certificates' }}
                        certificates={transformedData.certificates}
                    />
                )}
                {t.contact && (
                    <Contact
                        copy={t.contact}
                        contacts={transformedData.contacts}
                        locale={locale}
                        maskEmail={maskEmail}
                    />
                )}
            </main>

            <AvatarModal
                open={avatarModalOpen}
                label={t.avatarModalLabel || 'Avatar'}
                avatarSrc={AVATAR_SRC}
                onClose={() => setAvatarModalOpen(false)}
            />

            {/* Footer */}
            <footer className="border-t border-white/[0.04]">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div>
                        <p className="text-sm text-zinc-500">
                            © {new Date().getFullYear()} Dwi Prasetia
                        </p>
                    </div>
                    <p className="text-[0.6rem] uppercase tracking-[0.5em] text-zinc-700">
                        {t.footer?.tagline}
                    </p>
                </div>
            </footer>
        </div>
    )
}
