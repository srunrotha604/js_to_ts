declare module 'react-date-range' {
  import type { ComponentType } from 'react';

  export interface DateRangeItem {
    startDate?: Date;
    endDate?: Date;
    key?: string;
    color?: string;
  }

  export interface RangeKeyDict {
    [key: string]: DateRangeItem;
  }

  export interface DateRangeProps {
    editableDateInputs?: boolean;
    dateDisplayFormat?: string;
    onChange?: (item: RangeKeyDict) => void;
    moveRangeOnFirstSelection?: boolean;
    ranges: DateRangeItem[];
    months?: number;
    direction?: 'horizontal' | 'vertical';
    rangeColors?: string[];
    minDate?: Date;
    maxDate?: Date;
  }

  export const DateRange: ComponentType<DateRangeProps>;
  export const DateRangePicker: ComponentType<Record<string, unknown>>;
  export const Calendar: ComponentType<Record<string, unknown>>;
}
