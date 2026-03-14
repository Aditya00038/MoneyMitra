import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, PlusCircle } from 'lucide-react'
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

export default function WalletPage() {
  const navigate = useNavigate()
  const { wallet, totals, connectWallet, addWalletDeposit } = useFinance()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false)
  const [amount, setAmount] = useState('')
  const providerLabel = wallet?.provider || 'Razorpay'

  async function onAddMoney(e) {
    e.preventDefault()
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Enter a valid amount.')
      return
    }

    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      toast.error('Razorpay checkout could not be loaded.')
      return
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!key) {
      toast.error('Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in .env.local.')
      return
    }

    const paid = await new Promise((resolve) => {
      const instance = new window.Razorpay({
        key,
        amount: Math.round(parsedAmount * 100),
        currency: 'INR',
        name: 'MoneyMitra',
        description: 'Wallet Top-up',
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

    const result = addWalletDeposit(parsedAmount)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    setAmount('')
    setShowAddMoneyForm(false)
    toast.success('Money added successfully to your wallet.')
  }

  function handleConnect(provider) {
    connectWallet(provider)
    setShowConnectModal(false)
    toast.success(`${provider} connected successfully.`)
  }

  if (!wallet?.connected) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Wallet</CardTitle>
              <CardDescription>No bank or wallet connected</CardDescription>
            </div>
            <Button variant="soft" onClick={() => setShowConnectModal(true)}>
              Connect Your Bank / Wallet
            </Button>
          </CardHeader>
        </Card>

        {showConnectModal ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
              <div className="text-lg font-semibold">Connect Bank / Wallet</div>
              <div className="mt-1 text-sm text-zinc-400">Choose a provider to connect.</div>
              <div className="mt-4 grid gap-2">
                <Button variant="soft" onClick={() => handleConnect('Razorpay')}>
                  Razorpay Wallet
                </Button>
                <Button variant="ghost" onClick={() => handleConnect('Demo Bank Account')}>
                  Demo Bank Account
                </Button>
                <Button variant="ghost" onClick={() => setShowConnectModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Connected wallet and available balance</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="soft" onClick={() => setShowAddMoneyForm((prev) => !prev)}>
              <PlusCircle className="h-4 w-4" />
              Add money
            </Button>
            <Button variant="ghost" onClick={() => navigate('/savings-goals')}>
              <ArrowLeftRight className="h-4 w-4" />
              Transfer to savings
            </Button>
            <Button variant="ghost" onClick={() => navigate('/transactions')}>
              View Transactions
            </Button>
          </div>
        </CardHeader>

        {showAddMoneyForm ? (
          <form onSubmit={onAddMoney} className="mb-4 grid gap-3 md:grid-cols-3">
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              inputMode="numeric"
            />
            <div className="flex gap-2 md:justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowAddMoneyForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="soft">
                Pay & Add
              </Button>
            </div>
          </form>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Provider</div>
            <div className="mt-1 text-2xl font-semibold">{providerLabel}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Wallet Balance</div>
            <div className="mt-1 text-2xl font-semibold">{formatINR(totals.walletBalance)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Razorpay Deposits</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-300">{formatINR(totals.razorpayDeposits)}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

