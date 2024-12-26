import './Commendations.scss'
import { useState } from 'react'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import UserSelector from '../../components/UserSelector/UserSelector'

import hyrulData from '../../assets/user-data/hyrul.json'
import user2DataJson from '../../assets/user-data/user2.json'
import user3DataJson from '../../assets/user-data/user3.json'

import checkmark from '../../assets/img/Checkmark.svg'

import { Emblem } from '../../types/types'

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
};

function Commendations() {
  const [hideCompleted, setHideCompleted] = useState(true)
  const [allCommsData, setCommsData] = useState (hyrulData)
  const [searchQuery, setSearchQuery] = useState("")

const toggleHideCompleted = () => {
  setHideCompleted(!hideCompleted)
}

const user2Data = user2DataJson as any
const user3Data = user3DataJson as any

const handleDataSelection = (selected: string) => {
  if (selected === 'hyrul') {
    setCommsData(hyrulData)
  } else if (selected === 'user2') {
    setCommsData(user2Data)
  } else if (selected === 'user3') {
    setCommsData(user3Data)
  }
}

const matchesSearch = (emblem: Emblem) => {
  const searchLower = searchQuery.toLowerCase();
  return (
    emblem.DisplayName.toLowerCase().includes(searchLower) ||
    emblem.Description.toLowerCase().includes(searchLower)
  );
};


  return (
    <section id="all-commendations">
      <div className='filters'>

      <button className='toggle-button' onClick={toggleHideCompleted}>
          {hideCompleted ? 'Show Completed' : 'Hide Completed'}
        </button>
        <UserSelector onChange={handleDataSelection}/>
      </div>

      {/* Search Bar */}
      <input
          type="text"
          className="search-bar"
          placeholder="Search through commendations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      {/* skip les guildes */}
      {Object.entries(allCommsData)
      .filter(([factionKey]) => factionNames[factionKey])
      .map(([factionKey, factionData]) => {
        const mainEmblems = 'Emblems' in factionData
            ? factionData.Emblems?.Emblems || [] : []

            const filteredMainEmblems = mainEmblems.filter((emblem) =>
              matchesSearch(emblem)
            );
        
        const campaigns = 'Campaigns' in factionData && factionData.Campaigns ? Object.entries(factionData.Campaigns) : []

        const filteredCampaigns = campaigns.map(([campaignKey, campaign]) => ({
          key: campaignKey,
          title: campaign.Title,
          emblems: (campaign.Emblems || []).filter(matchesSearch),
        }));


        const totalEmblems =
            filteredMainEmblems.length +
            filteredCampaigns.reduce(
              (count, campaign) => count + campaign.emblems.length,
              0
            );

            const completedEmblems =
            filteredMainEmblems.filter((emblem) => emblem.Completed ?? false).length +
            filteredCampaigns.reduce(
              (count, campaign) =>
                count +
                (campaign.emblems || [])
                  .filter((emblem: Partial<Emblem>) => emblem.Completed ?? false).length,
              0
            );

        // const level = 'Level' in factionData ? factionData.Level : 0
        const level = 0 // Temporary - I wanna keep the possibility to reintroduce level display quickly later on if i change my mind


        // Comportement normal (SANS CAMPAIGN)
        return (
          <Dropdown
            key={factionKey}
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
            content={
              <div>
                {/* Main faction emblems */}
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
                    if (campaign.emblems.length === 0) return null;

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
                  );
                })}
              </div>
            }
          />
        );
      })}
  </section>
)}

export default Commendations