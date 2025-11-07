import Dropdown from '../../../components/Dropdown/Dropdown'
import EmblemCard from '../../../components/EmblemCard/EmblemCard'
import checkmark from '/assets/img/icons/sot_checkmark.svg'
import { FactionDropdownProps, Emblem } from '../../../types/types'
import factionNames from '../Data/FactionNames'


const FactionDropdown = ({
  factionKey, factionData, hideCompleted, showRewards, searchQuery
  }: FactionDropdownProps) => {

  // Function to check search match
  const matchesSearch = (emblem: Emblem) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      emblem.DisplayName.toLowerCase().includes(searchLower) ||
      emblem.Description?.toLowerCase().includes(searchLower) ||
      // Note that "Description?" implies that it's an optional field - the data merge currently doesn't check if the user's commendation exists in the data. This is a workaround before I fix this!
      emblem.reward?.toLowerCase().includes(searchLower) ||
      emblem.reward_graded?.some(r => r.reward.toLowerCase().includes(searchLower))
    )
  }

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

  const level = 0 // Placeholder for now - I'll introduce the level display someday (maybe)

  // To avoid the custom progress bar's class to be "Athenas-Fortune" rather than "Athena's.Fortune"
  const sanitizeClass = (name: string) =>
  String(name || '')
    .replace(/['’\u2019]/g, '')        // remove ASCII + common Unicode apostrophes
    .replace(/\./g, '-')               // replace dots with hyphens
    .replace(/[^A-Za-z0-9_-]+/g, '-')  // collapse any other weird chars into '-'
    .replace(/^-+|-+$/g, '');          // trim leading/trailing hyphens


  ////////////////////////////////////
  // Time to actually display stuff
  // Using the Dropdown component, and nesting the EmblemCard component in it. Fun!

  return (
    <Dropdown
    key={factionKey}

      // FACTION HEADER
      title={
        <>
        <div className='faction-header'>
          <progress value={completedEmblems} max={totalEmblems} 
          className={sanitizeClass(factionNames[factionKey].name)}>
          </progress>
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



    // Actual commendations display
    content={
      <div>
          {/* Simple ones */}
          {filteredMainEmblems.length > 0 && (
            <div className="category">
              <ul>
                {filteredMainEmblems
                  .filter((emblem) => (!hideCompleted || !emblem.Completed) && matchesSearch(emblem))
                  .map((emblem, index) => (
                    <EmblemCard key={`main-${index}`} emblem={emblem} showRewards={showRewards}/>
                  ))}
              </ul>
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
                <ul>
                  {campaign.emblems
                    .filter(
                      (emblem: Emblem) =>
                        !hideCompleted || !emblem.Completed
                    )
                    .map((emblem: Emblem, index: number) => (

                      // Commendation itself display
                      <EmblemCard
                        key={`${campaign.key}-${index}`}
                        emblem={emblem}
                        showRewards={showRewards}
                      />
                    ))
                  }
                </ul>
              </div>
            )
          })}
      </div>
    }
    />
  )  
}

export default FactionDropdown