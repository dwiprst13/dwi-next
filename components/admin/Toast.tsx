'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error'

type ToastProps = {
    message: string
    type: ToastType
    onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onClose, 300)
        }, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${
                type === 'success'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/20 bg-red-500/10 text-red-400'
            }`}
        >
            {type === 'success' ? (
                <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
                <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

// Hook for toast management
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type })
    }

    const hideToast = () => setToast(null)

    return { toast, showToast, hideToast }
}
