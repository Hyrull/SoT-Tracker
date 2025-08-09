import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import { Emblem, AllCommsData } from '../../types/types'
import './Commendations.scss'
import checkmark from '/assets/img/icons/sot_checkmark.svg'
import refresh from '/assets/img/icons/refresh.svg'
import crossIcon from '/assets/img/icons/Cross.svg'
import searchIcon from '/assets/img/icons/search.svg'

// const apiUrl = 'https://sot-tracker-api.onrender.com/api'
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
    name: "Bilge Rats",
    logo: "assets/img/faction logos/Bilge_Rats_logo.webp",
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
  }, [])

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

  // Function to check search match
  const matchesSearch = (emblem: Emblem) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      emblem.DisplayName.toLowerCase().includes(searchLower) ||
      emblem.Description?.toLowerCase().includes(searchLower) ||
      emblem.reward?.toLowerCase().includes(searchLower) ||
      emblem.reward_graded?.some(r => r.reward.toLowerCase().includes(searchLower))
    )
  }
// Note that "Description?" implies that it's an optional field - the data merge currently doesn't check if the user's commendation exists in the data. This is a workaround before I fix this!


  return (
    <section id="all-commendations">

      {/* FILTER BARS et tout */}
      <div className={`filters ${isSticky ? 'sticky' : ''}`}>
        <div className='empty-div-on-purpose'></div>
          <div className='toggle-and-search'>
          <button className={`toggle-button ${hideCompleted ? 'off' : 'on'}`} onClick={toggleHideCompleted}>
            <span className="toggle-text">Show Completed</span>
            <span className="slider">
              <span className="slider-handle"></span>
            </span>
          </button>
          <div className='search-bar-container'>
            <input
              type="text"
              className="search-bar"
              placeholder="Search through commendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label='Search commendations'
            />
            <button className='clear-search'
              onClick={() => setSearchQuery('')} 
              aria-label='Clear search' 
              style={{ visibility: searchQuery ? 'visible' : 'hidden' }}>
                <img src={crossIcon} alt="Clear search" />
            </button>
            <img src={searchIcon} alt="Search icon" style={{ visibility: searchQuery ? 'hidden' : 'visible' }} className='search-icon'/>
          </div>
          <button className={`toggle-button ${showRewards ? 'on' : 'off'}`} onClick={toggleShowRewards}>
            <span className="toggle-text">Show Rewards</span>
            <span className="slider">
              <span className="slider-handle"></span>
            </span>
          </button>
        </div>
        <button 
        onClick={refreshData} 
        disabled={refreshing} 
        className={refreshing ? 'refresh-button refreshing' : 'refresh-button'}>
        <img src={refresh} alt="Refresh Icon" />
        </button>
      </div>



      {Object.entries(emblems)
        .filter(([factionKey]) => factionNames[factionKey]) // Filter out unknown factions (guilds)

        // Mapping the data
        .map(([factionKey, factionData]) => {
          const mainEmblems = factionData.Emblems?.Emblems || [] // Access main emblems - sometimes emblems are nested in campaigns
          const filteredMainEmblems = mainEmblems.filter(matchesSearch) // Applying the search filter

          // Campaigns handling
          const campaigns = factionData.Campaigns ? Object.entries(factionData.Campaigns) : []
          const filteredCampaigns = campaigns.map(([campaignKey, campaign]) => ({
            key: campaignKey,
            title: campaign.Title,
            emblems: (campaign.Emblems || []).filter(matchesSearch),
          }))


          // Calculating total and completed emblems
          const totalEmblems =
            filteredMainEmblems.length +
            filteredCampaigns.reduce((count, campaign) => count + campaign.emblems.length, 0)

          const completedEmblems =
            filteredMainEmblems.filter((emblem) => emblem.Completed).length +
            filteredCampaigns.reduce(
              (count, campaign) =>
                count + campaign.emblems.filter((emblem) => emblem.Completed).length,
              0
            )

          const level = 0 // Temporary placeholder for level


          // TIME TO ACTUALLY DISPLAY ALL OF IT
          return (
            <Dropdown
              key={factionKey}

              // FACTION HEADER STUFF
              title={
                <>
                <div className='faction-header'>
                  <img
                    className='faction-icon'
                    src={factionNames[factionKey].logo}
                    alt={`${factionNames[factionKey].name} icon`}
                    />
                    <div className='faction-info'>
                      <div className='faction-text'>
                        <h2>{`${factionNames[factionKey].name}`}</h2>
                        <h3>{`${completedEmblems}/${totalEmblems}${level ? ` (Level: ${level})` : ''}`}</h3>
                      </div>
                    {completedEmblems === totalEmblems && <img src={checkmark} alt='Completion checkmark' className='checkmark'/> }
                    </div>
                  <div>
                    <img
                      className='faction-banner'
                      src={factionNames[factionKey].banner}
                      alt={`${factionNames[factionKey].name} banner`}
                      />
                  </div>
                </div>
              </>
            }

            // ALL THE ACTUAL COMMENDATIONS
              content={
                <div>
                  {/* Simple ones */}
                  {filteredMainEmblems.length > 0 && (
                    <div className="category">
                      <div className="emblems">
                        {filteredMainEmblems
                          .filter((emblem) => (!hideCompleted || !emblem.Completed) && matchesSearch(emblem))
                          .map((emblem, index) => (
                            <EmblemCard key={`main-${index}`} emblem={emblem} showRewards={showRewards}/>
                          ))}
                      </div>
                    </div>
                  )}
  
  
  
                  {/* Campaigns */}
                  {/* Checker que si y a aucune commendation, alors on display même pas le nom de la catégorie */}
                  {filteredCampaigns.map((campaign) => {
                      if (campaign.emblems.length === 0) return null
  
                      // Campaign title display
                      return (
                        <div key={campaign.key} className="category">
                          <h3>{campaign.title}</h3>
                          <div className="emblems">
                            {campaign.emblems
                              .filter(
                                (emblem: Emblem) =>
                                  !hideCompleted || !emblem.Completed
                              )
                              .map((emblem: Emblem, index: number) => (
                                <EmblemCard
                                  key={`${campaign.key}-${index}`}
                                  emblem={emblem}
                                  showRewards={showRewards}
                                />
                              ))}
                          </div>
                        </div>
                    )
                  })}
                </div>
              }
            />
          )
        })}
    </section>
  )}

export default Commendations
