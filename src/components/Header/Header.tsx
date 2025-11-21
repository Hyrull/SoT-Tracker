import { Link } from 'react-router'
import './Header.scss'
import logo from '/assets/img/sot-tracker-logo-large-light.webp'
import logoNoText from '/assets/img/sot-tracker-logo-small-light.webp'
import scoreIcon from "/assets/img/icons/icon-tier-4.svg"
import { getScore } from '../../services/score'
import { useEffect, useState } from 'react'

const removeToken = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

function Header() {
  const [token] = useState(() => localStorage.getItem('token'))
  const [username, setUsername] = useState('')
  const [currentScore, setCurrentScore] = useState(0)

  // I made the backend answer this, too, but I don't have any use for it yet. But it's ready
  // const [maximumScore, setMaximumScore] = useState(0)
  // const [completionPercentage, setCompletionPercentage] = useState('0')

  useEffect(() => {
    if (token) {
      getScore(token)
        .then((data) => {
          setUsername(data.username)
          setCurrentScore(data.currentScore)
          // setMaximumScore(data.maximumScore)
          // setCompletionPercentage(data.percentage)
        })
        .catch((err) => {
          console.error('Failed to fetch score', err)
        })
    }
  }, [token])

  return (
    <header>
      <div className='header-content'>
        <Link to='/'>
          <img 
            src={logo} 
            alt='SoT Tracker Logo'
            className='main-logo-full'
          />
          <img 
            src={logoNoText} 
            alt='SoT Tracker Logo'
            className='main-logo-notext'
          />
        </Link>
        <nav data-itemtype="https://schema.org/SiteNavigationElement" data-itemscope="">
          <Link data-itemprop='url' to='/'>Home</Link>
          <Link data-itemprop='url' to='/commendations'>Commendations</Link>
          {
            token ? (
              <>
              <Link data-itemprop='url' to='/settings'>Settings</Link>
              <Link data-itemprop='url' to='/' onClick={removeToken}>Log out</Link>
              </>
            ) : (
              <Link data-itemprop='url' to='/login'>Log in</Link>
            )}
        </nav>
        
        {token && (
          <div className="player-infos">
            <p className="nickname">{username}</p>
            <p className="score">{currentScore.toLocaleString()}<img src={scoreIcon} alt="Score" /></p>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header