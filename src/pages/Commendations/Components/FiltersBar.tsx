import refreshIcon from '/assets/img/icons/refresh.svg'
import crossIcon from '/assets/img/icons/Cross.svg'
import searchIcon from '/assets/img/icons/search.svg'
import { FiltersBarProps } from '../../../types/types'
import unfold from '/assets/img/icons/Unfold.svg'
import './FiltersBar.scss'
import { useState } from 'react'




const FiltersBar = ({
  hideCompleted, toggleHideCompleted, 
  showRewards, toggleShowRewards, 
  searchQuery, setSearchQuery, 
  refreshData, refreshing, 
  isSticky, isDemo,
  onExpandChange}: FiltersBarProps) => {
    
    const [isExpanded, setIsExpanded] = useState(false)

    const handleToggleExpand = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    if (onExpandChange) {
      onExpandChange(newExpandedState) // notify commendations.tsx about it
    }
  }

return (
    <div className={`filters ${isSticky ? 'sticky' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className='toggle-and-search'>
        <button className={`toggle-button ${hideCompleted ? 'off' : 'on'}`} onClick={toggleHideCompleted}>
          <span className="toggle-text">Show Completed</span>
          <span className="slider"><span className="slider-handle"></span></span>
        </button>

        <div className='search-bar-container'>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label='Search commendations'
          />
          <button className='clear-search' 
            onClick={() => setSearchQuery('')} 
            aria-label='Clear search'
            style={{ visibility: searchQuery ? 'visible' : 'hidden' }}>
            <img src={crossIcon} alt="Clear search" />
          </button>
          <img src={searchIcon} alt="Search" style={{ visibility: searchQuery ? 'hidden' : 'visible' }} className='search-icon'/>
        </div>

        <button className={`toggle-button ${showRewards ? 'on' : 'off'}`} onClick={toggleShowRewards}>
            <span className="toggle-text">Show Rewards</span>
            <span className="slider"><span className="slider-handle"></span></span>
        </button>
        
        <button onClick={refreshData} 
          disabled={refreshing || isDemo} 
          className={`refresh-button ${refreshing ? 'refreshing' : ''} ${isDemo ? 'demo-version' : ''}`}
          title={isDemo ? "Can't refresh in demo mode!" : 'Refresh your data'}>
        <p>Refresh my data</p>
        <img src={refreshIcon} alt="Refresh" />
        </button>
      </div>

      <button 
        className="mobile-toggle-button" 
        onClick={handleToggleExpand}
        aria-label={isExpanded ? 'Hide filters' : 'Show filters'}
      >
        <p>Filters</p>
        <img src={unfold} alt="Toggle filters" className="unfold-icon" />
      </button>
    </div>
  );
};

export default FiltersBar;