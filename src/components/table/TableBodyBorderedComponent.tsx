import type { ReactNode } from 'react';

interface TableBodyBorderedComponentProps {
  children?: ReactNode;
  pagination?: ReactNode;
}

const TableBodyBorderedComponent = (props: TableBodyBorderedComponentProps) => {
  const { children, pagination } = props;
  return (
    <div className="table-responsive mb-0">
      <table className="table table-vcenter">
        <tbody>{children}</tbody>
      </table>
      {pagination}
    </div>
  );
};

export default TableBodyBorderedComponent;
