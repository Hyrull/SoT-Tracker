// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

export const updateRatToken = async (ratToken: string, token: string | null): Promise<{ success: boolean; error?: string }> => {
  if (!token) return { success: false, error: 'User token was not found.' }

  try {
    const res = await fetch(`${apiUrl}/auth/ratUpdate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ratToken }),
    })

    if (res.ok) return { success: true };
    return { success: false, error: 'Failed to update Rat token.' }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error.' }
  }
}
