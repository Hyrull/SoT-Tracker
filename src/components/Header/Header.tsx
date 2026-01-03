import { Link, NavLink, useNavigate } from 'react-router'
import './Header.scss'
import logo from '/assets/img/sot-tracker-logo-large-light.webp'
import logoNoText from '/assets/img/sot-tracker-logo-small-light.webp'
import scoreIcon from "/assets/img/icons/icon-tier-4.svg"
import { useUser } from '../../contexts/UserContext'



function Header() {
  const { score, username, token, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault() // Stop the link navigation for a moment
    logout()
    navigate('/')
  }

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