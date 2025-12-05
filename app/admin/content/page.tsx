'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type SiteContent = {
    id: string
    section: string
    locale: string
    content: any
}

export default function ContentPage() {
    const [contents, setContents] = useState<SiteContent[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .order('section')
            .order('locale')

        if (data) {
            setContents(data)
        }
        setLoading(false)
    }

    const handleUpdate = async (id: string, newContent: string) => {
        try {
            const parsed = JSON.parse(newContent)
            setSaving(true)
            const { error } = await supabase
                .from('site_content')
                .update({ content: parsed, updated_at: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error

            // Update local state
            setContents(prev => prev.map(c => c.id === id ? { ...c, content: parsed } : c))
            alert('Saved successfully!')
        } catch (e) {
            alert('Invalid JSON or Save Error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="text-white">Loading content...</div>

    return (
        <div className="space-y-8 pb-20">
            <h1 className="font-display text-3xl font-semibold text-white">
                Site Content
            </h1>

            <div className="grid gap-8">
                {contents.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white capitalize">
                                    {item.section}
                                </h3>
                                <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium uppercase text-zinc-400">
                                    {item.locale}
                                </span>
                            </div>
                        </div>

                        <textarea
                            defaultValue={JSON.stringify(item.content, null, 2)}
                            className="h-64 w-full rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-sm text-zinc-300 focus:border-white/30 focus:outline-none"
                            onBlur={(e) => handleUpdate(item.id, e.target.value)}
                        />
                        <p className="mt-2 text-xs text-zinc-500">
                            Edit JSON and click outside to save.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
