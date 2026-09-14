import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { Button, Input, FormField } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { ShieldAlert, Lock, Mail, Eye, EyeOff, Server } from 'lucide-react'

export function SuperAdminLoginPage() {
  const navigate = useNavigate()
  const { superAdminSignIn, isAuthenticated, role } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // If already authenticated as Super Admin, redirect to portal dashboard
  useEffect(() => {
    if (isAuthenticated && role === 'super_admin') {
      navigate('/super-admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const validate = () => {
    const errs: { email?: string; password?: string } = {}
    if (!email) errs.email = 'Super Admin email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    const res = await superAdminSignIn(email, password)
    setIsLoading(false)

    if (res.error) {
      toast({ type: 'error', title: 'Authentication Failed', description: res.error })
      return
    }

    toast({ type: 'success', title: 'Super Admin Authenticated', description: 'Welcome to Platform Portal.' })
    navigate('/super-admin/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border/80 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600/10 text-indigo-600 p-3 rounded-xl border border-indigo-200/60">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-ink-900">Platform Control</h1>
            <p className="text-xs text-ink-400 font-medium">Super Admin Access Portal</p>
          </div>
        </div>

        <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <Server className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            This entrance is strictly restricted to Multi-College System Administrators. High-level authorization required.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Super Admin Email" htmlFor="super-email" error={errors.email}>
            <Input
              id="super-email"
              type="email"
              placeholder="superadmin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              error={!!errors.email}
            />
          </FormField>

          <FormField label="Password" htmlFor="super-password" error={errors.password}>
            <div className="relative">
              <Input
                id="super-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                error={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            Authenticate Super Admin
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-border pt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
          >
            ← Return to Normal College Login
          </button>
        </div>
      </div>
    </div>
  )
}
