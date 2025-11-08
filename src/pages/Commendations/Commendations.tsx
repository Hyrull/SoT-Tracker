import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router'
import { AllCommsData } from '../../types/types'
import './Commendations.scss'
import FiltersBar from './Components/FiltersBar'
import FactionDropdown from './Components/FactionDropdown'
import factionNames from './Data/FactionNames'
import DemoBanner from './Components/DemoBanner'
import NoCommendations from './Components/NoCommendations'
import { useToast } from '../../contexts/ToastContext'
import { fetchEmblems, refreshEmblems } from '../../services/emblems'

const Commendations = () => {
  const navigate = useNavigate()
  const [emblems, setEmblems] = useState<AllCommsData>({})
  const [hideCompleted, setHideCompleted] = useState(true)
  const [showRewards, setShowRewards] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const token = localStorage.getItem('token')
  const isDemo = !token
  const { showToast } = useToast()
  
  // Function to fetch emblems
useEffect(() => {
  const getEmblems = async () => {
    setLoading(true)
    const { data, error } = await fetchEmblems(token, isDemo)
    setEmblems(data)
    if (error) setError(error)
    else setError(null)
    setLoading(false)
  }

  getEmblems()
}, [token])


const handleRefreshClick = async () => {
  if (!token) return // failproof for demo mode

  setRefreshing(true)
  const { data, error } = await refreshEmblems(token, isDemo)
  if (data) {
    setEmblems(data)
    showToast('Data successfully refreshed!', 'success')
  } else if (error) {
    showToast(error, 'error')
  }
  setRefreshing(false)
}

  // Listening to scroll events to toggle the sticky header
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = useCallback(() => {
    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 0
    setIsSticky(window.scrollY > headerHeight)
  }, [])

  const removeToken = () => {
    localStorage.removeItem('token')
  }
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  // Handle loading state
  if (loading) {
    // TO-DO : skeleton display
    return <div className="loading-container"><p>Loading commendations...</p></div>
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        {!token && <Link to="/login">Log in here</Link>}
        {token && <span className='relog-button' onClick={() => {
          removeToken()
          navigate('/login')
          window.location.reload()
        }}>Log in again</span>}
      </div>
    )
  }

  // Function to toggle completed commendations visibility
  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted)
  }

  const toggleShowRewards = () => {
    setShowRewards(!showRewards)
  }

  if (!error && !loading && Object.keys(emblems).length === 0) {
  return <NoCommendations />
  }

return (
  <section id="all-commendations">
    <div className={`offset ${isSticky ? 'active' : ''}`} />
    {/* Empty div with the FiltersBar height to prevent offset when the FilterBar becomes sticky on top of the screen (thus pushing everything up for its height) */}

    <FiltersBar
      hideCompleted={hideCompleted}
      toggleHideCompleted={toggleHideCompleted}
      showRewards={showRewards}
      toggleShowRewards={toggleShowRewards}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      refreshData={handleRefreshClick}
      refreshing={refreshing}
      isSticky={isSticky}
      isDemo={isDemo}
    />


    <ul>
    {Object.entries(emblems)
      .filter(([factionKey]) => factionNames[factionKey])
      .map(([factionKey, factionData]) => (
        <FactionDropdown
        key={factionKey}
        factionKey={factionKey}
        factionData={factionData}
        hideCompleted={hideCompleted}
        showRewards={showRewards}
        searchQuery={searchQuery}
        />
      ))
    }
    </ul>

    <DemoBanner isDemo={isDemo} />
    
  </section>
)}

export default Commendations