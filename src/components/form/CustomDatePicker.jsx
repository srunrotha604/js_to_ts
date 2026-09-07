// CustomDatePicker.jsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const CustomDatePicker = ({
  label = '',
  value,
  onChange,
  onTextChange,
  required = false,
  placeholder = 'DD-MM-YYYY',
  includeCurrentTime = false,
}) => {
  const parsedValue = value ? new Date(value) : null;

  const handleChange = (picked) => {
    if (!picked || isNaN(picked)) {
      onChange?.(null);
      return;
    }

    let d = new Date(picked);
    if (includeCurrentTime) {
      const now = new Date();
      d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }

    const formatted = format(d, 'M/d/yyyy h:mm:ss a');
    onChange?.(formatted);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        className="custom_date_picker"
        label={label}
        value={parsedValue}
        onChange={handleChange}
        format="dd-MM-yyyy"
        minDate={new Date('1900-01-01')}
        slotProps={{
          textField: {
            size: 'small',
            required,
            fullWidth: true,
            variant: 'outlined',
            placeholder,
            onChange: onTextChange,
            InputLabelProps: { shrink: false },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
