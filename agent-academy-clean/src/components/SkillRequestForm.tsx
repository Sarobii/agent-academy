import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { useAuth } from '@/contexts/AuthContext'
import { useRegistrationPrompts } from './RegistrationPrompt'
import { 
  Brain, 
  Send, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  X
} from 'lucide-react'

interface SkillRequestFormProps {
  isOpen: boolean
  onClose: () => void
}

const skillCategories = [
  'Data Analysis',
  'Web Development', 
  'Machine Learning',
  'API Integration',
  'Database Management',
  'UI/UX Design',
  'Security',
  'DevOps',
  'Testing',
  'Documentation'
]

const priorityLevels = [
  { value: 1, label: 'Low', color: 'text-green-400 bg-green-400/20' },
  { value: 2, label: 'Normal', color: 'text-blue-400 bg-blue-400/20' },
  { value: 3, label: 'Medium', color: 'text-yellow-400 bg-yellow-400/20' },
  { value: 4, label: 'High', color: 'text-orange-400 bg-orange-400/20' },
  { value: 5, label: 'Critical', color: 'text-red-400 bg-red-400/20' }
]

export default function SkillRequestForm({ isOpen, onClose }: SkillRequestFormProps) {
  const { createSkillRequest } = useAgentAcademy()
  const { isGuest } = useAuth()
  const { trackSkillRequest } = useRegistrationPrompts()
  const [skillName, setSkillName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priority, setPriority] = useState(3)
  const [customTag, setCustomTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()])
      setCustomTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      handleRemoveTag(tag)
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!skillName.trim()) {
      newErrors.skillName = 'Skill name is required'
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await createSkillRequest(
        skillName.trim(),
        description.trim(),
        selectedTags,
        priority
      )
      
      // Track skill request creation for registration prompts
      if (isGuest) {
        trackSkillRequest()
      }
      
      // Reset form
      setSkillName('')
      setDescription('')
      setSelectedTags([])
      setPriority(3)
      setCustomTag('')
      setErrors({})
      
      onClose()
    } catch (error) {
      console.error('Failed to create skill request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-800 rounded-xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Request New Skill</h2>
              <p className="text-sm text-white/70">
                {isGuest 
                  ? 'Describe the skill you need - we\'ll save it locally and you can submit it after signing up!' 
                  : 'Describe the skill you need and we\'ll assign it to our Builder agent'
                }
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Advanced Data Visualization, RESTful API Development"
              className={`
                w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                transition-all duration-200
                ${errors.skillName ? 'border-red-500/50 bg-red-500/10' : 'border-white/20'}
              `}
            />
            {errors.skillName && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.skillName}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of what this skill should do, what technologies it might involve, and how it would be used..."
              rows={4}
              className={`
                w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                transition-all duration-200 resize-none
                ${errors.description ? 'border-red-500/50 bg-red-500/10' : 'border-white/20'}
              `}
            />
            <div className="mt-1 flex justify-between items-center">
              {errors.description ? (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              ) : (
                <p className="text-sm text-white/50">
                  {description.length}/500 characters (minimum 20)
                </p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-5 gap-2">
              {priorityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setPriority(level.value)}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-all duration-200
                    ${priority === level.value
                      ? `${level.color} border-current`
                      : 'text-white/70 bg-slate-700/30 border-white/20 hover:bg-slate-700/50'
                    }
                  `}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Categories & Tags
            </label>
            
            {/* Predefined Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {skillCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleToggleTag(category)}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                    ${selectedTags.includes(category)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-slate-700/30 text-white/70 border border-white/20 hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {category}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                placeholder="Add custom tag..."
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                         hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                Add
              </button>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/50"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium
                       hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}