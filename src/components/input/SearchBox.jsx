import SearchIcon from '../Icons/SearchIcon';
const SearchBox = (props) => {
  const { onChange } = props;
  return (
    <div className="ms-auto text-secondary">
      <div className="input-icon">
        <span className="input-icon-addon">
          <SearchIcon />
        </span>
        <input
          cursor="pointer"
          type="text"
          className="form-control"
          placeholder="Search …"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBox;
