import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../app/providers/AuthProvider'
import type { UserRole } from '../types/domain'

interface RoleGuardProps {
  allow: UserRole[]
  requirePermission?: string
  children: React.ReactNode
}

/**
 * Route guard: redirects unauthenticated users to /login,
 * and authenticated users with wrong role to their own dashboard.
 * Super Admin is granted access across platform routes, but normal college users
 * cannot bypass permissions or access Super Admin routes.
 */
export function RoleGuard({ allow, requirePermission, children }: RoleGuardProps) {
  const { isAuthenticated, isLoading, role, hasPermission } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-canvas">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const normRole: UserRole | null = role
    ? role.toLowerCase() === 'superadmin'
      ? 'super_admin'
      : (role.toLowerCase() as UserRole)
    : null

  if (normRole) {
    if (normRole === 'super_admin') {
      return <>{children}</>
    }

    const targetDashboard = `/${normRole}/dashboard`
    const isAtOwnDashboard = location.pathname === targetDashboard || location.pathname === `/${normRole}`

    // Block normal college users from accessing super admin routes
    if ((allow as string[]).includes('super_admin')) {
      if (isAtOwnDashboard) return <>{children}</>
      return <Navigate to={targetDashboard} replace />
    }

    // Role check
    if (!allow.includes(normRole)) {
      if (isAtOwnDashboard) return <>{children}</>
      return <Navigate to={targetDashboard} replace />
    }

    // Permission check if specified
    if (requirePermission && !hasPermission(requirePermission)) {
      if (isAtOwnDashboard) return <>{children}</>
      return <Navigate to={targetDashboard} replace />
    }
  }

  return <>{children}</>
}

