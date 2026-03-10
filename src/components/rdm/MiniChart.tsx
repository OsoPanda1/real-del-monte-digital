import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MiniChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
  showAxis?: boolean;
}

export function MiniChart({ data, color = "hsl(43, 96%, 56%)", height = 200, showAxis = false }: MiniChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id={`gradient-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <>
            <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(220,10%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
          </>
        )}
        <Tooltip
          contentStyle={{
            background: "hsl(220, 18%, 10%)",
            border: "1px solid hsl(220, 15%, 18%)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "hsl(45, 10%, 90%)",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color.replace(/[^a-z0-9]/gi, "")})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
