import React from "react";
import {Button, Flex, Text, Input} from "@chakra-ui/react";
import Select from "@components/Select";
import SearchInput from "@components/SearchInput";

const NotificationFilters = ({
  onSearchChange = () => {},
  onActionButtonClick = () => {},
  onReadAllClick = () => {},
  showReadAll = false,
}) => {
  return (
    <Flex
      mt="20px"
      p="12px 16px"
      bg="#FAFAFA"
      borderRadius="12px"
      alignItems="flex-end"
      gap="12px"
      flexWrap="wrap"
      w="100%"
      justifyContent="space-between">
      <Flex gap="12px" flexWrap="wrap" flex="1">
        <Flex flex="1" minW="150px" maxW="320px" flexDirection="column" gap="6px">
          <SearchInput
            placeholder="Search"
            width="100%"
            onSearch={onSearchChange}
            bg="#fff"
            focusBorderColor="#D5D7DA"
            borderColor="#D5D7DA"
            color="#000"
            height="40px"
            showKeyboardShortcut={false}
          />
        </Flex>

        <Flex flex="1" minW="150px" maxW="200px" flexDirection="column" gap="6px">
          <Select
            height="40px"
            width="100%"
            placeholder="Select"
            options={[{label: "Filter by Equipment", value: "equipment"}]}
          />
        </Flex>

        <Flex w="105px" flexDirection="column" gap="6px">
          <Button
            borderRadius="8px"
            bg="#fff"
            w="100%"
            h="40px"
            border="1px solid #D5D7DA"
            onClick={onActionButtonClick}>
            <Text fontSize="14px" fontWeight="600" color="#414651">
              Reset Filter
            </Text>
          </Button>
        </Flex>
      </Flex>

      {showReadAll && (
        <Flex flexDirection="column" gap="6px">
          <Button
            borderRadius="8px"
            bg="#EF6820"
            w="auto"
            h="40px"
            px="16px"
            border="none"
            onClick={onReadAllClick}
            _hover={{bg: "#DC5A1A"}}>
            <Text fontSize="14px" fontWeight="600" color="white">
              Read All
            </Text>
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default NotificationFilters;
