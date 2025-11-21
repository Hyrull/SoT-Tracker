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

  return (
    <li className={`emblem-card ${emblem.Completed ? 'completed' : ''} ${isPinned ? 'pinned' : ''}`} key={emblem.title}>
      <img className="card-image" loading="lazy" src={emblem.image} alt={`Commendation picture for ${emblem.title}` || 'Emblem'} />
      <div className="card-content">
        <h4>{emblem.title}</h4>
        <p>{emblem.subtitle}</p>
        {emblem.Threshold === 1 || emblem.Threshold === 0 ? ('') : (
          <>
            <p className="progress">
              Progress: <b>{emblem.Value}/{emblem.Threshold}</b> 
              {emblem.MaxGrade !== 1 && (
                <> (for grade {emblem.Grade}/{emblem.MaxGrade})</>
              )}
            </p>
          </>
        )}
        {emblem.rewardType === 'atCompletion' && showRewards ? (
          <p className="reward">Completion: {emblem.reward}</p>
        ) : null }
        {emblem.rewardType === 'perGrade' && emblem.reward_graded && showRewards ? (() => {
          const nextGradeReward = emblem.reward_graded.find(r => r.grade === emblem.Grade);
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
      <div className="card-score">
        <p>+5</p>
        <img src={scoreIcon} alt="Score"></img>
      </div>
    </li>
  )
}

export default EmblemCard;