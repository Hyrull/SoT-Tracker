import './Commendations.scss'
import Dropdown from '../../components/Dropdown/Dropdown'
import EmblemCard from '../../components/EmblemCard/EmblemCard'

// import allCommsData from './../../assets/user-data/hyrul-simplified.json'
import allCommsData from './../../assets/user-data/hyrul-0412240615.json'

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
  console.log("Rendering Commendations");

  return (
    <section id="all-commendations">
      {Object.entries(allCommsData).map(([factionKey, factionData]) => {
        // check pour les tall tales/bilge rats
        const emblems =
          'Emblems' in factionData
            ? factionData.Emblems?.Emblems
            : Object.values(factionData.Campaigns || {})
            .flatMap(campaign => campaign.Emblems || []
            )


        return (
          <Dropdown
            key={factionKey}
            title={factionNames[factionKey] || ''}
            content={
              <div className="emblems">
                {emblems?.map((emblem, index) => (
                  <EmblemCard key={index} emblem={emblem} />
                ))}
                </div>
              }
            />
          )
        })}
      </section>
)}

export default Commendations