import { Tooltip } from 'react-tooltip';
import PlusIcon from '../Icons/PlusIcon';

const NewButton = (props) => {
  const { onClick, tooltip, disabled } = props;
  return (
    <div>
      <button
        className="btn btn-primary d-none d-sm-inline-block"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <PlusIcon />
        New
      </button>
      <button
        className="btn btn-primary d-sm-none btn-icon"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <PlusIcon />
      </button>
      <Tooltip id="submit-tooltip" />
    </div>
  );
};

export default NewButton;
