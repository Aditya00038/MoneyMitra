import { useMemo, useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getProfile, setProfile } from '../../lib/storage'

export default function ProfilePage() {
  const stored = useMemo(() => getProfile(), [])
  const [name, setName] = useState(auth.currentUser?.displayName || '')
  const [email] = useState(auth.currentUser?.email || '')
  const [income, setIncome] = useState(stored?.monthlyIncome ?? 20000)
  const [goal, setGoal] = useState(stored?.monthlySavingsGoal ?? 5000)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      if (auth.currentUser && name.trim() !== (auth.currentUser.displayName || '')) {
        await updateProfile(auth.currentUser, { displayName: name.trim() })
      }
      setProfile({
        monthlyIncome: Number(income) || 0,
        monthlySavingsGoal: Number(goal) || 0,
        preferredCategories: stored?.preferredCategories ?? ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment'],
        updatedAt: Date.now(),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={onSave} className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-zinc-400">Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400">Email</div>
            <Input value={email} readOnly className="opacity-80" />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400">Monthly Income</div>
            <Input value={income} onChange={(e) => setIncome(e.target.value)} inputMode="numeric" />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400">Savings Preference (Goal)</div>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} inputMode="numeric" />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" variant="soft" disabled={saving}>
              {saving ? 'Saving...' : 'Update profile'}
            </Button>
            {saved ? <div className="text-sm text-emerald-300">Saved.</div> : null}
          </div>
        </form>
      </Card>
    </div>
  )
}

