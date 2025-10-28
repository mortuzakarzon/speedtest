import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

type Props = {
  value: number;
  max?: number;
  label: string;
  unit?: string;
};

export default function SpeedGauge({ value, max = 200, label, unit = "" }: Props) {
  // Limit so the radial bar doesn't wrap weirdly
  const capped = value > max ? max : value;

  const data = [
    {
      name: label,
      value: capped,
      fill: "currentColor",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-card w-full">
      <div className="text-sm text-slate-400">{label}</div>

      <div className="text-4xl font-semibold text-white">
        {value.toFixed(1)}{" "}
        <span className="text-base text-slate-500">{unit}</span>
      </div>

      <div className="w-40 h-40 text-accent flex items-center justify-center">
        <RadialBarChart
          width={160}
          height={160}
          cx={80}
          cy={80}
          innerRadius={60}
          outerRadius={75}
          barSize={12}
          startAngle={180}
          endAngle={0}
          data={data}
        >
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={6} />
        </RadialBarChart>
      </div>

          </div>
  );
}
