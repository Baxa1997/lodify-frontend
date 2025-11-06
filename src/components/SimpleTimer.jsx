import React, {useState, useEffect} from "react";
import {Box, Text} from "@chakra-ui/react";
import {
  calculateTimeDifference,
  getTimerTextColor,
  formatTime,
} from "@utils/timeUtils";

const SimpleTimer = ({
  timeFromAPI = 0,
  onTimeUp = () => {},
  className = "",
  style = {},
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const calculatedTime = calculateTimeDifference(timeFromAPI);
    setTimeLeft(calculatedTime);
    setIsRunning(calculatedTime > 0);
  }, [timeFromAPI]);

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime <= 0) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="40px"
      minWidth="80px"
      py={2}
      borderRadius="md"
      transition="all 0.3s ease"
      className={className}
      style={style}>
      <Text
        fontSize="14px"
        fontWeight="600"
        color={getTimerTextColor(timeLeft)}
        fontFamily="mono">
        {formatTime(timeLeft)}
      </Text>
    </Box>
  );
};

export default SimpleTimer;
