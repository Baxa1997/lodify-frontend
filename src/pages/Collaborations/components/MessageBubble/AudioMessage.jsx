import React, {useState, useRef, useEffect} from "react";
import {Flex, Box, Text, IconButton, HStack} from "@chakra-ui/react";
import {FaPlay, FaPause} from "react-icons/fa";

function AudioMessage({isOwn, content, fileInfo}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const audioUrl = fileInfo?.url || content;
  const fileName = fileInfo?.name || "Audio";
  const audioDuration = fileInfo?.duration || 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioUrl) {
    return (
      <Box p="10px 14px">
        <Text color={isOwn ? "000" : "#181D27"}>Audio not available</Text>
      </Box>
    );
  }

  return (
    <>
      <Box
        p={isOwn ? "6px 14px 6px 14px" : "6px 14px 6px 14px"}
        borderRadius="12px"
        bg={isOwn ? "transparent" : "#080707"}
        color={isOwn ? "#080707" : "#181D27"}
        maxW="100%"
        minW="100%"
        cursor="pointer"
        transition="all 0.2s ease">
        <Flex gap="12px" alignItems="center">
          <IconButton
            size="sm"
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            bg={isOwn ? "#fff" : "#007AFF"}
            color={isOwn ? "#080707" : "#080707"}
            borderRadius="50%"
            w="36px"
            h="36px"
            _hover={{
              bg: isOwn ? "rgba(255, 255, 255, 0.3)" : "#0056CC",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            disabled={isLoading}
          />

          <Box flex="1" minW="0">
            <HStack justify="space-between" mb="4px">
              <Text
                color={isOwn ? "#080707" : "#181D27"}
                fontWeight="600"
                fontSize="14px"
                noOfLines={1}>
                {fileName.includes("Voice Message")
                  ? "🎤 Voice Message"
                  : fileName}
              </Text>
              <Text
                color={isOwn ? "#080707" : "#535862"}
                fontSize="12px"
                fontWeight="500">
                {formatTime(duration || audioDuration)}
              </Text>
            </HStack>

            <Box position="relative" onClick={handleSeek} cursor="pointer">
              <Box
                h="4px"
                bg={isOwn ? "#fff" : "#E5E7EB"}
                borderRadius="2px"
                overflow="hidden">
                <Box
                  h="100%"
                  bg={isOwn ? "#080707" : "#007AFF"}
                  borderRadius="2px"
                  width={`${duration ? (currentTime / duration) * 100 : 0}%`}
                  transition="width 0.1s ease"
                />
              </Box>
            </Box>

            <HStack justify="space-between" mt="4px">
              <Text color={isOwn ? "#080707" : "#9CA3AF"} fontSize="11px">
                {formatTime(currentTime)}
              </Text>
              {/* <Text
                color={isOwn ? "rgba(255, 255, 255, 0.7)" : "#9CA3AF"}
                fontSize="11px">
                {formatTime(duration || audioDuration)}
              </Text> */}
            </HStack>
          </Box>
        </Flex>

        <audio
          style={{
            display: "none",
          }}
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onLoadStart={() => setIsLoading(true)}
        />
      </Box>
    </>
  );
}

export default AudioMessage;
