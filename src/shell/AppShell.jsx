import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell,
  Bolt,
  Brain,
  CreditCard,
  Gauge,
  Goal,
  LayoutDashboard,
  LogOut,
  Receipt,
  User,
  Wallet,
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { cn } from '../lib/cn'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/auto-detection', label: 'Auto Detection', icon: Bolt },
  { to: '/savings-goals', label: 'Savings Goals', icon: Goal },
  { to: '/budget-planner', label: 'Budget Planner', icon: Gauge },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/ai-insights', label: 'AI Insights', icon: Brain },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  async function onLogout() {
    await signOut(auth)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-dvh max-w-7xl">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-zinc-950/60 p-4 backdrop-blur md:flex">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-4">MoneyMitra</div>
              <div className="text-xs text-zinc-400">AI Financial Companion</div>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4 opacity-90" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto pt-3">
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 md:hidden">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">MoneyMitra</div>
                  <div className="text-xs text-zinc-400">
                    {location.pathname.replace('/', '').replace('-', ' ') || 'home'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                      isActive
                        ? 'border-white/15 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10',
                    )
                  }
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alerts</span>
                </NavLink>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 md:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto w-full max-w-7xl px-4 py-6"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

