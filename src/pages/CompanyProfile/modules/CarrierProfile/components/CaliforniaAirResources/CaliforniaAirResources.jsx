import { Box, Text } from "@chakra-ui/react";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";

export const CaliforniaAirResources = () => {

  return <Box>
    <SectionCard
      isAccordion
      padding="0 !important"
      variant="card"
      overflow="hidden"
    >
      <SectionCardHeader
        bgColor="gray.200"
        borderBottom="1px solid"
        borderColor="gray.border-main"
        padding="20px 24px"
        borderTopLeftRadius="12px"
        borderTopRightRadius="12px">
        <Text
          fontSize="18px"
          fontWeight="600"
          color="primary.500"
        >
          California Air Resources Board (CARB) Compliance
        </Text>
      </SectionCardHeader>
      <SectionCardBody padding="20px">
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr"
          gap="20px"
        >
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            Truck and Bus Check All vehicles comply for carrier
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            CARB TRU Vehicles All vehicles for carrier are CARB TRU YES
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            MCP CARB Addendum Template Copy & Paste to your eAgreement
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            Truck and Bus Check Single vehicles compliant (No Resource available by CARB)
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            Transport Refrigeration Unit (TRU or Reefer) Single complian vehicle
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="primary.500"
          >
            Helpful CARB Tips
          </Text>
        </Box>
      </SectionCardBody>
    </SectionCard>
  </Box>;
};
