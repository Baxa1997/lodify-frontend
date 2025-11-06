import { Box, Flex, Text, Button, Radio, Input } from "@chakra-ui/react";
import React from "react";
import Select from "../../../components/Select";
import SaveSection from "./SaveSection";
import DeleteUserButton from "./DeleteUserButton";
import { Controller } from "react-hook-form";

const AccountTab = ({
  userId,
  deleteUser = () => {},
  deleteLoading = false,
  saveLoading = false,
  control,
  watch,
  setValue,
  onSave = () => {},
  onCancel = () => {},
}) => {
  return (
    <Box mt={"24px"}>
      <Box
        pb={"20px"}
        borderBottom={"1px solid #E9EAEB"}>
        <Text
          fontSize={"18px"}
          fontWeight={"600"}
          color={"#181D27"}>
          Account Login
        </Text>
        <Text
          fontSize={"14px"}
          color={"#535862"}>
          {` To change your Lodify account details, go to Lodify.com > Your Account
          > Login & Security`}
        </Text>
      </Box>

      <SaveSection
        py="24px"
        title="Lodify Team"
        description="lodify@eagleyetruckingllc.com"
        onCancel={onCancel}
        onSave={onSave}
        saveLoading={saveLoading}
        p={"24px 0"}
      />

      <Box
        pb="18px"
        borderBottom={"1px solid #E9EAEB"}>
        <Flex gap="64px">
          <Text
            w={"26%"}
            fontSize="14px"
            fontWeight="600"
            color="#181D27">
            Status
          </Text>

          <Flex
            w={"48%"}
            flexDir="column"
            gap="8px">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Radio
                  value="Active"
                  isChecked={field.value?.includes("Active")}
                  onChange={() => field.onChange(["Active"])}>
                  Active
                </Radio>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Radio
                  value="Inactive"
                  isChecked={field.value?.includes("Inactive")}
                  onChange={() => field.onChange(["Inactive"])}>
                  Inactive
                </Radio>
              )}
            />
          </Flex>
        </Flex>
      </Box>

      <Box pt="18px">
        <Flex gap="64px">
          <Text
            w={"26%"}
            fontSize="14px"
            fontWeight="600"
            color="#181D27">
            Assigned Location
          </Text>

          <Flex
            w={"48%"}
            flexDir="column"
            gap="16px">
            <Box>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="#181D27"
                mb="8px">
                Domicile(s) <span style={{ color: "#1570EF" }}>*</span>
              </Text>
              <Controller
                name="domicile"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select domicile"
                    value={field.value || ""}
                    options={[
                      { value: "US", label: "United States" },
                      { value: "CA", label: "Canada" },
                      { value: "MX", label: "Mexico" },
                    ]}
                    onChange={field.onChange}
                    borderColor="#E2E8F0"
                    focusBorderColor="#3182CE"
                  />
                )}
              />
            </Box>

            <Box>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="#181D27"
                mb="8px">
                Language Preference <span style={{ color: "#1570EF" }}>*</span>
              </Text>
              <Controller
                name="language_preference"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select language"
                    value={field.value || ""}
                    options={[
                      { value: "en-US", label: "English (US)" },
                      { value: "en-CA", label: "English (CA)" },
                      { value: "es-MX", label: "Spanish (MX)" },
                      { value: "fr-CA", label: "French (CA)" },
                    ]}
                    onChange={field.onChange}
                    borderColor="#E2E8F0"
                    focusBorderColor="#3182CE"
                  />
                )}
              />
            </Box>

            <Box>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="#181D27"
                mb="8px">
                Timezone Location <span style={{ color: "#1570EF" }}>*</span>
              </Text>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select timezone"
                    value={field.value || ""}
                    options={[
                      { value: "America/New_York", label: "Eastern Time (ET)" },
                      { value: "America/Chicago", label: "Central Time (CT)" },
                      { value: "America/Denver", label: "Mountain Time (MT)" },
                      {
                        value: "America/Los_Angeles",
                        label: "Pacific Time (PT)",
                      },
                      { value: "America/Anchorage", label: "Alaska Time (AKT)" },
                      { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
                    ]}
                    onChange={field.onChange}
                    borderColor="#E2E8F0"
                    focusBorderColor="#3182CE"
                  />
                )}
              />
            </Box>
          </Flex>
        </Flex>
      </Box>

      <DeleteUserButton
        deleteLoading={deleteLoading}
        userId={userId}
        deleteUser={deleteUser}
      />
    </Box>
  );
};

export default AccountTab;
