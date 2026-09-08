import type { MouseEventHandler } from 'react';

interface TableCellStatusBoolProps {
  active?: boolean;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
}

const TableCellStatusBool = (props: TableCellStatusBoolProps) => {
  const { active, onClick } = props;
  return (
    <td className="text-primary" onClick={onClick}>
      {!active ? 'No' : 'Yes'}
    </td>
  );
};

export default TableCellStatusBool;
