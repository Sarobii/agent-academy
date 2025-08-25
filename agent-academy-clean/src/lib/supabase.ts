import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihbeqctjknvdmsnwvpjc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYmVxY3Rqa252ZG1zbnd2cGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMzU0MDYsImV4cCI6MjA3MDYxMTQwNn0.sLE2un3F5Q5q7gLD82qK-bFYEvlPiGiyPDwR8cOOjQs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Agent {
  id: string
  name: string
  role: string
  skills: string[]
  status: string
  personality: {
    traits: string[]
    creativity: number
    risk_tolerance: number
  }
  preferences: {
    collaboration_frequency: string
    [key: string]: any
  }
  created_at: string
  updated_at: string
}

export interface MCP {
  id: string
  name: string
  description: string
  creator_agent_id: string
  tags: string[]
  usage_stats: {
    downloads: number
    uses: number
  }
  performance_metrics: {
    success_rate: number
    avg_execution_time: number
  }
  file_path: string
  version_number: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  type: string
  description: string
  associated_mcp_id?: string
  difficulty_level: number
  category: string
  prerequisites: string[]
  outcomes: string[]
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  agent_id: string
  activity_type: string
  description: string
  metadata: any
  related_mcp_id?: string
  related_skill_id?: string
  related_collaboration_id?: string
  status: string
  duration_seconds?: number
  created_at: string
}

export interface Collaboration {
  id: string
  source_agent_id: string
  target_agent_id: string
  skill_id?: string
  mcp_id?: string
  type: string
  status: string
  metadata: any
  outcome?: string
  created_at: string
  updated_at: string
}

export interface SkillRequest {
  id: string
  user_id?: string
  skill_name: string
  description: string
  tags: string[]
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assigned_agent_id?: string
  mcp_id?: string
  priority: number
  metadata: any
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id?: string
  title: string
  message: string
  type: 'skill_request' | 'mcp_creation' | 'skill_transfer' | 'enhancement' | 'system'
  related_id?: string
  is_read: boolean
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id?: string
  email_notifications: boolean
  in_app_notifications: boolean
  notification_types: {
    skill_request: boolean
    mcp_creation: boolean
    skill_transfer: boolean
    enhancement: boolean
    system: boolean
  }
  theme: string
  language: string
  created_at: string
  updated_at: string
}

export interface TutorialProgress {
  id: string
  user_id?: string
  tutorial_id: string
  step_number: number
  completed: boolean
  skipped: boolean
  created_at: string
  updated_at: string
}