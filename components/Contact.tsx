import { motion } from 'framer-motion'
import { sectionVariants } from '@/lib/animations'
import { Locale } from '@/lib/constants'

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

export default function Contact({
    copy,
    contacts,
    locale,
    maskEmail,
}: ContactProps) {
    return (
        <motion.section
            id="kontak"
            className="mx-auto max-w-6xl px-6 pb-20 pt-10 lg:pb-28"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
                        {copy.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-4xl text-white">
                        {copy.heading}
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                        {copy.description}
                    </p>
                </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {contacts.map((contact) => {
                    const label = contact.label
                    const value =
                        contact.key === 'email'
                            ? {
                                masked: maskEmail(contact.value),
                                full: contact.value,
                            }
                            : contact.value

                    return (
                        <a
                            key={contact.key}
                            href={contact.href}
                            target={contact.href.startsWith('http') ? '_blank' : undefined}
                            rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                            className="flex items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/60 px-6 py-5 transition hover:border-white/50"
                            title={
                                typeof value === 'object' ? value.full : (value as string)
                            }
                        >
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                                    {label}
                                </p>
                                <p className="mt-3 font-display text-xl md:text-2xl text-white">
                                    {contact.key === 'email' ? (
                                        <>
                                            <span className="md:hidden">
                                                {(value as { masked: string }).masked}
                                            </span>
                                            <span className="hidden md:inline">
                                                {(value as { full: string }).full}
                                            </span>
                                        </>
                                    ) : (
                                        (value as string)
                                    )}
                                </p>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                                {copy.openLabel}
                            </span>
                        </a>
                    )
                })}
            </div>
        </motion.section>
    )
}
