const ComponentStatus = ({ status, deleted }) => {
  const lower = status?.toLowerCase();

  const overrideColor =
    lower === 'active' ? 'green' : lower === 'disable' ? 'red' : undefined;

  return (
    <div
      className={`text-${status}`}
      style={overrideColor ? { color: overrideColor } : {}}
    >
      <b>{`${deleted ? 'DEL_' : ''}${status}`}</b>
    </div>
  );
};

export default ComponentStatus;

// const ComponentStatus = (props) => {
//   const { status, deleted } = props;

//   return (
//     <div className={`text-${status}`}>
//       <b>{`${deleted ? 'DEL_' : ''}${status}`}</b>
//     </div>
//   );
// };

// export default ComponentStatus;
