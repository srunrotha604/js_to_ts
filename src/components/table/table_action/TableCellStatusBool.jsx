const TableCellStatusBool = (props) => {
  const { active, onClick } = props;
  return (
    <td className="text-primary" onClick={onClick}>
      {!active ? 'No' : 'Yes'}
    </td>
  );
};

export default TableCellStatusBool;
