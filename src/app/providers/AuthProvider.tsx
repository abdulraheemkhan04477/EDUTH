import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { UserRole, Profile, CollegeRegistrationPayload, College } from '../../types/domain'
import { AuthService } from '../../services/authService'
import { hasPermission as checkPermission, hasRole as checkRole } from '../../services/permissionService'
import { syncWithSupabase, invalidateAcademicCache } from '../../lib/academicStore'
import { syncExamsWithSupabase, invalidateExamCache } from '../../lib/examStore'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface AuthContextValue {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  collegeId: string | null
  signIn: (email: string, password: string, preferredRole?: UserRole) => Promise<{ user?: Profile; error?: string }>
  superAdminSignIn: (email: string, password: string) => Promise<{ user?: Profile; error?: string }>
  verifySuperAdmin: (email: string, password: string) => Promise<boolean>
  registerCollege: (
    payload: CollegeRegistrationPayload,
    superAdminEmail: string,
    superAdminPass: string
  ) => Promise<{ college?: College; admin?: Profile; error?: string }>
  signOut: () => Promise<void>
  hasPermission: (permissionId: string) => boolean
  hasRole: (allowedRoles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Read stored user for immediate fast render shell
  const [user, setUser] = useState<Profile | null>(() => AuthService.getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  // Restore active user session on mount & listen to Supabase auth events
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData?.session?.user && isMounted) {
            const profile = await AuthService.fetchProfileFromSupabase(
              sessionData.session.user.id,
              sessionData.session.user
            )
            if (isMounted) {
              setUser(profile)
              if (profile) {
                try { localStorage.setItem('eduth_authenticated_user', JSON.stringify(profile)) } catch {}
              }
            }
          } else if (isMounted) {
            setUser(null)
            try { localStorage.removeItem('eduth_authenticated_user') } catch {}
          }
        } catch {
          if (isMounted) {
            const stored = AuthService.getStoredUser()
            setUser(stored)
          }
        }
      } else {
        const storedUser = AuthService.getStoredUser()
        if (isMounted) setUser(storedUser)
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    initAuth()

    let authSubscription: { unsubscribe: () => void } | null = null
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
          // Avoid refetching if current user state already matches active session user id
          const currentUser = AuthService.getStoredUser()
          if (currentUser && currentUser.id === session.user.id) {
            return
          }
          const profile = await AuthService.fetchProfileFromSupabase(session.user.id, session.user)
          if (isMounted && profile) {
            setUser(profile)
            try { localStorage.setItem('eduth_authenticated_user', JSON.stringify(profile)) } catch {}
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null)
            AuthService.clearAllUserCachedData()
          }
        }
      })
      authSubscription = data.subscription
    }

    return () => {
      isMounted = false
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      const cId = user.college_id || user.school_id
      const isSuper = user.role === 'super_admin'
      invalidateAcademicCache()
      invalidateExamCache()
      syncWithSupabase(cId, isSuper)
      syncExamsWithSupabase(cId, isSuper)
    }
  }, [user?.id, user?.college_id, user?.role])

  const signIn = useCallback(async (email: string, password: string, preferredRole?: UserRole) => {
    setIsLoading(true)
    const res = await AuthService.signIn(email, password, preferredRole)
    if (res.user) {
      setUser(res.user)
    }
    setIsLoading(false)
    return res
  }, [])

  const superAdminSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    const res = await AuthService.superAdminSignIn(email, password)
    if (res.user) {
      setUser(res.user)
    }
    setIsLoading(false)
    return res
  }, [])

  const verifySuperAdmin = useCallback(async (email: string, password: string) => {
    return AuthService.verifySuperAdminCredentials(email, password)
  }, [])

  const registerCollege = useCallback(
    async (payload: CollegeRegistrationPayload, superAdminEmail: string, superAdminPass: string) => {
      return AuthService.registerCollege(payload, superAdminEmail, superAdminPass)
    },
    []
  )

  const signOut = useCallback(async () => {
    setIsLoading(true)
    await AuthService.signOut()
    setUser(null)
    setIsLoading(false)
  }, [])

  const hasPermission = useCallback(
    (permissionId: string) => {
      return checkPermission(user, permissionId)
    },
    [user]
  )

  const hasRole = useCallback(
    (allowedRoles: UserRole[]) => {
      return checkRole(user, allowedRoles)
    },
    [user]
  )

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      role: user?.role ?? null,
      collegeId: user?.college_id || user?.school_id || null,
      signIn,
      superAdminSignIn,
      verifySuperAdmin,
      registerCollege,
      signOut,
      hasPermission,
      hasRole,
    }),
    [
      user,
      isLoading,
      signIn,
      superAdminSignIn,
      verifySuperAdmin,
      registerCollege,
      signOut,
      hasPermission,
      hasRole,
    ]
  )

  return <AuthContext value={contextValue}>{children}</AuthContext>
}

