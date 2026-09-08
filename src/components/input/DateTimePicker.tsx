import type { ReactNode } from 'react';
import ReactDatePicker from 'react-datepicker';

interface DateTimePickerProps {
  label?: ReactNode;
  required?: boolean;
  onChange?: (dates: [Date | null, Date | null]) => void;
  maxDate?: Date;
}

const DateTimePicker = (props: DateTimePickerProps) => {
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
            onChange={(date) =>
              onChange?.(date as unknown as [Date | null, Date | null])
            }
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
