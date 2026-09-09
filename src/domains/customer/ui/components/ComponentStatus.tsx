interface ComponentStatusProps {
  status?: string;
  deleted?: boolean;
}
const ComponentStatus = ({ status, deleted = false }: ComponentStatusProps) => {
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
