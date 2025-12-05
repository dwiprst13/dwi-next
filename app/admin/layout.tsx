'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
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
                setLoading(false)
            }
        }

        checkUser()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
                Loading...
            </div>
        )
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/content', label: 'Content' },
        { href: '/admin/projects', label: 'Projects' },
        { href: '/admin/contacts', label: 'Contacts' },
    ]

    return (
        <div className="h-screen bg-neutral-950 text-zinc-100 flex overflow-hidden">
            <aside className="w-64 border-r border-white/10 bg-black/20 p-6 hidden md:flex md:flex-col h-full overflow-y-auto">
                <div className="mb-8">
                    <h1 className="font-display text-xl font-bold tracking-widest text-white">
                        ADMIN
                    </h1>
                </div>
                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="pt-8 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 h-full overflow-y-auto">
                <div className="md:hidden mb-6 flex justify-between items-center">
                    <h1 className="font-display text-xl font-bold tracking-widest text-white">
                        ADMIN
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-zinc-400"
                    >
                        Sign Out
                    </button>
                </div>
                {children}
            </main>
        </div>
    )
}
