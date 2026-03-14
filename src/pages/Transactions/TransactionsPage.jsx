import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

export default function TransactionsPage() {
  const { transactions, addTransaction } = useFinance()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('All')
  const [form, setForm] = useState({
    type: 'Expense',
    amount: '',
    category: 'Food',
    merchant: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const filtered = useMemo(() => {
    return transactions.filter((r) => {
      const matchQ = `${r.merchant} ${r.category} ${r.type} ${r.date}`.toLowerCase().includes(q.toLowerCase())
      const matchCat = category === 'All' ? true : r.category === category
      return matchQ && matchCat
    })
  }, [transactions, q, category])

  function onSubmit(e) {
    e.preventDefault()
    if (!form.amount || !form.merchant) return
    addTransaction({
      ...form,
      amount: Number(form.amount) || 0,
    })
    setForm((prev) => ({ ...prev, amount: '', merchant: '' }))
  }

  const categories = ['All', 'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Income']

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View history, filter, and add transactions</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={onSubmit} className="mb-4 grid gap-3 md:grid-cols-5">
          <select
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="Expense" className="bg-zinc-950">
              Expense
            </option>
            <option value="Income" className="bg-zinc-950">
              Income
            </option>
          </select>
          <Input
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="Amount"
            inputMode="numeric"
          />
          <Input
            value={form.merchant}
            onChange={(e) => setForm((prev) => ({ ...prev, merchant: e.target.value }))}
            placeholder="Merchant"
          />
          <select
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            {['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Income', 'Other'].map((c) => (
              <option key={c} value={c} className="bg-zinc-950">
                {c}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
          <div className="md:col-span-5 flex justify-end">
            <Button variant="soft" type="submit">
              Add Transaction
            </Button>
          </div>
        </form>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." />
            </div>
          </div>
          <div>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-zinc-950">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 gap-2 bg-white/5 px-4 py-3 text-xs text-zinc-400">
            <div className="col-span-3">Date</div>
            <div className="col-span-4">Merchant</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="divide-y divide-white/10">
            {filtered.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
                <div className="col-span-3 text-zinc-300">{r.date}</div>
                <div className="col-span-4 font-medium">{r.merchant}</div>
                <div className="col-span-3 text-zinc-300">{r.category}</div>
                <div className={`col-span-2 text-right ${r.type === 'Expense' ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {r.type === 'Expense' ? '-' : '+'} {formatINR(r.amount)}
                </div>
              </div>
            ))}
            {!filtered.length ? <div className="px-4 py-6 text-sm text-zinc-400">No transactions found.</div> : null}
          </div>
        </div>
      </Card>
    </div>
  )
}

