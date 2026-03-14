import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">MoneyMitra</div>
            <div className="text-xs text-zinc-400">Your AI Financial Companion</div>
          </div>
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="hidden lg:block">
            <div className="text-3xl font-semibold">{title}</div>
            <div className="mt-2 max-w-md text-zinc-300">{subtitle}</div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent p-6 text-sm text-zinc-300">
              Sign in to see your VitalScore, budgets, and AI insights—tailored to your income and goals.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="text-xl font-semibold">{title}</div>
            <div className="mt-1 text-sm text-zinc-400">{subtitle}</div>
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6 border-t border-white/10 pt-5 text-sm text-zinc-400">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

