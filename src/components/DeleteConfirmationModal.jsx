import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  VStack,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isLoading = false,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        bg={bgColor}
        borderRadius="12px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)">
        <ModalHeader
          borderBottom={`1px solid ${borderColor}`}
          pb={4}>
          <VStack
            spacing={1}
            align="center">
            <Icon
              as={WarningIcon}
              w={12}
              h={12}
              color="red.500"
              bg="red.50"
              borderRadius="full"
              p={2}
            />
          </VStack>
        </ModalHeader>

        <ModalBody
          py={1}
          px={1}>
          <Text
            fontSize="14px"
            color="gray.600"
            textAlign="center"
            lineHeight="1.5">
            {message}
          </Text>
        </ModalBody>

        <ModalFooter
          borderTop={`1px solid ${borderColor}`}
          pt={4}
          gap={3}>
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            gap={3}>
            {" "}
            <Button
              onClick={onClose}
              variant="outline"
              borderColor="gray.300"
              color="gray.600"
              fontSize="14px"
              fontWeight="500"
              px={6}
              py={2}
              borderRadius="8px"
              _hover={{
                bg: "gray.50",
                borderColor: "gray.400",
              }}
              isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              bg="red.500"
              color="white"
              fontSize="14px"
              fontWeight="500"
              px={6}
              py={2}
              borderRadius="8px"
              _hover={{
                bg: "red.600",
              }}
              _active={{
                bg: "red.700",
              }}
              isLoading={isLoading}
              loadingText="Deleting...">
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
