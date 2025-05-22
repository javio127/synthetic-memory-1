'use client';

interface LifeClockProps {
  currentDay: number;
  totalDays: number;
}

export default function LifeClock({ currentDay, totalDays }: LifeClockProps) {
  // Calculate the percentage of life completed
  const lifePercentage = (currentDay / totalDays) * 100;
  
  return (
    <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
      <div className="w-40 h-1 bg-white/30 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-white rounded-full" 
          style={{ width: `${lifePercentage}%` }}
        />
      </div>
      <p className="text-sm font-serif">
        Day {currentDay} of {totalDays}
      </p>
    </div>
  );
} 