import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import { Emblem, AllCommsData } from '../../types/types'
import './Commendations.scss'
import checkmark from '../../assets/img/Checkmark.svg'

// Faction names object - I should put that in a dedicated file
const factionNames: Record<string, {name: string, logo: string, banner: string}> = {
  ReapersBones: {
    name: "Reaper's Bones",
    logo: "assets/img/faction icons/Reaper's_Bones_icon.webp",
    banner: "assets/img/faction banners/Reaper's_Bones_banner.webp",
  },
  AthenasFortune: {
    name: "Athena's Fortune",
    logo: "assets/img/faction icons/Athena's_Fortune_icon.webp",
    banner: "assets/img/faction banners/Athena's_Fortune_banner.webp",
  },
  OrderOfSouls: {
    name: "Order of Souls",
    logo: "assets/img/faction icons/Order_of_Souls_icon.webp",
    banner: "assets/img/faction banners/Order_of_Souls_banner.webp",
  },
  BilgeRats: {
    name: "Bilge Rats",
    logo: "assets/img/faction icons/Bilge_Rats_icon.webp",
    banner: "assets/img/faction banners/Bilge_Rats_banner.webp",
  },
  CreatorCrew: {
    name: "Creator Crew",
    logo: "assets/img/faction icons/Creator_Crew_icon.webp",
    banner: "assets/img/faction banners/Creator_Crew_banner.webp",
  },
  TallTales: {
    name: "Tall Tales",
    logo: "assets/img/faction icons/Tall_Tales_icon.webp",
    banner: "assets/img/faction banners/Tall_Tales_banner.webp",
  },
  HuntersCall: {
    name: "Hunter's Call",
    logo: "assets/img/faction icons/The_Hunter's_Call_icon.webp",
    banner: "assets/img/faction banners/The_Hunter's_Call_banner.webp",
  },
  MerchantAlliance: {
    name: "Merchant Alliance",
    logo: "assets/img/faction icons/Merchant_Alliance_icon.webp",
    banner: "assets/img/faction banners/Merchant_Alliance_banner.webp",
  },
  SeaDogs: {
    name: "Sea Dogs",
    logo: "assets/img/faction icons/Sea_Dogs_icon.webp",
    banner: "assets/img/faction banners/Sea_Dogs_banner.webp",
  },
  GoldHoarders: {
    name: "Gold Hoarders",
    logo: "assets/img/faction icons/Gold_Hoarders_icon.webp",
    banner: "assets/img/faction banners/Gold_Hoarders_banner.webp",
  },
  PirateLord: {
    name: "Guardians of Fortune",
    logo: "assets/img/faction icons/Athena's_Fortune_icon.webp",
    banner: "assets/img/faction banners/Guardians_of_Fortune_banner.webp",
  },
  Flameheart: {
    name: "Servants of the Flame",
    logo: "assets/img/faction icons/Reaper's_Bones_icon.webp",
    banner: "assets/img/faction banners/Servants_of_the_Flame_banner.webp",
  }
}


const Commendations = () => {
  const [emblems, setEmblems] = useState<AllCommsData>({})
  const [hideCompleted, setHideCompleted] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem('token')

  // Function to fetch emblems
  useEffect(() => {
    const fetchEmblems = async () => {
      try {
        const response = await fetch('https://sot-tracker-api.onrender.com/api/emblems/fetch', {
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
        setError('There was an error fetching the data.')
      } finally {
        setLoading(false)
      }
    }

    fetchEmblems()
  }, [token]) // Fetch only on component mount or token change

  // Handle loading state
  if (loading) {
    return <div className="loading-container">Loading commendations...</div>
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        {!token && <Link to="/SoT-Tracker/login">Log in here</Link>}
        {token && <Link to="/SoT-Tracker">Try logging out and logging in again.</Link>}
      </div>
    )
  }

  // Function to toggle completed commendations visibility
  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted)
  }

  // Function to check search match
  const matchesSearch = (emblem: Emblem) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      emblem.DisplayName.toLowerCase().includes(searchLower) ||
      emblem.Description.toLowerCase().includes(searchLower)
    )
  }

  return (
    <section id="all-commendations">

      {/* FILTER BARS et tout */}
      <div className="filters">
        <button className="toggle-button" onClick={toggleHideCompleted}>
          {hideCompleted ? 'Show Completed' : 'Hide Completed'}
        </button>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search through commendations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />



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
                  <h2>{`${factionNames[factionKey].name}`}</h2>
                  <h3>{`${completedEmblems}/${totalEmblems}${level ? ` (Level: ${level})` : ''}`}</h3>
                  <div className='banner-container'>
                    <img
                      className='faction-banner'
                      src={factionNames[factionKey].banner}
                      alt={`${factionNames[factionKey].name} banner`}
                      />
                  </div>
                {completedEmblems === totalEmblems && <img src={checkmark} alt='Completion checkmark' className='checkmark'/> }
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
                            <EmblemCard key={`main-${index}`} emblem={emblem} />
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
