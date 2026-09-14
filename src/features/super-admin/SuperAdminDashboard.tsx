import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { CollegeService } from '../../services/collegeService'
import type { College, CollegeRegistrationPayload, Profile } from '../../types/domain'
import { Button, Input, FormField, Modal, StatCard, StatusPill } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  School,
  ShieldCheck,
  Plus,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Building2,
  UserPlus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Lock,
} from 'lucide-react'

export function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { toast } = useToast()

  const [colleges, setColleges] = useState<College[]>(() => CollegeService.getColleges())
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // View & Edit Modal States
  const [viewCollege, setViewCollege] = useState<College | null>(null)
  const [viewAdmin, setViewAdmin] = useState<Profile | null>(null)
  const [isLoadingViewAdmin, setIsLoadingViewAdmin] = useState(false)

  const [editCollege, setEditCollege] = useState<College | null>(null)
  const [editFormData, setEditFormData] = useState<CollegeRegistrationPayload>({
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

  // Registration Form State
  const [confirmPassword, setConfirmPassword] = useState('')
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

  const refreshColleges = async () => {
    const data = await CollegeService.fetchCollegesAsync()
    setColleges(data)
  }

  useEffect(() => {
    refreshColleges()
  }, [])

  const handleToggleStatus = (college: College) => {
    const newStatus = college.status === 'active' ? 'suspended' : 'active'
    CollegeService.updateCollegeStatus(college.id, newStatus)
    refreshColleges()
    toast({
      type: newStatus === 'active' ? 'success' : 'warning',
      title: `College ${newStatus.toUpperCase()}`,
      description: `${college.name} is now ${newStatus}.`,
    })
  }

  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.college_name || !formData.official_email || !formData.admin_name || !formData.admin_email) {
      toast({ type: 'error', title: 'Missing required fields', description: 'Please fill in all mandatory fields.' })
      return
    }

    if (!formData.admin_password || formData.admin_password.length < 6) {
      toast({ type: 'error', title: 'Password Error', description: 'Admin password must be at least 6 characters long.' })
      return
    }

    if (formData.admin_password !== confirmPassword) {
      toast({ type: 'error', title: 'Password Mismatch', description: 'Admin passwords do not match.' })
      return
    }

    setIsSubmitting(true)
    try {
      const { college, adminProfile } = await CollegeService.createCollegeAsync(formData)
      await refreshColleges()
      setIsSubmitting(false)
      setShowCreateModal(false)
      setConfirmPassword('')
      toast({
        type: 'success',
        title: 'College & Admin Created!',
        description: `Successfully created ${college.name} (${college.code}) and Admin Auth user ${adminProfile.email}.`,
      })
      // Reset form
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
    } catch (err: any) {
      setIsSubmitting(false)
      toast({ type: 'error', title: 'Registration Failed', description: err.message })
    }
  }

  const handleOpenViewModal = async (college: College) => {
    setViewCollege(college)
    setIsLoadingViewAdmin(true)
    const admin = await CollegeService.getCollegeAdminAsync(college.id)
    setViewAdmin(admin)
    setIsLoadingViewAdmin(false)
  }

  const handleOpenEditModal = async (college: College) => {
    setEditCollege(college)
    const admin = await CollegeService.getCollegeAdminAsync(college.id)
    setEditFormData({
      college_name: college.name,
      college_code: college.code || college.id,
      official_email: college.email || '',
      official_phone: college.phone || '',
      address: college.address || '',
      city: college.city || '',
      state: college.state || '',
      country: college.country || 'USA',
      admin_name: admin?.name || '',
      admin_email: admin?.email || college.email || '',
      admin_password: '',
      admin_phone: admin?.phone || college.phone || '',
    })
  }

  const handleUpdateCollege = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCollege) return

    setIsSubmitting(true)
    try {
      await CollegeService.updateCollegeAsync(editCollege.id, editFormData)
      await refreshColleges()
      setIsSubmitting(false)
      setEditCollege(null)
      toast({
        type: 'success',
        title: 'College Updated!',
        description: `Updated details for ${editFormData.college_name}.`,
      })
    } catch (err: any) {
      setIsSubmitting(false)
      toast({ type: 'error', title: 'Update Failed', description: err.message })
    }
  }

  const handleDeleteCollege = async (college: College) => {
    if (confirm(`Are you sure you want to permanently delete "${college.name}" and all associated college data? This cannot be undone.`)) {
      try {
        await CollegeService.deleteCollegeAsync(college.id)
        await refreshColleges()
        toast({ type: 'info', title: 'College Deleted', description: `${college.name} was removed successfully.` })
      } catch (err: any) {
        toast({ type: 'error', title: 'Deletion Failed', description: err.message })
      }
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/veneyd07744')
  }

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const activeCount = colleges.filter((c) => c.status === 'active').length
  const suspendedCount = colleges.filter((c) => c.status === 'suspended').length

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Navbar */}
      <header className="bg-surface border-b border-border h-16 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-ink-900 leading-tight">Super Admin Portal</h1>
            <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">Multi-College Platform Management</p>
          </div>
        </div>

        <Button variant="ghost" onClick={handleLogout} className="text-rose-600 hover:bg-rose-50 border border-rose-200">
          <LogOut className="h-4 w-4 mr-1.5" /> Logout
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Colleges" value={colleges.length} icon={Building2} tone="brand" />
          <StatCard label="Active Colleges" value={activeCount} icon={CheckCircle} tone="success" />
          <StatCard label="Suspended Colleges" value={suspendedCount} icon={AlertTriangle} tone="warning" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search colleges by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1.5" /> Register New College
          </Button>
        </div>

        {/* Colleges Table */}
        <div className="bg-surface rounded-2xl border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border/80 flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">Registered Institutional Colleges</h2>
            <span className="text-xs text-ink-400 font-medium">{filteredColleges.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-ink-400 text-xs font-semibold uppercase tracking-wider border-b border-border/80">
                <tr>
                  <th className="py-3.5 px-4">College Code</th>
                  <th className="py-3.5 px-4">College Name</th>
                  <th className="py-3.5 px-4">Official Email</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-600 text-xs">{college.code || college.id}</td>
                    <td className="py-3.5 px-4 font-medium text-ink-900">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{college.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-600">{college.email}</td>
                    <td className="py-3.5 px-4 text-ink-600">{college.city ? `${college.city}, ${college.state}` : college.address}</td>
                    <td className="py-3.5 px-4">
                      <StatusPill
                        status={college.status === 'active' ? 'success' : 'danger'}
                        label={college.status.toUpperCase()}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenViewModal(college)}
                          title="View College Details"
                          className="text-slate-600 hover:bg-slate-100 p-1.5"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(college)}
                          title="Edit College Details"
                          className="text-slate-600 hover:bg-slate-100 p-1.5"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(college)}
                          className={college.status === 'active' ? 'text-rose-600 hover:bg-rose-50 border border-rose-200' : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'}
                        >
                          {college.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCollege(college)}
                          title="Delete College"
                          className="text-rose-600 hover:bg-rose-50 p-1.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredColleges.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ink-400 text-sm">
                      No matching colleges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* View College Modal */}
      <Modal
        isOpen={viewCollege !== null}
        onClose={() => setViewCollege(null)}
        title="College & Administrator Details"
        subtitle={`Information for ${viewCollege?.name}`}
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setViewCollege(null)}>
            Close
          </Button>
        }
      >
        {viewCollege && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-border/60 space-y-3">
              <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2 text-sm text-indigo-700">
                <School className="h-4 w-4" /> College Institution
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-ink-400 block font-medium">College Name</span>
                  <span className="font-medium text-ink-900">{viewCollege.name}</span>
                </div>
                <div>
                  <span className="text-xs text-ink-400 block font-medium">College Code</span>
                  <span className="font-mono text-xs font-semibold text-brand-600">{viewCollege.code || viewCollege.id}</span>
                </div>
                <div>
                  <span className="text-xs text-ink-400 block font-medium">Official Email</span>
                  <span className="text-ink-700">{viewCollege.email}</span>
                </div>
                <div>
                  <span className="text-xs text-ink-400 block font-medium">Official Phone</span>
                  <span className="text-ink-700">{viewCollege.phone || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-ink-400 block font-medium">Address</span>
                  <span className="text-ink-700">{viewCollege.address} {viewCollege.city ? `(${viewCollege.city}, ${viewCollege.state}, ${viewCollege.country})` : ''}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
              <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2 text-sm text-indigo-700">
                <UserPlus className="h-4 w-4" /> Assigned Administrator Profile
              </h3>
              {isLoadingViewAdmin ? (
                <p className="text-xs text-ink-400 animate-pulse">Loading administrator details...</p>
              ) : viewAdmin ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-400 block font-medium">Admin Name</span>
                    <span className="font-medium text-ink-900">{viewAdmin.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink-400 block font-medium">Admin Email</span>
                    <span className="text-ink-700 font-mono text-xs">{viewAdmin.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink-400 block font-medium">Admin Phone</span>
                    <span className="text-ink-700">{viewAdmin.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink-400 block font-medium">Auth ID</span>
                    <span className="text-ink-600 font-mono text-[11px] truncate block">{viewAdmin.id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ink-500">Admin email: <span className="font-mono font-medium">{viewCollege.email}</span></p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit College Modal */}
      <Modal
        isOpen={editCollege !== null}
        onClose={() => setEditCollege(null)}
        title="Edit College Institution"
        subtitle={`Update settings for ${editCollege?.name}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditCollege(null)}>
              Cancel
            </Button>
            <Button isLoading={isSubmitting} onClick={handleUpdateCollege}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateCollege} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="College Name" htmlFor="edit-col-name" required>
              <Input
                id="edit-col-name"
                value={editFormData.college_name}
                onChange={(e) => setEditFormData({ ...editFormData, college_name: e.target.value })}
              />
            </FormField>
            <FormField label="College Code" htmlFor="edit-col-code">
              <Input
                id="edit-col-code"
                value={editFormData.college_code}
                onChange={(e) => setEditFormData({ ...editFormData, college_code: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Official Email" htmlFor="edit-col-email" required>
              <Input
                id="edit-col-email"
                type="email"
                value={editFormData.official_email}
                onChange={(e) => setEditFormData({ ...editFormData, official_email: e.target.value })}
              />
            </FormField>
            <FormField label="Official Phone" htmlFor="edit-col-phone">
              <Input
                id="edit-col-phone"
                value={editFormData.official_phone}
                onChange={(e) => setEditFormData({ ...editFormData, official_phone: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Address" htmlFor="edit-col-address">
            <Input
              id="edit-col-address"
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="City" htmlFor="edit-col-city">
              <Input
                id="edit-col-city"
                value={editFormData.city}
                onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              />
            </FormField>
            <FormField label="State" htmlFor="edit-col-state">
              <Input
                id="edit-col-state"
                value={editFormData.state}
                onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
              />
            </FormField>
            <FormField label="Country" htmlFor="edit-col-country">
              <Input
                id="edit-col-country"
                value={editFormData.country}
                onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
              />
            </FormField>
          </div>

          <div className="border-t border-border pt-4 mt-6">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 font-display font-semibold text-sm">
              <UserPlus className="h-4 w-4" />
              <span>College Administrator Account Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Admin Name" htmlFor="edit-admin-name" required>
                <Input
                  id="edit-admin-name"
                  value={editFormData.admin_name}
                  onChange={(e) => setEditFormData({ ...editFormData, admin_name: e.target.value })}
                />
              </FormField>
              <FormField label="Admin Email" htmlFor="edit-admin-email" required>
                <Input
                  id="edit-admin-email"
                  type="email"
                  value={editFormData.admin_email}
                  onChange={(e) => setEditFormData({ ...editFormData, admin_email: e.target.value })}
                />
              </FormField>
            </div>
          </div>
        </form>
      </Modal>

      {/* Register New College Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Register New College Institution"
        subtitle="Create an isolated college tenant with initial Administrator account."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button isLoading={isSubmitting} onClick={handleCreateCollege}>
              Create College & Admin
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCollege} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="College Name" htmlFor="col-name" required>
              <Input
                id="col-name"
                placeholder="e.g. Stanford College of Technology"
                value={formData.college_name}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
              />
            </FormField>
            <FormField label="College Code (Unique ID)" htmlFor="col-code" required helperText="e.g. COL003 or STAN-TECH">
              <Input
                id="col-code"
                placeholder="e.g. COL003"
                value={formData.college_code}
                onChange={(e) => setFormData({ ...formData, college_code: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Official Email" htmlFor="col-email" required>
              <Input
                id="col-email"
                type="email"
                placeholder="admin@college.edu"
                value={formData.official_email}
                onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
              />
            </FormField>
            <FormField label="Official Phone" htmlFor="col-phone">
              <Input
                id="col-phone"
                placeholder="(555) 000-1111"
                value={formData.official_phone}
                onChange={(e) => setFormData({ ...formData, official_phone: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="College Address" htmlFor="col-address">
            <Input
              id="col-address"
              placeholder="Campus address line"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="City" htmlFor="col-city">
              <Input
                id="col-city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </FormField>
            <FormField label="State" htmlFor="col-state">
              <Input
                id="col-state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </FormField>
            <FormField label="Country" htmlFor="col-country">
              <Input
                id="col-country"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </FormField>
          </div>

          {/* Initial College Admin Section */}
          <div className="border-t border-border pt-4 mt-6">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 font-display font-semibold text-sm">
              <UserPlus className="h-4 w-4" />
              <span>Initial College Administrator Credentials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Admin Name" htmlFor="admin-name" required>
                <Input
                  id="admin-name"
                  placeholder="Administrator Name"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                />
              </FormField>
              <FormField label="Admin Email" htmlFor="admin-email" required>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin.initial@college.edu"
                  value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Admin Password" htmlFor="admin-password" required helperText="Minimum 6 characters">
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.admin_password}
                  onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                  icon={<Lock className="h-4 w-4" />}
                />
              </FormField>
              <FormField label="Confirm Admin Password" htmlFor="admin-confirm-password" required>
                <Input
                  id="admin-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                />
              </FormField>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

