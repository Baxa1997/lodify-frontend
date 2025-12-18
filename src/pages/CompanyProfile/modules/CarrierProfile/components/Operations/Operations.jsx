import {Box, Text} from "@chakra-ui/react";
import {CardData} from "../../../../components/CardData";
import {StatusText} from "../../../../components/StatusText";
import {useOperationsProps} from "./useOperationsProps";
import {responseStatuses} from "@utils/getResponseStatuses";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";

export const Operations = ({new_info}) => {
  const {dot_number} = new_info;
  const {extraData, operationsData} = useOperationsProps({dot_number});

  const {operation = [], classification = []} = operationsData || {};

  const {
    entity_type,
    us_dot_status,
    add_date,
    created_at,
    operating_status,
    out_of_service_date,
  } = new_info;
  console.log("classification", classification);
  console.log("operation", operation);
  // const {
  //   add_date,
  //   carrier_operation,
  //   hm_flag,
  //   cargo_types_id_data: {
  //     crgo_beverages,
  //     crgo_drybulk,
  //     crgo_produce,
  //     crgo_household,
  //     crgo_logpole,
  //     crgo_mobilehome,
  //     crgo_passengers,
  //     crgo_waterwell,
  //     crgo_cargoothr_desc,
  //     crgo_chem,
  //     crgo_drivetow,
  //     crgo_genfreight,
  //     crgo_liqgas,
  //     crgo_meat,
  //     crgo_oilfield,
  //     crgo_cargoothr,
  //     crgo_usmail,
  //     crgo_coalcoke,
  //     crgo_farmsupp,
  //     crgo_grainfeed,
  //     crgo_livestock,
  //     crgo_metalsheet,
  //     crgo_paperprod,
  //     crgo_utility,
  //   } = {},
  //   equipment_id_data: {
  //     fleetsize,
  //     power_units,
  //     truck_units,
  //     owntract,
  //     owntruck,
  //     owntrail,
  //   } = {},
  //   operation_drivers_id_data: {
  //     total_drivers,
  //     total_cdl,
  //     avg_drivers_leased_per_month,
  //     driver_inter_total,
  //     interstate_within_100_miles,
  //     interstate_beyond_100_miles,
  //     total_intrastate_drivers,
  //     intrastate_within_100_miles,
  //     intrastate_beyond_100_miles,
  //   } = {},
  // } = operation;

  const carrierOperationMap = {
    A: "Interstate",
    B: "Intrastate Hazmat",
    C: "Intrastate Non-Hazmat",
  };

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Operations</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap="20px"
            alignItems="flex-start">
            <CardData
              display="flex"
              flexDirection="column"
              flexGrow={1}
              gap="8px">
              <StatusText title="Entity Type:" data={entity_type} />
              <StatusText title="DOT Status:" data={us_dot_status} />
              <StatusText
                title="DOT Date:"
                data={add_date || created_at || "N/A"}
              />
            </CardData>

            <CardData
              display="flex"
              flexDirection="column"
              flexGrow={1}
              gap="8px">
              <StatusText title="Operating Status:" data={operating_status} />
              <StatusText title="Out Of Service:" data={out_of_service_date} />
              <StatusText
                title="Out Of Service Date:"
                data={out_of_service_date}
              />
            </CardData>

            <CardData
              display="flex"
              flexDirection="column"
              flexGrow={1}
              gap="8px">
              <Text fontSize="16px" fontWeight="600" color="secondary.700">
                Operations
              </Text>
              <StatusText title="Carrier Operation:" data={"Interstate"} />
              <StatusText
                title="Shipper Operation:"
                data={
                  carrierOperationMap[classification?.[0]?.carrier_operation] ||
                  "None"
                }
              />
              <StatusText
                title="Hazmat Indicator:"
                data={classification?.[0]?.hm_flag === "Y" ? "Yes" : "No"}
              />
            </CardData>

            <CardData
              display="flex"
              flexDirection="column"
              flexGrow={1}
              gap="8px">
              <Text fontSize="16px" fontWeight="600" color="secondary.700">
                Classification
              </Text>
              <Box display="flex" gap="8px">
                <Box flexGrow={1}>
                  <StatusText
                    title="(A) Authorized for  Hire:"
                    data={
                      responseStatuses(classification?.[0]?.authorized_for_hire)
                        .label
                    }
                  />
                  <StatusText
                    title="(B) Exempt for  Hire:"
                    data={
                      responseStatuses(classification?.[0]?.exempt_for_hire)
                        .label
                    }
                  />
                  <StatusText
                    title="(C) Private(Property):"
                    data={
                      responseStatuses(classification?.[0]?.private_property)
                        .label
                    }
                  />
                  <StatusText
                    title="(D) Private Pass (Business):"
                    data={
                      responseStatuses(
                        classification?.[0]?.private_passenger_business
                      ).label
                    }
                  />
                  <StatusText
                    title="(E) Private Pass  (Non-Business):"
                    data={
                      responseStatuses(
                        classification?.[0]?.private_passenger_nonbusiness
                      ).label
                    }
                  />
                  <StatusText
                    title="(F) Migrant:"
                    data={responseStatuses(classification?.[0]?.migrant).label}
                  />
                </Box>
                <Box flexGrow={1}>
                  <StatusText
                    title="(G) U.S. Mail:"
                    data={responseStatuses(classification?.[0]?.us_mail).label}
                  />
                  <StatusText
                    title="(H) Federal Government:"
                    data={
                      responseStatuses(classification?.[0]?.federal_government)
                        .label
                    }
                  />
                  <StatusText
                    title="(I) State Government:"
                    data={
                      responseStatuses(classification?.[0]?.state_government)
                        .label
                    }
                  />
                  <StatusText
                    title="(J) Local Government:"
                    data={
                      responseStatuses(classification?.[0]?.local_government)
                        .label
                    }
                  />
                  <StatusText
                    title="(K) Indian Tribe:"
                    data={
                      responseStatuses(classification?.[0]?.indian_tribe).label
                    }
                  />
                </Box>
              </Box>
            </CardData>
          </Box>

          <Box mt="40px">
            <CardData>
              <Text fontSize="16px" fontWeight="600" color="secondary.700">
                Cargo Type (s)
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap="20px"
                mt="8px">
                <Box display="flex" flexDirection="column" gap="8px">
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_beverages ? "600" : "400"}>
                    Beverages
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_drybulk ? "600" : "400"}>
                    Commodities Dry Bulk
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_produce ? "600" : "400"}>
                    Fresh Produce
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_household ? "600" : "400"}>
                    Household Goods
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_logpole ? "600" : "400"}>
                    Logs, Poles, Beams, Lumber
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={
                      operation?.[0]?.crgo_mobilehome ? "600" : "400"
                    }>
                    Mobile Homes
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={
                      operation?.[0]?.crgo_passengers ? "600" : "400"
                    }>
                    Passengers
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_waterwell ? "600" : "400"}>
                    Water Well
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <Text
                    color="secondary.700"
                    fontWeight={
                      operation?.[0]?.crgo_cargoothr_desc ? "600" : "400"
                    }>
                    Other Description
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_chem ? "600" : "400"}>
                    Chemicals
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_drivetow ? "600" : "400"}>
                    Driveway/Towaway
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={
                      operation?.[0]?.crgo_genfreight ? "600" : "400"
                    }>
                    General Freight
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_liqgas ? "600" : "400"}>
                    Liquids, Gas
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_meat ? "600" : "400"}>
                    Meat
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_oilfield ? "600" : "400"}>
                    Oilfield Equipment
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_cargoothr ? "600" : "400"}>
                    Other
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_usmail ? "600" : "400"}>
                    US Mail
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_coalcoke ? "600" : "400"}>
                    Coal/Coke
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_farmsupp ? "600" : "400"}>
                    Farm Supplies
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_grainfeed ? "600" : "400"}>
                    Grain, Feed, Hay
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_livestock ? "600" : "400"}>
                    Livestock Containers
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={
                      operation?.[0]?.crgo_metalsheet ? "600" : "400"
                    }>
                    Metal, Sheets, Coils, Rolls
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_paperprod ? "600" : "400"}>
                    Paper Products
                  </Text>
                  <Text
                    color="secondary.700"
                    fontWeight={operation?.[0]?.crgo_utility ? "600" : "400"}>
                    Uitilty
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <Text color="secondary.700">Beverages</Text>
                  <Text color="secondary.700">Commodities Dry Bulk</Text>
                  <Text color="secondary.700">Fresh Produce</Text>
                  <Text color="secondary.700">Household Goods</Text>
                  <Text color="secondary.700">Logs, Poles, Beams, Lumber</Text>
                  <Text color="secondary.700">Mobile Homes</Text>
                  <Text color="secondary.700">Passengers</Text>
                  <Text color="secondary.700">Water Well</Text>
                </Box>
              </Box>
              <Text fontWeight="600" fontSize="16px" color="secondary.700">
                Other Cargo:
              </Text>
            </CardData>
          </Box>

          <Box mt="40px">
            <CardData>
              <Text
                fontSize="16px"
                fontWeight="600"
                color="secondary.700"
                mb="8px">
                Drivers
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap="20px">
                <Box display="flex" flexDirection="column" gap="8px">
                  <StatusText
                    title="Total Drivers:"
                    data={operation?.[0]?.total_drivers}
                  />
                  <StatusText
                    title="CDL Employed Drivers:"
                    data={operation?.[0]?.total_cdl}
                  />
                  <StatusText
                    title="Monthly Avarage Leased Drivers:"
                    data={operation?.[0]?.avg_drivers_leased_per_month}
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <StatusText
                    title="Interstate Drivers:"
                    data={operation?.[0]?.driver_inter_total || 0}
                  />
                  <StatusText
                    title="Interstate < 100 Miles:"
                    data={operation?.[0]?.interstate_within_100_miles || 0}
                  />
                  <StatusText
                    title="Interstate < 100 Miles:"
                    data={operation?.[0]?.interstate_beyond_100_miles || 0}
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <StatusText
                    title="Intrastate Drivers:"
                    data={operation?.[0]?.total_intrastate_drivers || 0}
                  />
                  <StatusText
                    title="Intrastate < 100 Miles:"
                    data={operation?.[0]?.intrastate_within_100_miles || 0}
                  />
                  <StatusText
                    title="Intrastate > 100 Miles:"
                    data={operation?.[0]?.intrastate_beyond_100_miles || 0}
                  />
                </Box>
              </Box>
            </CardData>
          </Box>

          <Box mt="40px">
            <CardData>
              <Text
                fontSize="16px"
                fontWeight="600"
                color="secondary.700"
                mb="8px">
                Equipment
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap="20px">
                <Box display="flex" flexDirection="column" gap="8px">
                  <StatusText
                    title="Fleet Size:"
                    data={operation?.[0]?.fleetsize}
                  />
                  <StatusText
                    title="Total Power Units:"
                    data={operation?.[0]?.power_units}
                  />
                  <StatusText
                    title="Total Trucks:"
                    data={operation?.[0]?.truck_units}
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap="8px">
                  <StatusText
                    title="Tractors Owned:"
                    data={operation?.[0]?.owntract}
                  />
                  <StatusText
                    title="Trucks Owned:"
                    data={operation?.[0]?.owntruck}
                  />
                  <StatusText
                    title="Trailers Owned:"
                    data={operation?.[0]?.owntrail}
                  />
                </Box>
              </Box>
            </CardData>
          </Box>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
