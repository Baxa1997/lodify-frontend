import React, {useMemo} from "react";
import {Flex, Box, Text, Button} from "@chakra-ui/react";
import {format} from "date-fns";
import {ChevronLeftIcon} from "@chakra-ui/icons";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ChatHeader = ({
  conversation,
  isConnected,
  presence = {},
  setConversation = () => {},
}) => {
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const navigate = useNavigate();
  const {to_name, type, username, item_id, attributes} = conversation;
  const broker = attributes?.broker;
  const carrier = attributes?.carrier;

  const activeLast = useMemo(() => {
    const userPresence = presence[conversation?.to_row_id];

    if (userPresence) {
      return userPresence;
    } else {
      return {
        status: "offline",
        last_seen_at: null,
      };
    }
  }, [presence, conversation?.to_row_id]);

  const goTripsPage = () => {
    if (type === "group") {
      navigate(`/admin/trips/${item_id}`, {
        state: {
          tab: 1,
        },
      });
    }
  };
  console.log("carriercarrier", carrier);
  return (
    <Flex p="10px 8px" alignItems="center" justifyContent="space-between">
      <Flex gap="12px" alignItems="center">
        <Button
          bg="none"
          _hover={{bg: "none"}}
          p="0"
          onClick={() => setConversation(null)}>
          <ChevronLeftIcon width="30px" height="30px" />
        </Button>
        <Box
          w="40px"
          h="40px"
          borderRadius="50%"
          border="1px solid #E9EAEB"
          color="#fff"
          display="flex"
          alignItems="center"
          bg="#F79009"
          fontSize="18px"
          justifyContent="center">
          {to_name?.[0]?.toUpperCase()}
        </Box>
        <Box>
          <Flex
            cursor="pointer"
            onClick={goTripsPage}
            flexDirection="column"
            gap="0px">
            <Text fontSize="16px" fontWeight="600" color="#181D27">
              {type === "group"
                ? isBroker
                  ? `${carrier?.legal_name ?? ""} `
                  : `${broker?.first_name ?? ""} ${broker?.last_name ?? ""}`
                : to_name}
            </Text>
            <Flex alignItems="center" gap="4px" h="20px" borderRadius="4px">
              <Text fontSize="14px" fontWeight="400" color={"#535862"}>
                {activeLast?.status === "online"
                  ? "online"
                  : activeLast?.last_seen_at
                  ? `last seen ${format(
                      new Date(activeLast.last_seen_at),
                      "MM/dd/yyyy HH:mm"
                    )}`
                  : "offline"}
              </Text>
            </Flex>
          </Flex>
          <Text fontSize="14px" fontWeight="400" color="#535862">
            {username}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
