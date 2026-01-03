import { useState } from "react"
import './Dropdown.scss'

import { DropdownProps } from "../../types/types"

function Dropdown({title, content} : DropdownProps) {

  const [displayContent, setDisplayContent] = useState(false)
  return (
  <li className="dropdown">
    <button 
    className='dropdown-header'
    onClick={() => setDisplayContent(!displayContent)}
    aria-expanded={displayContent}>
      {typeof title === 'function' ? title({ displayContent }) : title}
    </button>
    <div className={`dropdown-box ${displayContent ? 'visible' : ''}`}>
      <div className={`dropdown-content ${displayContent ? 'visible' : ''}`}>
        {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            <>{content}</>
          )}</div>
    </div>
  </li>
  )
}

export default Dropdown