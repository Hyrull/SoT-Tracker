import './Commendations.scss'
import { Card } from 'primereact/card'

import allCommsData from './../../assets/user-data/hyrul-simplified.json'
// import allCommsData from './../../assets/user-data/hyrul-041224433.json'

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
  'acee9658-ee13-4f77-ac7d-921bf7664ed8': "Valkyries",
  PirateLord: "Guardians of Fortune",
  Flameheart: "Servants of the Flame"
};

function Commendations() {
  console.log("Rendering Commendations");
  return (
    <section id="all-commendations">
      {Object.entries(allCommsData).map(([factionKey, factionData]) => {
        return (
          <div key={factionKey} className="faction-category">
            <h2>{factionNames[factionKey] || factionKey}</h2>
            <div className='emblems'>
            {factionData.Emblems.Emblems.map((emblem, index) => (
              <div key={index} className='emblem-card'>
                <img src={emblem.image} alt={emblem.title} />
                <div className='card-content'>
                  <h3>{emblem.title}</h3>
                  <p>{emblem.subtitle}</p>
                  <p>Grade: {emblem.Grade}/{emblem.MaxGrade}</p>
                  <p>{emblem.Completed ? "Completed" : "Incomplete"}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Commendations