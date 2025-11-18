import { PinnedItem } from '../types/types'

// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

// Fetch all pinned items
export const fetchPinned = async (token: string | null): Promise<{ data: PinnedItem[]; error?: string }> => {
  try {
    const response = await fetch(`${apiUrl}/data/pinned`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // No pinned items
    if (response.status === 204) {
      return { data: [] }
    }

    // Token invalid / expired
    if (response.status === 401) {
      return { data: [], error: 'Your session has expired. Please log in again.' }
    }

    // User not found
    if (response.status === 404) {
      return { data: [], error: 'User not found.' }
    }

    if (!response.ok) {
      throw new Error('Failed to fetch pinned items')
    }

    const result = await response.json()
    return { data: result.pinned || [] }
  } catch (err: any) {
    return { data: [], error: err?.message || 'Unknown error fetching pinned items' }
  }
}

// Add a pinned item
export const addPinned = async (
  token: string | null,
  faction: string,
  emblem: string,
  campaign?: string
): Promise<{ data?: PinnedItem[]; error?: string }> => {
  try {
    const response = await fetch(`${apiUrl}/data/pinned`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ faction, emblem, campaign }),
    })

    if (response.status === 401) {
      return { error: 'Your session has expired. Please log in again.' }
    }

    if (response.status === 400) {
      const result = await response.json()
      return { error: result.error || 'Missing required fields' }
    }

    if (response.status === 404) {
      return { error: 'User not found.' }
    }

    if (response.status === 409) {
      // Already exists
      const result = await response.json()
      return { data: result.pinned, error: 'This item is already pinned.' }
    }

    if (!response.ok) {
      throw new Error('Failed to add pinned item')
    }

    const result = await response.json()
    return { data: result.pinned }
  } catch (err: any) {
    return { error: err?.message || 'Unknown error adding pinned item' }
  }
}

// Remove a pinned item - faction and campaign are now optional
export const removePinned = async (
  token: string | null,
  emblem: string,
  faction?: string,
  campaign?: string
): Promise<{ data?: PinnedItem[]; error?: string }> => {
  try {
    const body: any = { emblem }
    
    if (faction) body.faction = faction
    if (campaign) body.campaign = campaign

    const response = await fetch(`${apiUrl}/data/pinned`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (response.status === 401) {
      return { error: 'Your session has expired. Please log in again.' }
    }

    if (response.status === 400) {
      const result = await response.json()
      return { error: result.error || 'Missing required fields' }
    }

    if (response.status === 404) {
      const result = await response.json()
      return { error: result.error || 'Pinned item not found.' }
    }

    if (!response.ok) {
      throw new Error('Failed to remove pinned item')
    }

    const result = await response.json()
    return { data: result.pinned }
  } catch (err: any) {
    return { error: err?.message || 'Unknown error removing pinned item' }
  }
}