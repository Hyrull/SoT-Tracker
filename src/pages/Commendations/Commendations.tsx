import './Commendations.scss'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'
import { useState } from 'react'

import hyrulData from '../../assets/user-data/hyrul-0412240615.json'
import user2DataJson from '../../assets/user-data/user2-0412242321.json'
import UserSelector from '../../components/UserSelector/UserSelector'
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
        // check pour les tall tales/bilge rats
        const emblems =
          'Emblems' in factionData
            ? factionData.Emblems?.Emblems
            : Object.values(factionData.Campaigns || {})
            .flatMap((campaign) => (campaign as { Emblems?: Emblem[] }).Emblems || [])

            const totalEmblems = emblems?.length || 0
            const completedEmblems = emblems?.filter((emblem) => emblem.Completed).length || 0

          const filteredEmblems = hideCompleted ? emblems?.filter((emblem) => !emblem.Completed) : emblems;


        return (
          <Dropdown
            key={factionKey}
            title={`${factionNames[factionKey]} - ${completedEmblems}/${totalEmblems}` || ''}
            content={
              <div className="emblems">
                {filteredEmblems?.map((emblem, index) => (
                  <EmblemCard key={index} emblem={emblem as any} />
                ))}
                </div>
              }
            />
          )
        })}
      </section>
)}

export default Commendations