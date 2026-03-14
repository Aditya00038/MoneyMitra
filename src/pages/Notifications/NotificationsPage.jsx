import { Bell, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

const alerts = [
  { id: 'n1', type: 'warn', title: 'Low Balance Alert', desc: 'Your wallet balance is getting low.' },
  { id: 'n2', type: 'warn', title: 'Budget Limit Reached', desc: 'You exceeded your shopping budget.' },
  { id: 'n3', type: 'ok', title: 'Savings Goal Progress', desc: 'Nice! You saved 25% towards Laptop Goal.' },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Alerts and reminders (SMS via TextBee later)</CardDescription>
          </div>
          <Bell className="h-5 w-5 text-indigo-200" />
        </CardHeader>

        <div className="space-y-2">
          {alerts.map((a) => {
            const Icon = a.type === 'warn' ? AlertTriangle : CheckCircle2
            return (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
                  <Icon className={a.type === 'warn' ? 'h-5 w-5 text-amber-300' : 'h-5 w-5 text-emerald-300'} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{a.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{a.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

