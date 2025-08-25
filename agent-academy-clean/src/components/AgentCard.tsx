import React from 'react'
import { motion } from 'framer-motion'
import { Agent } from '@/lib/supabase'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  User, 
  Brain, 
  Zap, 
  Network, 
  Activity,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'

interface AgentCardProps {
  agent: Agent
}

const roleIcons = {
  creator: Brain,
  acquirer: TrendingUp,
  optimizer: Zap,
  synthesizer: Network
}

const roleColors = {
  creator: 'agent-builder',
  acquirer: 'agent-learner', 
  optimizer: 'agent-enhancer',
  synthesizer: 'agent-integrator'
}

const roleDescriptions = {
  creator: 'Designs and creates new MCPs with innovative approaches',
  acquirer: 'Learns and adapts skills through observation and practice',
  optimizer: 'Enhances existing MCPs for better performance and quality',
  synthesizer: 'Integrates systems and orchestrates agent collaboration'
}

export default function AgentCard({ agent }: AgentCardProps) {
  const { activities, mcps } = useAgentAcademy()
  
  const Icon = roleIcons[agent.role as keyof typeof roleIcons] || User
  const colorClass = roleColors[agent.role as keyof typeof roleColors] || 'agent-builder'
  const description = roleDescriptions[agent.role as keyof typeof roleDescriptions] || 'AI Agent'
  
  // Get agent's recent activities
  const agentActivities = activities.filter(activity => activity.agent_id === agent.id).slice(0, 3)
  
  // Get agent's created MCPs
  const agentMCPs = mcps.filter(mcp => mcp.creator_agent_id === agent.id)
  
  // Calculate agent metrics
  const totalDownloads = agentMCPs.reduce((sum, mcp) => sum + (mcp.usage_stats?.downloads || 0), 0)
  const avgSuccessRate = agentMCPs.length > 0 
    ? agentMCPs.reduce((sum, mcp) => sum + (mcp.performance_metrics?.success_rate || 0), 0) / agentMCPs.length
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'working': return 'text-yellow-400'
      case 'idle': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <motion.div 
      className={`agent-card card-gradient ${colorClass}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Agent Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-sm text-white/70 capitalize">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
          <span className={`text-xs ${getStatusColor(agent.status)} capitalize`}>{agent.status}</span>
        </div>
      </div>

      {/* Agent Description */}
      <p className="text-sm text-white/80 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Agent Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white/90 mb-2 flex items-center">
          <Star className="w-4 h-4 mr-1" />
          Skills ({agent.skills?.length || 0})
        </h4>
        <div className="flex flex-wrap gap-1">
          {agent.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-badge text-xs">
              {skill}
            </span>
          ))}
          {(agent.skills?.length || 0) > 3 && (
            <span className="skill-badge text-xs">
              +{(agent.skills?.length || 0) - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Agent Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{agentMCPs.length}</div>
          <div className="text-xs text-white/70">MCPs Created</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{totalDownloads}</div>
          <div className="text-xs text-white/70">Downloads</div>
        </div>
      </div>

      {/* Performance Indicator */}
      {avgSuccessRate > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-white/80 mb-1">
            <span>Success Rate</span>
            <span>{Math.round(avgSuccessRate * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${avgSuccessRate * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <h4 className="text-sm font-medium text-white/90 mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-1" />
          Recent Activity
        </h4>
        <div className="space-y-2">
          {agentActivities.length > 0 ? (
            agentActivities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="text-xs text-white/70 truncate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{activity.description}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-xs text-white/50 italic">No recent activity</div>
          )}
        </div>
      </div>

      {/* Agent Personality Traits */}
      {agent.personality?.traits && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-white/70 mb-2">Personality</h4>
          <div className="flex flex-wrap gap-1">
            {agent.personality.traits.slice(0, 3).map((trait, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}