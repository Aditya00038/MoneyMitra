import { useState } from 'react'
import { Bolt, Trash2 } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

const initial = [
  { id: 'd1', source: 'Detected SMS', text: '₹350 spent at Zomato', merchant: 'Zomato', category: 'Food', amount: 350 },
  { id: 'd2', source: 'Detected SMS', text: '₹799 spent at Netflix', merchant: 'Netflix', category: 'Entertainment', amount: 799 },
]

export default function AutoDetectionPage() {
  const [items, setItems] = useState(initial)
  const { addTransaction } = useFinance()

  function confirm(id) {
    const found = items.find((x) => x.id === id)
    if (!found) return

    addTransaction({
      type: 'Expense',
      amount: found.amount,
      category: found.category,
      merchant: found.merchant,
    })
    setItems((prev) => prev.filter((x) => x.id !== id))
  }
  function del(id) {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Automatic Expense Detection</CardTitle>
            <CardDescription>Review detected transactions and confirm to add</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Bolt className="h-4 w-4" />
            Demo mode
          </div>
        </CardHeader>

        <div className="grid gap-3 md:grid-cols-2">
          {items.map((x) => (
            <div key={x.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-zinc-400">{x.source}</div>
              <div className="mt-1 text-sm font-semibold">{x.text}</div>
              <div className="mt-2 text-sm text-zinc-300">
                {x.merchant} • {x.category} • <span className="text-rose-300">-{formatINR(x.amount)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="soft" onClick={() => confirm(x.id)}>
                  Confirm
                </Button>
                <Button variant="ghost" onClick={() => del(x.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {!items.length ? <div className="text-sm text-zinc-400">No detected transactions right now.</div> : null}
        </div>
      </Card>
    </div>
  )
}

