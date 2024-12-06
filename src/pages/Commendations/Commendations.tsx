import './Commendations.scss'
import { useState } from 'react'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import UserSelector from '../../components/UserSelector/UserSelector'

import hyrulData from '../../assets/user-data/hyrul.json'
import user2DataJson from '../../assets/user-data/user2.json'
import user3DataJson from '../../assets/user-data/user3.json'

import checkmark from '../../assets/img/checkmark.webp'

import { Emblem } from '../../types/types'

const factionNames: Record<string, string> = {
  ReapersBones: "Reaper's Bones",
  AthenasFortune: "Athena's Fortune",
  OrderOfSouls: "Order of Souls",
  BilgeRats: "Bilge Rats",
  CreatorCrew: "Creator Crew",
  TallTales: "Tall Tales",
  HuntersCall: "Hunter's Call",
  MerchantAlliance: "Merchant Alliance",
  SeaDogs: "Sea Dogs",
  GoldHoarders: "Gold Hoarders",
  PirateLord: "Guardians of Fortune",
  Flameheart: "Servants of the Flame"
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
            filteredMainEmblems.filter((emblem) => emblem.Completed).length +
            filteredCampaigns.reduce(
              (count, campaign) =>
                count +
                campaign.emblems.filter((emblem) => emblem.Completed).length,
              0
            );

        // const level = 'Level' in factionData ? factionData.Level : 0
        const level = 0 // Temporary - I wanna keep the possibility to reintroduce level display quickly later on if i change my mind


        // Comportement normal (SANS CAMPAIGN)
        return (
          <Dropdown
            key={factionKey}
            title=
            <>
            {`${factionNames[factionKey]} - ${completedEmblems}/${totalEmblems}${level ? ` (Level: ${level})` : ''}`}
              {completedEmblems === totalEmblems && <img src={checkmark} alt='Completion checkmark' /> }
            </>
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