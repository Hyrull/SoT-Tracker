import { Link } from 'react-router'

import './Header.scss'
import logo from './../../assets/img/sot-logo.png'

function Header() {
  return (
    <header>
      <img src={logo} alt='Sea of Thieves logo'/>
      <nav data-itemtype="https://schema.org/SiteNavigationElement" data-itemscope="">
        <Link data-itemprop='url' to='/'>Home</Link>
        <Link data-itemprop='url' to='/commendations'>Commendations</Link>
      </nav>
    </header>
  )
}

export default Header