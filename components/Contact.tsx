'use client'

import { motion } from 'framer-motion'
import { sectionVariants, staggerContainer, fadeInUp } from '@/lib/animations'
import { Locale } from '@/lib/constants'
import { ArrowUpRight, Mail, Github, Linkedin, Instagram, Link as LinkIcon } from 'lucide-react'

interface ContactProps {
    copy: {
        eyebrow: string
        heading: string
        description: string
        openLabel: string
    }
    contacts: {
        key: string
        href: string
        value: string
        label: string
    }[]
    locale: Locale
    maskEmail: (email: string) => string
}

const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
        case 'email': return Mail
        case 'github': return Github
        case 'linkedin': return Linkedin
        case 'instagram': return Instagram
        default: return LinkIcon
    }
}

export default function Contact({
    copy,
    contacts,
    locale,
    maskEmail,
}: ContactProps) {
    return (
        <motion.section
            id="kontak"
            className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Subtle divider */}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="mb-10">
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">
                    {copy.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium text-white sm:text-4xl">
                    {copy.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                    {copy.description}
                </p>
            </div>

            <motion.div
                className="grid gap-4 sm:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {contacts.map((contact) => {
                    const Icon = getIcon(contact.key)
                    const displayValue =
                        contact.key === 'email'
                            ? { masked: maskEmail(contact.value), full: contact.value }
                            : contact.value

                    return (
                        <motion.a
                            key={contact.key}
                            variants={fadeInUp}
                            href={contact.href}
                            target={contact.href.startsWith('http') ? '_blank' : undefined}
                            rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                            className="group flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                            title={typeof displayValue === 'object' ? displayValue.full : displayValue}
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-500 transition group-hover:bg-white/10 group-hover:text-white">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">
                                    {contact.label}
                                </p>
                                <p className="mt-1 truncate font-display text-base font-medium text-white sm:text-lg">
                                    {contact.key === 'email' ? (
                                        <>
                                            <span className="sm:hidden">
                                                {(displayValue as { masked: string }).masked}
                                            </span>
                                            <span className="hidden sm:inline">
                                                {(displayValue as { full: string }).full}
                                            </span>
                                        </>
                                    ) : (
                                        (displayValue as string)
                                    )}
                                </p>
                            </div>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] text-zinc-600 transition group-hover:border-white/20 group-hover:text-white">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                        </motion.a>
                    )
                })}
            </motion.div>
        </motion.section>
    )
}
