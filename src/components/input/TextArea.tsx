import type { ChangeEventHandler, ReactNode } from 'react';

interface TextAreaProps {
  label?: ReactNode;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string | number;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

const TextArea = (props: TextAreaProps) => {
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
