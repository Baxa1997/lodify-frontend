import { Box, Text } from "@chakra-ui/react";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";
import { useLaneInsightsProps } from "./useLaneInsightsProps";

const InfoItem = ({ title, data }) => {
  return <Box
    display="flex"
    justifyContent="space-between"
  >
    <Text color="tertiary.600">{title}</Text>
    <Text color="tertiary.600">{data}</Text>
  </Box>;
};

export const LaneInsights = ({ data }) => {

  const {
    usInspectionResult,
    canadaInspectionResult,
  } = useLaneInsightsProps({ data });

  return <Box>
    <SectionCard
      isAccordion
      padding="0 !important"
      variant="card"
      overflow="hidden"
      defaultIndex={[0]}
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
          Lane insights
        </Text>
      </SectionCardHeader>
      <SectionCardBody>
        <Box
          display="flex"
          flexDirection="column"
          gap="24px"
        >
          <SectionCard
            padding="0 !important"
            variant="card"
          >
            <SectionCardHeader
              borderBottom="1px solid"
              borderColor="gray.border-main"
              padding="20px 24px"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
              >
                <img
                  src="/img/us.svg"
                  alt="USA"
                  width={56}
                  height={56}
                />
                <Box>
                  <Text
                    color="primary.500"
                    fontWeight="600"
                    fontSize="18px"
                  >
                  U.S. Inspection Results
                  </Text>
                  {/* <Text color="tertiary.600">Total Inspections: 914</Text>
                  <Text color="tertiary.600">Total IEP Inspections: 914</Text> */}
                </Box>
              </Box>
            </SectionCardHeader>
            <SectionCardBody padding="24px">
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                gap="32px"
              >
                {
                  usInspectionResult?.map((item, index) => (
                    <Box key={index}>
                      <Text 
                        color="primary.500"
                        fontWeight="600"
                        mb="4px"
                      >
                        {item.title}
                      </Text>
                      {
                        item.list.map(item => (
                          <InfoItem
                            key={item.title}
                            title={item.title}
                            data={item.data}
                          />
                        ))
                      }
                    </Box>
                  ))
                }
              </Box>
            </SectionCardBody>
          </SectionCard>
          <SectionCard
            padding="0 !important"
            variant="card"
          >
            <SectionCardHeader
              borderBottom="1px solid"
              borderColor="gray.border-main"
              padding="20px 24px"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
              >
                <img
                  src="/img/canada.svg"
                  alt="CANADA"
                  width={56}
                  height={56}
                />
                <Box>
                  <Text
                    color="primary.500"
                    fontWeight="600"
                    fontSize="18px"
                  >
                    Canadian Inspection Results
                  </Text>
                  {/* <Text color="tertiary.600">Total Inspections: 914</Text> */}
                </Box>
              </Box>
            </SectionCardHeader>
            <SectionCardBody padding="24px">
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                gap="32px"
              >
                {
                  canadaInspectionResult?.map((item, index) => (
                    <Box key={index}>
                      <Text 
                        color="primary.500"
                        fontWeight="600"
                        mb="4px"
                      >
                        {item.title}
                      </Text>
                      {
                        item.list.map(item => (
                          <InfoItem
                            key={item.title}
                            title={item.title}
                            data={item.data}
                          />
                        ))
                      }
                    </Box>
                  ))
                }
              </Box>
            </SectionCardBody>
          </SectionCard>
        </Box>
      </SectionCardBody>
    </SectionCard>
  </Box>;
};
