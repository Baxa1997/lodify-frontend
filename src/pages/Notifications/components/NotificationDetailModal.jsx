import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  Text,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";

const NotificationDetailModal = ({isOpen, onClose, notification}) => {
  const renderSeverityBadge = (severity) => {
    const severityLower = severity?.toLowerCase() || "";
    let bgColor = "#6B7280";
    let label = severity || "Unknown";

    if (severityLower === "critical") {
      bgColor = "#D92D20";
      label = "Critical";
    } else if (severityLower === "high") {
      bgColor = "#EF6820";
      label = "High";
    } else if (severityLower === "medium") {
      bgColor = "#F59E0B";
      label = "Medium";
    } else if (severityLower === "low") {
      bgColor = "#10B981";
      label = "Low";
    }

    return (
      <Box
        display="inline-flex"
        alignItems="center"
        gap="6px"
        bg={bgColor}
        color="white"
        px="10px"
        py="4px"
        borderRadius="22px"
        fontSize="12px"
        fontWeight="600">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="16px"
          border="2px solid #fff"
          h="16px"
          borderRadius="50%"
          bg={bgColor}
          flexShrink={0}>
          <Text color={"#fff"} fontSize="10px" fontWeight="bold" lineHeight="1">
            !
          </Text>
        </Box>
        <Text color="white" fontSize="12px" fontWeight="600">
          {label}
        </Text>
      </Box>
    );
  };

  const title = notification?.title || "Notification Details";
  const severity = notification?.type?.[0] || notification?.type || "";
  const description =
    notification?.description ||
    notification?.message ||
    notification?.body ||
    "No description available.";

  const links = notification?.links ||
    notification?.action_links || [
      {
        text: "See California Compliance document",
        url: notification?.compliance_link || "#",
      },
      {
        text: "See Assets",
        url: notification?.assets_link || "#",
      },
    ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        borderRadius="12px"
        maxW="600px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)">
        <ModalHeader
          fontSize="18px"
          fontWeight="700"
          color="#181D27"
          pb="16px"
          pr="20px"
          py="10px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="18px" fontWeight="700" color="#181D27">
              {title}
            </Text>
            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color="#6B7280"
              _hover={{color: "#181D27"}}
            />
          </Flex>
        </ModalHeader>

        <ModalBody px="20px" pb="20px">
          <Box mb="24px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="8px">
              Severity
            </Text>
            {renderSeverityBadge(severity)}
          </Box>

          <Box mb="24px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="8px">
              Description
            </Text>
            <Text
              fontSize="14px"
              color="#374151"
              lineHeight="1.6"
              whiteSpace="pre-wrap">
              {description}
            </Text>
          </Box>

          {links && links.length > 0 && (
            <Box>
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  color="#EF6820"
                  fontSize="14px"
                  textDecoration="underline"
                  _hover={{color: "#DC5A1A"}}
                  display="block"
                  mb={index < links.length - 1 ? "8px" : "0"}>
                  {link.text}
                </Link>
              ))}
            </Box>
          )}
        </ModalBody>

        <ModalFooter pt="10px" justifyContent="flex-end">
          <Button
            onClick={onClose}
            bg="#fff"
            color="#374151"
            fontSize="14px"
            fontWeight="500"
            h="36px"
            px="16px"
            border="1px solid #D5D7DA"
            borderRadius="8px"
            _hover={{
              bg: "#E5E7EB",
            }}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationDetailModal;
