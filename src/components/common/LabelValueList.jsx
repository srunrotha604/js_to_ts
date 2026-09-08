import { LabelValueItem } from './LabelValueItem';

const LabelValueList = ({ list, valueColorClassName = '', columnClassName }) => {
  return (
    <div className="row">
      {list?.map((item, index) => (
        <div
          key={index}
          className={columnClassName ? columnClassName : 'col-xs-4 col-md-6'}
        >
          {item?.label && (
            <LabelValueItem
              title={item.label}
              value={item.value}
              valueColorClassName={valueColorClassName}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LabelValueList;
