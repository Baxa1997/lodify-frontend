import React, {useRef, useState, useEffect} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Input,
  VStack,
  Flex,
} from "@chakra-ui/react";
import {format} from "date-fns";

const SignAndAcceptModal = ({isOpen, onClose, onAccept, brokerName = ""}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [todayDate] = useState(() => format(new Date(), "dd/MM/yyyy"));

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [isOpen]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleAccept = () => {
    if (!hasSignature) {
      return;
    }
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL("image/png");
    onAccept({
      broker: brokerName,
      date: todayDate,
      signature: signatureDataUrl,
    });
    handleClose();
  };

  const handleClose = () => {
    clearSignature();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent borderRadius="12px" bg="white" maxW="500px">
        <ModalHeader
          fontSize="18px"
          fontWeight="600"
          color="#181D27"
          pb="16px"
          borderBottom="1px solid #E9EAEB">
          Sign and Accept
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py="24px">
          <VStack spacing="20px" align="stretch">
            {/* Broker Field */}
            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Broker <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <Input
                value={brokerName}
                readOnly
                border="1px solid #D5D7DA"
                borderRadius="8px"
                bg="#F8F9FA"
                fontSize="14px"
                height="40px"
                _focus={{
                  borderColor: "#FF6B35",
                  boxShadow: "0 0 0 1px #FF6B35",
                }}
              />
            </Box>

            {/* Date Field */}
            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Date (Today) <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <Input
                value={todayDate}
                readOnly
                border="1px solid #D5D7DA"
                borderRadius="8px"
                bg="#F8F9FA"
                fontSize="14px"
                height="40px"
                _focus={{
                  borderColor: "#FF6B35",
                  boxShadow: "0 0 0 1px #FF6B35",
                }}
              />
            </Box>

            {/* Signature Field */}
            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Sign <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <Box
                border="2px dashed #D5D7DA"
                borderRadius="8px"
                p="16px"
                bg="#FAFAFA"
                position="relative"
                minH="150px">
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={150}
                  style={{
                    width: "100%",
                    height: "150px",
                    cursor: "crosshair",
                    touchAction: "none",
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </Box>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid #E9EAEB" pt="16px">
          <Flex width="100%" justifyContent="space-between" gap="12px">
            <Button
              variant="ghost"
              color="#FF6B35"
              fontSize="14px"
              fontWeight="500"
              onClick={clearSignature}
              isDisabled={!hasSignature}
              _hover={{bg: "#FEF3EE"}}>
              Clear Sign
            </Button>
            <Flex gap="12px">
              <Button
                variant="outline"
                border="1px solid #D5D7DA"
                color="#414651"
                bg="white"
                fontSize="14px"
                fontWeight="500"
                onClick={handleClose}
                _hover={{bg: "#F8F9FA"}}>
                Close
              </Button>
              <Button
                bg="#FF6B35"
                color="white"
                fontSize="14px"
                fontWeight="500"
                onClick={handleAccept}
                // isDisabled={!hasSignature}
                _hover={{bg: "#E55A2B"}}>
                Accept
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignAndAcceptModal;
