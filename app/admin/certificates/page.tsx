'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Certificate = {
    id: string
    organization: string
    issued_date: string
    image_url?: string
    credential_url?: string
    display_order: number
    translations: {
        locale: string
        title: string
        learnings: string
    }[]
}

const EMPTY_CERTIFICATE: Omit<Certificate, 'id'> = {
    organization: '',
    issued_date: new Date().toISOString().split('T')[0],
    image_url: '',
    credential_url: '',
    display_order: 0,
    translations: [
        { locale: 'id', title: '', learnings: '' },
        { locale: 'en', title: '', learnings: '' },
    ],
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCertificate, setCurrentCertificate] = useState<Partial<Certificate>>(EMPTY_CERTIFICATE)
    const [uploading, setUploading] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        const { data, error } = await supabase
            .from('certificates')
            .select(`
        *,
        translations:certificate_translations(*)
      `)
            .order('issued_date', { ascending: false })

        if (data) {
            setCertificates(data)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        const { error } = await supabase.from('certificates').delete().eq('id', id)
        if (!error) {
            setCertificates((prev) => prev.filter((c) => c.id !== id))
        } else {
            alert('Error deleting certificate: ' + error.message)
        }
    }

    const handleEdit = (certificate: Certificate) => {
        setCurrentCertificate(certificate)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentCertificate(EMPTY_CERTIFICATE)
        setIsEditing(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `cert_${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio') // Using the same bucket for now
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)

            setCurrentCertificate({ ...currentCertificate, image_url: data.publicUrl })
        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentCertificate.organization) return alert('Organization is required')

        const { id, translations, ...certData } = currentCertificate as Certificate

        try {
            let certId = id

            // 1. Upsert Certificate
            if (id) {
                const { error } = await supabase
                    .from('certificates')
                    .update(certData)
                    .eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('certificates')
                    .insert(certData)
                    .select()
                    .single()
                if (error) throw error
                certId = data.id
            }

            // 2. Upsert Translations
            if (translations && translations.length > 0) {
                for (const t of translations) {
                    const { data: existing } = await supabase
                        .from('certificate_translations')
                        .select('id')
                        .eq('certificate_id', certId)
                        .eq('locale', t.locale)
                        .single()

                    if (existing) {
                        await supabase
                            .from('certificate_translations')
                            .update({ title: t.title, learnings: t.learnings })
                            .eq('id', existing.id)
                    } else {
                        await supabase
                            .from('certificate_translations')
                            .insert({ ...t, certificate_id: certId })
                    }
                }
            }

            setIsEditing(false)
            fetchCertificates()
        } catch (error: any) {
            alert('Error saving: ' + error.message)
        }
    }

    if (loading) return <div className="text-white">Loading certificates...</div>

    if (isEditing) {
        return (
            <div className="pb-20">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="font-display text-3xl font-semibold text-white">
                        {currentCertificate.id ? 'Edit Certificate' : 'New Certificate'}
                    </h1>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-sm text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Organization</label>
                            <input
                                type="text"
                                value={currentCertificate.organization}
                                onChange={e => setCurrentCertificate({ ...currentCertificate, organization: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Issued Date</label>
                            <input
                                type="date"
                                value={currentCertificate.issued_date}
                                onChange={e => setCurrentCertificate({ ...currentCertificate, issued_date: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Credential URL</label>
                        <input
                            type="url"
                            value={currentCertificate.credential_url || ''}
                            onChange={e => setCurrentCertificate({ ...currentCertificate, credential_url: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Certificate Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            {currentCertificate.image_url && (
                                <img
                                    src={currentCertificate.image_url}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-lg object-cover border border-white/10"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200"
                                />
                                {uploading && <p className="mt-1 text-xs text-zinc-400">Uploading...</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-white">Translations</h3>
                        {['id', 'en'].map((locale) => {
                            const trans = currentCertificate.translations?.find(t => t.locale === locale) || { locale, title: '', learnings: '' }
                            return (
                                <div key={locale} className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
                                    <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium uppercase text-zinc-400 mb-2">
                                        {locale.toUpperCase()}
                                    </span>
                                    <div>
                                        <label className="block text-xs text-zinc-500">Title (Certificate Name)</label>
                                        <input
                                            type="text"
                                            value={trans.title}
                                            onChange={e => {
                                                const newTrans = [...(currentCertificate.translations || [])]
                                                const idx = newTrans.findIndex(t => t.locale === locale)
                                                if (idx >= 0) newTrans[idx] = { ...newTrans[idx], title: e.target.value }
                                                else newTrans.push({ locale, title: e.target.value, learnings: '' })
                                                setCurrentCertificate({ ...currentCertificate, translations: newTrans })
                                            }}
                                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-zinc-500">Learnings (What was learned)</label>
                                        <textarea
                                            value={trans.learnings}
                                            onChange={e => {
                                                const newTrans = [...(currentCertificate.translations || [])]
                                                const idx = newTrans.findIndex(t => t.locale === locale)
                                                if (idx >= 0) newTrans[idx] = { ...newTrans[idx], learnings: e.target.value }
                                                else newTrans.push({ locale, title: '', learnings: e.target.value })
                                                setCurrentCertificate({ ...currentCertificate, translations: newTrans })
                                            }}
                                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-white text-sm h-20"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                        Save Certificate
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-semibold text-white">
                    Certificates
                </h1>
                <button
                    onClick={handleCreate}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    Add Certificate
                </button>
            </div>

            <div className="grid gap-6">
                {certificates.map((cert) => {
                    const title = cert.translations.find(t => t.locale === 'en')?.title || cert.organization
                    return (
                        <div
                            key={cert.id}
                            className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
                        >
                            <div className="flex items-center gap-4">
                                {cert.image_url && (
                                    <img src={cert.image_url} alt={title} className="h-12 w-12 rounded object-cover" />
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                                    <p className="mt-1 text-sm text-zinc-400">{cert.organization} • {cert.issued_date}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(cert)}
                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
