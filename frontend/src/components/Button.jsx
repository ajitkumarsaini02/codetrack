import { LoaderCircle } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <LoaderCircle size={16} className="spinner" />}
      {children}
    </button>
  );
};

export default Button;
