import { Tooltip } from 'react-tooltip';
import PlusIcon from '../Icons/PlusIcon';

const NewButtonOutline = (props) => {
  const { onClick, disabled } = props;
  return (
    <div>
      <button
        className="btn btn-outline-primary btn-icon btn-sm"
        data-tooltip-id="add-new-outline-tooltip"
        data-tooltip-content="Add new"
        onClick={onClick}
        disabled={disabled}
      >
        <PlusIcon />
      </button>
      <Tooltip id="add-new-outline-tooltip" />
    </div>
  );
};

export default NewButtonOutline;
