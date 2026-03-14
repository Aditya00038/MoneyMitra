import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getProfile, getWallet, setWallet } from '../lib/storage'
import { db } from '../lib/firebase'
import { useAuth } from '../auth/AuthContext.jsx'

const FinanceContext = createContext(null)

const defaultWallet = {
  connected: false,
  provider: '',
  startingBalance: 0,
  razorpayDeposits: 0,
}

function normalizeWallet(wallet) {
  return {
    connected: Boolean(wallet?.connected),
    provider: wallet?.provider || '',
    startingBalance: Number(wallet?.startingBalance) || 0,
    razorpayDeposits: Number(wallet?.razorpayDeposits) || 0,
  }
}

function normalizeTransaction(tx) {
  return {
    id: tx?.id || crypto.randomUUID(),
    date: tx?.date || new Date().toISOString().slice(0, 10),
    merchant: tx?.merchant || '',
    category: tx?.category || 'Other',
    type: tx?.type === 'Income' ? 'Income' : 'Expense',
    amount: Number(tx?.amount) || 0,
  }
}

function normalizeGoal(goal) {
  return {
    id: goal?.id || crypto.randomUUID(),
    name: goal?.name || '',
    target: Number(goal?.target) || 0,
    saved: Number(goal?.saved) || 0,
  }
}

function normalizeBudget(budget) {
  return {
    id: budget?.id || crypto.randomUUID(),
    category: budget?.category || 'Other',
    limit: Number(budget?.limit) || 0,
  }
}

function computeWalletMetrics(transactions, wallet) {
  let incomeTransactions = 0
  let expenseTransactions = 0
  let savingsTransfers = 0

  for (const tx of transactions) {
    const amount = Number(tx.amount) || 0
    if (tx.type === 'Income') {
      incomeTransactions += amount
      continue
    }

    if (tx.category === 'Savings Transfer') {
      savingsTransfers += amount
      continue
    }

    expenseTransactions += amount
  }

  const startingBalance = Number(wallet?.startingBalance) || 0
  const razorpayDeposits = Number(wallet?.razorpayDeposits) || 0
  const walletBalance = startingBalance + razorpayDeposits + incomeTransactions - expenseTransactions - savingsTransfers

  return {
    startingBalance,
    razorpayDeposits,
    incomeTransactions,
    expenseTransactions,
    savingsTransfers,
    walletBalance,
  }
}

export function FinanceProvider({ children }) {
  const { user, ready } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [budgets, setBudgets] = useState([])
  const [wallet, setWalletState] = useState(() => normalizeWallet(getWallet() || defaultWallet))
  const [financeReady, setFinanceReady] = useState(false)

  useEffect(() => {
    setWallet(wallet)
  }, [wallet])

  useEffect(() => {
    let cancelled = false

    async function loadFinanceState() {
      if (!ready) return

      if (!user) {
        if (cancelled) return
        setTransactions([])
        setGoals([])
        setBudgets([])
        setWalletState(normalizeWallet(getWallet() || defaultWallet))
        setFinanceReady(true)
        return
      }

      setFinanceReady(false)

      try {
        const ref = doc(db, 'finance', user.uid)
        const snapshot = await getDoc(ref)

        if (cancelled) return

        if (snapshot.exists()) {
          const data = snapshot.data()
          setTransactions(Array.isArray(data?.transactions) ? data.transactions.map(normalizeTransaction) : [])
          setGoals(Array.isArray(data?.goals) ? data.goals.map(normalizeGoal) : [])
          setBudgets(Array.isArray(data?.budgets) ? data.budgets.map(normalizeBudget) : [])
          setWalletState(normalizeWallet(data?.wallet || getWallet() || defaultWallet))
        } else {
          setTransactions([])
          setGoals([])
          setBudgets([])
          setWalletState(normalizeWallet(getWallet() || defaultWallet))
        }
      } catch (error) {
        console.error('Failed to load finance data from Firestore.', error)
      } finally {
        if (!cancelled) setFinanceReady(true)
      }
    }

    loadFinanceState()

    return () => {
      cancelled = true
    }
  }, [ready, user])

  useEffect(() => {
    if (!ready || !user || !financeReady) return

    const ref = doc(db, 'finance', user.uid)
    const payload = {
      wallet: normalizeWallet(wallet),
      goals: goals.map(normalizeGoal),
      transactions: transactions.map(normalizeTransaction),
      budgets: budgets.map(normalizeBudget),
      updatedAt: serverTimestamp(),
    }

    setDoc(ref, payload, { merge: true }).catch((error) => {
      console.error('Failed to save finance data to Firestore.', error)
    })
  }, [ready, user, financeReady, wallet, goals, transactions, budgets])

  function getWalletBalanceSnapshot() {
    return computeWalletMetrics(transactions, wallet).walletBalance
  }

  function connectWallet(provider) {
    const providerName = provider || 'Razorpay'
    setWalletState({
      connected: true,
      provider: providerName,
      startingBalance: 0,
      razorpayDeposits: 0,
    })
  }

  function addWalletDeposit(amount) {
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      return { ok: false, message: 'Enter a valid amount.' }
    }

    if (!wallet.connected) {
      return { ok: false, message: 'Connect your wallet first.' }
    }

    setWalletState((prev) => ({
      ...prev,
      razorpayDeposits: (Number(prev.razorpayDeposits) || 0) + parsedAmount,
    }))

    return { ok: true, amount: parsedAmount }
  }

  function addTransaction(tx) {
    const base = {
      id: crypto.randomUUID(),
      date: tx.date || new Date().toISOString().slice(0, 10),
      merchant: tx.merchant || '',
      category: tx.category || 'Other',
      type: tx.type || 'Expense',
      amount: Number(tx.amount) || 0,
    }
    setTransactions((prev) => [base, ...prev])
  }

  function addGoal(goal) {
    setGoals((prev) => [
      {
        id: crypto.randomUUID(),
        name: goal.name || '',
        target: Number(goal.target) || 0,
        saved: Number(goal.saved) || 0,
      },
      ...prev,
    ])
  }

  function addToGoal(id, amount) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + (Number(amount) || 0)) } : g)),
    )
  }

  function transferToGoal(id, amount) {
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      return { ok: false, message: 'Enter a valid amount.' }
    }

    const goal = goals.find((g) => g.id === id)
    if (!goal) {
      return { ok: false, message: 'Goal not found.' }
    }

    const walletBalance = getWalletBalanceSnapshot()
    if (parsedAmount > walletBalance) {
      return { ok: false, message: 'Insufficient wallet balance.' }
    }

    const remaining = Math.max(0, (Number(goal.target) || 0) - (Number(goal.saved) || 0))
    const transferAmount = Math.min(parsedAmount, remaining)

    if (!transferAmount) {
      return { ok: false, message: 'Goal is already fully funded.' }
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + transferAmount) } : g)),
    )

    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        merchant: `Transfer to ${goal.name}`,
        category: 'Savings Transfer',
        type: 'Expense',
        amount: transferAmount,
      },
      ...prev,
    ])

    return { ok: true, amount: transferAmount, goalName: goal.name }
  }

  function withdrawFromGoal(id, amount) {
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      return { ok: false, message: 'Enter a valid amount.' }
    }

    const goal = goals.find((g) => g.id === id)
    if (!goal) {
      return { ok: false, message: 'Goal not found.' }
    }

    const savedAmount = Number(goal.saved) || 0
    if (parsedAmount > savedAmount) {
      return { ok: false, message: 'Cannot withdraw more than saved amount.' }
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: Math.max(0, (Number(g.saved) || 0) - parsedAmount) } : g)),
    )

    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        merchant: `Withdraw from ${goal.name}`,
        category: 'Savings',
        type: 'Income',
        amount: parsedAmount,
      },
      ...prev,
    ])

    return { ok: true, amount: parsedAmount, goalName: goal.name }
  }

  function addBudget(budget) {
    setBudgets((prev) => [
      {
        id: crypto.randomUUID(),
        category: budget.category || 'Other',
        limit: Number(budget.limit) || 0,
      },
      ...prev,
    ])
  }

  const totals = useMemo(() => {
    const walletMetrics = computeWalletMetrics(transactions, wallet)
    let expenses = walletMetrics.expenseTransactions + walletMetrics.savingsTransfers
    const categoryMap = new Map()

    for (const tx of transactions) {
      const amount = Number(tx.amount) || 0
      if (tx.type === 'Expense' && tx.category !== 'Savings Transfer') {
        const prev = categoryMap.get(tx.category) || 0
        categoryMap.set(tx.category, prev + amount)
      }
    }

    const income = walletMetrics.incomeTransactions
    const walletBalance = walletMetrics.walletBalance
    const categories = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))

    const profile = getProfile()
    const monthlyIncome = income || profile?.monthlyIncome || 0
    const monthlySavingsGoal = profile?.monthlySavingsGoal || 0
    const savings = Math.max(0, walletBalance)

    const vitalScore = monthlyIncome
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(55 + (savings / Math.max(1, monthlySavingsGoal || monthlyIncome * 0.2)) * 25),
          ),
        )
      : 50

    const status = vitalScore >= 80 ? 'Excellent' : vitalScore >= 65 ? 'Good' : vitalScore >= 45 ? 'Okay' : 'Needs Work'

    return {
      income,
      expenses,
      walletBalance,
      startingBalance: walletMetrics.startingBalance,
      razorpayDeposits: walletMetrics.razorpayDeposits,
      savingsTransfers: walletMetrics.savingsTransfers,
      categories,
      monthlyIncome,
      monthlySavingsGoal,
      savings,
      vitalScore,
      status,
    }
  }, [transactions, wallet])

  const budgetsWithSpend = useMemo(() => {
    return budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.type === 'Expense' && t.category === b.category)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
      return { ...b, spent }
    })
  }, [budgets, transactions])

  const value = {
    transactions,
    addTransaction,
    wallet,
    connectWallet,
    addWalletDeposit,
    goals,
    addGoal,
    addToGoal,
    transferToGoal,
    withdrawFromGoal,
    budgets: budgetsWithSpend,
    addBudget,
    financeReady,
    totals,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}

