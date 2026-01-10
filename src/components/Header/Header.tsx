import { Link, NavLink, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import './Header.scss'
import logo from '/assets/img/sot-tracker-logo-large-light.webp'
import logoNoText from '/assets/img/sot-tracker-logo-small-light.webp'
import scoreIcon from "/assets/img/icons/icon-tier-4.svg"
import { useUser } from '../../contexts/UserContext'


function Header() {
  const { score, username, token, logout } = useUser()
  const navigate = useNavigate()
  
  const apiUrl = 'https://backend.sot-tracker.com/api'
  const [backendOnline, setBackendOnline] = useState(true)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    navigate('/')
  }

  useEffect(() => {
    // just checking if the server's up
    const checkHealth = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      try {
        const response = await fetch(`${apiUrl}/health`, { 
          method: 'HEAD', // head gets no body. faster
          signal: controller.signal 
        })
        
        clearTimeout(timeoutId);
        
        setBackendOnline(response.ok)
        
      } catch (error) {
        // if the request didn't go through, then server is down
        setBackendOnline(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 10 * 1000) // 10s

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <header>
      {!backendOnline ? 
      <div className='no-backend-banner'>
        <p className='no-backend-text'>SoT Tracker servers are offline. Please try again later.</p>
        <p className='no-backend-subtext'>Blame my ISP. If it's been offline for a while, ping @hyrul on Discord!</p>
      </div>
      : null }
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
        <div className='nav-and-infos'>
          <nav data-itemtype="https://schema.org/SiteNavigationElement" data-itemscope="">
            <NavLink to="/"
                data-itemprop="url">
                Home
              </NavLink>
            <NavLink data-itemprop='url' to='/commendations'>
              Commendations
            </NavLink>
            {
              token ? (
                <>
                <NavLink data-itemprop='url' to='/settings'>
                  Settings
                </NavLink>
                <Link data-itemprop='url' to='/' onClick={handleLogout}>
                  Log out
                </Link>
                </>
              ) : (
                <NavLink data-itemprop='url' to='/login'>
                  Log in
                </NavLink>
              )}
          </nav>
          
          {token && (
            <div className="player-infos">
              <p className="nickname">{username}</p>
              {score.current !== 0 &&
              <div className='score-display'>
                <img src={scoreIcon} alt="Score icon" title="Your total score"/>
                <p>{score.current.toLocaleString()}</p>
              </div>
              }
            </div>
        )}
        </div>
      </div>
    </header>
  )
}

export default Header