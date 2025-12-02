import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'essentiel' | 'pro' | 'business'
  hasAccess: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Erreur parsing user:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user && user.hasAccess

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}

// Fonction helper pour simuler une connexion (pour démo)
export function simulateLogin() {
  const demoUser: User = {
    id: 'demo_user',
    email: 'demo@example.com',
    name: 'Utilisateur Démo',
    plan: 'pro',
    hasAccess: true
  }
  localStorage.setItem('user', JSON.stringify(demoUser))
  window.location.reload()
}
