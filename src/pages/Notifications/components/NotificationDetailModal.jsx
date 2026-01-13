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
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {formatDate} from "@utils/dateFormats";

const NotificationDetailModal = ({isOpen, onClose, notification}) => {
  const brokerId = useSelector((state) => state.auth?.user_data?.brokers_id);

  const roleType = brokerId ? "broker" : "carrier";

  const navigate = useNavigate();

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
        key: "assets_link",
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

        <ModalBody px="24px" pb="12px">
          <Box mb="24px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
              Severity
            </Text>
            {renderSeverityBadge(severity)}
          </Box>

          <Flex gap="8px" alignItems="center" mb="8px">
            <Text fontSize="14px" fontWeight="600" color="#181D27">
              Customer:
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280">
              {notification?.[roleType]?.legal_name || "N/A"}
            </Text>
          </Flex>

          <Flex gap="8px" alignItems="center" mb="10px">
            <Text fontSize="14px" fontWeight="600" color="#181D27">
              Load ID:
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280">
              #{notification?.load_id || "N/A"}
            </Text>
          </Flex>

          <Box mb="8px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="4px">
              Origin:
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="2px">
              {notification?.origin?.address || "N/A"}
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280">
              {formatDate(notification?.origin?.arrive_by ?? "")}
            </Text>
          </Box>

          <Box mb="14px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="4px">
              Destination:
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="2px">
              {notification?.destination?.address || "N/A"}
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280">
              {formatDate(notification?.destination?.arrive_by ?? "")}
            </Text>
          </Box>

          <Box mb="10px">
            <Text fontSize="14px" fontWeight="600" color="#181D27" mb="8px">
              Description
            </Text>
            <Text
              fontSize="14px"
              fontWeight="400"
              color="#6B7280"
              lineHeight="1.6"
              whiteSpace="pre-wrap">
              {description}
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter
          pt="8px"
          px="24px"
          pb="12px"
          justifyContent="flex-end"
          gap="12px">
          <Button
            onClick={onClose}
            bg="#fff"
            color="#6B7280"
            fontSize="14px"
            fontWeight="500"
            h="40px"
            px="20px"
            border="1px solid #D1D5DB"
            borderRadius="8px"
            _hover={{
              bg: "#F9FAFB",
              borderColor: "#9CA3AF",
            }}>
            Close
          </Button>
          {notification?.orders_id && (
            <Button
              onClick={() => {
                navigate(`/admin/trips/${notification?.orders_id}`, {
                  state: {
                    label: `${notification?.driver_1?.first_name || ""}.${
                      notification?.driver_1?.last_name || ""
                    }`,
                    tripType: "upcoming",
                  },
                });
                onClose();
              }}
              bg="#EF6820"
              color="#fff"
              fontSize="14px"
              fontWeight="600"
              h="40px"
              px="20px"
              borderRadius="8px"
              _hover={{
                bg: "#DC5A1A",
              }}
              _active={{
                bg: "#C94F15",
              }}>
              View Trip
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationDetailModal;
