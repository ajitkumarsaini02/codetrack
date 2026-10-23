const ProgressBar = ({
  label = "Daily Goal",
  value = 0,
  max = 5,
  color = "#7C5CFC",
}) => {
  const percentage =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="progress-wrapper">
      <div className="progress-heading">
        <span style={{ fontWeight: 600, color: "#F1F5F9" }}>{label}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <strong style={{ color: "#F8FAFC" }}>
            {Number(value || 0).toLocaleString()}
          </strong>
          <span style={{ color: "#94A3B8" }}>
            / {Number(max || 1).toLocaleString()}
          </span>
          <span
            style={{
              color: color,
              backgroundColor: `${color}18`,
              border: `1px solid ${color}35`,
              borderRadius: "6px",
              padding: "1px 6px",
              fontSize: "11px",
              fontWeight: 700,
              minWidth: "44px",
              textAlign: "center",
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
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
