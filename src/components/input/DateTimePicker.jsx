import ReactDatePicker from 'react-datepicker';

const DateTimePicker = (props) => {
  const { label, required, onChange, maxDate } = props;
  return (
    <>
      <div className="form-group mb-3">
        <label className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
        <div>
          <ReactDatePicker
            maxDate={maxDate}
            onChange={onChange}
            selectsRange
            popperPlacement="top"
            className="form-control"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
    </>
  );
};

export default DateTimePicker;
