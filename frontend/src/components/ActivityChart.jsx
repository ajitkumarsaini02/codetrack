import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "../hooks/useTheme";

const ActivityChart = ({ data }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const chartData =
    data && data.length > 0
      ? data
      : [
          { day: "Mon", solved: 0 },
          { day: "Tue", solved: 0 },
          { day: "Wed", solved: 0 },
          { day: "Thu", solved: 0 },
          { day: "Fri", solved: 0 },
          { day: "Sat", solved: 0 },
          { day: "Sun", solved: 0 },
        ];

  return (
    <div className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <h3>Activity Overview</h3>
          <p>Your coding practice this week</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="#7C5CFC"
                  stopOpacity={isLight ? 0.3 : 0.4}
                />
                <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={isLight ? "#E2E8F0" : "#293449"}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              stroke={isLight ? "#64748B" : "#9CA3AF"}
              tick={{ fill: isLight ? "#64748B" : "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              stroke={isLight ? "#64748B" : "#9CA3AF"}
              tick={{ fill: isLight ? "#64748B" : "#9CA3AF", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                background: isLight ? "#FFFFFF" : "#171F32",
                border: isLight ? "1px solid #CBD5E1" : "1px solid #293449",
                borderRadius: "10px",
                color: isLight ? "#0F172A" : "#F3F4F6",
                boxShadow: isLight
                  ? "0 10px 25px rgba(15, 23, 42, 0.1)"
                  : "0 10px 25px rgba(0, 0, 0, 0.5)",
              }}
              labelStyle={{
                color: isLight ? "#0F172A" : "#F3F4F6",
                fontWeight: 600,
              }}
              itemStyle={{ color: "#7C5CFC", fontWeight: 600 }}
            />

            <Area
              type="monotone"
              dataKey="solved"
              name="Problems Solved"
              stroke="#7C5CFC"
              strokeWidth={3}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
