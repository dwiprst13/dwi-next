'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface MobileMenuProps {
    open: boolean
    navLinks: { href: string; label: string }[]
    githubUrl: string
    githubLabel: string
    menuTitle: string
    onClose: () => void
}

export default function MobileMenu({
    open,
    navLinks,
    githubUrl,
    githubLabel,
    menuTitle,
    onClose,
}: MobileMenuProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* Menu panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed right-4 top-[100px] z-50 w-56 rounded-2xl border border-white/[0.08] bg-neutral-950/95 p-5 shadow-2xl backdrop-blur-xl md:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-zinc-600">
                                {menuTitle}
                            </p>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-zinc-500 transition hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <nav className="space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-4 border-t border-white/[0.06] pt-4">
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={onClose}
                                className="flex w-full items-center justify-center rounded-full border border-white/10 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-zinc-300 transition hover:border-white/30 hover:text-white"
                            >
                                {githubLabel}
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
