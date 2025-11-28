import React from "react";
import {Flex} from "@chakra-ui/react";
import {Box} from "@chakra-ui/react";
import {Text} from "@chakra-ui/react";
import HFSelect from "../../../../components/HFSelect";
import HFTextField from "../../../../components/HFTextField";
import AssignTripCarrier from "./AssignTripCarrier";
import {useSelector} from "react-redux";

function FirstSection({control}) {
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  return (
    <Flex
      border="1px solid #E9EAEB"
      borderRadius="12px"
      p="24px"
      alignItems="center"
      gap="24px"
      justifyContent="space-between">
      <Box w={"100%"}>
        <Text mb={"6px"} fontSize={"14px"} fontWeight={"500"} color={"#414651"}>
          Customer <span>*</span>
        </Text>
        <HFSelect
          view_fields={["name"]}
          value="guid"
          table_slug="shippers"
          size="md"
          control={control}
          name="shippers_id"
          options={[]}
        />
      </Box>
      <Box w={"100%"}>
        <Text mb={"6px"} fontSize={"14px"} fontWeight={"500"} color={"#414651"}>
          Load ID <span>*</span>
        </Text>
        <HFTextField
          disabled={true}
          placeholder="Load ID"
          border="1px solid #D5D7DA"
          size="md"
          width={"100%"}
          control={control}
          name="generated_id"
        />
      </Box>
      <Box w={"100%"}>
        <Text mb={"6px"} fontSize={"14px"} fontWeight={"500"} color={"#414651"}>
          Created By <span>*</span>
        </Text>
        <HFTextField
          disabled={true}
          border="1px solid #D5D7DA"
          size="md"
          width={"100%"}
          control={control}
          name="created_by"
        />
      </Box>
      {Boolean(isBroker) && (
        <AssignTripCarrier control={control} name="companies_id_2" />
      )}
    </Flex>
  );
}

export default FirstSection;
