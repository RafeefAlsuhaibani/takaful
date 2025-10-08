interface DonutChartProps {
  total: number;
  segments: Array<{ value: number; color: string; label: string }>;
}

export default function DonutChart({ total, segments }: DonutChartProps) {
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment paths
  let currentOffset = 0;
  const segmentPaths = segments.map((segment) => {
    const percentage = segment.value / total;
    const segmentLength = circumference * percentage;
    const strokeDasharray = `${segmentLength} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    
    currentOffset += segmentLength;
    
    return {
      ...segment,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-soft">
      <h3 className="text-center text-sm font-medium text-gray-600 mb-4">
        احصائية المتطوعين
      </h3>
      
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="img"
          aria-label="احصائية المتطوعين"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          
          {/* Segment circles */}
          {segmentPaths.map((segment, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-gray-900">
              {total}
            </div>
            <div className="text-xs text-gray-500">
              متطوع
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-gray-700">{segment.label}</span>
            </div>
            <span className="font-medium text-gray-900">
              {Math.round((segment.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
