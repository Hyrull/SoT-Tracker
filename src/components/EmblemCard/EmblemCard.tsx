import { EmblemCardProps } from "../../types/types"
import './EmblemCard.scss'
// import checkmark from '../../assets/img/checkmark.webp'

const EmblemCard: React.FC<EmblemCardProps> = ({ emblem }) => {
  return (
    <div className="emblem-card">
      <img loading="lazy" src={emblem.image} alt={emblem.title || 'Emblem'} />
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
        {emblem.rewardType === 'atCompletion' ? (
          <p className="reward">{emblem.reward}</p>
        ) : (
          <p>NO REWARD!</p>
          )
        }
      </div>
      {/* {emblem.Completed ? <img src={checkmark} alt='Completion checkmark' className="emblem-checkmark"/> : ''} */}
    </div>
  );
};

export default EmblemCard;