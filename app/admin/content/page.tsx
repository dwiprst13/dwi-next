'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { PageHeader } from '@/components/admin/PageHeader'
import { Toast, useToast } from '@/components/admin/Toast'
import { FileText, Save, ChevronDown, ChevronUp, Globe } from 'lucide-react'

type SiteContent = {
    id: string
    section: string
    locale: string
    content: any
    updated_at: string
}

export default function ContentPage() {
    const [contents, setContents] = useState<SiteContent[]>([])
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [editedValues, setEditedValues] = useState<Record<string, string>>({})
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [filterLocale, setFilterLocale] = useState<'all' | 'id' | 'en'>('all')
    const { toast, showToast, hideToast } = useToast()
    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .order('section')
            .order('locale')

        if (data) {
            setContents(data)
            // Initialize edited values
            const values: Record<string, string> = {}
            data.forEach((item) => {
                values[item.id] = JSON.stringify(item.content, null, 2)
            })
            setEditedValues(values)
        }
        setLoading(false)
    }

    const handleSave = async (id: string) => {
        try {
            const parsed = JSON.parse(editedValues[id])
            setSavingId(id)
            const { error } = await supabase
                .from('site_content')
                .update({ content: parsed, updated_at: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error

            setContents(prev =>
                prev.map(c => c.id === id ? { ...c, content: parsed, updated_at: new Date().toISOString() } : c)
            )
            showToast('Content saved successfully', 'success')
        } catch {
            showToast('Invalid JSON format', 'error')
        } finally {
            setSavingId(null)
        }
    }

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(section)) next.delete(section)
            else next.add(section)
            return next
        })
    }

    const isModified = (id: string, content: any) => {
        return editedValues[id] !== JSON.stringify(content, null, 2)
    }

    const filteredContents = filterLocale === 'all'
        ? contents
        : contents.filter(c => c.locale === filterLocale)

    // Group by section
    const sections = [...new Set(filteredContents.map(c => c.section))]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Site Content"
                description="Manage static content for each section and locale"
                icon={FileText}
            />

            {/* Locale Filter */}
            <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-zinc-500" />
                <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                    {(['all', 'id', 'en'] as const).map((locale) => (
                        <button
                            key={locale}
                            onClick={() => setFilterLocale(locale)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                filterLocale === locale
                                    ? 'bg-white/10 text-white'
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {locale === 'all' ? 'All' : locale.toUpperCase()}
                        </button>
                    ))}
                </div>
                <span className="ml-2 text-xs text-zinc-600">
                    {filteredContents.length} items
                </span>
            </div>

            {/* Content Sections */}
            <div className="space-y-3">
                {sections.map((section) => {
                    const sectionItems = filteredContents.filter(c => c.section === section)
                    const isExpanded = expandedSections.has(section)

                    return (
                        <div
                            key={section}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                        >
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section)}
                                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-amber-500/10 px-2 py-1">
                                        <span className="text-xs font-bold uppercase text-amber-400">
                                            {section}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-500">
                                        {sectionItems.length} locale{sectionItems.length > 1 ? 's' : ''}
                                    </span>
                                    {sectionItems.some(item => isModified(item.id, item.content)) && (
                                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[0.6rem] font-medium text-blue-400">
                                            Modified
                                        </span>
                                    )}
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                                )}
                            </button>

                            {/* Section Content */}
                            {isExpanded && (
                                <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
                                    {sectionItems.map((item) => (
                                        <div key={item.id} className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-zinc-400">
                                                        {item.locale}
                                                    </span>
                                                    <span className="text-[0.65rem] text-zinc-600">
                                                        Updated {new Date(item.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleSave(item.id)}
                                                    disabled={!isModified(item.id, item.content) || savingId === item.id}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                                        isModified(item.id, item.content)
                                                            ? 'bg-white text-black hover:bg-zinc-200'
                                                            : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <Save className="h-3 w-3" />
                                                    {savingId === item.id ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                            <textarea
                                                value={editedValues[item.id] || ''}
                                                onChange={(e) =>
                                                    setEditedValues(prev => ({ ...prev, [item.id]: e.target.value }))
                                                }
                                                className="h-48 w-full rounded-xl border border-white/[0.06] bg-black/40 p-4 font-mono text-xs leading-relaxed text-zinc-300 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 resize-y"
                                                spellCheck={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}
