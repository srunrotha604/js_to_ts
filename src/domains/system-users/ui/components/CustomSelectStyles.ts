import type { StylesConfig } from 'react-select';
import type { SelectOption } from '../../../../@type/report';

export const customSelectStyles: StylesConfig<SelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    minHeight: '35px',
    height: '35px',
    boxShadow: state.isFocused ? undefined : undefined,
  }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? '#999999' : undefined,
      color: '#333333',
    };
  },
  valueContainer: (provided) => ({
    ...provided,
  }),

  input: (provided) => ({
    ...provided,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '33px',
  }),
};
