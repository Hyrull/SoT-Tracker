import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getScore } from '../services/score'

interface Score {
  current: number
  maximum: number
  percentage: string
}

interface UserContextType {
  score: Score
  username: string
  loading: boolean
  token: string | null 
  refreshScore: () => Promise<void>
  login: (token: string) => void
  logout: () => void
}

const defaultScore: Score = {
  current: 0,
  maximum: 0,
  percentage: '0'
}

const defaultContext: UserContextType = {
score: defaultScore,
  username: '',
  loading: true,
  token: null,
  refreshScore: async () => {},
  login: () => {},
  logout: () => {}
}

const UserContext = createContext<UserContextType>(defaultContext)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [score, setScore] = useState<Score>(defaultScore)
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchScore(token)
    } else {
      // Reset if no token
      setScore(defaultScore)
      setUsername('')
      setLoading(false)
    }
  }, [token])

  const fetchScore = async (activeToken: string) => {
    try {
      setLoading(true)
      const data = await getScore(activeToken)
      setScore({
        current: data.currentScore,
        maximum: data.maximumScore,
        percentage: data.percentage
      })
      setUsername(data.username)
    } catch (error) {
      console.error('Error fetching score:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshScore = async () => {
    if (token) await fetchScore(token)
  }

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const value: UserContextType = {
    score,
    username,
    loading,
    token,
    refreshScore,
    login,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext