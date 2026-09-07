const FormBodyComponent = (props) => {
  const { column, children, footer } = props;

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className={`col-md-${column != '' ? column : 12}`}>
            {children}
            <div className="form-footer">{footer}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBodyComponent;
