import type { ChangeEventHandler, ReactNode } from 'react';

interface TextBoxProps {
  label?: ReactNode;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const TextBox = (props: TextBoxProps) => {
  const { label, placeholder, required, readOnly, value, onChange } = props;
  return (
    <>
      <div className="form-group mb-3 ">
        <label className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
        <div>
          <input
            type="text"
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

export default TextBox;
