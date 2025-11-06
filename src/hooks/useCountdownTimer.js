import {useState, useEffect, useCallback} from "react";

const useCountdownTimer = (apiTime = 0, autoStart = true) => {
  const [timeLeft, setTimeLeft] = useState(apiTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [lastApiTime, setLastApiTime] = useState(apiTime);

  useEffect(() => {
    if (apiTime !== lastApiTime) {
      setTimeLeft(apiTime);
      setLastApiTime(apiTime);
      setIsRunning(autoStart);
    }
  }, [apiTime, lastApiTime, autoStart]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(
    (newTime) => {
      setTimeLeft(newTime);
      setLastApiTime(newTime);
      setIsRunning(autoStart);
    },
    [autoStart]
  );

  const updateTimeLeft = useCallback((newTime) => {
    setTimeLeft(newTime);
  }, []);

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    updateTimeLeft,
  };
};

export default useCountdownTimer;
