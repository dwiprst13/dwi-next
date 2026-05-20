'use client'

import { motion } from 'framer-motion'
import { sectionVariants, staggerContainer, fadeInUp } from '@/lib/animations'
import ProjectCard, { Project } from './ProjectCard'
import { Locale } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'

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
            className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Subtle divider */}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Section header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">
                        {copy.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-medium text-white sm:text-4xl">
                        {copy.heading}
                    </h2>
                </div>
                <a
                    href={reposUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                >
                    {copy.cta}
                </a>
            </div>

            {/* Featured projects */}
            <motion.div
                className="mt-10 grid gap-5 sm:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {projects.featured.map((project) => (
                    <motion.div key={project.key} variants={fadeInUp}>
                        <ProjectCard project={project} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Archive section */}
            {projects.archive.length > 0 && (
                <div className="mt-14">
                    <div className="flex items-center justify-between">
                        <p className="font-display text-xl font-medium text-white">
                            {copy.dropdownTitle}
                        </p>
                        <button
                            type="button"
                            onClick={onToggleDropdown}
                            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-white/20 hover:text-white"
                            aria-expanded={dropdownOpen}
                        >
                            {dropdownOpen ? copy.dropdownOpen : copy.dropdownClosed}
                            <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                    dropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                    </div>

                    {dropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 grid gap-5 sm:grid-cols-2"
                        >
                            {projects.archive.map((project) => (
                                <ProjectCard
                                    key={project.key}
                                    project={project}
                                    compact
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            )}
        </motion.section>
    )
}
