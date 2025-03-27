import { Link } from 'react-router'
import './Header.scss'
import logo from '/assets/img/sot-tracker-logo1.png'

const token = localStorage.getItem('token')

const removeToken = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

function Header() {
  return (
    <header>
      <div className='header-content'>
        <img src={logo} alt='Sea of Thieves logo'/>
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
      </div>
    </header>
  )
}

export default Header