import { useState } from "react"
import dropdownArrow from '/assets/img/icons/Unfold.svg'
import './Dropdown.scss'

import { DropdownProps } from "../../types/types"

function Dropdown({title, content} : DropdownProps) {

  const [displayContent, setdisplayContent] = useState(false)
  return (
  <div className="dropdown">
    <div className='dropdown-header'
    onClick={() => setdisplayContent(!displayContent)}>
      {title}
      <img src={dropdownArrow} alt='Dropdown arrow' 
      className={`arrow ${displayContent ? 'rotate' : ''}`}/>
    </div>
    <div className={`dropdown-box ${displayContent ? 'visible' : ''}`}>
      <div className={`dropdown-content ${displayContent ? 'visible' : ''}`}>
        {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            <>{content}</>
          )}</div>
    </div>
  </div>
  )
}

export default Dropdown