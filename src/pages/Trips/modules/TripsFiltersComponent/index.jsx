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

const TripsFiltersComponent = ({
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
      <Flex
        flex={"1.2"}
        flexDirection={"column"}
        gap={"8px"}>
        <Text
          color="#414651"
          fontSize={"14px"}
          fontWeight={"500"}>
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

      <Flex
        flex={"1"}
        flexDirection={"column"}
        gap={"8px"}>
        <Text
          color="#414651"
          fontSize={"14px"}
          fontWeight={"500"}>
          Customer
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{ label: "Filter by Customer", value: "Filter by Customer" }]}
        />
      </Flex>

      <Flex
        flex={"1"}
        flexDirection={"column"}
        gap={"8px"}>
        <Text
          color="#414651"
          fontSize={"14px"}
          fontWeight={"500"}>
          Carrier
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{ label: "Filter by Carrier", value: "Filter by Carrier" }]}
        />
      </Flex>

      <Flex
        flex={"1"}
        flexDirection={"column"}
        gap={"8px"}>
        <Text
          color="#414651"
          fontSize={"14px"}
          fontWeight={"500"}>
          Origin
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[{ label: "Filter by Origin", value: "Filter by Origin" }]}
        />
      </Flex>

      <Flex
        flex={"1"}
        flexDirection={"column"}
        gap={"8px"}>
        <Text
          color="#414651"
          fontSize={"14px"}
          fontWeight={"500"}>
          Destination
        </Text>
        <Select
          height={"40px"}
          width={"100%"}
          placeholder="Select"
          options={[
            { label: "Filter by Destination", value: "Filter by Destination" },
          ]}
        />
      </Flex>

      <Flex flexDirection={"column"}>
        <Text
          mb="8px"
          h="22px"></Text>
        <Flex gap={"8px"}>
          {filterButton && (
            <Button
              borderRadius={"8px"}
              bg={"#fff"}
              w={"105px"}
              h={"40px"}
              gap={"8px"}
              border={"1px solid #D5D7DA"}>
              <Text
                fontSize={"14px"}
                fontWeight={"600"}
                color={"#414651"}>
                Reset Filters
              </Text>
            </Button>
          )}

          {actionButton && (
            <Menu>
              <MenuButton
                p="0"
                as={Button}>
                <Button
                  _hover={{
                    background: "#1570EF",
                  }}
                  borderRadius={"8px"}
                  bg={"#fff"}
                  w={"85px"}
                  h={"40px"}
                  gap={"8px"}
                  border={"1px solid #D5D7DA"}
                  onClick={onActionButtonClick}>
                  <Text
                    fontSize={"14px"}
                    fontWeight={"600"}
                    color={"#414651"}>
                    Action
                  </Text>
                </Button>
              </MenuButton>
              <MenuList
                zIndex={99999}
                p="4px 6px"
                border={"1px solid #E9EAEB"}>
                <MenuItem
                  borderRadius={"8px"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={"8px"}>
                  <img
                    src="/img/userIcon.svg"
                    alt="" />
                  <Text
                    fontSize={"14px"}
                    fontWeight={"600"}
                    color={"#414651"}>
                    Assign Load
                  </Text>
                </MenuItem>
                <MenuItem
                  borderRadius={"8px"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={"8px"}>
                  <img
                    src="/img/delete.svg"
                    width={"16px"}
                    height={"16px"}
                    alt=""
                  />
                  <Text
                    fontSize={"14px"}
                    fontWeight={"600"}
                    color={"#D92D20"}>
                    Delete
                  </Text>
                </MenuItem>

                <MenuItem
                  borderRadius={"8px"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={"8px"}>
                  <img
                    src="/img/import.svg"
                    width={"16px"}
                    height={"16px"}
                    alt=""
                  />
                  <Text
                    fontSize={"14px"}
                    fontWeight={"600"}
                    color={"#414651"}>
                    Import
                  </Text>
                </MenuItem>

                <MenuItem
                  borderRadius={"8px"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={"8px"}>
                  <img
                    src="/img/export.svg"
                    width={"16px"}
                    height={"16px"}
                    alt=""
                  />
                  <Text
                    fontSize={"14px"}
                    fontWeight={"600"}
                    color={"#414651"}>
                    Export
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TripsFiltersComponent;
