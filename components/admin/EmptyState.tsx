import { Inbox } from 'lucide-react'

type EmptyStateProps = {
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mb-4 rounded-full bg-white/5 p-4">
                <Inbox className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}
