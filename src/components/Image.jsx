function Image(props) {
  return (
    <img
      src={props.url}
      alt={props.name}
      width={props.width}
      height={props.height}
      style={{ display: 'block' }}
    />
  );
}

export default Image;
