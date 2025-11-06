import {
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "../../../components/Select";
import SaveSection from "./SaveSection";
import { Controller } from "react-hook-form";

const CommunicationTab = ({
  userId,
  control,
  watch,
  setValue,
  saveLoading = false,
  onSave = () => {},
  onCancel = () => {},
}) => {
  return (
    <Box mt={"24px"}>
      <SaveSection
        title="Communication"
        description=""
        onCancel={onCancel}
        onSave={onSave}
        saveLoading={saveLoading}
        borderBottom="1px solid #E9EAEB"
        p={"0 0 20px 0"}
      />

      <Box>
        <Flex
          gap="64px"
          p={"20px 0 24px 0"}
          borderBottom="1px solid #E9EAEB">
          <Text
            w={"26%"}
            fontSize="14px"
            fontWeight="600"
            color="#181D27">
            Email Preferences
          </Text>

          <Flex
            flexDir="column"
            gap="16px">
            <Controller
              name="email_preferences"
              control={control}
              render={({ field }) => (
                <CheckBoxItem
                  title="Account Management"
                  description="Receive emails about trip offers, assignments, updates, or cancellations."
                  checked={field.value?.includes("Account Management") || false}
                  onCheckboxChange={(e) => {
                    const currentValue = field.value || [];
                    const newValue = e.target.checked
                      ? [...currentValue, "Account Management"]
                      : currentValue.filter(
                        (item) => item !== "Account Management",
                      );
                    field.onChange(newValue);
                  }}
                />
              )}
            />
            <Controller
              name="email_preferences"
              control={control}
              render={({ field }) => (
                <CheckBoxItem
                  title="Tendered Trips"
                  description="Receive emails about trip offers, assignments, updates, or cancellations."
                  checked={field.value?.includes("Tendered Trips") || false}
                  onCheckboxChange={(e) => {
                    const currentValue = field.value || [];
                    const newValue = e.target.checked
                      ? [...currentValue, "Tendered Trips"]
                      : currentValue.filter(
                        (item) => item !== "Tendered Trips",
                      );
                    field.onChange(newValue);
                  }}
                />
              )}
            />
            <Controller
              name="email_preferences"
              control={control}
              render={({ field }) => (
                <CheckBoxItem
                  title="In-progress trips and disruptions"
                  description="Receive notifications about in-transit issues."
                  checked={
                    field.value?.includes(
                      "In-progress trips and disruptions",
                    ) || false
                  }
                  onCheckboxChange={(e) => {
                    const currentValue = field.value || [];
                    const newValue = e.target.checked
                      ? [...currentValue, "In-progress trips and disruptions"]
                      : currentValue.filter(
                        (item) => item !== "In-progress trips and disruptions",
                      );
                    field.onChange(newValue);
                  }}
                />
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
            Phone Preferences
          </Text>

          <Flex
            flexDir="column"
            gap="16px"
            w={"48%"}>
            <Box>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="#181D27"
                mb="8px">
                Phone number <span style={{ color: "#1570EF" }}>*</span>
              </Text>
              <Box
                display="flex"
                border="1px solid #E2E8F0"
                borderRadius="6px"
                height="40px"
                _focusWithin={{
                  borderColor: "#E2E8F0",
                  boxShadow: "none",
                }}>
                <PhoneInput
                  defaultCountry="us"
                  value={watch("phone") || "+1 (937) 301-3613"}
                  onChange={(phone) => {
                    setValue?.("phone", phone);
                  }}
                  style={{
                    "--rip-border-radius": "0",
                    "--rip-border-color": "transparent",
                    "--rip-border-color-focus": "transparent",
                    "--rip-font-size": "14px",
                    "--rip-height": "40px",
                    "--rip-gap": "0px",
                    "--rip-outline": "none",
                    "--rip-box-shadow": "none",
                    width: "100%",
                  }}
                  inputStyle={{
                    fontSize: "14px",
                    height: "38px",
                    border: "none",
                    borderRadius: "0",
                    padding: "8px 12px",
                    outline: "none",
                    boxShadow: "none",
                    _focus: {
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    },
                  }}
                  countrySelectorStyleProps={{
                    style: {
                      background: "#fff",
                      outline: "none",
                      focus: "none",
                    },
                  }}
                  hideDropdown={false}
                  showDropdownSearch={true}
                  disableFormatting={false}
                  placeholder="(937) 301-3613"
                />
              </Box>
            </Box>

            <Box>
              <Text
                fontSize="14px"
                fontWeight="500"
                color="#181D27"
                mb="8px">
                Phone type <span style={{ color: "#1570EF" }}>*</span>
              </Text>
              <Controller
                name="phone_type"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select phone type"
                    value={field.value?.[0] || ""}
                    options={[
                      { value: "Mobile", label: "Mobile" },
                      { value: "Home", label: "Home" },
                      { value: "Work", label: "Work" },
                      { value: "Other", label: "Other" },
                    ]}
                    onChange={(value) => field.onChange([value])}
                    borderColor="#E2E8F0"
                    focusBorderColor="#3182CE"
                  />
                )}
              />
            </Box>

            <Controller
              name="primary_contact_number"
              control={control}
              render={({ field }) => (
                <Flex
                  w="100%"
                  gap="8px"
                  alignItems="flex-start">
                  <Checkbox
                    mt="4px"
                    isChecked={field.value || false}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                  />
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27">
                    Primary contact number
                  </Text>
                </Flex>
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
            Available hours
          </Text>

          <Flex
            flexDir="column"
            gap="12px"
            w={"48%"}>
            <Flex
              gap="16px"
              flexWrap="wrap">
              <Controller
                name="available_hours"
                control={control}
                render={({ field }) => (
                  <CheckBoxItem
                    title="Morning"
                    description=""
                    checked={field.value?.includes("Morning") || false}
                    onCheckboxChange={(e) => {
                      const currentValue = field.value || [];
                      const newValue = e.target.checked
                        ? [...currentValue, "Morning"]
                        : currentValue.filter((item) => item !== "Morning");
                      field.onChange(newValue);
                    }}
                    name="available_hours"
                  />
                )}
              />
              <Controller
                name="available_hours"
                control={control}
                render={({ field }) => (
                  <CheckBoxItem
                    title="Afternoon"
                    description=""
                    checked={field.value?.includes("Afternoon") || false}
                    onCheckboxChange={(e) => {
                      const currentValue = field.value || [];
                      const newValue = e.target.checked
                        ? [...currentValue, "Afternoon"]
                        : currentValue.filter((item) => item !== "Afternoon");
                      field.onChange(newValue);
                    }}
                    name="available_hours"
                  />
                )}
              />
              <Controller
                name="available_hours"
                control={control}
                render={({ field }) => (
                  <CheckBoxItem
                    title="Evening"
                    description=""
                    checked={field.value?.includes("Evening") || false}
                    onCheckboxChange={(e) => {
                      const currentValue = field.value || [];
                      const newValue = e.target.checked
                        ? [...currentValue, "Evening"]
                        : currentValue.filter((item) => item !== "Evening");
                      field.onChange(newValue);
                    }}
                    name="available_hours"
                  />
                )}
              />
              <Controller
                name="available_hours"
                control={control}
                render={({ field }) => (
                  <CheckBoxItem
                    title="Night"
                    description=""
                    checked={field.value?.includes("Night") || false}
                    onCheckboxChange={(e) => {
                      const currentValue = field.value || [];
                      const newValue = e.target.checked
                        ? [...currentValue, "Night"]
                        : currentValue.filter((item) => item !== "Night");
                      field.onChange(newValue);
                    }}
                    name="available_hours"
                  />
                )}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
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
      <Checkbox
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

export default CommunicationTab;
