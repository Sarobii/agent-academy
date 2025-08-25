import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Target,
  Award,
  Activity,
  Brain,
  Settings,
  Calendar,
  Filter
} from 'lucide-react'

export default function EnhancedAnalyticsDashboard() {
  const { agents, mcps, activities, collaborations, skillRequests, skills } = useAgentAcademy()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date()
    const getDateRange = (range: string) => {
      const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    }

    const startDate = getDateRange(timeRange)

    // Filter data by time range
    const recentActivities = activities.filter(a => new Date(a.created_at) >= startDate)
    const recentMCPs = mcps.filter(m => new Date(m.created_at) >= startDate)
    const recentCollaborations = collaborations.filter(c => new Date(c.created_at) >= startDate)
    const recentSkillRequests = skillRequests.filter(r => new Date(r.created_at) >= startDate)

    // Agent performance metrics
    const agentPerformance = agents.map(agent => {
      const agentActivities = recentActivities.filter(a => a.agent_id === agent.id)
      const agentMCPs = recentMCPs.filter(m => m.creator_agent_id === agent.id)
      const agentCollaborations = recentCollaborations.filter(c => 
        c.source_agent_id === agent.id || c.target_agent_id === agent.id
      )
      const agentSkillRequests = recentSkillRequests.filter(r => r.assigned_agent_id === agent.id)
      
      const completedCollaborations = agentCollaborations.filter(c => c.status === 'completed')
      const successRate = agentCollaborations.length > 0 
        ? (completedCollaborations.length / agentCollaborations.length) * 100 
        : 0

      return {
        ...agent,
        activityCount: agentActivities.length,
        mcpCount: agentMCPs.length,
        collaborationCount: agentCollaborations.length,
        skillRequestCount: agentSkillRequests.length,
        successRate: Math.round(successRate),
        productivityScore: agentActivities.length + (agentMCPs.length * 3) + (completedCollaborations.length * 2)
      }
    })

    // MCP usage trends
    const mcpCategories = mcps.reduce((acc, mcp) => {
      mcp.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + (mcp.usage_stats?.downloads || 0)
      })
      return acc
    }, {} as Record<string, number>)

    // Skill transfer analytics
    const skillTransferStats = {
      total: recentCollaborations.filter(c => c.type === 'transfer').length,
      successful: recentCollaborations.filter(c => c.type === 'transfer' && c.status === 'completed').length,
      failed: recentCollaborations.filter(c => c.type === 'transfer' && c.status === 'failed').length,
      pending: recentCollaborations.filter(c => c.type === 'transfer' && c.status === 'pending').length
    }

    const skillTransferSuccessRate = skillTransferStats.total > 0 
      ? (skillTransferStats.successful / skillTransferStats.total) * 100 
      : 0

    // Activity type distribution
    const activityTypes = recentActivities.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      agentPerformance,
      mcpCategories,
      skillTransferStats,
      skillTransferSuccessRate,
      activityTypes,
      totalActivities: recentActivities.length,
      totalMCPs: recentMCPs.length,
      totalCollaborations: recentCollaborations.length,
      averageResponseTime: 2.3, // Mock data
      systemUptime: 99.8, // Mock data
    }
  }, [agents, mcps, activities, collaborations, skillRequests, skills, timeRange])

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ]

  const metricCards = [
    {
      title: 'Total Activities',
      value: analytics.totalActivities,
      icon: Activity,
      color: 'text-blue-400 bg-blue-400/20',
      change: '+12%'
    },
    {
      title: 'MCPs Created',
      value: analytics.totalMCPs,
      icon: Zap,
      color: 'text-purple-400 bg-purple-400/20',
      change: '+8%'
    },
    {
      title: 'Collaborations',
      value: analytics.totalCollaborations,
      icon: Users,
      color: 'text-green-400 bg-green-400/20',
      change: '+15%'
    },
    {
      title: 'Success Rate',
      value: `${analytics.skillTransferSuccessRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-yellow-400 bg-yellow-400/20',
      change: '+3%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
            Advanced Analytics
          </h2>
          <p className="text-white/70 mt-1">Comprehensive insights into agent performance and system metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  <p className="text-green-400 text-sm mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {card.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Agent Performance Matrix */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Agent Performance Metrics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance Table */}
          <div>
            <div className="space-y-4">
              {analytics.agentPerformance
                .sort((a, b) => b.productivityScore - a.productivityScore)
                .slice(0, 6)
                .map((agent, index) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-yellow-400' :
                      index === 1 ? 'bg-gray-300' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-blue-400'
                    }`}></div>
                    <div>
                      <h4 className="text-white font-medium">{agent.name}</h4>
                      <p className="text-white/60 text-sm">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{agent.productivityScore}</div>
                    <div className="text-white/60 text-sm">{agent.successRate}% success</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Effectiveness */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Collaboration Effectiveness</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{analytics.skillTransferStats.successful}</div>
                  <div className="text-white/70 text-sm">Successful Transfers</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">{analytics.skillTransferStats.failed}</div>
                  <div className="text-white/70 text-sm">Failed Transfers</div>
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Transfer Success Rate</span>
                  <span className="text-white font-medium">{analytics.skillTransferSuccessRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analytics.skillTransferSuccessRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MCP Usage & Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCP Category Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            MCP Usage by Category
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.mcpCategories)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([category, usage]) => {
                const maxUsage = Math.max(...Object.values(analytics.mcpCategories))
                const percentage = maxUsage > 0 ? (usage / maxUsage) * 100 : 0
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">{category}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8 text-right">{usage}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Activity Type Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Activity Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.activityTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([type, count]) => {
                const maxCount = Math.max(...Object.values(analytics.activityTypes))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-white/80 text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          System Health & Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{analytics.systemUptime}%</div>
            <div className="text-white/70 text-sm">System Uptime</div>
            <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analytics.systemUptime}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{analytics.averageResponseTime}s</div>
            <div className="text-white/70 text-sm">Avg Response Time</div>
            <div className="text-green-400 text-xs mt-1 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              -15% from last period
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{agents.length}</div>
            <div className="text-white/70 text-sm">Active Agents</div>
            <div className="text-green-400 text-xs mt-1">All systems operational</div>
          </div>
        </div>
      </div>
    </div>
  )
}