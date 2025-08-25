import React from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Package, 
  Activity,
  Download,
  Clock,
  Zap,
  Star
} from 'lucide-react'

interface StatsOverviewProps {
  detailed?: boolean
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']

export default function StatsOverview({ detailed = false }: StatsOverviewProps) {
  const { agents, mcps, activities, skills, collaborations } = useAgentAcademy()

  // Calculate key metrics
  const totalMCPs = mcps.length
  const totalDownloads = mcps.reduce((sum, mcp) => sum + (mcp.usage_stats?.downloads || 0), 0)
  const totalActivities = activities.length
  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const avgSuccessRate = mcps.length > 0 
    ? mcps.reduce((sum, mcp) => sum + (mcp.performance_metrics?.success_rate || 0), 0) / mcps.length
    : 0

  // Prepare chart data
  const agentActivityData = agents.map(agent => ({
    name: agent.name,
    activities: activities.filter(a => a.agent_id === agent.id).length,
    mcps: mcps.filter(m => m.creator_agent_id === agent.id).length,
    skills: agent.skills?.length || 0
  }))

  const skillCategoryData = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const skillChartData = Object.entries(skillCategoryData).map(([name, value]) => ({
    name,
    value
  }))

  const activityTypeData = activities.reduce((acc, activity) => {
    const type = activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const activityChartData = Object.entries(activityTypeData).map(([name, value]) => ({
    name,
    value
  }))

  // Recent activity timeline (last 7 days)
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.created_at)
      return activityDate.toDateString() === date.toDateString()
    })
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      activities: dayActivities.length,
      collaborations: collaborations.filter(collab => {
        const collabDate = new Date(collab.created_at)
        return collabDate.toDateString() === date.toDateString()
      }).length
    }
  })

  const StatCard = ({ icon: Icon, label, value, change, color }: any) => (
    <motion.div 
      className="card-gradient rounded-lg p-4"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs flex items-center mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className={`space-y-6 ${detailed ? '' : ''}`}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <BarChart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            {detailed ? 'Analytics Dashboard' : 'System Overview'}
          </h2>
          <p className="text-sm text-white/70">
            {detailed ? 'Comprehensive system analytics' : 'Key metrics and statistics'}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={`grid ${detailed ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'} gap-4`}>
        <StatCard
          icon={Users}
          label="Active Agents"
          value={activeAgents}
          change={null}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={Package}
          label="Total MCPs"
          value={totalMCPs}
          change={null}
          color="bg-purple-500/20"
        />
        {detailed && (
          <>
            <StatCard
              icon={Download}
              label="Downloads"
              value={totalDownloads}
              change={null}
              color="bg-green-500/20"
            />
            <StatCard
              icon={Activity}
              label="Activities"
              value={totalActivities}
              change={null}
              color="bg-orange-500/20"
            />
          </>
        )}
        {!detailed && (
          <StatCard
            icon={Star}
            label="Success Rate"
            value={`${Math.round(avgSuccessRate * 100)}%`}
            change={null}
            color="bg-green-500/20"
          />
        )}
      </div>

      {detailed ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance Chart */}
          <div className="card-gradient rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Agent Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="activities" fill="#3B82F6" />
                <Bar dataKey="mcps" fill="#10B981" />
                <Bar dataKey="skills" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Categories */}
          <div className="card-gradient rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Skill Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {skillChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Timeline */}
          <div className="card-gradient rounded-xl p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line type="monotone" dataKey="activities" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="collaborations" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agentActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="activities" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}