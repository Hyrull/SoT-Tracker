import { EmblemCardProps } from "../../types/types"
import './EmblemCard.scss'

const EmblemCard: React.FC<EmblemCardProps> = ({ emblem }) => {
  return (
    <div className="emblem-card">
      <img src={emblem.image} alt={emblem.title || 'Emblem'} />
      <div className="card-content">
        <h3>{emblem.title}</h3>
        <p>{emblem.subtitle}</p>
        {emblem.MaxGrade === 1 ? ('') : (
          <>
            <p>
              {emblem.Value}/{emblem.Threshold} (for grade {emblem.Grade}/{emblem.MaxGrade})
            </p>
          </>
        )}
        <p>{emblem.Completed ? 'Completed' : 'Incomplete'}</p>
      </div>
    </div>
  );
};

export default EmblemCard;