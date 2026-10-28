const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "#D6AD70",
  badge = null,
  progress = null,
  className = "",
}) => {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>

        <div className="stat-card-top-right">
          {badge && <span className="stat-card-badge">{badge}</span>}
          {Icon && (
            <div
              className="stat-icon"
              style={{
                color: color,
                backgroundColor: `${color}14`,
                borderColor: `${color}28`,
              }}
            >
              <Icon size={18} />
            </div>
          )}
        </div>
      </div>

      <div className="stat-card-main">
        <div className="stat-card-value">{value}</div>
        {progress != null && (
          <div className="stat-card-mini-track">
            <div
              className="stat-card-mini-fill"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: color,
              }}
            />
          </div>
        )}
      </div>

      {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
