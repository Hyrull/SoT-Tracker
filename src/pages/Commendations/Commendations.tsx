import './Commendations.scss'
import { useState } from 'react'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import UserSelector from '../../components/UserSelector/UserSelector'

import hyrulData from '../../assets/user-data/hyrul.json'
import user2DataJson from '../../assets/user-data/user2.json'
import user3DataJson from '../../assets/user-data/user3.json'

import checkmark from '../../assets/img/checkmark.webp'

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
                {/* Checker que si y a aucune commendation, alors on display même pas le nom de la catégorie */}
                {campaigns.map(([campaignKey, campaign]: [string, Campaign]) => {
                const filteredEmblems = (campaign.Emblems || []).filter((emblem: Emblem) => !hideCompleted || !emblem.Completed)
                if (filteredEmblems.length === 0) {return null}

                // Comportement normal
                  return (
                    <div key={campaignKey} className="category">
                      <h3>{campaign.Title}</h3>
                      <div className="emblems">
                        {filteredEmblems.map((emblem: Emblem, index: number) => (
                          <EmblemCard key={`${campaignKey}-${index}`} emblem={emblem} />
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