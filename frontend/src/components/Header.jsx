const Header = ({
  title = "Dashboard",
  subtitle = "Track your coding journey.",
}) => {
  return (
    <div className="page-header">
      <div className="header-title">
        <p className="eyebrow">YOUR CODING JOURNEY</p>
        <h1>{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default Header;
