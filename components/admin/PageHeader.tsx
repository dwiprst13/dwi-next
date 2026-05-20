import { LucideIcon } from 'lucide-react'

type PageHeaderProps = {
    title: string
    description?: string
    icon?: LucideIcon
    action?: {
        label: string
        onClick: () => void
    }
}

export function PageHeader({ title, description, icon: Icon, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="rounded-xl bg-white/5 p-2.5">
                        <Icon className="h-6 w-6 text-zinc-300" />
                    </div>
                )}
                <div>
                    <h1 className="font-display text-2xl font-semibold text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
                    )}
                </div>
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    <span className="text-lg leading-none">+</span>
                    {action.label}
                </button>
            )}
        </div>
    )
}
