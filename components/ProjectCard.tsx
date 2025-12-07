import { Locale } from '@/lib/constants'

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
    const { title, description } = project

    return (
        <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 ${compact ? 'sm:p-5' : 'sm:p-7'
                }`}
        >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-70">
                <span className="absolute inset-y-0 -left-1/2 h-full w-[200%] bg-linear-to-r from-transparent via-white/20 to-transparent blur-2xl animate-shimmer"></span>
            </span>
            <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-zinc-200">
                        {title}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        {project.year}
                    </span>
                </div>
                <p
                    className={`mt-4 text-sm text-zinc-400 ${compact ? 'md:max-w-[32ch]' : 'md:max-w-[40ch]'
                        }`}
                >
                    {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-300"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    )
}
