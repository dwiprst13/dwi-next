'use client'

import { ArrowUpRight } from 'lucide-react'

export interface Project {
    key: string
    year: string
    stack: string[]
    repoUrl: string
    title: string
    description: string
}

interface ProjectCardProps {
    project: Project
    compact?: boolean
}

export default function ProjectCard({
    project,
    compact = false,
}: ProjectCardProps) {
    return (
        <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] hover:-translate-y-0.5 ${
                compact ? 'p-5' : 'p-6 sm:p-7'
            }`}
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
            </div>

            <div className="relative flex flex-1 flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className={`font-display font-semibold text-white ${compact ? 'text-lg' : 'text-xl'}`}>
                            {project.title}
                        </h3>
                        <span className="mt-1 inline-block text-[0.65rem] uppercase tracking-[0.3em] text-zinc-600">
                            {project.year}
                        </span>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-500 transition-all group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                </div>

                {/* Description */}
                <p className={`mt-3 text-sm leading-relaxed text-zinc-500 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {project.description}
                </p>

                {/* Stack */}
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[0.6rem] font-medium text-zinc-500 transition group-hover:bg-white/[0.06] group-hover:text-zinc-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    )
}
