import { useNavigate } from 'react-router'
import './NoCommendations.scss'

function NoCommendations() {
  const navigate = useNavigate()
  
  return (
    <div className="no-data-box">
        <h3>No commendation progress found!</h3>
        <p className='signup-here'>
          Looks like you haven't imported your Sea of Thieves data yet. Head to your {' '}
          <span onClick={() => navigate('/settings')} className="settings-link">
            settings page
          </span> and import your it from there - click the "?" button if you need instructions.
        </p>

        <button className="okay-button" onClick={() => navigate('/settings')}>Got it</button>
    </div>
  )
}

export default NoCommendations