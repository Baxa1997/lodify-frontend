import React, { useState } from "react";
import {
  Flex,
  Button,
  Text,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

function DeleteUserButton({
  userId,
  deleteUser = () => {},
  deleteLoading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Flex
        onClick={() => setIsOpen(true)}
        flexDir="column">
        <Text
          fontSize="18px"
          fontWeight="600"
          color="#181D27">
          Delete user account
        </Text>
        <Button
          mt={"10px"}
          p={0}
          h={"20px"}
          display={"flex"}
          alignItems={"center"}
          gap="8px"
          w={"104px"}
          border={"none"}
          bg={"none"}
          _hover={{ bg: "none" }}>
          <img
            src="/img/trash.svg"
            width={"15px"}
            height={"15px"}
            alt="" />
          <Text
            fontSize={"14px"}
            color={"#B42318"}>
            Delete user
          </Text>
        </Button>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        closeOnBlur={true}
        closeOnEsc={true}
        returnFocusOnClose={false}>
        <ModalOverlay
          bg="rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(4px)" />
        <ModalContent
          position="fixed"
          top="25%"
          left="35%"
          transform="translate(-50%, -50%)"
          width="400px"
          borderRadius="12px"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          border="none"
          zIndex={9999}>
          <ModalHeader
            fontSize="18px"
            fontWeight="600"
            color="#181D27"
            p="10px 20px 10px 20px">
            Delete User
          </ModalHeader>
          <ModalCloseButton
            top="16px"
            right="16px"
            size="sm"
            color="#64748b"
            _hover={{ color: "#181D27" }}
          />
          <ModalBody
            fontSize="14px"
            color="#64748b"
            p="10px 20px">
            Are you sure you want to delete ?
          </ModalBody>
          <ModalFooter
            p="10px 20px 10px 20px"
            justifyContent="flex-end">
            <Flex gap="12px">
              <Button
                onClick={onClose}
                variant="outline"
                borderColor="#E2E8F0"
                color="#4A5568"
                bg="white"
                _hover={{ bg: "#F7FAFC" }}
                size="md">
                Cancel
              </Button>
              <Button
                isDisabled={deleteLoading}
                onClick={() => deleteUser(userId)}
                bg="#B42318"
                color="white"
                _hover={{ bg: "#991B1B" }}
                size="md">
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteUserButton;
