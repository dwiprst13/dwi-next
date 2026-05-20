import { LucideIcon } from 'lucide-react'

type StatCardProps = {
    label: string
    value: string | number
    icon: LucideIcon
    trend?: string
    color?: 'default' | 'blue' | 'emerald' | 'amber' | 'purple'
}

const colorMap = {
    default: 'bg-white/5 text-zinc-300',
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
}

export function StatCard({ label, value, icon: Icon, trend, color = 'default' }: StatCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className="mt-1 text-xs text-zinc-500">{trend}</p>
                    )}
                </div>
                <div className={`rounded-xl p-2.5 ${colorMap[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/[0.02] transition group-hover:bg-white/[0.04]" />
        </div>
    )
}
