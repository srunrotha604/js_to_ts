import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, IconButton, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickerValidDate } from '@mui/x-date-pickers/models';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useEffect, useState } from 'react';

interface MuiDateRangeValue {
  startDate?: Date | null;
  endDate?: Date | null;
}

interface MuiDateRangePickerProps {
  date?: MuiDateRangeValue;
  onDateChange?: (value: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

export default function MuiDateRangePicker({
  date = {},
  onDateChange,
}: MuiDateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    date.startDate ?? null
  );
  const [endDate, setEndDate] = useState<Date | null>(date.endDate ?? null);

  useEffect(() => {
    setStartDate(date.startDate ?? null);
    setEndDate(date.endDate ?? null);
  }, [date]);

  const handleStartChange = (value: PickerValidDate | null) => {
    const newValue = value as dayjs.Dayjs | null;
    const newStart = newValue ? newValue.toDate() : null;
    let newEnd = endDate;
    if (newStart && endDate && dayjs(endDate).isBefore(dayjs(newStart))) {
      newEnd = null;
      setEndDate(null);
    }

    setStartDate(newStart);

    onDateChange?.({
      startDate: newStart,
      endDate: newEnd,
    });
  };

  const handleEndChange = (value: PickerValidDate | null) => {
    const newValue = value as dayjs.Dayjs | null;
    const newEnd = newValue ? newValue.toDate() : null;
    setEndDate(newEnd);

    onDateChange?.({
      startDate,
      endDate: newEnd,
    });
  };

  const clearAll = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange?.({ startDate: null, endDate: null });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <Box display="flex" gap={1} alignItems="center">
        <DatePicker
          label="Start Date"
          value={startDate ? dayjs(startDate) : null}
          onChange={handleStartChange}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: 'small',
              className: 'form-control',
              fullWidth: true,
              InputProps: {
                endAdornment: startDate && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleStartChange(null)}
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        <DatePicker
          label="End Date"
          value={endDate ? dayjs(endDate) : null}
          onChange={handleEndChange}
          minDate={startDate ? dayjs(startDate) : undefined}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
          disabled={!startDate}
          slotProps={{
            textField: {
              size: 'small',
              className: 'form-control',
              fullWidth: true,
              InputProps: {
                endAdornment: endDate && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleEndChange(null)}
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        {(startDate || endDate) && (
          <Button
            onClick={clearAll}
            size="small"
            variant="outlined"
            color="secondary"
          >
            Clear All
          </Button>
        )}
      </Box>
    </LocalizationProvider>
  );
}
