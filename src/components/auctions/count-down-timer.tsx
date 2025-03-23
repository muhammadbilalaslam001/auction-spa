import { useState, useEffect } from 'react';
import { formatTimeLeft } from '@/utils/format';

interface CountdownTimerProps {
  endDate: Date;
  onComplete?: () => void;
}

const CountdownTimer = ({ endDate, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const end = new Date(endDate);

    const updateTimer = () => {
      const now = new Date();
      const distance = end.getTime() - now.getTime();

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft('Auction ended');
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTimeLeft(formatTimeLeft(end));
    };

    // Initial call
    updateTimer();

    // Set up the interval
    const interval = setInterval(updateTimer, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, [endDate, onComplete]);

  return (
    <div
      className={`countdown-timer font-semibold ${isExpired ? 'text-gray-600' : 'text-secondary-600'}`}
    >
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;
