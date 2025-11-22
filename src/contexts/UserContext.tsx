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
  refreshScore: () => Promise<void>
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
  refreshScore: async () => {}
}

const UserContext = createContext<UserContextType>(defaultContext)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [score, setScore] = useState<Score>(defaultScore)
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return
      
      const data = await getScore(token)
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
    await fetchScore()
  }

  const value: UserContextType = {
    score,
    username,
    loading,
    refreshScore
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