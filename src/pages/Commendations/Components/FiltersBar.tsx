import refresh from '/assets/img/icons/refresh.svg'
import crossIcon from '/assets/img/icons/Cross.svg'
import searchIcon from '/assets/img/icons/search.svg'
import { FiltersBarProps } from '../../../types/types'
import './FiltersBar.scss'




const FiltersBar = ({
  hideCompleted, toggleHideCompleted, 
  showRewards, toggleShowRewards, 
  searchQuery, setSearchQuery, 
  refreshData, refreshing, 
  isSticky, isDemo}: FiltersBarProps) => (


  <div className={`filters ${isSticky ? 'sticky' : ''}`}>
    {/* <div className='empty-div-on-purpose'></div> */}
    <div className='toggle-and-search'>
      <button className={`toggle-button ${hideCompleted ? 'off' : 'on'}`} onClick={toggleHideCompleted}>
        <span className="toggle-text">Show Completed</span>
        <span className="slider"><span className="slider-handle"></span></span>
      </button>

      <div className='search-bar-container'>
        <input
          type="text"
          className="search-bar"
          placeholder="Search through commendations..."
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
    </div>

    <button onClick={refreshData} 
      disabled={refreshing || isDemo} 
      className={`refresh-button ${refreshing ? 'refreshing' : ''} ${isDemo ? 'demo-version' : ''}`}
      title={isDemo ? "Can't refresh in demo mode!" : 'Refresh your data'}>
    <img src={refresh} alt="Refresh" />
    </button>
  </div>
)
export default FiltersBar;