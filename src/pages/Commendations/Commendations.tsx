import './Commendations.scss'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import { useState } from 'react'

import hyrulData from '../../assets/user-data/hyrul.json'
import user2DataJson from '../../assets/user-data/user2.json'
import UserSelector from '../../components/UserSelector/UserSelector'
import { Campaign, Emblem } from '../../types/types'

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

const toggleHideCompleted = () => {
  setHideCompleted(!hideCompleted)
}

const user2Data = user2DataJson as any

const handleDataSelection = (selected: string) => {
  if (selected === 'hyrul') {
    setCommsData(hyrulData);
  } else if (selected === 'user2') {
    setCommsData(user2Data);
  }
};


  return (
    <section id="all-commendations">
      <button className='toggle-button' onClick={toggleHideCompleted}>
        {hideCompleted ? 'Show Completed' : 'Hide Completed'}
      </button>
      <UserSelector onChange={handleDataSelection}/>

      {/* skip les guildes */}
      {Object.entries(allCommsData)
      .filter(([factionKey]) => factionNames[factionKey])
      .map(([factionKey, factionData]) => {
        const mainEmblems = 'Emblems' in factionData
            ? factionData.Emblems?.Emblems || [] : []
        
        const campaigns = 'Campaigns' in factionData && factionData.Campaigns ? Object.entries(factionData.Campaigns) : []
        const totalEmblems = [...mainEmblems, ...campaigns.flatMap(([, campaign]) =>  campaign.Emblems || []),].length
        const completedEmblems = [...mainEmblems, ...campaigns.flatMap(([, campaign]) =>  campaign.Emblems || []),].filter((emblem: Emblem) => emblem.Completed).length

        return (
          <Dropdown
            key={factionKey}
            title={`${factionNames[factionKey]} - ${completedEmblems}/${totalEmblems}`}
            content={
              <div>
                {/* Main faction emblems */}
                {mainEmblems.length > 0 && (
                  <div className="category">
                    <div className="emblems">
                      {mainEmblems
                        .filter((emblem) => !hideCompleted || !emblem.Completed)
                        .map((emblem, index) => (
                          <EmblemCard key={`main-${index}`} emblem={emblem} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Campaigns */}
                {campaigns.map(([campaignKey, campaign]: [string, Campaign]) => (
                  <div key={campaignKey} className="category">
                    <h3>{campaign.Title}</h3>
                    <div className="emblems">
                      {(campaign.Emblems || [])
                        .filter((emblem) => !hideCompleted || !emblem.Completed)
                        .map((emblem: Emblem, index: number) => (
                          <EmblemCard key={`${campaignKey}-${index}`} emblem={emblem} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        );
      })}
  </section>
)}

export default Commendations