import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ArrowDownRight, ArrowUpRight, Gauge, Sparkles } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

function StatCard({ title, value, hint, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-400">{title}</div>
          <div className="mt-1 text-xl font-semibold">{value}</div>
          {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="h-5 w-5 text-indigo-200" />
          </div>
        ) : null}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { totals, transactions } = useFinance()
  const data = totals

  const scoreColor =
    data.vitalScore >= 80 ? 'from-emerald-500 to-cyan-400' : data.vitalScore >= 65 ? 'from-indigo-500 to-fuchsia-500' : 'from-amber-500 to-rose-500'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-400">Overview</div>
          <div className="mt-1 text-2xl font-semibold">Your financial dashboard</div>
          <div className="mt-1 text-sm text-zinc-400">
            Income ₹{data.monthlyIncome.toLocaleString('en-IN')} • Savings goal ₹
            {data.monthlySavingsGoal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Wallet Balance" value={formatINR(data.walletBalance)} icon={ArrowUpRight} />
        <StatCard title="Monthly Income" value={formatINR(data.monthlyIncome)} icon={Sparkles} />
        <StatCard title="Monthly Expenses" value={formatINR(data.expenses)} icon={ArrowDownRight} />
        <StatCard title="Total Savings" value={formatINR(data.savings)} icon={ArrowUpRight} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>VitalScore</CardTitle>
              <CardDescription>Financial health indicator</CardDescription>
            </div>
            <Gauge className="h-5 w-5 text-indigo-200" />
          </CardHeader>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold">{data.vitalScore}</div>
              <div className="text-right">
                <div className="text-xs text-zinc-400">Status</div>
                <div className="text-sm font-semibold">{data.status}</div>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-linear-to-r ${scoreColor}`}
                style={{ width: `${data.vitalScore}%` }}
              />
            </div>
            <div className="text-sm text-zinc-400">
              Tip: reducing discretionary spend can raise your score quickly.
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Spending Chart</CardTitle>
              <CardDescription>Category distribution</CardDescription>
            </div>
          </CardHeader>
          <div className="h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224}>
              <PieChart>
                <Pie dataKey="value" data={data.categories} innerRadius={55} outerRadius={85} paddingAngle={2} />
                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-400">
            {data.categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                <span>{c.name}</span>
                <span className="text-zinc-200">{formatINR(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <div className="text-sm font-medium">{t.merchant}</div>
                  <div className="text-xs text-zinc-400">
                    {t.category} • {t.date}
                  </div>
                </div>
                <div className={t.amount < 0 ? 'text-rose-300' : 'text-emerald-300'}>
                  {t.amount < 0 ? '-' : '+'} {formatINR(Math.abs(t.amount))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

