import clsx from 'clsx';

const Button = ({
  variant = 'primary',
  size,
  children,
  loading,
  loadingText = 'Loading...',
  className,
  ...otherProps
}) => {
  return (
    <button
      disabled={loading}
      className={clsx(`btn btn-${variant} ${className}`, {
        [`btn-${size}`]: size,
      })}
      type="button"
      {...otherProps}
    >
      {loading ? (
        <>
          <span
            style={{ marginRight: '5px' }}
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
