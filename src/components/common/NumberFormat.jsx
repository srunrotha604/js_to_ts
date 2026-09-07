import { NumericFormat } from 'react-number-format';

const formatType = {
  price: {
    prefix: '$',
  },
};

const NumberFormat = ({ value, type }) => {
  const selectedFormatType = formatType?.[type] ?? formatType.price;

  return (
    <NumericFormat
      value={value}
      displayType="text"
      thousandSeparator
      fixedDecimalScale={2}
      {...selectedFormatType}
    />
  );
};
export default NumberFormat;
