const Header = ({
  title = "Dashboard",
  subtitle = "Track your coding journey.",
  eyebrow = "",
  actions = null,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        {eyebrow && <span className="page-header-eyebrow">{eyebrow}</span>}
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
};

export default Header;
