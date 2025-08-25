import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  User, 
  Settings, 
  LogOut, 
  Crown, 
  Bell,
  History,
  Sparkles,
  X,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  // Update mode when initialMode changes (ensures modal opens with correct tab)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, fullName)
      }
      onClose()
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError('')
    setShowPassword(false)
  }

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode)
    resetForm()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-800 border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {mode === 'signin' ? 'Welcome Back' : 'Join Agent Academy'}
                    </h2>
                    <p className="text-sm text-white/80">
                      {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="px-6 py-4 bg-slate-700/50 border-b border-white/10">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                {mode === 'signin' ? 'Welcome Back!' : 'Premium Benefits'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-white/80">Sync Across Devices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <History className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-white/80">Save Your Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-white/80">Personalized Experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-white/80">Early Access</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-white/70 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg pl-10 pr-10 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  <>                  
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-700/30 border-t border-white/10">
              <p className="text-center text-sm text-white/70">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                {' '}
                <button
                  onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function UserMenu() {
  const { user, profile, isGuest, signOut, migrateGuestData } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const buttonRect = buttonRef.current!.getBoundingClientRect()
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        
        setDropdownPosition({
          top: buttonRect.bottom + scrollY + 8, // 8px gap
          left: buttonRect.right + scrollX - 192 // 192px = w-48 width, align to right edge
        })
      }
      
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleMigrateData = async () => {
    try {
      await migrateGuestData()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to migrate data:', error)
    }
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    // Ensure dropdown is closed when opening modal
    setIsOpen(false)
  }

  // For guest users, render simple buttons that trigger the modal
  if (isGuest) {
    return (
      <>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialMode={authMode}
        />
      </>
    )
  }

  const UserMenuDropdown = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="fixed w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left,
            zIndex: 99999
          }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-white/70">{user?.email}</p>
            <div className="flex items-center mt-1">
              <Crown className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-xs text-yellow-400 capitalize">
                {profile?.subscription_status || 'Free'}
              </span>
            </div>
          </div>

          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            {profile?.guest_data && Object.keys(profile.guest_data).length > 0 && (
              <button 
                onClick={handleMigrateData}
                className="w-full px-4 py-2 text-left text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
              >
                <History className="w-4 h-4" />
                <span>Migrate Guest Data</span>
              </button>
            )}
            
            <button 
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* User Menu Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-white">
          {profile?.full_name || user?.email?.split('@')[0]}
        </span>
      </button>

      {/* Portal for user menu dropdown - renders outside of stacking context */}
      {createPortal(<UserMenuDropdown />, document.body)}
    </>
  )
}