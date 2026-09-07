const TableCellStatus = (props) => {
  const { active, onClick } = props;
  return (
    <td
      className={`${!active ? 'text-danger' : 'text-primary'} text-underline`}
      onClick={onClick}
    >
      {!active ? 'Disable' : 'Active'}
    </td>
  );
};

export default TableCellStatus;
