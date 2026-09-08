declare module 'react-datepicker' {
  import type { ComponentType } from 'react';

  export interface ReactDatePickerProps {
    selected?: Date | null;
    onChange?: (date: Date | null) => void;
    showYearDropdown?: boolean;
    showMonthDropdown?: boolean;
    shouldCloseOnSelect?: boolean;
    className?: string;
    dateFormat?: string;
    placeholderText?: string;
    readOnly?: boolean;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
  }

  const ReactDatePicker: ComponentType<ReactDatePickerProps>;
  export default ReactDatePicker;
}
