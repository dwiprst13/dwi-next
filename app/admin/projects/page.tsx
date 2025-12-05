'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Project = {
    id: string
    key: string
    year: string
    stack: string[]
    repo_url: string
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

    const supabase = createClient()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select(`
        *,
        translations:project_translations(*)
      `)
            .order('created_at', { ascending: false })

        if (data) {
            setProjects(data)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (!error) {
            setProjects((prev) => prev.filter((p) => p.id !== id))
        } else {
            alert('Error deleting project: ' + error.message)
        }
    }

    const handleEdit = (project: Project) => {
        setCurrentProject(project)
        setIsEditing(true)
    }

    const handleCreate = () => {
        setCurrentProject(EMPTY_PROJECT)
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProject.key) return alert('Key is required')

        const { id, translations, ...projectData } = currentProject as Project

        try {
            let projectId = id

            // 1. Upsert Project
            if (id) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', id)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('projects')
                    .insert(projectData)
                    .select()
                    .single()
                if (error) throw error
                projectId = data.id
            }

            // 2. Upsert Translations
            if (translations && translations.length > 0) {
                // First delete existing translations to avoid duplicates/complexity if we just blindly insert
                // Or better, upsert based on project_id + locale
                for (const t of translations) {
                    // Check if translation exists
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

            setIsEditing(false)
            fetchProjects()
        } catch (error: any) {
            alert('Error saving: ' + error.message)
        }
    }

    if (loading) return <div className="text-white">Loading projects...</div>

    if (isEditing) {
        return (
            <div className="pb-20">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="font-display text-3xl font-semibold text-white">
                        {currentProject.id ? 'Edit Project' : 'New Project'}
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
                                value={currentProject.key}
                                onChange={e => setCurrentProject({ ...currentProject, key: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Year</label>
                            <input
                                type="text"
                                value={currentProject.year}
                                onChange={e => setCurrentProject({ ...currentProject, year: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Stack (comma separated)</label>
                        <input
                            type="text"
                            value={currentProject.stack?.join(', ')}
                            onChange={e => setCurrentProject({ ...currentProject, stack: e.target.value.split(',').map(s => s.trim()) })}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400">Repo URL</label>
                        <input
                            type="url"
                            value={currentProject.repo_url}
                            onChange={e => setCurrentProject({ ...currentProject, repo_url: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={currentProject.is_featured}
                            onChange={e => setCurrentProject({ ...currentProject, is_featured: e.target.checked })}
                            className="rounded border-white/10 bg-black/50"
                        />
                        <label htmlFor="featured" className="text-sm text-zinc-300">Featured Project</label>
                    </div>

                    <div className="space-y-6 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-white">Translations</h3>
                        {['id', 'en'].map((locale) => {
                            const trans = currentProject.translations?.find(t => t.locale === locale) || { locale, title: '', description: '' }
                            return (
                                <div key={locale} className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
                                    <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium uppercase text-zinc-400 mb-2">
                                        {locale.toUpperCase()}
                                    </span>
                                    <div>
                                        <label className="block text-xs text-zinc-500">Title</label>
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
                                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-zinc-500">Description</label>
                                        <textarea
                                            value={trans.description}
                                            onChange={e => {
                                                const newTrans = [...(currentProject.translations || [])]
                                                const idx = newTrans.findIndex(t => t.locale === locale)
                                                if (idx >= 0) newTrans[idx] = { ...newTrans[idx], description: e.target.value }
                                                else newTrans.push({ locale, title: '', description: e.target.value })
                                                setCurrentProject({ ...currentProject, translations: newTrans })
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
                        Save Project
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-semibold text-white">
                    Projects
                </h1>
                <button
                    onClick={handleCreate}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    Add Project
                </button>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => {
                    const title = project.translations.find(t => t.locale === 'en')?.title || project.key
                    return (
                        <div
                            key={project.id}
                            className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                                    {project.is_featured && (
                                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-yellow-500">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-zinc-400">{project.year} • {project.stack.join(', ')}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
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
