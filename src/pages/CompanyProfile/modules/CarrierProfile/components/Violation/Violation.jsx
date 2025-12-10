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
            overflowX="auto"
            overflowY="auto"
            maxH="600px"
            position="relative"
            flex="1">
            <Box minW="max-content">
              <DataTable
                headData={headData}
                data={bodyData}
                border="none"
                borderRadius="0"
                tableProps={{
                  layout: "fixed",
                  minW: "max-content",
                }}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                count={count}
                pagination={false}
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
