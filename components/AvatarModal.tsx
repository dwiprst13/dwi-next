'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { X } from 'lucide-react'

interface AvatarModalProps {
    open: boolean
    label: string
    avatarSrc: string | StaticImageData
    onClose: () => void
}

export default function AvatarModal({
    open,
    label,
    avatarSrc,
    onClose,
}: AvatarModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    role="dialog"
                    aria-label={label}
                    aria-modal="true"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="relative w-full max-w-md"
                    >
                        <button
                            onClick={onClose}
                            className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-zinc-400 transition hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl">
                            <div className="relative aspect-square">
                                {typeof avatarSrc === 'string' ? (
                                    <img src={avatarSrc} alt={label} className="h-full w-full object-cover" />
                                ) : (
                                    <Image
                                        src={avatarSrc}
                                        alt={label}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
