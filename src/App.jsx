import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth.jsx'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import SignInPage from './pages/Auth/SignInPage.jsx'
import SignUpPage from './pages/Auth/SignUpPage.jsx'
import OnboardingPage from './pages/Onboarding/OnboardingPage.jsx'
import AppShell from './shell/AppShell.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import TransactionsPage from './pages/Transactions/TransactionsPage.jsx'
import AutoDetectionPage from './pages/AutoDetection/AutoDetectionPage.jsx'
import SavingsGoalsPage from './pages/SavingsGoals/SavingsGoalsPage.jsx'
import BudgetPlannerPage from './pages/BudgetPlanner/BudgetPlannerPage.jsx'
import WalletPage from './pages/Wallet/WalletPage.jsx'
import AIInsightsPage from './pages/AIInsights/AIInsightsPage.jsx'
import NotificationsPage from './pages/Notifications/NotificationsPage.jsx'
import ProfilePage from './pages/Profile/ProfilePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/auto-detection" element={<AutoDetectionPage />} />
          <Route path="/savings-goals" element={<SavingsGoalsPage />} />
          <Route path="/budget-planner" element={<BudgetPlannerPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
