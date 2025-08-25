import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import SkillRequestForm from './SkillRequestForm'
import { 
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Star,
  Brain,
  Filter,
  Search
} from 'lucide-react'

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-400/20', label: 'Pending' },
  assigned: { icon: User, color: 'text-blue-400 bg-blue-400/20', label: 'Assigned' },
  in_progress: { icon: AlertCircle, color: 'text-orange-400 bg-orange-400/20', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'text-green-400 bg-green-400/20', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-400 bg-red-400/20', label: 'Cancelled' }
}

const priorityConfig = {
  1: { label: 'Low', color: 'text-green-400' },
  2: { label: 'Normal', color: 'text-blue-400' },
  3: { label: 'Medium', color: 'text-yellow-400' },
  4: { label: 'High', color: 'text-orange-400' },
  5: { label: 'Critical', color: 'text-red-400' }
}

export default function SkillRequestsPanel() {
  const { skillRequests, agents } = useAgentAcademy()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredRequests = skillRequests.filter(request => {
    const matchesSearch = request.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority.toString() === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getAgentName = (agentId?: string) => {
    if (!agentId) return 'Unassigned'
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown Agent'
  }

  const getStatusCounts = () => {
    return {
      total: skillRequests.length,
      pending: skillRequests.filter(r => r.status === 'pending').length,
      assigned: skillRequests.filter(r => r.status === 'assigned').length,
      in_progress: skillRequests.filter(r => r.status === 'in_progress').length,
      completed: skillRequests.filter(r => r.status === 'completed').length
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            Skill Requests
          </h2>
          <p className="text-white/70 mt-1">Request new skills and track their development</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium
                   hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Request Skill</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{statusCounts.total}</div>
          <div className="text-sm text-white/70">Total Requests</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</div>
          <div className="text-sm text-white/70">Pending</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{statusCounts.assigned}</div>
          <div className="text-sm text-white/70">Assigned</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">{statusCounts.in_progress}</div>
          <div className="text-sm text-white/70">In Progress</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{statusCounts.completed}</div>
          <div className="text-sm text-white/70">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skill requests..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            <option value="all">All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Normal</option>
            <option value="3">Medium</option>
            <option value="4">High</option>
            <option value="5">Critical</option>
          </select>
        </div>
      </div>

      {/* Skill Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">
              {skillRequests.length === 0 ? 'No skill requests yet' : 'No requests match your filters'}
            </h3>
            <p className="text-white/50 mb-6">
              {skillRequests.length === 0 
                ? 'Create your first skill request to get started!' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {skillRequests.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium
                         hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Request Your First Skill
              </button>
            )}
          </div>
        ) : (
          filteredRequests.map((request, index) => {
            const StatusIcon = statusConfig[request.status as keyof typeof statusConfig].icon
            const statusStyle = statusConfig[request.status as keyof typeof statusConfig].color
            const priorityStyle = priorityConfig[request.priority as keyof typeof priorityConfig].color
            
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-slate-800/70 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{request.skill_name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[request.status as keyof typeof statusConfig].label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityStyle} bg-current/20`}>
                        <Star className="w-3 h-3 mr-1" />
                        {priorityConfig[request.priority as keyof typeof priorityConfig].label}
                      </span>
                    </div>
                    
                    <p className="text-white/70 mb-4 line-clamp-2">{request.description}</p>
                    
                    {request.tags && request.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {request.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 bg-slate-700/50 text-white/70 text-xs rounded-md"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-white/50 space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {getAgentName(request.assigned_agent_id)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Skill Request Form Modal */}
      <SkillRequestForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  )
}