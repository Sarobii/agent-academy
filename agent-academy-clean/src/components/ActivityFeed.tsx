import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  Activity as ActivityIcon,
  User,
  Zap,
  Network,
  Brain,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

// Simple time formatter alternative to date-fns
const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

interface ActivityFeedProps {
  limit?: number
}

const activityIcons = {
  mcp_creation: Brain,
  skill_acquisition: TrendingUp,
  mcp_enhancement: Zap,
  system_integration: Network,
  collaboration: User,
  skill_transfer_teaching: User,
  skill_transfer_learning: TrendingUp,
  mcp_creation_start: Brain,
  mcp_creation_complete: Brain,
  default: ActivityIcon
}

const activityColors = {
  mcp_creation: 'from-blue-500/20 to-cyan-500/20 border-blue-300/30',
  skill_acquisition: 'from-green-500/20 to-emerald-500/20 border-green-300/30',
  mcp_enhancement: 'from-purple-500/20 to-violet-500/20 border-purple-300/30',
  system_integration: 'from-orange-500/20 to-red-500/20 border-orange-300/30',
  collaboration: 'from-pink-500/20 to-rose-500/20 border-pink-300/30',
  skill_transfer_teaching: 'from-indigo-500/20 to-blue-500/20 border-indigo-300/30',
  skill_transfer_learning: 'from-green-500/20 to-teal-500/20 border-green-300/30',
  mcp_creation_start: 'from-blue-500/20 to-cyan-500/20 border-blue-300/30',
  mcp_creation_complete: 'from-blue-600/20 to-cyan-600/20 border-blue-400/30',
  default: 'from-gray-500/20 to-slate-500/20 border-gray-300/30'
}

export default function ActivityFeed({ limit }: ActivityFeedProps) {
  const { activities, agents, loading } = useAgentAcademy()
  
  const displayActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return limit ? sorted.slice(0, limit) : sorted
  }, [activities, limit])

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown Agent'
  }

  const getActivityIcon = (activityType: string) => {
    return activityIcons[activityType as keyof typeof activityIcons] || activityIcons.default
  }

  const getActivityColor = (activityType: string) => {
    return activityColors[activityType as keyof typeof activityColors] || activityColors.default
  }

  const formatActivityTime = (timestamp: string) => {
    return formatTimeAgo(timestamp)
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />
      case 'in_progress':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      case 'failed':
        return <div className="w-2 h-2 bg-red-400 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  if (loading) {
    return (
      <div className="card-gradient rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
              <div className="h-2 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-gradient rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <ActivityIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {limit ? 'Recent Activity' : 'Activity Theater'}
            </h2>
            <p className="text-sm text-white/70">
              {limit ? 'Latest agent activities' : 'Live feed of all agent activities'}
            </p>
          </div>
        </div>
        
        {displayActivities.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {displayActivities.length === 0 ? (
            <motion.div 
              className="text-center py-8 text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activities yet. Agent simulation will start generating activities soon.</p>
            </motion.div>
          ) : (
            displayActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.activity_type)
              const colorClass = getActivityColor(activity.activity_type)
              
              return (
                <motion.div
                  key={activity.id}
                  className={`activity-item bg-gradient-to-r ${colorClass} slide-in`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {getAgentName(activity.agent_id)}
                          </span>
                          <ChevronRight className="w-3 h-3 text-white/50" />
                          <span className="text-xs text-white/70 capitalize">
                            {activity.activity_type.replace(/_/g, ' ')}
                          </span>
                          {getStatusIndicator(activity.status)}
                        </div>
                        
                        <p className="text-sm text-white/90 leading-relaxed mb-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatActivityTime(activity.created_at)}</span>
                          </div>
                          
                          {activity.duration_seconds && (
                            <div className="flex items-center space-x-1">
                              <span>Duration:</span>
                              <span>{Math.round(activity.duration_seconds / 60)}m</span>
                            </div>
                          )}
                          
                          {activity.metadata && activity.metadata.complexity && (
                            <div className="flex items-center space-x-1">
                              <span>Complexity:</span>
                              <span className="capitalize">{activity.metadata.complexity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
      
      {limit && displayActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
            <span>View all activities</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}