import {Badge, Box} from "@chakra-ui/react";
import {
  InfoAccordionButton,
  InfoAccordionItem,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {DataTable} from "@components/DataTable";
import {useViolationProps} from "./useViolationProps";

export const Violation = ({new_info}) => {
  const {
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count,
    getViolationData,
    isLoading,
  } = useViolationProps(new_info);

  return (
    <InfoAccordionItem>
      <InfoAccordionButton onClick={getViolationData}>
        <Box display="flex" alignItems="center" gap="8px">
          <InfoAccordionTitle>Violation</InfoAccordionTitle>
          {/* <Badge
            px={3}
            py={1}
            borderRadius="full"
            fontSize="12px"
            fontWeight="500"
            bgColor="orange.50"
            color="orange.400">
            Unsafe Driving: {count}
          </Badge> */}
        </Box>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Box
          border="1px solid"
          borderColor="gray.border-main"
          borderRadius="12px"
          overflow="hidden">
          <DataTable
            headData={headData}
            data={bodyData}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            count={count}
            pagination
            isLoading={isLoading}
            maxH="500px"
          />
        </Box>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
};
