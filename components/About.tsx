'use client'

import { motion } from 'framer-motion'
import { sectionVariants, staggerContainer, fadeInUp } from '@/lib/animations'

interface AboutProps {
    copy: {
        eyebrow: string
        heading: string
        paragraphs: string[]
        skills: string[]
    }
}

export default function About({ copy }: AboutProps) {
    return (
        <motion.section
            id="tentang"
            className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Subtle divider */}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
                <motion.div
                    className="space-y-6"
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
                    <motion.h2
                        variants={fadeInUp}
                        className="font-display text-3xl font-medium leading-snug text-white sm:text-4xl"
                    >
                        {copy.heading}
                    </motion.h2>
                    {copy.paragraphs.map((paragraph, i) => (
                        <motion.p
                            key={i}
                            variants={fadeInUp}
                            className="text-base leading-relaxed text-zinc-400 sm:text-lg"
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </motion.div>

                <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {copy.skills.map((skill, i) => (
                        <motion.div
                            key={skill}
                            variants={fadeInUp}
                            className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all hover:border-white/10 hover:bg-white/[0.04] hover:translate-x-1"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs font-bold text-zinc-500 transition group-hover:bg-white/10 group-hover:text-white">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-medium tracking-wide text-zinc-300">
                                {skill}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}
