import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatINR } from '../../lib/demoData'
import { useFinance } from '../../finance/FinanceContext.jsx'

let razorpayScriptPromise = null

function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  if (razorpayScriptPromise) return razorpayScriptPromise

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return razorpayScriptPromise
}

export default function SavingsGoalsPage() {
  const { goals, totals, addGoal: createGoal, transferToGoal, withdrawFromGoal } = useFinance()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [goalAction, setGoalAction] = useState({})
  const [goalAmount, setGoalAmount] = useState({})

  function onSubmit(e) {
    e.preventDefault()
    const t = Number(target)
    if (!name.trim() || !t) return
    createGoal({ name: name.trim(), target: t })
    setName('')
    setTarget('')
  }

  async function handleAddMoney(goal) {
    const amount = Number(goalAmount[goal.id])
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }

    if (amount > (totals?.walletBalance || 0)) {
      toast.error('Insufficient wallet balance.')
      return
    }

    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      toast.error('Razorpay checkout could not be loaded.')
      return
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!key) {
      toast.error('Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in your .env.local file.')
      return
    }

    const amountInPaise = Math.round(amount * 100)
    const orderApi = import.meta.env.VITE_RAZORPAY_ORDER_API
    const checkoutOptions = {
      key,
      amount: amountInPaise,
      currency: 'INR',
      name: 'MoneyMitra',
      description: `Add money to ${goal.name}`,
      handler: () => {},
      modal: {
        ondismiss: () => {},
      },
    }

    if (orderApi) {
      try {
        const res = await fetch(orderApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `goal_${goal.id}_${Date.now()}`,
          }),
        })
        if (!res.ok) {
          toast.error('Failed to create Razorpay order from backend.')
          return
        }
        const order = await res.json()
        if (!order?.id || !order?.amount || !order?.currency) {
          toast.error('Invalid Razorpay order response from backend.')
          return
        }

        checkoutOptions.order_id = order.id
        checkoutOptions.amount = order.amount
        checkoutOptions.currency = order.currency
      } catch {
        toast.error('Unable to reach Razorpay order API.')
        return
      }
    }

    const paid = await new Promise((resolve) => {
      const instance = new window.Razorpay({
        ...checkoutOptions,
        handler: () => resolve(true),
        modal: {
          ondismiss: () => resolve(false),
        },
      })
      instance.open()
    })

    if (!paid) {
      toast.error('Payment was cancelled.')
      return
    }

    const result = transferToGoal(goal.id, amount)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    setGoalAmount((prev) => ({ ...prev, [goal.id]: '' }))
    setGoalAction((prev) => ({ ...prev, [goal.id]: null }))
    toast.success(`${formatINR(result.amount)} added to ${result.goalName} Goal.`)
  }

  function handleWithdraw(goal) {
    const amount = Number(goalAmount[goal.id])
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }

    const result = withdrawFromGoal(goal.id, amount)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    setGoalAmount((prev) => ({ ...prev, [goal.id]: '' }))
    setGoalAction((prev) => ({ ...prev, [goal.id]: null }))
    toast.success(`${formatINR(result.amount)} withdrawn back to wallet.`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>Track targets and build saving discipline</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name (e.g., Laptop)" />
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target amount (₹)" inputMode="numeric" />
          <Button type="submit" variant="soft">
            <Plus className="h-4 w-4" />
            Create goal
          </Button>
        </form>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {goals.map((g) => {
            const pct = Math.round((g.saved / Math.max(1, g.target)) * 100)
            return (
              <div key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{g.name}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Target: {formatINR(g.target)} • Saved: {formatINR(g.saved)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setGoalAction((prev) => ({ ...prev, [g.id]: 'add' }))}>
                      Add Money
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setGoalAction((prev) => ({ ...prev, [g.id]: 'withdraw' }))}
                    >
                      Withdraw Money
                    </Button>
                  </div>
                </div>
                {goalAction[g.id] ? (
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    <Input
                      value={goalAmount[g.id] || ''}
                      onChange={(e) => setGoalAmount((prev) => ({ ...prev, [g.id]: e.target.value }))}
                      placeholder={goalAction[g.id] === 'add' ? 'Amount to add' : 'Amount to withdraw'}
                      inputMode="numeric"
                    />
                    <Button
                      variant="soft"
                      onClick={() =>
                        goalAction[g.id] === 'add' ? handleAddMoney(g) : handleWithdraw(g)
                      }
                    >
                      {goalAction[g.id] === 'add' ? 'Pay & Add' : 'Confirm Withdraw'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setGoalAction((prev) => ({ ...prev, [g.id]: null }))
                        setGoalAmount((prev) => ({ ...prev, [g.id]: '' }))
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-zinc-400">Progress: {pct}%</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

