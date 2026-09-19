import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { Button, Input, FormField } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  ShieldAlert,
  UserPlus,
  ChevronRight,
  Calendar,
  FileText,
  Coins,
  MessageSquare,
  BarChart3,
  Building2,
} from 'lucide-react'
import type { UserRole, CollegeRegistrationPayload } from '../../types/domain'

interface RoleOption {
  value: UserRole
  label: string
  subtitle: string
  bgClass: string
  borderClass: string
  activeClass: string
  iconBg: string
  iconColor: string
  icon: React.ElementType
}

const roleOptions: RoleOption[] = [
  {
    value: 'admin',
    label: 'Admin',
    subtitle: 'Full system access',
    bgClass: 'bg-[#F0F7FF]',
    borderClass: 'border-[#BFDBFE]',
    activeClass: 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/70',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: ShieldCheck,
  },
  {
    value: 'teacher',
    label: 'Faculty / Teacher',
    subtitle: 'Manage classes & students',
    bgClass: 'bg-[#F0FDF4]',
    borderClass: 'border-[#BBF7D0]',
    activeClass: 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/70',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: GraduationCap,
  },
  {
    value: 'student',
    label: 'Student',
    subtitle: 'Access your academic details',
    bgClass: 'bg-[#FAF5FF]',
    borderClass: 'border-[#E9D5FF]',
    activeClass: 'ring-2 ring-purple-600 border-purple-500 bg-purple-50/70',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: BookOpen,
  },
  {
    value: 'parent',
    label: 'Parent',
    subtitle: "Track your child's progress",
    bgClass: 'bg-[#FFFBEB]',
    borderClass: 'border-[#FDE68A]',
    activeClass: 'ring-2 ring-amber-600 border-amber-500 bg-amber-50/70',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: Users,
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isAuthenticated, role } = useAuth()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [email, setEmail] = useState('admin@school.edu')
  const [password, setPassword] = useState('password123')
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

  const handleRoleSelect = (newRole: UserRole) => {
    setSelectedRole(newRole)
    if (newRole === 'admin') {
      setEmail('admin@school.edu')
    } else if (newRole === 'teacher') {
      setEmail('teacher@school.edu')
    } else if (newRole === 'student') {
      setEmail('student@school.edu')
    } else if (newRole === 'parent') {
      setEmail('parent@school.edu')
    }
    setPassword('password123')
  }

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
    <div className="h-screen w-full flex bg-[#EBF3FC] font-sans antialiased text-slate-800 overflow-hidden">
      {/* ===== Left Side Branding Panel ===== */}
      <div className="hidden lg:flex w-[50%] xl:w-[52%] flex-col justify-between p-8 xl:p-12 relative overflow-hidden bg-gradient-to-br from-[#EAF3FD] via-[#E2EEFC] to-[#D5E6F9] h-full">
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center text-2xl xl:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              <span>Eduth</span>
              <span className="text-[#4F46E5]">Flow</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide -mt-0.5">
              College Management System
            </p>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="relative z-10 my-auto py-2">
          <h1 className="text-3xl xl:text-[40px] font-black text-[#0F172A] leading-[1.12] tracking-tight">
            Smarter Campus.<br />
            <span>Better Tomorrow.</span>
          </h1>
          <p className="text-slate-600 text-sm xl:text-base max-w-md font-normal leading-relaxed mt-3">
            Streamline your college operations with a powerful, all-in-one management system.
          </p>

          {/* 6 Feature Badges (2x3 Grid) */}
          <div className="grid grid-cols-2 gap-2.5 max-w-md mt-6">
            <div className="bg-[#EEF2FF] border border-[#E0E7FF] text-[#3730A3] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] shrink-0">
                <Users className="h-3 w-3" />
              </div>
              <span className="truncate">Student Management</span>
            </div>

            <div className="bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B21B6] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#DDD6FE] flex items-center justify-center text-[#6D28D9] shrink-0">
                <Calendar className="h-3 w-3" />
              </div>
              <span className="truncate">Attendance & Classes</span>
            </div>

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0">
                <FileText className="h-3 w-3" />
              </div>
              <span className="truncate">Exams & Results</span>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
                <Coins className="h-3 w-3" />
              </div>
              <span className="truncate">Fees & Accounts</span>
            </div>

            <div className="bg-[#FDF2F8] border border-[#FBCFE8] text-[#9D174D] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#FCE7F3] flex items-center justify-center text-[#BE185D] shrink-0">
                <MessageSquare className="h-3 w-3" />
              </div>
              <span className="truncate">Communication</span>
            </div>

            <div className="bg-[#ECFEFF] border border-[#A5F3FC] text-[#155E75] px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#CFFAFE] flex items-center justify-center text-[#0E7490] shrink-0">
                <BarChart3 className="h-3 w-3" />
              </div>
              <span className="truncate">Reports & Analytics</span>
            </div>
          </div>
        </div>

        {/* Campus Building Graphic at Bottom Left */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-white/80 group shrink-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
            alt="EduthFlow Campus"
            className="w-full h-40 xl:h-44 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E40AF]/85 via-[#2563EB]/25 to-transparent flex flex-col justify-end p-4">
            <div className="relative z-10">
              <p className="font-['Caveat',cursive] text-xl xl:text-2xl text-white font-bold tracking-wider drop-shadow-md">
                Manage • Track • Grow
              </p>
              <div className="w-32 h-0.5 bg-gradient-to-r from-white via-white/80 to-transparent rounded-full mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Right Side Login Panel ===== */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 h-full overflow-y-auto">
        <div className="w-full max-w-[580px] xl:max-w-[620px] bg-white rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-6 xl:p-8 relative my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-4 justify-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#0F172A]">
                <span>Eduth</span><span className="text-indigo-600">Flow</span>
              </div>
            </div>
          </div>

          {/* Top Graduation Cap Icon & Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center mb-2.5 shadow-2xs">
              <GraduationCap className="h-8 w-8 stroke-[2.2]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-xs xl:text-sm mt-0.5 font-medium">Select your role and enter credentials to sign in</p>
          </div>

          {/* 2x2 Grid of Selectable Role Cards (Spacious & Matching Reference Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
            {roleOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = selectedRole === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRoleSelect(opt.value)}
                  className={`p-4 rounded-2xl border transition-all duration-200 text-left flex items-center justify-between cursor-pointer group relative ${
                    isSelected
                      ? `${opt.activeClass} shadow-md`
                      : `${opt.bgClass} ${opt.borderClass} opacity-85 hover:opacity-100 hover:shadow-md hover:border-slate-300`
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${opt.iconBg} ${opt.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs xl:text-sm text-slate-800 truncate">
                        {opt.label}
                      </div>
                      <p className="text-[10px] xl:text-[11px] text-slate-500 truncate mt-0.5">{opt.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Login Inputs Form (Shown Directly on Front Page) */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <FormField label="Email address" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                placeholder="email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4 text-slate-400" />}
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4 text-slate-400" />}
                  error={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                Forgot password?
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/20">
              Sign in to Dashboard
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">OR</span>
          </div>

          {/* Compact Register New College Button */}
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-xs xl:text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors truncate">
                Register New College
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Register</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
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
