import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, IconButton, InputAdornment, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import 'dayjs/locale/en';

export default function MuiDateRangePicker({ date = {}, onDateChange }) {
  const [startDate, setStartDate] = useState(date.startDate || null);
  const [endDate, setEndDate] = useState(date.endDate || null);

  useEffect(() => {
    setStartDate(date.startDate || null);
    setEndDate(date.endDate || null);
  }, [date]);

  const handleStartChange = (newValue) => {
    const newStart = newValue ? newValue.toDate() : null;
    let newEnd = endDate;

    // reset endDate if it's before newStart
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

  const handleEndChange = (newValue) => {
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
                    <IconButton onClick={() => handleStartChange(null)} size="small">
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
                    <IconButton onClick={() => handleEndChange(null)} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        {(startDate || endDate) && (
          <Button onClick={clearAll} size="small" variant="outlined" color="secondary">
            Clear All
          </Button>
        )}
      </Box>
    </LocalizationProvider>
  );
}
