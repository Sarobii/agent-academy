import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  ArrowRight,
  Users,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Network,
  Brain,
  Zap
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

const collaborationTypeIcons = {
  transfer: ArrowRight,
  enhancement: TrendingUp,
  creation: Brain,
  review: Zap
}

const collaborationTypeColors = {
  transfer: 'from-blue-500/20 to-cyan-500/20 border-blue-300/30',
  enhancement: 'from-purple-500/20 to-violet-500/20 border-purple-300/30',
  creation: 'from-green-500/20 to-emerald-500/20 border-green-300/30',
  review: 'from-orange-500/20 to-red-500/20 border-orange-300/30'
}

const statusIcons = {
  pending: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle2,
  failed: XCircle
}

const statusColors = {
  pending: 'text-yellow-400',
  in_progress: 'text-blue-400',
  completed: 'text-green-400',
  failed: 'text-red-400'
}

export default function SkillTransferVisualization() {
  const { collaborations, agents, skills, activities } = useAgentAcademy()

  // Get agent name by ID
  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown Agent'
  }

  // Get skill name by ID
  const getSkillName = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.name || 'Unknown Skill'
  }

  // Group collaborations by agent pairs
  const agentPairs = useMemo(() => {
    const pairs: Record<string, any[]> = {}
    
    collaborations.forEach(collab => {
      const pairKey = [collab.source_agent_id, collab.target_agent_id].sort().join('-')
      if (!pairs[pairKey]) {
        pairs[pairKey] = []
      }
      pairs[pairKey].push(collab)
    })
    
    return Object.entries(pairs).map(([key, collabs]) => {
      const [agent1Id, agent2Id] = key.split('-')
      return {
        key,
        agent1: agents.find(a => a.id === agent1Id),
        agent2: agents.find(a => a.id === agent2Id),
        collaborations: collabs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
    })
  }, [collaborations, agents])

  // Calculate transfer statistics
  const transferStats = useMemo(() => {
    const transfers = collaborations.filter(c => c.type === 'transfer')
    const successful = transfers.filter(c => c.status === 'completed').length
    const total = transfers.length
    const successRate = total > 0 ? (successful / total) * 100 : 0
    
    return {
      total,
      successful,
      failed: transfers.filter(c => c.status === 'failed').length,
      pending: transfers.filter(c => c.status === 'pending').length,
      successRate
    }
  }, [collaborations])

  // Recent skill transfer activities
  const recentTransfers = useMemo(() => {
    return activities
      .filter(activity => 
        activity.activity_type === 'skill_transfer_teaching' || 
        activity.activity_type === 'skill_transfer_learning'
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
  }, [activities])

  const formatTransferTimeAgo = (timestamp: string) => {
    return formatTimeAgo(timestamp)
  }

  const getCollaborationIcon = (type: string) => {
    return collaborationTypeIcons[type as keyof typeof collaborationTypeIcons] || ArrowRight
  }

  const getCollaborationColor = (type: string) => {
    return collaborationTypeColors[type as keyof typeof collaborationTypeColors] || collaborationTypeColors.transfer
  }

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || AlertCircle
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Network className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Skill Transfer Network</h2>
            <p className="text-sm text-white/70">
              Visualizing knowledge flow between agents
            </p>
          </div>
        </div>
      </div>

      {/* Transfer Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-gradient rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{transferStats.total}</div>
          <div className="text-xs text-white/70">Total Transfers</div>
        </div>
        <div className="card-gradient rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{transferStats.successful}</div>
          <div className="text-xs text-white/70">Successful</div>
        </div>
        <div className="card-gradient rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{transferStats.failed}</div>
          <div className="text-xs text-white/70">Failed</div>
        </div>
        <div className="card-gradient rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{transferStats.pending}</div>
          <div className="text-xs text-white/70">Pending</div>
        </div>
        <div className="card-gradient rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{transferStats.successRate.toFixed(0)}%</div>
          <div className="text-xs text-white/70">Success Rate</div>
        </div>
      </div>

      {/* Agent Collaboration Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaboration Pairs */}
        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Agent Collaborations
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {agentPairs.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No collaborations yet. Agents will start collaborating soon.</p>
              </div>
            ) : (
              agentPairs.map((pair, index) => {
                if (!pair.agent1 || !pair.agent2) return null
                
                const recentCollab = pair.collaborations[0]
                const totalCollabs = pair.collaborations.length
                const successfulCollabs = pair.collaborations.filter(c => c.status === 'completed').length
                
                return (
                  <motion.div
                    key={pair.key}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-400">
                            {pair.agent1.name.charAt(0)}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/50" />
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-400">
                            {pair.agent2.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {pair.agent1.name} ↔ {pair.agent2.name}
                          </div>
                          <div className="text-xs text-white/70">
                            {totalCollabs} collaboration{totalCollabs !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {totalCollabs > 0 ? Math.round((successfulCollabs / totalCollabs) * 100) : 0}%
                        </div>
                        <div className="text-xs text-white/70">Success</div>
                      </div>
                    </div>
                    
                    {recentCollab && (
                      <div className="text-xs text-white/60 border-t border-white/10 pt-2">
                        <div className="flex items-center justify-between">
                          <span>Latest: {recentCollab.type.replace('_', ' ')}</span>
                          <span>{formatTransferTimeAgo(recentCollab.created_at)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Transfer Activities */}
        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Recent Transfers
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentTransfers.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No skill transfers yet. Start transferring skills between agents.</p>
              </div>
            ) : (
              recentTransfers.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {activity.activity_type === 'skill_transfer_teaching' ? (
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium mb-1">
                        {getAgentName(activity.agent_id)}
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed mb-2">
                        {activity.description}
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatTransferTimeAgo(activity.created_at)}</span>
                        </div>
                        {activity.duration_seconds && (
                          <span>{Math.round(activity.duration_seconds / 60)}m</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Collaborations Timeline */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Collaboration Timeline
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {collaborations.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No collaborations recorded yet. Agent interactions will appear here.</p>
            </div>
          ) : (
            collaborations.map((collaboration, index) => {
              const Icon = getCollaborationIcon(collaboration.type)
              const StatusIcon = getStatusIcon(collaboration.status)
              const colorClass = getCollaborationColor(collaboration.type)
              const statusColor = getStatusColor(collaboration.status)
              
              return (
                <motion.div
                  key={collaboration.id}
                  className={`bg-gradient-to-r ${colorClass} rounded-lg p-4 border`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {getAgentName(collaboration.source_agent_id)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-white/50" />
                          <span className="text-sm font-medium text-white">
                            {getAgentName(collaboration.target_agent_id)}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                        </div>
                        
                        <div className="text-xs text-white/70 mb-2">
                          {collaboration.type.charAt(0).toUpperCase() + collaboration.type.slice(1)}
                          {collaboration.skill_id && (
                            <span className="ml-2">• {getSkillName(collaboration.skill_id)}</span>
                          )}
                        </div>
                        
                        {collaboration.outcome && (
                          <div className="text-xs text-white/80 mb-2">
                            {collaboration.outcome}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTransferTimeAgo(collaboration.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                            <span className={`capitalize ${statusColor}`}>
                              {collaboration.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}