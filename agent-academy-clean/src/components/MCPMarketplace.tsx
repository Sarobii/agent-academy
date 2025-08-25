import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import MCPDetailView from './MCPDetailView'
import { 
  Search,
  Filter,
  Download,
  Star,
  Clock,
  Tag,
  TrendingUp,
  Zap,
  Package,
  User,
  ChevronDown,
  Eye
} from 'lucide-react'

const complexityColors = {
  'simple': 'text-green-400 bg-green-400/20',
  'medium': 'text-yellow-400 bg-yellow-400/20', 
  'complex': 'text-orange-400 bg-orange-400/20',
  'advanced': 'text-red-400 bg-red-400/20'
}

export default function MCPMarketplace() {
  const { mcps, agents } = useAgentAcademy()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMCP, setSelectedMCP] = useState(null)

  // Get unique categories from tags
  const categories = useMemo(() => {
    const allTags = mcps.flatMap(mcp => mcp.tags || [])
    return ['all', ...Array.from(new Set(allTags))]
  }, [mcps])

  // Filter and sort MCPs
  const filteredMCPs = useMemo(() => {
    let filtered = mcps.filter(mcp => {
      const matchesSearch = mcp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mcp.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
                             (mcp.tags && mcp.tags.includes(selectedCategory))
      return matchesSearch && matchesCategory
    })

    // Sort MCPs
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.usage_stats?.downloads || 0) - (a.usage_stats?.downloads || 0))
        break
      case 'rating':
        filtered.sort((a, b) => (b.performance_metrics?.success_rate || 0) - (a.performance_metrics?.success_rate || 0))
        break
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return filtered
  }, [mcps, searchTerm, selectedCategory, sortBy])

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.name || 'Unknown'
  }

  const getComplexityFromDescription = (description: string) => {
    const lower = description.toLowerCase()
    if (lower.includes('advanced') || lower.includes('complex')) return 'advanced'
    if (lower.includes('sophisticated') || lower.includes('intelligent')) return 'complex'
    if (lower.includes('simple') || lower.includes('basic')) return 'simple'
    return 'medium'
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const created = new Date(timestamp)
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays}d ago`
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths}mo ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">MCP Marketplace</h2>
            <p className="text-sm text-white/70">
              Discover and explore {mcps.length} Model Control Protocols
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-gradient rounded-xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search MCPs by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none"
              style={{ backgroundColor: '#33415580' }}
            >
              <option value="latest" className="bg-gray-800 text-white">Latest</option>
              <option value="popular" className="bg-gray-800 text-white">Most Popular</option>
              <option value="rating" className="bg-gray-800 text-white">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div 
            className="border-t border-white/10 pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm text-white/70 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none"
                  style={{ backgroundColor: '#33415580' }}
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* MCP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMCPs.map((mcp, index) => {
          const complexity = getComplexityFromDescription(mcp.description || '')
          const complexityClass = complexityColors[complexity as keyof typeof complexityColors] || complexityColors.medium
          
          return (
            <motion.div
              key={mcp.id}
              className="mcp-card group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMCP(mcp)}
            >
              {/* MCP Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {mcp.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/70">
                      {getAgentName(mcp.creator_agent_id)}
                    </span>
                    <span className="text-white/50">•</span>
                    <Clock className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/70">
                      {formatTimeAgo(mcp.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${complexityClass}`}>
                    {complexity}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-white/70">
                      {((mcp.performance_metrics?.success_rate || 0) * 5).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* MCP Description */}
              <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-3">
                {mcp.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {mcp.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/10 text-white/80">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </span>
                ))}
                {(mcp.tags?.length || 0) > 3 && (
                  <span className="text-xs text-white/50">+{(mcp.tags?.length || 0) - 3} more</span>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {mcp.usage_stats?.downloads || 0}
                  </div>
                  <div className="text-xs text-white/70">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {mcp.usage_stats?.uses || 0}
                  </div>
                  <div className="text-xs text-white/70">Uses</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {((mcp.performance_metrics?.success_rate || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-white/70">Success</div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                  <span>Performance</span>
                  <span>{((mcp.performance_metrics?.success_rate || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(mcp.performance_metrics?.success_rate || 0) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedMCP(mcp)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Quick download action
                    const content = JSON.stringify(mcp, null, 2)
                    const blob = new Blob([content], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `${mcp.name.toLowerCase().replace(/\s+/g, '-')}.json`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  title="Quick Download JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Version Info */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <span>v{mcp.version_number}</span>
                <span>{mcp.performance_metrics?.avg_execution_time?.toFixed(1)}s avg</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredMCPs.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">No MCPs Found</h3>
          <p className="text-white/50">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'MCPs will appear here as agents create them'}
          </p>
        </div>
      )}
      
      {/* MCP Detail View Modal */}
      <AnimatePresence>
        {selectedMCP && (
          <MCPDetailView
            mcp={selectedMCP}
            agents={agents}
            onClose={() => setSelectedMCP(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}