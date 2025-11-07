import './Footer.scss'
import externalLinkIcon from '/assets/img/icons/external_link.svg'

function Footer() {
  return (
    <footer>
    <p>Website made by Hyrul & Freya</p>
    <div className='code-link'>
      <a href='https://github.com/Hyrull/SoT-Tracker' target="_blank" rel="noopener noreferrer">Source code</a>
      <img src={externalLinkIcon} alt="External link" className="external-link-icon" />
    </div>
    </footer>
  )
}

export default Footer