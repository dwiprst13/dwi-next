'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

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
    certificates: Certificate[]
}

export default function Certificates({ certificates }: CertificatesProps) {
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

    if (!certificates || certificates.length === 0) return null

    return (
        <section id="certificates" className="py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <h2 className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Certificates
                    </h2>
                    <div className="mt-4 h-1 w-20 bg-white"></div>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:bg-white/10 cursor-pointer"
                            onClick={() => setSelectedCertificate(cert)}
                        >
                            {cert.imageUrl && (
                                <div className="aspect-video w-full overflow-hidden bg-black/50">
                                    <img
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            <div className="flex flex-1 flex-col p-6">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-zinc-200">
                                            {cert.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-zinc-400">
                                            {cert.organization}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl"
                        >
                            {selectedCertificate.imageUrl && (
                                <div className="aspect-video w-full overflow-hidden bg-black/50">
                                    <img
                                        src={selectedCertificate.imageUrl}
                                        alt={selectedCertificate.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-8">
                                <div className="mb-6 flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {selectedCertificate.title}
                                        </h3>
                                        <p className="mt-1 text-lg font-medium text-zinc-400">
                                            {selectedCertificate.organization}
                                        </p>
                                    </div>
                                    {selectedCertificate.credentialUrl && (
                                        <a
                                            href={selectedCertificate.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-white hover:text-black"
                                            title="View Credential"
                                        >
                                            <ArrowUpRight size={20} />
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <span>Issued {new Date(selectedCertificate.issuedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>

                                    {selectedCertificate.learnings && (
                                        <div className="border-t border-white/10 pt-6">
                                            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                                                What I Learned
                                            </h4>
                                            <p className="text-base leading-relaxed text-zinc-300">
                                                {selectedCertificate.learnings}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
