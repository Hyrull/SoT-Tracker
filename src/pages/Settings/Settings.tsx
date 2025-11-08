import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import externalLinkIcon from '/assets/img/icons/external_link.svg'
import RatInfoModal from './Components/RatInfoModal'
import './Settings.scss'

const Settings: React.FC = () => {
  const [ratToken, setRatToken] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [isRatModalOpen, setIsRatModalOpen] = useState(false)
  const navigate = useNavigate()

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
      console.error('Error updating rat token:', error)
    }
  }

  const refreshData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('User token was not found')
      return
    }

    try {

      
      const response = await fetch('https://backend.sot-tracker.com/api/data/update', {
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
      console.log('Error refreshing data:', error)
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
        body: JSON.stringify({ 
          password
        }),
      })

      if (response.ok) {
        localStorage.removeItem('token')
        navigate('/')
        window.location.reload()
        setMessage('Deletion successful.')
      } else {
        setMessage('Failed to delete your profile.')
      }
    } catch (error) {
      setMessage('Failed to reach the server for deletion.')
      console.log('Error deleting user:', error)
    }
  }

  return (
    <main>
      <h2>Settings</h2>
      <div className='form-group'>
        <label htmlFor="ratToken">
          Update your Rat token here:
            <button
              type="button"
              className="info-button"
              onClick={() => setIsRatModalOpen(true)}
              title="What’s 'rat'?"
            >
              ?
            </button>
        </label>
        <input
          type="text"
          id="ratToken"
          placeholder='Input your Rat token here...'
          autoComplete='one-time-code'
          value={ratToken}
          onChange={(e) => setRatToken(e.target.value)}
        />
        <a 
          href="https://www.seaofthieves.com/profile/overview" 
          target="_blank" 
          rel="noopener noreferrer"
          className="profile-link"
        >Sea of Thieves profile page
        <img src={externalLinkIcon} alt="External link" className="external-link-icon" />
        </a>
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
        <p>This action is irreversible. Your profile and data will be permanently deleted from this website.</p>
        <div className="form-group">
          <label htmlFor="password">Confirm your password:</label>
          <input
            type="password"
            id="password"
            autoComplete='one-time-code'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='delete-button' onClick={deleteUser}>
          Yes, delete
        </button>
      </div>
      {message && <p className='server-message'>{message}</p>}
      <RatInfoModal isOpen={isRatModalOpen} onClose={() => setIsRatModalOpen(false)} />
    </main>
  )
}

export default Settings