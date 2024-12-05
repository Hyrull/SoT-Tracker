import { EmblemCardProps } from "../../types/types"
import './EmblemCard.scss'
// import checkmark from '../../assets/img/checkmark.webp'

const EmblemCard: React.FC<EmblemCardProps> = ({ emblem }) => {
  return (
    <div className="emblem-card">
      <img src={emblem.image} alt={emblem.title || 'Emblem'} />
      <div className="card-content">
        <h4>{emblem.title}</h4>
        <p>{emblem.subtitle}</p>
        {emblem.MaxGrade === 1 ? ('') : (
          <>
              <p className="progress"><b>
              Progress: {emblem.Value}/{emblem.Threshold}</b> (for grade {emblem.Grade}/{emblem.MaxGrade})
            </p>
          </>
        )}
      </div>
      {/* {emblem.Completed ? <img src={checkmark} alt='Completion checkmark' className="emblem-checkmark"/> : ''} */}
    </div>
  );
};

export default EmblemCard;