import { motion } from 'framer-motion'
import { sectionVariants } from '@/lib/animations'
import ProjectCard, { Project } from './ProjectCard'
import { Locale } from '@/lib/constants'

interface PortfolioProps {
    copy: {
        eyebrow: string
        heading: string
        cta: string
        dropdownTitle: string
        dropdownClosed: string
        dropdownOpen: string
    }
    projects: {
        featured: Project[]
        archive: Project[]
    }
    locale: Locale
    dropdownOpen: boolean
    onToggleDropdown: () => void
    reposUrl: string
}

export default function Portfolio({
    copy,
    projects,
    locale,
    dropdownOpen,
    onToggleDropdown,
    reposUrl,
}: PortfolioProps) {
    return (
        <motion.section
            id="portofolio"
            className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pb-24"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-16 -z-10 h-32 rounded-full bg-linear-to-r from-transparent via-white/5 to-transparent opacity-80 blur-3xl"
            ></span>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
                        {copy.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-4xl text-white">
                        {copy.heading}
                    </h2>
                </div>
                <a
                    href={reposUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400 transition hover:text-white"
                >
                    {copy.cta}
                </a>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
                {projects.featured.map((project) => (
                    <ProjectCard key={project.key} project={project} />
                ))}
            </div>

            <div className="mt-12">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="font-display text-2xl text-white">
                        {copy.dropdownTitle}
                    </p>
                    <button
                        type="button"
                        onClick={onToggleDropdown}
                        className="self-start rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                        aria-expanded={dropdownOpen}
                    >
                        {dropdownOpen ? copy.dropdownOpen : copy.dropdownClosed}
                    </button>
                </div>
                {dropdownOpen && (
                    <div className="mt-6 rounded-3xl border border-white/10 bg-black/70 p-6 shadow-2xl">
                        <div className="grid gap-6 md:grid-cols-2">
                            {projects.archive.map((project) => (
                                <ProjectCard
                                    key={project.key}
                                    project={project}
                                    compact
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.section>
    )
}
