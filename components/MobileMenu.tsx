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
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in md:hidden"
            onClick={onClose}
        >
            <div
                className="absolute right-4 top-[110px] w-64 rounded-3xl border border-white/10 bg-neutral-950/95 p-6 text-xs uppercase tracking-[0.3em] text-zinc-400 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="mb-4 text-[0.7rem] font-semibold text-zinc-500">
                    {menuTitle}
                </p>
                <div className="flex flex-col gap-4 text-sm font-semibold">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="text-white/80 transition hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-[0.65rem] font-semibold tracking-[0.4em] text-white/80 transition hover:border-white/60 hover:text-white"
                >
                    {githubLabel}
                </a>
            </div>
        </div>
    )
}
