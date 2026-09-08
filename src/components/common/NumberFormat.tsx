import { NumericFormat } from 'react-number-format';

const formatType = {
  price: {
    prefix: '$',
  },
};

interface NumberFormatProps {
  value?: string | number;
  type?: keyof typeof formatType;
}

const NumberFormat = ({ value, type }: NumberFormatProps) => {
  const selectedFormatType = (type && formatType[type]) ?? formatType.price;

  return (
    <NumericFormat
      value={value}
      displayType="text"
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale
      {...selectedFormatType}
    />
  );
};
export default NumberFormat;
