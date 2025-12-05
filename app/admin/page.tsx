export default function AdminDashboard() {
    return (
        <div>
            <h1 className="mb-8 font-display text-3xl font-semibold text-white">
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                        Content
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-white">Manage Site</p>
                    <p className="mt-4 text-sm text-zinc-500">
                        Edit Hero, About, and Footer content.
                    </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                        Projects
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-white">Manage Work</p>
                    <p className="mt-4 text-sm text-zinc-500">
                        Add or update portfolio projects.
                    </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                        Contacts
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-white">Manage Links</p>
                    <p className="mt-4 text-sm text-zinc-500">
                        Update social links and contact info.
                    </p>
                </div>
            </div>
        </div>
    )
}
