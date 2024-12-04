import { useState } from "react"
import dropdownArrow from './../../assets/img/dropdownarrow.png'
import './Dropdown.scss'

import { DropdownProps } from "../../types/types"

function Dropdown({title, content} : DropdownProps) {

  const [displayContent, setdisplayContent] = useState(false)

  return (
  <div className="dropdown">
    <div className='dropdown-header'>
      <h2>{title}</h2>
      <img src={dropdownArrow} alt='Dropdown arrow' 
      onClick={() => setdisplayContent(!displayContent)}
      className={displayContent ? 'rotate' : ''}/>
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