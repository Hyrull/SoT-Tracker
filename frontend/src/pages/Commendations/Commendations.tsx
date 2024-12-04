import './Commendations.scss'

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
            .flatMap(campaign => campaign.Emblems || []);


        return (
          <div key={factionKey} className="faction-category">
            <h2>{factionNames[factionKey] || ''}</h2>
            <div className='emblems'>
            {emblems?.map((emblem, index) => (
              <div key={index} className='emblem-card'>
                <img src={emblem.image} alt={emblem.title} />
                <div className='card-content'>
                  <h3>{emblem.title}</h3>
                  <p>{emblem.subtitle}</p>
                  {emblem.MaxGrade === 1 ? '' : 
                  <>
                  <p>{emblem.Value}/{emblem.Threshold}</p>
                  <p>Grade: {emblem.Grade}/{emblem.MaxGrade}</p>
                  </>
                  }
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