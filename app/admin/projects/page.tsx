'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { PageHeader } from '@/components/admin/PageHeader'
import { EmptyState } from '@/components/admin/EmptyState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Toast, useToast } from '@/components/admin/Toast'
import {
    FolderKanban,
    Star,
    ExternalLink,
    Pencil,
    Trash2,
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    Search,
} from 'lucide-react'

type Project = {
    id: string
    key: string
    year: string
    stack: string[]
    repo_url: string
    image_url?: string
    is_featured: boolean
    translations: {
        locale: string
        title: string
        description: string
    }[]
}

const EMPTY_PROJECT: Omit<Project, 'id'> = {
    key: '',
    year: new Date().getFullYear().toString(),
    stack: [],
    repo_url: '',
    image_url: '',
    is_featured: false,
    translations: [
        { locale: 'id', title: '', description: '' },
        { locale: 'en', title: '', description: '' },
    ],
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProject, setCurrentProject] = useState<Partial<Project>>(EMPTY_PROJECT)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const { toast, showToast, hideToast } = useToast()

    const supabase = createClient()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const { data } = await supabase
            .from('projects')
            .select(`*, translations:project_translations(*)`)
            .order('created_at', { ascending: false })

        if (data) setProjects(data)
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        const { error } = await supabase.from('projects').delete().eq('id', deleteTarget)
        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== deleteTarget))
            showToast('Project deleted', 'success')
        } else {
            showToast('Failed to delete project', 'error')
        }
        setDeleteTarget(null)
    }

    const handleEdit = (project: Project) => {
        setCurrentProject(project)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentProject(EMPTY_PROJECT)
        setIsEditing(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `project_${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName)
            setCurrentProject({ ...currentProject, image_url: data.publicUrl })
            showToast('Image uploaded', 'success')
        } catch (error: any) {
            showToast('Upload failed: ' + error.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProject.key) return showToast('Key is required', 'error')

        setSaving(true)
        const { id, translations, ...projectData } = currentProject as Project

        try {
            let projectId = id

            if (id) {
                const { error } = await supabase.from('projects').update(projectData).eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase.from('projects').insert(projectData).select().single()
                if (error) throw error
                projectId = data.id
            }

            if (translations && translations.length > 0) {
                for (const t of translations) {
                    const { data: existing } = await supabase
                        .from('project_translations')
                        .select('id')
                        .eq('project_id', projectId)
                        .eq('locale', t.locale)
                        .single()

                    if (existing) {
                        await supabase
                            .from('project_translations')
                            .update({ title: t.title, description: t.description })
                            .eq('id', existing.id)
                    } else {
                        await supabase
                            .from('project_translations')
                            .insert({ ...t, project_id: projectId })
                    }
                }
            }

            showToast(id ? 'Project updated' : 'Project created', 'success')
            setIsEditing(false)
            fetchProjects()
        } catch (error: any) {
            showToast('Error: ' + error.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    const filteredProjects = projects.filter(p => {
        if (!search) return true
        const title = p.translations.find(t => t.locale === 'en')?.title || p.key
        return title.toLowerCase().includes(search.toLowerCase()) ||
            p.stack.some(s => s.toLowerCase().includes(search.toLowerCase()))
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
                            {currentProject.id ? 'Edit Project' : 'New Project'}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            {currentProject.id ? 'Update project details' : 'Add a new portfolio project'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Basic Information
                        </h3>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Key (unique identifier)
                                </label>
                                <input
                                    type="text"
                                    value={currentProject.key}
                                    onChange={e => setCurrentProject({ ...currentProject, key: e.target.value })}
                                    placeholder="my-project"
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                    Year
                                </label>
                                <input
                                    type="text"
                                    value={currentProject.year}
                                    onChange={e => setCurrentProject({ ...currentProject, year: e.target.value })}
                                    placeholder="2025"
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                Tech Stack (comma separated)
                            </label>
                            <input
                                type="text"
                                value={currentProject.stack?.join(', ')}
                                onChange={e => setCurrentProject({ ...currentProject, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="Go, React, PostgreSQL"
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                            />
                            {currentProject.stack && currentProject.stack.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {currentProject.stack.filter(Boolean).map((tech, i) => (
                                        <span key={i} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-5">
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                                Repository URL
                            </label>
                            <input
                                type="url"
                                value={currentProject.repo_url}
                                onChange={e => setCurrentProject({ ...currentProject, repo_url: e.target.value })}
                                placeholder="https://github.com/..."
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                                required
                            />
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={currentProject.is_featured}
                                onChange={e => setCurrentProject({ ...currentProject, is_featured: e.target.checked })}
                                className="h-4 w-4 rounded border-white/10 bg-black/50 text-white focus:ring-0 focus:ring-offset-0"
                            />
                            <label htmlFor="featured" className="flex items-center gap-2 text-sm text-zinc-300">
                                <Star className="h-3.5 w-3.5 text-amber-400" />
                                Featured Project
                            </label>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                            Project Image
                        </h3>
                        <div className="flex items-start gap-4">
                            {currentProject.image_url ? (
                                <img
                                    src={currentProject.image_url}
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
                                const trans = currentProject.translations?.find(t => t.locale === locale) || { locale, title: '', description: '' }
                                return (
                                    <div key={locale} className="rounded-xl border border-white/[0.04] bg-black/20 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-zinc-300">
                                                {locale === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="mb-1 block text-xs text-zinc-500">Title</label>
                                                <input
                                                    type="text"
                                                    value={trans.title}
                                                    onChange={e => {
                                                        const newTrans = [...(currentProject.translations || [])]
                                                        const idx = newTrans.findIndex(t => t.locale === locale)
                                                        if (idx >= 0) newTrans[idx] = { ...newTrans[idx], title: e.target.value }
                                                        else newTrans.push({ locale, title: e.target.value, description: '' })
                                                        setCurrentProject({ ...currentProject, translations: newTrans })
                                                    }}
                                                    className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-white transition focus:border-white/20 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs text-zinc-500">Description</label>
                                                <textarea
                                                    value={trans.description}
                                                    onChange={e => {
                                                        const newTrans = [...(currentProject.translations || [])]
                                                        const idx = newTrans.findIndex(t => t.locale === locale)
                                                        if (idx >= 0) newTrans[idx] = { ...newTrans[idx], description: e.target.value }
                                                        else newTrans.push({ locale, title: '', description: e.target.value })
                                                        setCurrentProject({ ...currentProject, translations: newTrans })
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
                        {saving ? 'Saving...' : currentProject.id ? 'Update Project' : 'Create Project'}
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
                title="Projects"
                description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in portfolio`}
                icon={FolderKanban}
                action={{ label: 'Add Project', onClick: handleCreate }}
            />

            {/* Search */}
            {projects.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search projects by name or tech..."
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
                    />
                </div>
            )}

            {/* Project List */}
            {filteredProjects.length === 0 ? (
                <EmptyState
                    title={search ? 'No results found' : 'No projects yet'}
                    description={search ? 'Try a different search term' : 'Create your first portfolio project to get started'}
                    action={!search ? { label: 'Add Project', onClick: handleCreate } : undefined}
                />
            ) : (
                <div className="space-y-3">
                    {filteredProjects.map((project) => {
                        const title = project.translations.find(t => t.locale === 'en')?.title || project.key
                        const desc = project.translations.find(t => t.locale === 'en')?.description || ''
                        return (
                            <div
                                key={project.id}
                                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/10 hover:bg-white/[0.04]"
                            >
                                <div className="flex items-start gap-4">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt={title}
                                            className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5">
                                            <FolderKanban className="h-6 w-6 text-zinc-600" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate text-base font-semibold text-white">
                                                {title}
                                            </h3>
                                            {project.is_featured && (
                                                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500">
                                            {desc}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-zinc-600">{project.year}</span>
                                            <span className="text-zinc-700">·</span>
                                            {project.stack.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[0.65rem] text-zinc-400">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.stack.length > 4 && (
                                                <span className="text-[0.65rem] text-zinc-600">
                                                    +{project.stack.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
                                        <a
                                            href={project.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                                            title="Open repo"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(project.id)}
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
                title="Delete Project"
                description="This will permanently delete this project and all its translations. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}
