// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

export const deleteUser = async (password: string, token: string | null): Promise<{ success: boolean; error?: string }> => {
  if (!token) return { success: false, error: 'No token found. Please log in again.' }

  try {
    const res = await fetch(`${apiUrl}/auth/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    })

    if (res.ok) return { success: true }
    return { success: false, error: 'Failed to delete your profile.' }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error.' }
  }
}
