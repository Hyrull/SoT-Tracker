import React, { useState } from 'react'
import './Settings.scss'

const Settings: React.FC = () => {
  const [ratToken, setRatToken] = useState('')
  const [message, setMessage] = useState('')

  const [showDeleteBox, setShowDeleteBox] = useState(false)

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('User token was not found')
      return
    }

    try {
      const response = await fetch('https://backend.sot-tracker.com/api/auth/ratUpdate', {
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

    try {

      
      const response = await fetch('https://backend.sot-tracker.com/api/emblems/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to refresh data')
      }
    } catch (error) {
      setMessage('A network error occured.')
    }
  }

  const deleteUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('No token found. Please log in again.')
      return
    }

    try {
      const response = await fetch('https://backend.sot-tracker.com/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMessage('Deletion successful. You have been logged out - please refresh the page.')
        localStorage.removeItem('token')
      } else {
        setMessage('Failed to delete your profile.')
      }
    } catch (error) {
      setMessage('Failed to reach the server for deletion.')
    }
  }

  return (
    <div className='settings-container'>
      <h2>Settings</h2>
      <div className='form-group'>
        <label htmlFor="ratToken">
          Update your Rat token here:
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
        Update Rat
      </button>
      <button onClick={refreshData}>
        Refresh my commendations
      </button>
      <button className='delete-button' onClick={() => setShowDeleteBox(!showDeleteBox)}>
        Delete my account and data
      </button>
      <div className={`delete-confirmation ${showDeleteBox ? 'visible' : ''}`}>
        <p>This action is irreversible. Your profile and data will be deleted.</p>
        <button className='delete-button' onClick={deleteUser}>
          Yes, delete
        </button>
      </div>
      {message && <p className='server-message'>{message}</p>}
    </div>
  )
}

export default Settings