'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Contact = {
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

const EMPTY_CONTACT: Omit<Contact, 'id'> = {
    key: '',
    href: '',
    value: '',
    display_order: 0,
    translations: [
        { locale: 'id', label: '' },
        { locale: 'en', label: '' },
    ],
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentContact, setCurrentContact] = useState<Partial<Contact>>(EMPTY_CONTACT)

    const supabase = createClient()

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        const { data, error } = await supabase
            .from('contacts')
            .select(`
        *,
        translations:contact_translations(*)
      `)
            .order('display_order')

        if (data) {
            setContacts(data)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        const { error } = await supabase.from('contacts').delete().eq('id', id)
        if (!error) {
            setContacts((prev) => prev.filter((c) => c.id !== id))
        } else {
            alert('Error deleting contact: ' + error.message)
        }
    }

    const handleEdit = (contact: Contact) => {
        setCurrentContact(contact)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentContact(EMPTY_CONTACT)
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentContact.key) return alert('Key is required')

        const { id, translations, ...contactData } = currentContact as Contact

        try {
            let contactId = id

            // 1. Upsert Contact
            if (id) {
                const { error } = await supabase
                    .from('contacts')
                    .update(contactData)
                    .eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('contacts')
                    .insert(contactData)
                    .select()
                    .single()
                if (error) throw error
                contactId = data.id
            }

            // 2. Upsert Translations
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

            setIsEditing(false)
            fetchContacts()
        } catch (error: any) {
            alert('Error saving: ' + error.message)
        }
    }

    if (loading) return <div className="text-white">Loading contacts...</div>

    if (isEditing) {
        return (
            <div className="pb-20">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="font-display text-3xl font-semibold text-white">
                        {currentContact.id ? 'Edit Contact' : 'New Contact'}
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
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Key (ID)</label>
                            <input
                                type="text"
                                value={currentContact.key}
                                onChange={e => setCurrentContact({ ...currentContact, key: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Order</label>
                            <input
                                type="number"
                                value={currentContact.display_order}
                                onChange={e => setCurrentContact({ ...currentContact, display_order: parseInt(e.target.value) })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Value (Display Text)</label>
                        <input
                            type="text"
                            value={currentContact.value}
                            onChange={e => setCurrentContact({ ...currentContact, value: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Link (HREF)</label>
                        <input
                            type="text"
                            value={currentContact.href}
                            onChange={e => setCurrentContact({ ...currentContact, href: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-6 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-white">Translations (Label)</h3>
                        {['id', 'en'].map((locale) => {
                            const trans = currentContact.translations?.find(t => t.locale === locale) || { locale, label: '' }
                            return (
                                <div key={locale} className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
                                    <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium uppercase text-zinc-400 mb-2">
                                        {locale.toUpperCase()}
                                    </span>
                                    <div>
                                        <label className="block text-xs text-zinc-500">Label</label>
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
                                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-white text-sm"
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
                        Save Contact
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-semibold text-white">
                    Contacts
                </h1>
                <button
                    onClick={handleCreate}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    Add Contact
                </button>
            </div>

            <div className="grid gap-6">
                {contacts.map((contact) => {
                    const label = contact.translations.find(t => t.locale === 'en')?.label || contact.key
                    return (
                        <div
                            key={contact.id}
                            className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
                        >
                            <div>
                                <h3 className="text-xl font-semibold text-white capitalize">{label}</h3>
                                <p className="mt-1 text-sm text-zinc-400">{contact.value}</p>
                                <a href={contact.href} target="_blank" className="text-xs text-zinc-500 hover:text-white truncate block max-w-xs">{contact.href}</a>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(contact)}
                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(contact.id)}
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
