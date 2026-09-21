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
  Users,
  ArrowRight,
  Building2,
  ShieldAlert,
  UserPlus,
  ChevronRight,
  Calendar,
  FileText,
  Coins,
  MessageSquare,
  BarChart3,
  User,
} from 'lucide-react'
import type { UserRole, CollegeRegistrationPayload } from '../../types/domain'

interface RoleOption {
  value: UserRole
  label: string
  subtitle: string
  bgClass: string
  borderClass: string
  activeBorderClass: string
  iconBg: string
  iconColor: string
  icon: React.ElementType
}

const roleOptions: RoleOption[] = [
  {
    value: 'admin',
    label: 'Admin',
    subtitle: 'Full system access',
    bgClass: 'bg-[#F0F6FF] dark:bg-blue-950/30',
    borderClass: 'border-[#D0E2FF] dark:border-blue-900/50',
    activeBorderClass: 'border-[#2563EB] dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-400/30 bg-[#E8F0FE] dark:bg-blue-900/40',
    iconBg: 'bg-[#2563EB]',
    iconColor: 'text-white',
    icon: ShieldCheck,
  },
  {
    value: 'teacher',
    label: 'Teacher',
    subtitle: 'Manage classes & students',
    bgClass: 'bg-[#F2FAF5] dark:bg-emerald-950/30',
    borderClass: 'border-[#D2F3E1] dark:border-emerald-900/50',
    activeBorderClass: 'border-[#16A34A] dark:border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-400/30 bg-[#E6F8ED] dark:bg-emerald-900/40',
    iconBg: 'bg-[#16A34A]',
    iconColor: 'text-white',
    icon: User,
  },
  {
    value: 'student',
    label: 'Student',
    subtitle: 'Access your academic details',
    bgClass: 'bg-[#F8F3FC] dark:bg-purple-950/30',
    borderClass: 'border-[#E8D8F8] dark:border-purple-900/50',
    activeBorderClass: 'border-[#9333EA] dark:border-purple-500 ring-2 ring-purple-500/20 dark:ring-purple-400/30 bg-[#F1E6FA] dark:bg-purple-900/40',
    iconBg: 'bg-[#9333EA]',
    iconColor: 'text-white',
    icon: GraduationCap,
  },
  {
    value: 'parent',
    label: 'Parent',
    subtitle: "Track your child's progress",
    bgClass: 'bg-[#FFF9EE] dark:bg-orange-950/30',
    borderClass: 'border-[#FDE3C7] dark:border-orange-900/50',
    activeBorderClass: 'border-[#EA580C] dark:border-orange-500 ring-2 ring-orange-500/20 dark:ring-orange-400/30 bg-[#FFF0DB] dark:bg-orange-900/40',
    iconBg: 'bg-[#EA580C]',
    iconColor: 'text-white',
    icon: User,
  },
]

const featureBadges = [
  { icon: Users, label: 'Student Management', bg: 'bg-blue-100/90 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
  { icon: Calendar, label: 'Attendance & Classes', bg: 'bg-purple-100/90 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' },
  { icon: FileText, label: 'Exams & Results', bg: 'bg-emerald-100/90 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' },
  { icon: Coins, label: 'Fees & Accounts', bg: 'bg-amber-100/90 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' },
  { icon: MessageSquare, label: 'Communication', bg: 'bg-pink-100/90 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400' },
  { icon: BarChart3, label: 'Reports & Analytics', bg: 'bg-cyan-100/90 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400' },
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
  const [isFormVisible, setIsFormVisible] = useState(true)

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
    setIsFormVisible(true)
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-[#EBF2FE] via-[#E4EDFF] to-[#DCE8FE] dark:from-[#090D16] dark:via-[#0F172A] dark:to-[#0B0F19] font-sans antialiased text-slate-800 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-200">
      
      {/* Soft Decorative Ambient Glowing Blurs */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Campus Building Photo Filling Entire Bottom-Left Section (NOT broken in grid) */}
      <div className="absolute bottom-0 left-0 w-[55%] h-[46%] max-h-[360px] -z-0 rounded-tr-[110px] hidden lg:block overflow-hidden shadow-2xl border-t border-r border-white/80 dark:border-slate-800 group">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80"
          alt="EduthFlow College Campus"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105 brightness-[1.08] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#1e3a8a]/30 to-transparent flex flex-col justify-end p-8">
          <div className="relative z-10 pb-1">
            <p className="font-serif italic text-2xl xl:text-3xl text-white font-bold tracking-wide drop-shadow-lg">
              Manage • Track • Grow
            </p>
            {/* Swoosh Underline SVG */}
            <svg className="w-48 h-3 text-white/90 mt-1" viewBox="0 0 200 12" fill="none">
              <path d="M 5 7 Q 100 13 195 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ===== Left Side Branding & Feature Overview ===== */}
      <div className="w-full lg:w-[52%] xl:w-[54%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 z-10 min-h-screen">
        <div>
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <GraduationCap className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center text-2xl xl:text-3xl font-extrabold tracking-tight">
                <span className="text-[#0F172A] dark:text-white">Eduth</span>
                <span className="text-[#4F46E5] dark:text-indigo-400">Flow</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide -mt-0.5">
                College Management System
              </p>
            </div>
          </div>

          {/* Hero Headlines (Smarter Campus. Better Tomorrow.) */}
          <div className="mt-7 xl:mt-9">
            <h1 className="text-3xl sm:text-4xl xl:text-[42px] font-black text-[#0F172A] dark:text-white leading-[1.15] tracking-tight">
              Smarter Campus.<br />Better Tomorrow.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg font-normal leading-relaxed mt-3">
              Streamline your college operations with a powerful, all-in-one management system.
            </p>
          </div>

          {/* 6 Feature Pill Cards (2 cols x 3 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 max-w-xl">
            {featureBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-white/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl ${badge.bg} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {badge.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Tagline for Mobile / Small Screens */}
        <div className="mt-8 lg:hidden relative rounded-2xl overflow-hidden shadow-lg border border-white/60 dark:border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
            alt="EduthFlow College Campus"
            className="w-full h-36 object-cover object-center brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#1E3A8A]/40 to-transparent flex flex-col justify-end p-4">
            <p className="font-serif italic text-xl text-white font-bold tracking-wide">
              Manage • Track • Grow
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right Side White Card Container ===== */}
      <div className="w-full lg:w-[48%] xl:w-[46%] flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 my-auto">
        <div className="w-full max-w-[500px] xl:max-w-[540px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 xl:p-9 relative transition-colors duration-200">
          
          {/* Header Mortarboard Icon & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mb-3 shadow-md shadow-blue-500/25">
              <GraduationCap className="h-8 w-8 stroke-[2.2]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Choose your role to login to your account
            </p>
          </div>

          {/* 4 Selectable Role Cards in 2x2 Grid inside the Right Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
            {roleOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = selectedRole === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRoleSelect(opt.value)}
                  className={`p-4 rounded-2xl border text-left relative transition-all duration-200 cursor-pointer flex items-center justify-between group h-[76px] ${
                    isSelected
                      ? `${opt.activeBorderClass} shadow-md scale-[1.02]`
                      : `${opt.bgClass} ${opt.borderClass} hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600`
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${opt.iconBg} ${opt.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
                      <Icon className="h-5.5 w-5.5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug">
                        {opt.label}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4.5 w-4.5 shrink-0 transition-transform ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5'}`} />
                </button>
              )
            })}
          </div>

          {/* OR Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              OR
            </span>
          </div>

          {/* Interactive Login Input Form (Shown / Pre-filled on Role Click) */}
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-50/80 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between px-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Logging in as: <span className="text-blue-600 dark:text-blue-400 capitalize font-bold">{roleOptions.find(r => r.value === selectedRole)?.label || selectedRole}</span>
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                  Active Role
                </span>
              </div>

              {/* Email Field */}
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                    } text-sm outline-none transition-all`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1 pl-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                      errors.password
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                    } text-sm outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1 pl-1 font-medium">{errors.password}</p>}
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => toast({ type: 'info', title: 'Password Reset', description: 'Please contact your college administrator to reset your password.' })}
                  className="text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Main Login Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium py-3 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base transition-all mt-2"
              >
                <span>Login</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Register New College Option (Placed directly below Login button) */}
          <div className="mt-3.5 pt-1">
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100/80 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Register New College
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Footer Copyright */}
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            EduthFlow © 2025. All rights reserved.
          </div>
        </div>
      </div>

      {/* Register College Flow Modal */}
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
