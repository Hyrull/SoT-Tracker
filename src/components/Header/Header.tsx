import { Link } from 'react-router'

import './Header.scss'
// import logo from './../../assets/img/sot-logo.png'
import logo from './../../assets/img/sot-tracker-logo1.png'

function Header() {
  return (
    <header>
      <img src={logo} alt='Sea of Thieves logo'/>
      <nav data-itemtype="https://schema.org/SiteNavigationElement" data-itemscope="">
        <Link data-itemprop='url' to='/SoT-Tracker'>Home</Link>
        <Link data-itemprop='url' to='/SoT-Tracker/commendations'>Commendations</Link>
        <Link data-itemprop='url' to='/SoT-Tracker/login'>Log in</Link>
      </nav>
    </header>
  )
}

export default Header