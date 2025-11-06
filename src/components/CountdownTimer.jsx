import React, {useState, useEffect, useRef} from "react";
import {Box, Text} from "@chakra-ui/react";

const CountdownTimer = ({
  initialTime = 0, // Time in seconds from API
  onTimeUp = () => {},
  onTick = () => {},
  autoStart = true,
  format = "HH:mm:ss",
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  // Convert seconds to HH:mm:ss format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (format === "HH:mm:ss") {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else if (format === "mm:ss") {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${hours}:${minutes}:${secs}`;
  };

  // Get background color based on time remaining
  const getBackgroundColor = (time) => {
    if (time > 3600) return "white"; // More than 1 hour - white
    if (time > 1800) return "#FEF3C7"; // 30-60 minutes - light yellow
    if (time > 900) return "#FED7AA"; // 15-30 minutes - orange
    return "#FECACA"; // Less than 15 minutes - light red
  };

  // Get text color based on time remaining
  const getTextColor = (time) => {
    if (time > 3600) return "black"; // More than 1 hour - black
    if (time > 1800) return "black"; // 30-60 minutes - black
    if (time > 900) return "#EA580C"; // 15-30 minutes - orange
    return "#DC2626"; // Less than 15 minutes - red
  };

  // Start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Stop the timer
  const stopTimer = () => {
    setIsRunning(false);
  };

  // Reset the timer with new time
  const resetTimer = (newTime) => {
    setTimeLeft(newTime);
    setIsRunning(autoStart);
  };

  // Update timer when initialTime prop changes
  useEffect(() => {
    if (initialTime !== timeLeft) {
      setTimeLeft(initialTime);
      setIsRunning(autoStart);
    }
  }, [initialTime, autoStart]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          // Call onTick callback
          onTick(newTime);

          // If time is up, call onTimeUp callback
          if (newTime <= 0) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp, onTick]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="40px"
      minWidth="80px"
      px={3}
      py={2}
      borderRadius="md"
      bg={getBackgroundColor(timeLeft)}
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.3s ease">
      <Text
        fontSize="14px"
        fontWeight="600"
        color={getTextColor(timeLeft)}
        fontFamily="mono">
        {formatTime(timeLeft)}
      </Text>
    </Box>
  );
};

export default CountdownTimer;
