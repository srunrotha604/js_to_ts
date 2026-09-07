const WrapperComponent = (props) => {
  const { children } = props;
  return <div className="page-wrapper">{children}</div>;
};

export default WrapperComponent;
