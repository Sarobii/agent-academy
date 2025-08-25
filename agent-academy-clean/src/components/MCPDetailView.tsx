import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X,
  Download,
  Star,
  Clock,
  Tag,
  User,
  Code,
  FileText,
  Package,
  Copy,
  CheckCircle,
  Eye,
  Share2,
  Zap,
  Activity
} from 'lucide-react'
import { MCP, Agent } from '@/lib/supabase'

interface MCPDetailViewProps {
  mcp: MCP
  agents: Agent[]
  onClose: () => void
}

const complexityColors = {
  'simple': 'text-green-400 bg-green-400/20',
  'medium': 'text-yellow-400 bg-yellow-400/20', 
  'complex': 'text-orange-400 bg-orange-400/20',
  'advanced': 'text-red-400 bg-red-400/20'
}

export default function MCPDetailView({ mcp, agents, onClose }: MCPDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'usage'>('overview')
  const [copySuccess, setCopySuccess] = useState('')

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

  const complexity = getComplexityFromDescription(mcp.description || '')
  const complexityClass = complexityColors[complexity as keyof typeof complexityColors] || complexityColors.medium

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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(type)
    setTimeout(() => setCopySuccess(''), 2000)
  }

  const handleDownload = (format: 'json' | 'code' | 'config' | 'package') => {
    let content = ''
    let filename = ''
    let mimeType = 'application/json'

    switch (format) {
      case 'json':
        content = JSON.stringify(mcp, null, 2)
        filename = `${mcp.name.toLowerCase().replace(/\s+/g, '-')}.json`
        break
      case 'code':
        content = generateMCPCode(mcp)
        filename = `${mcp.name.toLowerCase().replace(/\s+/g, '-')}.ts`
        mimeType = 'text/typescript'
        break
      case 'config':
        content = generateMCPConfig(mcp)
        filename = `${mcp.name.toLowerCase().replace(/\s+/g, '-')}-config.yaml`
        mimeType = 'text/yaml'
        break
      case 'package':
        // For package, we'd typically create a zip file, but for simplicity, we'll provide a package.json
        content = generatePackageJson(mcp)
        filename = 'package.json'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateMCPCode = (mcp: MCP) => {
    return `// ${mcp.name}
// Generated MCP Implementation
// Description: ${mcp.description}

interface ${mcp.name.replace(/\s+/g, '')}MCP {
  name: string;
  version: string;
  description: string;
  capabilities: string[];
}

export class ${mcp.name.replace(/\s+/g, '')}Implementation {
  private config: ${mcp.name.replace(/\s+/g, '')}MCP;

  constructor() {
    this.config = {
      name: "${mcp.name}",
      version: "${mcp.version_number}",
      description: "${mcp.description}",
      capabilities: ${JSON.stringify(mcp.tags || [])}
    };
  }

  async execute(input: any): Promise<any> {
    // TODO: Implement ${mcp.name} logic here
    console.log('Executing ${mcp.name} with input:', input);
    
    // Placeholder implementation
    return {
      success: true,
      data: input,
      timestamp: new Date().toISOString()
    };
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  getMetadata() {
    return {
      name: this.config.name,
      version: this.config.version,
      description: this.config.description,
      performance_metrics: ${JSON.stringify(mcp.performance_metrics || {})}
    };
  }
}

// Export default instance
export default new ${mcp.name.replace(/\s+/g, '')}Implementation();
`
  }

  const generateMCPConfig = (mcp: MCP) => {
    return `# ${mcp.name} Configuration
# Generated configuration file

name: "${mcp.name}"
version: "${mcp.version_number}"
description: "${mcp.description}"

# Capabilities and Tags
capabilities:
${(mcp.tags || []).map(tag => `  - ${tag}`).join('\n')}

# Performance Settings
performance:
  success_rate: ${(mcp.performance_metrics as any)?.success_rate || 0.95}
  avg_execution_time: ${(mcp.performance_metrics as any)?.avg_execution_time || 2.0}

# Usage Statistics
usage:
  downloads: ${(mcp.usage_stats as any)?.downloads || 0}
  uses: ${(mcp.usage_stats as any)?.uses || 0}

# File Configuration
files:
  main: "${mcp.file_path || './index.ts'}"
  config: "./config.yaml"
  readme: "./README.md"

# Author Information
author:
  agent_id: "${mcp.creator_agent_id}"
  agent_name: "${getAgentName(mcp.creator_agent_id)}"
  created_at: "${mcp.created_at}"
`
  }

  const generatePackageJson = (mcp: MCP) => {
    return JSON.stringify({
      "name": mcp.name.toLowerCase().replace(/\s+/g, '-'),
      "version": mcp.version_number,
      "description": mcp.description,
      "main": "index.ts",
      "keywords": mcp.tags || [],
      "author": {
        "name": getAgentName(mcp.creator_agent_id),
        "agent_id": mcp.creator_agent_id
      },
      "license": "MIT",
      "dependencies": {
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0"
      },
      "scripts": {
        "build": "tsc",
        "start": "node dist/index.js",
        "dev": "ts-node index.ts"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "repository": {
        "type": "git",
        "url": "https://github.com/agent-academy/mcps"
      },
      "bugs": {
        "url": "https://github.com/agent-academy/mcps/issues"
      },
      "homepage": "https://agent-academy.dev"
    }, null, 2)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{mcp.name}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-white/70">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{getAgentName(mcp.creator_agent_id)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatTimeAgo(mcp.created_at)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${complexityClass}`}>
                      {complexity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(window.location.href, 'url')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Share MCP"
              >
                {copySuccess === 'url' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-white/70" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'code' 
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-4 h-4 mr-2 inline" />
            Implementation
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'usage' 
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4 mr-2 inline" />
            Usage & Stats
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-white/80 leading-relaxed">{mcp.description}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {mcp.tags?.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/10 text-white/80 border border-white/20">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {(mcp.usage_stats as any)?.downloads || 0}
                  </div>
                  <div className="text-sm text-white/70">Downloads</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {(mcp.usage_stats as any)?.uses || 0}
                  </div>
                  <div className="text-sm text-white/70">Uses</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {(((mcp.performance_metrics as any)?.success_rate || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-white/70">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {((mcp.performance_metrics as any)?.avg_execution_time || 0).toFixed(1)}s
                  </div>
                  <div className="text-sm text-white/70">Avg Time</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Implementation Code</h3>
                <button
                  onClick={() => handleCopy(generateMCPCode(mcp), 'code')}
                  className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                >
                  {copySuccess === 'code' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                  <span className="text-white/70">Copy</span>
                </button>
              </div>
              <pre className="bg-slate-900 rounded-lg p-4 text-sm text-white/90 overflow-x-auto">
                <code>{generateMCPCode(mcp)}</code>
              </pre>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              {/* Performance Chart Placeholder */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <Zap className="w-12 h-12 text-white/30 mx-auto mb-2" />
                  <p className="text-white/70">Performance charts will be available in the next update</p>
                </div>
              </div>

              {/* Usage Examples */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Usage Examples</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <code className="text-green-400">import mcp from './{mcp.name.toLowerCase().replace(/\s+/g, '-')}'</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <code className="text-blue-400">const result = await mcp.execute(inputData)</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <code className="text-purple-400">console.log('Result:', result.data)</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Download Options */}
        <div className="bg-slate-700/50 p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/70">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download Options:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload('json')}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-medium"
              >
                JSON
              </button>
              <button
                onClick={() => handleDownload('code')}
                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm font-medium"
              >
                Code
              </button>
              <button
                onClick={() => handleDownload('config')}
                className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm font-medium"
              >
                Config
              </button>
              <button
                onClick={() => handleDownload('package')}
                className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm font-medium"
              >
                Package
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
