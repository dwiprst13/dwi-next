'use client'

import { motion } from 'framer-motion'
import { sectionVariants, staggerContainer, fadeInUp } from '@/lib/animations'
import Image, { StaticImageData } from 'next/image'

interface HeroProps {
    copy: {
        eyebrow: string
        title: string
        paragraphs: string[]
        stats: { label: string; value: string }[]
        availability: {
            heading: string
            role: string
            description: string
            name: string
            location: string
        }
        avatarButtonLabel: string
    }
    onAvatarClick: () => void
    avatarSrc: string | StaticImageData
}

export default function Hero({ copy, onAvatarClick, avatarSrc }: HeroProps) {
    return (
        <motion.section
            id="home"
            className="relative mx-auto flex max-w-6xl flex-col gap-16 overflow-hidden px-6 pb-24 pt-20 lg:flex-row lg:items-end"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* Background decorations */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.02] blur-[100px]" />
                <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-white/[0.015] blur-[80px]" />
                <div className="absolute left-1/2 top-1/3 h-px w-[600px] -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* Main content */}
            <motion.div
                className="flex-1 space-y-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.p
                    variants={fadeInUp}
                    className="text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500"
                >
                    {copy.eyebrow}
                </motion.p>

                <motion.h1
                    variants={fadeInUp}
                    className="font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
                >
                    {copy.title}
                </motion.h1>

                <motion.div variants={fadeInUp} className="space-y-4">
                    {copy.paragraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
                        >
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    className="grid gap-4 sm:grid-cols-3"
                >
                    {copy.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-zinc-600">
                                {stat.label}
                            </p>
                            <p className="mt-2 font-display text-lg font-medium text-white">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Availability card */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full max-w-sm"
            >
                <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-7 backdrop-blur-sm">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-zinc-600">
                        {copy.availability.heading}
                    </p>
                    <p className="mt-4 font-display text-2xl font-medium text-white">
                        {copy.availability.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        {copy.availability.description}
                    </p>

                    <div className="mt-8 flex items-center gap-3 border-t border-white/[0.06] pt-6">
                        <button
                            type="button"
                            onClick={onAvatarClick}
                            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/20 transition hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            aria-label={copy.avatarButtonLabel}
                        >
                            {typeof avatarSrc === 'string' ? (
                                <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <Image src={avatarSrc} alt="" fill className="object-cover" sizes="44px" />
                            )}
                        </button>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {copy.availability.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {copy.availability.location}
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[0.6rem] text-emerald-400/80">Available</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    )
}
