const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "#7C5CFC",
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        {Icon && (
          <div
            className="stat-icon"
            style={{
              color: color,
              backgroundColor: `${color}20`,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <h2>{value}</h2>
      <p>{subtitle}</p>
    </div>
  );
};

export default StatCard;
