import { EmblemCardProps } from "../../types/types"
import pinnedLogo from "/assets/img/icons/pinned.svg"
import pinnedLogoActive from "/assets/img/icons/pinned-active.svg"
import scoreIcon from "/assets/img/icons/icon-tier-4.svg"
import './EmblemCard.scss'

const EmblemCard: React.FC<EmblemCardProps> = ({ 
  emblem, 
  showRewards,
  factionKey,
  campaignKey,
  isPinned,
  onTogglePin
}) => {
  
  const handlePinClick = () => {
    if (onTogglePin) {
      onTogglePin(emblem, factionKey, campaignKey)
    }
  }

  if (!emblem.image) {
    return null
  }

  const displayName = emblem.DisplayName || 'Unknown Commendation'
  const description = emblem.Description || ''
  const completed = emblem.Completed || false
  const grade = emblem.Grade || 0
  const maxGrade = emblem.MaxGrade || 1
  const value = emblem.Value || 0
  const threshold = emblem.Threshold || 0

  // These are not given from the backend yet, and one day I'll make it ask the backend for the score level -> # of points. One day.
  const SCORE_LEVELS: Record<number, number> = {
    0: 0,
    1: 5,
    2: 10,
    3: 25,
    4: 50,
    5: 75,
    6: 100
  }

  return (
    <li className={`emblem-card ${completed ? 'completed' : ''} ${isPinned ? 'pinned' : ''}`} key={displayName}>
      <img className="card-image" loading="lazy" src={emblem.image} alt={`Commendation picture for ${displayName}`} />
      <div className="card-content">
        <h4>{displayName}</h4>
        <p>{description}</p>
        
        {/* Only show progress if Threshold is greater than 1 */}
        {threshold > 1 && (
          <p className="progress">
            Progress: <b>{value}/{threshold}</b> 
            {maxGrade > 1 && (
              <> (for grade {grade}/{maxGrade})</>
            )}
          </p>
        )}
        
        {emblem.rewardType === 'atCompletion' && showRewards ? (
          <p className="reward">Completion: {emblem.reward}</p>
        ) : null }
        
        {emblem.rewardType === 'perGrade' && emblem.reward_graded && showRewards ? (() => {
          const nextGradeReward = emblem.reward_graded.find(r => r.grade === grade);
          return nextGradeReward ? <p className="reward">Next grade: {nextGradeReward.reward}</p> : null;
        })() : null}
      </div>
      
      <button 
        className={`card-button-pin ${isPinned ? 'pinned' : ''}`}
        onClick={handlePinClick}
        title={isPinned ? 'Remove from favorites' : 'Add to favorites'}
      >
        <img
          className={isPinned ? 'active' : ''}
          src={isPinned ? pinnedLogoActive : pinnedLogo} 
          alt={isPinned ? 'Unpin' : 'Pin'}
        />
      </button>
      
      {emblem.scoreLevel && (
        <div className="card-score">
          <p>+{SCORE_LEVELS[emblem.scoreLevel]}</p>
          <img src={scoreIcon} alt="Score"></img>
        </div>
      )}
    </li>
  )
}

export default EmblemCard;