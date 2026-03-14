import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Gauge, Goal, ShieldCheck, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

const features = [
  { title: 'Automatic expense detection', icon: Wand2, desc: 'Capture spending without manual effort.' },
  { title: 'AI spending analysis', icon: Brain, desc: 'Understand habits and patterns instantly.' },
  { title: 'VitalScore', icon: Gauge, desc: 'A simple score that reflects your financial health.' },
  { title: 'Smart savings goals', icon: Goal, desc: 'Track targets and stay consistent.' },
  { title: 'Budget alerts', icon: ShieldCheck, desc: 'Get notified when you overspend.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-4">MoneyMitra</div>
              <div className="text-xs text-zinc-400">Your AI Financial Companion</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              MoneyMitra – Your AI Financial Companion
            </motion.h1>
            <p className="mt-4 max-w-xl text-pretty text-zinc-300">
              Track spending automatically, understand your financial health, and build better saving habits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="soft">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { k: 'Auto', v: 'Detection' },
                { k: 'AI', v: 'Insights' },
                { k: 'Vital', v: 'Score' },
              ].map((s) => (
                <Card key={s.k} className="p-4">
                  <div className="text-xs text-zinc-400">{s.k}</div>
                  <div className="mt-1 text-lg font-semibold">{s.v}</div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Brain className="h-4 w-4 text-indigo-300" />
                Financial VitalScore
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Balance', value: '₹12,000' },
                  { label: 'Income', value: '₹20,000' },
                  { label: 'Expenses', value: '₹8,000' },
                  { label: 'Savings', value: '₹4,000' },
                ].map((i) => (
                  <div key={i.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-zinc-400">{i.label}</div>
                    <div className="mt-1 text-xl font-semibold">{i.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-400">VitalScore</div>
                    <div className="mt-1 text-2xl font-semibold">72</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Status</div>
                    <div className="mt-1 text-sm font-medium text-emerald-300">Good financial health</div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">Why MoneyMitra?</h2>
            <p className="mt-2 text-zinc-300">
              Most people manually track expenses. They don’t know whether their spending is healthy, and saving money
              becomes difficult. MoneyMitra turns raw numbers into guidance.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title}>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
                    <Icon className="h-5 w-5 text-indigo-200" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="mt-1 text-sm text-zinc-400">{f.desc}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">How it works</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Create your MoneyMitra account',
              'Track expenses automatically',
              'AI analyzes your spending',
              'Get personalized financial insights',
            ].map((step, idx) => (
              <Card key={step} className="p-5">
                <div className="text-xs text-zinc-400">Step {idx + 1}</div>
                <div className="mt-1 text-sm font-semibold">{step}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <Card className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">Start managing your money smarter</div>
              <div className="mt-1 text-sm text-zinc-400">Create an account and get your first insights in minutes.</div>
            </div>
            <Link to="/signup">
              <Button size="lg">
                <Sparkles className="h-4 w-4" />
                Create Account
              </Button>
            </Link>
          </Card>
        </section>

        <footer className="mt-12 border-t border-white/10 py-8 text-sm text-zinc-500">
          MoneyMitra • Built with React + Tailwind + Firebase
        </footer>
      </div>
    </div>
  )
}

