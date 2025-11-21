import { Link } from 'react-router'
import './Header.scss'
import logo from '/assets/img/sot-tracker-logo-large-light.webp'
import logoNoText from '/assets/img/sot-tracker-logo-small-light.webp'
import scoreIcon from "/assets/img/icons/icon-tier-4.svg"

const token = localStorage.getItem('token')

const removeToken = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

function Header() {
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
        <div className="playerInfos">
            <p className="nickname">Freya</p>
            <p className="score">14 850<img src={scoreIcon} alt="Score"></img></p>
        </div>
      </div>
    </header>
  )
}

export default Header