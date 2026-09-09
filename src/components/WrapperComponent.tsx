import React from 'react';
const WrapperComponent = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <div className="page-wrapper">{children}</div>;
};
export default WrapperComponent;
