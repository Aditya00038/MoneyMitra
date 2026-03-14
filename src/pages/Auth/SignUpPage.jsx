import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import AuthShell from './AuthShell'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(err?.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get your VitalScore and start building better saving habits."
      footer={
        <>
          Already have an account?{' '}
          <Link className="text-white underline underline-offset-4" to="/signin">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <div className="mb-1 text-xs text-zinc-400">Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        </div>
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-zinc-400">Password</div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400">Confirm Password</div>
            <Input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>
        </div>

        {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        <Button disabled={loading} className="w-full" size="lg">
          {loading ? 'Creating...' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}

