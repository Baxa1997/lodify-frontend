import {Badge, Box} from "@chakra-ui/react";
import {
  InfoAccordionButton,
  InfoAccordionItem,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {DataTable} from "@components/DataTable";
import SimplePagination from "@components/SimplePagination";
import {useViolationProps} from "./useViolationProps";

export const Violation = () => {
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
  } = useViolationProps();

  return (
    <InfoAccordionItem>
      <InfoAccordionButton onClick={getViolationData}>
        <Box display="flex" alignItems="center" gap="8px">
          <InfoAccordionTitle>Violation</InfoAccordionTitle>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            fontSize="12px"
            fontWeight="500"
            bgColor="orange.50"
            color="orange.400">
            Unsafe Driving: {count}
          </Badge>
        </Box>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Box
          border="1px solid"
          borderColor="gray.border-main"
          borderRadius="12px"
          overflow="hidden"
          display="flex"
          flexDirection="column">
          <Box
            bg="white"
            border="1px solid #E5E7EB"
            borderRadius="12px"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            maxH="500px">
            <Box overflowX="auto" overflowY="auto" flex="1" minH="0">
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
              />
            </Box>
          </Box>
          {count > 0 && (
            <Box
              borderTop="1px solid"
              borderColor="gray.border-main"
              bg="white"
              p="12px 24px">
              <SimplePagination
                limit={limit}
                setLimit={setLimit}
                page={page}
                setPage={setPage}
                pageCount={Math.ceil(count / limit)}
              />
            </Box>
          )}
        </Box>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
};
