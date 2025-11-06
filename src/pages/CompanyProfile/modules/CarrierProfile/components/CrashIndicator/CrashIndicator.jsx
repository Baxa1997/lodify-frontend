import { Box, Text } from "@chakra-ui/react";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";
import { DataTable } from "@components/DataTable";
import { useCrashIndicatorProps } from "./useCrashIndicatorProps";

export const CrashIndicator = () => {

  const { headData, bodyData, onAccordionChange } = useCrashIndicatorProps();

  return <Box>
    <SectionCard
      isAccordion
      padding="0 !important"
      variant="card"
      overflow="hidden"
      onChange={onAccordionChange}
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
            Crash Indicator
          </Text>
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
