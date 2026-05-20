'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { PageHeader } from '@/components/admin/PageHeader'
import { EmptyState } from '@/components/admin/EmptyState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Toast, useToast } from '@/components/admin/Toast'
import {
    Contact,
    Pencil,
    Trash2,
    ArrowLeft,
    GripVertical,
    Link as LinkIcon,
    Mail,
    Github,
    Linkedin,
    Instagram,
} from 'lucide-react'

type ContactItem = {
    id: string
    key: string
    href: string
    value: string
    display_order: number
    translations: {
        locale: string
        label: string
    }[]
}

const EMPTY_CONTACT: Omit<ContactItem, 'id'> = {
    key: '',
    href: '',
    value: '',
    display_order: 0,
    translations: [
        { locale: 'id', label: '' },
        { locale: 'en', label: '' },
    ],
}

const getContactIcon = (key: string) => {
    switch (key.toLowerCase()) {
        case 'email': return Mail
        case 'github': return Github
        case 'linkedin': return Linkedin
        case 'instagram': return Instagram
        default: return LinkIcon
    }
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<ContactItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentContact, setCurrentContact] = useState<Partial<ContactItem>>(EMPTY_CONTACT)
    const [saving, setSaving] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const { toast, showToast, hideToast } = useToast()

    const supabase = createClient()

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        const { data } = await supabase
            .from('contacts')
            .select(`*, translations:contact_translations(*)`)
            .order('display_order')

        if (data) setContacts(data)
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        const { error } = await supabase.from('contacts').delete().eq('id', deleteTarget)
        if (!error) {
            setContacts(prev => prev.filter(c => c.id !== deleteTarget))
            showToast('Contact deleted', 'success')
        } else {
            showToast('Failed to delete contact', 'error')
        }
        setDeleteTarget(null)
    }

    const handleEdit = (contact: ContactItem) => {
        setCurrentContact(contact)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentContact({
            ...EMPTY_CONTACT,
            display_order: contacts.length + 1,
        })
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentContact.key) return showToast('Key is required', 'error')

        setSaving(true)
        const { id, translations, ...contactData } = currentContact as ContactItem

        try {
            let contactId = id

            if (id) {
                const { error } = await supabase.from('contacts').update(contactData).eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase.from('contacts').insert(contactData).select().single()
                if (error) throw error
                contactId = data.id
            }

            if (translations && translations.length > 0) {
                for (const t of translations) {
                    const { data: existing } = await supabase
                        .from('contact_translations')
                        .select('id')
                        .eq('contact_id', contactId)
                        .eq('locale', t.locale)
                        .single()

                    if (existing) {
                        await supabase
                            .from('contact_translations')
                            .update({ label: t.label })
                            .eq('id', existing.id)
                    } else {
                        await supabase
                            .from('contact_translations')
                            .insert({ ...t, contact_id: contactId })
                    }
                }
            }

            showToast(id ? 'Contact updated' : 'Contact created', 'success')
            setIsEditing(false)
            fetchContacts()
        } catch (error: any) {
            showToast('Error: ' + error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
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
                            {currentContact.id ? 'Edit Contact' : 'New Contact'}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            {currentContact.id ? 'Update contact details' : 'Add a new contact link'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Contact Details
                        </h3>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Key (identifier)
                                </label>
                                <input
                                    type="text"
                                    value={currentContact.key}
                                    onChange={e => setCurrentContact({ ...currentContact, key: e.target.value })}
                                    placeholder="email, github, linkedin..."
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={currentContact.display_order}
                                    onChange={e => setCurrentContact({ ...currentContact, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                Display Value
                            </label>
                            <input
                                type="text"
                                value={currentContact.value}
                                onChange={e => setCurrentContact({ ...currentContact, value: e.target.value })}
                                placeholder="user@example.com or @username"
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                required
                            />
                        </div>

                        <div className="mt-5">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                Link URL
                            </label>
                            <input
                                type="text"
                                value={currentContact.href}
                                onChange={e => setCurrentContact({ ...currentContact, href: e.target.value })}
                                placeholder="https://... or mailto:..."
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                required
                            />
                        </div>
                    </div>

                    {/* Translations */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Translations (Label)
                        </h3>
                        <div className="space-y-4">
                            {['id', 'en'].map((locale) => {
                                const trans = currentContact.translations?.find(t => t.locale === locale) || { locale, label: '' }
                                return (
                                    <div key={locale} className="rounded-xl border border-white/[0.04] bg-black/20 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-zinc-300">
                                                {locale === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-zinc-500">Label</label>
                                            <input
                                                type="text"
                                                value={trans.label}
                                                onChange={e => {
                                                    const newTrans = [...(currentContact.translations || [])]
                                                    const idx = newTrans.findIndex(t => t.locale === locale)
                                                    if (idx >= 0) newTrans[idx] = { ...newTrans[idx], label: e.target.value }
                                                    else newTrans.push({ locale, label: e.target.value })
                                                    setCurrentContact({ ...currentContact, translations: newTrans })
                                                }}
                                                placeholder="e.g. Email, GitHub"
                                                className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none"
                                            />
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
                        {saving ? 'Saving...' : currentContact.id ? 'Update Contact' : 'Create Contact'}
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
                title="Contacts"
                description={`${contacts.length} contact link${contacts.length !== 1 ? 's' : ''}`}
                icon={Contact}
                action={{ label: 'Add Contact', onClick: handleCreate }}
            />

            {/* Contact List */}
            {contacts.length === 0 ? (
                <EmptyState
                    title="No contacts yet"
                    description="Add your social links and contact information"
                    action={{ label: 'Add Contact', onClick: handleCreate }}
                />
            ) : (
                <div className="space-y-2">
                    {contacts.map((contact) => {
                        const label = contact.translations.find(t => t.locale === 'en')?.label || contact.key
                        const Icon = getContactIcon(contact.key)
                        return (
                            <div
                                key={contact.id}
                                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/10 hover:bg-white/[0.04]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                                    <Icon className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-white capitalize">
                                            {label}
                                        </h3>
                                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] text-zinc-600">
                                            #{contact.display_order}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                                        {contact.value}
                                    </p>
                                </div>
                                <a
                                    href={contact.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden truncate text-xs text-zinc-600 hover:text-zinc-400 sm:block max-w-[200px]"
                                >
                                    {contact.href}
                                </a>
                                <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                    <button
                                        onClick={() => handleEdit(contact)}
                                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(contact.id)}
                                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Contact"
                description="This will permanently delete this contact link and its translations. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}
