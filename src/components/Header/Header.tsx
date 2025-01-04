import { Link } from 'react-router'
import './Header.scss'
// import logo from './../../assets/img/sot-logo.png'
import logo from '/assets/img/sot-tracker-logo1.png'

const token = localStorage.getItem('token')

const removeToken = () => {
  localStorage.removeItem('token')
  window.location.href = '/SoT-Tracker'
}

function Header() {
  return (
    <header>
      <img src={logo} alt='Sea of Thieves logo'/>
      <nav data-itemtype="https://schema.org/SiteNavigationElement" data-itemscope="">
        <Link data-itemprop='url' to='/SoT-Tracker'>Home</Link>
        <Link data-itemprop='url' to='/SoT-Tracker/commendations'>Commendations</Link>
        {
          token ? (
            <>
            <Link data-itemprop='url' to='/SoT-Tracker/settings'>Settings</Link>
            <Link data-itemprop='url' to='/SoT-Tracker/' onClick={removeToken}>Log out</Link>
            </>
          ) : (
            <Link data-itemprop='url' to='/SoT-Tracker/login'>Log in</Link>
        )}
      </nav>
    </header>
  )
}

export default Header