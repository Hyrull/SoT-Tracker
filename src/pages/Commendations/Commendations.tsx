import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { AllCommsData } from '../../types/types'
import './Commendations.scss'
import FiltersBar from './Components/FiltersBar'
import FactionDropdown from './Components/FactionDropdown'
import factionNames from './Data/FactionNames'
import DemoBanner from './Components/DemoBanner'
import NoCommendations from './Components/NoCommendations'


// quick toggle for me when working the backend
const apiUrl = 'http://localhost:10000/api'
// const apiUrl = 'https://backend.sot-tracker.com/api'

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
  const isDemo = !token

  // Function to fetch emblems
  useEffect(() => {
    const fetchEmblems = async () => {
      try {

        let response: Response

        if (isDemo) {
          // Fetching demo data, if user isn't logged in to any account
          response = await fetch('/data/exampleData.json')
        } else {
          response = await fetch(`${apiUrl}/data/emblems`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
        }

        if (response.status === 204) {
          // No data - fresh account, probably
          setEmblems({})
          setError(null)
          setLoading(false)
          return
        }
        
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
    if (isDemo) {
      return null
    } // Surely some smart ones will enable the sync button in the demo page to see what it'd do

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
      refreshData={refreshData}
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