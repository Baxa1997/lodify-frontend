import React from "react";
import {
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Select from "@components/Select";
import SearchInput from "@components/SearchInput";

const AllLoadsFiltersComponent = ({
  filterButton = false,
  filterByDomicile = false,
  actionButton = false,
  lastAddButton = false,
  addButton = false,
  verifySelect = false,
  onSearchChange = () => {},
  actionButtonText = "Action",
  onAddUserClick = () => {},
  onActionButtonClick = () => {},
  onLastAddButtonClick = () => {},
}) => {
  return (
    <Flex
      p={"12px 16px"}
      bg={"#FAFAFA"}
      borderRadius={"12px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={"12px"}>
      <Flex flex={"1.2"} flexDirection={"column"} gap={"8px"}>
        <Text color="#414651" fontSize={"14px"} fontWeight={"500"}>
          Load ID
        </Text>
        <SearchInput
          placeholder={"Search By ID"}
          width={"100%"}
          placeholderStyle={{
            fontSize: "14px",
            fontWeight: "400",
            color: "#717680",
          }}
          onSearch={onSearchChange}
          bg={"#fff"}
          focusBorderColor={"#D5D7DA"}
          borderColor={"#D5D7DA"}
          color={"#000"}
          showKeyboardShortcut={false}
        />
      </Flex>

      <Flex flex={"1"} flexDirection={"column"} gap={"8px"}>
        <Text color="#414651" fontSize={"14px"} fontWeight={"500"}>
          Broker
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{label: "Filter by Customer", value: "Filter by Customer"}]}
        />
      </Flex>

      <Flex flex={"1"} flexDirection={"column"} gap={"8px"}>
        <Text color="#414651" fontSize={"14px"} fontWeight={"500"}>
          Origin
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{label: "Filter by Carrier", value: "Filter by Carrier"}]}
        />
      </Flex>

      <Flex flex={"1"} flexDirection={"column"} gap={"8px"}>
        <Text color="#414651" fontSize={"14px"} fontWeight={"500"}>
          Destination
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{label: "Filter by Origin", value: "Filter by Origin"}]}
        />
      </Flex>

      <Flex flexDirection={"column"}>
        <Text mb="8px" h="22px"></Text>
        <Flex gap={"8px"}>
          {filterButton && (
            <Button
              borderRadius={"8px"}
              bg={"#fff"}
              w={"105px"}
              h={"40px"}
              gap={"8px"}
              border={"1px solid #D5D7DA"}>
              <Text fontSize={"14px"} fontWeight={"600"} color={"#414651"}>
                Reset Filters
              </Text>
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AllLoadsFiltersComponent;
