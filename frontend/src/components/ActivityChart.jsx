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

  // Forest Green, Warm Cream & Terracotta Tokens
  const accentColor = isLight ? "#315B40" : "#739775";
  const terracottaColor = isLight ? "#B95F45" : "#D47E62";
  const gridColor = isLight ? "#DED5C4" : "#354638";
  const textColor = isLight ? "#626C5F" : "#B5BEAE";
  const cardBg = isLight ? "#FFFCF5" : "#1D2A20";
  const borderColor = isLight ? "#DED5C4" : "#354638";
  const headingColor = isLight ? "#24352A" : "#F4F0E5";

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
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 4 }}
          >
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={accentColor}
                  stopOpacity={isLight ? 0.22 : 0.3}
                />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke={gridColor}
              tickLine={false}
              axisLine={false}
              tick={{ fill: textColor, fontSize: 11.5 }}
            />
            <YAxis
              allowDecimals={false}
              stroke={gridColor}
              tickLine={false}
              axisLine={false}
              tick={{ fill: textColor, fontSize: 11.5 }}
            />

            <Tooltip
              contentStyle={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                color: headingColor,
                boxShadow: isLight
                  ? "0 4px 12px rgba(41, 40, 33, 0.08)"
                  : "0 8px 24px rgba(0, 0, 0, 0.5)",
                padding: "8px 12px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: headingColor,
                fontWeight: 600,
                marginBottom: 2,
              }}
              itemStyle={{ color: accentColor, fontWeight: 600, padding: 0 }}
            />

            <Area
              type="monotone"
              dataKey="solved"
              name="Problems Solved"
              stroke={accentColor}
              strokeWidth={2.4}
              fill="url(#activityGradient)"
              dot={{
                r: 3.5,
                fill: accentColor,
                stroke: cardBg,
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 5.5,
                fill: terracottaColor,
                stroke: cardBg,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
