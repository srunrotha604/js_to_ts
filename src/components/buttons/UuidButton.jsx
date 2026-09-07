import { Tooltip } from 'react-tooltip';
import BrandZapierIcon from '../Icons/BrandZapierIcon';
const UuidButton = (props) => {
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
        <BrandZapierIcon />
        Generate
      </button>
      <button
        className="btn btn-primary d-sm-none btn-icon"
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <BrandZapierIcon />
      </button>
      <Tooltip id="submit-tooltip" />
    </div>
  );
};

export default UuidButton;
