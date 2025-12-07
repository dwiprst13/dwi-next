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

export type Certificate = {
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

export async function fetchCertificates() {
    const supabase = createClient()
    const { data } = await supabase
        .from('certificates')
        .select(`
      *,
      translations:certificate_translations(*)
    `)
        .order('display_order')
        .order('issued_date', { ascending: false })
    return data as Certificate[]
}

// Helper to transform DB data to the shape expected by components
export function transformData(
    siteContent: SiteContent[],
    projects: Project[],
    contacts: Contact[],
    certificates: Certificate[],
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

    // Transform Certificates
    const transformedCertificates = certificates.map((c) => {
        const t = c.translations.find((tr) => tr.locale === locale)
        return {
            id: c.id,
            organization: c.organization,
            issuedDate: c.issued_date,
            imageUrl: c.image_url,
            credentialUrl: c.credential_url,
            title: t?.title || c.organization,
            learnings: t?.learnings || '',
        }
    })

    return {
        translations,
        projects: transformedProjects,
        contacts: transformedContacts,
        certificates: transformedCertificates,
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
