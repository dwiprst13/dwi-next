'use client'

import { motion } from 'framer-motion'
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
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:bg-white/10"
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
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-white hover:text-black"
                                            title="View Credential"
                                        >
                                            <ArrowUpRight size={18} />
                                        </a>
                                    )}
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <span>Issued {new Date(cert.issuedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                                    </div>

                                    {cert.learnings && (
                                        <div className="border-t border-white/10 pt-4">
                                            <p className="text-sm leading-relaxed text-zinc-400">
                                                {cert.learnings}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
