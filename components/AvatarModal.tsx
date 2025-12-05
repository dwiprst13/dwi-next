import { motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'

interface AvatarModalProps {
    open: boolean
    label: string
    avatarSrc: string | StaticImageData
    onClose: () => void
}

export default function AvatarModal({
    open,
    label,
    avatarSrc,
    onClose,
}: AvatarModalProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
            role="dialog"
            aria-label={label}
            aria-modal="true"
            onClick={onClose}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md rounded-[32px] bg-neutral-950/80 p-2 shadow-2xl"
            >
                <div className="overflow-hidden rounded-3xl border-b-4 border-white/20 relative aspect-square">
                    {typeof avatarSrc === 'string' ? (
                        <img src={avatarSrc} alt={label} className="h-full w-full object-cover" />
                    ) : (
                        <Image
                            src={avatarSrc}
                            alt={label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    )}
                </div>
            </motion.div>
        </div>
    )
}
