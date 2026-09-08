import type { ReactNode } from 'react';

interface FormBodyComponentProps {
  column?: string | number;
  children?: ReactNode;
  footer?: ReactNode;
}

const FormBodyComponent = (props: FormBodyComponentProps) => {
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
