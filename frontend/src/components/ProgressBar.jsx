const ProgressBar = ({
  label = "Daily Goal",
  value = 0,
  max = 5,
  color = "#739775",
}) => {
  const percentage =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="progress-wrapper">
      <div className="progress-heading">
        <span className="progress-label">{label}</span>
        <span className="progress-counts">
          <strong className="progress-current">
            {Number(value || 0).toLocaleString()}
          </strong>
          <span className="progress-max">
            / {Number(max || 1).toLocaleString()}
          </span>
          <span
            className="progress-pill-badge"
            style={{
              color: color,
              backgroundColor: `${color}18`,
              borderColor: `${color}33`,
            }}
          >
            {percentage.toFixed(1)}%
          </span>
        </span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
