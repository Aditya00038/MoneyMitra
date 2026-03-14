import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAuth() {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) return null
  if (!user) return <Navigate to="/signin" replace state={{ from: location }} />
  return <Outlet />
}

