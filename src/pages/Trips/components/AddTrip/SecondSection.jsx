import React from "react";
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import HFSelect from "../../../../components/HFSelect";
import HFMultiSelect from "../../../../components/HFMultiSelect";

function SecondSection({ control }) {
  return (
    <Flex
      mt={"20px"}
      border="1px solid #E9EAEB"
      borderRadius="12px"
      p="24px"
      gap="24px"
      flexDirection="column">
      <Flex
        alignItems="center"
        gap="24px">
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Bill To (Booked From) <span>*</span>
          </Text>
          <HFSelect
            view_field="legal_name"
            value="guid"
            table_slug="companies"
            size="md"
            control={control}
            name="companies_id_2"
            options={[]}
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Remit Payment To <span>*</span>
          </Text>
          <HFMultiSelect
            size="md"
            width={"100%"}
            control={control}
            name="remit_payment_to"
            options={[
              { label: "Company", value: "company" },
              { label: "Driver", value: "driver" },
              { label: "Customer", value: "customer" },
            ]}
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Shipment Type <span>*</span>
          </Text>
          <HFMultiSelect
            size="md"
            width={"100%"}
            control={control}
            name="shipment_type"
            options={[
              { label: "Company", value: "company" },
              { label: "Driver", value: "driver" },
              { label: "Customer", value: "customer" },
            ]}
          />
        </Box>
      </Flex>
      <Flex
        alignItems="center"
        gap="24px">
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Representative <span>*</span>
          </Text>
          <HFSelect
            size="md"
            width={"100%"}
            control={control}
            view_field="full_name"
            name="representative"
            table_slug="representative"
            options={[]}
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Payable Method <span>*</span>
          </Text>
          <HFMultiSelect
            size="md"
            width={"100%"}
            control={control}
            name="payable_method"
            options={[{ label: "Card", value: "Card" }]}
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Booked By <span>*</span>
          </Text>
          <HFSelect
            view_field="full_name"
            table_slug="users"
            size="md"
            width={"100%"}
            control={control}
            name="users"
            options={[]}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default SecondSection;
