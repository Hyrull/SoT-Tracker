import React from 'react'
import { Link } from 'react-router'
import './DemoBanner.scss'

interface DemoBannerProps {
  isDemo: boolean
}

const DemoBanner: React.FC<DemoBannerProps> = ({ isDemo }) => {
  if (!isDemo) return null

  return (
    <div className="demo-banner">
      You are currently browsing a demo version of this page, using Hyrul's data as of 25th of October, 2025.<br></br>
      <Link to="/signup">Sign Up</Link> or <Link to="/login">Log In</Link> to browse your own commendations.
    </div>
  )
}

export default DemoBanner
