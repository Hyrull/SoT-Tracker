import { PinnedItem, Emblem, AllCommsData } from '../../../types/types'

/**
 * Converts pinned items (faction/emblem/campaign references) into full proper commendations
 * by searching through the actual emblems data structure
 */
export const resolvePinnedEmblems = (
  pinned: PinnedItem[],
  emblems: AllCommsData
): Emblem[] => {
  const result: Emblem[] = []

  for (const pin of pinned) {
    const faction = pin.faction
    if (!emblems[faction]) continue

    const factionObj = emblems[faction]
    let found: Emblem | undefined = undefined

    // Search in main emblems
    const mainList = factionObj.Emblems?.Emblems || []
    found = mainList.find(e => e.DisplayName === pin.emblem)
    
    if (found) {
      result.push(found)
      continue
    }

    // Search in campaigns if specified or search all campaigns
    if (factionObj.Campaigns) {
      // If campaign is specified, search only that campaign
      if (pin.campaign && factionObj.Campaigns[pin.campaign]) {
        const campList = factionObj.Campaigns[pin.campaign].Emblems || []
        found = campList.find(e => e.DisplayName === pin.emblem)
        if (found) {
          result.push(found)
          continue
        }
      } else {
        // Search all campaigns
        for (const campaign of Object.values(factionObj.Campaigns)) {
          const campList = campaign.Emblems || []
          found = campList.find(e => e.DisplayName === pin.emblem)
          if (found) {
            result.push(found)
            break
          }
        }
      }
    }
  }

  return result
}

/**
 * Checks if a specific emblem is pinned
 */
export const isEmblemPinned = (
  emblem: Emblem,
  pinned: PinnedItem[],
  factionKey: string,
  campaignKey?: string
): boolean => {
  return pinned.some(
    pin =>
      pin.faction === factionKey &&
      pin.emblem === emblem.DisplayName &&
      pin.campaign === campaignKey
  )
}

/**
 * Creates a PinnedItem object from emblem data
 */
export const createPinnedItem = (
  emblem: Emblem,
  factionKey: string,
  campaignKey?: string
): PinnedItem => {
  return {
    faction: factionKey,
    emblem: emblem.DisplayName,
    ...(campaignKey && { campaign: campaignKey })
  }
}