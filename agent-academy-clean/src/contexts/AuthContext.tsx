import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string
  avatar_url?: string
  guest_data: any
  preferences: {
    theme: string
    notifications: boolean
    [key: string]: any
  }
  subscription_status: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  guestId: string
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => Promise<void>
  migrateGuestData: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  setGuestPreferences: (preferences: any) => void
  getGuestPreferences: () => any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const GUEST_ID_KEY = 'agent_academy_guest_id'
const GUEST_DATA_KEY = 'agent_academy_guest_data'
const GUEST_PREFERENCES_KEY = 'agent_academy_guest_preferences'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestId, setGuestId] = useState('')

  const isGuest = !user

  // Initialize guest ID
  useEffect(() => {
    let storedGuestId = localStorage.getItem(GUEST_ID_KEY)
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(GUEST_ID_KEY, storedGuestId)
    }
    setGuestId(storedGuestId)
  }, [])

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        setUser(user)
        
        if (user) {
          await fetchUserProfile(user.id)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        throw error
      }
      
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error('Supabase auth signup error:', error)
        throw error
      }
      
      // If user is immediately available (email confirmation disabled), wait for profile creation
      if (data.user && data.session) {
        // Give the trigger time to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try to fetch the profile, with retries
        let retries = 3
        while (retries > 0) {
          try {
            await fetchUserProfile(data.user.id)
            break
          } catch (profileError) {
            console.warn(`Profile fetch attempt ${4 - retries} failed:`, profileError)
            retries--
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            } else {
              // If profile still doesn't exist, create it manually
              console.log('Creating user profile manually...')
              try {
                const { error: insertError } = await supabase
                  .from('user_profiles')
                  .insert({
                    user_id: data.user.id,
                    email: data.user.email,
                    full_name: fullName || data.user.email?.split('@')[0] || 'User',
                    preferences: { theme: 'dark', notifications: true },
                    subscription_status: 'free'
                  })
                
                if (insertError) {
                  console.error('Error creating user profile manually:', insertError)
                  throw new Error(`Database error saving new user: ${insertError.message}`)
                }
                
                // Fetch the manually created profile
                await fetchUserProfile(data.user.id)
              } catch (createError) {
                console.error('Failed to create user profile:', createError)
                throw new Error('Database error saving new user')
              }
            }
          }
        }
      }
      
      return data
    } catch (error: any) {
      console.error('SignUp error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const migrateGuestData = async () => {
    if (!user || !profile) return

    try {
      const guestData = localStorage.getItem(GUEST_DATA_KEY)
      const guestPreferences = localStorage.getItem(GUEST_PREFERENCES_KEY)

      const dataToMigrate = {
        ...(guestData ? JSON.parse(guestData) : {}),
        preferences: guestPreferences ? JSON.parse(guestPreferences) : {},
        migrated_at: new Date().toISOString(),
      }

      await supabase
        .from('user_profiles')
        .update({ 
          guest_data: dataToMigrate,
          preferences: {
            ...profile.preferences,
            ...(dataToMigrate.preferences || {}),
          },
        })
        .eq('user_id', user.id)

      // Clear guest data from localStorage
      localStorage.removeItem(GUEST_DATA_KEY)
      localStorage.removeItem(GUEST_PREFERENCES_KEY)
      
      // Refresh profile
      await fetchUserProfile(user.id)
    } catch (error) {
      console.error('Error migrating guest data:', error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

      if (error) throw error
      await fetchUserProfile(user.id)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const setGuestPreferences = (preferences: any) => {
    localStorage.setItem(GUEST_PREFERENCES_KEY, JSON.stringify(preferences))
  }

  const getGuestPreferences = () => {
    const stored = localStorage.getItem(GUEST_PREFERENCES_KEY)
    return stored ? JSON.parse(stored) : { theme: 'dark', notifications: true }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isGuest,
    guestId,
    signIn,
    signUp,
    signOut,
    migrateGuestData,
    updateProfile,
    setGuestPreferences,
    getGuestPreferences,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}