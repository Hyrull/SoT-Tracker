import './UserSelector.scss'

const UserSelector: React.FC<{ onChange: (selected: string) => void }> = ({ onChange }) => {
  return (
    <div className="user-selector">
      <select onChange={(e) => onChange(e.target.value)} defaultValue="hyrul">
        <option value="hyrul">Hyrul</option>
        <option value="user2">Ashen Reaper</option>
        <option value="user3">Yellow Sailor</option>
      </select>
    </div>
  );
};

export default UserSelector
