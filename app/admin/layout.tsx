'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    FileText,
    FolderKanban,
    Award,
    Contact,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/certificates', label: 'Certificates', icon: Award },
    { href: '/admin/contacts', label: 'Contacts', icon: Contact },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                router.push('/login')
            } else {
                setUserEmail(session.user.email || null)
                setLoading(false)
            }
        }

        checkUser()
    }, [router, supabase])

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <p className="text-sm text-zinc-500">Loading...</p>
                </div>
            </div>
        )
    }

    const currentPage = navItems.find(item => item.href === pathname)?.label || 'Admin'

    return (
        <div className="h-screen bg-neutral-950 text-zinc-100 flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/[0.06] bg-black/40 md:flex">
                {/* Brand */}
                <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-6">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                        <span className="text-xs font-black text-black">P</span>
                    </div>
                    <span className="font-display text-sm font-bold tracking-wider text-white">
                        PRAST13
                    </span>
                    <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-[0.6rem] font-medium text-zinc-500">
                        ADMIN
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-600">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                                {item.label}
                                {isActive && (
                                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-zinc-500" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-white/[0.06] p-3">
                    <div className="mb-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                        <p className="truncate text-xs font-medium text-zinc-300">
                            {userEmail}
                        </p>
                        <p className="text-[0.65rem] text-zinc-600">Administrator</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-red-500/5 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-white/[0.06] bg-neutral-950 transition-transform duration-300 md:hidden ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } flex`}
            >
                <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-xs font-black text-black">P</span>
                        </div>
                        <span className="font-display text-sm font-bold tracking-wider text-white">
                            PRAST13
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="border-t border-white/[0.06] p-3">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-red-500/5 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] px-6">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Admin</span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="font-medium text-zinc-200">{currentPage}</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
