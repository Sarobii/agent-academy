import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Bot,
  Store,
  Activity,
  Brain,
  Users,
  Settings,
  HelpCircle,
  Lightbulb,
  Target
} from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  targetElement?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface TutorialProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Agent Academy!',
    description: 'Your AI-powered collaboration platform where agents work together to create amazing skills and tools.',
    icon: Bot,
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Welcome to Agent Academy!</h3>
          <p className="text-white/70">
            This is your AI-powered collaboration platform where intelligent agents work together 
            to create, enhance, and share skills through MCPs (Model Context Protocols).
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Pro Tip:</strong> Think of this as a living ecosystem where AI agents 
            continuously learn, collaborate, and build tools to help you accomplish your goals.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'agents',
    title: 'Meet Your AI Agents',
    description: 'Each agent has unique skills and personalities, working together as a team.',
    icon: Users,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Your AI Agent Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Builder Agent</h4>
            </div>
            <p className="text-white/70 text-sm">Specializes in creating new MCPs and implementing complex functionalities.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Optimizer Agent</h4>
            </div>
            <p className="text-white/70 text-sm">Focuses on improving performance and enhancing existing tools.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Collaborator Agent</h4>
            </div>
            <p className="text-white/70 text-sm">Manages skill transfers and facilitates agent cooperation.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Analyst Agent</h4>
            </div>
            <p className="text-white/70 text-sm">Provides insights and analyzes system performance metrics.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'marketplace',
    title: 'Explore the MCP Marketplace',
    description: 'Discover and download pre-built tools and capabilities created by agents.',
    icon: Store,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">MCP Marketplace</h3>
        <p className="text-white/70">
          The marketplace is where you'll find all the MCPs (Model Context Protocols) - 
          these are like apps or tools that agents have created.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">🔍 Search & Filter</h4>
            <p className="text-white/70 text-sm">Find MCPs by category, popularity, or specific functionality.</p>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">📊 Usage Stats</h4>
            <p className="text-white/70 text-sm">See download counts, success rates, and performance metrics.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">⭐ Reviews & Ratings</h4>
            <p className="text-white/70 text-sm">Check community feedback and quality ratings.</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">🚀 One-Click Install</h4>
            <p className="text-white/70 text-sm">Download and integrate MCPs instantly into your workflow.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'activities',
    title: 'Activity Theater - Watch Magic Happen',
    description: 'See real-time agent activities, collaborations, and skill transfers.',
    icon: Activity,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Activity Theater</h3>
        <p className="text-white/70">
          This is your live feed of everything happening in the agent ecosystem. 
          Watch as agents collaborate, transfer skills, and create new capabilities.
        </p>
        <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90">Builder Agent created MCP: Advanced Data Visualization</span>
            <span className="text-white/50">2m ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/90">Optimizer Agent enhanced skill: API Integration</span>
            <span className="text-white/50">5m ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-white/90">Collaborator Agent transferred skill to Analyst Agent</span>
            <span className="text-white/50">8m ago</span>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Live Updates:</strong> Activities update in real-time, so you can see 
            the collaborative AI ecosystem evolving as it happens.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'skill-requests',
    title: 'Request New Skills',
    description: 'Need something specific? Request new skills and watch agents build them for you.',
    icon: Brain,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Skill Request System</h3>
        <p className="text-white/70">
          Can't find what you need in the marketplace? Request a custom skill! 
          Our Builder agent will automatically be assigned to create it for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-medium mb-2">1. Describe</h4>
            <p className="text-white/70 text-sm">Tell us what skill you need and how it should work.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">2. Assign</h4>
            <p className="text-white/70 text-sm">Request is automatically assigned to the Builder agent.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">3. Deliver</h4>
            <p className="text-white/70 text-sm">Get notified when your custom MCP is ready!</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'controls',
    title: 'Control Panel - Your Command Center',
    description: 'Manage agents, trigger actions, and control the ecosystem.',
    icon: Settings,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Control Panel</h3>
        <p className="text-white/70">
          Your command center for managing the agent ecosystem. Trigger simulations, 
          create MCPs, and manage skill transfers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Play className="w-4 h-4 mr-2 text-green-400" />
              Agent Simulation
            </h4>
            <p className="text-white/70 text-sm">Trigger agent activities and watch them interact.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-400" />
              MCP Creation
            </h4>
            <p className="text-white/70 text-sm">Manually create new MCPs with custom parameters.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              Skill Transfer
            </h4>
            <p className="text-white/70 text-sm">Initiate skill sharing between specific agents.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-yellow-400" />
              Activity Generation
            </h4>
            <p className="text-white/70 text-sm">Generate background activities for a more dynamic system.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Ready to explore the collaborative AI ecosystem.',
    icon: CheckCircle,
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">You're All Set!</h3>
          <p className="text-white/70">
            You now understand the basics of Agent Academy. Start exploring, 
            request your first skill, and watch the AI agents work their magic!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2">Quick Start Tips:</h4>
            <ul className="text-green-300/80 text-sm space-y-1 text-left">
              <li>• Browse the MCP Marketplace first</li>
              <li>• Watch the Activity Theater for live updates</li>
              <li>• Request a skill to see agents in action</li>
              <li>• Check Analytics for system insights</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Need Help?</h4>
            <p className="text-blue-300/80 text-sm text-left">
              Use the help center accessible from any page, or restart this tutorial 
              anytime from the settings menu.
            </p>
          </div>
        </div>
      </div>
    )
  }
]

export default function InteractiveTutorial({ isOpen, onClose, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const currentStepData = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Interactive Tutorial</h2>
              <p className="text-sm text-white/70">
                Step {currentStep + 1} of {tutorialSteps.length}: {currentStepData.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-700/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Tutorial Progress</span>
            <span className="text-sm text-white/70">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-slate-700/30 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Skip Tutorial
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            {currentStep === tutorialSteps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 
                         text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 
                         transition-all duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Tutorial</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
                         text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 
                         transition-all duration-200"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}