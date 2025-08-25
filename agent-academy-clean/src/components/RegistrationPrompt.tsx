import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthComponents'
import { 
  Crown, 
  X, 
  Star, 
  Zap,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react'

interface RegistrationPromptProps {
  trigger: 'skill_request' | 'preferences' | 'time_based' | 'exit_intent' | 'feature_usage'
  onDismiss: () => void
}

const promptContent = {
  skill_request: {
    title: 'Save Your Progress',
    description: 'Create an account to track your skill requests and get priority support.',
    icon: Star,
    color: 'from-purple-500 to-pink-500'
  },
  preferences: {
    title: 'Sync Your Preferences',
    description: 'Keep your settings across all devices with a free account.',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500'
  },
  time_based: {
    title: 'Loving Agent Academy?',
    description: 'Join thousands of users and unlock premium features.',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500'
  },
  exit_intent: {
    title: 'Don\'t Lose Your Work',
    description: 'Sign up now to save your progress and continue where you left off.',
    icon: Shield,
    color: 'from-red-500 to-pink-500'
  },
  feature_usage: {
    title: 'Unlock More Features',
    description: 'Get access to advanced analytics and personalized recommendations.',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500'
  }
}

export function RegistrationPrompt({ trigger, onDismiss }: RegistrationPromptProps) {
  const { isGuest } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const content = promptContent[trigger]
  const Icon = content.icon

  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isGuest])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(), 300)
  }

  const handleSignUp = () => {
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleSignIn = () => {
    setAuthMode('signin')
    setAuthModalOpen(true)
  }

  if (!isGuest || !isVisible) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[99998]"
        >
          <div className={`bg-gradient-to-r ${content.color} px-4 py-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{content.title}</h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-white/80">{content.description}</p>
            
            <div className="flex items-center space-x-2 text-xs text-white/60">
              <Clock className="w-3 h-3" />
              <span>Takes less than 30 seconds</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSignUp}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Sign Up Free
              </button>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </button>
            </div>
            
            <button
              onClick={handleDismiss}
              className="w-full text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Auth Modal would be imported and used here */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </>
  )
}

// Hook for managing registration prompts
export function useRegistrationPrompts() {
  const { isGuest } = useAuth()
  const [activePrompt, setActivePrompt] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [userEngagement, setUserEngagement] = useState({
    sessionTime: 0,
    skillRequestsCreated: 0,
    preferencesChanged: 0,
    featuresUsed: new Set<string>()
  })

  // Track session time
  useEffect(() => {
    if (!isGuest) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      setUserEngagement(prev => ({
        ...prev,
        sessionTime: Date.now() - startTime
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [isGuest])

  // Track exit intent
  useEffect(() => {
    if (!isGuest) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !promptHistory.includes('exit_intent')) {
        triggerPrompt('exit_intent')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [isGuest, promptHistory])

  const triggerPrompt = (type: string) => {
    if (!isGuest || activePrompt || promptHistory.includes(type)) return

    // Rate limiting: max 1 prompt per 5 minutes
    const lastPromptTime = localStorage.getItem('last_prompt_time')
    const now = Date.now()
    if (lastPromptTime && now - parseInt(lastPromptTime) < 5 * 60 * 1000) {
      return
    }

    setActivePrompt(type)
    localStorage.setItem('last_prompt_time', now.toString())
  }

  const dismissPrompt = () => {
    if (activePrompt) {
      setPromptHistory(prev => [...prev, activePrompt])
      setActivePrompt(null)
    }
  }

  // Smart triggering based on user behavior
  const trackSkillRequest = () => {
    setUserEngagement(prev => ({ ...prev, skillRequestsCreated: prev.skillRequestsCreated + 1 }))
    if (userEngagement.skillRequestsCreated === 0) {
      triggerPrompt('skill_request')
    }
  }

  const trackPreferenceChange = () => {
    setUserEngagement(prev => ({ ...prev, preferencesChanged: prev.preferencesChanged + 1 }))
    if (userEngagement.preferencesChanged === 2) {
      triggerPrompt('preferences')
    }
  }

  const trackFeatureUsage = (feature: string) => {
    setUserEngagement(prev => ({
      ...prev,
      featuresUsed: new Set([...prev.featuresUsed, feature])
    }))
    
    // After using 3 different features
    if (userEngagement.featuresUsed.size === 3) {
      triggerPrompt('feature_usage')
    }
  }

  // Time-based prompt after 10 minutes
  useEffect(() => {
    if (userEngagement.sessionTime > 10 * 60 * 1000) {
      triggerPrompt('time_based')
    }
  }, [userEngagement.sessionTime])

  return {
    activePrompt,
    dismissPrompt,
    trackSkillRequest,
    trackPreferenceChange,
    trackFeatureUsage
  }
}