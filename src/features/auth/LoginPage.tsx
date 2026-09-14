import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { Button, Input, FormField } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { Mail, Lock, Eye, EyeOff, School, ShieldCheck, GraduationCap, BookOpen, Users, ShieldAlert, UserPlus } from 'lucide-react'
import type { UserRole, CollegeRegistrationPayload } from '../../types/domain'

const roles: { value: UserRole; label: string; icon: React.ElementType }[] = [
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
  { value: 'teacher', label: 'Teacher', icon: GraduationCap },
  { value: 'student', label: 'Student', icon: BookOpen },
  { value: 'parent', label: 'Parent', icon: Users },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isAuthenticated, role } = useAuth()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      const normRole = role.toLowerCase() === 'superadmin' ? 'super_admin' : role.toLowerCase()
      if (normRole === 'super_admin') {
        navigate('/super-admin/dashboard', { replace: true })
      } else {
        navigate(`/${normRole}/dashboard`, { replace: true })
      }
    }
  }, [isAuthenticated, role, navigate])

  const validate = () => {
    const errs: { email?: string; password?: string } = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email || password) {
      if (!validate()) return
    }
    const loginEmail = email || `${selectedRole}@school.edu`
    const loginPassword = password || 'password123'

    setIsLoading(true)
    const res = await signIn(loginEmail, loginPassword, selectedRole)
    setIsLoading(false)

    if (res.error) {
      toast({ type: 'error', title: 'Login failed', description: res.error })
      return
    }

    const rawRole = (res.user?.role || selectedRole).toLowerCase()
    const targetRoute = rawRole === 'superadmin' || rawRole === 'super_admin' ? '/super-admin/dashboard' : `/${rawRole}/dashboard`
    toast({ type: 'success', title: 'Welcome back!' })
    navigate(targetRoute, { replace: true })
  }


  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-[var(--radius-btn)] border border-white/20 shadow-sm">
              <School className="h-6 w-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">EduFlow</span>
          </div>

          {/* Hero text */}
          <div className="my-auto py-12">
            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-4 tracking-tight">
              Manage your school with confidence
            </h1>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              The all-in-one platform unifying administration, faculty, and families into a single, intuitive experience.
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-indigo-200" />
              <span>2,847 Students</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-indigo-200" />
              <span>184 Teachers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
              <School className="h-4 w-4 text-indigo-200" />
              <span>12 Schools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-canvas">
        <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border/80 shadow-[var(--shadow-soft)]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-brand-600 text-white p-2 rounded-[var(--radius-btn)]">
              <School className="h-6 w-6" />
            </div>
            <span className="text-xl font-display font-bold text-brand-600">EduFlow</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-ink-900 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-ink-400 text-sm mb-6">Please select your role and sign in to continue.</p>

          {/* Role selector tiles - 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedRole(value)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-[var(--radius-card)] border transition-all duration-150 cursor-pointer ${
                  selectedRole === value
                    ? 'border-brand-600 bg-brand-100/70 text-brand-600 font-semibold shadow-2xs'
                    : 'border-border text-ink-600 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${selectedRole === value ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email address" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                error={!!errors.email}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password}
            >
              <div className="relative">
                <Input
                  id="password"
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

            <div className="flex justify-end">
              <button type="button" className="text-xs text-brand-600 hover:text-brand-700 cursor-pointer">
                Forgot password?
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign in as {roles.find(r => r.value === selectedRole)?.label}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            New school?{' '}
            <button
              onClick={() => setShowRegisterModal(true)}
              className="text-brand-600 font-medium hover:text-brand-700 cursor-pointer"
            >
              Register School
            </button>
          </p>
        </div>
      </div>

      {/* Register College Flow Modal (Super Admin Verification + Registration) */}
      <RegisterCollegeModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </div>
  )
}

// ===== Register College Flow Modal (Requires Super Admin Verification first) =====
function RegisterCollegeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { verifySuperAdmin, registerCollege } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState<'verify' | 'register'>('verify')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // Super Admin Credentials State
  const [superEmail, setSuperEmail] = useState('')
  const [superPass, setSuperPass] = useState('')
  const [verifyError, setVerifyError] = useState('')

  // College & Admin Payload State
  const [formData, setFormData] = useState<CollegeRegistrationPayload>({
    college_name: '',
    college_code: '',
    official_email: '',
    official_phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_phone: '',
  })

  const resetModalState = () => {
    setStep('verify')
    setSuperEmail('')
    setSuperPass('')
    setVerifyError('')
    setFormData({
      college_name: '',
      college_code: '',
      official_email: '',
      official_phone: '',
      address: '',
      city: '',
      state: '',
      country: 'USA',
      admin_name: '',
      admin_email: '',
      admin_password: '',
      admin_phone: '',
    })
  }

  const handleClose = () => {
    resetModalState()
    onClose()
  }

  const handleVerifySuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyError('')
    if (!superEmail || !superPass) {
      setVerifyError('Super Admin credentials are required to register a new college.')
      return
    }

    setIsVerifying(true)
    const isValid = await verifySuperAdmin(superEmail, superPass)
    setIsVerifying(false)

    if (isValid) {
      toast({ type: 'success', title: 'Super Admin Verified', description: 'Proceeding to College Registration.' })
      setStep('register')
    } else {
      setVerifyError('Invalid Super Admin email or password.')
    }
  }

  const handleRegisterCollege = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.college_name || !formData.official_email || !formData.admin_name || !formData.admin_email) {
      toast({ type: 'error', title: 'Missing required fields', description: 'Please fill in all mandatory fields.' })
      return
    }

    setIsRegistering(true)
    const res = await registerCollege(formData, superEmail, superPass)
    setIsRegistering(false)

    if (res.error) {
      toast({ type: 'error', title: 'Registration Failed', description: res.error })
      return
    }

    toast({
      type: 'success',
      title: 'College Registered Successfully!',
      description: `${res.college?.name} (${res.college?.id}) created. Admin: ${res.admin?.email}`,
    })
    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'verify' ? 'Super Admin Authorization Required' : 'Register New College Institution'}
      subtitle={
        step === 'verify'
          ? 'Only a verified Super Admin can register a new college.'
          : 'Set up your institutional college and initial College Admin.'
      }
      size="md"
      footer={
        step === 'verify' ? (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button isLoading={isVerifying} onClick={handleVerifySuperAdmin}>
              Verify & Continue
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setStep('verify')}>
              Back
            </Button>
            <Button isLoading={isRegistering} onClick={handleRegisterCollege}>
              Create College & Admin
            </Button>
          </>
        )
      }
    >
      {step === 'verify' ? (
        <form onSubmit={handleVerifySuperAdmin} className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 mb-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Per system security rules, creating a new college requires Super Admin verification. Enter Super Admin credentials below.
            </span>
          </div>

          {verifyError && <p className="text-xs font-medium text-rose-600">{verifyError}</p>}

          <FormField label="Super Admin Email" htmlFor="verify-super-email" required>
            <Input
              id="verify-super-email"
              type="email"
              placeholder="superadmin@example.com"
              value={superEmail}
              onChange={(e) => setSuperEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
          </FormField>

          <FormField label="Super Admin Password" htmlFor="verify-super-pass" required>
            <Input
              id="verify-super-pass"
              type="password"
              placeholder="••••••••"
              value={superPass}
              onChange={(e) => setSuperPass(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
            />
          </FormField>
        </form>
      ) : (
        <form onSubmit={handleRegisterCollege} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <FormField label="College Name" htmlFor="modal-col-name" required>
            <Input
              id="modal-col-name"
              placeholder="e.g. Lincoln College of Engineering"
              value={formData.college_name}
              onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="College Code" htmlFor="modal-col-code" required helperText="e.g. COL003">
              <Input
                id="modal-col-code"
                placeholder="COL003"
                value={formData.college_code}
                onChange={(e) => setFormData({ ...formData, college_code: e.target.value })}
              />
            </FormField>
            <FormField label="Official Phone" htmlFor="modal-col-phone" required>
              <Input
                id="modal-col-phone"
                placeholder="(555) 000-0000"
                value={formData.official_phone}
                onChange={(e) => setFormData({ ...formData, official_phone: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Official Email" htmlFor="modal-col-email" required>
            <Input
              id="modal-col-email"
              type="email"
              placeholder="admin@lincolncollege.edu"
              value={formData.official_email}
              onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
            />
          </FormField>

          <FormField label="Address" htmlFor="modal-col-address" required>
            <Input
              id="modal-col-address"
              placeholder="Campus Full Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </FormField>

          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 font-display font-semibold text-xs uppercase tracking-wider">
              <UserPlus className="h-4 w-4" />
              <span>Initial College Admin Account</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Admin Name" htmlFor="modal-admin-name" required>
                <Input
                  id="modal-admin-name"
                  placeholder="Jane Doe"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                />
              </FormField>
              <FormField label="Admin Phone" htmlFor="modal-admin-phone">
                <Input
                  id="modal-admin-phone"
                  placeholder="Mobile number"
                  value={formData.admin_phone}
                  onChange={(e) => setFormData({ ...formData, admin_phone: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Admin Email" htmlFor="modal-admin-email" required className="mt-3">
              <Input
                id="modal-admin-email"
                type="email"
                placeholder="jane.admin@lincolncollege.edu"
                value={formData.admin_email}
                onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
              />
            </FormField>

            <FormField label="Temporary Password" htmlFor="modal-admin-pass" helperText="Min 8 characters." className="mt-3">
              <Input
                id="modal-admin-pass"
                type="password"
                placeholder="••••••••"
                value={formData.admin_password}
                onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
              />
            </FormField>
          </div>
        </form>
      )}
    </Modal>
  )
}
