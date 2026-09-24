import { useState, useEffect, useCallback } from 'react';

export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const useCbtTimer = (initialSeconds = 2160, isActive = false, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);


  useEffect(() => {
    if (!isTimerRunning || !isActive) return;

    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning, isActive, onTimeUp]);

  const resetTimer = useCallback((newSeconds) => {
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
    setIsTimerRunning(true);
  }, [initialSeconds]);

  const pauseTimer = useCallback(() => setIsTimerRunning(false), []);
  const resumeTimer = useCallback(() => setIsTimerRunning(true), []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isTimerRunning,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setTimeLeft
  };
};

export default useCbtTimer;
