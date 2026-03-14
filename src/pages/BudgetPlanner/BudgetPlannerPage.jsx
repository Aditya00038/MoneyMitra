import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

export default function BudgetPlannerPage() {
  const { budgets, addBudget: createBudget } = useFinance()
  const [category, setCategory] = useState('Food')
  const [limit, setLimit] = useState('')

  const alerts = useMemo(() => budgets.filter((b) => b.spent > b.limit), [budgets])

  function onSubmit(e) {
    e.preventDefault()
    const l = Number(limit)
    if (!category.trim() || !l) return
    createBudget({ category: category.trim(), limit: l })
    setLimit('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Budget Planner</CardTitle>
            <CardDescription>Set monthly limits and get alerts</CardDescription>
          </div>
        </CardHeader>

        {alerts.length ? (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Budget Alert
            </div>
            <div className="mt-1 text-zinc-200">
              You exceeded your {alerts[0].category.toLowerCase()} budget.
            </div>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <select
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment'].map((c) => (
              <option key={c} value={c} className="bg-zinc-950">
                {c}
              </option>
            ))}
          </select>
          <Input value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Monthly limit (₹)" inputMode="numeric" />
          <Button type="submit" variant="soft">
            Set budget
          </Button>
        </form>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {budgets.map((b) => {
            const pct = Math.round((b.spent / Math.max(1, b.limit)) * 100)
            const over = b.spent > b.limit
            return (
              <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{b.category}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Limit: {formatINR(b.limit)} • Spent: {formatINR(b.spent)}
                    </div>
                  </div>
                  <div className={over ? 'text-amber-300' : 'text-emerald-300'}>{pct}%</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-amber-400' : 'bg-gradient-to-r from-indigo-500 to-fuchsia-500'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

