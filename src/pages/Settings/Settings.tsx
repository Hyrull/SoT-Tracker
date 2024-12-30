import React, { useState } from 'react'

const Settings: React.FC = () => {
  const [ratToken, setRatToken] = useState('')
  const [message, setMessage] = useState('')

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('User token was not found')
      return
    }

    try {
      const response = await fetch('https://sot-tracker-api.onrender.com/api/auth/ratUpdate', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ratToken }),
      })

      if (response.ok) {
        setMessage('Rat token updated successfully')
      } else {
        setMessage('Failed to update rat token')
      }
    } catch (error) {
      setMessage('Failed to send a token update request')
    }
  }

  const refreshData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('User token was not found')
      return
    }

    const response = await fetch('https://sot-tracker-api.onrender.com/api/emblems/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setMessage('Data refreshed successfully')
    } else {
      setMessage('Failed to refresh data.')
    }
  }

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label htmlFor="ratToken">
          Update Rat
        </label>
        <input
          type="text"
          id="ratToken"
          value={ratToken}
          onChange={(e) => setRatToken(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <button onClick={handleUpdate}>
        Update
      </button>
      <button onClick={refreshData}>
        Refresh my data
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  )
}

export default Settings