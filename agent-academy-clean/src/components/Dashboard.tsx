import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { useAuth } from '@/contexts/AuthContext'
import AgentCard from './AgentCard'
import ActivityFeed from './ActivityFeed'
import SkillTransferVisualization from './SkillTransferVisualization'
import MCPMarketplace from './MCPMarketplace'
import ControlPanel from './ControlPanel'
import StatsOverview from './StatsOverview'
import SkillRequestsPanel from './SkillRequestsPanel'
import NotificationBell from './NotificationBell'
import EnhancedAnalyticsDashboard from './EnhancedAnalyticsDashboard'
import MCPEvolutionTracker from './MCPEvolutionTracker'
import InteractiveTutorial from './InteractiveTutorial'
import { UserMenu } from './AuthComponents'
import { RegistrationPrompt, useRegistrationPrompts } from './RegistrationPrompt'
import { 
  Bot, 
  Activity, 
  BookOpen, 
  Store, 
  Settings, 
  BarChart3, 
  Brain,
  GitBranch,
  HelpCircle,
  Lightbulb
} from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Agent Dashboard', icon: Bot },
  { id: 'activities', label: 'Activity Theater', icon: Activity },
  { id: 'skill-requests', label: 'Skill Requests', icon: Brain },
  { id: 'transfers', label: 'Skill Transfers', icon: BookOpen },
  { id: 'marketplace', label: 'MCP Marketplace', icon: Store },
  { id: 'evolution', label: 'MCP Evolution', icon: GitBranch },
  { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
  { id: 'control', label: 'Control Panel', icon: Settings },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const { agents, loading } = useAgentAcademy()
  const { isGuest, loading: authLoading } = useAuth()
  const { activePrompt, dismissPrompt, trackFeatureUsage } = useRegistrationPrompts()

  // Track tab changes for registration prompts
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (isGuest) {
      trackFeatureUsage(tabId)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading Agent Academy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Agent Academy</h1>
                <p className="text-sm text-white/70">AI Agent Collaboration Platform</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setIsTutorialOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 text-white/70 rounded-lg
                         hover:bg-slate-700 hover:text-white transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Tutorial</span>
              </button>
              <NotificationBell />
              <UserMenu />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/70">System Active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AgentCard agent={agent} />
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ActivityFeed limit={10} />
                </div>
                <div>
                  <StatsOverview />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'activities' && <ActivityFeed />}
          {activeTab === 'skill-requests' && <SkillRequestsPanel />}
          {activeTab === 'transfers' && <SkillTransferVisualization />}
          {activeTab === 'marketplace' && <MCPMarketplace />}
          {activeTab === 'evolution' && <MCPEvolutionTracker />}
          {activeTab === 'analytics' && <EnhancedAnalyticsDashboard />}
          {activeTab === 'control' && <ControlPanel />}
        </motion.div>
      </main>

      {/* Registration Prompt */}
      {activePrompt && (
        <RegistrationPrompt 
          trigger={activePrompt as any}
          onDismiss={dismissPrompt}
        />
      )}

      {/* Interactive Tutorial */}
      <InteractiveTutorial 
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={() => {
          setIsTutorialOpen(false)
          // Could save tutorial completion status here
        }}
      />
    </div>
  )
}