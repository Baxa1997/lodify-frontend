import { Box, Text } from "@chakra-ui/react";
import { useCompanyInformationProps } from "./useCompanyInformationProps";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";

const DataList = ({ list = [] }) => {

  return <Box
    as="dl"
    width="100%"
  >
    {
      list?.map((item, index) => (
        <Box
          display="flex"
          justifyContent="space-between"
          fontWeight={600}
          fontSize="14px"
          mb="8px"
          key={index}
        >
          <Box
            as="dt"
            color="#414651"
          >
            {item?.title}
          </Box>
          <Box
            as="dd"
            width="245px"
            textAlign="left"
          >
            <Box
              color={item.color || "secondary.700"}
              fontSize="14px"
              fontWeight="400"
            >
              {item?.description}
            </Box>
          </Box>
        </Box>
      ))
    }
  </Box>;
};

export const CompanyInformation = ({ data }) => {
  const { firstDataList, secondDataList } = useCompanyInformationProps({ data });

  return <Box flexGrow={1}>
    <SectionCard
      // isAccordion
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
        <Box>
          <Text
            fontSize="18px"
            fontWeight="600"
            color="primary.500"
          >
          Company information
          </Text>
        </Box>
      </SectionCardHeader>
      <SectionCardBody padding="20px 24px">
        <Box>
          <Box
            display="flex"
            gap="32px"
            mt="32px"
          >
            <DataList
              list={firstDataList}
            />
            <DataList
              list={secondDataList}
            />
          </Box>
        </Box>
      </SectionCardBody>
    
    </SectionCard>
  </Box>;
};
