import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { 
  GitBranch,
  History,
  TrendingUp,
  Users,
  Clock,
  Code,
  Zap,
  Award,
  ChevronRight,
  ChevronDown,
  Eye,
  Download,
  Star,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react'

interface MCPVersion {
  id: string
  mcp_id: string
  version_number: string
  changes: string
  created_by_agent_id: string
  changelog: {
    performance_improvements: string[]
    bug_fixes: string[]
    new_features: string[]
    breaking_changes: string[]
  }
  file_diff: string
  is_major_version: boolean
  created_at: string
  created_by_agent: {
    id: string
    name: string
    role: string
  }
}

interface MCPVersionData {
  versions: MCPVersion[]
  contributions: Record<string, number>
  metrics: {
    totalVersions: number
    majorVersions: number
    minorVersions: number
    contributors: number
    avgVersionsPerMonth: number
    lastUpdateDays: number
  }
}

export default function MCPEvolutionTracker() {
  const { mcps, agents } = useAgentAcademy()
  const [selectedMCP, setSelectedMCP] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'timeline' | 'metrics' | 'contributions'>('timeline')
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set())

  // Fetch real version data for selected MCP
  const { data: versionData, isLoading: versionLoading } = useQuery({
    queryKey: ['mcpVersions', selectedMCP],
    queryFn: async () => {
      if (!selectedMCP) return null
      
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) {
        throw new Error('No authentication token available')
      }
      
      const response = await fetch(`https://ihbeqctjknvdmsnwvpjc.supabase.co/functions/v1/mcp-versions-fetcher?mcp_id=${selectedMCP}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch version data')
      }
      
      const result = await response.json()
      return result.data as MCPVersionData
    },
    enabled: !!selectedMCP,
    refetchInterval: 30000
  })

  const selectedMCPData = selectedMCP ? mcps.find(m => m.id === selectedMCP) : null
  const versions = versionData?.versions || []
  const contributions = versionData?.contributions || {}
  const metrics = versionData?.metrics || {
    totalVersions: 0,
    majorVersions: 0,
    minorVersions: 0,
    contributors: 0,
    avgVersionsPerMonth: 0,
    lastUpdateDays: 0
  }

  const getAgentName = (agentId: string) => {
    return agents.find(a => a.id === agentId)?.name || 'Unknown Agent'
  }

  // Helper function to calculate agent contributions
  const getAgentContributions = (mcpId: string): Record<string, number> => {
    if (!versionData?.versions) return {}
    
    const contributionMap: Record<string, number> = {}
    
    versionData.versions.forEach(version => {
      const agentId = version.created_by_agent_id
      contributionMap[agentId] = (contributionMap[agentId] || 0) + 1
    })
    
    return contributionMap
  }

  const toggleVersionExpansion = (versionId: string) => {
    const newExpanded = new Set(expandedVersions)
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId)
    } else {
      newExpanded.add(versionId)
    }
    setExpandedVersions(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <GitBranch className="w-8 h-8 mr-3 text-green-400" />
            MCP Evolution Tracker
          </h2>
          <p className="text-white/70 mt-1">Track MCP development, versions, and collaborative enhancements</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-white/70 hover:bg-slate-700'
            }`}
          >
            <History className="w-4 h-4 mr-2 inline" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('metrics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'metrics' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-white/70 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Metrics
          </button>
          <button
            onClick={() => setViewMode('contributions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'contributions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-white/70 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4 mr-2 inline" />
            Contributors
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MCP List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Select MCP
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mcps.map((mcp) => {
                return (
                  <button
                    key={mcp.id}
                    onClick={() => setSelectedMCP(mcp.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedMCP === mcp.id
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{mcp.name}</h4>
                        <p className="text-white/60 text-xs mt-1 line-clamp-2">{mcp.description}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs">
                          <span className="text-white/50">
                            v{mcp.version_number}
                          </span>
                          <span className="text-green-400">
                            {mcp.usage_stats?.downloads || 0} downloads
                          </span>
                          <span className="text-blue-400">
                            Active
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/50" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedMCPData ? (
            <div className="space-y-6">
              {/* Selected MCP Header */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedMCPData.name}</h3>
                    <p className="text-white/70 mt-2">{selectedMCPData.description}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <span className="text-sm text-white/60">
                        Current Version: <span className="text-white font-medium">{selectedMCPData.version_number}</span>
                      </span>
                      <span className="text-sm text-white/60">
                        Creator: <span className="text-white font-medium">{getAgentName(selectedMCPData.creator_agent_id)}</span>
                      </span>
                      <span className="text-sm text-white/60">
                        Downloads: <span className="text-white font-medium">{selectedMCPData.usage_stats?.downloads || 0}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMCPData.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedMCPData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'timeline' && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Version History Timeline
                    {versionLoading && (
                      <div className="ml-4 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    )}
                  </h4>
                  {versionLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-white/70">Loading version history...</p>
                    </div>
                  ) : versions.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <p className="text-white/70">No version history available</p>
                      <p className="text-white/50 text-sm mt-2">This MCP doesn't have any version records yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {versions.map((version, index) => (
                        <motion.div
                          key={version.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-l-2 border-blue-500/30 pl-4 relative"
                        >
                          <div className="absolute -left-2 top-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h5 className="text-white font-medium">Version {version.version_number}</h5>
                                {version.is_major_version && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                                    Major Release
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => toggleVersionExpansion(version.id)}
                                className="text-white/70 hover:text-white transition-colors"
                              >
                                {expandedVersions.has(version.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-white/60 mb-2">
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {version.created_by_agent?.name || getAgentName(version.created_by_agent_id)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(version.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-white/80 text-sm">{version.changes}</p>
                            
                            {expandedVersions.has(version.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-white/10"
                              >
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-400">{version.changelog?.performance_improvements?.length || 0}</div>
                                    <div className="text-xs text-white/60">Performance Improvements</div>
                                    {version.changelog?.performance_improvements?.map((improvement, idx) => (
                                      <div key={idx} className="text-xs text-green-300/80 mt-1">{improvement}</div>
                                    ))}
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-400">{version.changelog?.bug_fixes?.length || 0}</div>
                                    <div className="text-xs text-white/60">Bug Fixes</div>
                                    {version.changelog?.bug_fixes?.map((fix, idx) => (
                                      <div key={idx} className="text-xs text-blue-300/80 mt-1">{fix}</div>
                                    ))}
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-purple-400">{version.changelog?.new_features?.length || 0}</div>
                                    <div className="text-xs text-white/60">New Features</div>
                                    {version.changelog?.new_features?.map((feature, idx) => (
                                      <div key={idx} className="text-xs text-purple-300/80 mt-1">{feature}</div>
                                    ))}
                                  </div>
                                </div>
                                {version.file_diff && (
                                  <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="text-xs text-white/60 mb-2">File Changes:</div>
                                    <div className="text-xs text-white/80 font-mono bg-slate-800/50 rounded p-2">
                                      {version.file_diff}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'metrics' && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Metrics
                    {versionLoading && (
                      <div className="ml-4 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    )}
                  </h4>
                  {versionLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-white/70">Loading metrics...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          title: 'Total Versions',
                          value: metrics.totalVersions,
                          icon: GitBranch,
                          color: 'text-blue-400 bg-blue-400/20'
                        },
                        {
                          title: 'Major Releases',
                          value: metrics.majorVersions,
                          icon: Award,
                          color: 'text-yellow-400 bg-yellow-400/20'
                        },
                        {
                          title: 'Minor Versions',
                          value: metrics.minorVersions,
                          icon: Code,
                          color: 'text-green-400 bg-green-400/20'
                        },
                        {
                          title: 'Contributors',
                          value: metrics.contributors,
                          icon: Users,
                          color: 'text-purple-400 bg-purple-400/20'
                        },
                        {
                          title: 'Avg Versions/Month',
                          value: metrics.avgVersionsPerMonth.toFixed(1),
                          icon: TrendingUp,
                          color: 'text-cyan-400 bg-cyan-400/20'
                        },
                        {
                          title: 'Days Since Update',
                          value: metrics.lastUpdateDays,
                          icon: Clock,
                          color: 'text-orange-400 bg-orange-400/20'
                        }
                      ].map((metric, index) => {
                        const Icon = metric.icon
                        return (
                          <motion.div
                            key={metric.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-700/30 rounded-lg p-4 text-center"
                          >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${metric.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-white">{metric.value}</div>
                            <div className="text-sm text-white/70">{metric.title}</div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'contributions' && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Agent Contributions
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(getAgentContributions(selectedMCP!))
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .map(([agentId, contributions]) => {
                        const agent = agents.find(a => a.id === agentId)
                        const contributionValues = Object.values(getAgentContributions(selectedMCP!))
                        const maxContributions = Math.max(...contributionValues.map(v => v as number))
                        const contributionsNum = contributions as number
                        const percentage = (contributionsNum / maxContributions) * 100
                        
                        return (
                          <div key={agentId} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {agent?.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-white font-medium">{agent?.name || 'Unknown Agent'}</h5>
                                <p className="text-white/60 text-sm">{agent?.role || 'Unknown Role'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-white font-semibold">{contributionsNum} versions</div>
                                <div className="text-white/60 text-sm">{((contributionsNum / versions.length) * 100).toFixed(1)}% of total</div>
                              </div>
                              <div className="w-20 bg-slate-600 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-12 text-center">
              <GitBranch className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/70 mb-2">Select an MCP to View Evolution</h3>
              <p className="text-white/50">Choose an MCP from the list to see its version history, metrics, and contributor insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}