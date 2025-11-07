import React, {useState, useEffect} from "react";
import {Box, Text} from "@chakra-ui/react";
import {getTimerTextColor, formatTime} from "@utils/timeUtils";

const TimeCounter = ({
  arriveBy = null,
  onTimeUp = () => {},
  className = "",
  style = {},
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const calculateTimeUntilArrival = (arriveByTime) => {
    if (!arriveByTime) return 0;

    const now = new Date().getTime();

    const arrivalTimeWithOffset =
      new Date(arriveByTime).getTime() + 5 * 60 * 60 * 1000;

    const elapsedInSeconds = Math.floor((now - arrivalTimeWithOffset) / 1000);
    const twoHoursInSeconds = 2 * 60 * 60;
    if (elapsedInSeconds < 0) {
      return 0;
    }
    if (elapsedInSeconds > twoHoursInSeconds) {
      return 0;
    }

    return elapsedInSeconds;
  };

  useEffect(() => {
    const calculatedTime = calculateTimeUntilArrival(arriveBy);
    setTimeLeft(calculatedTime);
    setIsRunning(calculatedTime > 0);
  }, [arriveBy]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const twoHoursInSeconds = 2 * 60 * 60;
          const newTime = prevTime + 1;

          if (newTime >= twoHoursInSeconds) {
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
  }, [isRunning, onTimeUp]);

  useEffect(() => {
    if (!arriveBy) return;

    const syncInterval = setInterval(() => {
      const calculatedTime = calculateTimeUntilArrival(arriveBy);

      if (Math.abs(calculatedTime - timeLeft) > 2) {
        setTimeLeft(calculatedTime);
        setIsRunning(calculatedTime > 0);
      }
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [arriveBy, timeLeft]);

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

export default TimeCounter;
