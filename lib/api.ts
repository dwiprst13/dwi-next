import { createClient } from '@/lib/supabaseClient'
import { Locale } from '@/lib/constants'

export type SiteContent = {
    section: string
    locale: string
    content: any
}

export type Project = {
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

export type Contact = {
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

export async function fetchSiteContent() {
    const supabase = createClient()
    const { data } = await supabase.from('site_content').select('*')
    return data as SiteContent[]
}

export async function fetchProjects() {
    const supabase = createClient()
    const { data } = await supabase
        .from('projects')
        .select(`
      *,
      translations:project_translations(*)
    `)
        .order('created_at', { ascending: false })
    return data as Project[]
}

export async function fetchContacts() {
    const supabase = createClient()
    const { data } = await supabase
        .from('contacts')
        .select(`
      *,
      translations:contact_translations(*)
    `)
        .order('display_order')
    return data as Contact[]
}

// Helper to transform DB data to the shape expected by components
export function transformData(
    siteContent: SiteContent[],
    projects: Project[],
    contacts: Contact[],
    locale: Locale
) {
    // Transform Site Content
    const translations: any = {}
    siteContent.forEach((item) => {
        if (item.locale === locale) {
            translations[item.section] = item.content
        }
    })

    // Transform Projects
    const transformedProjects = {
        featured: projects
            .filter((p) => p.is_featured)
            .map((p) => transformProject(p, locale)),
        archive: projects
            .filter((p) => !p.is_featured)
            .map((p) => transformProject(p, locale)),
    }

    // Transform Contacts
    const transformedContacts = contacts.map((c) => ({
        key: c.key,
        href: c.href,
        value: c.value,
        label: c.translations.find((t) => t.locale === locale)?.label || c.key,
    }))

    return {
        translations,
        projects: transformedProjects,
        contacts: transformedContacts,
    }
}

function transformProject(project: Project, locale: Locale) {
    const translation = project.translations.find((t) => t.locale === locale)
    return {
        key: project.key,
        year: project.year,
        stack: project.stack,
        repoUrl: project.repo_url,
        title: translation?.title || project.key,
        description: translation?.description || '',
    }
}
