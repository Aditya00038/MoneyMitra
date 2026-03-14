import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { getProfile, setProfile } from '../../lib/storage'

const defaultCategories = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const existing = useMemo(() => getProfile(), [])
  const [income, setIncome] = useState(existing?.monthlyIncome ?? 20000)
  const [goal, setGoal] = useState(existing?.monthlySavingsGoal ?? 5000)
  const [cats, setCats] = useState(existing?.preferredCategories ?? defaultCategories)

  function toggleCategory(cat) {
    setCats((prev) => (prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]))
  }

  function onSubmit(e) {
    e.preventDefault()
    setProfile({
      monthlyIncome: Number(income) || 0,
      monthlySavingsGoal: Number(goal) || 0,
      preferredCategories: cats.length ? cats : defaultCategories,
      updatedAt: Date.now(),
    })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Onboarding</div>
            <div className="text-xs text-zinc-400">Personalize your insights</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
            <div className="text-lg font-semibold">Tell us about your finances</div>
            <div className="mt-1 text-sm text-zinc-400">
              This helps MoneyMitra generate AI insights tailored to you.
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <div className="mb-1 text-xs text-zinc-400">Monthly income</div>
                <Input
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  inputMode="numeric"
                  placeholder="₹20,000"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-400">Monthly savings goal</div>
                <Input value={goal} onChange={(e) => setGoal(e.target.value)} inputMode="numeric" placeholder="₹5,000" />
              </div>

              <div>
                <div className="mb-2 text-xs text-zinc-400">Preferred spending categories</div>
                <div className="flex flex-wrap gap-2">
                  {defaultCategories.map((cat) => {
                    const active = cats.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={[
                          'rounded-full border px-3 py-1 text-sm transition',
                          active
                            ? 'border-white/20 bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10',
                        ].join(' ')}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button size="lg" className="w-full">
                <CheckCircle2 className="h-4 w-4" />
                Continue to dashboard
              </Button>
            </form>
          </Card>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <div className="text-sm font-semibold">Example</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">Income</div>
                  <div className="mt-1 text-xl font-semibold">₹20,000</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">Savings goal</div>
                  <div className="mt-1 text-xl font-semibold">₹5,000</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-zinc-400">
                We’ll use this to estimate your VitalScore and provide savings recommendations.
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

