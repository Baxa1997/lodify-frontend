import {
  Box,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import SaveSection from "./SaveSection";
import { Controller } from "react-hook-form";

const UserRoleTab = ({
  userId,
  watch,
  setValue,
  control,
  saveLoading = false,
  onSave = () => {},
  onCancel = () => {},
}) => {
  return (
    <Box mt={"24px"}>
      <SaveSection
        title="User Role"
        description=""
        onCancel={onCancel}
        onSave={onSave}
        saveLoading={saveLoading}
        borderBottom="1px solid #E9EAEB"
        p={"0 0 20px 0"}
      />

      <Flex
        gap="64px"
        p={"20px 0 24px 0"}
        borderBottom="1px solid #E9EAEB">
        <Text
          w={"26%"}
          fontSize="14px"
          fontWeight="600"
          color="#181D27">
          Roles
        </Text>

        <Flex
          flexDir="column"
          gap="12px"
          w={"48%"}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onChange={field.onChange}>
                <Flex
                  flexDir="column"
                  gap="16px">
                  <Flex
                    gap="12px"
                    alignItems="flex-start">
                    <Radio value="Dispatcher" />
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="#181D27"
                        mb="4px">
                        Dispatcher
                      </Text>
                      <Text
                        fontSize="12px"
                        color="#64748b">
                        Accept and rejects trips, assigns drivers to loads, and
                        updates trip status and timestamps. Can view and edit
                        capacity. Cant view company account or financial
                        details, inlcuding payouts.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    gap="12px"
                    alignItems="flex-start">
                    <Radio value="Administrator" />
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="#181D27"
                        mb="4px">
                        Administrator
                      </Text>
                      <Text
                        fontSize="12px"
                        color="#64748b">
                        Updates all data in Lodify, and manages new and existing
                        users. Can't delete or deactivate Primary Administrator
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    gap="12px"
                    alignItems="flex-start">
                    <Radio value="Primary Administrator" />
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="#181D27"
                        mb="4px">
                        Primary Administrator
                      </Text>
                      <Text
                        fontSize="12px"
                        color="#64748b">
                        Performs all tasks of a dispatcher and administrator; in
                        addition, sets uo company profile and activates or
                        inactivates users.
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </RadioGroup>
            )}
          />
        </Flex>
      </Flex>
      <Flex
        gap="64px"
        p={"20px 0 24px 0"}
        borderBottom="1px solid #E9EAEB">
        <Text
          w={"26%"}
          fontSize="14px"
          fontWeight="600"
          color="#181D27">
          Notes
        </Text>

        <Flex
          flexDir="column"
          gap="12px"
          w={"48%"}>
          <Flex
            gap="16px"
            flexWrap="wrap">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  resize="none"
                  h="120px"
                  placeholder="Enter notes"
                />
              )}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex
        paddingTop={"20px"}
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
};

const CheckBoxItem = ({
  title,
  description,
  checked = false,
  onCheckboxChange = () => {},
  name,
}) => {
  return (
    <Flex
      w={"100%"}
      gap="8px"
      alignItems="flex-start">
      <Radio
        mt="4px"
        isChecked={checked}
        onChange={onCheckboxChange}
        name={name}
      />

      <Flex
        flexDir="column"
        gap="2px">
        <Text
          fontSize={"14px"}
          fontWeight="600"
          color="#181D27">
          {title}
        </Text>
        {description && (
          <Text
            fontSize={"14px"}
            color="#535862"
            fontWeight="400">
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default UserRoleTab;
