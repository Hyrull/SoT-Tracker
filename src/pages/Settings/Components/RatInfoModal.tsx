import React from 'react'
import './RatInfoModal.scss'
import externalLinkIcon from '/assets/img/icons/external_link.svg'

interface RatInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const RatInfoModal: React.FC<RatInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="rat-modal-overlay" onClick={onClose}>
      <div className="rat-modal" onClick={(e) => e.stopPropagation()}>
        <h3>What is the RAT token?</h3>
        <p>
          Sea of Thieves stores a <strong>rat</strong> cookie that allows browsers to fetch your
          in-game progress and data directly from your Pirate Profile.
        </p>

        <h4>Where to find it:</h4>
        <ol>
          <li>
            Open <a href="https://www.seaofthieves.com/profile/overview" target="_blank" rel="noopener noreferrer">
              your Sea of Thieves profile
            <img src={externalLinkIcon} alt="External link" className="external-link-icon" />
           </a>.
          </li>
          <li>Press <strong>F12</strong> to open Developer Tools.</li>
          <li>Go to the <strong>Application</strong> tab.</li>
          <li>Under <strong>Cookies</strong> → select <code>https://www.seaofthieves.com</code>.</li>
          <li>Find the cookie named <strong>rat</strong> and copy its value.</li>
          <li>Paste it into the field on the Settings page and press <strong>Update Rat</strong>.</li>
        </ol>

        <button className="okay-button" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}

export default RatInfoModal
