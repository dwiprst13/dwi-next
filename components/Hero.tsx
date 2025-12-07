import { motion } from 'framer-motion'
import { sectionVariants } from '@/lib/animations'
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
            className="relative mx-auto flex max-w-6xl flex-col gap-12 overflow-hidden px-6 pb-20 pt-16 lg:flex-row lg:items-end"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 top-0 hidden h-64 w-64 rounded-full opacity-70 blur-[120px] md:block animate-float"
            ></span>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 bottom-10 h-48 w-48 rounded-full border border-white/10 opacity-20 blur-3xl animate-float"
                style={{ animationDelay: '1.2s' }}
            ></span>
            <div className="flex-1 space-y-8">
                <p className="text-xs uppercase tracking-[0.6em] text-zinc-500">
                    {copy.eyebrow}
                </p>
                <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
                    {copy.title}
                </h1>
                {copy.paragraphs.map((paragraph) => (
                    <p
                        key={paragraph}
                        className="max-w-2xl text-lg text-zinc-400 md:text-xl"
                    >
                        {paragraph}
                    </p>
                ))}
                <div className="grid gap-6 sm:grid-cols-3">
                    {copy.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-white/10 bg-white/10 p-5"
                        >
                            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                                {stat.label}
                            </p>
                            <p className="mt-3 font-display text-xl text-white">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-sm rounded-4xl border border-white/10 bg-white/10 p-8 text-right">
                <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                    {copy.availability.heading}
                </p>
                <p className="mt-4 font-display text-2xl text-white">
                    {copy.availability.role}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                    {copy.availability.description}
                </p>
                <div className="mt-10 flex items-center justify-end gap-3 text-sm">
                    <button
                        type="button"
                        onClick={onAvatarClick}
                        className="h-12 w-12 overflow-hidden rounded-full border border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white relative"
                        aria-label={copy.avatarButtonLabel}
                    >
                        {typeof avatarSrc === 'string' ? (
                            <img
                                src={avatarSrc}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Image
                                src={avatarSrc}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        )}
                    </button>
                    <div>
                        <p className="font-semibold text-white">
                            {copy.availability.name}
                        </p>
                        <p className="text-zinc-500">{copy.availability.location}</p>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}
