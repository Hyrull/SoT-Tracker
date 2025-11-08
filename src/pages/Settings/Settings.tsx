import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import externalLinkIcon from '/assets/img/icons/external_link.svg'
import RatInfoModal from './Components/RatInfoModal'
import { useToast } from '../../contexts/ToastContext'
import './Settings.scss'

const Settings: React.FC = () => {
  const [ratToken, setRatToken] = useState('')
  const [password, setPassword] = useState('')
  const [isRatModalOpen, setIsRatModalOpen] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [showDeleteBox, setShowDeleteBox] = useState(false)

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('User token was not found', 'error')
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
        showToast('Rat token updated successfully', 'success')
      } else {
        showToast('Failed to update rat token', 'error')
      }
    } catch (error) {
      showToast('Failed to send a token update request', 'error')
      console.error('Error updating rat token:', error)
    }
  }

  const refreshData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('User token was not found', 'error')
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
        showToast(data.message, 'success')
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Failed to refresh data', 'error')
      }
    } catch (error) {
      showToast('A network error occured.', 'error')
      console.log('Error refreshing data:', error)
    }
  }

  const deleteUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('No token found. Please log in again.', 'error')
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
        showToast('Deletion successful.', 'success')
      } else {
        showToast('Failed to delete your profile.', 'error')
      }
    } catch (error) {
      showToast('Failed to reach the server for deletion.', 'error')
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
      <RatInfoModal isOpen={isRatModalOpen} onClose={() => setIsRatModalOpen(false)} />
    </main>
  )
}

export default Settings