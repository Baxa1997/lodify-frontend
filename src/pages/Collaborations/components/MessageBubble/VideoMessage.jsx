import React, {useState, useRef} from "react";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
} from "@chakra-ui/react";

function VideoMessage({isOwn, content, fileInfo}) {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const videoUrl = fileInfo?.url || content;
  const fileName = fileInfo?.name || "Video";
  const videoRef = useRef(null);

  if (!videoUrl) {
    return (
      <Box p="10px 14px">
        <Text color={isOwn ? "#fff" : "#181D27"}>Video not available</Text>
      </Box>
    );
  }

  const handleVideoClick = () => {
    setIsVideoPlayerOpen(true);
  };

  return (
    <>
      <Box
        p="0"
        borderRadius="8px"
        cursor="pointer"
        onClick={handleVideoClick}
        overflow="hidden"
        position="relative"
        maxW="100%"
        bg="black">
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
          muted>
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>

        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="50px"
          h="50px"
          borderRadius="50%"
          bg="rgba(0, 0, 0, 0.6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(0, 0, 0, 0.8)",
            transform: "translate(-50%, -50%) scale(1.1)",
          }}>
          <Box
            color="white"
            fontSize="26px"
            ml="4px"
            display="flex"
            alignItems="center"
            justifyContent="center">
            ▶
          </Box>
        </Box>
      </Box>

      <Modal
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        size="xl"
        isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent
          maxW="900px"
          maxH="700px"
          borderRadius="12px"
          overflow="hidden">
          <ModalHeader
            bg="#f7fafc"
            borderBottom="1px solid #e2e8f0"
            fontSize="18px"
            fontWeight="600">
            {fileName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <AspectRatio maxW="100%" ratio={16 / 9}>
              <video
                controls
                style={{
                  width: "100%",
                  height: "100%",
                }}>
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </AspectRatio>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default VideoMessage;
