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
      <p>You are currently browsing a demo version of this page, using Hyrul's data.<br/>Last update: March 8th, 2026 (Season 18).<br/>
      <Link to="/signup">Sign Up</Link> or <Link to="/login">Log In</Link> to browse your own commendations.</p>
    </div>
  )
}

export default DemoBanner
