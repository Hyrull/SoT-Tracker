import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { AllCommsData, Emblem, PinnedItem } from '../../types/types'
import './Commendations.scss'
import FiltersBar from './Components/FiltersBar'
import FactionDropdown from './Components/FactionDropdown'
import factionNames from './Data/FactionNames'
import DemoBanner from './Components/DemoBanner'
import NoCommendations from './Components/NoCommendations'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import { useToast } from '../../contexts/ToastContext'
import { fetchEmblems, refreshEmblems } from '../../services/emblems'
import { fetchPinned, addPinned, removePinned } from '../../services/pinned'
import { resolvePinnedEmblems, isEmblemPinned, createPinnedItem } from './Utils/pinnedUtils'
import dropdownArrow from '/assets/img/icons/Unfold.svg'
import pinnedLogo from '/assets/img/faction logos/Pinned_logo.webp'
import pinnedBanner from '/assets/img/faction banners/Favorites_banner.webp'



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

  // Resolve pinned items to full emblem objects
  const pinnedEmblems = useMemo(
    () => resolvePinnedEmblems(pinned, emblems),
    [pinned, emblems]
  )
  
  // Fetch emblems and pinned items on mount
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
      if (error) console.error('Error fetching pinned:', error)
    }

    getEmblems()
    if (!isDemo) {
      getPinned()
    }
  }, [token, isDemo])

  const handleRefreshClick = async () => {
    if (!token) return

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

const handleTogglePin = async (emblem: Emblem, factionKey?: string, campaignKey?: string) => {
  if (!factionKey) return

  // Demo mode - it'll be only locally
  if (isDemo) {
    const isPinned = isEmblemPinned(emblem, pinned, factionKey, campaignKey)
    
    if (isPinned) {
      // Remove from local state
      setPinned(pinned.filter(p => 
        !(p.faction === factionKey && 
          p.emblem === emblem.DisplayName && 
          p.campaign === campaignKey)
      ))
      showToast('Removed from favorites (demo mode - not saved)', 'info')
    } else {
      // Add to local state using the helper
      const newPin = createPinnedItem(emblem, factionKey, campaignKey)
      setPinned([...pinned, newPin])
      showToast('Added to favorites (demo mode - not saved)', 'info')
    }
    return
  }

  // user actually is authenticated so let's save it
  if (!token) return

  const isPinned = isEmblemPinned(emblem, pinned, factionKey, campaignKey)

  if (isPinned) {
    const { data, error } = await removePinned(
      token,
      emblem.DisplayName,
      factionKey,
      campaignKey
    )
    if (data) {
      setPinned(data)
      showToast('Removed from favorites', 'success')
    } else if (error) {
      showToast(error, 'error')
    }
  } else {
    const { data, error } = await addPinned(
      token,
      factionKey,
      emblem.DisplayName,
      campaignKey
    )
    if (data) {
      setPinned(data)
      showToast('Added to favorites', 'success')
    } else if (error) {
      if (!error.includes('already pinned')) {
        showToast(error, 'error')
      }
    }
  }
}

  // Scroll handling for sticky header
  const handleScroll = useCallback(() => {
    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 0
    setIsSticky(window.scrollY > headerHeight)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const removeToken = () => {
    localStorage.removeItem('token')
  }

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted)
  }

  const toggleShowRewards = () => {
    setShowRewards(!showRewards)
  }

  // Loading state
  if (loading) {
    return <div className="loading-container"><p>Loading commendations...</p></div>
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        {!token && <Link to="/login">Log in here</Link>}
        {token && (
          <span
            className='relog-button'
            onClick={() => {
              removeToken()
              navigate('/login')
              window.location.reload()
            }}
          >
            Log in again
          </span>
        )}
      </div>
    )
  }

  // No data state
  if (Object.keys(emblems).length === 0) {
    return <NoCommendations />
  }

  return (
    <section id="all-commendations">
      <div className={`offset ${isSticky ? 'active' : ''}`} />

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
                <div className={`progress-bar favorites`}
                  style={{
                    width: `100%`,
                  }}
                />
                <img
                  className='faction-icon'
                  src={pinnedLogo}
                  alt={'pinned section icon'}
                />
                <div className='faction-info'>
                  <div className='faction-text'>
                    <h2>Favorites</h2>
                    <h3>
                      {pinnedEmblems.length}{' '}
                      {pinnedEmblems.length === 1 ? 'commendation' : 'commendations'}
                    </h3>
                  </div>
                </div>
              <div>
                <img
                  className='faction-banner'
                  src={pinnedBanner}
                  alt={'favorites section banner'}
                  />
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
                    .filter((emblem) => !hideCompleted || !emblem.Completed)
                    .map((emblem, index) => (
                      <EmblemCard
                        key={`favorite-${index}`}
                        emblem={emblem}
                        showRewards={showRewards}
                        isPinned={true}
                        onTogglePin={handleTogglePin}
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
              pinned={pinned}
              onTogglePin={handleTogglePin}
            />
          ))}
      </ul>

      <DemoBanner isDemo={isDemo} />
    </section>
  )
}

export default Commendations