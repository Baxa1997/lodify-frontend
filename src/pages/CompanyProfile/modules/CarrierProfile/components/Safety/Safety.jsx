import { Box, Text } from "@chakra-ui/react";
import { StatusText } from "../../../../components/StatusText";
import { CardData } from "../../../../components/CardData";
import { format, isValid } from "date-fns";
import { InfoAccordionItem, InfoAccordionButton, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { DataTable } from "@components/DataTable";
import { useSafetyProps } from "./useSafetyProps";
import MainHeading from "@components/MainHeading";

export const Safety = ({ data = {} }) => {

  // const {
  //   safety_rating_date,
  //   safety_rating,
  //   safety_review_date,
  //   safety_type,
  //   mcs_150_form_date,
  //   mcs_150_year,
  //   mcs_150_mileage,
  // } = data;

  const {
    enabled,
    headData,
    bodyData,
    count,
    page,
    setPage,
    limit,
    setLimit,
    onAccordionChange,
    filterOptions,
    handleFilter,
    filter,
  } = useSafetyProps();

  return <Box>
    <InfoAccordionItem >
      <InfoAccordionButton>
        <InfoAccordionTitle>
          Safety
        </InfoAccordionTitle>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        {/* <Box
          display="flex"
          alignItems="flex-start"
          gap="20px"
        >
          <CardData
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap="8px"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              color="secondary.700"
            >
              Safety
            </Text>
            <StatusText
              title="Safety Rating:"
              data={safety_rating}
            />
            <StatusText
              title="Rating Date:"
              data={isValid(new Date(safety_rating_date)) ? format(new Date(safety_rating_date), "dd/MM/yyyy") : ""}
            />
          </CardData>
          <CardData
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap="8px"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              color="secondary.700"
            >
              MCS-150 Most Recent
            </Text>
            <StatusText
              title="Date:"
              data={mcs_150_form_date}
            />
            <StatusText
              title="MCS-150 Year:"
              data={mcs_150_year}
            />
            <StatusText
              title="MCS-150 Miles:"
              data={mcs_150_mileage}
            />
          </CardData>
          <CardData
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap="8px"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              color="secondary.700"
            >
              Latest Review
            </Text>
            <StatusText
              title="Review Type:"
              data={safety_type}
            />
            <StatusText
              title="Review Date:"
              data={safety_review_date}
            />
            <StatusText
              title="Document:"
              data="None"
            />
            <StatusText
              title="Reported Miles:"
              data="None"
            />
          </CardData>
        </Box> */}

        <Box
          display="grid"
          gridTemplateColumns="repeat(5, 1fr)"
          gap="10px"
          mb="20px"
        >
          {
            filterOptions?.map(item => <FilterBox
              key={item}
              title={item}
              isSelected={filter === item}
              onChange={handleFilter}
            />)
          }
        </Box>

        <Box>
          <DataTable
            headData={headData}
            data={bodyData}
            border="1px solid"
            borderColor="gray.border-main"
            borderRadius="12px"
            count={count}
            page={page}
            limit={limit}
            setLimit={setLimit}
            setPage={setPage}
            pagination
            tableProps={{
              layout: "fixed",
            }}
          />
        </Box>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  </Box>;
};

const FilterBox = ({ title, isSelected, onChange }) => {
  return <Box
    onClick={() => onChange(title)}
    border="1px solid"
    borderColor={isSelected ? "orange.500" : "gray.border-main"}
    borderRadius="12px"
    py="20px"
    px="16px"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    cursor="pointer"
    fontWeight="600"
    fontSize="12px"
  >
    {title}
  </Box>;
};
