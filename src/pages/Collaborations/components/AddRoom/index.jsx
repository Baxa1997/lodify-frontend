import {
  Button,
  Flex,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  VStack,
  HStack,
  IconButton,
  Divider,
  Badge,
} from "@chakra-ui/react";
import React, {useState, useEffect} from "react";
import SearchInput from "@components/SearchInput";
import {LuX, LuMessageCircle} from "react-icons/lu";
import styles from "./AddRoom.module.scss";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {useSocket} from "@context/SocketProvider";
import chatService from "@services/chatService";

const AddRoom = ({isOpen, onClose, text = "Secret Chat"}) => {
  const socket = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const projectId = useSelector((state) => state.auth.projectId);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const userId = useSelector((state) => state.auth.userInfo?.id);
  const loginName = useSelector((state) => state.auth.user_data?.login);
  const clientTypeId = useSelector((state) => state.auth?.clientType?.id);
  const environmentId = useSelector((state) => state.auth?.environmentId);

  const {data: users, isLoading} = useQuery({
    queryKey: ["contacts"],
    queryFn: () => {
      return chatService.getUsersList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: environmentId,
        method: "get",
        object_data: {
          client_type_id: clientTypeId,
          user_id: userId,
        },
        table: "users",
      });
    },
    enabled: Boolean(isOpen),
    select: (res) =>
      res?.data?.response?.filter((user) => user?.user_id_auth !== userId) ||
      [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(users ?? []);
    } else {
      const filtered = users?.filter(
        (contact) =>
          contact?.login?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.username &&
            contact.username.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredContacts(filtered ?? []);
    }
  }, [searchQuery]);

  const handleContactClick = async (contact) => {
    if (!socket) {
      console.error("Socket not available");
      return;
    }
    const roomData = {
      name: "",
      type: "single",
      project_id: projectId,
      row_id: userId,
      to_name: contact.login,
      to_row_id: contact.user_id_auth,
      from_name: loginName,
    };
    console.log("roomData", roomData);
    try {
      socket.emit("create room", {...roomData});
      onClose();
    } catch (httpError) {
      socket.emit("create room", roomData);
      onClose();
    }
  };

  useEffect(() => {
    if (Boolean(!searchQuery)) {
      setFilteredContacts(users ?? []);
    }
  }, [users]);

  const ContactItem = ({contact}) => (
    <HStack
      spacing={1}
      p={1}
      borderRadius="lg"
      cursor="pointer"
      onClick={() => handleContactClick(contact)}>
      <Box position="relative">
        <Avatar
          size="sm"
          name={contact?.login?.[0]}
          bg={contact.color || "blue.500"}
          color="white"
          fontWeight="bold"
          border="2px solid"
          borderColor="gray.200"
        />
        {contact.isOnline && (
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="12px"
            h="12px"
            bg="green.400"
            borderRadius="full"
            border="2px solid"
            borderColor="white"
          />
        )}
      </Box>

      <VStack align="start" spacing={0} flex={1}>
        <HStack spacing={1} align="center">
          <Text color="gray.800" fontWeight="medium" fontSize="md">
            {contact.login}
          </Text>
          {contact.badge && (
            <Badge size="sm" variant="solid" borderRadius="sm" px={1} py={0.5}>
              {contact.badge}
            </Badge>
          )}
          {contact.flags && (
            <HStack spacing={1}>
              {contact.flags.map((flag, index) => (
                <Text key={index} fontSize="sm">
                  {flag}
                </Text>
              ))}
            </HStack>
          )}
        </HStack>
        {contact.username ? (
          <Text color="blue.500" fontSize="sm">
            {contact.username}
          </Text>
        ) : (
          <Text color="gray.500" fontSize="sm">
            {contact.lastSeen}
          </Text>
        )}
      </VStack>

      <IconButton
        size="sm"
        variant="ghost"
        color="gray.500"
        icon={<LuMessageCircle size={16} />}
        aria-label="Start chat"
      />
    </HStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        className={styles.modalContent}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        maxH="80vh"
        overflow="hidden"
        boxShadow="xl">
        <ModalHeader
          className={styles.header}
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={4}
          position="relative">
          <HStack justify="space-between" align="center">
            <IconButton
              size="sm"
              variant="ghost"
              color="gray.600"
              icon={<LuX size={20} />}
              onClick={onClose}
              aria-label="Close"
            />
            <Text color="gray.800" fontWeight="semibold" fontSize="lg">
              {text}
            </Text>
            <Box w="40px" />
          </HStack>
        </ModalHeader>

        <ModalBody p={0} overflow="hidden">
          <VStack spacing={0} h="full">
            <Box p={4} w="full">
              <SearchInput
                placeholder="Search"
                onSearch={setSearchQuery}
                showKeyboardShortcut={false}
                bg="gray.50"
                borderColor="gray.300"
                focusBorderColor="blue.400"
                color="gray.800"
                placeholderStyle={{
                  color: "gray.500",
                  fontSize: "16px",
                }}
                _hover={{borderColor: "gray.400"}}
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                }}
              />
            </Box>

            <Divider borderColor="gray.200" />

            <Box w="full" maxH="400px" overflowY="auto">
              <VStack spacing={0} align="stretch" p={2}>
                {filteredContacts?.length > 0 ? (
                  filteredContacts
                    ?.filter((contact) => contact.id !== userId)
                    ?.map((contact) => (
                      <ContactItem key={contact.id} contact={contact} />
                    ))
                ) : (
                  <Box p={8} textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No contacts found
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddRoom;
