interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>المتطوعون الحاليون: {current}</span>
        <span>المطلوب: {total}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div 
          className="h-full bg-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        {percentage.toFixed(0)}% مكتمل
      </div>
    </div>
  );
}
