'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, Calendar, Building2 } from 'lucide-react'
import { sectionVariants, staggerContainer, fadeInUp } from '@/lib/animations'

type Certificate = {
    id: string
    organization: string
    issuedDate: string
    imageUrl?: string
    credentialUrl?: string
    title: string
    learnings: string
}

type CertificatesProps = {
    copy: {
        eyebrow: string
        heading: string
    }
    certificates: Certificate[]
}

export default function Certificates({ copy, certificates }: CertificatesProps) {
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

    if (!certificates || certificates.length === 0) return null

    return (
        <motion.section
            id="certificates"
            className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Subtle divider */}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="mb-12">
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">
                    {copy.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium text-white sm:text-4xl">
                    {copy.heading}
                </h2>
            </div>

            <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {certificates.map((cert) => (
                    <motion.div
                        key={cert.id}
                        variants={fadeInUp}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] cursor-pointer"
                        onClick={() => setSelectedCertificate(cert)}
                    >
                        {cert.imageUrl && (
                            <div className="aspect-[16/10] w-full overflow-hidden bg-black/30">
                                <img
                                    src={cert.imageUrl}
                                    alt={cert.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        )}

                        <div className="flex flex-1 flex-col p-5">
                            <h3 className="text-base font-semibold text-white group-hover:text-zinc-100">
                                {cert.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                                <Building2 className="h-3 w-3" />
                                <span>{cert.organization}</span>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-4">
                                <span className="flex items-center gap-1.5 text-[0.65rem] text-zinc-600">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(cert.issuedDate).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                    })}
                                </span>
                                {cert.credentialUrl && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-zinc-500 transition group-hover:bg-white/10 group-hover:text-white">
                                        <ArrowUpRight className="h-3 w-3" />
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCertificate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCertificate(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-950 shadow-2xl"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-400 backdrop-blur transition hover:bg-black/80 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {selectedCertificate.imageUrl && (
                                <div className="aspect-video w-full overflow-hidden bg-black/50">
                                    <img
                                        src={selectedCertificate.imageUrl}
                                        alt={selectedCertificate.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white sm:text-2xl">
                                            {selectedCertificate.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            {selectedCertificate.organization}
                                        </p>
                                    </div>
                                    {selectedCertificate.credentialUrl && (
                                        <a
                                            href={selectedCertificate.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:bg-white hover:text-black"
                                            title="View Credential"
                                        >
                                            <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Issued {new Date(selectedCertificate.issuedDate).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>

                                {selectedCertificate.learnings && (
                                    <div className="mt-6 border-t border-white/[0.06] pt-5">
                                        <h4 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                                            Key Learnings
                                        </h4>
                                        <p className="text-sm leading-relaxed text-zinc-300">
                                            {selectedCertificate.learnings}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.section>
    )
}
