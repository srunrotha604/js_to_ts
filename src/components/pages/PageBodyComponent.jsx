const PageBodyComponent = (props) => {
  const { children } = props;
  return (
    <div className="page-body">
      <div className="container-xl">{children}</div>
    </div>
  );
};

export default PageBodyComponent;
