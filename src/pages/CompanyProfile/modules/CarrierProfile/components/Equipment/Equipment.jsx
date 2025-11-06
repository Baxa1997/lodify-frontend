import { Box } from "@chakra-ui/react";
import { useEquipmentProps } from "./useEquipmentProps";
import { DataTable } from "@components/DataTable";
import { InfoAccordionItem, InfoAccordionButton, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { InfoCard } from "../InfoCard";

export const Equipment = () => {

  const {
    headData,
    bodyData,
    page, 
    setPage,
    limit,
    setLimit,
    count,
  } = useEquipmentProps();

  return <Box>
    <InfoAccordionItem>
      <InfoAccordionButton>
        <Box
          display="flex"
          alignItems="center"
          jusBoxtifyContent="space-between"
        >
          <InfoAccordionTitle>
            Equipment
          </InfoAccordionTitle>
        </Box>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        {/* <Box
          display="flex"
          gap="20px"
          mb="20px"
        >
          <InfoCard
            title="Preferred Areas"
            badgeText="27 States"
          />
          <InfoCard
            title="Cross Border"
            badgeText="No Preferrred Lanes"
            isEmpty
          />
        </Box> */}
        <DataTable
          headData={headData}
          data={bodyData}
          pagination
          border="1px solid"
          borderColor="gray.border-main"
          borderRadius="12px"
          count={count}
          page={page}
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
          tableProps={{
            layout: "fixed",
          }}
        />
      </InfoAccordionPanel>
    </InfoAccordionItem>
  </Box>;
};
