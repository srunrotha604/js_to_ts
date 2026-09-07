import ArrowBackIcon from '../Icons/ArrowBackIcon';
const HeaderFormCreateComponent = (props) => {
  const { title, back } = props;
  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">{title}</h2>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="row align-items-center">
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={back}
                  >
                    <ArrowBackIcon />
                    Back
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    onClick={back}
                  >
                    <ArrowBackIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderFormCreateComponent;
