import { Tooltip } from "react-tooltip";
import XIcon from "../Icons/XIcon";

const CancelButton = (props) => {
  const { onClick, tooltip, disabled, label } = props;
  return (
    <div>
      <button
        className="btn btn-danger d-none d-sm-inline-block"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <XIcon />
        {label ? label : "Cancel"}
      </button>
      <button
        className="btn btn-danger d-sm-none btn-icon"
        data-tooltip-id="cancel-tooltip"
        data-tooltip-content={tooltip}
        onClick={onClick}
        disabled={disabled}
      >
        <XIcon />
      </button>
      <Tooltip id="cancel-tooltip" />
    </div>
  );
};

export default CancelButton;
