import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import externalLinkIcon from '/assets/img/icons/external_link.svg'
import RatInfoModal from './Components/RatInfoModal'
import { useToast } from '../../contexts/ToastContext'
import { refreshEmblems } from '../../services/emblems'
import { updateRatToken } from '../../services/ratToken';
import { deleteUser as deleteUserService } from '../../services/user'

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
    const { success, error } = await updateRatToken(ratToken, token)
    if (success) showToast('Rat token updated successfully', 'success')
    else showToast(error || 'Failed to update rat token', 'error')
  }

  const refreshData = async () => {
    const token = localStorage.getItem('token')
    const { data, error } = await refreshEmblems(token, false)
    if (data) showToast('Data successfully refreshed!', 'success')
    else showToast(error || 'Failed to refresh data', 'error')
  }

  const deleteUser = async () => {
    const token = localStorage.getItem('token')
    const { success, error } = await deleteUserService(password, token)
    if (success) {
      localStorage.removeItem('token')
      showToast('Deletion successful.', 'success')
      navigate('/')
      window.location.reload()
    } else {
      showToast(error || 'Failed to delete your profile.', 'error')
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