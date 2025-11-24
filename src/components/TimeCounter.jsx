import React, {useState, useEffect} from "react";
import {Box, Text, Tooltip, VStack} from "@chakra-ui/react";
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

  const calculateExpiredTime = (apiTime) => {
    try {
      if (!apiTime) return 0;

      let targetTime;

      if (typeof apiTime === "string" && apiTime.includes("T")) {
        targetTime = new Date(apiTime);
      } else {
        targetTime = new Date(Date.now() + apiTime * 1000);
      }

      const now = new Date();
      const differenceMs = now.getTime() - targetTime.getTime();
      const differenceSeconds = Math.floor(differenceMs / 1000);

      return Math.max(0, differenceSeconds);
    } catch (error) {
      console.error("Error calculating expired time:", error);
      return 0;
    }
  };

  const formatExpiredTime = (seconds) => {
    if (seconds === 0) return "0:00 minutes";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")} minutes`;
    }
  };

  const expiredTime = calculateExpiredTime(arriveBy);
  const isExpired = expiredTime > 0;

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
      <Tooltip
        bg="linear-gradient(to bottom, #1a365d, #2d3748)"
        color="white"
        borderRadius="md"
        p="6px 10px"
        hasArrow
        label={
          isExpired ? (
            <Box minW="180px">
              <VStack spacing={1} align="start">
                <Text fontSize="14px" fontWeight="600" color="white">
                  This task has been expired for
                </Text>
                <Text fontSize="14px" fontWeight="600" color="#FF4444">
                  {formatExpiredTime(expiredTime)}
                </Text>
              </VStack>
            </Box>
          ) : null
        }
        placement="bottom-start"
        openDelay={300}>
        <Text
          fontSize="14px"
          fontWeight="600"
          color={getTimerTextColor(timeLeft)}
          fontFamily="mono">
          {formatTime(timeLeft)}
        </Text>
      </Tooltip>
    </Box>
  );
};

export default TimeCounter;
