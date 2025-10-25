import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { AllCommsData } from '../../types/types'
import './Commendations.scss'
import FiltersBar from './Components/FiltersBar'
import FactionDropdown from './Components/FactionDropdown'


// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

// Faction names object - I should put that in a dedicated file
const factionNames: Record<string, {name: string, logo: string, banner: string}> = {
  ReapersBones: {
    name: "Reaper's Bones",
    logo: "assets/img/faction logos/Reaper's_Bones_logo.webp",
    banner: "assets/img/faction banners/Reaper's_Bones_banner.webp",
  },
  AthenasFortune: {
    name: "Athena's Fortune",
    logo: "assets/img/faction logos/Athena's_Fortune_logo.webp",
    banner: "assets/img/faction banners/Athena's_Fortune_banner.webp",
  },
  OrderOfSouls: {
    name: "Order of Souls",
    logo: "assets/img/faction logos/Order_of_Souls_logo.webp",
    banner: "assets/img/faction banners/Order_of_Souls_banner.webp",
  },
  BilgeRats: {
    name: "Adventures at Sea",
    logo: "assets/img/faction logos/Adventures_at_Sea_logo.webp",
    banner: "assets/img/faction banners/Bilge_Rats_banner.webp",
  },
  CreatorCrew: {
    name: "Creator Crew",
    logo: "assets/img/faction logos/Creator_Crew_logo.webp",
    banner: "assets/img/faction banners/Creator_Crew_banner.webp",
  },
  TallTales: {
    name: "Tall Tales",
    logo: "assets/img/faction logos/Tall_Tales_logo.webp",
    banner: "assets/img/faction banners/Tall_Tales_banner.webp",
  },
  HuntersCall: {
    name: "Hunter's Call",
    logo: "assets/img/faction logos/The_Hunter's_Call_logo.webp",
    banner: "assets/img/faction banners/The_Hunter's_Call_banner.webp",
  },
  MerchantAlliance: {
    name: "Merchant Alliance",
    logo: "assets/img/faction logos/Merchant_Alliance_logo.webp",
    banner: "assets/img/faction banners/Merchant_Alliance_banner.webp",
  },
  SeaDogs: {
    name: "Sea Dogs",
    logo: "assets/img/faction logos/Sea_Dogs_logo.webp",
    banner: "assets/img/faction banners/Sea_Dogs_banner.webp",
  },
  GoldHoarders: {
    name: "Gold Hoarders",
    logo: "assets/img/faction logos/Gold_Hoarders_logo.webp",
    banner: "assets/img/faction banners/Gold_Hoarders_banner.webp",
  },
  PirateLord: {
    name: "Guardians of Fortune",
    logo: "assets/img/faction logos/Athena's_Fortune_logo.webp",
    banner: "assets/img/faction banners/Guardians_of_Fortune_banner.webp",
  },
  Flameheart: {
    name: "Servants of the Flame",
    logo: "assets/img/faction logos/Reaper's_Bones_logo.webp",
    banner: "assets/img/faction banners/Servants_of_the_Flame_banner.webp",
  }
}


const Commendations = () => {
  const [emblems, setEmblems] = useState<AllCommsData>({})
  const [hideCompleted, setHideCompleted] = useState(true)
  const [showRewards, setShowRewards] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSticky, setIsSticky] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem('token')

  // Function to fetch emblems
  useEffect(() => {
    const fetchEmblems = async () => {
      try {
        const response = await fetch(`${apiUrl}/data/emblems`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data.')
        }

        const data: AllCommsData = await response.json() // Ensure response matches `AllCommsData`
        setEmblems(data) // Set fetched data
        setError(null)
      } catch (err) {
        setError(`There was an error fetching the data : ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchEmblems()
  }, [token]) // Fetch only on component mount or token change



  // Listening to scroll events to toggle the sticky header
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  })

  const handleScroll = useCallback(() => {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    setIsSticky(window.scrollY > headerHeight);
  }, []);

  const refreshData = async () => {
    setRefreshing(true)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/data/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh data.');
      }
  
      // Fetch the updated data
      const updatedResponse = await fetch(`${apiUrl}/data/emblems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated data.');
      }
  
      const updatedData: AllCommsData = await updatedResponse.json();
      setEmblems(updatedData) // Update the state
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh commendations.')
    } finally {
      setRefreshing(false)
    }
  };

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
        {token && <Link to="/login" onClick={removeToken}>Try logging out and logging in again.</Link>}
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

return (
  <section id="all-commendations">
    <FiltersBar
      hideCompleted={hideCompleted}
      toggleHideCompleted={toggleHideCompleted}
      showRewards={showRewards}
      toggleShowRewards={toggleShowRewards}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      refreshData={refreshData}
      refreshing={refreshing}
      isSticky={isSticky}
    />

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
      ))}
  </section>
)}

export default Commendations