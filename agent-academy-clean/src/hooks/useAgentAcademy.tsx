import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Agent, MCP, Skill, Activity, Collaboration, SkillRequest, Notification, UserPreferences } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Toast {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface AgentAcademyContextType {
  agents: Agent[]
  mcps: MCP[]
  skills: Skill[]
  activities: Activity[]
  collaborations: Collaboration[]
  skillRequests: SkillRequest[]
  notifications: Notification[]
  unreadNotificationCount: number
  userPreferences: UserPreferences | null
  loading: boolean
  simulateAgent: () => void
  createMCP: (agentId: string, mcpType: string, complexity: string) => void
  transferSkill: (sourceAgentId: string, targetAgentId: string, skillId: string) => void
  generateActivities: () => void
  createSkillRequest: (skillName: string, description: string, tags?: string[], priority?: number) => Promise<void>
  updateSkillRequestStatus: (skillRequestId: string, status: string, mcpId?: string) => Promise<void>
  markNotificationsAsRead: (notificationIds?: string[], markAll?: boolean) => Promise<void>
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const AgentAcademyContext = createContext<AgentAcademyContextType | undefined>(undefined)

export function AgentAcademyProvider({ children }: { children: ReactNode }) {
  const [realTimeActivities, setRealTimeActivities] = useState<Activity[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const queryClient = useQueryClient()
  const { user, isGuest, guestId, getGuestPreferences, setGuestPreferences } = useAuth()

  // Queries for all data
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as Agent[]
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const { data: mcps = [], isLoading: mcpsLoading } = useQuery({
    queryKey: ['mcps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mcps')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MCP[]
    },
    refetchInterval: 15000
  })

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name')
      if (error) throw error
      return data as Skill[]
    }
  })

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as Activity[]
    },
    refetchInterval: 10000
  })

  const { data: collaborations = [], isLoading: collaborationsLoading } = useQuery({
    queryKey: ['collaborations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data as Collaboration[]
    },
    refetchInterval: 20000
  })

  // New queries for enhanced features
  const { data: skillRequests = [], isLoading: skillRequestsLoading } = useQuery({
    queryKey: ['skillRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SkillRequest[]
    },
    refetchInterval: 15000
  })

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('notification-manager', {
        body: { limit: 50, offset: 0 }
      })
      if (error) throw error
      return data
    },
    refetchInterval: 30000
  })

  const notifications = notificationsData?.data || []
  const unreadNotificationCount = notificationsData?.unread_count || 0

  const { data: userPreferences = null, isLoading: preferencesLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .limit(1)
        .single()
      if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
      return data as UserPreferences
    }
  })

  // Mutations for actions
  const simulateAgentMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('agent-simulation', {
        body: {}
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    }
  })

  const createMCPMutation = useMutation({
    mutationFn: async ({ agentId, mcpType, complexity }: { agentId: string, mcpType: string, complexity: string }) => {
      const { data, error } = await supabase.functions.invoke('mcp-creator', {
        body: { agentId, mcpType, complexity }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcps'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      showToast('MCP Created', 'New MCP has been successfully created!', 'success')
    }
  })

  const transferSkillMutation = useMutation({
    mutationFn: async ({ sourceAgentId, targetAgentId, skillId }: { sourceAgentId: string, targetAgentId: string, skillId: string }) => {
      const { data, error } = await supabase.functions.invoke('skill-transfer', {
        body: { sourceAgentId, targetAgentId, skillId }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['collaborations'] })
      showToast('Skill Transferred', 'Skill has been successfully transferred!', 'success')
    }
  })

  const generateActivitiesMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('activity-generator', {
        body: {}
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['collaborations'] })
    }
  })

  // New mutations for enhanced features
  const createSkillRequestMutation = useMutation({
    mutationFn: async ({ skillName, description, tags, priority }: { skillName: string, description: string, tags?: string[], priority?: number }) => {
      const { data, error } = await supabase.functions.invoke('skill-request-creator', {
        body: { skill_name: skillName, description, tags, priority }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillRequests'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      showToast('Skill Request Created', 'Your skill request has been submitted and assigned to an agent!', 'success')
    },
    onError: (error: Error) => {
      showToast('Error', error.message, 'error')
    }
  })

  const updateSkillRequestStatusMutation = useMutation({
    mutationFn: async ({ skillRequestId, status, mcpId }: { skillRequestId: string, status: string, mcpId?: string }) => {
      const { data, error } = await supabase.functions.invoke('skill-request-status-updater', {
        body: { skill_request_id: skillRequestId, new_status: status, mcp_id: mcpId }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillRequests'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const markNotificationsAsReadMutation = useMutation({
    mutationFn: async ({ notificationIds, markAll }: { notificationIds?: string[], markAll?: boolean }) => {
      const { data, error } = await supabase.functions.invoke('notification-mark-read', {
        body: { notification_ids: notificationIds, mark_all: markAll }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  // Toast message system
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }

  // Guest mode helper functions
  const addGuestNotification = (title: string, message: string, type: string = 'info') => {
    if (isGuest) {
      const guestNotifications = JSON.parse(localStorage.getItem('guest_notifications') || '[]')
      const newNotification = {
        id: `guest_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
        is_read: false,
        created_at: new Date().toISOString(),
        user_id: guestId
      }
      guestNotifications.unshift(newNotification)
      localStorage.setItem('guest_notifications', JSON.stringify(guestNotifications))
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  }

  // Real-time subscriptions (only for authenticated users)
  useEffect(() => {
    if (isGuest) return // Skip real-time subscriptions for guest users
    const activitiesSubscription = supabase
      .channel('activities-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activities'
      }, (payload) => {
        const newActivity = payload.new as Activity
        setRealTimeActivities(prev => [newActivity, ...prev.slice(0, 49)])
        queryClient.invalidateQueries({ queryKey: ['activities'] })
      })
      .subscribe()

    const agentsSubscription = supabase
      .channel('agents-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agents'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      })
      .subscribe()

    // New subscriptions for enhanced features
    const skillRequestsSubscription = supabase
      .channel('skill-requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'skill_requests'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['skillRequests'] })
      })
      .subscribe()

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const newNotification = payload.new as Notification
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        
        // Show toast for new notifications
        if (newNotification.type === 'skill_request') {
          showToast(newNotification.title, newNotification.message, 'info')
        }
      })
      .subscribe()

    return () => {
      activitiesSubscription.unsubscribe()
      agentsSubscription.unsubscribe()
      skillRequestsSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [queryClient, isGuest])

  const loading = agentsLoading || mcpsLoading || skillsLoading || activitiesLoading || 
                 collaborationsLoading || skillRequestsLoading || notificationsLoading || preferencesLoading

  const value: AgentAcademyContextType = {
    agents,
    mcps,
    skills,
    activities: [...realTimeActivities, ...activities].slice(0, 50),
    collaborations,
    skillRequests,
    notifications,
    unreadNotificationCount,
    userPreferences,
    loading,
    simulateAgent: () => simulateAgentMutation.mutate(),
    createMCP: (agentId, mcpType, complexity) => createMCPMutation.mutate({ agentId, mcpType, complexity }),
    transferSkill: (sourceAgentId, targetAgentId, skillId) => transferSkillMutation.mutate({ sourceAgentId, targetAgentId, skillId }),
    generateActivities: () => generateActivitiesMutation.mutate(),
    createSkillRequest: async (skillName, description, tags, priority) => {
      const result = await new Promise<void>((resolve, reject) => {
        createSkillRequestMutation.mutate(
          { skillName, description, tags, priority },
          {
            onSuccess: () => {
              if (isGuest) {
                addGuestNotification(
                  'Skill Request Created',
                  `Your request for "${skillName}" has been saved. Sign up to submit it to our AI agents!`,
                  'skill_request'
                )
              }
              resolve()
            },
            onError: (error) => reject(error)
          }
        )
      })
      return result
    },
    updateSkillRequestStatus: async (skillRequestId, status, mcpId) => {
      return new Promise<void>((resolve, reject) => {
        updateSkillRequestStatusMutation.mutate(
          { skillRequestId, status, mcpId },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error)
          }
        )
      })
    },
    markNotificationsAsRead: async (notificationIds, markAll) => {
      return new Promise<void>((resolve, reject) => {
        markNotificationsAsReadMutation.mutate(
          { notificationIds, markAll },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error)
          }
        )
      })
    },
    showToast
  }

  return (
    <AgentAcademyContext.Provider value={value}>
      {children}
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-out
              ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-600 text-white'
                  : toast.type === 'warning'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-blue-600 text-white'
              }
            `}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                <p className="text-xs mt-1 opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-2 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </AgentAcademyContext.Provider>
  )
}

export function useAgentAcademy() {
  const context = useContext(AgentAcademyContext)
  if (context === undefined) {
    throw new Error('useAgentAcademy must be used within an AgentAcademyProvider')
  }
  return context
}