import { AllCommsData } from '../types/types'

// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

export const fetchEmblems = async (token: string | null, isDemo: boolean): Promise<{ data: AllCommsData; error?: string }> => {
  try {
    if (isDemo) {
      const res = await fetch('/data/exampleData.json')
      const data: AllCommsData = await res.json()
      return { data }
    }

    const response = await fetch(`${apiUrl}/data/emblems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

  if (response.status === 204) {
    // No data - fresh account, probably
  return { data: {} }
  }

  if (response.status === 401) {
    // Token invalid / expired
  return { data: {}, error: 'Your session has expired. Please log in again.' }
  }

    const data: AllCommsData = await response.json()
    return { data }
  } catch (err: any) {
    return { data: {}, error: err?.message || 'Unknown error fetching emblems' }
  }
}


export const refreshEmblems = async (token: string | null, isDemo: boolean): Promise<{ data?: AllCommsData; error?: string }> => {
  if (isDemo) return { error: 'Cannot refresh in demo mode.' }
  // Surely some smart ones will enable the sync button in the demo page to see what it'd do

  try {
    // Step 1: trigger backend update
    const updateRes = await fetch(`${apiUrl}/data/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!updateRes.ok) throw new Error('Failed to refresh data.')

    // Fetch the updated data
    const { data, error } = await fetchEmblems(token, isDemo)
    if (error) throw new Error(error)

    return { data }
  } catch (err: any) {
    return { error: err?.message || 'Unknown error refreshing data' }
  }
}