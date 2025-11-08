// quick toggle for me when working the backend
// const apiUrl = 'http://localhost:10000/api'
const apiUrl = 'https://backend.sot-tracker.com/api'

interface AuthResponse {
  success?: boolean
  token?: string
  message?: string
  error?: string
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json();
    if (res.ok) return { success: true, token: data.token }
    return { success: false, error: data.message || 'Invalid email or password' }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' }
  }
}

export const signup = async (nickname: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${apiUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, email, password }),
    })
    const data = await res.json();
    if (res.ok) return { success: true, message: data.message }
    return { success: false, error: data.message || 'Error creating the account' }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' }
  }
}
