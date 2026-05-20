'use client'

import { AlertTriangle } from 'lucide-react'

type ConfirmDialogProps = {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-red-500/10 p-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <p className="mb-6 text-sm text-zinc-400">{description}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-lg bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/30"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
