declare module 'react-datepicker' {
  import type { ComponentType, ReactElement } from 'react';

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
    selectsRange?: boolean;
    popperPlacement?: string;
    customInput?: ReactElement;
    tabIndex?: number;
    required?: boolean;
  }

  const ReactDatePicker: ComponentType<ReactDatePickerProps>;
  export default ReactDatePicker;
}
