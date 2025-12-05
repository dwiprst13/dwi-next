import { motion } from 'framer-motion'
import { sectionVariants } from '@/lib/animations'

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
            className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pb-24"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
                        {copy.eyebrow}
                    </p>
                    <h2 className="font-display text-3xl text-white">{copy.heading}</h2>
                    {copy.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-lg text-zinc-400">
                            {paragraph}
                        </p>
                    ))}
                </div>
                <div className="space-y-5">
                    {copy.skills.map((skill) => (
                        <div
                            key={skill}
                            className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium uppercase tracking-[0.3em] text-zinc-300 hover:bg-white/10 transition hover:pl-8"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
