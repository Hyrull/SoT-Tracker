import { useState } from "react"
import './Dropdown.scss'

import { DropdownProps } from "../../types/types"

function Dropdown({title, content} : DropdownProps) {

  const [displayContent, setdisplayContent] = useState(false)
  return (
  <li className="dropdown">
    <div className='dropdown-header'
    onClick={() => setdisplayContent(!displayContent)}>
      {typeof title === 'function' ? title({ displayContent }) : title}
    </div>
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