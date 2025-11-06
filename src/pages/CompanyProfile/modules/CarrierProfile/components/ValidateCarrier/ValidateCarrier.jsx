import { Box, Button, Text } from "@chakra-ui/react";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";
import { DataTable } from "@components/DataTable";
import { useValidateCarrierProps } from "./useValidateCarrierProps";

export const ValidateCarrier = () => {

  const { headData, bodyData } = useValidateCarrierProps();

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
        borderTopRightRadius="12px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize="18px"
            fontWeight="600"
            color="primary.500"
          >
            Validate Carrier
          </Text>
          <Button
            variant="solid"
            colorScheme="blue"
            fontSize="14px"
            mr="16px"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            User Verification
          </Button>
        </Box>
      </SectionCardHeader>
      <SectionCardBody padding="0">
        <DataTable
          headData={headData}
          data={bodyData}
          borderRadius="0"
          pagination
        />
      </SectionCardBody>
    </SectionCard>
  </Box>;
};
