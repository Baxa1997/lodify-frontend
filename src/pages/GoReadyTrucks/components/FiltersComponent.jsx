import React from "react";
import {Button, Flex, Text, Input} from "@chakra-ui/react";
import Select from "@components/Select";
import SearchInput from "@components/SearchInput";

const FiltersComponent = ({
  onSearchChange = () => {},
  onActionButtonClick = () => {},
}) => {
  return (
    <Flex
      mt="20px"
      p="12px 16px"
      bg="#FAFAFA"
      borderRadius="12px"
      alignItems="flex-end"
      justifyContent="space-between"
      gap="12px"
      flexWrap="wrap"
      w="100%">
      <Flex flex="1" minW="150px" maxW="200px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          Origin
        </Text>
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

      <Flex w="80px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          DH-O
        </Text>
        <Input
          border="1px solid #D5D7DA"
          placeholder="150"
          width="100%"
          height="40px"
          fontSize="14px"
          fontWeight="400"
          color="#717680"
        />
      </Flex>

      <Flex flex="1" minW="150px" maxW="200px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          Destination
        </Text>
        <SearchInput
          placeholder="Search"
          width="100%"
          bg="#fff"
          focusBorderColor="#D5D7DA"
          borderColor="#D5D7DA"
          color="#000"
          height="40px"
          showKeyboardShortcut={false}
        />
      </Flex>

      <Flex w="80px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          DH-O
        </Text>
        <Input
          border="1px solid #D5D7DA"
          placeholder="150"
          width="100%"
          height="40px"
          fontSize="14px"
          fontWeight="400"
          color="#717680"
        />
      </Flex>

      <Flex flex="1" minW="150px" maxW="200px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          Equipment Type
        </Text>
        <Select
          height="40px"
          width="100%"
          placeholder="Select"
          options={[{label: "Filter by Equipment", value: "equipment"}]}
        />
      </Flex>

      <Flex flex="1" minW="150px" maxW="200px" flexDirection="column" gap="6px">
        <Text color="#414651" fontSize="14px" fontWeight="500">
          Company
        </Text>
        <Select
          height="40px"
          width="100%"
          placeholder="Select"
          options={[{label: "Filter by Company", value: "company"}]}
        />
      </Flex>

      <Flex w="105px" flexDirection="column" gap="6px">
        <Text h="22px"></Text>
        <Button
          borderRadius="8px"
          bg="#fff"
          w="100%"
          h="40px"
          border="1px solid #D5D7DA"
          onClick={onActionButtonClick}>
          <Text fontSize="14px" fontWeight="600" color="#414651">
            Reset
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default FiltersComponent;
