import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  Play,
  Pause,
  RotateCcw,
  Settings,
  Bot,
  Zap,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function ControlPanel() {
  const { agents, simulateAgent, createMCP, transferSkill, generateActivities } = useAgentAcademy()
  const [selectedAgent, setSelectedAgent] = useState('')
  const [mcpType, setMcpType] = useState('automation')
  const [complexity, setComplexity] = useState('medium')
  const [sourceAgent, setSourceAgent] = useState('')
  const [targetAgent, setTargetAgent] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [lastAction, setLastAction] = useState('')

  const handleSimulateAgent = async () => {
    setIsSimulating(true)
    setLastAction('Running agent simulation...')
    try {
      await simulateAgent()
      setLastAction('Agent simulation completed successfully')
    } catch (error) {
      setLastAction('Agent simulation failed')
    }
    setIsSimulating(false)
  }

  const handleCreateMCP = async () => {
    if (!selectedAgent) {
      setLastAction('Please select an agent first')
      return
    }
    
    setLastAction('Creating MCP...')
    try {
      await createMCP(selectedAgent, mcpType, complexity)
      setLastAction('MCP created successfully')
    } catch (error) {
      setLastAction('MCP creation failed')
    }
  }

  const handleTransferSkill = async () => {
    if (!sourceAgent || !targetAgent || !selectedSkill) {
      setLastAction('Please select source agent, target agent, and skill')
      return
    }
    
    setLastAction('Transferring skill...')
    try {
      await transferSkill(sourceAgent, targetAgent, selectedSkill)
      setLastAction('Skill transfer completed')
    } catch (error) {
      setLastAction('Skill transfer failed')
    }
  }

  const handleGenerateActivities = async () => {
    setLastAction('Generating new activities...')
    try {
      await generateActivities()
      setLastAction('Activities generated successfully')
    } catch (error) {
      setLastAction('Activity generation failed')
    }
  }

  const ControlCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="card-gradient rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Control Panel</h2>
            <p className="text-sm text-white/70">
              Manage agent behaviors and trigger simulations
            </p>
          </div>
        </div>
        
        {lastAction && (
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {lastAction.includes('successfully') || lastAction.includes('completed') ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : lastAction.includes('failed') ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            )}
            <span className="text-sm text-white/90">{lastAction}</span>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          onClick={handleSimulateAgent}
          disabled={isSimulating}
          className="card-gradient rounded-lg p-4 text-left hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            {isSimulating ? (
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Play className="w-5 h-5 text-green-400" />
            )}
            <span className="font-medium text-white">Run Simulation</span>
          </div>
          <p className="text-xs text-white/70">
            {isSimulating ? 'Running...' : 'Trigger agent behaviors'}
          </p>
        </motion.button>

        <motion.button
          onClick={handleGenerateActivities}
          className="card-gradient rounded-lg p-4 text-left hover:scale-105 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Generate Activities</span>
          </div>
          <p className="text-xs text-white/70">Create new agent activities</p>
        </motion.button>

        <motion.button
          className="card-gradient rounded-lg p-4 text-left hover:scale-105 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <RotateCcw className="w-5 h-5 text-orange-400" />
            <span className="font-medium text-white">Reset System</span>
          </div>
          <p className="text-xs text-white/70">Reset all agent states</p>
        </motion.button>

        <motion.button
          className="card-gradient rounded-lg p-4 text-left hover:scale-105 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Pause className="w-5 h-5 text-red-400" />
            <span className="font-medium text-white">Pause System</span>
          </div>
          <p className="text-xs text-white/70">Temporarily halt all activities</p>
        </motion.button>
      </div>

      {/* Detailed Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCP Creation */}
        <ControlCard
          title="Create MCP"
          description="Generate a new Model Control Protocol with specific parameters"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: '#33415580' }}
              >
                <option value="">Select an agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/70 mb-2">Type</label>
                <select
                  value={mcpType}
                  onChange={(e) => setMcpType(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: '#33415580' }}
                >
                  <option value="automation">Automation</option>
                  <option value="data_processing">Data Processing</option>
                  <option value="integration">Integration</option>
                  <option value="security">Security</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Complexity</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: '#33415580' }}
                >
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleCreateMCP}
              disabled={!selectedAgent}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Create MCP</span>
            </button>
          </div>
        </ControlCard>

        {/* Skill Transfer */}
        <ControlCard
          title="Transfer Skill"
          description="Facilitate knowledge transfer between agents"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/70 mb-2">Source Agent</label>
                <select
                  value={sourceAgent}
                  onChange={(e) => setSourceAgent(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: '#33415580' }}
                >
                  <option value="">Select source...</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Target Agent</label>
                <select
                  value={targetAgent}
                  onChange={(e) => setTargetAgent(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: '#33415580' }}
                >
                  <option value="">Select target...</option>
                  {agents.filter(agent => agent.id !== sourceAgent).map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Skill to Transfer</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none"
                style={{ backgroundColor: '#33415580' }}
              >
                <option value="" className="bg-gray-800 text-white">Select a skill...</option>
                {sourceAgent && agents.find(a => a.id === sourceAgent)?.skills?.map((skill, index) => (
                  <option key={index} value={skill} className="bg-gray-800 text-white">{skill}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleTransferSkill}
              disabled={!sourceAgent || !targetAgent || !selectedSkill}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Transfer Skill</span>
            </button>
          </div>
        </ControlCard>
      </div>

      {/* System Status */}
      <ControlCard
        title="System Status"
        description="Monitor the current state of the agent academy system"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Bot className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-lg font-semibold text-white">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-xs text-white/70">Active Agents</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-semibold text-white">24/7</div>
            <div className="text-xs text-white/70">System Uptime</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-lg font-semibold text-white">98%</div>
            <div className="text-xs text-white/70">Performance</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Settings className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-lg font-semibold text-white">All Systems</div>
            <div className="text-xs text-white/70">Operational</div>
          </div>
        </div>
      </ControlCard>
    </div>
  )
}