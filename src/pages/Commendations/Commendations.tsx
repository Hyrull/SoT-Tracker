import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { AllCommsData, Emblem, PinnedItem } from '../../types/types'
import './Commendations.scss'
import FiltersBar from './Components/FiltersBar'
import FactionDropdown from './Components/FactionDropdown'
import factionNames from './Data/FactionNames'
import DemoBanner from './Components/DemoBanner'
import NoCommendations from './Components/NoCommendations'
import { useToast } from '../../contexts/ToastContext'
import { fetchEmblems, refreshEmblems } from '../../services/emblems'
import { fetchPinned, addPinned, removePinned } from '../../services/pinned'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import dropdownArrow from '/assets/img/icons/Unfold.svg'
import pinnedLogo from '/assets/img/faction logos/Pinned_logo.webp'

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
  const [pinned, setPinned] = useState<PinnedItem[]>([])
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

    const getPinned = async () => {
      const { data, error } = await fetchPinned(token)
      setPinned(data)
      console.log(pinned)
      if (error) console.error('Error fetching pinned:', error)
    }

    getEmblems()
    getPinned()
  }, [token])


  const pinnedEmblems = useMemo(() => {
  const result: Emblem[] = []
    
    // HI let's get the pins and make them match the 'actual' comms, description,progress, img etc
  for (const pin of pinned) {
    const faction = pin.faction
    if (!emblems[faction]) continue

    const factionObj = emblems[faction]
    let found: Emblem | undefined = undefined

    // Search normal emblems
    const mainList = factionObj.Emblems?.Emblems || []
    found = mainList.find(e => e.DisplayName === pin.emblem)
    
    if (found) {
      result.push(found)
      continue
    }

    // Search in campaigns
    if (factionObj.Campaigns) {
      for (const campaign of Object.values(factionObj.Campaigns)) {
        const campList = campaign.Emblems || []
        found = campList.find(e => e.DisplayName === pin.emblem)
        if (found) {
          result.push(found)
          break
        }
      }
    }
  }

  return result
}, [pinned, emblems])


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
      {/* FAVORITES SECTION */}
      {pinnedEmblems.length > 0 && (
        <Dropdown
          key="favorites"
          title={({ displayContent }) => (
            <div className='faction-header favorites'>
              <img className='faction-icon'
              src={pinnedLogo}
              alt='pinned-section-logo' />
              <div className='faction-info'>
                <div className='faction-text'>
                  <h2>Favorites</h2>
                  <h3>{pinnedEmblems.length} {pinnedEmblems.length === 1 ? 'commendation' : 'commendations'}</h3>
                </div>
              </div>
              <img 
                src={dropdownArrow} 
                alt="Dropdown arrow" 
                className={`arrow ${displayContent ? 'rotate' : ''}`} 
              />
            </div>
          )}
          content={
            <div className="category">
              <ul>
                {pinnedEmblems
                  .filter((emblem) => (!hideCompleted || !emblem.Completed))
                  .map((emblem, index) => (
                    <EmblemCard 
                      key={`favorite-${index}`} 
                      emblem={emblem} 
                      showRewards={showRewards}
                    />
                  ))}
              </ul>
            </div>
          }
        />
      )}


      {/* NORMAL FACTION RENDERING */}
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