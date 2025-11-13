import React, {useState, useEffect} from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  Select,
} from "@chakra-ui/react";
import CountdownTimer from "./CountdownTimer";
import useCountdownTimer from "../hooks/useCountdownTimer";

const TimerExample = () => {
  const [apiTime, setApiTime] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("HH:mm:ss");
  const [customTime, setCustomTime] = useState("");

  const {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    updateTimeLeft,
  } = useCountdownTimer(apiTime, true);

  const fetchTimeFromAPI = () => {
    const timeOptions = [7200, 3600, 1800, 900, 300];

    const randomTime =
      timeOptions[Math.floor(Math.random() * timeOptions.length)];
    setApiTime(randomTime);
  };

  const parseTimeString = (timeString) => {
    const parts = timeString.split(":");
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  const handleCustomTime = () => {
    const seconds = parseTimeString(customTime);
    if (seconds > 0) {
      setApiTime(seconds);
    }
  };

  const handleTimeUp = () => {
    console.log("Timer finished!");
  };

  const handleTick = (timeLeft) => {
    console.log("Time left:", timeLeft);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        fetchTimeFromAPI();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={6} maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Countdown Timer Example
        </Text>

        <Box textAlign="center">
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            Current Timer:
          </Text>
          <CountdownTimer
            initialTime={timeLeft}
            onTimeUp={handleTimeUp}
            onTick={handleTick}
            format={selectedFormat}
            autoStart={isRunning}
          />
        </Box>

        <HStack spacing={4} justify="center">
          <Button
            colorScheme="green"
            onClick={startTimer}
            isDisabled={isRunning}>
            Start
          </Button>
          <Button colorScheme="red" onClick={stopTimer} isDisabled={!isRunning}>
            Stop
          </Button>
          <Button colorScheme="blue" onClick={() => resetTimer(apiTime)}>
            Reset
          </Button>
        </HStack>

        <Box>
          <Text mb={2} fontSize="md" fontWeight="semibold">
            Simulate API Time Updates:
          </Text>
          <HStack spacing={2}>
            <Button onClick={fetchTimeFromAPI} size="sm">
              Get Random Time from API
            </Button>
            <Text fontSize="sm" color="gray.600">
              Current API Time: {Math.floor(apiTime / 3600)}h{" "}
              {Math.floor((apiTime % 3600) / 60)}m {apiTime % 60}s
            </Text>
          </HStack>
        </Box>

        <Box>
          <Text mb={2} fontSize="md" fontWeight="semibold">
            Set Custom Time:
          </Text>
          <HStack spacing={2}>
            <Input
              placeholder="2:00:00"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              size="sm"
              maxW="120px"
            />
            <Button onClick={handleCustomTime} size="sm">
              Set Time
            </Button>
          </HStack>
        </Box>

        {/* Format Selection */}
        <Box>
          <Text mb={2} fontSize="md" fontWeight="semibold">
            Timer Format:
          </Text>
          <Select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            size="sm"
            maxW="150px">
            <option value="HH:mm:ss">HH:mm:ss</option>
            <option value="mm:ss">mm:ss</option>
          </Select>
        </Box>

        {/* Timer Status */}
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Timer Status:
          </Text>
          <VStack spacing={1} align="start">
            <Text fontSize="sm">Running: {isRunning ? "Yes" : "No"}</Text>
            <Text fontSize="sm">Time Left: {timeLeft} seconds</Text>
            <Text fontSize="sm">API Time: {apiTime} seconds</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default TimerExample;
