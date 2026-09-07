const Number = (props) => {
  const { label, placeholder, required, readOnly, value, onChange } = props;
  return (
    <>
      <div className="form-group mb-3 ">
        <label className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
        <div>
          <input
            type="number"
            className={`form-control ${
              !value && required ? 'is-invalid is-invalid-lite' : ''
            }`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};

export default Number;
