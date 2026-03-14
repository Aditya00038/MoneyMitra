import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

export default function AIInsightsPage() {
  const { totals } = useFinance()
  const food = totals.categories.find((c) => c.name === 'Food')?.value ?? 0
  const pct = Math.round((food / Math.max(1, totals.monthlyIncome)) * 100)
  const suggestion = Math.round(food * 0.2) || 0
  const savingsBoost = Math.round((suggestion / Math.max(1, totals.monthlyIncome)) * 100)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Actionable advice based on your spending</CardDescription>
          </div>
        </CardHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Spending analysis</div>
            <div className="mt-2 text-sm text-zinc-300">
              You spent <span className="font-semibold text-white">{pct}%</span> of your income on food this month.
            </div>
            <div className="mt-2 text-sm text-zinc-400">
              Food spend: <span className="text-zinc-200">{formatINR(food)}</span> • Income:{' '}
              <span className="text-zinc-200">{formatINR(totals.monthlyIncome)}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Savings recommendation</div>
            <div className="mt-2 text-sm text-zinc-300">
              Reducing food spending by <span className="font-semibold text-white">{formatINR(suggestion)}</span>/month
              could increase savings by about <span className="font-semibold text-emerald-300">{savingsBoost}%</span>.
            </div>
            <div className="mt-2 text-sm text-zinc-400">
              Try: meal planning, weekly budget caps, and fewer delivery orders.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

