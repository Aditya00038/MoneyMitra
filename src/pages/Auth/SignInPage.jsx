import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import AuthShell from './AuthShell'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getProfile } from '../../lib/storage'

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const from = location.state?.from?.pathname
      const profile = getProfile()
      navigate(from || (profile ? '/dashboard' : '/onboarding'), { replace: true })
    } catch (err) {
      setError(err?.message || 'Failed to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <>
          Don’t have an account?{' '}
          <Link className="text-white underline underline-offset-4" to="/signup">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <div className="mb-1 text-xs text-zinc-400">Email</div>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            type="email"
            required
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-zinc-400">Password</div>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        <Button disabled={loading} className="w-full" size="lg">
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </AuthShell>
  )
}

