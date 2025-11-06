import { Badge, Box } from "@chakra-ui/react";
import { InfoAccordionButton, InfoAccordionItem, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { DataTable } from "@components/DataTable";
import { useViolationProps } from "./useViolationProps";

export const Violation = () => {

  const { 
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count,
  } = useViolationProps();

  return <InfoAccordionItem>
    <InfoAccordionButton>
      <Box
        display="flex"
        alignItems="center"
        gap="8px"
      >
        <InfoAccordionTitle>Violation</InfoAccordionTitle>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          fontSize="12px"
          fontWeight="500"
          bgColor="orange.50"
          color="orange.400"
        >Unsafe Driving: {count}</Badge>
      </Box>
    </InfoAccordionButton>
    <InfoAccordionPanel>
      <DataTable
        headData={headData}
        data={bodyData}
        border="1px solid"
        borderColor="gray.border-main"
        borderRadius="12px"
        tableProps={{
          layout: "fixed",
        }}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        count={count}
        pagination
      />
    </InfoAccordionPanel>
  </InfoAccordionItem>;
};
