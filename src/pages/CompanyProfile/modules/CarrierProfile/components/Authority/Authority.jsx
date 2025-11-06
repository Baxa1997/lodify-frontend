import { Badge, Box, Text } from "@chakra-ui/react";
import { InfoAccordionItem, InfoAccordionButton, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { DataTable } from "@components/DataTable";
import { useAuthorityProps } from "./useAuthorityProps";
import { StatusBadge } from "@components/StatusBadge";

export const Authority = ({ carrierDetails = {}, companySnapshot = {} }) => {

  const {
    common_stat,
    contract_stat,
    broker_stat,
    property_chk,
  } = carrierDetails;

  const {
    headData,
    bodyData,
    companyHeadData,
    companyBodyData,
  } = useAuthorityProps({ companySnapshot });

  return <Box>
    <InfoAccordionItem>
      <InfoAccordionButton>
        <InfoAccordionTitle>
          Authority
        </InfoAccordionTitle>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Box
          display="flex"
          gap="20px"
          mb="20px"
        >
          <Box
            display="flex"
            gap="20px"
            padding="20px"
            border="1px solid"
            borderColor="gray.border-main"
            borderRadius="12px"

          >
            <Box display="flex">
              <Box
                px="12px"
                borderRight="1px solid"
                borderColor="gray.border-main"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="12px"
              >
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color="primary.500"
                >
                Common
                </Text>
                <StatusBadge status={common_stat === "A" ? "active" : "inactive"}>
                  {common_stat === "A" ? "Active" : "Inactive"}
                </StatusBadge>
              </Box>
              <Box
                px="12px"
                borderRight="1px solid"
                borderColor="gray.border-main"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="12px"
              >
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color="primary.500"
                >
                Contract
                </Text>
                <StatusBadge status={contract_stat === "A" ? "active" : "inactive"}>
                  {contract_stat === "A" ? "Active" : "Inactive"}
                </StatusBadge>
              </Box>
              <Box
                px="12px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="12px"
              >
                <Text
                  fontWeight="600"
                  fontSize="16px"
                  color="primary.500"
                >
                Broker
                </Text>
                <StatusBadge status={broker_stat === "A" ? "active" : "inactive"}>
                  {broker_stat === "A" ? "Active" : "Inactive"}
                </StatusBadge>
              </Box>
            </Box>

          </Box>
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            gap="20px"
            padding="20px"
            border="1px solid"
            borderColor="gray.border-main"
            borderRadius="12px"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="12px"
            >
              <Text
                fontWeight="600"
                fontSize="16px"
                color="primary.500"
              >
              Licensed Capabilities
              </Text>
              <StatusBadge status={property_chk === "Y" ? "property" : "property"}>{"Property"}</StatusBadge>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          <DataTable
            headData={headData}
            data={bodyData}
            pagination
            border="1px solid"
            borderColor="gray.border-main"
            borderRadius="12px"
          />
          <DataTable
            headData={companyHeadData}
            data={companyBodyData}
            border="1px solid"
            borderColor="gray.border-main"
            borderRadius="12px"
          />
        </Box>

        {/* <Box
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          <CardData
            display="flex"
            gap="20px"
          >
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              gap="8px"
            >
              <StatusText
                title="Common Authority:"
                data={common_stat}
              />
              <StatusText
                title="Common Authority Application Pending:"
                data={common_app_pend}
              />
              <StatusText
                title="Common Authority Pending Recovation:"
                data={common_rev_pend}
              />
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              gap="8px"
            >
              <StatusText
                title="Contract Authority:"
                data={contract_stat}
              />
              <StatusText
                title="Contract Authority Application Pending:"
                data={contract_app_pend}
              />
              <StatusText
                title="Contract Authority Pending Revocation:"
                data={contract_rev_pend}
              />
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              gap="8px"
            >
              <StatusText
                title="Broker Authority:"
                data={broker_stat}
              />
              <StatusText
                title="Broker Authority Application Pending:"
                data={broker_app_pend}
              />
              <StatusText
                title="Broker Authority Pending Revocation:"
                data={broker_rev_pend}
              />
            </Box>
          </CardData>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr"
            alignItems="flex-start"
            gap="20px"
          >
            <CardData
              display="flex"
              flexDirection="column"
              gap="8px"
            >
              <Text
                fontSize="16px"
                fontWeight="600"
                color="secondary.700"
              >
                Cargo Authorization
              </Text>
              <StatusText
                title="Freight:"
                data={property_chk}
              />
              <StatusText
                title="Passenger:"
                data={passenger_chk}
              />
              <StatusText
                title="Household Goods:"
                data={hhg_chk}
              />
            </CardData>
            <CardData
              display="flex"
              flexDirection="column"
              gap="8px"
            >
              <StatusText
                title="Authority Granted On:"
                data="None"
              />
            </CardData>
          </Box>
        </Box> */}
      </InfoAccordionPanel>
    </InfoAccordionItem>
  </Box>;
};
