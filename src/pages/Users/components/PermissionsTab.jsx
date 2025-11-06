import React from "react";
import SaveSection from "./SaveSection";
import { Box, Button } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

function PermissionsTab({
  userId,
  watch,
  setValue,
  control,
  saveLoading = false,
  onSave = () => {},
  onCancel = () => {},
}) {
  return (
    <Box mt={"24px"}>
      <SaveSection
        title="Permissions"
        description=""
        onCancel={onCancel}
        onSave={onSave}
        saveLoading={saveLoading}
        borderBottom="1px solid #E9EAEB"
        p={"0 0 20px 0"}
      />

      <Flex
        gap="64px"
        p={"24px 0 24px 0"}>
        <Text>There are no applicable permissions for this user</Text>
      </Flex>

      <Flex
        paddingTop={"0px"}
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
    </Box>
  );
}

export default PermissionsTab;
