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

  const handleLocaleChange = (code: Locale) => {
    setLocale(code)
  }

  if (loading || !transformedData) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading...</div>
  }

  const t = transformedData.translations
  const navLinks = t.nav || []

  return (
    <div className="min-h-screen text-zinc-100 font-sans">
      <Header
        brand={t.brand}
        navLinks={navLinks}
        githubLabel={t.mobileMenu?.github || 'GitHub'}
        githubUrl={GITHUB_URL}
        locales={locales}
        locale={locale}
        onLocaleChange={handleLocaleChange}
      />

      <button
        type="button"
        aria-label={t.mobileMenu?.toggleLabel}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="fixed right-4 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white shadow-2xl backdrop-blur transition hover:border-white/70 md:hidden"
      >
        <span className="sr-only">{t.mobileMenu?.toggleLabel}</span>
        <span className="relative flex h-5 w-6 flex-col items-center justify-center">
          <span
            className={`block h-0.5 w-full rounded-full bg-white transition duration-300 ${mobileMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-1.5'
              }`}
          ></span>
          <span
            className={`block h-0.5 w-full rounded-full bg-white transition duration-300 ${mobileMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-1.5'
              }`}
          ></span>
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
            copy={t.certificates || {
              eyebrow: 'Credentials',
              heading: 'Certificates'
            }}
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

      <footer className="border-t border-white/5 bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Dwi Prasetia — Tailwind crafted.</p>
          <p className="uppercase tracking-[0.4em]">{t.footer?.tagline}</p>
        </div>
      </footer>
    </div>
  )
}
