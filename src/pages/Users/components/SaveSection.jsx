import React from "react";
import { Flex, Box, Text, Button, Spinner } from "@chakra-ui/react";

const SaveSection = ({
  title,
  description,
  p = "0px",
  borderBottom = "none",
  onCancel = () => {},
  onSave = () => {},
  saveLoading = false,
}) => {
  return (
    <Flex
      p={p}
      borderBottom={borderBottom}
      gap={"16px"}
      alignItems={"center"}
      justifyContent={"space-between"}>
      <Box>
        <Text
          fontSize="18px"
          fontWeight="600"
          color="#181D27">
          {title}
        </Text>
        <Text
          fontSize="14px"
          color="#535862">
          {description}
        </Text>
      </Box>

      <Box>
        <Button
          bg={"#fff"}
          border={"1px solid #D5D7DA"}
          color={"#414651"}
          borderRadius={"8px"}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          width="100px"
          _hover={{ bg: "#1570EF" }}
          ml="12px"
          bg={"#1570EF"}
          color={"#fff"}
          borderRadius={"8px"}
          onClick={onSave}
          isLoading={saveLoading}
          loadingText="Saving..."
          disabled={saveLoading}>
          Save
        </Button>
      </Box>
    </Flex>
  );
};

export default SaveSection;
