'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { StatCard } from '@/components/admin/StatCard'
import {
    FolderKanban,
    Award,
    Contact,
    FileText,
    Star,
    Clock,
    ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'

type DashboardStats = {
    projects: number
    featuredProjects: number
    certificates: number
    contacts: number
    contentSections: number
    lastUpdated: string | null
}

type RecentItem = {
    id: string
    title: string
    type: 'project' | 'certificate' | 'contact'
    date: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        projects: 0,
        featuredProjects: 0,
        certificates: 0,
        contacts: 0,
        contentSections: 0,
        lastUpdated: null,
    })
    const [recentItems, setRecentItems] = useState<RecentItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        const [projectsRes, certsRes, contactsRes, contentRes] = await Promise.all([
            supabase.from('projects').select('id, is_featured, created_at, translations:project_translations(locale, title)').order('created_at', { ascending: false }),
            supabase.from('certificates').select('id, organization, created_at, translations:certificate_translations(locale, title)').order('created_at', { ascending: false }),
            supabase.from('contacts').select('id, key, created_at').order('created_at', { ascending: false }),
            supabase.from('site_content').select('id, section, updated_at').order('updated_at', { ascending: false }),
        ])

        const projects = projectsRes.data || []
        const certs = certsRes.data || []
        const contacts = contactsRes.data || []
        const content = contentRes.data || []

        // Build stats
        setStats({
            projects: projects.length,
            featuredProjects: projects.filter((p: any) => p.is_featured).length,
            certificates: certs.length,
            contacts: contacts.length,
            contentSections: new Set(content.map((c: any) => c.section)).size,
            lastUpdated: content[0]?.updated_at || null,
        })

        // Build recent items
        const recent: RecentItem[] = []
        projects.slice(0, 3).forEach((p: any) => {
            const title = p.translations?.find((t: any) => t.locale === 'en')?.title || p.id
            recent.push({ id: p.id, title, type: 'project', date: p.created_at })
        })
        certs.slice(0, 2).forEach((c: any) => {
            const title = c.translations?.find((t: any) => t.locale === 'en')?.title || c.organization
            recent.push({ id: c.id, title, type: 'certificate', date: c.created_at })
        })

        recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setRecentItems(recent.slice(0, 5))
        setLoading(false)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const formatRelative = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="font-display text-2xl font-semibold text-white">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Overview of your portfolio content
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Projects"
                    value={stats.projects}
                    icon={FolderKanban}
                    trend={`${stats.featuredProjects} featured`}
                    color="blue"
                />
                <StatCard
                    label="Certificates"
                    value={stats.certificates}
                    icon={Award}
                    color="emerald"
                />
                <StatCard
                    label="Contacts"
                    value={stats.contacts}
                    icon={Contact}
                    color="purple"
                />
                <StatCard
                    label="Content Sections"
                    value={stats.contentSections}
                    icon={FileText}
                    trend={stats.lastUpdated ? `Updated ${formatRelative(stats.lastUpdated)}` : undefined}
                    color="amber"
                />
            </div>

            {/* Quick Actions + Recent */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                        Quick Actions
                    </h2>
                    <div className="space-y-2">
                        {[
                            { href: '/admin/projects', label: 'Manage Projects', icon: FolderKanban },
                            { href: '/admin/certificates', label: 'Manage Certificates', icon: Award },
                            { href: '/admin/contacts', label: 'Manage Contacts', icon: Contact },
                            { href: '/admin/content', label: 'Edit Content', icon: FileText },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                            >
                                <item.icon className="h-4 w-4 text-zinc-500" />
                                {item.label}
                                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-zinc-600" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                        Recent Items
                    </h2>
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        {recentItems.length === 0 ? (
                            <div className="px-6 py-12 text-center text-sm text-zinc-500">
                                No items yet
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.06]">
                                {recentItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.02]"
                                    >
                                        <div className={`rounded-lg p-2 ${
                                            item.type === 'project'
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : item.type === 'certificate'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-purple-500/10 text-purple-400'
                                        }`}>
                                            {item.type === 'project' && <FolderKanban className="h-4 w-4" />}
                                            {item.type === 'certificate' && <Award className="h-4 w-4" />}
                                            {item.type === 'contact' && <Contact className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-zinc-200">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-zinc-500 capitalize">
                                                {item.type}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(item.date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
