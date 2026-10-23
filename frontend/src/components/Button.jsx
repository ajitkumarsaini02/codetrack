import { LoaderCircle } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoaderCircle size={17} className="spinner" />}
      {children}
    </button>
  );
};

export default Button;
