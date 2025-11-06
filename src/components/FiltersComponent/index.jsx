import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import SearchInput from "../SearchInput";
import Select from "../Select";

const FiltersComponent = ({
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
        gap={"12px"}
        alignItems={"center"}>
        <SearchInput
          placeholder={"Search for name, email, phone..."}
          width={"300px"}
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

        {filterByDomicile && (
          <Select
            height={"40px"}
            width={"294px"}
            placeholder="Filter by Domicile(s)"
          />
        )}
      </Flex>

      <Flex
        gap={"12px"}
        alignItems={"center"}>
        {verifySelect && (
          <Select
            height={"40px"}
            width={"200px"}
            placeholder="Verification status"
          />
        )}

        {filterButton && (
          <Button
            borderRadius={"8px"}
            bg={"#fff"}
            w={"100px"}
            h={"40px"}
            gap={"8px"}
            border={"1px solid #D5D7DA"}>
            <img
              src="/img/filter-lines.svg"
              alt="" />
            <Text
              fontSize={"14px"}
              fontWeight={"600"}
              color={"#414651"}>
              Filters
            </Text>
          </Button>
        )}

        {addButton && (
          <Button
            _hover={{
              background: "#1570EF",
            }}
            borderRadius={"8px"}
            bg={"#1570EF"}
            w={"119px"}
            h={"40px"}
            gap={"8px"}
            onClick={onAddUserClick}>
            <img
              src="/img/addIcon.svg"
              alt="" />
            <Text
              fontSize={"14px"}
              fontWeight={"600"}
              color={"#fff"}>
              Add
            </Text>
          </Button>
        )}

        {actionButton && (
          <Button
            borderRadius={"8px"}
            bg={"#1570EF"}
            w={"80px"}
            h={"40px"}
            gap={"8px"}
            _hover={{
              background: "#1570ef",
            }}
            onClick={onActionButtonClick}>
            <Text
              fontSize={"14px"}
              fontWeight={"600"}
              color={"#fff"}>
              {actionButtonText || "Action"}
            </Text>
          </Button>
        )}

        {lastAddButton && (
          <Button
            _hover={{
              background: "#1570EF",
            }}
            borderRadius={"8px"}
            bg={"#1570EF"}
            w={"90px"}
            h={"40px"}
            gap={"8px"}
            onClick={onLastAddButtonClick}>
            <img
              src="/img/addIcon.svg"
              alt="" />
            <Text
              fontSize={"14px"}
              fontWeight={"600"}
              color={"#fff"}>
              Add
            </Text>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default FiltersComponent;
