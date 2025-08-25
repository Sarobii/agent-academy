import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AgentAcademyProvider } from '@/hooks/useAgentAcademy'
import { AuthProvider } from '@/contexts/AuthContext'
import Dashboard from '@/components/Dashboard'
import './globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AgentAcademyProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <Dashboard />
          </div>
        </AgentAcademyProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App