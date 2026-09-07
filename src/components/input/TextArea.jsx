const TextArea = (props) => {
  const { label, placeholder, required, readOnly, value, rows, onChange } =
    props;
  return (
    <>
      <div className="form-group mb-3">
        <label className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
        <div>
          <textarea
            type="text"
            className={`form-control ${
              !value && required ? 'is-invalid is-invalid-lite' : ''
            }`}
            rows={rows}
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

export default TextArea;
