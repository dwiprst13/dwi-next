'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { PageHeader } from '@/components/admin/PageHeader'
import { EmptyState } from '@/components/admin/EmptyState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Toast, useToast } from '@/components/admin/Toast'
import {
    Award,
    ExternalLink,
    Pencil,
    Trash2,
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    Calendar,
    Building2,
    Search,
} from 'lucide-react'

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
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const { toast, showToast, hideToast } = useToast()

    const supabase = createClient()

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        const { data } = await supabase
            .from('certificates')
            .select(`*, translations:certificate_translations(*)`)
            .order('display_order')
            .order('issued_date', { ascending: false })

        if (data) setCertificates(data)
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        const { error } = await supabase.from('certificates').delete().eq('id', deleteTarget)
        if (!error) {
            setCertificates(prev => prev.filter(c => c.id !== deleteTarget))
            showToast('Certificate deleted', 'success')
        } else {
            showToast('Failed to delete certificate', 'error')
        }
        setDeleteTarget(null)
    }

    const handleEdit = (cert: Certificate) => {
        setCurrentCertificate(cert)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentCertificate(EMPTY_CERTIFICATE)
        setIsEditing(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `cert_${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName)
            setCurrentCertificate({ ...currentCertificate, image_url: data.publicUrl })
            showToast('Image uploaded', 'success')
        } catch (error: any) {
            showToast('Upload failed: ' + error.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentCertificate.organization) return showToast('Organization is required', 'error')

        setSaving(true)
        const { id, translations, ...certData } = currentCertificate as Certificate

        try {
            let certId = id

            if (id) {
                const { error } = await supabase.from('certificates').update(certData).eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase.from('certificates').insert(certData).select().single()
                if (error) throw error
                certId = data.id
            }

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

            showToast(id ? 'Certificate updated' : 'Certificate created', 'success')
            setIsEditing(false)
            fetchCertificates()
        } catch (error: any) {
            showToast('Error: ' + error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    const filteredCertificates = certificates.filter(c => {
        if (!search) return true
        const title = c.translations.find(t => t.locale === 'en')?.title || c.organization
        return title.toLowerCase().includes(search.toLowerCase()) ||
            c.organization.toLowerCase().includes(search.toLowerCase())
    })

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
                ))}
            </div>
        )
    }

    // Edit/Create Form
    if (isEditing) {
        return (
            <div className="space-y-6 pb-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-white">
                            {currentCertificate.id ? 'Edit Certificate' : 'New Certificate'}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            {currentCertificate.id ? 'Update certificate details' : 'Add a new certificate or award'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Certificate Details
                        </h3>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Organization
                                </label>
                                <input
                                    type="text"
                                    value={currentCertificate.organization}
                                    onChange={e => setCurrentCertificate({ ...currentCertificate, organization: e.target.value })}
                                    placeholder="Google, AWS, etc."
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Issued Date
                                </label>
                                <input
                                    type="date"
                                    value={currentCertificate.issued_date}
                                    onChange={e => setCurrentCertificate({ ...currentCertificate, issued_date: e.target.value })}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Credential URL
                                </label>
                                <input
                                    type="url"
                                    value={currentCertificate.credential_url || ''}
                                    onChange={e => setCurrentCertificate({ ...currentCertificate, credential_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={currentCertificate.display_order}
                                    onChange={e => setCurrentCertificate({ ...currentCertificate, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Certificate Image
                        </h3>
                        <div className="flex items-start gap-4">
                            {currentCertificate.image_url ? (
                                <img
                                    src={currentCertificate.image_url}
                                    alt="Preview"
                                    className="h-24 w-24 rounded-xl border border-white/10 object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                                    <ImageIcon className="h-8 w-8 text-zinc-700" />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06]">
                                    <Upload className="h-4 w-4" />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-2 text-xs text-zinc-600">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Translations */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Translations
                        </h3>
                        <div className="space-y-4">
                            {['id', 'en'].map((locale) => {
                                const trans = currentCertificate.translations?.find(t => t.locale === locale) || { locale, title: '', learnings: '' }
                                return (
                                    <div key={locale} className="rounded-xl border border-white/[0.04] bg-black/20 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-zinc-300">
                                                {locale === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="mb-1 block text-xs text-zinc-500">Certificate Title</label>
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
                                                    className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-white transition focus:border-white/20 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs text-zinc-500">Key Learnings</label>
                                                <textarea
                                                    value={trans.learnings}
                                                    onChange={e => {
                                                        const newTrans = [...(currentCertificate.translations || [])]
                                                        const idx = newTrans.findIndex(t => t.locale === locale)
                                                        if (idx >= 0) newTrans[idx] = { ...newTrans[idx], learnings: e.target.value }
                                                        else newTrans.push({ locale, title: '', learnings: e.target.value })
                                                        setCurrentCertificate({ ...currentCertificate, translations: newTrans })
                                                    }}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-white transition focus:border-white/20 focus:outline-none resize-y"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : currentCertificate.id ? 'Update Certificate' : 'Create Certificate'}
                    </button>
                </form>

                {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            </div>
        )
    }

    // List View
    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Certificates"
                description={`${certificates.length} certificate${certificates.length !== 1 ? 's' : ''} & awards`}
                icon={Award}
                action={{ label: 'Add Certificate', onClick: handleCreate }}
            />

            {/* Search */}
            {certificates.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search certificates..."
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                    />
                </div>
            )}

            {/* Certificate List */}
            {filteredCertificates.length === 0 ? (
                <EmptyState
                    title={search ? 'No results found' : 'No certificates yet'}
                    description={search ? 'Try a different search term' : 'Add your first certificate or award'}
                    action={!search ? { label: 'Add Certificate', onClick: handleCreate } : undefined}
                />
            ) : (
                <div className="space-y-3">
                    {filteredCertificates.map((cert) => {
                        const title = cert.translations.find(t => t.locale === 'en')?.title || cert.organization
                        return (
                            <div
                                key={cert.id}
                                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/10 hover:bg-white/[0.04]"
                            >
                                <div className="flex items-start gap-4">
                                    {cert.image_url ? (
                                        <img
                                            src={cert.image_url}
                                            alt={title}
                                            className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                                            <Award className="h-6 w-6 text-emerald-400" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-base font-semibold text-white">
                                            {title}
                                        </h3>
                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                                            <span className="inline-flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                {cert.organization}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(cert.issued_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
                                        {cert.credential_url && (
                                            <a
                                                href={cert.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                                                title="View credential"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleEdit(cert)}
                                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(cert.id)}
                                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Certificate"
                description="This will permanently delete this certificate and all its translations. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}
