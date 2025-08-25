import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentAcademy } from '@/hooks/useAgentAcademy'
import { 
  Bell,
  BellRing,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Clock,
  Brain,
  Zap,
  AlertCircle,
  Settings
} from 'lucide-react'

const notificationIcons = {
  skill_request: Brain,
  mcp_creation: Zap,
  skill_transfer: CheckCircle,
  enhancement: AlertCircle,
  system: Settings
}

const notificationColors = {
  skill_request: 'text-purple-400 bg-purple-400/20',
  mcp_creation: 'text-blue-400 bg-blue-400/20',
  skill_transfer: 'text-green-400 bg-green-400/20',
  enhancement: 'text-yellow-400 bg-yellow-400/20',
  system: 'text-gray-400 bg-gray-400/20'
}

export default function NotificationBell() {
  const { notifications, unreadNotificationCount, markNotificationsAsRead } = useAgentAcademy()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const buttonRect = buttonRef.current!.getBoundingClientRect()
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        
        setDropdownPosition({
          top: buttonRect.bottom + scrollY + 8, // 8px gap
          left: buttonRect.right + scrollX - 384 // 384px = w-96 width, align to right edge
        })
      }
      
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadNotificationCount > 0) {
      setHasNewNotifications(true)
      const timer = setTimeout(() => setHasNewNotifications(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [unreadNotificationCount])

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsAsRead(undefined, true)
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead([notificationId])
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const notificationDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const NotificationDropdown = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="fixed w-96 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left,
            zIndex: 99999
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-700/50 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
                {unreadNotificationCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {unreadNotificationCount} new
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/70 text-sm">No notifications yet</p>
                <p className="text-white/50 text-xs mt-1">We'll notify you when there's something new!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {notifications.slice(0, 10).map((notification) => {
                  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons]
                  const colorClass = notificationColors[notification.type as keyof typeof notificationColors]
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        px-4 py-3 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer
                        ${!notification.is_read ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''}
                      `}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.id)
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-white' : 'text-white/90'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <span className="text-xs text-white/50 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {getTimeAgo(notification.created_at)}
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs mt-1 ${!notification.is_read ? 'text-white/80' : 'text-white/60'}`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="px-4 py-3 bg-slate-700/30 border-t border-white/10">
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-all duration-200
          ${isOpen 
            ? 'bg-slate-700 text-white' 
            : 'text-white/70 hover:text-white hover:bg-slate-700/50'
          }
          ${hasNewNotifications ? 'animate-bounce' : ''}
        `}
      >
        {unreadNotificationCount > 0 ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {/* Badge */}
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Portal for notification dropdown - renders outside of stacking context */}
      {createPortal(<NotificationDropdown />, document.body)}
    </>
  )
}